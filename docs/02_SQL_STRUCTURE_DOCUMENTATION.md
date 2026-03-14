# SQL STRUCTURE DOCUMENTATION - CONTRACT MANAGEMENT ERP SYSTEM

## Document Overview
This document provides the complete SQL structure for the Contract Management ERP System, including all table creation statements, indexes, constraints, and database initialization scripts.

---

## DATABASE CONFIGURATION

### Connection Settings
- **Database Engine:** PostgreSQL 16+
- **Encoding:** UTF-8
- **Collation:** Default PostgreSQL collation
- **Time Zone:** UTC (application handles local time conversion)

### Extension Requirements
```sql
-- Required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search optimization
```

---

## TABLE CREATION SCRIPTS

### CORE SYSTEM TABLES

#### 1. Gender Table
```sql
CREATE TABLE gender (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_gender_deleted_at ON gender (deleted_at);
CREATE INDEX idx_gender_name ON gender (name);
```

#### 2. Document Types Table
```sql
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_document_types_deleted_at ON document_types (deleted_at);
CREATE INDEX idx_document_types_description ON document_types (description);
```

#### 3. Address Types Table
```sql
CREATE TABLE address_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_address_types_deleted_at ON address_types (deleted_at);
CREATE INDEX idx_address_types_name ON address_types (name);
```

### LOCATION TABLES

#### 4. Estado (States) Table
```sql
CREATE TABLE estado (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    uf CHAR(2) NOT NULL,
    codigo_ibge TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE UNIQUE INDEX idx_estado_uf ON estado (uf) WHERE deleted_at IS NULL;
CREATE INDEX idx_estado_deleted_at ON estado (deleted_at);
CREATE INDEX idx_estado_name ON estado (name);
```

#### 5. Cidade (Cities) Table
```sql
CREATE TABLE cidade (
    id SERIAL PRIMARY KEY,
    estado_id INTEGER REFERENCES estado(id),
    name TEXT NOT NULL,
    codigo_ibge TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_cidade_estado_id ON cidade (estado_id);
CREATE INDEX idx_cidade_deleted_at ON cidade (deleted_at);
CREATE INDEX idx_cidade_name ON cidade (name);
```

### ORGANIZATIONAL STRUCTURE TABLES

#### 6. Company Table
```sql
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    trade_name TEXT NULL,
    tax_id TEXT NULL,
    industry TEXT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_company_deleted_at ON company (deleted_at);
CREATE INDEX idx_company_active ON company (active);
CREATE UNIQUE INDEX idx_company_tax_id ON company (tax_id) WHERE deleted_at IS NULL AND tax_id IS NOT NULL;
```

#### 7. Subsidiary Table
```sql
CREATE TABLE subsidiary (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES company(id),
    subsidiary_name TEXT NOT NULL,
    code TEXT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_subsidiary_company_id ON subsidiary (company_id);
CREATE INDEX idx_subsidiary_deleted_at ON subsidiary (deleted_at);
CREATE INDEX idx_subsidiary_active ON subsidiary (active);
```

#### 8. System Unit Table
```sql
CREATE TABLE sys_unit (
    id SERIAL PRIMARY KEY,
    unit_name TEXT NOT NULL,
    unit_code TEXT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_sys_unit_deleted_at ON sys_unit (deleted_at);
CREATE INDEX idx_sys_unit_active ON sys_unit (active);
CREATE UNIQUE INDEX idx_sys_unit_code ON sys_unit (unit_code) WHERE deleted_at IS NULL AND unit_code IS NOT NULL;
```

### USER MANAGEMENT TABLES

#### 9. System Users Table
```sql
CREATE TABLE sys_users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    login TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NULL,
    first_name TEXT NULL,
    last_name TEXT NULL,
    active BOOLEAN DEFAULT TRUE,
    gender_id INTEGER REFERENCES gender(id),
    company_id INTEGER REFERENCES company(id),
    subsidiary_id INTEGER REFERENCES subsidiary(id),
    sys_unit_id INTEGER REFERENCES sys_unit(id),
    two_factor_enabled BOOLEAN NULL,
    two_factor_type TEXT NULL,
    two_factor_secret TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE UNIQUE INDEX idx_sys_users_login ON sys_users (login) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_sys_users_email ON sys_users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_sys_users_deleted_at ON sys_users (deleted_at);
CREATE INDEX idx_sys_users_active ON sys_users (active);
CREATE INDEX idx_sys_users_company_id ON sys_users (company_id);
```

### ADDRESS MANAGEMENT TABLES

