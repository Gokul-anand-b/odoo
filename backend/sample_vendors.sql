-- Development-only vendor seed for the live Django/PostgreSQL schema.
-- The live database has vendor_intelligence_vendor and no vendor_services table.
-- Service descriptions and indicative pricing are stored in specialties JSONB
-- because the existing schema has no separate service/pricing columns.
--
-- Safe to run repeatedly: the fixed UUIDs are used as idempotency keys.

INSERT INTO vendor_intelligence_vendor (
    id, name, category, tier, rating, review_count, city, contact_person,
    phone, email, experience_years, completed_weddings_count, verified, specialties,
    created_at, updated_at
) VALUES
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000001',
    'Rajputana Drapes & Design',
    'Royal Decor & Floral',
    'Heritage Luxe',
    4.9, 41, 'Jaipur, Rajasthan', 'Meera Khandelwal',
    '+91 98290 11001', 'hello@rajputanadrapes.example', 14, 126, true,
    '[{"service":"Mandap and venue decoration","description":"Royal fabric draping, stage styling and guest-area decor.","pricing":"INR 350000-1200000"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000002',
    'Mewar Feast Collective',
    'Catering & Banquets',
    'Heritage Luxe',
    4.8, 58, 'Udaipur, Rajasthan', 'Chef Arvind Rathore',
    '+91 98290 11002', 'events@mewarfeast.example', 16, 178, true,
    '[{"service":"Wedding catering","description":"Rajasthani, Indian and international menus with live counters.","pricing":"INR 1800-4500 per plate"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000003',
    'Pink City Soundworks',
    'Live Entertainment & Folk',
    'Premium Royal',
    4.7, 33, 'Jaipur, Rajasthan', 'Rohan Bansal',
    '+91 98290 11003', 'bookings@pinkcitysoundworks.example', 11, 92, true,
    '[{"service":"DJ and live music","description":"DJ, folk fusion band, sound console and emcee services.","pricing":"INR 125000-425000 per event"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000004',
    'Lake Palace Frames',
    'Photography & Cinematography',
    'Heritage Luxe',
    4.9, 76, 'Udaipur, Rajasthan', 'Nisha Pareek',
    '+91 98290 11004', 'studio@lakepalaceframes.example', 13, 144, true,
    '[{"service":"Photography and cinematography","description":"Candid photography, cinematic films, drone and album production.","pricing":"INR 225000-850000 per wedding"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000005',
    'Riwaaz Bridal Studio',
    'Bridal Styling & Mehendi',
    'Premium Royal',
    4.6, 29, 'Jaipur, Rajasthan', 'Pooja Sharma',
    '+91 98290 11005', 'appointments@riwaazbridal.example', 9, 68, true,
    '[{"service":"Makeup and styling","description":"Bridal makeup, hair styling, draping and family styling packages.","pricing":"INR 45000-180000 per wedding"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000006',
    'Udaipur Petal Atelier',
    'Royal Decor & Floral',
    'Boutique Elite',
    4.8, 37, 'Udaipur, Rajasthan', 'Kavya Joshi',
    '+91 98290 11006', 'studio@udaipurpetal.example', 10, 81, true,
    '[{"service":"Floral design","description":"Seasonal floral installations, table flowers, varmala and bouquets.","pricing":"INR 90000-480000 per wedding"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000007',
    'Amber Glow Productions',
    'Lighting & Production',
    'Premium Royal',
    4.7, 31, 'Jaipur, Rajasthan', 'Vikram Mehta',
    '+91 98290 11007', 'crew@amberglow.example', 12, 105, true,
    '[{"service":"Lighting and production","description":"Architectural lighting, stage rigging, LED walls and power planning.","pricing":"INR 175000-650000 per event"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000008',
    'Aravalli Guest Mobility',
    'Royal Logistics & Vintage Fleet',
    'Premium Royal',
    4.5, 24, 'Udaipur, Rajasthan', 'Sanjay Singh',
    '+91 98290 11008', 'dispatch@aravallimobility.example', 8, 73, true,
    '[{"service":"Guest transportation","description":"Airport transfers, luxury coaches, vintage cars and valet coordination.","pricing":"INR 85000-350000 per wedding"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000009',
    'Haveli Heritage Venues',
    'Palace Venues',
    'Heritage Luxe',
    4.9, 64, 'Jaipur, Rajasthan', 'Aditya Singh',
    '+91 98290 11009', 'events@haveliheritage.example', 19, 212, true,
    '[{"service":"Wedding venue","description":"Heritage haveli courtyards, banquet halls, guest rooms and venue operations.","pricing":"INR 900000-3500000 per wedding"}]'::jsonb,
    NOW(), NOW()
),
(
    '2e2e0d11-2b2d-4c0f-9f31-000000000010',
    'Mewar Celebration Artists',
    'Live Entertainment & Folk',
    'Heritage Luxe',
    4.8, 45, 'Udaipur, Rajasthan', 'Farah Khan',
    '+91 98290 11010', 'performances@mewarartists.example', 15, 119, true,
    '[{"service":"Entertainment","description":"Folk dancers, percussion ensembles, fire artists and cultural showcases.","pricing":"INR 75000-300000 per performance"}]'::jsonb,
    NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    tier = EXCLUDED.tier,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    city = EXCLUDED.city,
    contact_person = EXCLUDED.contact_person,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    experience_years = EXCLUDED.experience_years,
    completed_weddings_count = EXCLUDED.completed_weddings_count,
    verified = EXCLUDED.verified,
    specialties = EXCLUDED.specialties,
    updated_at = NOW();
