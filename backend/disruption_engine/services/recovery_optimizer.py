from collections import defaultdict
from datetime import datetime, timedelta
from decimal import Decimal

from disruption_engine.models import RecoveryStrategy
from .constraint_validator import validate_recovery_schedule
from .dependency_graph_engine import topological_event_order


STRATEGY_OBJECTIVES = {
    RecoveryStrategy.MINIMUM_DISRUPTION: 'Shift as few events as possible, then minimize total movement.',
    RecoveryStrategy.TIME_PRESERVATION: 'Keep fixed-time events at their original start time.',
    RecoveryStrategy.COST_OPTIMISATION: 'Prioritize keeping high-move-cost events at their original times, then estimate total costs.',
}


def _interval(event):
    if event.start_time is None or event.end_time is None:
        raise ValueError(f'Event "{event.name}" needs start and end times for recovery analysis.')
    start = datetime.combine(event.date, event.start_time)
    end = datetime.combine(event.date, event.end_time)
    if end <= start:
        end += timedelta(days=1)
    return start, end


def build_recovery_plans(incident):
    wedding = incident.wedding
    events = list(wedding.events.all().order_by('date', 'event_order', 'start_time'))
    if not events:
        raise ValueError('This wedding has no scheduled events to analyze.')
    if incident.affected_event_id is None or incident.affected_event.wedding_id != wedding.id:
        raise ValueError('The affected event must belong to this wedding.')

    dependencies = list(wedding.event_dependencies.select_related(
        'predecessor_event', 'successor_event'
    ))
    ordered_ids = topological_event_order(events, dependencies)
    cycle_error = None if ordered_ids is not None else 'The event dependency graph contains a cycle.'
    by_id = {event.id: event for event in events}
    original = {event.id: _interval(event) for event in events}
    predecessor_edges = defaultdict(list)
    for dependency in dependencies:
        predecessor_edges[dependency.successor_event_id].append(dependency)

    baseline_rows = [
        _schedule_entry(event, original[event.id], original[event.id])
        for event in events
    ]
    plans = []
    for strategy in RecoveryStrategy.values:
        strategy_order = topological_event_order(events, dependencies, strategy)
        plans.append(_build_strategy_plan(
            incident=incident,
            events=events,
            by_id=by_id,
            ordered_ids=strategy_order or [event.id for event in events],
            predecessor_edges=predecessor_edges,
            original=original,
            baseline_rows=baseline_rows,
            strategy=strategy,
            cycle_error=cycle_error,
        ))
    return plans


def _build_strategy_plan(
    incident, events, by_id, ordered_ids, predecessor_edges, original, baseline_rows,
    strategy, cycle_error,
):
    scheduled = {}
    venue_schedule = defaultdict(list)
    errors = [cycle_error] if cycle_error else []
    total_shift_minutes = 0
    moving_cost = Decimal('0')

    for event_id in ordered_ids:
        event = by_id[event_id]
        original_start, original_end = original[event_id]
        duration = original_end - original_start
        desired_start = original_start
        if event_id == incident.affected_event_id:
            desired_start += timedelta(minutes=incident.delay_minutes)

        for dependency in predecessor_edges[event_id]:
            predecessor = scheduled.get(dependency.predecessor_event_id)
            if predecessor:
                dependency_start = predecessor[1] + timedelta(minutes=dependency.minimum_gap_minutes)
                desired_start = max(desired_start, dependency_start)

        venue = event.venue_space.strip().casefold()
        if venue:
            for _, occupied in venue_schedule[venue]:
                if desired_start < occupied[1] and desired_start + duration > occupied[0]:
                    desired_start = occupied[1]

        if (
            strategy == RecoveryStrategy.TIME_PRESERVATION
            and event.is_fixed_time
            and desired_start != original_start
        ):
            errors.append(f'Fixed-time event "{event.name}" cannot move under Time Preservation.')
            desired_start = original_start

        proposed_end = desired_start + duration
        scheduled[event_id] = (desired_start, proposed_end)
        venue_schedule[venue].append((event, (desired_start, proposed_end)))
        venue_schedule[venue].sort(key=lambda item: item[1][0])

        shift = int((desired_start - original_start).total_seconds() // 60)
        if shift > 0:
            total_shift_minutes += shift
            moving_cost += Decimal(event.recovery_move_cost or 0)

    validation_errors = errors + validate_recovery_schedule(
        events, scheduled, list(incident.wedding.event_dependencies.select_related(
            'predecessor_event', 'successor_event'
        )), incident.wedding,
        enforce_fixed_times=(strategy == RecoveryStrategy.TIME_PRESERVATION),
    )
    validation_errors = list(dict.fromkeys(validation_errors))
    changed_events = [
        event for event in events if scheduled[event.id][0] != original[event.id][0]
    ]
    additional_cost = moving_cost + (
        Decimal(incident.cost_per_minute or 0) * Decimal(total_shift_minutes)
    )
    proposed_rows = [_schedule_entry(event, original[event.id], scheduled[event.id]) for event in events]
    return {
        'strategy': strategy,
        'feasible': not validation_errors,
        'changed_event_count': len(changed_events),
        'estimated_additional_cost': additional_cost,
        'impact_summary': (
            f'{len(changed_events)} event(s) change by {total_shift_minutes} total minutes. '
            f'Vendor impact: {incident.vendor_impact or "Not specified"}. '
            f'{STRATEGY_OBJECTIVES[strategy]}'
        ),
        'validation': {'valid': not validation_errors, 'errors': validation_errors},
        'baseline_schedule': baseline_rows,
        'proposed_schedule': proposed_rows,
    }


def _schedule_entry(event, original, proposed):
    original_start, original_end = original
    proposed_start, proposed_end = proposed
    return {
        'event_id': str(event.id),
        'name': event.name,
        'venue_space': event.venue_space,
        'is_fixed_time': event.is_fixed_time,
        'original_start': original_start.isoformat(),
        'original_end': original_end.isoformat(),
        'proposed_start': proposed_start.isoformat(),
        'proposed_end': proposed_end.isoformat(),
        'shift_minutes': int((proposed_start - original_start).total_seconds() // 60),
    }