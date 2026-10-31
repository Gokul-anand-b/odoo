from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import UserProfile, UserRole

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(min_length=8, write_only=True)
    role = serializers.ChoiceField(choices=[UserRole.CUSTOMER, UserRole.VENDOR], default=UserRole.CUSTOMER)

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role=role)
        return user

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value
