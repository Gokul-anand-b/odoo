from django.urls import path

from .views import (
    CommandCentreDashboardAPIView,
    CommandCentreEventDetailAPIView,
    CommandCentreTaskDetailAPIView,
    CommandCentreVendorAPIView,
    CommandCentreVendorDetailAPIView,
)

app_name = 'command_centre'

urlpatterns = [
    path('weddings/<uuid:wedding_id>/dashboard/', CommandCentreDashboardAPIView.as_view(), name='dashboard'),
    path('weddings/<uuid:wedding_id>/events/<uuid:event_id>/', CommandCentreEventDetailAPIView.as_view(), name='event-update'),
    path('weddings/<uuid:wedding_id>/tasks/<uuid:task_id>/', CommandCentreTaskDetailAPIView.as_view(), name='task-update'),
    path('weddings/<uuid:wedding_id>/vendors/', CommandCentreVendorAPIView.as_view(), name='vendor-list-create'),
    path('weddings/<uuid:wedding_id>/vendors/<int:assignment_id>/', CommandCentreVendorDetailAPIView.as_view(), name='vendor-update'),
]