#### 10. Addresses Table
```sql
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    zip_code TEXT NOT NULL,
    address TEXT NOT NULL,
    address_number TEXT NULL,
    address_line1 TEXT NULL,
    address_line2 TEXT NULL,
    city TEXT NOT NULL,
    state TEXT NULL,
    country TEXT NULL,
    observacao TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_addresses_deleted_at ON addresses (deleted_at);
CREATE INDEX idx_addresses_zip_code ON addresses (zip_code);
CREATE INDEX idx_addresses_city ON addresses (city);
```

#### 11. Entity Addresses Table
```sql
CREATE TABLE entity_addresses (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    address_type_id INTEGER REFERENCES address_types(id),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_entity_addresses_entity ON entity_addresses (entity_id, entity_type);
CREATE INDEX idx_entity_addresses_address_id ON entity_addresses (address_id);
CREATE INDEX idx_entity_addresses_type_id ON entity_addresses (address_type_id);
CREATE INDEX idx_entity_addresses_primary ON entity_addresses (entity_id, entity_type, is_primary);
```

### PARTNER MANAGEMENT TABLES

#### 12. Partner Types Table
```sql
CREATE TABLE partner_types (
    id SERIAL PRIMARY KEY,
    type_name TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_partner_types_deleted_at ON partner_types (deleted_at);
CREATE INDEX idx_partner_types_name ON partner_types (type_name);
```

#### 13. Partners Table
```sql
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    partner_code TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    legal_name TEXT NULL,
    tax_id TEXT NULL,
    partner_type_id INTEGER REFERENCES partner_types(id),
    status_id INTEGER NULL,
    gender_id INTEGER REFERENCES gender(id),
    birth_date TIMESTAMP NULL,
    granted_limit DECIMAL(19,4) NULL,
    advantages TEXT NULL,
    observation TEXT NULL,
    currency_code CHAR(3) REFERENCES currency(code),
    company_id INTEGER REFERENCES company(id),
    subsidiary_id INTEGER REFERENCES subsidiary(id),
    sys_unit_id INTEGER REFERENCES sys_unit(id),
    phone TEXT NULL,
    email TEXT NULL,
    website TEXT NULL,
    primary_partner_person TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE UNIQUE INDEX idx_partners_code ON partners (partner_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_partners_deleted_at ON partners (deleted_at);
CREATE INDEX idx_partners_name ON partners (partner_name);
CREATE INDEX idx_partners_type_id ON partners (partner_type_id);
CREATE INDEX idx_partners_company_id ON partners (company_id);
```

### CLIENT MANAGEMENT TABLES

#### 14. Clients Table
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NULL,
    phone TEXT NULL,
    document TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_clients_deleted_at ON clients (deleted_at);
CREATE INDEX idx_clients_name ON clients (name);
CREATE INDEX idx_clients_email ON clients (email);
CREATE INDEX idx_clients_document ON clients (document);
```

### DOCUMENT MANAGEMENT TABLES

#### 15. Documents Table
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    document_type_id INTEGER REFERENCES document_types(id),
    document_number TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NULL,
    mime_type TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_documents_deleted_at ON documents (deleted_at);
CREATE INDEX idx_documents_type_id ON documents (document_type_id);
CREATE INDEX idx_documents_number ON documents (document_number);
```

#### 16. Entity Documents Table
```sql
CREATE TABLE entity_documents (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL,
    document_id INTEGER REFERENCES documents(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_entity_documents_entity ON entity_documents (entity_id, entity_type);
CREATE INDEX idx_entity_documents_document_id ON entity_documents (document_id);
```

### SYSTEM CONFIGURATION TABLES

#### 17. Currency Table
```sql
CREATE TABLE currency (
    code CHAR(3) PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NULL,
    decimal_places INTEGER DEFAULT 2,
    rounding_method TEXT DEFAULT 'HALF_UP',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE INDEX idx_currency_active ON currency (active);
CREATE INDEX idx_currency_deleted_at ON currency (deleted_at);
```

#### 18. Payment Status Table
```sql
CREATE TABLE payment_status (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code CHAR(2) NOT NULL,
    kanban BOOLEAN NULL,
    color TEXT NULL,
    kanban_order INTEGER NULL,
    final_state BOOLEAN NULL,
    initial_state BOOLEAN NULL,
    allow_edition BOOLEAN NULL,
    allow_deletion BOOLEAN NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE UNIQUE INDEX idx_payment_status_code ON payment_status (code) WHERE deleted_at IS NULL;
CREATE INDEX idx_payment_status_deleted_at ON payment_status (deleted_at);
CREATE INDEX idx_payment_status_kanban ON payment_status (kanban_order) WHERE kanban = TRUE;
```

