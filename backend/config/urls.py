"""
URL configuration for WedPilot AI.

The `urlpatterns` list routes URLs to views.
API endpoints are mounted under /api/v1/ prefix.
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/', include('api.urls')),

    # Command Centre API
    path('api/command-centre/', include('command_centre.urls')),

    # Vendor intelligence API (keep existing frontend endpoints available)
    path('api/vendor-intelligence/', include('vendor_intelligence.urls')),
    path('api/', include('vendor_intelligence.urls')),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
