from rest_framework import serializers

from wedding_blueprint.models import WeddingEvent
from .models import EventDependency, Incident, RecoveryHistory, RecoveryPlan


class EventSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeddingEvent
        fields = [
            'id', 'name', 'event_order', 'date', 'start_time', 'end_time',
            'venue_space', 'expected_guests', 'is_fixed_time', 'recovery_move_cost',
        ]


class WeddingSummarySerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField()
    couple_names = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    events = EventSummarySerializer(many=True)


class IncidentSerializer(serializers.ModelSerializer):
    wedding_id = serializers.UUIDField(read_only=True)
    affected_event_name = serializers.CharField(source='affected_event.name', read_only=True)

    class Meta:
        model = Incident
        fields = [
            'id', 'wedding_id', 'title', 'incident_type', 'description',
            'affected_event', 'affected_event_name', 'vendor_impact', 'delay_minutes',
            'cost_per_minute', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'wedding_id', 'status', 'created_at', 'updated_at']

    def validate_affected_event(self, event):
        wedding = self.context.get('wedding')
        if wedding and event.wedding_id != wedding.id:
            raise serializers.ValidationError('Affected event must belong to this wedding.')
        return event

    def validate_delay_minutes(self, value):
        if value < 1:
            raise serializers.ValidationError('Delay must be at least one minute.')
        return value


class RecoveryPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryPlan
        fields = [
            'id', 'strategy', 'feasible', 'changed_event_count',
            'estimated_additional_cost', 'impact_summary', 'validation',
            'baseline_schedule', 'proposed_schedule', 'created_at',
        ]


class RecoveryHistorySerializer(serializers.ModelSerializer):
    message = serializers.CharField(source='details.message', read_only=True)
    recovery_plan_id = serializers.SerializerMethodField()

    def get_recovery_plan_id(self, instance):
        return instance.details.get('recovery_plan_id')

    class Meta:
        model = RecoveryHistory
        fields = ['id', 'action', 'message', 'recovery_plan_id', 'details', 'created_at']


class EventDependencySerializer(serializers.ModelSerializer):
    predecessor_event = serializers.PrimaryKeyRelatedField(queryset=WeddingEvent.objects.all())
    successor_event = serializers.PrimaryKeyRelatedField(queryset=WeddingEvent.objects.all())

    class Meta:
        model = EventDependency
        fields = ['id', 'predecessor_event', 'successor_event', 'minimum_gap_minutes']
        read_only_fields = ['id']

    def validate(self, attrs):
        wedding = self.context['wedding']
        predecessor = attrs['predecessor_event']
        successor = attrs['successor_event']
        if predecessor.wedding_id != wedding.id or successor.wedding_id != wedding.id:
            raise serializers.ValidationError('Both events must belong to the selected wedding.')
        if predecessor.id == successor.id:
            raise serializers.ValidationError('An event cannot depend on itself.')
        return attrs