#### 19. General Status Table
```sql
CREATE TABLE general_status (
    id SERIAL PRIMARY KEY,
    status_code TEXT NOT NULL,
    status_name TEXT NOT NULL,
    description TEXT NULL,
    generate_charge BOOLEAN NULL,
    allows_service BOOLEAN NULL,
    charge_after INTEGER NULL,
    kanban BOOLEAN NULL,
    color TEXT NULL,
    kanban_order INTEGER NULL,
    final_state BOOLEAN NULL,
    initial_state BOOLEAN NULL,
    allow_edition BOOLEAN NULL,
    allow_deletion BOOLEAN NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Indexes
CREATE UNIQUE INDEX idx_general_status_code ON general_status (status_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_general_status_deleted_at ON general_status (deleted_at);
CREATE INDEX idx_general_status_kanban ON general_status (kanban_order) WHERE kanban = TRUE;
```

---

## CONTRACT MANAGEMENT TABLES

### Contract Tables
```sql
-- Classe (Contract Classification)
CREATE TABLE classe (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Group Batch (Contract Grouping)
CREATE TABLE group_batch (
    id SERIAL PRIMARY KEY,
    batch_name TEXT NOT NULL,
    batch_code TEXT NOT NULL,
    batch_size INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Contract Number Registry
CREATE TABLE contract_number_registry (
    id SERIAL PRIMARY KEY,
    group_batch_id INTEGER REFERENCES group_batch(id),
    original_contract_number TEXT NOT NULL,
    current_contract_number TEXT NOT NULL,
    sequence_number INTEGER NOT NULL,
    contract_id INTEGER NULL,
    status TEXT DEFAULT 'available',
    reserved_at TIMESTAMP NULL,
    assigned_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Contract Status History
CREATE TABLE contract_status_history (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL,
    previous_status TEXT NULL,
    new_status TEXT NOT NULL,
    status_date TIMESTAMP NOT NULL,
    reason TEXT NULL,
    changed_by INTEGER REFERENCES sys_users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Contracts (Main Contract Table)
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    sys_unit_id INTEGER REFERENCES sys_unit(id),
    sys_user_id INTEGER REFERENCES sys_users(id),
    group_batch_id INTEGER REFERENCES group_batch(id),
    owner_id INTEGER REFERENCES clients(id),
    contract_name TEXT NOT NULL,
    class_id INTEGER REFERENCES classe(id),
    status_id INTEGER NULL,
    contract_number TEXT NOT NULL,
    original_contract_number TEXT NULL,
    current_status TEXT DEFAULT 'active',
    contract_type TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    billing_frequency INTEGER DEFAULT 1,
    admission TIMESTAMP NOT NULL,
    final_grace TIMESTAMP NULL,
    month_initial_billing CHAR(2) NOT NULL,
    year_initial_billing CHAR(4) NOT NULL,
    opt_payday INTEGER NULL,
    collector_id INTEGER NULL,
    seller_id INTEGER NULL,
    region_id INTEGER NULL,
    obs TEXT NULL,
    services_amount INTEGER NULL,
    renew_at TIMESTAMP NULL,
    first_charge INTEGER NULL,
    last_charge INTEGER NULL,
    charges_amount INTEGER NULL,
    charges_paid INTEGER NULL,
    alives INTEGER NULL,
    deceaseds INTEGER NULL,
    dependents INTEGER NULL,
    service_option1 TEXT NULL,
    service_option2 TEXT NULL,
    indicated_by INTEGER NULL,
    grace_period_days TEXT NULL,
    late_fee_percentage DECIMAL(8,5) NULL,
    is_partial_payments_allowed BOOLEAN NULL,
    default_plan_installments TEXT NULL,
    default_plan_frequency TEXT DEFAULT 'MONTHLY',
    industry TEXT DEFAULT 'FUNERAL',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);
```

---

## FINANCIAL MANAGEMENT TABLES

### Financial Structure
```sql
-- Account Types
CREATE TABLE account_types (
    id SERIAL PRIMARY KEY,
    type_name TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Chart of Accounts
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type_id INTEGER REFERENCES account_types(id),
    parent_account_id INTEGER REFERENCES accounts(id),
    level INTEGER NOT NULL DEFAULT 1,
    nature TEXT NOT NULL CHECK (nature IN ('DEBIT', 'CREDIT')),
    is_active BOOLEAN DEFAULT TRUE,
    accepts_posting BOOLEAN DEFAULT TRUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Cost Centers
CREATE TABLE cost_centers (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NULL,
    manager_id INTEGER REFERENCES sys_users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NULL,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    status TEXT DEFAULT 'active',
    budget DECIMAL(19,4) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Fiscal Years
CREATE TABLE fiscal_years (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Fiscal Periods
CREATE TABLE fiscal_periods (
    id SERIAL PRIMARY KEY,
    fiscal_year_id INTEGER REFERENCES fiscal_years(id),
    period_number INTEGER NOT NULL,
    period_name TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);
```

