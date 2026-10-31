from django.contrib import admin

from .models import EventOperations, WeddingVendorAssignment


@admin.register(EventOperations)
class EventOperationsAdmin(admin.ModelAdmin):
    list_display = ['event', 'status', 'actual_start', 'actual_end', 'updated_at']
    list_filter = ['status']
    search_fields = ['event__name', 'event__wedding__couple_names']


@admin.register(WeddingVendorAssignment)
class WeddingVendorAssignmentAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'wedding', 'event', 'status', 'expected_arrival', 'actual_arrival']
    list_filter = ['status']
    search_fields = ['vendor__name', 'wedding__couple_names']
