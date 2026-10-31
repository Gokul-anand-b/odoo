from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, QuotationViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'quotations', QuotationViewSet, basename='quotation')

urlpatterns = [
    path('', include(router.urls)),
]
