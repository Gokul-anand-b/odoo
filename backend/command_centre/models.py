import uuid
from django.db import models
from django.utils import timezone


# ─────────────────────────────────────────────
#  Choice Enums
# ─────────────────────────────────────────────

class EventStatus(models.TextChoices):
    UPCOMING = 'Upcoming', 'Upcoming'
    IN_PROGRESS = 'In Progress', 'In Progress'
    COMPLETED = 'Completed', 'Completed'
    DELAYED = 'Delayed', 'Delayed'
    WARNING = 'Warning', 'Warning'


class CeremonyType(models.TextChoices):
    MEHENDI = 'Mehendi', 'Mehendi'
    SANGEET = 'Sangeet', 'Sangeet'
    BARAAT = 'Baraat', 'Baraat'
    VARMALA = 'Varmala', 'Varmala'
    PHERAS = 'Pheras', 'Pheras'
    RECEPTION = 'Reception', 'Reception'
    HALDI = 'Haldi', 'Haldi'


class TaskStatus(models.TextChoices):
    PENDING = 'Pending', 'Pending'
    ONGOING = 'Ongoing', 'Ongoing'
    COMPLETED = 'Completed', 'Completed'
    DELAYED = 'Delayed', 'Delayed'


class PriorityLevel(models.TextChoices):
    LOW = 'Low', 'Low'
    MEDIUM = 'Medium', 'Medium'
    HIGH = 'High', 'High'
    CRITICAL = 'Critical', 'Critical'


class TaskCategory(models.TextChoices):
    DECOR = 'Decor & Mandap', 'Decor & Mandap'
    CATERING = 'Catering', 'Catering'
    SOUND = 'Sound & Light', 'Sound & Light'
    LOGISTICS = 'Logistics', 'Logistics'
    STYLING = 'Styling', 'Styling'
    SECURITY = 'Security', 'Security'


class CheckInStatus(models.TextChoices):
    CHECKED_IN = 'Checked-In', 'Checked-In'
    EN_ROUTE = 'En Route', 'En Route'
    DELAYED = 'Delayed', 'Delayed'
    PENDING = 'Pending', 'Pending'


class EquipmentStatus(models.TextChoices):
    CLEAR = 'Clear', 'Clear'
    PENDING = 'Pending Inspection', 'Pending Inspection'
    OFFLOADING = 'Offloading', 'Offloading'


class DelaySourceType(models.TextChoices):
    VENDOR = 'Vendor', 'Vendor'
    TASK = 'Task', 'Task'
    EVENT = 'Event', 'Event'
    LOGISTICS = 'Logistics', 'Logistics'
    WEATHER = 'Weather', 'Weather'


class CascadingRisk(models.TextChoices):
    MODERATE = 'Moderate', 'Moderate'
    HIGH = 'High', 'High'
    SEVERE = 'Severe', 'Severe'


class DelayStatus(models.TextChoices):
    ACTIVE = 'Active', 'Active'
    MITIGATING = 'Mitigating', 'Mitigating'
    RESOLVED = 'Resolved', 'Resolved'


class DependencyStatus(models.TextChoices):
    OPEN = 'Open', 'Open'
    MITIGATED = 'Mitigated', 'Mitigated'


class AlertSeverity(models.TextChoices):
    LOW = 'Low', 'Low'
    MEDIUM = 'Medium', 'Medium'
    HIGH = 'High', 'High'
    CRITICAL = 'Critical', 'Critical'


class AlertCategory(models.TextChoices):
    SCHEDULE_DELAY = 'Schedule Delay', 'Schedule Delay'
    VENDOR_LATE = 'Vendor Late', 'Vendor Late'
    CAPACITY_POWER = 'Capacity & Power', 'Capacity & Power'
    PROTOCOL_VIP = 'Protocol & VIP', 'Protocol & VIP'


class BottleneckType(models.TextChoices):
    VENDOR = 'Vendor', 'Vendor'
    TASK = 'Task', 'Task'


# ─────────────────────────────────────────────
#  Wedding Event Model
# ─────────────────────────────────────────────

class WeddingEvent(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    ceremony_type = models.CharField(max_length=32, choices=CeremonyType.choices)
    venue_location = models.CharField(max_length=255)
    scheduled_start_time = models.CharField(max_length=32)
    scheduled_end_time = models.CharField(max_length=32)
    actual_start_time = models.CharField(max_length=32, blank=True)
    actual_end_time = models.CharField(max_length=32, blank=True)
    status = models.CharField(max_length=32, choices=EventStatus.choices, default=EventStatus.UPCOMING)
    delay_minutes = models.IntegerField(default=0)
    guest_count = models.IntegerField(default=0)
    lead_coordinator = models.CharField(max_length=128)
    key_vendors = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True)
    wedding_name = models.CharField(max_length=255, default='Samar & Alizeh Royal Wedding')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_start_time']

    def __str__(self):
        return f"{self.name} ({self.status})"


