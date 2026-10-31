from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import (
    WeddingEvent,
    TaskItem,
    VendorTrackingItem,
    DelayDetectionItem,
    DependencyImpactItem,
    AlertItem,
)
from .serializers import (
    WeddingEventSerializer,
    TaskItemSerializer,
    VendorTrackingItemSerializer,
    DelayDetectionItemSerializer,
    DependencyImpactItemSerializer,
    AlertItemSerializer,
    DashboardOverviewSerializer,
)
from .services_impl import CommandCentreService


# ─────────────────────────────────────────────────────────────────────────────
#  Dashboard Overview — standalone endpoint
# ─────────────────────────────────────────────────────────────────────────────

class DashboardOverviewViewSet(viewsets.ViewSet):
    """
    GET /api/command-centre/overview/
    Returns computed stats: event counts, alert count, vendor count, on-time %.
    """

    def list(self, request):
        wedding_name = request.query_params.get('wedding_name')
        stats = CommandCentreService.get_overview_stats(wedding_name)
        serializer = DashboardOverviewSerializer(stats)
        return Response(serializer.data)


# ─────────────────────────────────────────────────────────────────────────────
#  Wedding Events
# ─────────────────────────────────────────────────────────────────────────────

class WeddingEventViewSet(viewsets.ModelViewSet):
    """
    CRUD + custom actions for wedding ceremony events.

    GET    /api/command-centre/events/
    GET    /api/command-centre/events/?status=Delayed&wedding_name=...
    PATCH  /api/command-centre/events/{id}/update_status/
    """
    queryset = WeddingEvent.objects.all().prefetch_related('tasks')
    serializer_class = WeddingEventSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        ceremony = self.request.query_params.get('ceremony_type')
        wedding = self.request.query_params.get('wedding_name')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if ceremony:
            qs = qs.filter(ceremony_type=ceremony)
        if wedding:
            qs = qs.filter(wedding_name=wedding)
        return qs

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """
        Patch event status, actual times and delay.
        Body: { status, actual_start_time, actual_end_time, delay_minutes }
        """
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'status field is required'}, status=status.HTTP_400_BAD_REQUEST)

        event = CommandCentreService.update_event_status(
            event_id=pk,
            status=new_status,
            actual_start=request.data.get('actual_start_time'),
            actual_end=request.data.get('actual_end_time'),
            delay_minutes=request.data.get('delay_minutes'),
        )
        return Response(WeddingEventSerializer(event).data)


# ─────────────────────────────────────────────────────────────────────────────
#  Task Monitoring
# ─────────────────────────────────────────────────────────────────────────────

