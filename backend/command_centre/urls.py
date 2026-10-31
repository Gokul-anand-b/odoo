from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardOverviewViewSet,
    WeddingEventViewSet,
    TaskItemViewSet,
    VendorTrackingViewSet,
    DelayDetectionViewSet,
    DependencyImpactViewSet,
    AlertItemViewSet,
)

router = DefaultRouter()
router.register(r'overview', DashboardOverviewViewSet, basename='cc-overview')
router.register(r'events', WeddingEventViewSet, basename='cc-event')
router.register(r'tasks', TaskItemViewSet, basename='cc-task')
router.register(r'vendors', VendorTrackingViewSet, basename='cc-vendor')
router.register(r'delays', DelayDetectionViewSet, basename='cc-delay')
router.register(r'dependencies', DependencyImpactViewSet, basename='cc-dependency')
router.register(r'alerts', AlertItemViewSet, basename='cc-alert')

urlpatterns = [
    path('', include(router.urls)),
]