# ─────────────────────────────────────────────
#  Task Item Model
# ─────────────────────────────────────────────

class TaskItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    event = models.ForeignKey(
        WeddingEvent, on_delete=models.CASCADE, related_name='tasks',
        null=True, blank=True
    )
    event_name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=64, choices=TaskCategory.choices)
    assigned_to = models.CharField(max_length=128)
    assigned_role = models.CharField(max_length=128, blank=True)
    scheduled_start = models.CharField(max_length=32)
    scheduled_end = models.CharField(max_length=32)
    progress_percent = models.IntegerField(default=0)
    status = models.CharField(max_length=32, choices=TaskStatus.choices, default=TaskStatus.PENDING)
    priority = models.CharField(max_length=16, choices=PriorityLevel.choices, default=PriorityLevel.MEDIUM)
    delay_minutes = models.IntegerField(default=0)
    dependent_task_ids = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_start', 'priority']

    def __str__(self):
        return f"{self.title} [{self.status}]"


# ─────────────────────────────────────────────
#  Vendor Tracking Item Model
# ─────────────────────────────────────────────

class VendorTrackingItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    vendor_name = models.CharField(max_length=255)
    service_category = models.CharField(max_length=128)
    contact_person = models.CharField(max_length=128)
    phone = models.CharField(max_length=32, blank=True)
    assigned_event = models.CharField(max_length=255, blank=True)
    expected_arrival_time = models.CharField(max_length=32)
    actual_arrival_time = models.CharField(max_length=32, blank=True)
    check_in_status = models.CharField(max_length=32, choices=CheckInStatus.choices, default=CheckInStatus.PENDING)
    gate_location = models.CharField(max_length=128, blank=True)
    poc_coordinator = models.CharField(max_length=128, blank=True)
    delay_minutes = models.IntegerField(default=0)
    equipment_status = models.CharField(
        max_length=32, choices=EquipmentStatus.choices,
        default=EquipmentStatus.PENDING, blank=True
    )
    check_in_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['expected_arrival_time']

    def __str__(self):
        return f"{self.vendor_name} [{self.check_in_status}]"


# ─────────────────────────────────────────────
#  Delay Detection Item Model
# ─────────────────────────────────────────────

class DelayDetectionItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    source_type = models.CharField(max_length=32, choices=DelaySourceType.choices)
    entity_name = models.CharField(max_length=255)
    delay_minutes = models.IntegerField(default=0)
    severity = models.CharField(max_length=16, choices=PriorityLevel.choices)
    root_cause = models.TextField()
    detected_at = models.CharField(max_length=32)
    impact_summary = models.TextField()
    cascading_risk_level = models.CharField(max_length=16, choices=CascadingRisk.choices)
    status = models.CharField(max_length=16, choices=DelayStatus.choices, default=DelayStatus.ACTIVE)
    resolved_by = models.CharField(max_length=128, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-delay_minutes']

    def __str__(self):
        return f"{self.entity_name} (+{self.delay_minutes}m) [{self.status}]"


# ─────────────────────────────────────────────
#  Dependency Impact Item Model
# ─────────────────────────────────────────────

class DependencyImpactItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    bottleneck_id = models.CharField(max_length=64)
    bottleneck_name = models.CharField(max_length=255)
    bottleneck_type = models.CharField(max_length=16, choices=BottleneckType.choices)
    affected_activity = models.CharField(max_length=255)
    scheduled_time = models.CharField(max_length=32)
    projected_slip_minutes = models.IntegerField(default=0)
    cascading_risk = models.CharField(max_length=16, choices=[
        ('Low', 'Low'), ('Moderate', 'Moderate'), ('High', 'High'), ('Severe', 'Severe')
    ])
    suggested_action = models.TextField()
    status = models.CharField(max_length=16, choices=DependencyStatus.choices, default=DependencyStatus.OPEN)
    mitigated_by = models.CharField(max_length=128, blank=True)
    mitigated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-projected_slip_minutes']

    def __str__(self):
        return f"{self.bottleneck_name} → {self.affected_activity} [{self.cascading_risk}]"


# ─────────────────────────────────────────────
#  Alert Item Model
# ─────────────────────────────────────────────

class AlertItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=16, choices=AlertSeverity.choices)
    category = models.CharField(max_length=32, choices=AlertCategory.choices)
    timestamp = models.CharField(max_length=64)
    acknowledged = models.BooleanField(default=False)
    acknowledged_by = models.CharField(max_length=128, blank=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    action_required = models.BooleanField(default=False)
    action_label = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.severity}] {self.title}"
