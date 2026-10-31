from django.utils import timezone
from .models import (
    WeddingEvent,
    TaskItem,
    VendorTrackingItem,
    DelayDetectionItem,
    DependencyImpactItem,
    AlertItem,
)


class CommandCentreService:
    """
    Service layer for all Command Centre business logic.
    Keeps views thin and all mutation / computation here.
    """

    # ── Dashboard Overview ──────────────────────────────────────────────────

    @staticmethod
    def get_overview_stats(wedding_name: str = None) -> dict:
        """Compute live dashboard stats from DB state."""
        events_qs = WeddingEvent.objects.all()
        if wedding_name:
            events_qs = events_qs.filter(wedding_name=wedding_name)

        total = events_qs.count()
        completed = events_qs.filter(status='Completed').count()
        ongoing = events_qs.filter(status='In Progress').count()
        upcoming = events_qs.filter(status='Upcoming').count()
        delayed = events_qs.filter(status='Delayed').count()

        alerts_qs = AlertItem.objects.filter(acknowledged=False)
        active_alerts = alerts_qs.count()

        vendors_on_site = VendorTrackingItem.objects.filter(check_in_status='Checked-In').count()
        on_time_rate = round(((total - delayed) / total) * 100, 1) if total > 0 else 100.0

        return {
            'total_events': total,
            'completed_events': completed,
            'ongoing_events': ongoing,
            'upcoming_events': upcoming,
            'delayed_events': delayed,
            'active_alerts_count': active_alerts,
            'on_time_rate_percent': on_time_rate,
            'active_vendors_on_site': vendors_on_site,
        }

    # ── Alert Actions ───────────────────────────────────────────────────────

    @staticmethod
    def acknowledge_alert(alert_id: str, coordinator: str) -> AlertItem:
        """Mark an alert as acknowledged; return the updated instance."""
        alert = AlertItem.objects.get(pk=alert_id)
        alert.acknowledged = True
        alert.acknowledged_by = coordinator
        alert.acknowledged_at = timezone.now()
        alert.save(update_fields=['acknowledged', 'acknowledged_by', 'acknowledged_at', 'updated_at'])
        return alert

    # ── Task Actions ────────────────────────────────────────────────────────

    @staticmethod
    def update_task(task_id: str, status: str, progress: int) -> TaskItem:
        """Update task status and progress; auto-zero delay when completed."""
        task = TaskItem.objects.get(pk=task_id)
        task.status = status
        task.progress_percent = progress
        if status == 'Completed':
            task.delay_minutes = 0
        task.save(update_fields=['status', 'progress_percent', 'delay_minutes', 'updated_at'])
        return task

    # ── Vendor Actions ──────────────────────────────────────────────────────

    @staticmethod
    def check_in_vendor(vendor_id: str, gate_location: str = None) -> VendorTrackingItem:
        """Check-in a vendor: record arrival time, clear delays."""
        vendor = VendorTrackingItem.objects.get(pk=vendor_id)
        now_str = timezone.now().strftime('%I:%M %p')
        vendor.check_in_status = 'Checked-In'
        vendor.actual_arrival_time = now_str
        vendor.equipment_status = 'Clear'
        vendor.delay_minutes = 0
        vendor.check_in_time = timezone.now()
        if gate_location:
            vendor.gate_location = gate_location
        vendor.save(update_fields=[
            'check_in_status', 'actual_arrival_time', 'equipment_status',
            'delay_minutes', 'check_in_time', 'gate_location', 'updated_at'
        ])
        return vendor

    # ── Delay Actions ───────────────────────────────────────────────────────

    @staticmethod
    def resolve_delay(delay_id: str, resolved_by: str = 'Operations Lead') -> DelayDetectionItem:
        """Mark a delay as Resolved."""
        delay = DelayDetectionItem.objects.get(pk=delay_id)
        delay.status = 'Resolved'
        delay.resolved_by = resolved_by
        delay.resolved_at = timezone.now()
        delay.save(update_fields=['status', 'resolved_by', 'resolved_at', 'updated_at'])
        return delay

    # ── Dependency Actions ──────────────────────────────────────────────────

    @staticmethod
    def mitigate_dependency(dep_id: str, mitigated_by: str = 'Operations Lead') -> DependencyImpactItem:
        """Mark a dependency impact as Mitigated."""
        dep = DependencyImpactItem.objects.get(pk=dep_id)
        dep.status = 'Mitigated'
        dep.mitigated_by = mitigated_by
        dep.mitigated_at = timezone.now()
        dep.save(update_fields=['status', 'mitigated_by', 'mitigated_at', 'updated_at'])
        return dep

    # ── Event Actions ───────────────────────────────────────────────────────

    @staticmethod
    def update_event_status(event_id: str, status: str, actual_start: str = None, actual_end: str = None, delay_minutes: int = None) -> WeddingEvent:
        """Update a wedding event status and optional timing data."""
        event = WeddingEvent.objects.get(pk=event_id)
        event.status = status
        if actual_start is not None:
            event.actual_start_time = actual_start
        if actual_end is not None:
            event.actual_end_time = actual_end
        if delay_minutes is not None:
            event.delay_minutes = delay_minutes
        event.save()
        return event
