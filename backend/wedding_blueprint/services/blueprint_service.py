"""
High-level Blueprint Service orchestrating generation, regeneration preservation,
and approval workflows.
"""

from django.db import transaction
from django.utils import timezone
from ..models import (
    Wedding,
    WeddingBlueprint,
    BlueprintTask,
    VendorRequirement,
    ResourceRequirement,
    PaymentMilestone,
    BlueprintStatus,
    TaskStatus,
)
from .blueprint_generator import (
    WeddingTemplateRegistry,
    RuleBasedCustomisationEngine,
    DAGSchedulerEngine,
)


class BlueprintService:
    @staticmethod
    @transaction.atomic
    def generate_or_update_blueprint(wedding_id, force_regenerate=False) -> WeddingBlueprint:
        """
        Generates or updates the wedding blueprint using the 4 core intelligence algorithms.
        Critical Requirement: Preserves completed and manually edited tasks during blueprint regeneration.
        """
        wedding = Wedding.objects.get(id=wedding_id)

        # 1. Algorithm 1: Template Matching
        template, matching_score = WeddingTemplateRegistry.match(
            guest_count=wedding.guest_count,
            duration_days=wedding.duration_days,
            theme=wedding.theme,
            package=wedding.package
        )

        # Check existing blueprint
        blueprint = getattr(wedding, 'blueprint', None)
        existing_tasks_map = {}
        version = 1

        if blueprint:
            version = blueprint.version + 1
            # Index existing tasks to preserve manual edits and completed items
            for t in blueprint.tasks.all():
                existing_tasks_map[t.code] = {
                    'status': t.status,
                    'is_manually_edited': t.is_manually_edited,
                    'title': t.title,
                    'priority': t.priority,
                    'deadline': t.deadline,
                    'coordinator_role': t.coordinator_role,
                    'notes': t.notes,
                }
        else:
            blueprint = WeddingBlueprint(wedding=wedding)

        blueprint.version = version
        blueprint.status = BlueprintStatus.ACTIVE
        blueprint.template_code = template['code']
        blueprint.template_name = template['name']
        blueprint.matching_score = matching_score
        blueprint.generation_summary = {
            'guest_count': wedding.guest_count,
            'duration_days': wedding.duration_days,
            'theme': wedding.theme,
            'package': wedding.package,
            'template_used': template['name'],
            'generated_at': timezone.now().isoformat(),
        }
        blueprint.save()

        # 2. Algorithm 2: Rule-Based Customisation
        raw_tasks = RuleBasedCustomisationEngine.generate_tasks(wedding, template)

        # 3. Algorithm 3: DAG Dependency & Topological Sorting
        ordered_tasks, is_dag_valid = DAGSchedulerEngine.validate_and_sort_dag(raw_tasks)
        blueprint.dag_topological_valid = is_dag_valid
        blueprint.save(update_fields=['dag_topological_valid'])

        # 4. Algorithm 4: Priority-Based Greedy Scheduling
        scheduled_tasks = DAGSchedulerEngine.assign_greedy_deadlines(wedding, ordered_tasks)

        # Task Synchronization (Regeneration preservation)
        saved_task_codes = set()
        for task_data in scheduled_tasks:
            code = task_data['code']
            saved_task_codes.add(code)

            existing = existing_tasks_map.get(code)
            # Check preservation rule: preserve if completed or manually edited
            if existing and (existing['status'] == TaskStatus.COMPLETED or existing['is_manually_edited']):
                status = existing['status']
                title = existing['title']
                priority = existing['priority']
                deadline = existing['deadline']
                coordinator = existing['coordinator_role']
                notes = existing['notes']
                is_manually_edited = True
            else:
                status = TaskStatus.PENDING
                title = task_data['title']
                priority = task_data.get('priority', 'high')
                deadline = task_data.get('deadline')
                coordinator = task_data.get('coordinator', 'Lead Planner')
                notes = ''
                is_manually_edited = False

            BlueprintTask.objects.update_or_create(
                blueprint=blueprint,
                code=code,
                defaults={
                    'title': title,
                    'category': task_data.get('category', 'General'),
                    'phase': task_data.get('phase', 'Planning'),
                    'priority': priority,
                    'status': status,
                    'deadline': deadline,
                    'estimated_duration_days': task_data.get('duration', 3),
                    'coordinator_role': coordinator,
                    'depends_on': task_data.get('depends_on', []),
                    'is_critical_path': task_data.get('is_critical_path', False),
                    'is_manually_edited': is_manually_edited,
                    'notes': notes,
                }
            )

        # Remove obsolete tasks if regenerating (unless completed or edited)
        for existing_code, existing_info in existing_tasks_map.items():
            if existing_code not in saved_task_codes:
                if existing_info['status'] != TaskStatus.COMPLETED and not existing_info['is_manually_edited']:
                    BlueprintTask.objects.filter(blueprint=blueprint, code=existing_code).delete()

        # Generate Vendor Requirements
        vendor_reqs = RuleBasedCustomisationEngine.generate_vendor_requirements(wedding)
        # Clear existing unmanaged vendor requirements and recreate
        blueprint.vendor_requirements.all().delete()
        for vr in vendor_reqs:
            VendorRequirement.objects.create(
                blueprint=blueprint,
                category=vr['category'],
                service_name=vr['service_name'],
                headcount_capacity=vr['headcount_capacity'],
                allocated_budget=vr['allocated_budget'],
                target_booking_deadline=wedding.start_date - timezone.timedelta(days=vr['target_booking_deadline_days']),
                status=vr['status'],
                deliverables=vr['deliverables']
            )

        # Generate Resource Requirements
        resources = RuleBasedCustomisationEngine.generate_resource_requirements(wedding)
        blueprint.resource_requirements.all().delete()
        for r in resources:
            ResourceRequirement.objects.create(
                blueprint=blueprint,
                resource_name=r['resource_name'],
                quantity=r['quantity'],
                unit=r['unit'],
                importance=r['importance'],
                allocated_for_event=r['allocated_for_event']
            )

        # Generate Payment Milestones
        milestones = RuleBasedCustomisationEngine.generate_payment_milestones(wedding)
        blueprint.payment_milestones.all().delete()
        for m in milestones:
            PaymentMilestone.objects.create(
                blueprint=blueprint,
                name=m['name'],
                percentage=m['percentage'],
                amount=m['amount'],
                due_date=m['due_date'],
                description=m['description']
            )

        return blueprint

    @staticmethod
    def approve_blueprint(blueprint_id) -> WeddingBlueprint:
        """Approves the generated blueprint for execution."""
        blueprint = WeddingBlueprint.objects.get(id=blueprint_id)
        blueprint.approved_by_planner = True
        blueprint.approved_at = timezone.now()
        blueprint.status = BlueprintStatus.ACTIVE
        blueprint.save(update_fields=['approved_by_planner', 'approved_at', 'status'])
        return blueprint
