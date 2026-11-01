from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RequestActivity, RequestStatus, WeddingRequest
from .permissions import IsAdminRole
from .serializers import WeddingRequestSerializer
from .supabase_auth import SupabaseAuthentication
from wedding_blueprint.models import Wedding
from wedding_blueprint.services.blueprint_service import BlueprintService
from operations.models import Agreement, AgreementStatus, Notification


def record_activity(request_obj, actor, action, detail=''):
    RequestActivity.objects.create(request=request_obj, actor=actor, action=action, detail=detail)


class WeddingRequestListCreateAPIView(APIView):
    authentication_classes = [SessionAuthentication, SupabaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = WeddingRequest.objects.select_related('customer', 'decided_by').prefetch_related('activities')
        if not request.user.is_staff:
            queryset = queryset.filter(customer=request.user)
        unique_requests = []
        seen = set()
        for wedding_request in queryset:
            key = (
                wedding_request.customer_id,
                wedding_request.wedding_name.strip().casefold(),
                wedding_request.wedding_date,
                wedding_request.location.strip().casefold(),
            )
            if key in seen:
                continue
            seen.add(key)
            unique_requests.append(wedding_request)
        return Response(WeddingRequestSerializer(
            unique_requests,
            many=True,
            context={'request': request},
        ).data)

    @transaction.atomic
    def post(self, request):
        serializer = WeddingRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        existing = WeddingRequest.objects.filter(
            customer=request.user,
            wedding_name__iexact=data['wedding_name'].strip(),
            wedding_date=data['wedding_date'],
            location__iexact=data['location'].strip(),
            status__in=[
                RequestStatus.PENDING_APPROVAL,
                RequestStatus.CHANGES_REQUESTED,
                RequestStatus.APPROVED,
            ],
        ).order_by('-created_at').first()
        if existing:
            return Response(
                WeddingRequestSerializer(existing, context={'request': request}).data,
                status=status.HTTP_200_OK,
            )
        wedding_request = serializer.save(customer=request.user)
        record_activity(wedding_request, request.user, 'submitted', 'Wedding request submitted for approval.')
        return Response(WeddingRequestSerializer(wedding_request).data, status=status.HTTP_201_CREATED)


class WeddingRequestDetailAPIView(APIView):
    authentication_classes = [SessionAuthentication, SupabaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        queryset = WeddingRequest.objects.select_related('customer', 'decided_by').prefetch_related('activities')
        if not request.user.is_staff:
            queryset = queryset.filter(customer=request.user)
        return get_object_or_404(queryset, pk=pk)

    def get(self, request, pk):
        return Response(WeddingRequestSerializer(self.get_object(request, pk)).data)

    @transaction.atomic
    def put(self, request, pk):
        wedding_request = self.get_object(request, pk)
        if wedding_request.status not in (RequestStatus.REJECTED, RequestStatus.CHANGES_REQUESTED):
            return Response(
                {'detail': 'Only rejected or change-requested applications can be resubmitted.'},
                status=status.HTTP_409_CONFLICT,
            )
        serializer = WeddingRequestSerializer(wedding_request, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        wedding_request = serializer.save(
            status=RequestStatus.PENDING_APPROVAL,
            decision_reason='',
            decided_by=None,
            decided_at=None,
            resubmission_count=wedding_request.resubmission_count + 1,
        )
        record_activity(wedding_request, request.user, 'resubmitted', 'Updated request resubmitted for approval.')
        return Response(WeddingRequestSerializer(wedding_request).data)


class WeddingRequestDecisionAPIView(APIView):
    authentication_classes = [SessionAuthentication, SupabaseAuthentication]
    permission_classes = [IsAuthenticated, IsAdminRole]

    @transaction.atomic
    def post(self, request, pk):
        wedding_request = get_object_or_404(WeddingRequest, pk=pk)
        decision = request.data.get('decision')
        reason = (request.data.get('reason') or '').strip()
        allowed = {
            'approve': RequestStatus.APPROVED,
            'reject': RequestStatus.REJECTED,
            'request_changes': RequestStatus.CHANGES_REQUESTED,
        }
        if decision not in allowed:
            return Response(
                {'detail': 'Decision must be approve, reject, or request_changes.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if decision != 'approve' and not reason:
            return Response({'detail': 'A reason is required for this decision.'}, status=status.HTTP_400_BAD_REQUEST)
        wedding_request.status = allowed[decision]
        wedding_request.decision_reason = reason
        wedding_request.decided_by = request.user
        wedding_request.decided_at = timezone.now()
        if decision == 'approve' and wedding_request.approved_wedding_id is None:
            wedding = Wedding.objects.create(
                customer=wedding_request.customer,
                title=wedding_request.wedding_name,
                couple_names=wedding_request.wedding_name,
                start_date=wedding_request.wedding_date,
                end_date=wedding_request.wedding_date,
                guest_count=wedding_request.guest_count,
                budget=wedding_request.budget,
                venue_name=wedding_request.location,
                venue_city=wedding_request.location,
                theme=wedding_request.theme or 'plum_antique_gold',
                package=wedding_request.package or 'gold_signature',
                notes=wedding_request.requirements,
            )
            BlueprintService.generate_or_update_blueprint(wedding_id=wedding.id)
            wedding_request.approved_wedding = wedding
            Agreement.objects.create(
                customer=wedding_request.customer,
                wedding_request=wedding_request,
                title=f'{wedding_request.wedding_name} service agreement',
                content='Your service agreement is ready for review and signature.',
                status=AgreementStatus.SENT,
            )
        wedding_request.save(update_fields=[
            'status', 'decision_reason', 'decided_by', 'decided_at',
            'approved_wedding', 'updated_at',
        ])
        record_activity(wedding_request, request.user, decision, reason)
        decision_labels = {
            'approve': ('Wedding request approved', 'Your wedding request has been approved. Your private blueprint and agreement are now available.'),
            'reject': ('Wedding request rejected', f'Your wedding request was rejected. Reason: {reason}'),
            'request_changes': ('Changes requested for your wedding request', f'Please update and resubmit your wedding request. Reason: {reason}'),
        }
        title, message = decision_labels[decision]
        Notification.objects.create(recipient=wedding_request.customer, title=title, message=message)
        return Response(WeddingRequestSerializer(wedding_request).data)
