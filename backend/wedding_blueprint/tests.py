from django.test import TestCase
from datetime import date, timedelta
from rest_framework.test import APIClient
from .models import Wedding, TaskStatus
from .services.blueprint_service import BlueprintService


class WeddingBlueprintGeneratorTest(TestCase):
    def test_small_wedding_generation(self):
        """Test small wedding (100 guests, 1 day)"""
        start = date.today() + timedelta(days=90)
        wedding = Wedding.objects.create(
            title="Intimate Soiree",
            couple_names="Aanya & Rohan",
            start_date=start,
            end_date=start,
            duration_days=1,
            guest_count=100,
            budget=1500000.00,
            venue_name="The Oberoi Udaivilas",
            venue_city="Udaipur",
            theme="plum_antique_gold",
            package="gold_signature",
            selected_services=["catering", "decor", "photography", "live_band"]
        )

        blueprint = BlueprintService.generate_or_update_blueprint(wedding.id)
        self.assertIsNotNone(blueprint)
        self.assertTrue(blueprint.dag_topological_valid)
        self.assertGreater(blueprint.tasks.count(), 8)
        self.assertGreater(blueprint.vendor_requirements.count(), 3)
        self.assertGreater(blueprint.payment_milestones.count(), 2)

    def test_large_multi_day_wedding_generation_and_regeneration_preservation(self):
        """Test large wedding (400 guests, 3-day) with preservation of edited/completed tasks"""
        start = date.today() + timedelta(days=120)
        end = start + timedelta(days=2)
        wedding = Wedding.objects.create(
            title="Royal Imperial 3-Day Grandeur",
            couple_names="Meera & Kabir",
            start_date=start,
            end_date=end,
            duration_days=3,
            guest_count=400,
            budget=8500000.00,
            venue_name="Umaid Bhawan Palace",
            venue_city="Jodhpur",
            theme="plum_antique_gold",
            package="platinum_royal",
            selected_services=["catering", "decor", "drone_photography", "makeup_styling", "live_band"]
        )

        blueprint = BlueprintService.generate_or_update_blueprint(wedding.id)
        self.assertTrue(blueprint.dag_topological_valid)

        # Check multi-day and large guest rules triggered
        has_shuttles = blueprint.tasks.filter(code='HIGH_CAPACITY_SHUTTLES').exists()
        has_hotel_blocks = blueprint.tasks.filter(code='MULTI_DAY_HOTEL_BLOCKS').exists()
        self.assertTrue(has_shuttles, "Large guest count should trigger high capacity shuttles")
        self.assertTrue(has_hotel_blocks, "Multi-day wedding should trigger hotel blocks management")

        # Mark a task as completed
        completed_task = blueprint.tasks.filter(code='VENUE_CONTRACT').first()
        completed_task.status = TaskStatus.COMPLETED
        completed_task.save()

        # Manually edit another task
        edited_task = blueprint.tasks.filter(code='BUDGET_ALLOCATION').first()
        edited_task.notes = "Special escrow approved by family elders"
        edited_task.is_manually_edited = True
        edited_task.save()

        # REGENERATE BLUEPRINT
        blueprint_v2 = BlueprintService.generate_or_update_blueprint(wedding.id, force_regenerate=True)
        self.assertEqual(blueprint_v2.version, 2)

        # Verify preservation!
        refreshed_completed = blueprint_v2.tasks.get(code='VENUE_CONTRACT')
        self.assertEqual(refreshed_completed.status, TaskStatus.COMPLETED)

        refreshed_edited = blueprint_v2.tasks.get(code='BUDGET_ALLOCATION')
        self.assertEqual(refreshed_edited.notes, "Special escrow approved by family elders")
        self.assertTrue(refreshed_edited.is_manually_edited)


class WeddingBlueprintApiTest(TestCase):
    def test_setup_generate_and_update_task_flow(self):
        client = APIClient()
        start = date.today() + timedelta(days=120)
        payload = {
            'title': 'Context-aware wedding',
            'couple_names': 'Aanya & Rohan',
            'start_date': start.isoformat(),
            'end_date': (start + timedelta(days=1)).isoformat(),
            'duration_days': 2,
            'guest_count': 320,
            'budget': '4500000.00',
            'venue_name': 'Lake Palace',
            'venue_city': 'Udaipur',
            'theme': 'plum_antique_gold',
            'package': 'platinum_royal',
            'selected_services': ['catering', 'decor', 'drone_photography', 'live_band'],
            'events': [
                {
                    'name': 'Welcome Dinner',
                    'event_order': 1,
                    'date': start.isoformat(),
                    'start_time': '18:00',
                    'end_time': '22:00',
                    'venue_space': 'Courtyard',
                    'expected_guests': 280,
                    'dress_code': 'Festive',
                    'coordinator_name': 'Lead Planner',
                    'notes': 'Welcome event',
                },
            ],
        }

        setup_response = client.post('/api/v1/weddings/', payload, format='json')
        self.assertEqual(setup_response.status_code, 201, setup_response.data)
        wedding = setup_response.data['data']
        self.assertEqual(len(wedding['events']), 1)

        generation_response = client.post(
            f"/api/v1/weddings/{wedding['id']}/blueprint/generate/",
            {},
            format='json',
        )
        self.assertEqual(generation_response.status_code, 200, generation_response.data)
        blueprint = generation_response.data['data']
        self.assertTrue(blueprint['dag_topological_valid'])
        self.assertTrue(blueprint['tasks'])
        self.assertTrue(blueprint['vendor_requirements'])
        self.assertTrue(blueprint['resource_requirements'])
        self.assertTrue(blueprint['payment_milestones'])

        task = blueprint['tasks'][0]
        self.assertTrue(task['deadline'])
        self.assertTrue(task['coordinator_role'])
        update_response = client.put(
            f"/api/v1/tasks/{task['id']}/",
            {'status': TaskStatus.COMPLETED},
            format='json',
        )
        self.assertEqual(update_response.status_code, 200, update_response.data)
        self.assertEqual(update_response.data['data']['status'], TaskStatus.COMPLETED)
        self.assertTrue(update_response.data['data']['is_manually_edited'])

    def test_generation_respects_unselected_services_and_selected_theme(self):
        start = date.today() + timedelta(days=90)
        wedding = Wedding.objects.create(
            title='Minimal one-day celebration',
            couple_names='Mira & Dev',
            start_date=start,
            end_date=start,
            duration_days=1,
            guest_count=100,
            budget=1500000,
            venue_name='Garden House',
            venue_city='Jaipur',
            theme='modern_minimalist',
            package='silver_curated',
            selected_services=[],
        )

        blueprint = BlueprintService.generate_or_update_blueprint(wedding.id)
        task_codes = set(blueprint.tasks.values_list('code', flat=True))
        vendor_categories = set(blueprint.vendor_requirements.values_list('category', flat=True))
        resource_names = set(blueprint.resource_requirements.values_list('resource_name', flat=True))

        self.assertNotIn('DECOR_CONCEPT', task_codes)
        self.assertNotIn('CATERING_MENU_FINAL', task_codes)
        self.assertNotIn('ACOUSTIC_SETUP', task_codes)
        self.assertEqual(vendor_categories, {'venue'})
        self.assertIn('Ivory Minimal Table Linens', resource_names)
        self.assertAlmostEqual(
            sum(float(milestone.percentage) for milestone in blueprint.payment_milestones.all()),
            100.0,
        )
