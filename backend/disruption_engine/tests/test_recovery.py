from datetime import date, time, timedelta
from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from wedding_blueprint.models import Wedding, WeddingEvent
from disruption_engine.models import EventDependency, Incident
from disruption_engine.services.recovery_optimizer import build_recovery_plans


class RecoveryPlanningTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        start = date.today() + timedelta(days=30)
        self.wedding = Wedding.objects.create(
            title='Recovery test wedding',
            couple_names='Maya & Arjun',
            start_date=start,
            end_date=start,
            duration_days=1,
            guest_count=120,
            budget=Decimal('2500000'),
            venue_name='Test Palace',
            venue_city='Udaipur',
        )
        self.ceremony = WeddingEvent.objects.create(
            wedding=self.wedding,
            name='Ceremony',
            event_order=1,
            date=start,
            start_time=time(10, 0),
            end_time=time(11, 0),
            venue_space='Grand Hall',
        )
        self.dinner = WeddingEvent.objects.create(
            wedding=self.wedding,
            name='Dinner',
            event_order=2,
            date=start,
            start_time=time(10, 30),
            end_time=time(11, 30),
            venue_space='Grand Hall',
            recovery_move_cost=Decimal('1000'),
        )
        self.incident = Incident.objects.create(
            wedding=self.wedding,
            affected_event=self.ceremony,
            title='Ceremony setup delayed',
            incident_type='vendor_delay',
            delay_minutes=60,
            cost_per_minute=Decimal('2'),
        )

    def test_analysis_returns_three_validated_strategies_and_cascades_venue_conflict(self):
        plans = build_recovery_plans(self.incident)
        self.assertEqual(
            {plan['strategy'] for plan in plans},
            {'minimum_disruption', 'time_preservation', 'cost_optimisation'},
        )
        minimum = next(plan for plan in plans if plan['strategy'] == 'minimum_disruption')
        moved = {row['name']: row['shift_minutes'] for row in minimum['proposed_schedule']}
        self.assertEqual(moved['Ceremony'], 60)
        self.assertEqual(moved['Dinner'], 90)
        self.assertTrue(minimum['feasible'])
        self.assertEqual(minimum['changed_event_count'], 2)
        cost_plan = next(plan for plan in plans if plan['strategy'] == 'cost_optimisation')
        cost_shifts = {row['name']: row['shift_minutes'] for row in cost_plan['proposed_schedule']}
        self.assertEqual(cost_shifts['Dinner'], 0)
        self.assertEqual(cost_shifts['Ceremony'], 90)
        self.assertLess(cost_plan['estimated_additional_cost'], minimum['estimated_additional_cost'])

    def test_time_preservation_rejects_moving_fixed_event(self):
        self.ceremony.is_fixed_time = True
        self.ceremony.save(update_fields=['is_fixed_time'])
        plans = build_recovery_plans(self.incident)
        time_plan = next(plan for plan in plans if plan['strategy'] == 'time_preservation')
        self.assertFalse(time_plan['feasible'])
        self.assertTrue(any('Fixed-time event' in error for error in time_plan['validation']['errors']))

    def test_dependency_cycle_is_infeasible(self):
        EventDependency.objects.create(
            wedding=self.wedding,
            predecessor_event=self.ceremony,
            successor_event=self.dinner,
            minimum_gap_minutes=0,
        )
        EventDependency.objects.create(
            wedding=self.wedding,
            predecessor_event=self.dinner,
            successor_event=self.ceremony,
            minimum_gap_minutes=0,
        )
        plans = build_recovery_plans(self.incident)
        self.assertTrue(all(not plan['feasible'] for plan in plans))
        self.assertTrue(all(
            any('cycle' in error for error in plan['validation']['errors'])
            for plan in plans
        ))

    def test_api_incident_analysis_approval_and_history(self):
        incident_response = self.client.post(
            f'/api/v1/disruptions/weddings/{self.wedding.id}/incidents/',
            {
                'title': self.incident.title,
                'incident_type': self.incident.incident_type,
                'description': 'Vendor access delay',
                'vendor_impact': 'Floral decor team',
                'affected_event': str(self.ceremony.id),
                'delay_minutes': 60,
                'cost_per_minute': '2.00',
            },
            format='json',
        )
        self.assertEqual(incident_response.status_code, 201, incident_response.data)
        incident_id = incident_response.data['data']['id']
        analysis_response = self.client.post(
            f'/api/v1/disruptions/incidents/{incident_id}/analyze/',
            {},
            format='json',
        )
        self.assertEqual(analysis_response.status_code, 200, analysis_response.data)
        self.assertEqual(len(analysis_response.data['data']['plans']), 3)
        plan = next(
            plan for plan in analysis_response.data['data']['plans']
            if plan['strategy'] == 'minimum_disruption'
        )
        self.assertTrue(plan['feasible'])
        approval_response = self.client.post(
            f'/api/v1/disruptions/incidents/{incident_id}/approve/',
            {'recovery_plan_id': plan['id']},
            format='json',
        )
        self.assertEqual(approval_response.status_code, 200, approval_response.data)
        self.ceremony.refresh_from_db()
        self.assertEqual(self.ceremony.start_time, time(11, 0))
        history_response = self.client.get(
            f'/api/v1/disruptions/incidents/{incident_id}/history/'
        )
        self.assertEqual(history_response.status_code, 200)
        self.assertEqual(len(history_response.data['data']), 3)
