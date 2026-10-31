from django.utils import timezone
from rest_framework import serializers

from .models import Agreement, Document, Guest, Notification, Payment, RSVP, VendorAssignment, VendorInvoice


class AgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agreement
        fields = '__all__'
        read_only_fields = ('status', 'customer_signed_at', 'vendor_signed_at', 'signed_at')

    def update(self, instance, validated_data):
        if self.context['request'].data.get('sign') is True:
            actor = self.context['request'].user
            now = timezone.now()
            if actor == instance.customer:
                instance.customer_signed_at = now
            if actor == instance.vendor:
                instance.vendor_signed_at = now
            if instance.customer_signed_at and (not instance.vendor or instance.vendor_signed_at):
                instance.status, instance.signed_at = 'signed', now
            else:
                instance.status = 'sent'
            instance.save()
            return instance
        return super().update(instance, validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('status', 'paid_at')

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Payment amount must be greater than zero.')
        return value


class VendorInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorInvoice
        fields = '__all__'


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = '__all__'


class RSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = '__all__'
        read_only_fields = ('responded_at',)

    def update(self, instance, validated_data):
        if 'response' in validated_data and validated_data['response'] != 'pending':
            validated_data['responded_at'] = timezone.now()
        return super().update(instance, validated_data)


class VendorAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorAssignment
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('owner',)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('recipient', 'read_at')

    def update(self, instance, validated_data):
        if self.context['request'].data.get('read') is True:
            instance.read_at = timezone.now()
            instance.save(update_fields=('read_at', 'updated_at'))
        return super().update(instance, validated_data)
