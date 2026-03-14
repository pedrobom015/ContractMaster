# Database Data Dictionary
## Contract Management ERP System

### Version: 1.0.0
### Date: June 2025
### Database Engine: MySQL 8.0+

---

## Table of Contents

1. [Common Tables](#common-tables)
2. [Contract Management Module](#contract-management-module)
3. [Financial Management Module](#financial-management-module)
4. [Inventory Management Module](#inventory-management-module)
5. [Fleet Management Module](#fleet-management-module)
6. [Entity Relationships](#entity-relationships)
7. [Data Types and Constraints](#data-types-and-constraints)

---

## Common Tables

### Core System Tables

#### `sys_user`
**Purpose**: Central user management for all system users (clients, employees, partners)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| sys_user_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Username for authentication |
| login | VARCHAR(200) | NOT NULL | Login identifier |
| email | VARCHAR(100) | NOT NULL, UNIQUE | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Encrypted password |
| password_salt | VARCHAR(100) | | Password salt for security |
| first_name | VARCHAR(50) | | User's first name |
| last_name | VARCHAR(50) | | User's last name |
| active | TINYINT(1) | DEFAULT 1 | Account status |
| is_admin | TINYINT(1) | DEFAULT 0 | Administrative privileges |
| two_factor_enabled | TINYINT(1) | DEFAULT 0 | 2FA activation status |
| last_login | TIMESTAMP | NULL | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes**: 
- `idx_user_id` on sys_user_id
- `idx_user_email` on email
- `idx_user_username` on name

#### `company`
**Purpose**: Multi-company support for the ERP system

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| company_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique company identifier |
| name | VARCHAR(100) | NOT NULL | Company name |
| legal_name | VARCHAR(100) | | Legal business name |
| tax_id | VARCHAR(50) | UNIQUE | Tax identification number |
| registration_number | VARCHAR(50) | | Business registration number |
| industry | VARCHAR(50) | | Business industry type |
| active | TINYINT(1) | DEFAULT 1 | Company status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |

#### `subsidiary`
**Purpose**: Company subsidiaries management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| subsidiary_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique subsidiary identifier |
| name | VARCHAR(100) | NOT NULL | Subsidiary name |
| code | VARCHAR(20) | NOT NULL | Subsidiary code |
| status | VARCHAR(50) | NOT NULL | Operational status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Document Management

#### `document`
**Purpose**: File and document storage for users and entities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| document_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique document identifier |
| sys_user_id | INT UNSIGNED | NOT NULL, FK | Document owner |
| document_type_id | INT UNSIGNED | NOT NULL, FK | Type of document |
| document_number | VARCHAR(50) | NOT NULL | Document number/identifier |
| filename | VARCHAR(255) | NOT NULL | Original filename |
| file_path | VARCHAR(500) | NOT NULL | Storage path |
| file_size | INT | | File size in bytes |
| mime_type | VARCHAR(100) | | File MIME type |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

### Address Management

#### `address`
**Purpose**: Address storage for all system entities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| address_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique address identifier |
| sys_user_id | INT UNSIGNED | NOT NULL, FK | Address owner |
| address_type_id | INT UNSIGNED | NOT NULL, FK | Type of address |
| is_main | BOOLEAN | DEFAULT TRUE | Primary address flag |
| zip_code | VARCHAR(50) | NOT NULL | Postal code |
| address | VARCHAR(200) | NOT NULL | Street address |
| address_number | VARCHAR(100) | | Street number |
| city | VARCHAR(200) | NOT NULL | City name |
| state | VARCHAR(100) | | State/province |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

---

## Contract Management Module

### Core Contract Tables

#### `contract`
**Purpose**: Main contracts table (formerly groups)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| contract_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique contract identifier |
| sys_unit_id | INT UNSIGNED | NOT NULL, FK | Business unit |
| sys_user_id | INT | NOT NULL, FK | Contract manager |
| contract_number | VARCHAR(20) | NOT NULL | Contract number |
| contract_type | VARCHAR(50) | NOT NULL | Type of contract |
| start_date | DATE | NOT NULL | Contract start date |
| end_date | DATE | | Contract end date |
| billing_frequenc | INT | DEFAULT 1, NOT NULL | Billing frequency |
| admission | DATE | NOT NULL | Admission date |
| industry | VARCHAR(50) | DEFAULT 'FUNERAL' | Industry type |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

#### `beneficiary`
**Purpose**: Contract beneficiaries

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| beneficiary_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique beneficiary identifier |
| contract_id | INT | NOT NULL, FK | Contract reference |
| relationship | VARCHAR(50) | NOT NULL | Family relationship |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary beneficiary flag |
| name | VARCHAR(100) | NOT NULL | Beneficiary name |
| birth_at | DATE | | Birth date |
| is_alive | BOOLEAN | | Living status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |

#### `contract_charge`
**Purpose**: Contract billing charges

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| contract_charge_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique charge identifier |
| contract_id | INT | NOT NULL, FK | Contract reference |
| charge_code | VARCHAR(100) | NOT NULL | Charge code |
| due_date | DATE | NOT NULL | Due date |
| amount | DECIMAL(19,4) | NOT NULL | Charge amount |
| payment_date | DATE | | Payment date |
| amount_pago | DECIMAL(19,4) | | Paid amount |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last modification time |

---

## Financial Management Module

### Chart of Accounts

#### `account_type`
**Purpose**: Account type definitions (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| account_type_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique type identifier |
| company_id | INT | NOT NULL, FK | Company reference |
| type_name | VARCHAR(50) | NOT NULL | Type name |
| nature | VARCHAR(20) | NOT NULL | Account nature |
| description | TEXT | | Type description |
| active | TINYINT(1) | DEFAULT 1 | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `account`
**Purpose**: Chart of accounts with hierarchical structure

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| account_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique account identifier |
| company_id | INT | NOT NULL, FK | Company reference |
| account_type_id | INT | NOT NULL, FK | Account type |
| parent_account_id | INT | FK | Parent account |
| account_code | VARCHAR(30) | NOT NULL | Account code |
| account_name | VARCHAR(100) | NOT NULL | Account name |
| currency | CHAR(3) | DEFAULT 'BRL' | Currency code |
| opening_balance | DECIMAL(19,4) | DEFAULT 0 | Opening balance |
| current_balance | DECIMAL(19,4) | DEFAULT 0 | Current balance |
| level | INT | NOT NULL | Account level |
| active | TINYINT(1) | DEFAULT 1 | Active status |

#### `bank_account`
**Purpose**: Bank account details for financial operations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| bank_account_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique bank account identifier |
| account_id | INT | NOT NULL, FK | Account reference |
| bank_name | VARCHAR(100) | NOT NULL | Bank name |
| account_number | VARCHAR(50) | | Account number |
| account_holder | VARCHAR(100) | | Account holder name |
| account_type | VARCHAR(30) | | Account type (CHECKING, SAVINGS, etc.) |
| active | TINYINT(1) | DEFAULT 1 | Active status |

---

## Inventory Management Module

### Core Inventory Tables

#### `warehouse`
**Purpose**: Physical warehouse locations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| warehouse_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique warehouse identifier |
| company_id | INT | NOT NULL, FK | Company reference |
| warehouse_name | VARCHAR(100) | NOT NULL | Warehouse name |
| warehouse_code | VARCHAR(20) | NOT NULL | Warehouse code |
| address | VARCHAR(512) | NOT NULL | Warehouse address |
| city | VARCHAR(50) | NOT NULL | City |
| manager_id | INT | FK | Manager reference |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `storage_location`
**Purpose**: Specific storage locations within warehouses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| location_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique location identifier |
| warehouse_id | INT | NOT NULL, FK | Warehouse reference |
| location_code | VARCHAR(20) | NOT NULL | Location code |
| section | VARCHAR(20) | | Section identifier |
| aisle | VARCHAR(20) | | Aisle identifier |
| shelf | VARCHAR(20) | | Shelf identifier |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |

#### `product_category`
**Purpose**: Product categorization hierarchy

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| category_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| parent_category_id | INT | FK | Parent category |
| category_name | VARCHAR(100) | NOT NULL | Category name |
| category_description | VARCHAR(500) | | Category description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `brand`
**Purpose**: Product brand management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| brand_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique brand identifier |
| brand_name | VARCHAR(100) | NOT NULL, UNIQUE | Brand name |
| brand_description | VARCHAR(500) | | Brand description |
| website | VARCHAR(100) | | Brand website |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

---

## Fleet Management Module

### Core Fleet Tables

#### `vehicle_status`
**Purpose**: Vehicle status definitions (Active, Maintenance, Retired, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| vehicle_status_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique status identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Status name |
| description | TEXT | | Status description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `vehicle_type`
**Purpose**: Vehicle type definitions (Car, Truck, Van, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| vehicle_type_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique type identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Type name |
| description | TEXT | | Type description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `driver_status`
**Purpose**: Driver status definitions (Active, Suspended, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| driver_status_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique status identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Status name |
| description | TEXT | | Status description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `maintenance_status`
**Purpose**: Maintenance status definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| maintenance_status_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique status identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Status name |
| description | TEXT | | Status description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

#### `expense_type`
**Purpose**: Vehicle expense types (Fuel, Insurance, Repairs, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| expense_type_id | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Unique expense type identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Expense type name |
| description | TEXT | | Expense description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

---

## Entity Relationships

### Key Relationships Overview

```
company (1) -----> (N) warehouse
company (1) -----> (N) account_type
company (1) -----> (N) account

sys_user (1) -----> (N) contract
sys_user (1) -----> (N) document
sys_user (1) -----> (N) address

contract (1) -----> (N) beneficiary
contract (1) -----> (N) contract_charge
contract (1) -----> (N) contract_addendum

warehouse (1) -----> (N) storage_location

account (1) -----> (N) bank_account
account_type (1) -----> (N) account
```

### Entity Linking Tables

#### `entity_document`
Links documents to clients or partners
- **entity_type**: ENUM('client', 'partner')
- **entity_id**: References client or partner ID
- **document_id**: References document table

#### `entity_address`
Links addresses to clients or partners
- **entity_type**: ENUM('client', 'partner')
- **entity_id**: References client or partner ID
- **address_id**: References address table

#### `entity_sys_user`
Links system users to clients or partners
- **entity_type**: ENUM('client', 'partner')
- **entity_id**: References client or partner ID
- **sys_user_id**: References sys_user table

---

## Data Types and Constraints

### Standard Data Types

| Type | Usage | Description |
|------|-------|-------------|
| INT UNSIGNED | Primary Keys | Auto-incrementing unique identifiers |
| VARCHAR(n) | Text Fields | Variable length strings with maximum length |
| TEXT | Long Text | Extended text content |
| DECIMAL(19,4) | Money | Precise decimal for financial calculations |
| DATE | Dates | Date only (YYYY-MM-DD) |
| TIMESTAMP | Timestamps | Date and time with timezone |
| BOOLEAN/TINYINT(1) | Flags | True/false values |
| CHAR(n) | Fixed Length | Fixed-length strings (codes, abbreviations) |
| ENUM | Controlled Values | Predefined value sets |

### Common Constraints

| Constraint | Purpose | Example |
|------------|---------|---------|
| NOT NULL | Required fields | `name VARCHAR(100) NOT NULL` |
| UNIQUE | Prevent duplicates | `email VARCHAR(100) UNIQUE` |
| DEFAULT | Default values | `active TINYINT(1) DEFAULT 1` |
| AUTO_INCREMENT | Sequential numbering | `id INT AUTO_INCREMENT` |
| FOREIGN KEY | Referential integrity | `FOREIGN KEY (user_id) REFERENCES sys_user(sys_user_id)` |
| CHECK | Value validation | `CHECK (nature IN ('ASSET', 'LIABILITY'))` |

### Soft Delete Pattern

Most tables implement soft delete with:
- `deleted_at TIMESTAMP NULL`
- Records marked as deleted retain `deleted_at` timestamp
- Active records have `deleted_at` as NULL

### Audit Fields

Standard audit pattern includes:
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
- `created_by INT` (user who created)
- `updated_by INT` (user who last updated)
- `deleted_by INT` (user who deleted)

---

## Business Rules and Constraints

### Contract Management
- Contract numbers must be unique within a company
- Beneficiaries must have at least one primary beneficiary per contract
- Contract charges cannot be deleted, only marked as cancelled
- Contract status changes must be logged in history table

### Financial Management
- Account codes must be unique within a company
- Account hierarchy cannot create circular references
- Bank accounts must reference valid chart of accounts entries
- Currency must be valid ISO 4217 code

### Inventory Management
- Warehouse codes must be unique within a company
- Storage locations must be unique within a warehouse
- Product categories support unlimited hierarchy levels
- Brand names must be globally unique

### Fleet Management
- Vehicle status changes must be tracked
- Driver assignments must be validated against driver status
- Maintenance schedules must respect vehicle availability
- Expense tracking requires proper categorization

---

## Index Strategy

### Primary Indexes
- All tables have AUTO_INCREMENT primary keys
- Foreign key fields are automatically indexed

### Performance Indexes
- **User Lookups**: Email and username fields on sys_user
- **Company Data**: All company-specific lookups
- **Status Lookups**: All status and type tables
- **Date Ranges**: Timestamp fields for reporting
- **Financial**: Account codes and balances
- **Inventory**: Product searches and stock levels

### Full-Text Search
- Product categories and brands support full-text search
- Document content and descriptions
- Company and user name searches

---

## Security Considerations

### Access Control
- Multi-company data isolation through company_id
- User permissions managed through sys_group and sys_user_group
- Role-based access control for different modules

### Data Protection
- Password hashing with salt
- Two-factor authentication support
- Soft delete for audit trails
- Comprehensive logging in audit_log table

### API Security
- Error logging in api_error table
- Request/response tracking
- Rate limiting considerations
- Input validation through CHECK constraints

---

This data dictionary provides the foundation for implementing a robust, scalable ERP system with proper data relationships, constraints, and business rule enforcement across all modules.