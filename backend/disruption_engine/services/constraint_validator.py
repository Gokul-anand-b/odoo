from collections import defaultdict
from datetime import datetime, timedelta


def validate_recovery_schedule(events, schedule, dependencies, wedding, enforce_fixed_times=True):
    errors = []
    for event in events:
        start, end = schedule[event.id]
        if start.date() < wedding.start_date or end.date() > wedding.end_date + timedelta(days=1):
            errors.append(f'"{event.name}" falls outside the wedding date range.')
        if enforce_fixed_times and event.is_fixed_time:
            original_start = datetime.combine(event.date, event.start_time)
            if start != original_start:
                errors.append(f'Fixed-time event "{event.name}" was moved.')

    for dependency in dependencies:
        predecessor = schedule.get(dependency.predecessor_event_id)
        successor = schedule.get(dependency.successor_event_id)
        if predecessor and successor:
            required_start = predecessor[1] + timedelta(minutes=dependency.minimum_gap_minutes)
            if successor[0] < required_start:
                errors.append(
                    f'"{dependency.successor_event.name}" violates its dependency minimum gap.'
                )

    venues = defaultdict(list)
    for event in events:
        venue = event.venue_space.strip().casefold()
        if venue:
            venues[venue].append((event, schedule[event.id]))

    for venue_events in venues.values():
        venue_events.sort(key=lambda item: item[1][0])
        for (first, (_, first_end)), (second, (second_start, _)) in zip(
            venue_events, venue_events[1:]
        ):
            if second_start < first_end:
                errors.append(f'"{first.name}" overlaps "{second.name}" in the same venue.')
    return list(dict.fromkeys(errors))