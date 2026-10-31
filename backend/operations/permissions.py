from rest_framework.permissions import BasePermission

from client_management.models import UserRole


def has_role(user, role):
    return user.is_authenticated and (
        user.is_staff or getattr(getattr(user, 'profile', None), 'role', None) == role
    )


class IsOwnerOrStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return any(getattr(obj, field, None) == request.user
                   for field in ('customer', 'owner', 'recipient', 'vendor'))


class IsStaffOrVendor(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or getattr(obj, 'vendor_id', None) == request.user.id


class IsCustomerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, UserRole.CUSTOMER)


class IsVendorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return has_role(request.user, UserRole.VENDOR)


class IsAdminOrParticipant(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_staff
            or obj.customer_id == request.user.id
            or obj.vendor_id == request.user.id
        )
