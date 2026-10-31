-- ====================================================================
-- WedPilot AI: Supabase PostgreSQL Schema
-- Project: The Royal Knot Luxury Wedding Operations (Jaipur & Udaipur)
-- Core Feature 2: Smart Vendor Intelligence & Quote Comparison
-- ====================================================================

-- 1. Vendors Table
CREATE TABLE IF NOT EXISTS public.vendors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    tier VARCHAR(32) DEFAULT 'Premium Royal',
    rating NUMERIC(3, 2) DEFAULT 4.8,
    review_count INTEGER DEFAULT 1,
    city VARCHAR(128) DEFAULT 'Udaipur, Rajasthan',
    contact_person VARCHAR(128),
    phone VARCHAR(32),
    email VARCHAR(128),
    experience_years INTEGER DEFAULT 5,
    completed_weddings_count INTEGER DEFAULT 10,
    verified BOOLEAN DEFAULT true,
    specialties JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quotations Table
CREATE TABLE IF NOT EXISTS public.quotations (
    id VARCHAR(64) PRIMARY KEY,
    quote_number VARCHAR(64) UNIQUE NOT NULL,
    vendor_id VARCHAR(64) REFERENCES public.vendors(id) ON DELETE CASCADE,
    wedding_name VARCHAR(255) DEFAULT 'Samar & Alizeh Royal Wedding',
    wedding_date VARCHAR(128) DEFAULT 'Nov 18-20, 2026',
    status VARCHAR(32) DEFAULT 'Under Review',
    submission_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    base_price NUMERIC(12, 2) DEFAULT 0.0,
    taxes_gst NUMERIC(12, 2) DEFAULT 0.0,
    price_per_plate NUMERIC(10, 2),
    minimum_guest_guarantee INTEGER DEFAULT 500,
    hidden_costs_total NUMERIC(12, 2) DEFAULT 0.0,
    missing_inclusions_cost NUMERIC(12, 2) DEFAULT 0.0,
    true_estimated_landed_cost NUMERIC(12, 2) DEFAULT 0.0,
    value_score INTEGER DEFAULT 80,
    pdf_file_name VARCHAR(255),
    overtime_hourly_rate NUMERIC(10, 2) DEFAULT 20000.0,
    advance_payment_percentage INTEGER DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quotation Line Items Table
CREATE TABLE IF NOT EXISTS public.quote_line_items (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) REFERENCES public.quotations(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    unit VARCHAR(32) DEFAULT 'Guests',
    quantity NUMERIC(10, 2) DEFAULT 1.0,
    unit_rate NUMERIC(10, 2) DEFAULT 0.0,
    total_rate NUMERIC(12, 2) DEFAULT 0.0,
    is_included BOOLEAN DEFAULT true,
    notes TEXT
);

-- 4. Hidden Cost Items Table (Signature Novelty)
CREATE TABLE IF NOT EXISTS public.hidden_cost_items (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) REFERENCES public.quotations(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) DEFAULT 0.0,
    risk_level VARCHAR(16) DEFAULT 'Medium',
    reason TEXT,
    category VARCHAR(64) DEFAULT 'Service Fee'
);

-- 5. Missing Inclusions Table (Signature Novelty)
CREATE TABLE IF NOT EXISTS public.missing_inclusions (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) REFERENCES public.quotations(id) ON DELETE CASCADE,
    item VARCHAR(255) NOT NULL,
    industry_standard TEXT,
    vendor_provision TEXT,
    estimated_fix_cost NUMERIC(10, 2) DEFAULT 0.0,
    severity VARCHAR(16) DEFAULT 'Warning'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_inclusions ENABLE ROW LEVEL SECURITY;

-- Allow Read & Write for authenticated / anon API calls
CREATE POLICY "Allow public read on vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Allow public write on vendors" ON public.vendors FOR ALL USING (true);

CREATE POLICY "Allow public read on quotations" ON public.quotations FOR SELECT USING (true);
CREATE POLICY "Allow public write on quotations" ON public.quotations FOR ALL USING (true);

