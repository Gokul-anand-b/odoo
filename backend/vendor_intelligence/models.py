import uuid
from django.db import models

class VendorCategory(models.TextChoices):
    CATERING = 'Catering & Banquets', 'Catering & Banquets'
    DECOR = 'Royal Decor & Floral', 'Royal Decor & Floral'
    PHOTOGRAPHY = 'Photography & Cinematography', 'Photography & Cinematography'
    VENUE = 'Palace Venues', 'Palace Venues'
    ENTERTAINMENT = 'Live Entertainment & Folk', 'Live Entertainment & Folk'
    STYLING = 'Bridal Styling & Mehendi', 'Bridal Styling & Mehendi'
    LOGISTICS = 'Royal Logistics & Vintage Fleet', 'Royal Logistics & Vintage Fleet'
    LIGHTING = 'Lighting & Production', 'Lighting & Production'

class VendorTier(models.TextChoices):
    HERITAGE_LUXE = 'Heritage Luxe', 'Heritage Luxe'
    PREMIUM_ROYAL = 'Premium Royal', 'Premium Royal'
    BOUTIQUE_ELITE = 'Boutique Elite', 'Boutique Elite'

class QuoteStatus(models.TextChoices):
    DRAFT = 'Draft', 'Draft'
    UNDER_REVIEW = 'Under Review', 'Under Review'
    AI_ANALYZED = 'AI Analyzed', 'AI Analyzed'
    SHORTLISTED = 'Shortlisted', 'Shortlisted'
    SELECTED = 'Selected', 'Selected'
    REJECTED = 'Rejected', 'Rejected'
    CLOSED = 'Closed', 'Closed'

class Vendor(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=64, choices=VendorCategory.choices)
    tier = models.CharField(max_length=32, choices=VendorTier.choices, default=VendorTier.PREMIUM_ROYAL)
    rating = models.FloatField(default=4.8)
    review_count = models.IntegerField(default=1)
    city = models.CharField(max_length=128, default='Udaipur, Rajasthan')
    contact_person = models.CharField(max_length=128, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    experience_years = models.IntegerField(default=5)
    completed_weddings_count = models.IntegerField(default=10)
    verified = models.BooleanField(default=True)
    specialties = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class Quotation(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    quote_number = models.CharField(max_length=64, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='quotations')
    wedding_name = models.CharField(max_length=255, default='Samar & Alizeh Royal Wedding')
    wedding_date = models.CharField(max_length=128, default='Nov 18-20, 2026')
    status = models.CharField(max_length=32, choices=QuoteStatus.choices, default=QuoteStatus.UNDER_REVIEW)
    submission_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField(null=True, blank=True)
    
    # Financials
    base_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    taxes_gst = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    price_per_plate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    minimum_guest_guarantee = models.IntegerField(default=500, null=True, blank=True)
    
    # AI True Cost Calculations (Signature Novelty)
    hidden_costs_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    missing_inclusions_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    true_estimated_landed_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    value_score = models.IntegerField(default=80)
    
    # Metadata
    pdf_file_name = models.CharField(max_length=255, blank=True)
    overtime_hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=20000.0)
    advance_payment_percentage = models.IntegerField(default=40)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-value_score', 'base_price']

    def __str__(self):
        return f"{self.quote_number} - {self.vendor.name}"


class QuoteLineItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    unit = models.CharField(max_length=32, default='Guests')
    quantity = models.FloatField(default=1.0)
    unit_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_rate = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    is_included = models.BooleanField(default=True)
    notes = models.TextField(blank=True)


class HiddenCostItem(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='hidden_costs')
    label = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    risk_level = models.CharField(max_length=16, default='Medium') # High, Medium, Low
    reason = models.TextField(blank=True)
    category = models.CharField(max_length=64, default='Service Fee') # Overtime, Power/Fuel, Corkage, Service Fee, Breakage Deposit


class MissingInclusion(models.Model):
    id = models.CharField(max_length=64, primary_key=True, default=uuid.uuid4)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='missing_inclusions')
    item = models.CharField(max_length=255)
    industry_standard = models.TextField(blank=True)
    vendor_provision = models.TextField(blank=True)
    estimated_fix_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    severity = models.CharField(max_length=16, default='Warning') # Critical, Warning, Notice
