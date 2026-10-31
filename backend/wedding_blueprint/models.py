import uuid
from django.db import models
from django.conf import settings
from common.models import TimeStampedModel, SoftDeleteModel


class WeddingTheme(models.TextChoices):
    ROYAL_HERITAGE = 'royal_heritage', 'Royal Heritage & Palace'
    PLUM_ANTIQUE_GOLD = 'plum_antique_gold', 'Plum & Antique Gold Elegance'
    MODERN_MINIMALIST = 'modern_minimalist', 'Modern Minimalist Luxury'
    COASTAL_BREEZE = 'coastal_breeze', 'Coastal Beach Destination'
    BOHEMIAN_CHIC = 'bohemian_chic', 'Bohemian Botanical'
    TRADITIONAL_VEDIC = 'traditional_vedic', 'Traditional Vedic Grandeur'


class WeddingPackage(models.TextChoices):
    SILVER_CURATED = 'silver_curated', 'Silver Curated Collection'
    GOLD_SIGNATURE = 'gold_signature', 'Gold Signature Experience'
    PLATINUM_ROYAL = 'platinum_royal', 'Platinum Royal Bespoke'
    DIAMOND_EMPEROR = 'diamond_emperor', 'Diamond Imperial Elite'


class BlueprintStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    GENERATING = 'generating', 'Generating'
    ACTIVE = 'active', 'Active & Approved'
    REVISION_REQUESTED = 'revision_requested', 'Revision Requested'
    ARCHIVED = 'archived', 'Archived'


class TaskPriority(models.TextChoices):
    CRITICAL = 'critical', 'Critical (P0)'
    HIGH = 'high', 'High (P1)'
    MEDIUM = 'medium', 'Medium (P2)'
    LOW = 'low', 'Low (P3)'


class TaskStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    IN_PROGRESS = 'in_progress', 'In Progress'
    COMPLETED = 'completed', 'Completed'
    BLOCKED = 'blocked', 'Blocked'


class VendorCategory(models.TextChoices):
    VENUE = 'venue', 'Venue & Hospitality'
    CATERING = 'catering', 'Catering & Beverages'
    PHOTOGRAPHY = 'photography', 'Photography & Cinematography'
    DECOR_FLORAL = 'decor_floral', 'Decor, Floral & Ambience'
    ENTERTAINMENT = 'entertainment', 'DJ, Band & Live Artists'
    MAKEUP_STYLING = 'makeup_styling', 'Bridal Styling & Make-up'
    LOGISTICS = 'logistics', 'Guest Transportation & Logistics'
    PRINT_INVITES = 'print_invites', 'Invitations & Stationery'


class Wedding(SoftDeleteModel):
    """Core wedding representation."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='weddings',
    )
    title = models.CharField(max_length=255, default='Royal Celebration')
    couple_names = models.CharField(max_length=255, help_text='e.g. Aanya & Rohan')
    start_date = models.DateField()
    end_date = models.DateField()
    duration_days = models.PositiveIntegerField(default=1)
    guest_count = models.PositiveIntegerField(default=150)
    budget = models.DecimalField(max_digits=14, decimal_places=2, default=1500000.00)
    venue_name = models.CharField(max_length=255, default='The Taj Palace')
    venue_city = models.CharField(max_length=120, default='Udaipur')
    theme = models.CharField(
        max_length=50,
        choices=WeddingTheme.choices,
        default=WeddingTheme.PLUM_ANTIQUE_GOLD
    )
    package = models.CharField(
        max_length=50,
        choices=WeddingPackage.choices,
        default=WeddingPackage.GOLD_SIGNATURE
    )
    selected_services = models.JSONField(
        default=list,
        help_text='List of selected service slugs e.g. ["catering", "decor", "drone_photography"]'
    )
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.couple_names} ({self.start_date})"


class WeddingEvent(TimeStampedModel):
    """Sub-events of a wedding e.g. Mehendi, Sangeet, Muhurtham, Reception."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.ForeignKey(Wedding, on_delete=models.CASCADE, related_name='events')
    name = models.CharField(max_length=150)
    event_order = models.PositiveIntegerField(default=1)
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    venue_space = models.CharField(max_length=150, blank=True, default='Grand Ballroom')
    expected_guests = models.PositiveIntegerField(default=150)
    dress_code = models.CharField(max_length=120, blank=True, default='Plum & Gold Royal Ethnic')
    coordinator_name = models.CharField(max_length=120, blank=True, default='Lead Coordinator')
    notes = models.TextField(blank=True, default='')
    is_fixed_time = models.BooleanField(default=False)
    recovery_move_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        ordering = ['event_order', 'date', 'start_time']

    def __str__(self):
        return f"{self.name} - {self.wedding.couple_names}"


