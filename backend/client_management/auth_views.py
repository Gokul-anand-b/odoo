from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth_serializers import RegisterSerializer
from .supabase_auth import SupabaseAuthentication


def user_payload(user):
    profile = getattr(user, 'profile', None)
    return {
        'id': user.id,
        'username': user.get_username(),
        'email': user.email,
        'role': 'admin' if user.is_staff else (profile.role if profile else 'customer'),
    }


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(user_payload(user), status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(
            request,
            username=request.data.get('username', ''),
            password=request.data.get('password', ''),
        )
        if user is None:
            return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response(user_payload(user))


class LogoutAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserAPIView(APIView):
    authentication_classes = [SessionAuthentication, SupabaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(user_payload(request.user))
