# TABLE RELATIONSHIP DIAGRAM - CONTRACT MANAGEMENT ERP SYSTEM

## Document Overview
This document provides visual representations and detailed explanations of the database table relationships within the Contract Management ERP System. It includes entity relationship diagrams, dependency chains, and integration patterns.

---

## VISUAL ENTITY RELATIONSHIP DIAGRAM

### Core System Architecture (ASCII ERD)

```
                    ┌─────────────┐
                    │   COMPANY   │
                    │ (id)        │ 1
                    └──────┬──────┘
                           │
                           │ 1:N
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ SUBSIDIARY  │ 1   │  SYS_UNIT   │
                    │ (id)        │────▶│ (id)        │
                    └──────┬──────┘     └──────┬──────┘
                           │                   │
                           │ 1:N               │ 1:N
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ SYS_USERS   │     │  PARTNERS   │
                    │ (id)        │     │ (id)        │
                    │ company_id  │     │ sys_unit_id │
                    │ subsidiary_id│    │ company_id  │
                    │ sys_unit_id │     │ gender_id   │
                    │ gender_id   │     │ partner_type│
                    └─────────────┘     └─────────────┘
                           │                   │
                           │ audit             │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   GENDER    │     │PARTNER_TYPES│
                    │ (id)        │     │ (id)        │
                    └─────────────┘     └─────────────┘
```

### Address Management System

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  ADDRESSES  │ 1   │ ENTITY_ADDRESSES │  N  │ ADDRESS_    │
│ (id)        │◀────│ (id)             │────▶│ TYPES       │
│ zip_code    │     │ entity_id        │     │ (id)        │
│ address     │     │ entity_type      │     │ name        │
│ city        │     │ address_id       │     └─────────────┘
│ state       │     │ address_type_id  │
└─────────────┘     │ is_primary       │
                    └──────────────────┘
                           │ N:1
                           ▼
                    ┌─────────────┐
                    │  ENTITIES   │
                    │ (Partners,  │
                    │  Clients,   │
                    │  Contracts) │
                    └─────────────┘
```

### Document Management System

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│ DOCUMENTS   │ 1   │ ENTITY_DOCUMENTS │  N  │ DOCUMENT_   │
│ (id)        │◀────│ (id)             │────▶│ TYPES       │
│ filename    │     │ entity_id        │     │ (id)        │
│ file_path   │     │ entity_type      │     │ description │
│ file_size   │     │ document_id      │     └─────────────┘
│ mime_type   │     └──────────────────┘
│ doc_type_id │
└─────────────┘
```

### Contract Management Core

```
                    ┌─────────────┐
                    │ GROUP_BATCH │
                    │ (id)        │ 1
                    │ batch_name  │
                    │ batch_size  │
                    └──────┬──────┘
                           │
                           │ 1:N
                           ▼
                  ┌──────────────────┐
                  │CONTRACT_NUMBER_  │
                  │REGISTRY          │
                  │ (id)             │ 1
                  │ group_batch_id   │
                  │ original_number  │
                  │ current_number   │
                  │ contract_id      │
                  └──────┬───────────┘
                         │
                         │ 1:1
                         ▼
                  ┌─────────────┐     ┌─────────────┐
                  │ CONTRACTS   │  N  │  CLIENTS    │
                  │ (id)        │────▶│ (id)        │
                  │ owner_id    │     │ name        │
                  │ sys_user_id │     │ email       │
                  │ class_id    │     │ phone       │
                  │ status_id   │     └─────────────┘
                  └──────┬──────┘
                         │
                         │ 1:N
                         ▼
                  ┌─────────────┐
                  │BENEFICIARIES│
                  │ (id)        │
                  │ contract_id │
                  │ name        │
                  │ relationship│
                  └─────────────┘
```

### Financial Management System

