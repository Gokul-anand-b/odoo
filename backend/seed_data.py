import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wedpilot_core.settings')
django.setup()

from vendor_intelligence.models import (
    Vendor,
    Quotation,
    QuoteLineItem,
    HiddenCostItem,
    MissingInclusion,
    VendorCategory,
    VendorTier,
    QuoteStatus
)

def seed():
    print("Clearing existing data...")
    MissingInclusion.objects.all().delete()
    HiddenCostItem.objects.all().delete()
    QuoteLineItem.objects.all().delete()
    Quotation.objects.all().delete()
    Vendor.objects.all().delete()

    print("Seeding Vendors...")
    v101 = Vendor.objects.create(
        id='v-101',
        name='Mewar Royal Culinary & Banquets',
        category=VendorCategory.CATERING,
        tier=VendorTier.HERITAGE_LUXE,
        rating=4.9,
        review_count=38,
        city='Udaipur, Rajasthan',
        contact_person='Chef Raghuvendra Singh Rathore',
        phone='+91 98290 41234',
        email='raghu@mewarculinary.in',
        experience_years=16,
        completed_weddings_count=142,
        verified=True,
        specialties=['Royal Rajasthani Thali', 'European Live Grill', 'Silverware Plating', 'Bespoke Dessert Studio']
    )

    v102 = Vendor.objects.create(
        id='v-102',
        name='Jaipur Shahi Rasoi Caterers',
        category=VendorCategory.CATERING,
        tier=VendorTier.PREMIUM_ROYAL,
        rating=4.4,
        review_count=52,
        city='Jaipur, Rajasthan',
        contact_person='Virendra Agarwal',
        phone='+91 94140 88219',
        email='info@shahirasoi.co.in',
        experience_years=12,
        completed_weddings_count=95,
        verified=True,
        specialties=['Marwari Delicacies', 'Pan-Asian Wok Counter', 'Molecular Mocktails', 'Kulfi Counters']
    )

    v103 = Vendor.objects.create(
        id='v-103',
        name='Heritage Gastronomy by Chef Kunal',
        category=VendorCategory.CATERING,
        tier=VendorTier.HERITAGE_LUXE,
        rating=4.8,
        review_count=29,
        city='Udaipur, Rajasthan',
        contact_person='Kunal Singhania',
        phone='+91 98281 77332',
        email='kunal@heritagegastronomy.com',
        experience_years=14,
        completed_weddings_count=80,
        verified=True,
        specialties=['Nawabi Dum Pukht', 'Artisanal Grazing Tables', 'Organic Farm-to-Table', 'Champa Scented Cold Plates']
    )

    v104 = Vendor.objects.create(
        id='v-104',
        name='Chundawat Royal Mandap & Floral Decor',
        category=VendorCategory.DECOR,
        tier=VendorTier.HERITAGE_LUXE,
        rating=4.9,
        review_count=64,
        city='Jaipur, Rajasthan',
        contact_person='Devendra Singh Chundawat',
        phone='+91 98292 99182',
        email='devendra@chundawatdecor.com',
        experience_years=18,
        completed_weddings_count=210,
        verified=True,
        specialties=['Floating Lotus Mandaps', 'Marigold Architectural Drapes', 'Crystal Chandelier Trusses', 'Mughal Mirror Arches']
    )

    v105 = Vendor.objects.create(
        id='v-105',
        name='Udaivilas Cinematics & Portraits',
        category=VendorCategory.PHOTOGRAPHY,
        tier=VendorTier.HERITAGE_LUXE,
        rating=4.95,
        review_count=44,
        city='Udaipur, Rajasthan',
        contact_person='Tanmay Saxena',
        phone='+91 99280 66712',
        email='tanmay@udaivilascinematics.com',
        experience_years=10,
        completed_weddings_count=115,
        verified=True,
        specialties=['Same-Day Edit Reels', 'Medium Format Portraits', '4K Drone Topography', 'Handcrafted Italian Albums']
    )

    v106 = Vendor.objects.create(
        id='v-106',
        name='Rajputana Vintage Wheels & Royal Chariots',
        category=VendorCategory.LOGISTICS,
        tier=VendorTier.PREMIUM_ROYAL,
        rating=4.7,
        review_count=31,
        city='Jaipur, Rajasthan',
        contact_person='Mahavir Bhati',
        phone='+91 94144 55112',
        email='bhati@rajputanavintage.com',
        experience_years=20,
        completed_weddings_count=190,
        verified=True,
        specialties=['1936 Rolls Royce Phantom', 'Royal Gold Elephant Chariots', 'Luxury AC Guest Shuttles']
    )

    print("Seeding Quotations...")
    q201 = Quotation.objects.create(
        id='q-201',
        quote_number='Q-2026-MEW-004',
        vendor=v101,
        wedding_name='Samar & Alizeh Royal Wedding (City Palace, Udaipur)',
        wedding_date='Nov 18-20, 2026',
        status=QuoteStatus.SHORTLISTED,
        base_price=Decimal('2850000.00'),
        taxes_gst=Decimal('142500.00'),
        price_per_plate=Decimal('4200.00'),
        minimum_guest_guarantee=500,
        hidden_costs_total=Decimal('125000.00'),
        missing_inclusions_cost=Decimal('0.00'),
        true_estimated_landed_cost=Decimal('3117500.00'),
        value_score=94,
        pdf_file_name='Mewar_Culinary_Comprehensive_Quotation_SamarAlizeh.pdf',
        overtime_hourly_rate=Decimal('20000.00'),
        advance_payment_percentage=40
    )

    QuoteLineItem.objects.create(id='i-1', quotation=q201, description='Royal Welcome Hi-Tea & Royal Chaat Bazar (Day 1 Mehendi)', unit='Guests', quantity=450, unit_rate=Decimal('1100.00'), total_rate=Decimal('495000.00'))
    QuoteLineItem.objects.create(id='i-2', quotation=q201, description='Sangeet Sufi & Pan-Asian Imperial Dinner (Day 2 Sangeet)', unit='Guests', quantity=500, unit_rate=Decimal('2400.00'), total_rate=Decimal('1200000.00'))
    QuoteLineItem.objects.create(id='i-3', quotation=q201, description='Royal Wedding Banquet & 42-Item Mewari Feast (Day 3 Pheras)', unit='Guests', quantity=550, unit_rate=Decimal('4200.00'), total_rate=Decimal('2310000.00'))
    QuoteLineItem.objects.create(id='i-4', quotation=q201, description='Royal Silverware Plating, Fine Bone China & Linen Service', unit='Package', quantity=1, unit_rate=Decimal('250000.00'), total_rate=Decimal('250000.00'))
    QuoteLineItem.objects.create(id='i-5', quotation=q201, description='Executive Uniformed Butler & Sommelier Service (80 Staff)', unit='Crew', quantity=80, unit_rate=Decimal('0.00'), total_rate=Decimal('0.00'), notes='Complimentary in Heritage Tier')

    HiddenCostItem.objects.create(id='hc-1', quotation=q201, label='Overtime beyond 1:30 AM (2 hours estimated)', amount=Decimal('40000.00'), risk_level='Low', reason='Music/Celebration often extends till 3 AM', category='Overtime')
    HiddenCostItem.objects.create(id='hc-2', quotation=q201, label='Live Kitchen Kitchen Gas Generator Fuel Surcharge', amount=Decimal('35000.00'), risk_level='Low', reason='City Palace courtyard high-draw power', category='Power/Fuel')
    HiddenCostItem.objects.create(id='hc-3', quotation=q201, label='Ice Carving Sculpture and Dry Ice Mist Top-Up', amount=Decimal('50000.00'), risk_level='Low', reason='Mandap entrance humidity adjustment', category='Service Fee')

    q202 = Quotation.objects.create(
        id='q-202',
        quote_number='Q-2026-JPR-881',
        vendor=v102,
        wedding_name='Samar & Alizeh Royal Wedding (City Palace, Udaipur)',
        wedding_date='Nov 18-20, 2026',
        status=QuoteStatus.UNDER_REVIEW,
        base_price=Decimal('2280000.00'),
        taxes_gst=Decimal('114000.00'),
        price_per_plate=Decimal('3400.00'),
        minimum_guest_guarantee=450,
        hidden_costs_total=Decimal('685000.00'),
        missing_inclusions_cost=Decimal('260000.00'),
        true_estimated_landed_cost=Decimal('3339000.00'),
        value_score=68,
        pdf_file_name='Jaipur_Shahi_Rasoi_Official_Estimate.pdf',
        overtime_hourly_rate=Decimal('45000.00'),
        advance_payment_percentage=50
    )

    QuoteLineItem.objects.create(id='i-21', quotation=q202, description='Mehendi & Sangeet Combined Buffet Setup', unit='Guests', quantity=450, unit_rate=Decimal('1800.00'), total_rate=Decimal('810000.00'))
    QuoteLineItem.objects.create(id='i-22', quotation=q202, description='Phera Day Wedding Dinner (32 items)', unit='Guests', quantity=500, unit_rate=Decimal('2940.00'), total_rate=Decimal('1470000.00'))
    QuoteLineItem.objects.create(id='i-23', quotation=q202, description='Serving Staff Basic Waiters (30 pax only)', unit='Crew', quantity=30, unit_rate=Decimal('0.00'), total_rate=Decimal('0.00'), notes='Insufficient for 500+ guests')

    HiddenCostItem.objects.create(id='hc-21', quotation=q202, label='Mandatory Corkage Charge per Imported Liquor Bottle (₹850/btl)', amount=Decimal('215000.00'), risk_level='High', reason='Vendor levies heavy corkage if client supplies liquor', category='Corkage')
    HiddenCostItem.objects.create(id='hc-22', quotation=q202, label='Overtime Penalty after 11:30 PM (₹45,000/hr)', amount=Decimal('180000.00'), risk_level='High', reason='High overtime penalty for Udaipur palace weddings', category='Overtime')
    HiddenCostItem.objects.create(id='hc-23', quotation=q202, label='Commercial Kitchen Heavy Fuel & Water Tanker Surcharge', amount=Decimal('140000.00'), risk_level='Medium', reason='Fine print note on page 4 of PDF quote', category='Power/Fuel')
    HiddenCostItem.objects.create(id='hc-24', quotation=q202, label='Chafing Dish Brass Polishing & Breakage Contingency Deposit', amount=Decimal('150000.00'), risk_level='Medium', reason='Non-refundable cleaning & polishing fee', category='Breakage Deposit')

    MissingInclusion.objects.create(id='mi-21', quotation=q202, item='Crystal Cut Glassware & Bar Stemware', industry_standard='Included in 5-star catering', vendor_provision='Client must hire externally or pay ₹1.4L add-on', estimated_fix_cost=Decimal('140000.00'), severity='Critical')
    MissingInclusion.objects.create(id='mi-22', quotation=q202, item='Post-Event Kitchen Deep Clean & Waste Disinfection', industry_standard='Mandatory Palace hygiene regulation', vendor_provision='Excluded (Palace will fine ₹1.2L if violated)', estimated_fix_cost=Decimal('120000.00'), severity='Critical')

    q203 = Quotation.objects.create(
        id='q-203',
        quote_number='Q-2026-HG-109',
        vendor=v103,
        wedding_name='Samar & Alizeh Royal Wedding (City Palace, Udaipur)',
        wedding_date='Nov 18-20, 2026',
        status=QuoteStatus.UNDER_REVIEW,
        base_price=Decimal('3100000.00'),
        taxes_gst=Decimal('155000.00'),
        price_per_plate=Decimal('4600.00'),
        minimum_guest_guarantee=500,
        hidden_costs_total=Decimal('180000.00'),
        missing_inclusions_cost=Decimal('50000.00'),
        true_estimated_landed_cost=Decimal('3485000.00'),
        value_score=88,
        pdf_file_name='Heritage_Gastronomy_Tasting_Menu_Quote.pdf',
        overtime_hourly_rate=Decimal('25000.00'),
        advance_payment_percentage=35
    )

    QuoteLineItem.objects.create(id='i-31', quotation=q203, description='Curated 5-Course Royal Rajasthani Imperial Dinner with Chef Table', unit='Guests', quantity=500, unit_rate=Decimal('4600.00'), total_rate=Decimal('2300000.00'))
    HiddenCostItem.objects.create(id='hc-31', quotation=q203, label='Specialty Imported Truffle & Saffron Sourcing Premium', amount=Decimal('90000.00'), risk_level='Medium', reason='Seasonal ingredient price fluctuation clause', category='Service Fee')
    MissingInclusion.objects.create(id='mi-31', quotation=q203, item='Welcome Refreshment Drink Service during Pheras', industry_standard='Always included by luxury caterers', vendor_provision='Priced separately at ₹50,000 flat', estimated_fix_cost=Decimal('50000.00'), severity='Warning')

    print(f"Successfully seeded {Vendor.objects.count()} vendors and {Quotation.objects.count()} quotations!")

if __name__ == '__main__':
    seed()
