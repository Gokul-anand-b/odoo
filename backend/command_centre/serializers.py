from rest_framework import serializers
from .models import (
    WeddingEvent,
    TaskItem,
    VendorTrackingItem,
    DelayDetectionItem,
    DependencyImpactItem,
    AlertItem,
)


class WeddingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeddingEvent
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskItemSerializer(serializers.ModelSerializer):
    event_id = serializers.CharField(source='event.id', read_only=True, default=None)

    class Meta:
        model = TaskItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class VendorTrackingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorTrackingItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class DelayDetectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DelayDetectionItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class DependencyImpactItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DependencyImpactItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AlertItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class DashboardOverviewSerializer(serializers.Serializer):
    """Computed dashboard overview stats — not a model, derived dynamically."""
    total_events = serializers.IntegerField()
    completed_events = serializers.IntegerField()
    ongoing_events = serializers.IntegerField()
    upcoming_events = serializers.IntegerField()
    delayed_events = serializers.IntegerField()
    active_alerts_count = serializers.IntegerField()
    on_time_rate_percent = serializers.FloatField()
    active_vendors_on_site = serializers.IntegerField()
