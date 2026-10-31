from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView

from common.utils import error_response, success_response
from vendor_intelligence.models import Vendor
from vendor_intelligence.serializers import VendorSerializer
from wedding_blueprint.models import BlueprintTask, Wedding, WeddingEvent
from wedding_blueprint.serializers import BlueprintTaskSerializer

from .models import EventOperations, EventRunStatus, VendorArrivalStatus, WeddingVendorAssignment
from .serializers import EventOperationsSerializer, VendorAssignmentSerializer
from .services import get_dashboard


class CommandCentreDashboardAPIView(APIView):
    def get(self, _request, wedding_id):
        dashboard = get_dashboard(wedding_id)
        if dashboard is None:
            return error_response('Wedding not found.', status_code=status.HTTP_404_NOT_FOUND)
        return success_response(data=dashboard, message='Operations dashboard retrieved.')


class CommandCentreVendorAPIView(APIView):
    def get(self, _request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        assigned_ids = WeddingVendorAssignment.objects.filter(
            wedding=wedding
        ).values_list('vendor_id', flat=True)
        vendors = Vendor.objects.exclude(id__in=assigned_ids).order_by('name')
        return success_response(
            data=VendorSerializer(vendors, many=True).data,
            message='Available vendors retrieved.',
        )

    def post(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        serializer = VendorAssignmentSerializer(
            data=request.data,
            context={'wedding': wedding},
        )
        if not serializer.is_valid():
            return error_response(
                'Vendor assignment validation failed.',
                errors=serializer.errors,
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        assignment = serializer.save(wedding=wedding)
        return success_response(
            data=VendorAssignmentSerializer(
                assignment, context={'wedding': wedding}
            ).data,
            message='Vendor assigned to this wedding.',
            status_code=status.HTTP_201_CREATED,
        )


class CommandCentreVendorDetailAPIView(APIView):
    def patch(self, request, wedding_id, assignment_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        assignment = get_object_or_404(
            WeddingVendorAssignment, id=assignment_id, wedding=wedding
        )
        status_value = request.data.get('status')
        if status_value not in VendorArrivalStatus.values:
            return error_response(
                'Provide a valid vendor arrival status.',
                errors={'status': list(VendorArrivalStatus.values)},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        assignment.status = status_value
        if status_value == VendorArrivalStatus.CHECKED_IN and assignment.actual_arrival is None:
            assignment.actual_arrival = timezone.now()
        if status_value in (VendorArrivalStatus.EXPECTED, VendorArrivalStatus.EN_ROUTE):
            assignment.actual_arrival = None
        assignment.save(update_fields=['status', 'actual_arrival', 'updated_at'])
        return success_response(
            data=VendorAssignmentSerializer(
                assignment, context={'wedding': wedding}
            ).data,
            message='Vendor arrival status updated.',
        )


class CommandCentreEventDetailAPIView(APIView):
    def patch(self, request, wedding_id, event_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        event = get_object_or_404(WeddingEvent, id=event_id, wedding=wedding)
        operation, _ = EventOperations.objects.get_or_create(event=event)

        status_value = request.data.get('status')
        if status_value not in EventRunStatus.values:
            return error_response(
                'Provide a valid event operations status.',
                errors={'status': list(EventRunStatus.values)},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        operation.status = status_value
        if status_value == EventRunStatus.IN_PROGRESS and operation.actual_start is None:
            operation.actual_start = timezone.now()
        elif status_value == EventRunStatus.COMPLETED:
            if operation.actual_start is None:
                operation.actual_start = timezone.now()
            operation.actual_end = timezone.now()
        elif status_value == EventRunStatus.UPCOMING:
            operation.actual_start = None
            operation.actual_end = None
        if 'delay_reason' in request.data:
            operation.delay_reason = str(request.data['delay_reason']).strip()
        operation.save()

        return success_response(
            data=EventOperationsSerializer(operation).data,
            message='Event operations status updated.',
        )


class CommandCentreTaskDetailAPIView(APIView):
    def patch(self, request, wedding_id, task_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        task = get_object_or_404(
            BlueprintTask, id=task_id, blueprint__wedding=wedding
        )
        if 'status' not in request.data:
            return error_response(
                'Task status is required.',
                errors={'status': 'This field is required.'},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        data = {
            'status': request.data['status'],
            'is_manually_edited': True,
        }
        serializer = BlueprintTaskSerializer(task, data=data, partial=True)
        if not serializer.is_valid():
            return error_response(
                'Task update validation failed.',
                errors=serializer.errors,
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        serializer.save()
        return success_response(
            data=serializer.data,
            message='Wedding Blueprint task status updated.',
        )