```
                    ┌─────────────┐
                    │ACCOUNT_TYPES│
                    │ (id)        │ 1
                    └──────┬──────┘
                           │
                           │ 1:N
                           ▼
                    ┌─────────────┐
                    │  ACCOUNTS   │
                    │ (id)        │ 1
                    │ parent_id   │◀─┐
                    │ type_id     │  │ Self-referencing
                    │ level       │  │ for hierarchy
                    │ nature      │  │
                    └──────┬──────┘──┘
                           │
                    ┌──────┴──────┬──────────────┐
                    │             │              │
                    ▼             ▼              ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │COST_CENTERS │ │DEPARTMENTS  │ │  PROJECTS   │
            │ (id)        │ │ (id)        │ │ (id)        │
            │ code        │ │ manager_id  │ │ start_date  │
            │ name        │ │ code        │ │ end_date    │
            └─────────────┘ └─────────────┘ │ budget      │
                                            └─────────────┘
```

### Billing and Charges System

```
                    ┌─────────────┐
                    │ BATCH_CHK   │
                    │ (id)        │ 1
                    │ batch_number│
                    │ total_amount│
                    └──────┬──────┘
                           │
                           │ 1:N
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │BATCH_DETAIL │  N  │ CONTRACTS   │
                    │ (id)        │────▶│ (id)        │
                    │ batch_chk_id│     └─────────────┘
                    │ contract_id │
                    │ amount      │
                    │ due_date    │
                    └─────────────┘

                    ┌─────────────┐     ┌─────────────┐
                    │  CHARGES    │  N  │CONTRACT_    │
                    │ (id)        │◀────│CHARGES      │
                    │ charge_name │     │ (id)        │
                    │ charge_code │     │ contract_id │
                    │ amount      │     │ charge_id   │
                    │ frequency   │     │ custom_amount│
                    └─────────────┘     └─────────────┘
```

### Attendance/Service Management

```
            ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
            │PAYMENT_     │     │CARTEIRINHA  │     │MEDICAL_     │
            │RECEIPT      │     │ (Member     │     │FORWARD      │
            │ (id)        │     │  Cards)     │     │ (id)        │
            │ client_name │     │ (id)        │     │ patient_name│
            │ amount      │     │ member_name │     │ doctor_name │
            │ receipt_num │     │ card_number │     │ specialty   │
            │ payment_date│     │ issue_date  │     │ forward_date│
            └─────────────┘     │ expiry_date │     │ reason      │
                                └─────────────┘     └─────────────┘
```

---

## DETAILED RELATIONSHIP EXPLANATIONS

### 1. Organizational Hierarchy

**Company → Subsidiary → System Unit → Users**
```
COMPANY (1) ──→ SUBSIDIARY (N)
    │               │
    │               └─→ SYS_UNIT (N) ──→ SYS_USERS (N)
    │                       │
    └───────────────────────└─→ PARTNERS (N)
```

**Business Rules:**
- One company can have multiple subsidiaries
- Each subsidiary can have multiple system units  
- Each system unit can have multiple users and partners
- Users and partners belong to exactly one company, subsidiary, and system unit

### 2. Entity-Address Relationship Pattern

**Generic Many-to-Many with Type Classification**
```
ENTITY (Partner/Client) ──→ ENTITY_ADDRESSES ←── ADDRESSES
                                    │
                                    ▼
                               ADDRESS_TYPES
```

**Business Rules:**
- Any entity can have multiple addresses of different types
- Each address can be shared by multiple entities
- Address types classify the purpose (residential, commercial, billing, etc.)
- One address per entity can be marked as primary

### 3. Document Management Pattern

**Generic Document Attachment System**
```
ENTITY (Partner/Client) ──→ ENTITY_DOCUMENTS ←── DOCUMENTS
                                    │                │
                                    │                ▼
                                    │          DOCUMENT_TYPES
```

**Business Rules:**
- Any entity can have multiple documents
- Documents are typed (CPF, RG, CNPJ, contracts, etc.)
- Each document file is stored with metadata (size, MIME type, path)
- Documents can be shared between entities if needed

### 4. Contract Number Management

