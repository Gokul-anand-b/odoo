"""
API URL Configuration for Eternelle (WedPilot AI).

This provides the general REST API routing foundation.
All endpoints are available under /api/v1/
"""

from django.urls import path, include
from . import views

app_name = 'api'

urlpatterns = [
    # Health check endpoint
    path('health/', views.health_check, name='health-check'),

    # API root information
    path('', views.api_root, name='api-root'),

    # Feature-specific endpoints:
    path('', include('wedding_blueprint.urls')),
    path('', include('vendor_intelligence.urls')),
    path('disruptions/', include('disruption_engine.urls')),
    path('', include('client_management.urls')),
    path('operations/', include('operations.urls')),
    path('command-centre/', include('command_centre.urls')),
]
