from datetime import datetime, timedelta

from django.utils import timezone

from wedding_blueprint.models import Wedding

from .models import EventOperations, EventRunStatus, WeddingVendorAssignment
from .serializers import (
    BlueprintTaskMonitorSerializer,
    VendorAssignmentSerializer,
)


def _scheduled_start(event):
    if not event.start_time:
        return None
    value = datetime.combine(event.date, event.start_time)
    return timezone.make_aware(value, timezone.get_current_timezone())


def _scheduled_interval(event):
    if not event.start_time or not event.end_time:
        return None
    start = datetime.combine(event.date, event.start_time)
    end = datetime.combine(event.date, event.end_time)
    if end <= start:
        end += timedelta(days=1)
    current_timezone = timezone.get_current_timezone()
    return (
        timezone.make_aware(start, current_timezone),
        timezone.make_aware(end, current_timezone),
    )


def _build_alerts(events, tasks, assignments):
    alerts = []
    now = timezone.localtime()
    ordered_events = sorted(
        events,
        key=lambda event: (event.date, event.start_time or datetime.min.time(), event.event_order),
    )

    for event in ordered_events:
        operation = getattr(event, '_operations_state', None)
        operation_status = operation.status if operation else EventRunStatus.UPCOMING
        if operation_status == EventRunStatus.DELAYED:
            affected = []
            projected_end = operation.actual_end if operation else None
            interval = _scheduled_interval(event)
            if projected_end is None and interval:
                scheduled_start, scheduled_end = interval
                planned_duration = scheduled_end - scheduled_start
                projected_end = max(
                    now,
                    (operation.actual_start if operation and operation.actual_start else now)
                    + planned_duration,
                )
            if projected_end:
                scheduled_start = _scheduled_start(event)
                for downstream in ordered_events:
                    downstream_start = _scheduled_start(downstream)
                    if (
                        downstream.id != event.id
                        and downstream_start
                        and scheduled_start
                        and downstream_start > scheduled_start
                        and downstream_start.date() == projected_end.date()
                        and downstream_start < projected_end
                    ):
                        affected.append(downstream.name)
            alerts.append({
                'id': f'event-delay-{event.id}',
                'severity': 'high',
                'title': f'{event.name} is delayed',
                'description': (
                    operation.delay_reason if operation and operation.delay_reason
                    else 'The planner marked this event as delayed.'
                ),
                'source_type': 'event',
                'source_id': str(event.id),
                'affected_events': affected,
                'created_at': operation.updated_at if operation else None,
            })
        elif (
            event.date == now.date()
            and event.start_time
            and _scheduled_start(event) <= now
            and operation_status == EventRunStatus.UPCOMING
        ):
            alerts.append({
                'id': f'event-not-started-{event.id}',
                'severity': 'medium',
                'title': f'{event.name} has not started',
                'description': f'Scheduled start was {event.start_time.strftime("%H:%M")}.',
                'source_type': 'event',
                'source_id': str(event.id),
                'affected_events': [],
                'created_at': None,
            })

    for index, event in enumerate(ordered_events):
        operation = getattr(event, '_operations_state', None)
        if operation and operation.status == EventRunStatus.COMPLETED:
            continue
        interval = _scheduled_interval(event)
        if interval is None or not event.venue_space.strip():
            continue
        start, end = interval
        for other in ordered_events[index + 1:]:
            other_operation = getattr(other, '_operations_state', None)
            if other_operation and other_operation.status == EventRunStatus.COMPLETED:
                continue
            other_interval = _scheduled_interval(other)
            if (
                other_interval
                and event.date == other.date
                and event.venue_space.strip().casefold() == other.venue_space.strip().casefold()
            ):
                other_start, other_end = other_interval
                if start < other_end and other_start < end:
                    alerts.append({
                        'id': f'event-conflict-{event.id}-{other.id}',
                        'severity': 'high',
                        'title': f'{event.name} conflicts with {other.name}',
                        'description': (
                            f'Both events are scheduled in {event.venue_space} '
                            'during overlapping times.'
                        ),
                        'source_type': 'event',
                        'source_id': str(event.id),
                        'affected_events': [other.name],
                        'created_at': None,
                    })

    by_code = {task.code: task for task in tasks}
    for task in tasks:
        if task.status == 'blocked':
            blockers = [
                code for code in task.depends_on
                if code in by_code and by_code[code].status != 'completed'
            ]
            alerts.append({
                'id': f'task-blocked-{task.id}',
                'severity': 'high' if task.is_critical_path or task.priority == 'critical' else 'medium',
                'title': f'{task.title} is blocked',
                'description': (
                    f'Waiting on: {", ".join(blockers)}.'
                    if blockers else 'This task was marked blocked by the planner.'
                ),
                'source_type': 'task',
                'source_id': str(task.id),
                'affected_events': [],
                'created_at': task.updated_at,
            })
        elif task.deadline and task.deadline < now.date() and task.status != 'completed':
            alerts.append({
                'id': f'task-overdue-{task.id}',
                'severity': 'high' if task.is_critical_path or task.priority == 'critical' else 'medium',
                'title': f'{task.title} is overdue',
                'description': f'This {task.phase.lower()} task was due {task.deadline.isoformat()}.',
                'source_type': 'task',
                'source_id': str(task.id),
                'affected_events': [],
                'created_at': task.updated_at,
            })

    for assignment in assignments:
        if assignment.status == 'delayed':
            affected = [assignment.event.name] if assignment.event_id else []
            alerts.append({
                'id': f'vendor-delayed-{assignment.id}',
                'severity': 'high',
                'title': f'{assignment.vendor.name} is delayed',
                'description': assignment.notes or 'The assigned vendor was marked delayed.',
                'source_type': 'vendor',
                'source_id': str(assignment.id),
                'affected_events': affected,
                'created_at': assignment.updated_at,
            })
        elif (
            assignment.expected_arrival
            and assignment.expected_arrival < now
            and assignment.status in ('expected', 'en_route')
        ):
            affected = [assignment.event.name] if assignment.event_id else []
            alerts.append({
                'id': f'vendor-late-{assignment.id}',
                'severity': 'medium',
                'title': f'{assignment.vendor.name} has not checked in',
                'description': f'Expected arrival was {timezone.localtime(assignment.expected_arrival).strftime("%H:%M")}.',
                'source_type': 'vendor',
                'source_id': str(assignment.id),
                'affected_events': affected,
                'created_at': assignment.updated_at,
            })

    return alerts


