from rest_framework.permissions import BasePermission

from .models import UserRole


def has_role(user, role):
    return user.is_authenticated and (
        user.is_staff
        or getattr(getattr(user, 'profile', None), 'role', None) == role
    )


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, UserRole.ADMIN)
