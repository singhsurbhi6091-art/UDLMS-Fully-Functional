-- UDLMS (Unified Digital Legal Metrology System) Database Schema
-- Compatible with PostgreSQL 16/17/18
-- Implemented under Legal Metrology Act, 2009 & General Rules, 2011

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Roles (Business, LMO / Inspector, Admin)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('BUSINESS', 'LMO', 'GATC', 'ADMIN')),
    organization VARCHAR(255),
    phone VARCHAR(50),
    jurisdiction_district VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Weighing and Measuring Instruments
CREATE TABLE IF NOT EXISTS instruments (
    id VARCHAR(50) PRIMARY KEY, -- e.g. WS-458923
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    instrument_type VARCHAR(100) NOT NULL, -- Digital Weighing Scale, Platform Scale, Fuel Dispenser, etc.
    capacity VARCHAR(100) NOT NULL,        -- e.g. 50kg, 500kg, 60L/min
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    location_address VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Verified', 'Pending', 'Expiring Soon', 'Expired', 'Rejected')),
    last_verified_at TIMESTAMP WITH TIME ZONE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Applications for Verification & Re-verification
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY, -- e.g. APP-2026-001
    instrument_id VARCHAR(50) REFERENCES instruments(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_type VARCHAR(50) NOT NULL DEFAULT 'INITIAL' CHECK (application_type IN ('INITIAL', 'PERIODIC_REVERIFICATION', 'REPAIR_VERIFICATION')),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'SCHEDULED', 'IN_PROGRESS', 'APPROVED', 'REJECTED')),
    invoice_document_url TEXT,
    supporting_doc_url TEXT,
    applicant_remarks TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Field Inspection Tasks & Observations
CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(50) PRIMARY KEY, -- e.g. T-8842
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE SET NULL,
    instrument_id VARCHAR(50) REFERENCES instruments(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    location_display VARCHAR(255) NOT NULL,
    distance_km NUMERIC(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Overdue', 'Completed', 'Cancelled')),
    captured_serial VARCHAR(100),
    plate_photo_url TEXT,
    result VARCHAR(50) CHECK (result IN ('Pass (Verified)', 'Fail (Needs Repair)', 'Confiscated')),
    inspector_remarks TEXT,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Digital Verification Certificates (QR-Enabled)
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(50) PRIMARY KEY, -- e.g. CERT-2026-8842
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    instrument_id VARCHAR(50) REFERENCES instruments(id) ON DELETE CASCADE,
    inspection_id VARCHAR(50) REFERENCES inspections(id) ON DELETE SET NULL,
    issued_to_org VARCHAR(255) NOT NULL,
    instrument_name VARCHAR(255) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    issued_by_officer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    qr_payload TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create helpful query indexes
CREATE INDEX IF NOT EXISTS idx_instruments_owner ON instruments(owner_id);
CREATE INDEX IF NOT EXISTS idx_instruments_status ON instruments(status);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_inspections_officer ON inspections(officer_id);
CREATE INDEX IF NOT EXISTS idx_certificates_instrument ON certificates(instrument_id);