def get_dashboard(wedding_id):
    wedding = Wedding.objects.filter(id=wedding_id, is_deleted=False).first()
    if wedding is None:
        return None

    events = list(
        wedding.events.all().select_related('operations').order_by('date', 'start_time', 'event_order')
    )
    operations = {
        operation.event_id: operation
        for operation in EventOperations.objects.filter(event__wedding=wedding)
    }
    for event in events:
        event._operations_state = operations.get(event.id)

    blueprint = getattr(wedding, 'blueprint', None)
    tasks = list(blueprint.tasks.all()) if blueprint else []
    assignments = list(
        WeddingVendorAssignment.objects.filter(wedding=wedding).select_related('vendor', 'event')
    )
    task_counts = {
        'total': len(tasks),
        'completed': sum(task.status == 'completed' for task in tasks),
        'in_progress': sum(task.status == 'in_progress' for task in tasks),
        'blocked': sum(task.status == 'blocked' for task in tasks),
    }
    alerts = _build_alerts(events, tasks, assignments)

    return {
        'wedding': {
            'id': str(wedding.id),
            'title': wedding.title,
            'couple_names': wedding.couple_names,
            'start_date': wedding.start_date,
            'end_date': wedding.end_date,
            'venue_name': wedding.venue_name,
            'venue_city': wedding.venue_city,
            'guest_count': wedding.guest_count,
        },
        'events': [
            {
                'id': operation.pk if operation else None,
                'event_id': str(event.id),
                'event_name': event.name,
                'event_date': event.date,
                'scheduled_start': event.start_time,
                'scheduled_end': event.end_time,
                'venue_space': event.venue_space,
                'status': operation.status if operation else EventRunStatus.UPCOMING,
                'actual_start': operation.actual_start if operation else None,
                'actual_end': operation.actual_end if operation else None,
                'delay_reason': operation.delay_reason if operation else '',
            }
            for event in events
            for operation in [operations.get(event.id)]
        ],
        'tasks': BlueprintTaskMonitorSerializer(tasks, many=True).data,
        'vendors': VendorAssignmentSerializer(
            assignments, many=True, context={'wedding': wedding}
        ).data,
        'task_counts': task_counts,
        'alerts': alerts,
        'active_alerts_count': len(alerts),
        'vendor_counts': {
            'assigned': len(assignments),
            'checked_in': sum(item.status == 'checked_in' for item in assignments),
            'delayed': sum(item.status == 'delayed' for item in assignments),
        },
    }
