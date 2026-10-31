"""
Wedding Blueprint Intelligence Algorithms:
1. Template Matching Engine
2. Rule-Based Customisation Engine
3. DAG Dependency Management & Topological Sorting
4. Priority-Based Greedy Scheduler
"""

from datetime import timedelta, date
from collections import defaultdict, deque


class WeddingTemplateRegistry:
    """Pre-curated wedding blueprint templates matching different wedding archetypes."""

    TEMPLATES = [
        {
            'code': 'TEMPLATE_ROYAL_PALACE',
            'name': 'Imperial Palace & Heritage Grandeur',
            'min_guests': 250,
            'max_guests': 2000,
            'min_days': 2,
            'theme_affinity': ['royal_heritage', 'plum_antique_gold', 'traditional_vedic'],
            'package_affinity': ['platinum_royal', 'diamond_emperor'],
            'description': 'Designed for multi-day royal palace celebrations with extensive heritage protocol, grand processions, multi-course banquet operations, and VIP guest management.',
            'base_tasks': [
                {'code': 'PALACE_PERMITS', 'title': 'Heritage Property & Fireworks Permissions', 'category': 'Legal & Venue', 'priority': 'critical', 'phase': 'Initiation', 'days_before': 120, 'duration': 14, 'coordinator': 'Legal & Protocol Lead', 'depends_on': []},
                {'code': 'ROYAL_PROCESSION', 'title': 'Procession Logistics (Baraat / Elephants / Vintage Cars)', 'category': 'Logistics', 'priority': 'high', 'phase': 'Vendor Procurement', 'days_before': 90, 'duration': 7, 'coordinator': 'Logistics Director', 'depends_on': ['PALACE_PERMITS']},
                {'code': 'ARTIST_RIDERS', 'title': 'Celebrity / Classical Artist Riders & Sound Check', 'category': 'Entertainment', 'priority': 'high', 'phase': 'Design & Execution', 'days_before': 45, 'duration': 5, 'coordinator': 'Entertainment Manager', 'depends_on': []},
            ]
        },
        {
            'code': 'TEMPLATE_PLUM_GOLD_SIGNATURE',
            'name': 'Plum & Antique Gold Bespoke Collection',
            'min_guests': 80,
            'max_guests': 600,
            'min_days': 1,
            'theme_affinity': ['plum_antique_gold', 'modern_minimalist', 'bohemian_chic'],
            'package_affinity': ['gold_signature', 'platinum_royal'],
            'description': 'Curated high-fashion aesthetic featuring deep velvet plum drape palettes, warm antique gold embellishments, fine dining, and bespoke guest concierges.',
            'base_tasks': [
                {'code': 'MOODBOARD_LOCK', 'title': 'Sign Off Plum & Antique Gold Aesthetic Moodboard', 'category': 'Creative Direction', 'priority': 'critical', 'phase': 'Creative', 'days_before': 110, 'duration': 10, 'coordinator': 'Creative Lead', 'depends_on': []},
                {'code': 'BESPOKE_LIGHTING', 'title': 'Warm Amber & Architectural Up-lighting Rigging', 'category': 'Production', 'priority': 'high', 'phase': 'Production Planning', 'days_before': 60, 'duration': 4, 'coordinator': 'Technical Director', 'depends_on': ['MOODBOARD_LOCK']},
                {'code': 'SIGNATURE_BAR', 'title': 'Curated Mixology & Plum-Gold Signature Cocktails', 'category': 'F&B', 'priority': 'medium', 'phase': 'F&B Procurement', 'days_before': 30, 'duration': 3, 'coordinator': 'Hospitality Lead', 'depends_on': []},
            ]
        },
        {
            'code': 'TEMPLATE_INTIMATE_MODERN',
            'name': 'Contemporary Minimalist Luxury',
            'min_guests': 30,
            'max_guests': 180,
            'min_days': 1,
            'theme_affinity': ['modern_minimalist', 'coastal_breeze'],
            'package_affinity': ['silver_curated', 'gold_signature'],
            'description': 'Focused on high personalization, architectural floral installations, intimate acoustics, and seamless guest hospitality.',
            'base_tasks': [
                {'code': 'INTIMATE_DINING', 'title': 'Tasting Menu & Wine Pairing Finalization', 'category': 'Catering', 'priority': 'high', 'phase': 'F&B Procurement', 'days_before': 75, 'duration': 7, 'coordinator': 'F&B Lead', 'depends_on': []},
                {'code': 'ACOUSTIC_SETUP', 'title': 'Acoustic Sound & Ambient String Quartet Booking', 'category': 'Entertainment', 'priority': 'medium', 'phase': 'Vendor Procurement', 'days_before': 50, 'duration': 3, 'coordinator': 'Entertainment Lead', 'depends_on': []},
            ]
        },
        {
            'code': 'TEMPLATE_DESTINATION_COASTAL',
            'name': 'Coastal Breeze Destination Elite',
            'min_guests': 75,
            'max_guests': 450,
            'min_days': 2,
            'theme_affinity': ['coastal_breeze', 'bohemian_chic'],
            'package_affinity': ['gold_signature', 'platinum_royal', 'diamond_emperor'],
            'description': 'Engineered for luxury beach resorts with weather contingency, charter flights, beachside sound clearances, and multi-hotel room blocks.',
            'base_tasks': [
                {'code': 'WEATHER_CONTINGENCY', 'title': 'Coastal Tide & High Wind Weather Canopy Plan', 'category': 'Production', 'priority': 'critical', 'phase': 'Risk & Safety', 'days_before': 100, 'duration': 7, 'coordinator': 'Operations Lead', 'depends_on': []},
                {'code': 'GUEST_AIRPORT_SHUTTLES', 'title': 'Airport Fleet & Hospitality Desk Setup', 'category': 'Logistics', 'priority': 'high', 'phase': 'Logistics', 'days_before': 40, 'duration': 5, 'coordinator': 'Transport Coordinator', 'depends_on': []},
            ]
        }
    ]

    @classmethod
    def match(cls, guest_count: int, duration_days: int, theme: str, package: str) -> tuple[dict, float]:
        """
        Algorithm 1: Template Matching.
        Scores candidate templates based on guest range, duration suitability,
        theme affinity, and package tier.
        Returns the top matching template and a normalized confidence score (0.0 to 1.0).
        """
        best_template = cls.TEMPLATES[1]  # Default to Plum & Antique Gold
        best_score = 0.0

        for t in cls.TEMPLATES:
            score = 0.0
            # Guest count capacity fit
            if t['min_guests'] <= guest_count <= t['max_guests']:
                score += 35.0
            elif guest_count < t['min_guests']:
                diff = t['min_guests'] - guest_count
                score += max(5.0, 35.0 - (diff * 0.1))
            else:
                diff = guest_count - t['max_guests']
                score += max(5.0, 35.0 - (diff * 0.05))

            # Duration fit
            if duration_days >= t['min_days']:
                score += 25.0
            else:
                score += 10.0

            # Theme affinity
            if theme in t['theme_affinity']:
                score += 25.0
            else:
                score += 8.0

            # Package affinity
            if package in t['package_affinity']:
                score += 15.0
            else:
                score += 5.0

            if score > best_score:
                best_score = score
                best_template = t

        normalized_score = round(min(1.0, best_score / 100.0), 3)
        return best_template, normalized_score


