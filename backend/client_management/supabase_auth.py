import json
import urllib.error
import urllib.request

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .models import UserProfile, UserRole


class SupabaseAuthentication(BaseAuthentication):
    """Resolve a Supabase access token to a local user for Django ownership checks."""

    keyword = b'bearer'

    def authenticate(self, request):
        authorization = get_authorization_header(request).split()
        if len(authorization) != 2 or authorization[0].lower() != self.keyword:
            return None
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise AuthenticationFailed('Supabase authentication is not configured.')

        token = authorization[1].decode('utf-8')
        api_request = urllib.request.Request(
            f'{settings.SUPABASE_URL.rstrip("/")}/auth/v1/user',
            headers={
                'apikey': settings.SUPABASE_KEY,
                'Authorization': f'Bearer {token}',
            },
        )
        try:
            with urllib.request.urlopen(api_request, timeout=10) as response:
                identity = json.loads(response.read().decode('utf-8'))
        except (urllib.error.HTTPError, urllib.error.URLError, json.JSONDecodeError) as error:
            raise AuthenticationFailed('Invalid or expired Supabase access token.') from error

        email = identity.get('email')
        if not email:
            raise AuthenticationFailed('Supabase user has no email address.')
        metadata = identity.get('user_metadata') or {}
        role = metadata.get('role', UserRole.CUSTOMER)
        is_admin = email.lower() in settings.SUPABASE_ADMIN_EMAILS
        if is_admin:
            role = UserRole.ADMIN
        if role not in (UserRole.CUSTOMER, UserRole.VENDOR):
            role = UserRole.ADMIN if is_admin else UserRole.CUSTOMER

        User = get_user_model()
        username = f'supabase_{identity["id"]}'
        user, _ = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_active': True},
        )
        if user.is_staff != is_admin:
            user.is_staff = is_admin
            user.save(update_fields=['is_staff'])
        if user.email != email:
            user.email = email
            user.save(update_fields=['email'])
        UserProfile.objects.update_or_create(user=user, defaults={'role': role})
        return user, token
