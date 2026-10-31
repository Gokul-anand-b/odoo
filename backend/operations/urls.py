from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (AgreementViewSet, DocumentViewSet, GuestViewSet, NotificationViewSet, PaymentViewSet,
                    RSVPViewSet, VendorAssignmentViewSet, VendorInvoiceViewSet, reports)

router = DefaultRouter()
router.register('agreements', AgreementViewSet)
router.register('payments', PaymentViewSet)
router.register('vendor-invoices', VendorInvoiceViewSet)
router.register('guests', GuestViewSet)
router.register('rsvps', RSVPViewSet)
router.register('vendor-assignments', VendorAssignmentViewSet)
router.register('documents', DocumentViewSet)
router.register('notifications', NotificationViewSet)

urlpatterns = [path('', include(router.urls)), path('reports/', reports, name='reports')]
