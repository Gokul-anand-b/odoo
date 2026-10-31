import uuid

from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    CUSTOMER = 'customer', 'Customer'
    VENDOR = 'vendor', 'Vendor'


class RequestStatus(models.TextChoices):
    PENDING_APPROVAL = 'pending_approval', 'Pending Approval'
    CHANGES_REQUESTED = 'changes_requested', 'Changes Requested'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'


class UserProfile(TimeStampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.CUSTOMER)


class WeddingRequest(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wedding_requests',
    )
    approved_wedding = models.OneToOneField(
        'wedding_blueprint.Wedding',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='source_request',
    )
    wedding_name = models.CharField(max_length=255)
    wedding_date = models.DateField()
    location = models.CharField(max_length=255)
    guest_count = models.PositiveIntegerField()
    theme = models.CharField(max_length=120, blank=True)
    budget = models.DecimalField(max_digits=14, decimal_places=2)
    package = models.CharField(max_length=120)
    requirements = models.TextField(blank=True)
    status = models.CharField(
        max_length=30,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING_APPROVAL,
    )
    decision_reason = models.TextField(blank=True)
    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='decided_wedding_requests',
    )
    decided_at = models.DateTimeField(null=True, blank=True)
    resubmission_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']


class RequestActivity(TimeStampedModel):
    request = models.ForeignKey(WeddingRequest, on_delete=models.CASCADE, related_name='activities')
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=80)
    detail = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
