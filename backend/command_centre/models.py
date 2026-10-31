from django.db import models
from django.utils import timezone

from common.models import TimeStampedModel


class EventRunStatus(models.TextChoices):
    UPCOMING = 'upcoming', 'Upcoming'
    IN_PROGRESS = 'in_progress', 'In progress'
    COMPLETED = 'completed', 'Completed'
    DELAYED = 'delayed', 'Delayed'


class VendorArrivalStatus(models.TextChoices):
    EXPECTED = 'expected', 'Expected'
    EN_ROUTE = 'en_route', 'En route'
    CHECKED_IN = 'checked_in', 'Checked in'
    DELAYED = 'delayed', 'Delayed'


class EventOperations(TimeStampedModel):
    event = models.OneToOneField(
        'wedding_blueprint.WeddingEvent',
        on_delete=models.CASCADE,
        related_name='operations',
    )
    status = models.CharField(
        max_length=20,
        choices=EventRunStatus.choices,
        default=EventRunStatus.UPCOMING,
    )
    actual_start = models.DateTimeField(null=True, blank=True)
    actual_end = models.DateTimeField(null=True, blank=True)
    delay_reason = models.TextField(blank=True, default='')

    def mark_started(self):
        self.status = EventRunStatus.IN_PROGRESS
        self.actual_start = timezone.now()
        self.save(update_fields=['status', 'actual_start', 'updated_at'])

    def mark_completed(self):
        self.status = EventRunStatus.COMPLETED
        self.actual_end = timezone.now()
        self.save(update_fields=['status', 'actual_end', 'updated_at'])


class WeddingVendorAssignment(TimeStampedModel):
    wedding = models.ForeignKey(
        'wedding_blueprint.Wedding',
        on_delete=models.CASCADE,
        related_name='command_centre_vendor_assignments',
    )
    vendor = models.ForeignKey(
        'vendor_intelligence.Vendor',
        on_delete=models.PROTECT,
        related_name='wedding_operations_assignments',
    )
    event = models.ForeignKey(
        'wedding_blueprint.WeddingEvent',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vendor_operations_assignments',
    )
    expected_arrival = models.DateTimeField(null=True, blank=True)
    actual_arrival = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=VendorArrivalStatus.choices,
        default=VendorArrivalStatus.EXPECTED,
    )
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['expected_arrival', 'vendor__name']
        constraints = [
            models.UniqueConstraint(
                fields=['wedding', 'vendor'],
                name='unique_command_centre_vendor_per_wedding',
            ),
        ]

    def __str__(self):
        return f'{self.vendor.name} — {self.wedding.couple_names}'
