"""
Reusable base classes and mixins for WedPilot AI API.

Provides common pagination, response formatting, and base viewsets
that all feature modules should inherit from.
"""

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status


class StandardPagination(PageNumberPagination):
    """Standard pagination for all API endpoints."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class LargePagination(PageNumberPagination):
    """Larger pagination for list-heavy endpoints like guests."""
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


def success_response(data=None, message='Success', status_code=status.HTTP_200_OK):
    """
    Standardised success response format.
    
    Usage:
        return success_response(
            data={'wedding': serializer.data},
            message='Wedding created successfully',
            status_code=status.HTTP_201_CREATED
        )
    """
    response = {
        'success': True,
        'message': message,
    }
    if data is not None:
        response['data'] = data
    return Response(response, status=status_code)


def error_response(message='An error occurred', errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Standardised error response format.
    
    Usage:
        return error_response(
            message='Validation failed',
            errors=serializer.errors,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    """
    response = {
        'success': False,
        'message': message,
    }
    if errors is not None:
        response['errors'] = errors
    return Response(response, status=status_code)