class WeddingBlueprint(TimeStampedModel):
    """Intelligent generated blueprint linking schedules, tasks, and allocations."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.OneToOneField(Wedding, on_delete=models.CASCADE, related_name='blueprint')
    version = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=30,
        choices=BlueprintStatus.choices,
        default=BlueprintStatus.ACTIVE
    )
    template_code = models.CharField(max_length=100, default='TEMPLATE_HERITAGE_LUXURY')
    template_name = models.CharField(max_length=200, default='Palace Grandeur Gold Template')
    matching_score = models.FloatField(default=0.96)
    dag_topological_valid = models.BooleanField(default=True)
    generation_summary = models.JSONField(default=dict)
    approved_by_planner = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Blueprint v{self.version} for {self.wedding.couple_names}"


class BlueprintTask(TimeStampedModel):
    """A task generated as part of the blueprint with DAG dependencies and scheduling."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blueprint = models.ForeignKey(WeddingBlueprint, on_delete=models.CASCADE, related_name='tasks')
    code = models.CharField(max_length=80, help_text='Unique identifier like VENUE_BOOKING')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=80, default='General')
    phase = models.CharField(max_length=80, default='Pre-Wedding Planning')
    priority = models.CharField(
        max_length=20,
        choices=TaskPriority.choices,
        default=TaskPriority.HIGH
    )
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.PENDING
    )
    deadline = models.DateField(null=True, blank=True)
    estimated_duration_days = models.PositiveIntegerField(default=3)
    coordinator_role = models.CharField(max_length=100, default='Senior Wedding Director')
    depends_on = models.JSONField(default=list, help_text='List of task codes this task depends on')
    is_critical_path = models.BooleanField(default=False)
    is_custom = models.BooleanField(default=False)
    is_manually_edited = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['deadline', 'priority', 'created_at']

    def __str__(self):
        return f"[{self.priority}] {self.title}"


class VendorRequirement(TimeStampedModel):
    """Vendor requirement derived dynamically from the wedding setup."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blueprint = models.ForeignKey(WeddingBlueprint, on_delete=models.CASCADE, related_name='vendor_requirements')
    category = models.CharField(max_length=50, choices=VendorCategory.choices, default=VendorCategory.DECOR_FLORAL)
    service_name = models.CharField(max_length=200)
    headcount_capacity = models.PositiveIntegerField(default=150)
    allocated_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    target_booking_deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Requirement Identified')
    deliverables = models.JSONField(default=list)

    class Meta:
        ordering = ['target_booking_deadline']

    def __str__(self):
        return f"{self.service_name} ({self.category})"


class ResourceRequirement(TimeStampedModel):
    """Equipment, staff, and physical resource requirements."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blueprint = models.ForeignKey(WeddingBlueprint, on_delete=models.CASCADE, related_name='resource_requirements')
    resource_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(max_length=50, default='units')
    allocated_for_event = models.CharField(max_length=150, blank=True, default='All Events')
    importance = models.CharField(max_length=20, default='High')

    class Meta:
        ordering = ['resource_name']

    def __str__(self):
        return f"{self.quantity} {self.unit} - {self.resource_name}"


class PaymentMilestone(TimeStampedModel):
    """Client payment milestones computed according to planning timeline."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blueprint = models.ForeignKey(WeddingBlueprint, on_delete=models.CASCADE, related_name='payment_milestones')
    name = models.CharField(max_length=150)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=25.00)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    due_date = models.DateField()
    status = models.CharField(max_length=30, default='Pending')
    description = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"{self.name} - {self.percentage}% ({self.amount})"
