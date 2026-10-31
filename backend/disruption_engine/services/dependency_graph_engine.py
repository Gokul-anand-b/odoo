import heapq
from collections import defaultdict

from disruption_engine.models import RecoveryStrategy


def topological_event_order(events, dependencies, strategy=None):
    event_ids = {event.id for event in events}
    indegree = {event.id: 0 for event in events}
    successors = defaultdict(list)

    for dependency in dependencies:
        predecessor = dependency.predecessor_event_id
        successor = dependency.successor_event_id
        if predecessor in event_ids and successor in event_ids:
            successors[predecessor].append(successor)
            indegree[successor] += 1

    by_id = {event.id: event for event in events}

    def priority(event):
        baseline = (event.date, event.event_order, event.start_time.isoformat() if event.start_time else '')
        if strategy == RecoveryStrategy.TIME_PRESERVATION:
            return (0 if event.is_fixed_time else 1, *baseline, str(event.id))
        if strategy == RecoveryStrategy.COST_OPTIMISATION:
            return (-event.recovery_move_cost, *baseline, str(event.id))
        return (*baseline, str(event.id))

    ready = [
        (*priority(by_id[event_id]), event_id)
        for event_id in indegree
        if indegree[event_id] == 0
    ]
    heapq.heapify(ready)
    ordered_ids = []
    while ready:
        *_, event_id = heapq.heappop(ready)
        ordered_ids.append(event_id)
        for successor in successors[event_id]:
            indegree[successor] -= 1
            if indegree[successor] == 0:
                heapq.heappush(ready, (*priority(by_id[successor]), successor))
    if len(ordered_ids) != len(events):
        return None
    return ordered_ids