class TaskItemViewSet(viewsets.ModelViewSet):
    """
    CRUD + progress update for operational tasks.

    GET   /api/command-centre/tasks/
    GET   /api/command-centre/tasks/?status=Delayed&event_id=evt-04
    PATCH /api/command-centre/tasks/{id}/update-progress/
    """
    queryset = TaskItem.objects.all().select_related('event')
    serializer_class = TaskItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')
        event_id = self.request.query_params.get('event_id')
        category = self.request.query_params.get('category')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if priority:
            qs = qs.filter(priority=priority)
        if event_id:
            qs = qs.filter(event_id=event_id)
        if category:
            qs = qs.filter(category=category)
        return qs

    @action(detail=True, methods=['patch'], url_path='update-progress')
    def update_progress(self, request, pk=None):
        """
        Update task progress and status.
        Body: { status, progress_percent }
        """
        new_status = request.data.get('status')
        progress = request.data.get('progress_percent')

        if new_status is None or progress is None:
            return Response(
                {'error': 'Both status and progress_percent are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        task = CommandCentreService.update_task(
            task_id=pk,
            status=new_status,
            progress=int(progress),
        )
        return Response(TaskItemSerializer(task).data)


# ─────────────────────────────────────────────────────────────────────────────
#  Vendor Tracking
# ─────────────────────────────────────────────────────────────────────────────

class VendorTrackingViewSet(viewsets.ModelViewSet):
    """
    CRUD + check-in action for vendor tracking.

    GET  /api/command-centre/vendors/
    GET  /api/command-centre/vendors/?check_in_status=Delayed
    POST /api/command-centre/vendors/{id}/check-in/
    """
    queryset = VendorTrackingItem.objects.all()
    serializer_class = VendorTrackingItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        check_in = self.request.query_params.get('check_in_status')
        if check_in:
            qs = qs.filter(check_in_status=check_in)
        return qs

    @action(detail=True, methods=['post'], url_path='check-in')
    def check_in(self, request, pk=None):
        """
        Mark a vendor as Checked-In.
        Body (optional): { gate_location }
        """
        vendor = CommandCentreService.check_in_vendor(
            vendor_id=pk,
            gate_location=request.data.get('gate_location'),
        )
        return Response(VendorTrackingItemSerializer(vendor).data)


# ─────────────────────────────────────────────────────────────────────────────
#  Delay Detection
# ─────────────────────────────────────────────────────────────────────────────

class DelayDetectionViewSet(viewsets.ModelViewSet):
    """
    CRUD + resolve action for delay items.

    GET  /api/command-centre/delays/
    GET  /api/command-centre/delays/?status=Active&severity=High
    POST /api/command-centre/delays/{id}/resolve/
    """
    queryset = DelayDetectionItem.objects.all()
    serializer_class = DelayDetectionItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        severity = self.request.query_params.get('severity')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if severity:
            qs = qs.filter(severity=severity)
        return qs

    @action(detail=True, methods=['post'], url_path='resolve')
    def resolve(self, request, pk=None):
        """
        Resolve a delay item.
        Body (optional): { resolved_by }
        """
        delay = CommandCentreService.resolve_delay(
            delay_id=pk,
            resolved_by=request.data.get('resolved_by', 'Operations Lead'),
        )
        return Response(DelayDetectionItemSerializer(delay).data)


# ─────────────────────────────────────────────────────────────────────────────
#  Dependency Impact Matrix
# ─────────────────────────────────────────────────────────────────────────────

class DependencyImpactViewSet(viewsets.ModelViewSet):
    """
    CRUD + mitigate action for dependency items.

    GET  /api/command-centre/dependencies/
    GET  /api/command-centre/dependencies/?status=Open
    POST /api/command-centre/dependencies/{id}/mitigate/
    """
    queryset = DependencyImpactItem.objects.all()
    serializer_class = DependencyImpactItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        risk = self.request.query_params.get('cascading_risk')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if risk:
            qs = qs.filter(cascading_risk=risk)
        return qs

    @action(detail=True, methods=['post'], url_path='mitigate')
    def mitigate(self, request, pk=None):
        """
        Mark a dependency risk as Mitigated.
        Body (optional): { mitigated_by }
        """
        dep = CommandCentreService.mitigate_dependency(
            dep_id=pk,
            mitigated_by=request.data.get('mitigated_by', 'Operations Lead'),
        )
        return Response(DependencyImpactItemSerializer(dep).data)


# ─────────────────────────────────────────────────────────────────────────────
#  Alerts Panel
# ─────────────────────────────────────────────────────────────────────────────

class AlertItemViewSet(viewsets.ModelViewSet):
    """
    CRUD + acknowledge action for alerts.

    GET  /api/command-centre/alerts/
    GET  /api/command-centre/alerts/?acknowledged=false&severity=Critical
    POST /api/command-centre/alerts/{id}/acknowledge/
    """
    queryset = AlertItem.objects.all()
    serializer_class = AlertItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        severity = self.request.query_params.get('severity')
        acknowledged = self.request.query_params.get('acknowledged')
        category = self.request.query_params.get('category')
        if severity:
            qs = qs.filter(severity=severity)
        if acknowledged is not None:
            qs = qs.filter(acknowledged=(acknowledged.lower() == 'true'))
        if category:
            qs = qs.filter(category=category)
        return qs

    @action(detail=True, methods=['post'], url_path='acknowledge')
    def acknowledge(self, request, pk=None):
        """
        Acknowledge an alert.
        Body (optional): { acknowledged_by }
        """
        alert = CommandCentreService.acknowledge_alert(
            alert_id=pk,
            coordinator=request.data.get('acknowledged_by', 'Operations Lead'),
        )
        return Response(AlertItemSerializer(alert).data)
