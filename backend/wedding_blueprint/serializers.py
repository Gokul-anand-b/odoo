from rest_framework import serializers
from .models import (
    Wedding,
    WeddingEvent,
    WeddingBlueprint,
    BlueprintTask,
    VendorRequirement,
    ResourceRequirement,
    PaymentMilestone,
)


class WeddingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeddingEvent
        fields = [
            'id', 'wedding', 'name', 'event_order', 'date',
            'start_time', 'end_time', 'venue_space', 'expected_guests',
            'dress_code', 'coordinator_name', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BlueprintTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlueprintTask
        fields = [
            'id', 'blueprint', 'code', 'title', 'description', 'category',
            'phase', 'priority', 'status', 'deadline', 'estimated_duration_days',
            'coordinator_role', 'depends_on', 'is_critical_path', 'is_custom',
            'is_manually_edited', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VendorRequirementSerializer(serializers.ModelSerializer):
    wedding_id = serializers.UUIDField(source='blueprint.wedding_id', read_only=True)
    wedding_title = serializers.CharField(source='blueprint.wedding.title', read_only=True)
    couple_names = serializers.CharField(source='blueprint.wedding.couple_names', read_only=True)

    class Meta:
        model = VendorRequirement
        fields = [
            'id', 'blueprint', 'wedding_id', 'wedding_title', 'couple_names',
            'category', 'service_name', 'headcount_capacity', 'allocated_budget',
            'target_booking_deadline', 'status', 'deliverables', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ResourceRequirementSerializer(serializers.ModelSerializer):
    wedding_id = serializers.UUIDField(source='blueprint.wedding_id', read_only=True)
    wedding_title = serializers.CharField(source='blueprint.wedding.title', read_only=True)
    couple_names = serializers.CharField(source='blueprint.wedding.couple_names', read_only=True)

    class Meta:
        model = ResourceRequirement
        fields = [
            'id', 'blueprint', 'wedding_id', 'wedding_title', 'couple_names',
            'resource_name', 'quantity', 'unit', 'allocated_for_event',
            'importance', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PaymentMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMilestone
        fields = [
            'id', 'blueprint', 'name', 'percentage', 'amount',
            'due_date', 'status', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class WeddingBlueprintSerializer(serializers.ModelSerializer):
    tasks = BlueprintTaskSerializer(many=True, read_only=True)
    vendor_requirements = VendorRequirementSerializer(many=True, read_only=True)
    resource_requirements = ResourceRequirementSerializer(many=True, read_only=True)
    payment_milestones = PaymentMilestoneSerializer(many=True, read_only=True)
    wedding_title = serializers.CharField(source='wedding.title', read_only=True)
    couple_names = serializers.CharField(source='wedding.couple_names', read_only=True)

    class Meta:
        model = WeddingBlueprint
        fields = [
            'id', 'wedding', 'wedding_title', 'couple_names', 'version',
            'status', 'template_code', 'template_name', 'matching_score',
            'dag_topological_valid', 'generation_summary', 'approved_by_planner',
            'approved_at', 'tasks', 'vendor_requirements', 'resource_requirements',
            'payment_milestones', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class WeddingSerializer(serializers.ModelSerializer):
    events = WeddingEventSerializer(many=True, read_only=True)
    blueprint = WeddingBlueprintSerializer(read_only=True)

    class Meta:
        model = Wedding
        fields = [
            'id', 'customer', 'title', 'couple_names', 'start_date', 'end_date',
            'duration_days', 'guest_count', 'budget', 'venue_name',
            'venue_city', 'theme', 'package', 'selected_services',
            'notes', 'events', 'blueprint', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']

    def validate(self, data):
        start = data.get('start_date')
        end = data.get('end_date')
        if start and end and end < start:
            raise serializers.ValidationError({"end_date": "End date cannot be earlier than start date."})
        return data


class WeddingCreateWithEventsSerializer(serializers.ModelSerializer):
    events = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )

    class Meta:
        model = Wedding
        fields = [
            'id', 'title', 'couple_names', 'start_date', 'end_date',
            'duration_days', 'guest_count', 'budget', 'venue_name',
            'venue_city', 'theme', 'package', 'selected_services',
            'notes', 'events'
        ]
