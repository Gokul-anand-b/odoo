import uuid

from django.core.validators import MinValueValidator
from django.db import models

from wedding_blueprint.models import Wedding, WeddingEvent


class IncidentStatus(models.TextChoices):
    OPEN = 'open', 'Open'
    ANALYZED = 'analyzed', 'Analyzed'
    APPROVED = 'approved', 'Recovery Approved'
    RESOLVED = 'resolved', 'Resolved'


class RecoveryStrategy(models.TextChoices):
    MINIMUM_DISRUPTION = 'minimum_disruption', 'Minimum Disruption'
    TIME_PRESERVATION = 'time_preservation', 'Time Preservation'
    COST_OPTIMISATION = 'cost_optimisation', 'Cost Optimisation'


class Incident(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.ForeignKey(Wedding, on_delete=models.CASCADE, related_name='disruption_incidents')
    affected_event = models.ForeignKey(
        WeddingEvent, on_delete=models.SET_NULL, null=True, related_name='disruption_incidents'
    )
    title = models.CharField(max_length=200)
    incident_type = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    vendor_impact = models.CharField(max_length=200, blank=True, default='')
    delay_minutes = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    cost_per_minute = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=IncidentStatus.choices, default=IncidentStatus.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class EventDependency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.ForeignKey(Wedding, on_delete=models.CASCADE, related_name='event_dependencies')
    predecessor_event = models.ForeignKey(
        WeddingEvent, on_delete=models.CASCADE, related_name='outgoing_dependencies'
    )
    successor_event = models.ForeignKey(
        WeddingEvent, on_delete=models.CASCADE, related_name='incoming_dependencies'
    )
    minimum_gap_minutes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['predecessor_event', 'successor_event'],
                name='unique_wedding_event_dependency',
            ),
        ]


class RecoveryPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='recovery_plans')
    strategy = models.CharField(max_length=30, choices=RecoveryStrategy.choices)
    feasible = models.BooleanField(default=False)
    changed_event_count = models.PositiveIntegerField(default=0)
    estimated_additional_cost = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    impact_summary = models.JSONField(default=dict)
    validation = models.JSONField(default=dict)
    baseline_schedule = models.JSONField(default=list)
    proposed_schedule = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']


class RecoveryHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=40)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']