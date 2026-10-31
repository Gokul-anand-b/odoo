from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from common.utils import success_response, error_response
from .models import Wedding, WeddingEvent, WeddingBlueprint, BlueprintTask
from .serializers import (
    WeddingSerializer,
    WeddingCreateWithEventsSerializer,
    WeddingEventSerializer,
    WeddingBlueprintSerializer,
    BlueprintTaskSerializer,
)
from .services.blueprint_service import BlueprintService


class WeddingListCreateAPIView(APIView):
    """List all weddings or create a new wedding setup with associated events."""

    def get(self, request):
        weddings = Wedding.objects.filter(is_deleted=False).prefetch_related('events', 'blueprint')
        serializer = WeddingSerializer(weddings, many=True)
        return success_response(data=serializer.data, message='Weddings retrieved successfully')

    def post(self, request):
        serializer = WeddingCreateWithEventsSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(message='Validation failed', errors=serializer.errors, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

        data = serializer.validated_data
        events_data = data.pop('events', [])

        with transaction.atomic():
            wedding = Wedding.objects.create(**data)
            # Create sub-events
            for idx, ev in enumerate(events_data, 1):
                WeddingEvent.objects.create(
                    wedding=wedding,
                    name=ev.get('name', f'Event {idx}'),
                    event_order=ev.get('event_order', idx),
                    date=ev.get('date', wedding.start_date),
                    start_time=ev.get('start_time'),
                    end_time=ev.get('end_time'),
                    venue_space=ev.get('venue_space', 'Main Ballroom'),
                    expected_guests=ev.get('expected_guests', wedding.guest_count),
                    dress_code=ev.get('dress_code', 'Royal Formal'),
                    coordinator_name=ev.get('coordinator_name', 'Lead Coordinator'),
                    notes=ev.get('notes', '')
                )

        full_serializer = WeddingSerializer(wedding)
        return success_response(
            data=full_serializer.data,
            message='Wedding setup initialized successfully',
            status_code=status.HTTP_201_CREATED
        )


class WeddingDetailAPIView(APIView):
    """Retrieve, update, or soft delete a specific wedding."""

    def get(self, request, pk):
        wedding = get_object_or_404(Wedding.objects.prefetch_related('events', 'blueprint'), id=pk, is_deleted=False)
        serializer = WeddingSerializer(wedding)
        return success_response(data=serializer.data)

    def put(self, request, pk):
        wedding = get_object_or_404(Wedding, id=pk, is_deleted=False)
        serializer = WeddingSerializer(wedding, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(message='Validation failed', errors=serializer.errors)
        serializer.save()
        return success_response(data=serializer.data, message='Wedding updated successfully')

    def delete(self, request, pk):
        wedding = get_object_or_404(Wedding, id=pk, is_deleted=False)
        wedding.soft_delete()
        return success_response(message='Wedding deleted successfully')


class WeddingEventListCreateAPIView(APIView):
    """List or add sub-events for a wedding."""

    def get(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        events = wedding.events.all()
        serializer = WeddingEventSerializer(events, many=True)
        return success_response(data=serializer.data)

    def post(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        data = request.data.copy()
        data['wedding'] = wedding.id
        serializer = WeddingEventSerializer(data=data)
        if not serializer.is_valid():
            return error_response(message='Event validation failed', errors=serializer.errors)
        serializer.save()
        return success_response(data=serializer.data, message='Event created successfully', status_code=status.HTTP_201_CREATED)


class WeddingEventDetailAPIView(APIView):
    """Update or remove a sub-event."""

    def put(self, request, wedding_id, pk):
        event = get_object_or_404(WeddingEvent, id=pk, wedding_id=wedding_id)
        serializer = WeddingEventSerializer(event, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(message='Validation failed', errors=serializer.errors)
        serializer.save()
        return success_response(data=serializer.data, message='Event updated successfully')

    def delete(self, request, wedding_id, pk):
        event = get_object_or_404(WeddingEvent, id=pk, wedding_id=wedding_id)
        event.delete()
        return success_response(message='Event deleted successfully')


class BlueprintGenerateAPIView(APIView):
    """
    Trigger the Intelligent Wedding Blueprint Generator.
    Runs Template Matching, Rule Customisation, DAG Topological Sort, and Greedy Scheduling.
    """

    def post(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        force_regenerate = request.data.get('force_regenerate', False)

        try:
            blueprint = BlueprintService.generate_or_update_blueprint(
                wedding_id=wedding.id,
                force_regenerate=force_regenerate
            )
            serializer = WeddingBlueprintSerializer(blueprint)
            return success_response(
                data=serializer.data,
                message=f'Blueprint v{blueprint.version} successfully synthesized using {blueprint.template_name}'
            )
        except Exception as e:
            return error_response(
                message='Failed to generate blueprint',
                errors={'detail': str(e)},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BlueprintDetailAPIView(APIView):
    """Retrieve full generated blueprint for a wedding."""

    def get(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        if not hasattr(wedding, 'blueprint'):
            return error_response(
                message='Blueprint has not yet been generated for this wedding.',
                status_code=status.HTTP_404_NOT_FOUND
            )
        serializer = WeddingBlueprintSerializer(wedding.blueprint)
        return success_response(data=serializer.data)


class BlueprintApproveAPIView(APIView):
    """Planners review and approve the generated blueprint."""

    def post(self, request, wedding_id):
        wedding = get_object_or_404(Wedding, id=wedding_id, is_deleted=False)
        if not hasattr(wedding, 'blueprint'):
            return error_response(message='Blueprint not found', status_code=status.HTTP_404_NOT_FOUND)

        blueprint = BlueprintService.approve_blueprint(wedding.blueprint.id)
        serializer = WeddingBlueprintSerializer(blueprint)
        return success_response(data=serializer.data, message='Wedding Blueprint formally approved!')


class TaskUpdateAPIView(APIView):
    """
    Update a task's status, priority, or details.
    Flags task as manually edited so subsequent blueprint regenerations will preserve it!
    """

    def put(self, request, pk):
        task = get_object_or_404(BlueprintTask, id=pk)
        data = request.data.copy()
        data['is_manually_edited'] = True

        serializer = BlueprintTaskSerializer(task, data=data, partial=True)
        if not serializer.is_valid():
            return error_response(message='Invalid task update', errors=serializer.errors)
        serializer.save()
        return success_response(data=serializer.data, message='Task updated and preserved successfully')
