"""
General API views for WedPilot AI.

Provides health check and API root endpoints.
Feature-specific views will be created in their respective modules.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone


@api_view(['GET'])
def health_check(request):
    """
    API health check endpoint.
    Returns server status and timestamp.
    """
    return Response({
        'status': 'healthy',
        'service': 'WedPilot AI API',
        'version': '1.0.0',
        'timestamp': timezone.now().isoformat(),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def api_root(request):
    """
    API root endpoint.
    Returns available API endpoints and documentation links.
    """
    return Response({
        'service': 'WedPilot AI API',
        'version': '1.0.0',
        'description': 'Intelligent Wedding Planning & Operations Management Platform',
        'endpoints': {
            'health': '/api/v1/health/',
            'documentation': '/api/docs/',
            'schema': '/api/schema/',
        },
        'modules': {
            'weddings': 'Coming soon',
            'vendors': 'Coming soon',
            'command_centre': 'Coming soon',
            'disruptions': 'Coming soon',
            'finance': 'Coming soon',
        }
    }, status=status.HTTP_200_OK)
