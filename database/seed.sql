-- UDLMS Initial Seed Data for Prototype Demo

-- Insert sample users
INSERT INTO users (id, email, password_hash, full_name, role, organization, jurisdiction_district)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'contact@business.com', '$2a$10$7Z8D...dummy', 'Rajesh Sharma', 'BUSINESS', 'Acme Corp', 'Central District'),
    ('a0000000-0000-0000-0000-000000000002', 'officer@lmo.gov.in', '$2a$10$7Z8D...dummy', 'Inspector V. K. Verma', 'LMO', 'Dept. of Legal Metrology', 'Central District')
ON CONFLICT (email) DO NOTHING;

-- Insert sample instruments
INSERT INTO instruments (id, owner_id, name, instrument_type, capacity, model_number, serial_number, location_address, district, status, expiry_date)
VALUES
    ('WS-458923', 'a0000000-0000-0000-0000-000000000001', 'Digital Weighing Scale', 'Weighing Balance (Class III)', '50kg', 'EW-50K-2024', 'WS-458923', 'Warehouse A, Downtown Market', 'Central District', 'Verified', '2026-09-10'),
    ('FD-992101', 'a0000000-0000-0000-0000-000000000001', 'Fuel Dispenser Unit', 'Liquid Fuel Meter', '60 L/min', 'FD-MULTI-4', 'FD-992101', 'Highway 14, Star Fuel Station', 'North District', 'Pending', NULL),
    ('PS-334120', 'a0000000-0000-0000-0000-000000000001', 'Heavy Platform Scale', 'Platform Scale (Class III)', '500kg', 'PS-500-HD', 'PS-334120', 'Cargo Yard 3, Industrial Area', 'East District', 'Expiring Soon', '2026-09-25')
ON CONFLICT (id) DO NOTHING;

-- Insert sample inspection tasks
INSERT INTO inspections (id, application_id, instrument_id, scheduled_date, location_display, distance_km, status)
VALUES
    ('T-8842', NULL, 'WS-458923', CURRENT_DATE, 'Downtown Market, Acme Corp', 1.2, 'Pending'),
    ('T-8845', NULL, 'FD-992101', CURRENT_DATE, 'Highway 14, Star Fuel Station', 4.5, 'Overdue')
ON CONFLICT (id) DO NOTHING;

-- Insert sample certificate
INSERT INTO certificates (id, certificate_number, instrument_id, inspection_id, issued_to_org, instrument_name, location_address, issued_by_officer, issue_date, valid_until, qr_payload, is_valid)
VALUES
    ('CERT-2026-8842', 'DLM/CD/2026/8842', 'WS-458923', 'T-8842', 'Acme Corp', 'Digital Weighing Scale (50kg)', 'Downtown Market, District A', 'Inspector V. K. Verma (Badge #LM-402)', '2025-09-10', '2026-09-10', 'https://234-maker.github.io/UDLMS/certificate/CERT-2026-8842', TRUE)
ON CONFLICT (id) DO NOTHING;
