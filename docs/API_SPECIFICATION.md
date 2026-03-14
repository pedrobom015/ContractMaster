# API Specification
## Contract Management ERP System

### Version: 1.0.0
### Date: June 2025
### Base URL: `/api/v1`

---

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Login Endpoint
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@company.com",
      "company_id": 1
    }
  }
}
```

---

## Common Tables Module

### Users Management

#### List Users
```http
GET /api/v1/common/users?page=1&limit=50&active=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sys_user_id": 1,
      "name": "john_doe",
      "email": "john@company.com",
      "first_name": "John",
      "last_name": "Doe",
      "active": true,
      "is_admin": false,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

#### Create User
```http
POST /api/v1/common/users
Content-Type: application/json

{
  "name": "jane_smith",
  "email": "jane@company.com",
  "password": "securePassword123",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

#### Get User by ID
```http
GET /api/v1/common/users/{id}
```

#### Update User
```http
PUT /api/v1/common/users/{id}
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith-Johnson",
  "active": true
}
```

#### Delete User (Soft Delete)
```http
DELETE /api/v1/common/users/{id}
```

### Document Management

#### Upload Document
```http
POST /api/v1/common/documents
Content-Type: multipart/form-data

{
  "file": <binary_data>,
  "document_type_id": 1,
  "document_number": "123.456.789-00"
}
```

#### Get Documents for Entity
```http
GET /api/v1/common/documents?entity_type=client&entity_id=123
```

#### Download Document
```http
GET /api/v1/common/documents/{id}/download
```

### Address Management

#### Create Address
```http
POST /api/v1/common/addresses
Content-Type: application/json