class RuleBasedCustomisationEngine:
    """
    Algorithm 2: Rule-Based Customisation.
    Dynamically generates granular tasks, vendor requirements, resource allocations,
    and payment schedules based on wedding parameters without duplicate task codes.
    """

    CORE_FOUNDATION_TASKS = [
        {'code': 'VENUE_CONTRACT', 'title': 'Finalize & Sign Venue Contract', 'category': 'Venue', 'priority': 'critical', 'phase': 'Foundation', 'days_before': 180, 'duration': 7, 'coordinator': 'Lead Planner', 'depends_on': []},
        {'code': 'BUDGET_ALLOCATION', 'title': 'Approve Detailed Master Budget & Escrow Account', 'category': 'Finance', 'priority': 'critical', 'phase': 'Foundation', 'days_before': 175, 'duration': 5, 'coordinator': 'Finance Director', 'depends_on': ['VENUE_CONTRACT']},
        {'code': 'SAVE_THE_DATE', 'title': 'Dispatch Digital & Print Save the Dates', 'category': 'Stationery', 'priority': 'high', 'phase': 'Guest Operations', 'days_before': 150, 'duration': 10, 'coordinator': 'Guest Relations', 'depends_on': ['VENUE_CONTRACT']},
        {'code': 'DECOR_CONCEPT', 'title': 'Finalize 3D Decor Visualizations & Floral Schematics', 'category': 'Decor', 'priority': 'high', 'phase': 'Design', 'days_before': 120, 'duration': 14, 'coordinator': 'Artistic Director', 'depends_on': ['VENUE_CONTRACT']},
        {'code': 'INVITATIONS_DISPATCH', 'title': 'Courier Luxury Wedding Invitation Hampers', 'category': 'Guest Operations', 'priority': 'high', 'phase': 'Guest Operations', 'days_before': 90, 'duration': 12, 'coordinator': 'Guest Relations', 'depends_on': ['SAVE_THE_DATE']},
        {'code': 'CATERING_MENU_FINAL', 'title': 'Menu Tasting & Final Headcount Guarantee to Chef', 'category': 'Catering', 'priority': 'critical', 'phase': 'F&B', 'days_before': 45, 'duration': 7, 'coordinator': 'F&B Lead', 'depends_on': ['BUDGET_ALLOCATION']},
        {'code': 'SEATING_CHART_LOCK', 'title': 'Lock Master Seating Chart & Table Escort Cards', 'category': 'Guest Operations', 'priority': 'medium', 'phase': 'Guest Operations', 'days_before': 20, 'duration': 5, 'coordinator': 'Hospitality Lead', 'depends_on': ['INVITATIONS_DISPATCH']},
        {'code': 'FINAL_RUN_OF_SHOW', 'title': 'Publish Minute-by-Minute Run of Show & Rehearsal', 'category': 'Production', 'priority': 'critical', 'phase': 'Show Running', 'days_before': 7, 'duration': 2, 'coordinator': 'Master of Ceremonies', 'depends_on': ['DECOR_CONCEPT', 'CATERING_MENU_FINAL']},
        {'code': 'ON_SITE_EXECUTION', 'title': 'Command Centre Live Day-of Coordination', 'category': 'Production', 'priority': 'critical', 'phase': 'Execution', 'days_before': 0, 'duration': 1, 'coordinator': 'Lead Planner', 'depends_on': ['FINAL_RUN_OF_SHOW']},
    ]

    @classmethod
    def generate_tasks(cls, wedding, template: dict) -> list[dict]:
        """Generate deduplicated tasks tailored to guest count, duration, theme, package, and services."""
        task_map: dict[str, dict] = {}
        services = set(wedding.selected_services or [])

        # 1. Add Core Foundation Tasks
        for t in cls.CORE_FOUNDATION_TASKS:
            if t['code'] == 'DECOR_CONCEPT' and 'decor' not in services:
                continue
            if t['code'] == 'CATERING_MENU_FINAL' and 'catering' not in services:
                continue
            task_map[t['code']] = dict(t)

        # 2. Add Template-specific base tasks
        for t in template.get('base_tasks', []):
            category = t.get('category', '').lower()
            if category in {'catering', 'f&b'} and 'catering' not in services:
                continue
            if category == 'decor' and 'decor' not in services:
                continue
            if category == 'photography' and not services.intersection({'photography', 'drone_photography'}):
                continue
            if category == 'entertainment' and not services.intersection(
                {'live_band', 'entertainment', 'fireworks'}
            ):
                continue
            task_map[t['code']] = dict(t)

        run_of_show = task_map.get('FINAL_RUN_OF_SHOW')
        if run_of_show:
            run_of_show['depends_on'] = [
                code for code in run_of_show['depends_on'] if code in task_map
            ]

        # 3. Rule: Guest Count Scaling (>250 guests requires high-capacity infrastructure)
        if wedding.guest_count > 250:
            task_map['HIGH_CAPACITY_SHUTTLES'] = {
                'code': 'HIGH_CAPACITY_SHUTTLES',
                'title': f'Charter Luxury Shuttles & Valet Fleet for {wedding.guest_count} Guests',
                'category': 'Logistics',
                'priority': 'critical',
                'phase': 'Logistics',
                'days_before': 45,
                'duration': 6,
                'coordinator': 'Logistics Lead',
                'depends_on': ['VENUE_CONTRACT']
            }
            if 'catering' in services:
                task_map['DIETARY_RSVP_MATRIX'] = {
                    'code': 'DIETARY_RSVP_MATRIX',
                    'title': 'Allergen & VIP Dietary Preference Audit (>250 pax)',
                    'category': 'Catering',
                    'priority': 'high',
                    'phase': 'F&B',
                    'days_before': 30,
                    'duration': 5,
                    'coordinator': 'F&B Lead',
                    'depends_on': ['INVITATIONS_DISPATCH']
                }

        # 4. Rule: Multi-Day Wedding Duration Scaling (>1 day)
        if wedding.duration_days > 1:
            task_map['MULTI_DAY_HOTEL_BLOCKS'] = {
                'code': 'MULTI_DAY_HOTEL_BLOCKS',
                'title': f'Manage Rooming List & Turn-down Hampers ({wedding.duration_days}-Day Itinerary)',
                'category': 'Hospitality',
                'priority': 'critical',
                'phase': 'Hospitality',
                'days_before': 80,
                'duration': 10,
                'coordinator': 'Hospitality Director',
                'depends_on': ['VENUE_CONTRACT']
            }
            task_map['EVENT_TRANSITION_CREW'] = {
                'code': 'EVENT_TRANSITION_CREW',
                'title': 'Night-time Stage Teardown & Overnight Ballroom Reset Crew',
                'category': 'Production',
                'priority': 'critical',
                'phase': 'Show Running',
                'days_before': 14,
                'duration': 3,
                'coordinator': 'Stage Manager',
                'depends_on': ['DECOR_CONCEPT'] if 'DECOR_CONCEPT' in task_map else ['VENUE_CONTRACT']
            }

        # 5. Rule: Theme-specific additions
        if wedding.theme == 'plum_antique_gold' and 'decor' in services:
            task_map['VELVET_PLUM_DRAPING'] = {
                'code': 'VELVET_PLUM_DRAPING',
                'title': 'Source Custom Plum Velvet Fabric & Antique Gold Gilded Cutlery',
                'category': 'Decor',
                'priority': 'high',
                'phase': 'Design',
                'days_before': 70,
                'duration': 8,
                'coordinator': 'Decor Lead',
                'depends_on': ['DECOR_CONCEPT']
            }
        elif wedding.theme == 'royal_heritage' and (
            'live_band' in services or 'entertainment' in services
        ):
            task_map['ROYAL_SHEHNAI_TROUPE'] = {
                'code': 'ROYAL_SHEHNAI_TROUPE',
                'title': 'Contract Royal Heritage Shehnai Troupe & Classical Performers',
                'category': 'Entertainment',
                'priority': 'medium',
                'phase': 'Vendor Procurement',
                'days_before': 60,
                'duration': 4,
                'coordinator': 'Entertainment Manager',
                'depends_on': ['VENUE_CONTRACT']
            }

        # 6. Rule: Package tier escalations
        if wedding.package in ['platinum_royal', 'diamond_emperor']:
            task_map['VIP_CONCIERGE_DESK'] = {
                'code': 'VIP_CONCIERGE_DESK',
                'title': 'Deploy 24/7 VIP Concierge & Personalized Gifting Team',
                'category': 'Hospitality',
                'priority': 'high',
                'phase': 'Hospitality',
                'days_before': 25,
                'duration': 4,
                'coordinator': 'VIP Concierge Lead',
                'depends_on': ['SAVE_THE_DATE']
            }

        # 7. Rule: Selected Services Integration
        if 'drone_photography' in services or 'photography' in services:
            task_map['DRONE_PERMIT_AND_SHOTLIST'] = {
                'code': 'DRONE_PERMIT_AND_SHOTLIST',
                'title': (
                    'Drone Airspace Permissions & Master Cinematic Shot-List'
                    if 'drone_photography' in services
                    else 'Master Cinematic Shot-List & Photography Schedule'
                ),
                'category': 'Photography',
                'priority': 'high',
                'phase': 'Creative',
                'days_before': 35,
                'duration': 5,
                'coordinator': 'Cinematography Director',
                'depends_on': ['VENUE_CONTRACT']
            }
        if 'live_band' in services or 'entertainment' in services:
            task_map['SOUND_ACOUSTIC_CALIBRATION'] = {
                'code': 'SOUND_ACOUSTIC_CALIBRATION',
                'title': 'Line Array Sound Check & Live Artist Stage Rider Sign-off',
                'category': 'Entertainment',
                'priority': 'high',
                'phase': 'Production Planning',
                'days_before': 15,
                'duration': 2,
                'coordinator': 'Sound Engineer',
                'depends_on': ['DECOR_CONCEPT'] if 'DECOR_CONCEPT' in task_map else ['VENUE_CONTRACT']
            }
        if 'makeup_styling' in services or 'styling' in services:
            task_map['BRIDAL_HAIR_MAKEUP_TRIAL'] = {
                'code': 'BRIDAL_HAIR_MAKEUP_TRIAL',
                'title': 'Complete Bridal Lookbook & Plum-Gold Accent Makeup Trial',
                'category': 'Styling',
                'priority': 'medium',
                'phase': 'Creative',
                'days_before': 40,
                'duration': 2,
                'coordinator': 'Styling Coordinator',
                'depends_on': []
            }
        if 'logistics' in services and wedding.guest_count <= 150 and wedding.duration_days == 1:
            task_map['GUEST_TRANSPORT_PLAN'] = {
                'code': 'GUEST_TRANSPORT_PLAN',
                'title': 'Plan VIP Guest Transport & Arrival Logistics',
                'category': 'Logistics',
                'priority': 'medium',
                'phase': 'Logistics',
                'days_before': 30,
                'duration': 3,
                'coordinator': 'Logistics Lead',
                'depends_on': ['VENUE_CONTRACT'],
            }
        if 'fireworks' in services:
            task_map['FIREWORKS_PERMITS'] = {
                'code': 'FIREWORKS_PERMITS',
                'title': 'Secure Venue & Local Authority Pyrotechnics Permits',
                'category': 'Legal & Venue',
                'priority': 'high',
                'phase': 'Risk & Safety',
                'days_before': 60,
                'duration': 5,
                'coordinator': 'Legal & Protocol Lead',
                'depends_on': ['VENUE_CONTRACT'],
            }

        return list(task_map.values())

    @classmethod
    def generate_vendor_requirements(cls, wedding) -> list[dict]:
        """Derive vendor needs from guest count, venue, and services."""
        guest_count = wedding.guest_count
        budget = float(wedding.budget)
        services = set(wedding.selected_services or [])
        requirements = [{
            'category': 'venue',
            'service_name': f'Luxury Venue ({wedding.venue_name}, {wedding.venue_city})',
            'headcount_capacity': guest_count + 50,
            'budget_weight': 35,
            'target_booking_deadline_days': 180,
            'status': 'Venue Verified',
            'deliverables': ['Main Ballroom', 'Lawn / Outdoor Veranda', 'Bridal Suites (2)', 'Power Backup 100%'],
        }]

        service_requirements = [
            (
                'catering' in services,
                'catering',
                f'Five-Star Live Gourmet Catering ({guest_count} Pax)',
                28,
                120,
                'Requirement Identified',
                ['Multi-Cuisine Live Counters', 'Dessert Atelier', 'Plum & Champagne Mocktail Bar', 'Uniformed Butler Service'],
            ),
            (
                'decor' in services,
                'decor_floral',
                'Theme-Matched Floral Scenography & Event Decor',
                18,
                90,
                'Moodboard In Progress',
                ['Theme-matched floral design', 'Ceremony and reception decor', 'Stage architecture'],
            ),
            (
                bool(services.intersection({'photography', 'drone_photography'})),
                'photography',
                'Wedding Photography & Cinematography',
                10,
                110,
                'Requirement Identified',
                ['Candid photography', 'Wedding film', 'Same-day highlights'],
            ),
            (
                bool(services.intersection({'live_band', 'entertainment', 'fireworks'})),
                'entertainment',
                'Wedding Entertainment & Production',
                5,
                60,
                'Requirement Identified',
                ['Event entertainment', 'Sound and stage production'],
            ),
            (
                bool(services.intersection({'makeup_styling', 'styling'})),
                'makeup_styling',
                'Bridal Styling & Make-up',
                5,
                75,
                'Requirement Identified',
                ['Bridal hair and make-up trials', 'Wedding-day styling'],
            ),
            (
                'logistics' in services or guest_count > 150 or wedding.duration_days > 1,
                'logistics',
                'Guest Chauffeur Fleet & Airport Transfers',
                4,
                45,
                'Requirement Identified',
                ['VIP escort fleet', 'Guest coaches', 'Airport transfers'],
            ),
        ]

        for enabled, category, name, weight, deadline, status, deliverables in service_requirements:
            if enabled:
                requirements.append({
                    'category': category,
                    'service_name': name,
                    'headcount_capacity': guest_count,
                    'budget_weight': weight,
                    'target_booking_deadline_days': deadline,
                    'status': status,
                    'deliverables': deliverables,
                })

        total_weight = sum(requirement['budget_weight'] for requirement in requirements)
        for requirement in requirements:
            weight = requirement.pop('budget_weight')
            requirement['allocated_budget'] = round(budget * weight / total_weight, 2)

        return requirements

    @classmethod
    def generate_resource_requirements(cls, wedding) -> list[dict]:
        """Compute equipment, security, and staff resources required."""
        guests = wedding.guest_count
        theme_linens = {
            'plum_antique_gold': 'Plum & Gold Velvet Table Linens',
            'royal_heritage': 'Heritage Brocade & Antique Gold Table Linens',
            'modern_minimalist': 'Ivory Minimal Table Linens',
            'coastal_breeze': 'Coastal Linen Table Settings',
            'bohemian_chic': 'Botanical Bohemian Table Linens',
            'traditional_vedic': 'Traditional Silk & Gold Table Linens',
        }
        resources = [
            {'resource_name': 'Senior Wedding Coordinators', 'quantity': max(2, guests // 75), 'unit': 'coordinators', 'importance': 'Critical', 'allocated_for_event': 'All Events'},
            {'resource_name': 'Guest Hospitality Helpdesk Consoles', 'quantity': max(1, guests // 100), 'unit': 'desks', 'importance': 'High', 'allocated_for_event': 'Lobby / Arrival'},
            {'resource_name': 'Two-Way Radio Headsets (Noise-Cancelling)', 'quantity': max(6, (guests // 50) + 4), 'unit': 'radios', 'importance': 'Critical', 'allocated_for_event': 'Command Centre'},
            {'resource_name': theme_linens.get(wedding.theme, 'Wedding Theme Table Linens'), 'quantity': max(10, (guests // 8) + 5), 'unit': 'sets', 'importance': 'High', 'allocated_for_event': 'Dinner Reception'},
            {'resource_name': 'Emergency Backup Silent Generators (125 kVA)', 'quantity': 2, 'unit': 'generators', 'importance': 'Critical', 'allocated_for_event': 'Main Stage & Venue'},
            {'resource_name': 'First-Aid Medical & Emergency Response Kit', 'quantity': 2, 'unit': 'kits', 'importance': 'High', 'allocated_for_event': 'Command Centre'}
        ]
        return resources

    @classmethod
    def generate_payment_milestones(cls, wedding) -> list[dict]:
        """Generate structured financial cash-flow milestones according to timeline."""
        total_budget = float(wedding.budget)
        start_date = wedding.start_date

        milestones = [
            {
                'name': 'Initiation Deposit & Venue Lock',
                'percentage': 25.0,
                'amount': round(total_budget * 0.25, 2),
                'due_date': max(date.today(), start_date - timedelta(days=150)),
                'description': 'Locks primary venue holding dates and core agency booking.'
            },
            {
                'name': 'Vendor Procurements & Decor Sign-Off',
                'percentage': 35.0,
                'amount': round(total_budget * 0.35, 2),
                'due_date': max(date.today(), start_date - timedelta(days=90)),
                'description': 'Retainers for catering, lighting production, floral decor, and photography.'
            },
            {
                'name': 'Operational Balance & Production Finalization',
                'percentage': 30.0,
                'amount': round(total_budget * 0.30, 2),
                'due_date': max(date.today(), start_date - timedelta(days=30)),
                'description': 'Full payment for logistics fleets, artist riders, and customized fabrications.'
            },
            {
                'name': 'Final Reconciliation & Post-Event Settlement',
                'percentage': 10.0,
                'amount': round(total_budget * 0.10, 2),
                'due_date': start_date + timedelta(days=3),
                'description': 'Disbursed following final vendor reconciliations and security deposit returns.'
            }
        ]
        return milestones


class DAGSchedulerEngine:
    """
    Algorithms 3 & 4:
    3. Directed Acyclic Graph (DAG) construction & Kahn's Topological Sorting
    4. Priority-Based Greedy Scheduler for Deadline assignments.
    """

    @classmethod
    def validate_and_sort_dag(cls, tasks: list[dict]) -> tuple[list[dict], bool]:
        """
        Builds DAG of tasks and applies Kahn's Topological Sorting Algorithm.
        Detects circular dependencies to ensure deadlock-free project execution.
        """
        task_dict = {t['code']: t for t in tasks}
        in_degree = {code: 0 for code in task_dict}
        adj_list = defaultdict(list)

        # Build graph edges
        for code, t in task_dict.items():
            for parent in t.get('depends_on', []):
                if parent in task_dict:
                    adj_list[parent].append(code)
                    in_degree[code] += 1

        # Queue for nodes with in-degree 0
        queue = deque([code for code, deg in in_degree.items() if deg == 0])
        sorted_codes = []

        while queue:
            curr = queue.popleft()
            sorted_codes.append(curr)

            for neighbor in adj_list[curr]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # Check if all tasks were processed without cycle
        if len(sorted_codes) == len(task_dict):
            ordered_tasks = [task_dict[c] for c in sorted_codes]
            return ordered_tasks, True
        else:
            # Fallback if cycle detected: preserve as-is but flag as false
            return tasks, False

    @classmethod
    def assign_greedy_deadlines(cls, wedding, ordered_tasks: list[dict]) -> list[dict]:
        """
        Algorithm 4: Priority-Based Greedy Scheduling.
        Calculates optimal realistic deadlines working backwards from wedding start date
        and forward from prerequisite completion dates, prioritizing critical path items.
        """
        wedding_date = wedding.start_date
        scheduled = []
        finish_dates = {}

        # Priority weights for slack adjustments
        priority_weights = {
            'critical': 1.2,
            'high': 1.0,
            'medium': 0.8,
            'low': 0.6
        }

        for t in ordered_tasks:
            task = dict(t)
            priority = task.get('priority', 'high')
            days_before = task.get('days_before', 30)
            duration = task.get('duration', 3)

            # Target deadline backwards from wedding day
            initial_target = wedding_date - timedelta(days=days_before)

            # Prerequisite constraint: cannot end before parent finishes
            parent_codes = task.get('depends_on', [])
            earliest_possible = date.today()
            if parent_codes:
                parent_finish_dates = [finish_dates[p] for p in parent_codes if p in finish_dates]
                if parent_finish_dates:
                    max_parent_finish = max(parent_finish_dates)
                    earliest_possible = max_parent_finish + timedelta(days=1)

            # Scheduled deadline
            assigned_deadline = max(initial_target, earliest_possible + timedelta(days=duration))
            if assigned_deadline > wedding_date:
                # Clamp to at least day of wedding if urgent
                assigned_deadline = wedding_date

            # Store finish date
            finish_dates[task['code']] = assigned_deadline
            task['deadline'] = assigned_deadline
            task['is_critical_path'] = (priority in ['critical', 'high'])

            scheduled.append(task)

        return scheduled
