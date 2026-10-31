"""
API URL Configuration for WedPilot AI.

This provides the general REST API routing foundation.
Feature-specific endpoints will be added by individual developers.

Convention:
    Each feature module should create its own urls.py and be included here.
    Example:
        path('weddings/', include('api.weddings.urls')),
        path('vendors/', include('api.vendors.urls')),
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
    path('disruptions/', include('disruption_engine.urls')),
]
