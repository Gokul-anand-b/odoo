from django.contrib import admin
from .models import (
    WeddingEvent,
    TaskItem,
    VendorTrackingItem,
    DelayDetectionItem,
    DependencyImpactItem,
    AlertItem,
)


@admin.register(WeddingEvent)
class WeddingEventAdmin(admin.ModelAdmin):
    list_display = ['name', 'ceremony_type', 'status', 'scheduled_start_time', 'delay_minutes', 'lead_coordinator']
    list_filter = ['status', 'ceremony_type']
    search_fields = ['name', 'venue_location', 'lead_coordinator']
    ordering = ['scheduled_start_time']


@admin.register(TaskItem)
class TaskItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority', 'progress_percent', 'assigned_to', 'delay_minutes']
    list_filter = ['status', 'priority', 'category']
    search_fields = ['title', 'assigned_to']
    ordering = ['scheduled_start', 'priority']


@admin.register(VendorTrackingItem)
class VendorTrackingAdmin(admin.ModelAdmin):
    list_display = ['vendor_name', 'service_category', 'check_in_status', 'expected_arrival_time', 'delay_minutes']
    list_filter = ['check_in_status', 'equipment_status']
    search_fields = ['vendor_name', 'contact_person']


@admin.register(DelayDetectionItem)
class DelayDetectionAdmin(admin.ModelAdmin):
    list_display = ['entity_name', 'source_type', 'severity', 'delay_minutes', 'cascading_risk_level', 'status']
    list_filter = ['status', 'severity', 'source_type', 'cascading_risk_level']
    search_fields = ['entity_name', 'root_cause']


@admin.register(DependencyImpactItem)
class DependencyImpactAdmin(admin.ModelAdmin):
    list_display = ['bottleneck_name', 'affected_activity', 'cascading_risk', 'projected_slip_minutes', 'status']
    list_filter = ['status', 'cascading_risk', 'bottleneck_type']
    search_fields = ['bottleneck_name', 'affected_activity']


@admin.register(AlertItem)
class AlertItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'severity', 'category', 'acknowledged', 'acknowledged_by', 'action_required']
    list_filter = ['severity', 'category', 'acknowledged', 'action_required']
    search_fields = ['title', 'description']
