from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


class AgreementStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    SENT = 'sent', 'Sent'
    SIGNED = 'signed', 'Signed'
    DECLINED = 'declined', 'Declined'


class Agreement(TimeStampedModel):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_agreements')
    wedding_request = models.ForeignKey(
        'client_management.WeddingRequest',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='agreements',
    )
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='vendor_agreements')
    title = models.CharField(max_length=255)
    content = models.TextField()
    status = models.CharField(max_length=20, choices=AgreementStatus.choices, default=AgreementStatus.DRAFT)
    document = models.FileField(upload_to='agreements/%Y/%m/', null=True, blank=True)
    customer_signed_at = models.DateTimeField(null=True, blank=True)
    vendor_signed_at = models.DateTimeField(null=True, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)


class PaymentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PAID = 'paid', 'Paid'
    FAILED = 'failed', 'Failed'
    REFUNDED = 'refunded', 'Refunded'


class Payment(TimeStampedModel):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_payments')
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='vendor_payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255)
    payment_type = models.CharField(max_length=20, choices=(('client', 'Client'), ('vendor', 'Vendor')),
                                     default='client')
    payment_stage = models.CharField(
        max_length=20,
        choices=(('booking', 'Booking'), ('advance', 'Advance'), ('final', 'Final'), ('settlement', 'Settlement')),
        default='booking',
    )
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    paid_at = models.DateTimeField(null=True, blank=True)


class VendorInvoice(TimeStampedModel):
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_invoices')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_invoices')
    invoice_number = models.CharField(max_length=80, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    notes = models.TextField(blank=True)


class Guest(TimeStampedModel):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='guests')
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    invitation_status = models.CharField(max_length=20, choices=(('invited', 'Invited'), ('confirmed', 'Confirmed'),
                                                                  ('declined', 'Declined')), default='invited')


class RSVP(TimeStampedModel):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name='rsvps')
    event_name = models.CharField(max_length=255)
    response = models.CharField(max_length=20, choices=(('pending', 'Pending'), ('yes', 'Yes'), ('no', 'No')),
                                default='pending')
    responded_at = models.DateTimeField(null=True, blank=True)
    plus_ones = models.PositiveIntegerField(default=0)


class VendorAssignment(TimeStampedModel):
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assignments')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_assignments')
    service = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=(('assigned', 'Assigned'), ('accepted', 'Accepted'),
                                                       ('in_progress', 'In progress'), ('completed', 'Completed'),
                                                       ('cancelled', 'Cancelled')), default='assigned')
    issue = models.TextField(blank=True)


class Document(TimeStampedModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=80, default='other')
    file_url = models.URLField(max_length=500)
    description = models.TextField(blank=True)


class Notification(TimeStampedModel):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    read_at = models.DateTimeField(null=True, blank=True)
