# DATA DICTIONARY - CONTRACT MANAGEMENT ERP SYSTEM

## Document Overview
This comprehensive data dictionary provides detailed information about all database tables, their fields, relationships, and business rules within the Contract Management ERP System.

---

## CORE SYSTEM TABLES

### 1. GENDER TABLE
**Table Name:** `gender`
**Purpose:** Master data for gender classification

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| name | text | NOT NULL | Gender name (Masculino, Feminino, etc.) |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 2. DOCUMENT TYPES TABLE
**Table Name:** `document_types`
**Purpose:** Classification of document types (CPF, RG, CNPJ, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| description | text | NOT NULL | Document type description |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 3. ADDRESS TYPES TABLE
**Table Name:** `address_types`
**Purpose:** Classification of address types (Comercial, Residencial, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| name | text | NOT NULL | Address type name |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## LOCATION TABLES

### 4. ESTADO (STATES) TABLE
**Table Name:** `estado`
**Purpose:** Brazilian states master data

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| name | text | NOT NULL | State full name |
| uf | char(2) | NOT NULL | State abbreviation (SP, RJ, etc.) |
| codigo_ibge | text | NULL | IBGE official code |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 5. CIDADE (CITIES) TABLE
**Table Name:** `cidade`
**Purpose:** Brazilian cities master data

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| estado_id | integer | FK to estado.id | State reference |
| name | text | NOT NULL | City name |
| codigo_ibge | text | NULL | IBGE official code |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## ORGANIZATIONAL STRUCTURE TABLES

### 6. COMPANY TABLE
**Table Name:** `company`
**Purpose:** Companies/organizations in the system

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| company_name | text | NOT NULL | Company legal name |
| trade_name | text | NULL | Commercial/trade name |
| tax_id | text | NULL | Tax identification number |
| industry | text | NULL | Industry classification |
| active | boolean | DEFAULT true | Company active status |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 7. SUBSIDIARY TABLE
**Table Name:** `subsidiary`
**Purpose:** Company subsidiaries or branches

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| company_id | integer | FK to company.id | Parent company reference |
| subsidiary_name | text | NOT NULL | Subsidiary name |
| code | text | NULL | Subsidiary code |
| active | boolean | DEFAULT true | Subsidiary active status |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 8. SYS_UNIT TABLE
**Table Name:** `sys_unit`
**Purpose:** System organizational units

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| unit_name | text | NOT NULL | Unit name |
| unit_code | text | NULL | Unit identification code |
| active | boolean | DEFAULT true | Unit active status |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## USER MANAGEMENT TABLES

### 9. SYS_USERS TABLE
**Table Name:** `sys_users`
**Purpose:** System users with authentication and authorization

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| name | text | NOT NULL | User display name |
| login | text | NOT NULL | Login username |
| email | text | NOT NULL | User email address |
| password_hash | text | NOT NULL | Encrypted password |
| password_salt | text | NULL | Password salt for security |
| first_name | text | NULL | User first name |
| last_name | text | NULL | User last name |
| active | boolean | DEFAULT true | User active status |
| gender_id | integer | FK to gender.id | Gender reference |
| company_id | integer | FK to company.id | Company reference |
| subsidiary_id | integer | FK to subsidiary.id | Subsidiary reference |
| sys_unit_id | integer | FK to sys_unit.id | System unit reference |
| two_factor_enabled | boolean | NULL | 2FA enabled flag |
| two_factor_type | text | NULL | 2FA method type |
| two_factor_secret | text | NULL | 2FA secret key |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## ADDRESS MANAGEMENT TABLES

### 10. ADDRESSES TABLE
**Table Name:** `addresses`
**Purpose:** Physical addresses storage

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| zip_code | text | NOT NULL | Postal/ZIP code |
| address | text | NOT NULL | Street address |
| address_number | text | NULL | Address number |
| address_line1 | text | NULL | Additional address line 1 |
| address_line2 | text | NULL | Additional address line 2 |
| city | text | NOT NULL | City name |
| state | text | NULL | State name |
| country | text | NULL | Country name |
| observacao | text | NULL | Address observations |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 11. ENTITY_ADDRESSES TABLE
**Table Name:** `entity_addresses`
**Purpose:** Many-to-many relationship between entities and addresses

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| entity_id | integer | NOT NULL | Entity identifier (partner, client, etc.) |
| entity_type | text | NOT NULL | Entity type ('client', 'partner') |
| address_id | integer | FK to addresses.id | Address reference |
| address_type_id | integer | FK to address_types.id | Address type reference |
| is_primary | boolean | DEFAULT false | Primary address flag |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |

---

## PARTNER MANAGEMENT TABLES

### 12. PARTNER_TYPES TABLE
**Table Name:** `partner_types`
**Purpose:** Classification of partner types

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| type_name | text | NOT NULL | Partner type name |
| description | text | NULL | Type description |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 13. PARTNERS TABLE
**Table Name:** `partners`
**Purpose:** Business partners, suppliers, vendors

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| partner_code | text | NOT NULL | Partner identification code |
| partner_name | text | NOT NULL | Partner name |
| legal_name | text | NULL | Legal company name |
| tax_id | text | NULL | Tax identification |
| partner_type_id | integer | FK to partner_types.id | Partner type reference |
| status_id | integer | NULL | Partner status reference |
| gender_id | integer | FK to gender.id | Gender reference |
| birth_date | timestamp | NULL | Birth date |
| granted_limit | decimal(19,4) | NULL | Credit limit granted |
| advantages | text | NULL | Partner advantages |
| observation | text | NULL | General observations |
| currency_code | char(3) | NULL | Default currency |
| company_id | integer | FK to company.id | Company reference |
| subsidiary_id | integer | FK to subsidiary.id | Subsidiary reference |
| sys_unit_id | integer | FK to sys_unit.id | System unit reference |
| phone | text | NULL | Contact phone |
| email | text | NULL | Contact email |
| website | text | NULL | Partner website |
| primary_partner_person | text | NULL | Main contact person |
| notes | text | NULL | Additional notes |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## CLIENT MANAGEMENT TABLES

### 14. CLIENTS TABLE
**Table Name:** `clients`
**Purpose:** Customer/client information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| name | text | NOT NULL | Client name |
| email | text | NULL | Client email |
| phone | text | NULL | Client phone |
| document | text | NULL | Client identification document |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## DOCUMENT MANAGEMENT TABLES

### 15. DOCUMENTS TABLE
**Table Name:** `documents`
**Purpose:** File storage and document management

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| document_type_id | integer | FK to document_types.id | Document type reference |
| document_number | text | NOT NULL | Document identification number |
| filename | text | NOT NULL | Original filename |
| file_path | text | NOT NULL | File storage path |
| file_size | integer | NULL | File size in bytes |
| mime_type | text | NULL | File MIME type |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 16. ENTITY_DOCUMENTS TABLE
**Table Name:** `entity_documents`
**Purpose:** Many-to-many relationship between entities and documents

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| entity_id | integer | NOT NULL | Entity identifier |
| entity_type | text | NOT NULL | Entity type ('client', 'partner') |
| document_id | integer | FK to documents.id | Document reference |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |

---

## SYSTEM CONFIGURATION TABLES

### 17. CURRENCY TABLE
**Table Name:** `currency`
**Purpose:** Currency definitions and configurations

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| code | char(3) | PK | ISO currency code (USD, BRL, etc.) |
| name | text | NOT NULL | Currency name |
| symbol | text | NULL | Currency symbol |
| decimal_places | integer | DEFAULT 2 | Number of decimal places |
| rounding_method | text | DEFAULT 'HALF_UP' | Rounding method |
| active | boolean | DEFAULT true | Currency active status |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 18. PAYMENT_STATUS TABLE
**Table Name:** `payment_status`
**Purpose:** Payment status definitions with Kanban support

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| name | text | NOT NULL | Status name |
| code | char(2) | NOT NULL | Status code |
| kanban | boolean | NULL | Display in Kanban board |
| color | text | NULL | Display color |
| kanban_order | integer | NULL | Order in Kanban |
| final_state | boolean | NULL | Is final status |
| initial_state | boolean | NULL | Is initial status |
| allow_edition | boolean | NULL | Allow record editing |
| allow_deletion | boolean | NULL | Allow record deletion |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

### 19. GENERAL_STATUS TABLE
**Table Name:** `general_status`
**Purpose:** General system status definitions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | integer | PK, Auto-increment | Unique identifier |
| status_code | text | NOT NULL | Status code |
| status_name | text | NOT NULL | Status name |
| description | text | NULL | Status description |
| generate_charge | boolean | NULL | Generate charges flag |
| allows_service | boolean | NULL | Allow services flag |
| charge_after | integer | NULL | Charge after days |
| kanban | boolean | NULL | Display in Kanban |
| color | text | NULL | Display color |
| kanban_order | integer | NULL | Kanban display order |
| final_state | boolean | NULL | Is final status |
| initial_state | boolean | NULL | Is initial status |
| allow_edition | boolean | NULL | Allow editing |
| allow_deletion | boolean | NULL | Allow deletion |
| created_at | timestamp | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp | DEFAULT NOW() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| created_by | integer | NULL | User ID who created record |
| updated_by | integer | NULL | User ID who last updated record |
| deleted_by | integer | NULL | User ID who deleted record |

---

## BUSINESS LOGIC PATTERNS

### Soft Delete Pattern
All main tables implement soft delete using the `deleted_at` field:
- `NULL` = Active record
- `TIMESTAMP` = Deleted record (when deleted)

### Audit Trail Pattern
All tables include audit fields:
- `created_at`, `created_by` - Record creation tracking
- `updated_at`, `updated_by` - Last modification tracking
- `deleted_at`, `deleted_by` - Deletion tracking

### Entity-Relationship Pattern
Many entities use flexible many-to-many relationships:
- `entity_addresses` - Links any entity type to addresses
- `entity_documents` - Links any entity type to documents

---

## KEY RELATIONSHIPS

1. **Users → Organization Structure**
   - `sys_users.company_id` → `company.id`
   - `sys_users.subsidiary_id` → `subsidiary.id`
   - `sys_users.sys_unit_id` → `sys_unit.id`

2. **Location Hierarchy**
   - `cidade.estado_id` → `estado.id`

3. **Partner Management**
   - `partners.partner_type_id` → `partner_types.id`
   - `partners.gender_id` → `gender.id`

4. **Address Management**
   - `entity_addresses.address_id` → `addresses.id`
   - `entity_addresses.address_type_id` → `address_types.id`

5. **Document Management**
   - `documents.document_type_id` → `document_types.id`
   - `entity_documents.document_id` → `documents.id`

---

**Document Version:** 1.0
**Last Updated:** January 25, 2025
**Created By:** Development Team