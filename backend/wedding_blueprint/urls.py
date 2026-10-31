from django.urls import path
from .views import (
    WeddingListCreateAPIView,
    WeddingDetailAPIView,
    WeddingEventListCreateAPIView,
    WeddingEventDetailAPIView,
    BlueprintGenerateAPIView,
    BlueprintDetailAPIView,
    BlueprintApproveAPIView,
    TaskUpdateAPIView,
    VendorRequirementListAPIView,
    ResourceRequirementListAPIView,
)

app_name = 'wedding_blueprint'

urlpatterns = [
    # Weddings setup & details
    path('weddings/', WeddingListCreateAPIView.as_view(), name='wedding-list-create'),
    path('weddings/<uuid:pk>/', WeddingDetailAPIView.as_view(), name='wedding-detail'),

    # Events planning
    path('weddings/<uuid:wedding_id>/events/', WeddingEventListCreateAPIView.as_view(), name='wedding-event-list-create'),
    path('weddings/<uuid:wedding_id>/events/<uuid:pk>/', WeddingEventDetailAPIView.as_view(), name='wedding-event-detail'),

    # Intelligent Blueprint Generation & Approval
    path('weddings/<uuid:wedding_id>/blueprint/generate/', BlueprintGenerateAPIView.as_view(), name='blueprint-generate'),
    path('weddings/<uuid:wedding_id>/blueprint/', BlueprintDetailAPIView.as_view(), name='blueprint-detail'),
    path('weddings/<uuid:wedding_id>/blueprint/approve/', BlueprintApproveAPIView.as_view(), name='blueprint-approve'),

    # Task Management
    path('tasks/<uuid:pk>/', TaskUpdateAPIView.as_view(), name='task-update'),

    # Derived Blueprint Requirements (Vendor & Resource)
    path('vendor-requirements/', VendorRequirementListAPIView.as_view(), name='vendor-requirements-list'),
    path('resource-requirements/', ResourceRequirementListAPIView.as_view(), name='resource-requirements-list'),
]
