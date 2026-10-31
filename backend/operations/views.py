from rest_framework import permissions, viewsets
from django.utils import timezone
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Sum

from .models import Agreement, Document, Guest, Notification, Payment, RSVP, VendorAssignment, VendorInvoice
from .permissions import IsAdminOrParticipant, IsCustomerOrAdmin, IsOwnerOrStaff, IsVendorOrAdmin
from .serializers import (AgreementSerializer, DocumentSerializer, GuestSerializer, NotificationSerializer,
                           PaymentSerializer, RSVPSerializer, VendorAssignmentSerializer, VendorInvoiceSerializer)


class OwnedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    owner_field = None

    def get_queryset(self):
        queryset = self.queryset
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(**{self.owner_field: self.request.user})

    def perform_create(self, serializer):
        if self.owner_field:
            serializer.save(**{self.owner_field: self.request.user})
        else:
            serializer.save()


class AgreementViewSet(OwnedModelViewSet):
    queryset = Agreement.objects.all()
    serializer_class = AgreementSerializer
    owner_field = 'customer'

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(customer=self.request.user) | self.queryset.filter(vendor=self.request.user)


class PaymentViewSet(OwnedModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    owner_field = 'customer'

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(customer=self.request.user) | self.queryset.filter(vendor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def mark_paid(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'paid'
        payment.paid_at = timezone.now()
        payment.save(update_fields=['status', 'paid_at', 'updated_at'])
        return Response(self.get_serializer(payment).data)


class VendorInvoiceViewSet(OwnedModelViewSet):
    queryset = VendorInvoice.objects.all()
    serializer_class = VendorInvoiceSerializer
    owner_field = 'customer'

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(customer=self.request.user) | self.queryset.filter(vendor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.save(update_fields=['status', 'updated_at'])
        return Response(self.get_serializer(invoice).data)


class GuestViewSet(OwnedModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    owner_field = 'customer'
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrAdmin]


class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.select_related('guest')
    serializer_class = RSVPSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(guest__customer=self.request.user)


class VendorAssignmentViewSet(viewsets.ModelViewSet):
    queryset = VendorAssignment.objects.all()
    serializer_class = VendorAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrParticipant]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(vendor=self.request.user) | self.queryset.filter(customer=self.request.user)

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied('Only an admin can create vendor assignments.')
        serializer.save()


class DocumentViewSet(OwnedModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    owner_field = 'owner'


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    owner_field = 'recipient'


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def reports(request):
    if not request.user.is_staff:
        payments = Payment.objects.filter(customer=request.user)
        assignments = VendorAssignment.objects.filter(customer=request.user)
        guests = Guest.objects.all()
    else:
        payments, assignments, guests = Payment.objects.all(), VendorAssignment.objects.all(), Guest.objects.all()
    return Response({
        'payments': {'count': payments.count(), 'total': payments.aggregate(total=Sum('amount'))['total'] or 0},
        'assignments_by_status': list(assignments.values('status').annotate(count=Count('id'))),
        'guest_count': guests.count(),
        'rsvp_count': RSVP.objects.count(),
    })