CREATE POLICY "Allow public read on items" ON public.quote_line_items FOR ALL USING (true);
CREATE POLICY "Allow public read on hidden_costs" ON public.hidden_cost_items FOR ALL USING (true);
CREATE POLICY "Allow public read on missing_inclusions" ON public.missing_inclusions FOR ALL USING (true);

-- ====================================================================
-- SEED DATA: The Royal Knot Luxury Jaipur & Udaipur Weddings
-- ====================================================================

INSERT INTO public.vendors (id, name, category, tier, rating, review_count, city, contact_person, phone, email, experience_years, completed_weddings_count, verified, specialties)
VALUES
('v-101', 'Mewar Royal Culinary & Banquets', 'Catering & Banquets', 'Heritage Luxe', 4.90, 38, 'Udaipur, Rajasthan', 'Chef Raghuvendra Singh Rathore', '+91 98290 41234', 'raghu@mewarculinary.in', 16, 142, true, '["Royal Rajasthani Thali", "European Live Grill", "Silverware Plating", "Bespoke Dessert Studio"]'::jsonb),
('v-102', 'Jaipur Shahi Rasoi Caterers', 'Catering & Banquets', 'Premium Royal', 4.40, 52, 'Jaipur, Rajasthan', 'Virendra Agarwal', '+91 94140 88219', 'info@shahirasoi.co.in', 12, 95, true, '["Marwari Delicacies", "Pan-Asian Wok Counter", "Molecular Mocktails", "Kulfi Counters"]'::jsonb),
('v-103', 'Heritage Gastronomy by Chef Kunal', 'Catering & Banquets', 'Heritage Luxe', 4.80, 29, 'Udaipur, Rajasthan', 'Kunal Singhania', '+91 98281 77332', 'kunal@heritagegastronomy.com', 14, 80, true, '["Nawabi Dum Pukht", "Artisanal Grazing Tables", "Organic Farm-to-Table"]'::jsonb),
('v-104', 'Chundawat Royal Mandap & Floral Decor', 'Royal Decor & Floral', 'Heritage Luxe', 4.90, 64, 'Jaipur, Rajasthan', 'Devendra Singh Chundawat', '+91 98292 99182', 'devendra@chundawatdecor.com', 18, 210, true, '["Floating Lotus Mandaps", "Marigold Architectural Drapes", "Crystal Chandelier Trusses"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quotations (id, quote_number, vendor_id, wedding_name, wedding_date, status, base_price, taxes_gst, price_per_plate, minimum_guest_guarantee, hidden_costs_total, missing_inclusions_cost, true_estimated_landed_cost, value_score, pdf_file_name, overtime_hourly_rate, advance_payment_percentage)
VALUES
('q-201', 'Q-2026-MEW-004', 'v-101', 'Samar & Alizeh Royal Wedding', 'Nov 18-20, 2026', 'Shortlisted', 2850000.00, 142500.00, 4200.00, 500, 125000.00, 0.00, 3117500.00, 94, 'Mewar_Culinary_Comprehensive.pdf', 20000.00, 40),
('q-202', 'Q-2026-JPR-881', 'v-102', 'Samar & Alizeh Royal Wedding', 'Nov 18-20, 2026', 'Under Review', 2280000.00, 114000.00, 3400.00, 450, 685000.00, 260000.00, 3339000.00, 68, 'Jaipur_Shahi_Rasoi_Estimate.pdf', 45000.00, 50),
('q-203', 'Q-2026-HG-109', 'v-103', 'Samar & Alizeh Royal Wedding', 'Nov 18-20, 2026', 'Under Review', 3100000.00, 155000.00, 4600.00, 500, 180000.00, 50000.00, 3485000.00, 88, 'Heritage_Gastronomy_Quote.pdf', 25000.00, 35)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- Client intake and approval workflow
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('admin', 'customer', 'vendor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wedding_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wedding_name VARCHAR(255) NOT NULL,
    wedding_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count > 0),
    theme VARCHAR(120) DEFAULT '',
    budget NUMERIC(14, 2) NOT NULL CHECK (budget > 0),
    package VARCHAR(120) NOT NULL,
    requirements TEXT DEFAULT '',
    status VARCHAR(30) NOT NULL DEFAULT 'pending_approval'
        CHECK (status IN ('pending_approval', 'changes_requested', 'approved', 'rejected')),
    decision_reason TEXT DEFAULT '',
    decided_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    decided_at TIMESTAMPTZ,
    resubmission_count INTEGER NOT NULL DEFAULT 0 CHECK (resubmission_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.request_activities (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES public.wedding_requests(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(80) NOT NULL,
    detail TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_activities ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Customers can read their requests" ON public.wedding_requests;
DROP POLICY IF EXISTS "Customers can create their requests" ON public.wedding_requests;
DROP POLICY IF EXISTS "Customers can resubmit editable requests" ON public.wedding_requests;
DROP POLICY IF EXISTS "Admins can decide requests" ON public.wedding_requests;
DROP POLICY IF EXISTS "Participants can read request activity" ON public.request_activities;

CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Customers can read their requests" ON public.wedding_requests
    FOR SELECT USING (customer_id = auth.uid() OR public.is_admin());
CREATE POLICY "Customers can create their requests" ON public.wedding_requests
    FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers can resubmit editable requests" ON public.wedding_requests
    FOR UPDATE USING (customer_id = auth.uid() AND status IN ('rejected', 'changes_requested'))
    WITH CHECK (customer_id = auth.uid() AND status = 'pending_approval');
CREATE POLICY "Admins can decide requests" ON public.wedding_requests
    FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Participants can read request activity" ON public.request_activities
    FOR SELECT USING (
        public.is_admin() OR EXISTS (
            SELECT 1 FROM public.wedding_requests
            WHERE id = request_id AND customer_id = auth.uid()
        )
    );

-- ====================================================================
-- Operational records: agreements, payments, guests, invoices,
-- assignments, documents and notifications
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.agreements (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    customer_signed_at TIMESTAMPTZ,
    vendor_signed_at TIMESTAMPTZ,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    payment_type VARCHAR(20) NOT NULL DEFAULT 'client',
    payment_stage VARCHAR(20) NOT NULL DEFAULT 'booking',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.guests (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(254) DEFAULT '',
    phone VARCHAR(40) DEFAULT '',
    invitation_status VARCHAR(20) NOT NULL DEFAULT 'invited',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vendor_invoices (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(80) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vendor_assignments (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'assigned',
    issue TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(80) NOT NULL DEFAULT 'other',
    file_url VARCHAR(500) NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agreement participants access" ON public.agreements;
CREATE POLICY "Agreement participants access" ON public.agreements FOR ALL
    USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin())
    WITH CHECK (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Payment participants access" ON public.payments;
CREATE POLICY "Payment participants access" ON public.payments FOR ALL
    USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin())
    WITH CHECK (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Customer guests access" ON public.guests;
CREATE POLICY "Customer guests access" ON public.guests FOR ALL
    USING (customer_id = auth.uid() OR public.is_admin())
    WITH CHECK (customer_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Invoice participants access" ON public.vendor_invoices;
CREATE POLICY "Invoice participants access" ON public.vendor_invoices FOR ALL
    USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin())
    WITH CHECK (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Assignment participants access" ON public.vendor_assignments;
CREATE POLICY "Assignment participants access" ON public.vendor_assignments FOR ALL
    USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin())
    WITH CHECK (customer_id = auth.uid() OR vendor_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Document owners access" ON public.documents;
CREATE POLICY "Document owners access" ON public.documents FOR ALL
    USING (owner_id = auth.uid() OR public.is_admin())
    WITH CHECK (owner_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Notification recipients access" ON public.notifications;
CREATE POLICY "Notification recipients access" ON public.notifications FOR ALL
    USING (recipient_id = auth.uid() OR public.is_admin())
    WITH CHECK (recipient_id = auth.uid() OR public.is_admin());