---

## ATTENDANCE/SERVICE TABLES

### Service Management
```sql
-- Payment Receipts
CREATE TABLE payment_receipt (
    id SERIAL PRIMARY KEY,
    client_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    receipt_number TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Member Cards (Carteirinha)
CREATE TABLE carteirinha (
    id SERIAL PRIMARY KEY,
    member_name TEXT NOT NULL,
    member_id TEXT NOT NULL,
    card_number TEXT NOT NULL,
    issue_date TIMESTAMP NOT NULL,
    expiry_date TIMESTAMP NULL,
    status TEXT DEFAULT 'active',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Medical Forwards
CREATE TABLE medical_forward (
    id SERIAL PRIMARY KEY,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    forward_date TIMESTAMP NOT NULL,
    specialty TEXT NOT NULL,
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);
```

---

## BILLING MANAGEMENT TABLES

### Billing Structure
```sql
-- Batch Check (Main Billing Batches)
CREATE TABLE batch_chk (
    id SERIAL PRIMARY KEY,
    batch_number TEXT NOT NULL,
    batch_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(19,4) NOT NULL,
    processed_amount DECIMAL(19,4) DEFAULT 0,
    status TEXT DEFAULT 'pending',
    payment_method TEXT NOT NULL,
    bank_account TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Batch Details (Individual Billing Items)
CREATE TABLE batch_detail (
    id SERIAL PRIMARY KEY,
    batch_chk_id INTEGER REFERENCES batch_chk(id),
    client_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    payment_date TIMESTAMP NULL,
    status TEXT DEFAULT 'pending',
    contract_id INTEGER REFERENCES contracts(id),
    charge_type TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Charges (Individual Charge Definitions)
CREATE TABLE charges (
    id SERIAL PRIMARY KEY,
    charge_name TEXT NOT NULL,
    charge_code TEXT NOT NULL,
    charge_type TEXT NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    frequency TEXT DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Contract Charges (Link Contracts to Charges)
CREATE TABLE contract_charges (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    charge_id INTEGER REFERENCES charges(id),
    custom_amount DECIMAL(19,4) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Beneficiaries (Contract Beneficiaries)
CREATE TABLE beneficiaries (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    birth_date TIMESTAMP NULL,
    document TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);

-- Addendums (Contract Modifications)
CREATE TABLE addendums (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    addendum_number TEXT NOT NULL,
    addendum_date TIMESTAMP NOT NULL,
    addendum_type TEXT NOT NULL,
    description TEXT NOT NULL,
    previous_value DECIMAL(19,4) NULL,
    new_value DECIMAL(19,4) NULL,
    effective_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    deleted_by INTEGER NULL
);
```

---

## DATABASE INITIALIZATION SCRIPT

### Complete Database Setup
```sql
-- Complete database initialization script
-- Run this script to create the entire database structure

-- 1. Create all tables in dependency order
-- 2. Create all indexes
-- 3. Create all foreign key constraints
-- 4. Insert initial data

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Basic configuration tables first
-- [All table creation statements as shown above...]

-- Insert initial data
INSERT INTO currency (code, name, symbol) VALUES 
('BRL', 'Brazilian Real', 'R$'),
('USD', 'US Dollar', '$'),
('EUR', 'Euro', '€');

INSERT INTO gender (name) VALUES 
('Masculino'),
('Feminino'),
('Não Informado');

INSERT INTO document_types (description) VALUES 
('CPF'),
('RG'),
('CNPJ'),
('Passaporte'),
('CNH');

INSERT INTO address_types (name) VALUES 
('Residencial'),
('Comercial'),
('Correspondência'),
('Cobrança');

-- Add more initial data as needed...
```

---

## DATABASE MAINTENANCE

### Regular Maintenance Tasks
```sql
-- Weekly maintenance
VACUUM ANALYZE;

-- Monthly maintenance  
REINDEX DATABASE your_database_name;

-- Clean up soft-deleted records older than 1 year
-- (Run with caution in production)
-- DELETE FROM table_name WHERE deleted_at < NOW() - INTERVAL '1 year';
```

### Performance Optimization
```sql
-- Monitor query performance
EXPLAIN ANALYZE SELECT ...;

-- Create additional indexes based on query patterns
-- Example: Composite indexes for common query patterns
CREATE INDEX idx_partners_company_active ON partners (company_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_status_date ON contracts (current_status, start_date);
```

---

**Document Version:** 1.0  
**Last Updated:** January 25, 2025  
**Database Version:** PostgreSQL 16+  
**Created By:** Development Team