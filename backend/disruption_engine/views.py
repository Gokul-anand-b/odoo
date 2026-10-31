from datetime import datetime

from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.utils import error_response, success_response
from wedding_blueprint.models import Wedding, WeddingEvent
from .models import EventDependency, Incident, IncidentStatus, RecoveryHistory, RecoveryPlan
from .serializers import (
    EventDependencySerializer,
    EventSummarySerializer,
    IncidentSerializer,
    RecoveryHistorySerializer,
    RecoveryPlanSerializer,
    WeddingSummarySerializer,
)
from .services.dependency_graph_engine import topological_event_order
from .services.disruption_analyzer import analyze_disruption


def _record_history(incident, action, message, **details):
    return RecoveryHistory.objects.create(
        incident=incident,
        action=action,
        details={'message': message, **details},
    )


class DisruptionWeddingListAPIView(APIView):
    def get(self, request):
        weddings = Wedding.objects.filter(is_deleted=False).prefetch_related('events')
        return success_response(
            data=WeddingSummarySerializer(weddings, many=True).data,
            message='Weddings retrieved successfully',
        )


class IncidentListCreateAPIView(APIView):
    def get(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        incidents = Incident.objects.filter(wedding=wedding).select_related('affected_event')
        return success_response(
            data=IncidentSerializer(incidents, many=True).data,
            message='Incidents retrieved successfully',
        )

    def post(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        serializer = IncidentSerializer(data=request.data, context={'wedding': wedding})
        if not serializer.is_valid():
            return error_response(
                message='Incident validation failed',
                errors=serializer.errors,
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        incident = serializer.save(wedding=wedding)
        _record_history(incident, 'incident_created', 'Incident created and logged.')
        return success_response(
            data=IncidentSerializer(incident).data,
            message='Incident created successfully',
            status_code=status.HTTP_201_CREATED,
        )


class IncidentAnalyzeAPIView(APIView):
    def post(self, request, incident_id):
        incident = get_object_or_404(
            Incident.objects.select_related('wedding', 'affected_event'), id=incident_id
        )
        try:
            generated = analyze_disruption(incident)
        except ValueError as exc:
            return error_response(
                message='Could not analyze incident',
                errors={'detail': str(exc)},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        with transaction.atomic():
            plans = [
                RecoveryPlan.objects.create(incident=incident, **plan)
                for plan in generated
            ]
            incident.status = IncidentStatus.ANALYZED
            incident.save(update_fields=['status', 'updated_at'])
            _record_history(
                incident,
                'analysis_completed',
                f'Generated {len(plans)} deterministic recovery strategies.',
                plan_ids=[str(plan.id) for plan in plans],
            )
        return success_response(
            data={
                'incident': IncidentSerializer(incident).data,
                'plans': RecoveryPlanSerializer(plans, many=True).data,
            },
            message='Recovery strategies generated and validated',
        )


class IncidentApproveAPIView(APIView):
    def post(self, request, incident_id):
        incident = get_object_or_404(
            Incident.objects.select_related('wedding'),
            id=incident_id,
        )
        plan_id = request.data.get('recovery_plan_id')
        if not plan_id:
            return error_response(message='recovery_plan_id is required.')
        plan = get_object_or_404(RecoveryPlan, id=plan_id, incident=incident)
        if not plan.feasible or not plan.validation.get('valid'):
            return error_response(
                message='This recovery plan failed validation and cannot be approved.',
                errors={'validation': plan.validation.get('errors', [])},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        with transaction.atomic():
            for entry in plan.proposed_schedule:
                event = get_object_or_404(
                    WeddingEvent, id=entry['event_id'], wedding=incident.wedding
                )
                start = datetime.fromisoformat(entry['proposed_start'])
                end = datetime.fromisoformat(entry['proposed_end'])
                event.date = start.date()
                event.start_time = start.time()
                event.end_time = end.time()
                event.save(update_fields=['date', 'start_time', 'end_time', 'updated_at'])
            incident.status = IncidentStatus.APPROVED
            incident.save(update_fields=['status', 'updated_at'])
            _record_history(
                incident,
                'recovery_approved',
                f'{plan.get_strategy_display()} approved; proposed schedule applied.',
                recovery_plan_id=str(plan.id),
                before=plan.baseline_schedule,
                after=plan.proposed_schedule,
            )
        return success_response(
            data=IncidentSerializer(incident).data,
            message='Recovery plan approved and applied to the wedding schedule.',
        )


class IncidentResolveAPIView(APIView):
    def post(self, request, incident_id):
        incident = get_object_or_404(Incident, id=incident_id)
        if incident.status != IncidentStatus.APPROVED:
            return error_response(message='Approve a feasible recovery plan before resolving this incident.')
        incident.status = IncidentStatus.RESOLVED
        incident.save(update_fields=['status', 'updated_at'])
        _record_history(incident, 'incident_resolved', 'Incident marked as resolved.')
        return success_response(
            data=IncidentSerializer(incident).data,
            message='Incident resolved successfully.',
        )


class IncidentHistoryAPIView(APIView):
    def get(self, request, incident_id):
        incident = get_object_or_404(Incident, id=incident_id)
        history = incident.history.all()
        return success_response(data=RecoveryHistorySerializer(history, many=True).data)


class WeddingDependencyListCreateAPIView(APIView):
    def get(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        dependencies = EventDependency.objects.filter(wedding=wedding)
        return success_response(data=EventDependencySerializer(dependencies, many=True).data)

    def post(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        serializer = EventDependencySerializer(
            data=request.data, context={'wedding': wedding}
        )
        if not serializer.is_valid():
            return error_response(
                message='Dependency validation failed',
                errors=serializer.errors,
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        try:
            with transaction.atomic():
                dependency = serializer.save(wedding=wedding)
                events = list(wedding.events.all())
                if topological_event_order(events, list(wedding.event_dependencies.all())) is None:
                    raise ValueError('Dependency would create a cycle in the event graph.')
        except IntegrityError:
            return error_response(
                message='That event dependency already exists.',
                status_code=status.HTTP_409_CONFLICT,
            )
        except ValueError as exc:
            return error_response(
                message=str(exc),
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        return success_response(
            data=EventDependencySerializer(dependency).data,
            message='Event dependency created.',
            status_code=status.HTTP_201_CREATED,
        )


class WeddingEventRecoveryRuleAPIView(APIView):
    def put(self, request, wedding_id, event_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        event = get_object_or_404(WeddingEvent, id=event_id, wedding=wedding)
        fixed_time = request.data.get('is_fixed_time')
        move_cost = request.data.get('recovery_move_cost')
        if not isinstance(fixed_time, bool):
            return error_response(
                message='is_fixed_time must be a boolean.',
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        try:
            from decimal import Decimal, InvalidOperation
            move_cost = Decimal(str(move_cost))
            if not move_cost.is_finite() or move_cost < 0:
                raise InvalidOperation
        except (InvalidOperation, TypeError):
            return error_response(
                message='recovery_move_cost must be a non-negative number.',
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        event.is_fixed_time = fixed_time
        event.recovery_move_cost = move_cost
        event.save(update_fields=['is_fixed_time', 'recovery_move_cost', 'updated_at'])
        return success_response(
            data=EventSummarySerializer(event).data,
            message='Event recovery rules updated.',
        )