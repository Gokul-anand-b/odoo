from rest_framework import serializers
from .models import Vendor, Quotation, QuoteLineItem, HiddenCostItem, MissingInclusion

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'


class QuoteLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteLineItem
        fields = '__all__'
        read_only_fields = ['id']


class HiddenCostItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiddenCostItem
        fields = '__all__'
        read_only_fields = ['id']


class MissingInclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissingInclusion
        fields = '__all__'
        read_only_fields = ['id']


class QuotationSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    category = serializers.CharField(source='vendor.category', read_only=True)
    vendor_tier = serializers.CharField(source='vendor.tier', read_only=True)
    vendor_rating = serializers.FloatField(source='vendor.rating', read_only=True)
    items = QuoteLineItemSerializer(many=True, read_only=True)
    hidden_costs = HiddenCostItemSerializer(many=True, read_only=True)
    missing_inclusions = MissingInclusionSerializer(many=True, read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'
