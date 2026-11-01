from rest_framework import serializers

from .models import RequestActivity, WeddingRequest


class RequestActivitySerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.get_username', read_only=True, default='')

    class Meta:
        model = RequestActivity
        fields = ['id', 'actor_name', 'action', 'detail', 'created_at']
        read_only_fields = fields


class WeddingRequestSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_username', read_only=True)
    approved_wedding_id = serializers.UUIDField(source='approved_wedding.id', read_only=True, allow_null=True)
    agreement_id = serializers.SerializerMethodField()
    agreement_document = serializers.SerializerMethodField()
    agreement_status = serializers.SerializerMethodField()

    def get_agreement_id(self, obj):
        agreement = obj.agreements.first()
        return agreement.id if agreement else None

    def get_agreement_document(self, obj):
        agreement = obj.agreements.first()
        if not agreement or not agreement.document:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(agreement.document.url) if request else agreement.document.url

    def get_agreement_status(self, obj):
        agreement = obj.agreements.first()
        return agreement.status if agreement else None
    activities = RequestActivitySerializer(many=True, read_only=True)

    class Meta:
        model = WeddingRequest
        fields = [
            'id', 'customer', 'customer_name', 'approved_wedding_id', 'agreement_id',
            'agreement_document', 'agreement_status', 'wedding_name', 'wedding_date',
            'location', 'guest_count', 'theme', 'budget', 'package',
            'requirements', 'status', 'decision_reason', 'decided_at',
            'resubmission_count', 'activities', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'customer', 'customer_name', 'status', 'decision_reason',
            'decided_at', 'resubmission_count', 'activities', 'created_at', 'updated_at',
        ]

    def validate_guest_count(self, value):
        if value < 1:
            raise serializers.ValidationError('Guest count must be at least 1.')
        return value

    def validate_budget(self, value):
        if value <= 0:
            raise serializers.ValidationError('Budget must be greater than zero.')
        return value