**Enhanced Contract Numbering System**
```
GROUP_BATCH (1) ──→ CONTRACT_NUMBER_REGISTRY (N) ──→ CONTRACTS (1)
                            │
                            ▼
                    CONTRACT_STATUS_HISTORY (N)
```

**Business Rules:**
- Group batches contain 500 pre-generated contract numbers
- Each number can be: available, reserved, assigned, or retired
- Contract status changes are tracked in history table
- Original and current contract numbers are maintained for transitions

### 5. Financial Account Hierarchy

**Self-Referencing Hierarchical Structure**
```
ACCOUNT_TYPES (1) ──→ ACCOUNTS (N)
                          │    ▲
                          │    │ parent_id
                          └────┘ (self-referencing)
```

**Business Rules:**
- Accounts form a hierarchical tree structure
- Each account has a level (1, 2, 3, etc.)
- Parent accounts typically don't accept direct postings
- Leaf accounts (no children) accept transaction postings

### 6. Contract Charging System

**Contract-Charge Many-to-Many with Customization**
```
CONTRACTS (1) ──→ CONTRACT_CHARGES (N) ←── CHARGES (1)
                         │
                         └─→ custom_amount (override)
```

**Business Rules:**
- Each contract can have multiple charge types
- Charges have default amounts but can be customized per contract
- Charge frequency determines billing cycles
- Start and end dates control charge periods

---

## DEPENDENCY CHAINS AND CONSTRAINTS

### 1. Data Integrity Constraints

#### Foreign Key Dependencies
```
Master Data Dependencies:
GENDER → SYS_USERS, PARTNERS
COMPANY → SUBSIDIARY → SYS_UNIT → SYS_USERS, PARTNERS
DOCUMENT_TYPES → DOCUMENTS → ENTITY_DOCUMENTS
ADDRESS_TYPES → ENTITY_ADDRESSES → ADDRESSES

Transactional Dependencies:
CLIENTS → CONTRACTS → BENEFICIARIES
CONTRACTS → CONTRACT_CHARGES → CHARGES
GROUP_BATCH → CONTRACT_NUMBER_REGISTRY → CONTRACTS
BATCH_CHK → BATCH_DETAIL → CONTRACTS
```

#### Deletion Constraints
```sql
-- Soft delete pattern prevents cascade issues
-- When parent is deleted (soft), children remain but are marked as orphaned
-- Example: If PARTNER_TYPE is deleted, related PARTNERS show null type_id

-- Hard constraints where data integrity is critical:
ALTER TABLE contracts 
    ADD CONSTRAINT fk_contracts_owner 
    FOREIGN KEY (owner_id) REFERENCES clients(id) 
    ON DELETE RESTRICT;

ALTER TABLE beneficiaries 
    ADD CONSTRAINT fk_beneficiaries_contract 
    FOREIGN KEY (contract_id) REFERENCES contracts(id) 
    ON DELETE CASCADE;
```

### 2. Business Logic Dependencies

#### Contract Lifecycle Dependencies
```
1. Client Creation → Contract Creation
2. Group Batch Setup → Contract Number Assignment
3. Contract Creation → Beneficiary Registration
4. Contract Activation → Charge Assignment
5. Billing Period → Batch Processing
```

#### Status Transition Dependencies
```
Contract Status Flow:
draft → active → (suspended ↔ active) → (canceled | redeemed | transferred)

Payment Status Flow:
pending → processing → (paid | failed | cancelled)

Document Status Flow:
uploaded → validated → approved → archived
```

---

## INTEGRATION PATTERNS

### 1. Multi-Tenant Data Isolation

**Company-Based Segregation**
```sql
-- All queries must include company filter
SELECT * FROM partners 
WHERE company_id = @current_company_id 
  AND deleted_at IS NULL;

-- Row-level security (when implemented)
CREATE POLICY company_isolation ON partners
    FOR ALL TO application_role
    USING (company_id = current_setting('app.current_company_id')::INTEGER);
```

### 2. Audit Trail Pattern

