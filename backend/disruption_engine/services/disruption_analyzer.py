from .recovery_optimizer import build_recovery_plans


def analyze_disruption(incident):
    """Build deterministic recovery candidates for an incident."""
    return build_recovery_plans(incident)