from django.urls import path

from .views import (
    DisruptionWeddingListAPIView,
    IncidentApproveAPIView,
    IncidentAnalyzeAPIView,
    IncidentHistoryAPIView,
    IncidentListCreateAPIView,
    IncidentResolveAPIView,
    WeddingDependencyListCreateAPIView,
    WeddingEventRecoveryRuleAPIView,
)

app_name = 'disruption_engine'

urlpatterns = [
    path('weddings/', DisruptionWeddingListAPIView.as_view(), name='weddings'),
    path('weddings/<uuid:wedding_id>/incidents/', IncidentListCreateAPIView.as_view(), name='incident-list-create'),
    path('weddings/<uuid:wedding_id>/dependencies/', WeddingDependencyListCreateAPIView.as_view(), name='dependency-list-create'),
    path('weddings/<uuid:wedding_id>/events/<uuid:event_id>/rule/', WeddingEventRecoveryRuleAPIView.as_view(), name='event-recovery-rule'),
    path('incidents/<uuid:incident_id>/analyze/', IncidentAnalyzeAPIView.as_view(), name='incident-analyze'),
    path('incidents/<uuid:incident_id>/approve/', IncidentApproveAPIView.as_view(), name='incident-approve'),
    path('incidents/<uuid:incident_id>/resolve/', IncidentResolveAPIView.as_view(), name='incident-resolve'),
    path('incidents/<uuid:incident_id>/history/', IncidentHistoryAPIView.as_view(), name='incident-history'),
]