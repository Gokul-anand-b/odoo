from rest_framework import serializers

from vendor_intelligence.models import Vendor
from wedding_blueprint.models import BlueprintTask

from .models import EventOperations, WeddingVendorAssignment


class VendorOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'name', 'category', 'contact_person', 'phone']


class VendorAssignmentSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    vendor_category = serializers.CharField(source='vendor.category', read_only=True)
    contact_person = serializers.CharField(source='vendor.contact_person', read_only=True)
    phone = serializers.CharField(source='vendor.phone', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True, default='')

    class Meta:
        model = WeddingVendorAssignment
        fields = [
            'id', 'vendor', 'vendor_name', 'vendor_category', 'contact_person',
            'phone', 'event', 'event_name', 'expected_arrival', 'actual_arrival',
            'status', 'notes',
        ]
        read_only_fields = [
            'id', 'vendor_name', 'vendor_category', 'contact_person',
            'phone', 'event_name', 'actual_arrival',
        ]

    def validate(self, attrs):
        wedding = self.context['wedding']
        vendor = attrs.get('vendor', getattr(self.instance, 'vendor', None))
        event = attrs.get('event', getattr(self.instance, 'event', None))
        if event and event.wedding_id != wedding.id:
            raise serializers.ValidationError({'event': 'Choose an event from this wedding.'})
        if vendor and WeddingVendorAssignment.objects.filter(
            wedding=wedding, vendor=vendor
        ).exclude(pk=getattr(self.instance, 'pk', None)).exists():
            raise serializers.ValidationError({'vendor': 'This vendor is already assigned to this wedding.'})
        return attrs


class EventOperationsSerializer(serializers.ModelSerializer):
    event_id = serializers.UUIDField(source='event.id', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)
    event_date = serializers.DateField(source='event.date', read_only=True)
    scheduled_start = serializers.TimeField(source='event.start_time', read_only=True)
    scheduled_end = serializers.TimeField(source='event.end_time', read_only=True)
    venue_space = serializers.CharField(source='event.venue_space', read_only=True)

    class Meta:
        model = EventOperations
        fields = [
            'id', 'event_id', 'event_name', 'event_date', 'scheduled_start',
            'scheduled_end', 'venue_space', 'status', 'actual_start',
            'actual_end', 'delay_reason',
        ]
        read_only_fields = [
            'id', 'event_id', 'event_name', 'event_date', 'scheduled_start',
            'scheduled_end', 'venue_space',
        ]


class BlueprintTaskMonitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlueprintTask
        fields = [
            'id', 'code', 'title', 'category', 'phase', 'priority',
            'status', 'deadline', 'coordinator_role', 'depends_on',
            'is_critical_path',
        ]
