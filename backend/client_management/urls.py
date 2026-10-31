from django.urls import path

from .views import (
    WeddingRequestDecisionAPIView,
    WeddingRequestDetailAPIView,
    WeddingRequestListCreateAPIView,
)
from .auth_views import CurrentUserAPIView, LoginAPIView, LogoutAPIView, RegisterAPIView
from .security_views import csrf_token

urlpatterns = [
    path('auth/csrf/', csrf_token, name='auth-csrf'),
    path('auth/register/', RegisterAPIView.as_view(), name='auth-register'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutAPIView.as_view(), name='auth-logout'),
    path('auth/me/', CurrentUserAPIView.as_view(), name='auth-me'),
    path('wedding-requests/', WeddingRequestListCreateAPIView.as_view(), name='wedding-request-list-create'),
    path('wedding-requests/<uuid:pk>/', WeddingRequestDetailAPIView.as_view(), name='wedding-request-detail'),
    path('wedding-requests/<uuid:pk>/decision/', WeddingRequestDecisionAPIView.as_view(), name='wedding-request-decision'),
]