{
  "sys_user_id": 1,
  "address_type_id": 1,
  "zip_code": "01234-567",
  "address": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "is_main": true
}
```

#### Get Addresses for User
```http
GET /api/v1/common/users/{user_id}/addresses
```

---

## Contract Management Module

### Contracts

#### List Contracts
```http
GET /api/v1/contracts?page=1&limit=50&status=active&start_date_from=2025-01-01
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "contract_id": 1,
      "contract_number": "CT-2025-001",
      "contract_type": "FUNERAL",
      "start_date": "2025-01-01",
      "end_date": null,
      "billing_frequency": 1,
      "industry": "FUNERAL",
      "status": {
        "id": 1,
        "name": "Active",
        "code": "AT"
      },
      "client": {
        "id": 1,
        "name": "João Silva"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Contract
```http
POST /api/v1/contracts
Content-Type: application/json

{
  "contract_number": "CT-2025-002",
  "contract_type": "FUNERAL",
  "start_date": "2025-01-15",
  "sys_unit_id": 1,
  "owner_id": 1,
  "billing_frequency": 1,
  "admission": "2025-01-15"
}
```

#### Get Contract Details
```http
GET /api/v1/contracts/{id}?include=beneficiaries,charges,addendums
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contract_id": 1,
    "contract_number": "CT-2025-001",
    "contract_type": "FUNERAL",
    "start_date": "2025-01-01",
    "beneficiaries": [
      {
        "beneficiary_id": 1,
        "name": "João Silva",
        "relationship": "titular",
        "is_primary": true,
        "birth_at": "1980-05-15",
        "is_alive": true
      }
    ],
    "charges": [
      {
        "contract_charge_id": 1,
        "charge_code": "CH-2025-001-01",
        "due_date": "2025-02-01",
        "amount": "150.00",
        "payment_status": "pending"
      }
    ],
    "addendums": []
  }
}
```

#### Update Contract
```http
PUT /api/v1/contracts/{id}
Content-Type: application/json

{
  "end_date": "2025-12-31",
  "billing_frequency": 2
}
```

### Beneficiaries

#### List Contract Beneficiaries
```http
GET /api/v1/contracts/{contract_id}/beneficiaries
```

#### Add Beneficiary
```http
POST /api/v1/contracts/{contract_id}/beneficiaries
Content-Type: application/json

{
  "name": "Maria Silva",
  "relationship": "spouse",
  "birth_at": "1985-03-20",
  "is_primary": false,
  "document_id": 2
}
```

#### Update Beneficiary
```http
PUT /api/v1/beneficiaries/{id}
Content-Type: application/json

{
  "relationship": "ex-spouse",
  "is_alive": false
}
```

#### Remove Beneficiary
```http
DELETE /api/v1/beneficiaries/{id}
```

### Contract Charges

#### List Contract Charges
```http
GET /api/v1/contracts/{contract_id}/charges?status=pending&due_date_from=2025-01-01
```

#### Create Charge
```http
POST /api/v1/contracts/{contract_id}/charges
Content-Type: application/json

{
  "charge_code": "CH-2025-001-02",
  "due_date": "2025-03-01",
  "amount": "150.00",
  "payment_status_id": 1
}
```

#### Update Charge
```http
PUT /api/v1/charges/{id}
Content-Type: application/json

{
  "payment_date": "2025-02-28",
  "amount_pago": "150.00",
  "payment_status_id": 2
}
```

### Bank Slips (Boletos)

#### Generate Bank Slip
```http
POST /api/v1/charges/{charge_id}/bank-slips
Content-Type: application/json

{
  "seq": "0000001",
  "nnumber": "12345678901234567890",
  "charge_code": "34191234567890123456789012345678901234567890"
}
```

#### Get Bank Slip Status
```http
GET /api/v1/bank-slips/{id}
```

#### Process Bank Slip Response
```http
PUT /api/v1/bank-slips/{id}/response
Content-Type: application/json

{
  "response": "PAID",
  "response_batch": "0000123",
  "response_at": "2025-02-28T10:30:00Z"
}
```

---

## Financial Management Module

### Chart of Accounts

#### List Account Types
```http
GET /api/v1/financial/account-types?company_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "account_type_id": 1,
      "type_name": "Current Assets",
      "nature": "ASSET",
      "description": "Short-term assets",
      "active": true
    }
  ]
}
```

#### Create Account Type
```http
POST /api/v1/financial/account-types
Content-Type: application/json

{
  "company_id": 1,
  "type_name": "Fixed Assets",
  "nature": "ASSET",
  "description": "Long-term tangible assets"
}
```

#### List Accounts
```http
GET /api/v1/financial/accounts?company_id=1&level=1&active=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "account_id": 1,
      "account_code": "1.01.001",
      "account_name": "Cash on Hand",
      "account_type": "Current Assets",
      "parent_account_id": null,
      "currency": "BRL",
      "current_balance": "50000.00",
      "level": 1,
      "is_bank_account": false
    }
  ]
}
```

#### Create Account
```http
POST /api/v1/financial/accounts
Content-Type: application/json

{
  "company_id": 1,
  "account_type_id": 1,
  "account_code": "1.01.002",
  "account_name": "Bank Account - Main",
  "description": "Primary business bank account",
  "is_bank_account": true,
  "currency": "BRL",
  "opening_balance": "100000.00",
  "level": 1
}
```

### Bank Accounts

#### List Bank Accounts
```http
GET /api/v1/financial/bank-accounts?active=true
```

#### Create Bank Account
```http
POST /api/v1/financial/bank-accounts
Content-Type: application/json

{
  "account_id": 2,
  "bank_name": "Banco do Brasil",
  "account_number": "12345-6",
  "routing_number": "001",
  "account_holder": "Company Name LTDA",
  "account_type": "CHECKING",
  "default_for_payments": true
}
```

#### Get Account Balance
```http
GET /api/v1/financial/accounts/{id}/balance?date=2025-01-31
```

---

## Inventory Management Module

### Warehouses

#### List Warehouses
```http
GET /api/v1/inventory/warehouses?company_id=1&active=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "warehouse_id": 1,
      "warehouse_name": "Main Warehouse",
      "warehouse_code": "WH001",
      "address": "Rua Industrial, 500",
      "city": "São Paulo",
      "state": "SP",
      "manager_id": 5,
      "is_active": true
    }
  ]
}
```

#### Create Warehouse
```http
POST /api/v1/inventory/warehouses
Content-Type: application/json

{
  "company_id": 1,
  "warehouse_name": "Secondary Warehouse",
  "warehouse_code": "WH002",
  "address": "Av. Logística, 1000",
  "city": "Campinas",
  "state": "SP",
  "manager_id": 6
}
```

### Storage Locations

#### List Storage Locations
```http
GET /api/v1/inventory/warehouses/{warehouse_id}/locations?active=true
```

#### Create Storage Location
```http
POST /api/v1/inventory/warehouses/{warehouse_id}/locations
Content-Type: application/json

{
  "location_code": "A1-01-05",
  "location_name": "Aisle A, Section 1, Shelf 5",
  "section": "A1",
  "aisle": "01",
  "shelf": "05"
}
```

### Product Categories

#### List Categories (Hierarchical)
```http
GET /api/v1/inventory/categories?parent_id=null
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "category_name": "Funeral Supplies",
      "category_description": "All funeral-related products",
      "parent_category_id": null,
      "children": [
        {
          "category_id": 2,
          "category_name": "Caskets",
          "parent_category_id": 1
        }
      ]
    }
  ]
}
```

#### Create Category
```http
POST /api/v1/inventory/categories
Content-Type: application/json

{
  "category_name": "Memorial Products",
  "category_description": "Memorial and remembrance items",
  "parent_category_id": 1
}
```

### Brands

#### List Brands
```http
GET /api/v1/inventory/brands?search=batesville
```

#### Create Brand
```http
POST /api/v1/inventory/brands
Content-Type: application/json

{
  "brand_name": "Batesville Casket Company",
  "brand_description": "Premium casket manufacturer",
  "website": "https://www.batesville.com"
}
```

---

## Fleet Management Module

### Vehicle Status Management

#### List Vehicle Statuses
```http
GET /api/v1/fleet/vehicle-statuses
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "vehicle_status_id": 1,
      "name": "Active",
      "description": "Vehicle is operational and available"
    },
    {
      "vehicle_status_id": 2,
      "name": "Maintenance",
      "description": "Vehicle is under maintenance"
    }
  ]
}
```

#### Create Vehicle Status
```http
POST /api/v1/fleet/vehicle-statuses
Content-Type: application/json

{
  "name": "Out of Service",
  "description": "Vehicle is permanently out of service"
}
```

### Vehicle Types

#### List Vehicle Types
```http
GET /api/v1/fleet/vehicle-types
```

#### Create Vehicle Type
```http
POST /api/v1/fleet/vehicle-types
Content-Type: application/json

{
  "name": "Hearse",
  "description": "Vehicle for transporting deceased"
}
```

### Driver Management

#### List Driver Statuses
```http
GET /api/v1/fleet/driver-statuses
```

#### Create Driver Status
```http
POST /api/v1/fleet/driver-statuses
Content-Type: application/json

{
  "name": "On Leave",
  "description": "Driver is temporarily unavailable"
}
```

### Maintenance

#### List Maintenance Statuses
```http
GET /api/v1/fleet/maintenance-statuses
```

#### List Service Types
```http
GET /api/v1/fleet/service-types
```

#### Create Service Type
```http
POST /api/v1/fleet/service-types
Content-Type: application/json

{
  "name": "Oil Change",
  "description": "Regular engine oil replacement"
}
```

### Expenses

#### List Expense Types
```http
GET /api/v1/fleet/expense-types?active=true
```

#### Create Expense Type
```http
POST /api/v1/fleet/expense-types
Content-Type: application/json

{
  "name": "Fuel",
  "description": "Vehicle fuel expenses"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request data validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Requested resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `BUSINESS_RULE_VIOLATION` | 422 | Business logic validation failed |
| `INTERNAL_ERROR` | 500 | Server internal error |

---

## Pagination

### Standard Pagination Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

### Pagination Response
```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Filtering and Sorting

### Common Filter Parameters
- `active`: Filter by active status (true/false)
- `created_at_from`: Filter records from date
- `created_at_to`: Filter records to date
- `search`: Full-text search (where supported)

### Sorting
- `sort`: Field to sort by
- `order`: Sort direction (`asc` or `desc`)

Example:
```http
GET /api/v1/contracts?sort=created_at&order=desc&active=true&page=1&limit=25
```

---

## Rate Limiting

### Default Limits
- **Authentication endpoints**: 5 requests per minute
- **General API**: 100 requests per minute
- **File uploads**: 10 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## API Versioning

The API uses URI versioning with the format `/api/v{version}`. Current version is `v1`.

### Version Compatibility
- **v1**: Current stable version
- **v2**: Future version (backward compatible migration path will be provided)

---

This API specification provides comprehensive endpoint documentation for all modules of the Contract Management ERP system, enabling efficient integration and development.