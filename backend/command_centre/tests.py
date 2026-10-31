from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from vendor_intelligence.models import Vendor
from wedding_blueprint.models import (
    BlueprintTask,
    Wedding,
    WeddingBlueprint,
    WeddingEvent,
)

from .models import EventOperations, WeddingVendorAssignment


class CommandCentreApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        today = timezone.localdate()
        self.wedding = Wedding.objects.create(
            couple_names='Aanya & Rohan',
            start_date=today,
            end_date=today + timedelta(days=1),
            venue_name='Lake Palace',
            venue_city='Udaipur',
        )
        self.blueprint = WeddingBlueprint.objects.create(wedding=self.wedding)
        now = timezone.localtime()
        first_start = now - timedelta(minutes=5)
        first_end = now + timedelta(minutes=55)
        second_start = now + timedelta(minutes=30)
        second_end = now + timedelta(hours=2)
        self.first_event = WeddingEvent.objects.create(
            wedding=self.wedding,
            name='Mehendi',
            event_order=1,
            date=first_start.date(),
            start_time=first_start.time().replace(second=0, microsecond=0),
            end_time=first_end.time().replace(second=0, microsecond=0),
            venue_space='Garden',
        )
        self.second_event = WeddingEvent.objects.create(
            wedding=self.wedding,
            name='Sangeet',
            event_order=2,
            date=second_start.date(),
            start_time=second_start.time().replace(second=0, microsecond=0),
            end_time=second_end.time().replace(second=0, microsecond=0),
            venue_space='Courtyard',
        )
        self.task = BlueprintTask.objects.create(
            blueprint=self.blueprint,
            code='DECOR_SETUP',
            title='Decor setup',
            deadline=today - timedelta(days=1),
            status='blocked',
            depends_on=['VENUE_READY'],
        )
        self.vendor = Vendor.objects.create(
            id='vendor-command-test',
            name='Real Directory Vendor',
            category='Royal Decor & Floral',
        )

    def test_dashboard_uses_blueprint_data_without_creating_event_state(self):
        response = self.client.get(
            f'/api/v1/command-centre/weddings/{self.wedding.id}/dashboard/'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['data']['wedding']['couple_names'], 'Aanya & Rohan')
        self.assertEqual(len(response.data['data']['events']), 2)
        self.assertEqual(response.data['data']['events'][0]['status'], 'upcoming')
        self.assertEqual(response.data['data']['tasks'][0]['code'], 'DECOR_SETUP')
        self.assertEqual(EventOperations.objects.count(), 0)
        self.assertTrue(any(
            alert['source_type'] == 'task'
            for alert in response.data['data']['alerts']
        ))

    def test_delayed_event_alert_identifies_downstream_event(self):
        response = self.client.patch(
            f'/api/v1/command-centre/weddings/{self.wedding.id}/events/{self.first_event.id}/',
            {'status': 'delayed', 'delay_reason': 'Setup ran late'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(EventOperations.objects.filter(
            event=self.first_event,
            status='delayed',
        ).exists())
        dashboard = self.client.get(
            f'/api/v1/command-centre/weddings/{self.wedding.id}/dashboard/'
        ).data['data']
        delay_alert = next(
            alert for alert in dashboard['alerts']
            if alert['id'] == f'event-delay-{self.first_event.id}'
        )
        self.assertIn('Sangeet', delay_alert['affected_events'])

    def test_overlapping_events_in_same_space_raise_schedule_conflict(self):
        self.second_event.venue_space = self.first_event.venue_space
        self.second_event.save(update_fields=['venue_space'])

        dashboard = self.client.get(
            f'/api/v1/command-centre/weddings/{self.wedding.id}/dashboard/'
        ).data['data']
        conflict = next(
            alert for alert in dashboard['alerts']
            if alert['id'] == f'event-conflict-{self.first_event.id}-{self.second_event.id}'
        )

        self.assertIn('Sangeet', conflict['affected_events'])
        self.assertEqual(conflict['severity'], 'high')

    def test_vendor_assignment_and_check_in_are_persisted(self):
        assignment_response = self.client.post(
            f'/api/v1/command-centre/weddings/{self.wedding.id}/vendors/',
            {'vendor': self.vendor.id, 'event': str(self.first_event.id)},
            format='json',
        )

        self.assertEqual(assignment_response.status_code, 201)
        assignment_id = assignment_response.data['data']['id']
        checkin_response = self.client.patch(
            f'/api/v1/command-centre/weddings/{self.wedding.id}/vendors/{assignment_id}/',
            {'status': 'checked_in'},
            format='json',
        )

        self.assertEqual(checkin_response.status_code, 200)
        assignment = WeddingVendorAssignment.objects.get(pk=assignment_id)
        self.assertEqual(assignment.status, 'checked_in')
        self.assertIsNotNone(assignment.actual_arrival)
