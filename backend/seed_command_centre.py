"""
Command Centre Seed Script
Seeds the SQLite database with the full Samar & Alizeh Royal Wedding operational data.
Run from backend/: python seed_command_centre.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'demo_config.settings')
django.setup()

from command_centre.models import (
    WeddingEvent,
    TaskItem,
    VendorTrackingItem,
    DelayDetectionItem,
    DependencyImpactItem,
    AlertItem,
)


def clear_data():
    print("Clearing existing Command Centre data...")
    AlertItem.objects.all().delete()
    DependencyImpactItem.objects.all().delete()
    DelayDetectionItem.objects.all().delete()
    VendorTrackingItem.objects.all().delete()
    TaskItem.objects.all().delete()
    WeddingEvent.objects.all().delete()
    print("  ✓ Cleared all command_centre records.")


def seed_events():
    print("Seeding Wedding Events...")
    events = [
        WeddingEvent(
            id='evt-01',
            name='Royal Welcome & Hi-Tea',
            ceremony_type='Mehendi',
            venue_location='Zenana Mahal Courtyard',
            scheduled_start_time='11:00 AM',
            scheduled_end_time='02:30 PM',
            actual_start_time='11:10 AM',
            actual_end_time='02:35 PM',
            status='Completed',
            delay_minutes=5,
            guest_count=450,
            lead_coordinator='Pooja Kashyap',
            key_vendors=['Mewar Royal Culinary', 'Chundawat Floral Decor'],
            notes='Ran smoothly. Hi-tea chaat stations cleared on time.',
        ),
        WeddingEvent(
            id='evt-02',
            name='Sufi Sangeet & Musical Night',
            ceremony_type='Sangeet',
            venue_location='Manek Chowk Amphitheatre',
            scheduled_start_time='07:30 PM',
            scheduled_end_time='11:45 PM',
            actual_start_time='07:45 PM',
            actual_end_time='12:15 AM',
            status='Completed',
            delay_minutes=30,
            guest_count=520,
            lead_coordinator='Rohan Mehra',
            key_vendors=['Desert Echoes Folk Band', 'Udaivilas Cinematics', 'Imperial Stage Trussing'],
            notes='Celebration extended past midnight. Sound curfew permit handled.',
        ),
        WeddingEvent(
            id='evt-03',
            name='Groom Royal Baraat & Vintage Fleet',
            ceremony_type='Baraat',
            venue_location='Hathi Pol Outer Gate to Badi Pol',
            scheduled_start_time='04:00 PM',
            scheduled_end_time='05:30 PM',
            actual_start_time='04:20 PM',
            status='In Progress',
            delay_minutes=20,
            guest_count=380,
            lead_coordinator='Vikramaditya Rathore',
            key_vendors=['Rajputana Vintage Wheels', 'Jaipur Royal Dhol Tasha Troupe', 'City Security Team'],
            notes='Procession currently crossing Tripoliya Gate. Escort pacing adjusted.',
        ),
        WeddingEvent(
            id='evt-04',
            name='Varmala & Floating Lotus Mandap Pheras',
            ceremony_type='Pheras',
            venue_location='Jagmandir Island Palace Pier',
            scheduled_start_time='06:00 PM',
            scheduled_end_time='08:30 PM',
            status='Delayed',
            delay_minutes=25,
            guest_count=500,
            lead_coordinator='Ananya Verma',
            key_vendors=['Chundawat Royal Mandap', 'Mewar Royal Culinary', 'Shahi Panditji Council'],
            notes='Auspicious Muhurat starts 06:45 PM. Guest boat transfer buffering underway.',
        ),
        WeddingEvent(
            id='evt-05',
            name='Imperial Royal Wedding Banquet',
            ceremony_type='Reception',
            venue_location='Durbar Hall Grand Pavilion',
            scheduled_start_time='08:45 PM',
            scheduled_end_time='11:30 PM',
            status='Upcoming',
            delay_minutes=0,
            guest_count=550,
            lead_coordinator='Kavita Chawla',
            key_vendors=['Mewar Royal Culinary', 'Udaivilas Cinematics'],
            notes='Silverware plating setup 85% ready.',
        ),
        WeddingEvent(
            id='evt-06',
            name='Starlight Lakefront After-Party',
            ceremony_type='Reception',
            venue_location='Lake Pichola Promenade',
            scheduled_start_time='11:45 PM',
            scheduled_end_time='02:30 AM',
            status='Upcoming',
            delay_minutes=0,
            guest_count=260,
            lead_coordinator='Devansh Singhania',
            key_vendors=['Club Resonance DJ', 'Molecular Mixology Studio'],
            notes='Acoustic glass shielding confirmed with palace authority.',
        ),
    ]
    WeddingEvent.objects.bulk_create(events)
    print(f"  ✓ Created {len(events)} wedding events.")
    return {e.id: e for e in events}


def seed_tasks(events):
    print("Seeding Task Items...")
    tasks = [
        TaskItem(
            id='tsk-101',
            event=events.get('evt-03'),
            event_name='Royal Baraat',
            title='Vintage 1936 Rolls Royce & Chariot Final Inspection',
            category='Logistics',
            assigned_to='Mahavir Bhati',
            assigned_role='Fleet Captain',
            scheduled_start='03:00 PM',
            scheduled_end='03:45 PM',
            progress_percent=100,
            status='Completed',
            priority='High',
            delay_minutes=0,
        ),
        TaskItem(
            id='tsk-102',
            event=events.get('evt-03'),
            event_name='Royal Baraat',
            title='Palace Security & Crowd Barrier Clearance at Tripoliya',
            category='Security',
            assigned_to='Inspector R.S. Shekhawat',
            assigned_role='Palace Liaison',
            scheduled_start='03:30 PM',
            scheduled_end='04:00 PM',
            progress_percent=100,
            status='Completed',
            priority='Critical',
            delay_minutes=0,
        ),
        TaskItem(
            id='tsk-103',
            event=events.get('evt-03'),
            event_name='Royal Baraat',
            title='Dhol Tasha Troupe Synchronized Entry Pacing',
            category='Sound & Light',
            assigned_to='Gopal Soni',
            assigned_role='Cultural Coordinator',
            scheduled_start='04:00 PM',
            scheduled_end='05:15 PM',
            progress_percent=65,
            status='Ongoing',
            priority='Medium',
            delay_minutes=15,
        ),
        TaskItem(
            id='tsk-104',
            event=events.get('evt-04'),
            event_name='Varmala & Pheras',
            title='Floating Lotus Mandap Floral Garland Chandelier Rigging',
            category='Decor & Mandap',
            assigned_to='Devendra Singh Chundawat',
            assigned_role='Lead Decorator',
            scheduled_start='03:45 PM',
            scheduled_end='05:15 PM',
            progress_percent=80,
            status='Delayed',
            priority='Critical',
            delay_minutes=25,
            dependent_task_ids=['tsk-105', 'tsk-106'],
        ),
        TaskItem(
            id='tsk-105',
            event=events.get('evt-04'),
            event_name='Varmala & Pheras',
            title='Dry Ice Foggers & Cold Pyro Testing for Varmala Moment',
            category='Sound & Light',
            assigned_to='Sameer Sheikh',
            assigned_role='SFX Specialist',
            scheduled_start='05:15 PM',
            scheduled_end='05:45 PM',
            progress_percent=40,
            status='Ongoing',
            priority='High',
            delay_minutes=20,
            dependent_task_ids=['tsk-104'],
        ),
        TaskItem(
            id='tsk-106',
            event=events.get('evt-04'),
            event_name='Varmala & Pheras',
            title='Vedic Fire Altar (Havan Kund) Wood & Pure Ghee Blessing',
            category='Decor & Mandap',
            assigned_to='Pandit Radheshyam Joshi',
            assigned_role='Head Priest',
            scheduled_start='05:30 PM',
            scheduled_end='06:00 PM',
            progress_percent=30,
            status='Pending',
            priority='High',
            delay_minutes=0,
        ),
        TaskItem(
            id='tsk-107',
            event=events.get('evt-05'),
            event_name='Imperial Royal Banquet',
            title='Silverware Table Laying & 52-dish Live Station Prep',
            category='Catering',
            assigned_to='Chef Raghuvendra Rathore',
            assigned_role='Executive Chef',
            scheduled_start='05:00 PM',
            scheduled_end='07:30 PM',
            progress_percent=60,
            status='Ongoing',
            priority='High',
            delay_minutes=0,
        ),
        TaskItem(
            id='tsk-108',
            event=events.get('evt-05'),
            event_name='Imperial Royal Banquet',
            title='Sommelier Wine Decanting & Artisanal Mocktail Station',
            category='Catering',
            assigned_to='Nikhil Mathur',
            assigned_role='Beverage Manager',
            scheduled_start='06:30 PM',
            scheduled_end='08:00 PM',
            progress_percent=0,
            status='Pending',
            priority='Medium',
            delay_minutes=0,
        ),
        TaskItem(
            id='tsk-109',
            event=events.get('evt-06'),
            event_name='Starlight After-Party',
            title='Lake Promenade Acoustic Barrier & Sound Check',
            category='Sound & Light',
            assigned_to='DJ Arman Malik',
            assigned_role='Music Director',
            scheduled_start='07:00 PM',
            scheduled_end='08:30 PM',
            progress_percent=0,
            status='Pending',
            priority='Low',
            delay_minutes=0,
        ),
    ]
    TaskItem.objects.bulk_create(tasks)
    print(f"  ✓ Created {len(tasks)} task items.")


def seed_vendors():
    print("Seeding Vendor Tracking Items...")
    vendors = [
        VendorTrackingItem(
            id='vnd-01',
            vendor_name='Mewar Royal Culinary & Banquets',
            service_category='Catering & Banquets',
            contact_person='Chef Raghuvendra Singh',
            phone='+91 98290 41234',
            assigned_event='Imperial Royal Banquet',
            expected_arrival_time='01:00 PM',
            actual_arrival_time='12:45 PM',
            check_in_status='Checked-In',
            gate_location='Gate 4 - Kitchen Bay',
            poc_coordinator='Pooja Kashyap',
            delay_minutes=0,
            equipment_status='Clear',
        ),
        VendorTrackingItem(
            id='vnd-02',
            vendor_name='Chundawat Royal Mandap & Floral Decor',
            service_category='Royal Decor & Floral',
            contact_person='Devendra Singh Chundawat',
            phone='+91 98292 99182',
            assigned_event='Floating Lotus Mandap Pheras',
            expected_arrival_time='02:00 PM',
            actual_arrival_time='02:35 PM',
            check_in_status='Delayed',
            gate_location='Gate 2 - Jagmandir Boat Jetty',
            poc_coordinator='Ananya Verma',
            delay_minutes=35,
            equipment_status='Offloading',
        ),
        VendorTrackingItem(
            id='vnd-03',
            vendor_name='Rajputana Vintage Wheels',
            service_category='Royal Logistics',
            contact_person='Mahavir Bhati',
            phone='+91 94144 55112',
            assigned_event='Groom Royal Baraat',
            expected_arrival_time='02:30 PM',
            actual_arrival_time='02:20 PM',
            check_in_status='Checked-In',
            gate_location='Gate 1 - Royal Entrance',
            poc_coordinator='Vikramaditya Rathore',
            delay_minutes=0,
            equipment_status='Clear',
        ),
        VendorTrackingItem(
            id='vnd-04',
            vendor_name='Udaivilas Cinematics & Portraits',
            service_category='Photography & 4K Drone',
            contact_person='Tanmay Saxena',
            phone='+91 99280 66712',
            assigned_event='Full Day Coverage',
            expected_arrival_time='10:00 AM',
            actual_arrival_time='09:50 AM',
            check_in_status='Checked-In',
            gate_location='Gate 1 - Media Center',
            poc_coordinator='Rohan Mehra',
            delay_minutes=0,
            equipment_status='Clear',
        ),
        VendorTrackingItem(
            id='vnd-05',
            vendor_name='Royal Fireworks & SFX Studio',
            service_category='Pyrotechnics & Mist',
            contact_person='Sameer Sheikh',
            phone='+91 98285 22199',
            assigned_event='Varmala & Pheras',
            expected_arrival_time='03:30 PM',
            actual_arrival_time='04:10 PM',
            check_in_status='En Route',
            gate_location='Gate 3 - Jagmandir Pier',
            poc_coordinator='Ananya Verma',
            delay_minutes=20,
            equipment_status='Pending Inspection',
        ),
        VendorTrackingItem(
            id='vnd-06',
            vendor_name='Club Resonance Sound & Trusses',
            service_category='Sound & Audio Production',
            contact_person='Karan Virani',
            phone='+91 98293 88120',
            assigned_event='Starlight After-Party',
            expected_arrival_time='06:00 PM',
            check_in_status='Pending',
            gate_location='Gate 5 - Promenade Bay',
            poc_coordinator='Devansh Singhania',
            delay_minutes=0,
            equipment_status='Pending Inspection',
        ),
    ]
    VendorTrackingItem.objects.bulk_create(vendors)
    print(f"  ✓ Created {len(vendors)} vendor tracking items.")


def seed_delays():
    print("Seeding Delay Detection Items...")
    delays = [
        DelayDetectionItem(
            id='dly-01',
            source_type='Vendor',
            entity_name='Chundawat Royal Mandap Floral Truck',
            delay_minutes=35,
            severity='High',
            root_cause='Narrow lane congestion around City Palace Tripoliya gate delayed heavy florist flatbed truck.',
            detected_at='03:15 PM',
            impact_summary='Lotus Mandap final floral draping delayed by ~25 minutes. Phera setup under time compression.',
            cascading_risk_level='High',
            status='Active',
        ),
        DelayDetectionItem(
            id='dly-02',
            source_type='Event',
            entity_name='Baraat Procession Crossing Tripoliya',
            delay_minutes=20,
            severity='Medium',
            root_cause='Groom party celebratory dhol circles extended procession duration beyond allocated schedule.',
            detected_at='04:35 PM',
            impact_summary='Baraat arrival at Welcome Toran delayed from 05:30 PM to ~05:50 PM.',
            cascading_risk_level='Moderate',
            status='Mitigating',
        ),
        DelayDetectionItem(
            id='dly-03',
            source_type='Task',
            entity_name='Dry Ice Foggers & Pyro Testing',
            delay_minutes=20,
            severity='Medium',
            root_cause='Palace electrical safety compliance inspector requested redundant grounding before arming fireworks.',
            detected_at='04:50 PM',
            impact_summary='Testing pushed from 05:15 PM to 05:35 PM. Must sync with bride grand boat entrance.',
            cascading_risk_level='Moderate',
            status='Mitigating',
        ),
    ]
    DelayDetectionItem.objects.bulk_create(delays)
    print(f"  ✓ Created {len(delays)} delay detection items.")


def seed_dependencies():
    print("Seeding Dependency Impact Items...")
    deps = [
        DependencyImpactItem(
            id='dep-01',
            bottleneck_id='dly-01',
            bottleneck_name='Lotus Mandap Floral Rigging Delay',
            bottleneck_type='Vendor',
            affected_activity='Bride Grand Entry on Shikara & Varmala Exchange',
            scheduled_time='06:00 PM',
            projected_slip_minutes=25,
            cascading_risk='Severe',
            suggested_action='Route 6 secondary crew members from Zenana Mahal teardown to assist floral unboxing immediately.',
            status='Open',
        ),
        DependencyImpactItem(
            id='dep-02',
            bottleneck_id='dly-02',
            bottleneck_name='Baraat Procession 20m Delay',
            bottleneck_type='Task',
            affected_activity='Milni & Toran Welcome Ceremony at Badi Pol',
            scheduled_time='05:30 PM',
            projected_slip_minutes=20,
            cascading_risk='Moderate',
            suggested_action='Notify Milni welcoming elders (Thakur family) to hold stations; serve rose-sherbet refreshments.',
            status='Open',
        ),
        DependencyImpactItem(
            id='dep-03',
            bottleneck_id='dly-01',
            bottleneck_name='Varmala Timeline Push',
            bottleneck_type='Vendor',
            affected_activity='Auspicious Muhurat Pheras Start',
            scheduled_time='06:45 PM',
            projected_slip_minutes=15,
            cascading_risk='High',
            suggested_action='Consult Panditji to prioritize core Vedic mantras first; overlap instrumental shehnai interludes.',
            status='Open',
        ),
        DependencyImpactItem(
            id='dep-04',
            bottleneck_id='dly-02',
            bottleneck_name='Baraat Extended Pacing',
            bottleneck_type='Task',
            affected_activity='Durbar Hall Banquet Welcome Drinks',
            scheduled_time='08:45 PM',
            projected_slip_minutes=10,
            cascading_risk='Low',
            suggested_action='Buffered in original schedule. Banquet service will absorb the 10 min variance without dining disruption.',
            status='Mitigated',
        ),
    ]
    DependencyImpactItem.objects.bulk_create(deps)
    print(f"  ✓ Created {len(deps)} dependency impact items.")


def seed_alerts():
    print("Seeding Alert Items...")
    alerts = [
        AlertItem(
            id='alt-01',
            title='Mandap Floral Rigging Behind Schedule',
            description='Chundawat Decor reported 25-minute delay on lotus canopy arches. Potential conflict with 06:45 PM Muhurat.',
            severity='High',
            category='Schedule Delay',
            timestamp='16:05 (10 mins ago)',
            acknowledged=False,
            action_required=True,
            action_label='Deploy Backup Rigging Crew',
        ),
        AlertItem(
            id='alt-02',
            title='SFX Pyro Safety Grounding Pending Inspector Sign-Off',
            description='Palace Electrical Authority has temporarily placed Jagmandir pier cold pyros on safety hold.',
            severity='Critical',
            category='Capacity & Power',
            timestamp='15:52 (23 mins ago)',
            acknowledged=False,
            action_required=True,
            action_label='Escalate to Palace Liaison',
        ),
        AlertItem(
            id='alt-03',
            title='Baraat Procession Pace Variance (+20 min)',
            description='Tripoliya gate crossing is taking longer than planned due to dhol celebration enthusiasm.',
            severity='Medium',
            category='Schedule Delay',
            timestamp='15:40 (35 mins ago)',
            acknowledged=True,
            acknowledged_by='Vikramaditya (Lead Coordinator)',
            action_required=False,
            action_label='View Gate Live Feed',
        ),
        AlertItem(
            id='alt-04',
            title='Lake Pichola Boat Transfer Wave 2 Boarding Complete',
            description='180 guests safely ferried across to Jagmandir Palace. Life jackets and royal hospitality protocols met.',
            severity='Low',
            category='Protocol & VIP',
            timestamp='15:15 (60 mins ago)',
            acknowledged=True,
            acknowledged_by='Pooja Kashyap',
            action_required=False,
        ),
    ]
    AlertItem.objects.bulk_create(alerts)
    print(f"  ✓ Created {len(alerts)} alert items.")


if __name__ == '__main__':
    print("=" * 60)
    print("  WedPilot AI — Command Centre Seed Script")
    print("  Samar & Alizeh Royal Wedding · City Palace, Udaipur")
    print("=" * 60)

    clear_data()
    events = seed_events()
    seed_tasks(events)
    seed_vendors()
    seed_delays()
    seed_dependencies()
    seed_alerts()

    print()
    print("=" * 60)
    print("  ✅ All command centre operational data seeded!")
    print("  🌐 API: http://127.0.0.1:8000/api/command-centre/")
    print("=" * 60)