**Universal Audit Fields**
```sql
-- Every table includes audit fields
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
deleted_at TIMESTAMP NULL,        -- Soft delete
created_by INTEGER REFERENCES sys_users(id),
updated_by INTEGER REFERENCES sys_users(id),
deleted_by INTEGER REFERENCES sys_users(id)
```

**Audit Triggers (Future Implementation)**
```sql
-- Automatic audit trail trigger
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = current_setting('app.current_user_id')::INTEGER;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_audit_fields
    BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

### 3. Entity Polymorphism Pattern

**Generic Entity Relationships**
```sql
-- entity_addresses supports multiple entity types
entity_type IN ('partner', 'client', 'contract', 'supplier')

-- entity_documents supports multiple entity types  
entity_type IN ('partner', 'client', 'contract', 'sys_user')

-- Queries by entity type
SELECT ea.*, a.*, at.name as address_type
FROM entity_addresses ea
JOIN addresses a ON ea.address_id = a.id
JOIN address_types at ON ea.address_type_id = at.id
WHERE ea.entity_type = 'partner' 
  AND ea.entity_id = @partner_id;
```

---

## SCALABILITY CONSIDERATIONS

### 1. Indexing Strategy

#### Performance-Critical Indexes
```sql
-- Primary access patterns
CREATE INDEX idx_partners_company_active ON partners (company_id, deleted_at);
CREATE INDEX idx_contracts_status_date ON contracts (current_status, start_date);
CREATE INDEX idx_entity_addresses_lookup ON entity_addresses (entity_type, entity_id);

-- Search optimization
CREATE INDEX idx_partners_name_search ON partners USING gin(to_tsvector('portuguese', partner_name));
CREATE INDEX idx_clients_document ON clients (document) WHERE document IS NOT NULL;
```

#### Composite Indexes for Complex Queries
```sql
-- Contract management queries
CREATE INDEX idx_contracts_compound ON contracts (company_id, current_status, start_date, sys_user_id);

-- Billing queries
CREATE INDEX idx_batch_detail_compound ON batch_detail (batch_chk_id, contract_id, status, due_date);
```

### 2. Partitioning Strategy (Future)

#### Time-Based Partitioning
```sql
-- Large transaction tables can be partitioned by date
CREATE TABLE batch_detail_2025_01 PARTITION OF batch_detail
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE batch_detail_2025_02 PARTITION OF batch_detail
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

#### Company-Based Partitioning
```sql
-- Multi-tenant partitioning by company_id
CREATE TABLE partners_company_1 PARTITION OF partners
    FOR VALUES IN (1);

CREATE TABLE partners_company_2 PARTITION OF partners
    FOR VALUES IN (2);
```

---

## DATA MIGRATION CONSIDERATIONS

### 1. Legacy System Mapping

**Typical Legacy → New System Mappings**
```
Legacy "customer" table → partners + clients tables
Legacy "address" column → addresses + entity_addresses tables
Legacy "status" column → general_status table with proper constraints
Legacy flat hierarchy → tree structure with parent_id relationships
```

### 2. Migration Validation Queries

**Data Integrity Checks Post-Migration**
```sql
-- Orphaned records check
SELECT 'partners with invalid company' as issue, count(*)
FROM partners p
LEFT JOIN company c ON p.company_id = c.id
WHERE c.id IS NULL AND p.deleted_at IS NULL;

-- Referential integrity check
SELECT 'addresses without entities' as issue, count(*)
FROM addresses a
LEFT JOIN entity_addresses ea ON a.id = ea.address_id
WHERE ea.id IS NULL AND a.deleted_at IS NULL;

-- Business logic validation
SELECT 'contracts without beneficiaries' as issue, count(*)
FROM contracts c
LEFT JOIN beneficiaries b ON c.id = b.contract_id
WHERE b.id IS NULL AND c.deleted_at IS NULL;
```

---

**Document Version:** 1.0  
**Last Updated:** January 25, 2025  
**Diagram Standards:** ASCII Art + SQL DDL  
**Created By:** Database Team