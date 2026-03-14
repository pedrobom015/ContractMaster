# Business Rules Documentation
## Contract Management ERP System

### Version: 1.0.0
### Date: June 2025
### Target: Business Analysts & Developers

---

## Table of Contents

1. [Common Business Rules](#common-business-rules)
2. [Contract Management Rules](#contract-management-rules)
3. [Financial Management Rules](#financial-management-rules)
4. [Inventory Management Rules](#inventory-management-rules)
5. [Fleet Management Rules](#fleet-management-rules)
6. [Data Validation Rules](#data-validation-rules)
7. [Security and Access Rules](#security-and-access-rules)

---

## Common Business Rules

### User Management

#### BR-USR-001: User Registration
- **Rule**: Every user must have a unique email address within the system
- **Validation**: Email format validation required (RFC 5322 standard)
- **Exception**: System administrators can create users without email confirmation
- **Implementation**: Database UNIQUE constraint on `sys_user.email`

#### BR-USR-002: Password Security
- **Rule**: Passwords must meet minimum security requirements
- **Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Implementation**: Validation in user creation/update forms and API

#### BR-USR-003: User Deactivation
- **Rule**: Users cannot be permanently deleted if they have associated records
- **Process**: Use soft delete (set `deleted_at` timestamp)
- **Impact**: Maintains referential integrity and audit trails
- **Exception**: System test users can be hard deleted in development environments

#### BR-USR-004: Multi-Company Access Control
- **Rule**: Users can only access data within their assigned company
- **Implementation**: All queries must include company_id filter
- **Exception**: Super administrators can access multiple companies
- **Enforcement**: Database triggers and application-level access control

### Document Management

#### BR-DOC-001: Document Types
- **Rule**: Only predefined document types are accepted
- **Valid Types**: CPF, CNPJ, RG, CNH, Passport, Birth Certificate, Marriage Certificate
- **Validation**: Document format validation based on type
- **Storage**: Documents stored with proper file naming convention

#### BR-DOC-002: CPF Validation
- **Rule**: CPF numbers must pass mathematical validation algorithm
- **Format**: XXX.XXX.XXX-XX (11 digits)
- **Algorithm**: Mod-11 check digit validation
- **Implementation**: Server-side validation before storage

#### BR-DOC-003: CNPJ Validation
- **Rule**: CNPJ numbers must pass mathematical validation algorithm
- **Format**: XX.XXX.XXX/XXXX-XX (14 digits)
- **Algorithm**: Mod-11 check digit validation
- **Implementation**: Server-side validation before storage

#### BR-DOC-004: Document Retention
- **Rule**: Documents cannot be deleted, only marked as inactive
- **Reason**: Legal compliance and audit requirements
- **Process**: Set `deleted_at` timestamp for soft delete
- **Archive**: Move to archive storage after 7 years

### Address Management

#### BR-ADDR-001: Primary Address
- **Rule**: Each entity must have exactly one primary address
- **Validation**: When setting an address as primary, remove primary flag from others
- **Exception**: Entities can exist temporarily without addresses during creation
- **Implementation**: Database trigger or application logic

#### BR-ADDR-002: ZIP Code Validation
- **Rule**: Brazilian ZIP codes must follow XXXXX-XXX format
- **Validation**: 8 digits with optional hyphen formatting
- **Cache**: Use `cep_cache` table for address auto-completion
- **API Integration**: Integrate with ViaCEP or similar service

---

## Contract Management Rules

### Contract Creation and Management

#### BR-CTR-001: Contract Number Uniqueness
- **Rule**: Contract numbers must be unique within each company
- **Format**: Configurable format (default: CT-YYYY-NNNN)
- **Generation**: Auto-generated with sequential numbering
- **Reset**: Annual reset option available

#### BR-CTR-002: Contract Status Workflow
- **Rule**: Contract status changes must follow predefined workflow
- **Allowed Transitions**:
  - Draft → Active
  - Active → Suspended
  - Suspended → Active
  - Active → Cancelled
  - Suspended → Cancelled
- **Restriction**: Cancelled contracts cannot be reactivated
- **Logging**: All status changes must be logged with reason and user

#### BR-CTR-003: Billing Frequency
- **Rule**: Billing frequency determines charge generation schedule
- **Options**: 
  - 1 = Monthly
  - 2 = Bi-monthly
  - 3 = Quarterly
  - 6 = Semi-annually
  - 12 = Annually
- **Implementation**: Automated charge generation based on frequency

#### BR-CTR-004: Grace Period Management
- **Rule**: Contracts can have configurable grace periods
- **Default**: 30 days from admission date
- **Billing Impact**: No charges generated during grace period
- **Service Access**: Services available during grace period

### Beneficiary Management

#### BR-BEN-001: Primary Beneficiary Requirement
- **Rule**: Every contract must have exactly one primary beneficiary
- **Validation**: Only one beneficiary can be marked as `is_primary = true`
- **Business Logic**: Primary beneficiary is the contract holder
- **Update Process**: When changing primary beneficiary, update previous primary

#### BR-BEN-002: Beneficiary Age Restrictions
- **Rule**: Age-based service restrictions apply
- **Categories**:
  - Child (0-12): Limited services
  - Teen (13-17): Requires guardian consent
  - Adult (18+): Full services
  - Senior (65+): Enhanced services
- **Calculation**: Age calculated from `birth_at` field

#### BR-BEN-003: Deceased Beneficiary Handling
- **Rule**: When beneficiary dies, update status and trigger service process
- **Process**:
  1. Set `is_alive = false`
  2. Create service_funeral record
  3. Update contract statistics
  4. Generate final billing adjustments
- **Documentation**: Death certificate required

#### BR-BEN-004: Beneficiary Documentation
- **Rule**: All beneficiaries must have valid identification documents
- **Required**: At least one government-issued ID
- **Preferred**: CPF for Brazilian citizens
- **Alternative**: Passport for foreign nationals
- **Validation**: Document authenticity verification required

### Charging and Billing

#### BR-CHG-001: Charge Generation Rules
- **Rule**: Charges generated automatically based on contract billing frequency
- **Schedule**: Generated on the 1st of each billing period
- **Amount**: Based on contract plan and addendums
- **Adjustments**: Pro-rata calculations for partial periods

#### BR-CHG-002: Payment Processing
- **Rule**: Payments must be applied to oldest charges first (FIFO)
- **Partial Payments**: Allowed if contract permits (`is_partial_payments_allowed`)
- **Overpayments**: Applied as credit to future charges
- **Refunds**: Require approval workflow

#### BR-CHG-003: Late Fees
- **Rule**: Late fees applied based on contract terms
- **Calculation**: Percentage-based on overdue amount
- **Grace Period**: Additional grace period before late fee application
- **Maximum**: Late fees cannot exceed principal amount

#### BR-CHG-004: Bank Slip (Boleto) Management
- **Rule**: Bank slips must follow FEBRABAN standards
- **Numbering**: Sequential numbering per institution
- **Expiration**: Default 30 days from due date
- **Processing**: Automated return file processing
- **Reconciliation**: Daily reconciliation required

### Service Management

#### BR-SRV-001: Service Eligibility
- **Rule**: Services only available to contracts in good standing
- **Criteria**:
  - Contract status: Active
  - No overdue payments beyond grace period
  - Valid beneficiary documentation
- **Emergency**: Emergency services available regardless of payment status

#### BR-SRV-002: Funeral Service Process
- **Rule**: Funeral services follow standardized process
- **Requirements**:
  - Death certificate
  - Beneficiary identification
  - Contract verification
  - Service authorization
- **Documentation**: Complete service record required

#### BR-SRV-003: Service Billing
- **Rule**: Service costs billed according to contract terms
- **Coverage**: Basic services covered by monthly fees
- **Additional**: Extra services billed separately
- **Insurance**: Integration with insurance providers

---

## Financial Management Rules

### Chart of Accounts

#### BR-FIN-001: Account Code Structure
- **Rule**: Hierarchical account coding system required
- **Format**: X.XX.XXX (Level.Group.Account)
- **Levels**:
  - Level 1: Asset, Liability, Equity, Revenue, Expense
  - Level 2: Sub-categories
  - Level 3: Detailed accounts
- **Uniqueness**: Account codes unique within company

#### BR-FIN-002: Account Balance Validation
- **Rule**: Asset and Expense accounts have debit balances
- **Rule**: Liability, Equity, and Revenue accounts have credit balances
- **Validation**: Real-time balance validation on transactions
- **Reporting**: Balance sheet must always balance (Assets = Liabilities + Equity)

#### BR-FIN-003: Account Hierarchy
- **Rule**: Parent-child relationships must be maintained
- **Restriction**: Cannot delete parent account with child accounts
- **Balances**: Parent account balances calculated from children
- **Reporting**: Hierarchical reporting structure

### Transaction Management

#### BR-FIN-004: Double Entry Bookkeeping
- **Rule**: All transactions must balance (debits = credits)
- **Minimum**: Each transaction requires minimum 2 entries
- **Validation**: System validates balance before saving
- **Audit**: Complete audit trail for all transactions

#### BR-FIN-005: Transaction Approval
- **Rule**: Transactions above threshold require approval
- **Thresholds**:
  - < R$ 1,000: Auto-approved
  - R$ 1,000 - R$ 10,000: Manager approval
  - > R$ 10,000: Director approval
- **Process**: Electronic approval workflow

#### BR-FIN-006: Period Closing
- **Rule**: Financial periods must be closed sequentially
- **Restriction**: Cannot close period with pending transactions
- **Process**: Month-end closing procedures required
- **Reopening**: Requires special authorization

### Banking and Payments

#### BR-FIN-007: Bank Reconciliation
- **Rule**: Daily bank reconciliation required
- **Tolerance**: Zero tolerance for unreconciled items
- **Process**: Automated reconciliation preferred
- **Investigation**: Unmatched items require investigation

#### BR-FIN-008: Payment Authorization
- **Rule**: All payments require proper authorization
- **Limits**: User-based payment limits
- **Approval**: Dual approval for large payments
- **Documentation**: Supporting documentation required

---

## Inventory Management Rules

### Warehouse Management

#### BR-INV-001: Warehouse Security
- **Rule**: All warehouse transactions must be logged
- **Access Control**: Role-based access to warehouses
- **Audit Trail**: Complete movement history
- **Physical Security**: Regular physical inventory counts

#### BR-INV-002: Storage Location Uniqueness
- **Rule**: Storage locations must be unique within warehouse
- **Format**: Configurable location coding system
- **Hierarchy**: Section-Aisle-Shelf-Bin structure
- **Optimization**: Location assignment optimization

### Product Management

#### BR-INV-003: Product Categorization
- **Rule**: All products must be assigned to categories
- **Hierarchy**: Unlimited category hierarchy levels
- **Reporting**: Category-based reporting and analysis
- **Searching**: Full-text search capabilities

#### BR-INV-004: Brand Management
- **Rule**: Product brands must be consistently managed
- **Uniqueness**: Brand names must be unique globally
- **Information**: Complete brand information required
- **Compliance**: Brand licensing compliance

### Stock Management

#### BR-INV-005: Stock Level Monitoring
- **Rule**: Real-time stock level tracking required
- **Minimum Levels**: Automatic reorder point alerts
- **Negative Stock**: Negative stock not allowed for controlled items
- **Adjustments**: Stock adjustments require proper authorization

#### BR-INV-006: Movement Tracking
- **Rule**: All stock movements must be tracked
- **Types**: Receipt, Issue, Transfer, Adjustment
- **Documentation**: Supporting documentation required
- **Approval**: Manager approval for large adjustments

---

## Fleet Management Rules

### Vehicle Management

#### BR-FLT-001: Vehicle Registration
- **Rule**: All vehicles must be properly registered
- **Documentation**: Registration, insurance, inspection certificates
- **Status Tracking**: Current status always maintained
- **Compliance**: Regulatory compliance monitoring

#### BR-FLT-002: Vehicle Maintenance
- **Rule**: Preventive maintenance schedules must be followed
- **Scheduling**: Mileage and time-based maintenance
- **Records**: Complete maintenance history
- **Safety**: Safety inspections required

### Driver Management

#### BR-FLT-003: Driver Qualification
- **Rule**: All drivers must meet qualification requirements
- **License**: Valid driver's license required
- **Training**: Company-specific training completed
- **Medical**: Current medical clearance
- **Background**: Background check verification

#### BR-FLT-004: Driver Assignment
- **Rule**: Vehicle assignments based on driver qualifications
- **Matching**: Vehicle type to license class matching
- **Availability**: Driver availability tracking
- **Rotation**: Fair rotation of assignments

### Operations Management

#### BR-FLT-005: Trip Authorization
- **Rule**: All trips must be properly authorized
- **Request Process**: Formal trip request required
- **Approval**: Appropriate approval levels
- **Documentation**: Complete trip documentation
- **Cost Tracking**: Trip cost allocation

#### BR-FLT-006: Expense Management
- **Rule**: All vehicle expenses must be properly categorized
- **Categories**: Fuel, maintenance, insurance, registration
- **Approval**: Expense approval workflow
- **Budget**: Budget vs. actual tracking
- **Reporting**: Regular expense reporting

---

## Data Validation Rules

### Field Validation

#### BR-VAL-001: Required Field Validation
- **Rule**: All required fields must be completed before save
- **UI Indication**: Clear marking of required fields
- **Error Messages**: Specific validation error messages
- **Form Behavior**: Prevent submission with missing required fields

#### BR-VAL-002: Data Type Validation
- **Rule**: All fields must contain valid data types
- **Numeric**: Proper numeric validation
- **Date**: Valid date format and range
- **Email**: Valid email format
- **Phone**: Valid phone number format

#### BR-VAL-003: Range Validation
- **Rule**: Numeric and date fields must be within valid ranges
- **Amounts**: Positive amounts where applicable
- **Dates**: Future dates where appropriate
- **Percentages**: 0-100% range validation
- **Quantities**: Non-negative quantities

### Business Logic Validation

#### BR-VAL-004: Referential Integrity
- **Rule**: All foreign key references must be valid
- **Cascade**: Proper cascade delete/update behavior
- **Orphans**: Prevent orphaned records
- **Consistency**: Maintain data consistency

#### BR-VAL-005: Business Rule Validation
- **Rule**: All business rules must be validated before save
- **Contract Rules**: Contract-specific validations
- **Financial Rules**: Financial transaction validations
- **Inventory Rules**: Stock movement validations
- **Fleet Rules**: Vehicle and driver validations

---

## Security and Access Rules

### Authentication

#### BR-SEC-001: Strong Authentication
- **Rule**: Multi-factor authentication for sensitive operations
- **Password Policy**: Strong password requirements
- **Session Management**: Secure session handling
- **Timeout**: Automatic session timeout

#### BR-SEC-002: Authorization Levels
- **Rule**: Role-based access control (RBAC)
- **Roles**: Predefined system roles
- **Permissions**: Granular permission system
- **Inheritance**: Role inheritance capabilities

### Data Protection

#### BR-SEC-003: Data Encryption
- **Rule**: Sensitive data must be encrypted
- **At Rest**: Database encryption for sensitive fields
- **In Transit**: TLS encryption for all communications
- **Key Management**: Proper key management procedures

#### BR-SEC-004: Audit Logging
- **Rule**: All system activities must be logged
- **User Actions**: Complete user action logging
- **Data Changes**: Before/after values for changes
- **System Events**: System-level event logging
- **Retention**: Log retention per compliance requirements

### Privacy and Compliance

#### BR-SEC-005: Data Privacy
- **Rule**: Personal data protection per LGPD compliance
- **Consent**: Explicit consent for data processing
- **Access Rights**: Data subject access rights
- **Deletion**: Right to data deletion
- **Portability**: Data portability capabilities

#### BR-SEC-006: Compliance Monitoring
- **Rule**: Continuous compliance monitoring
- **Regulations**: Industry regulation compliance
- **Standards**: Security standard adherence
- **Reporting**: Regular compliance reporting
- **Remediation**: Compliance violation remediation

---

## Exception Handling

### Business Rule Exceptions

#### BR-EXC-001: Emergency Override
- **Rule**: Emergency override capabilities for critical situations
- **Authorization**: High-level authorization required
- **Documentation**: Complete justification documentation
- **Audit**: Enhanced audit logging for overrides
- **Review**: Post-override review process

#### BR-EXC-002: System Maintenance
- **Rule**: Temporary rule suspension during maintenance
- **Notification**: User notification of maintenance mode
- **Limitations**: Limited functionality during maintenance
- **Recovery**: Automatic rule re-enablement post-maintenance

### Error Recovery

#### BR-EXC-003: Data Recovery
- **Rule**: Comprehensive data recovery procedures
- **Backups**: Regular automated backups
- **Testing**: Regular recovery testing
- **Documentation**: Detailed recovery procedures
- **Timeline**: Recovery time objectives (RTO)

#### BR-EXC-004: Business Continuity
- **Rule**: Business continuity planning
- **Disaster Recovery**: Disaster recovery procedures
- **Alternative Processes**: Manual process alternatives
- **Communication**: Stakeholder communication plans
- **Training**: Regular continuity training

---

This business rules documentation provides comprehensive guidelines for implementing and maintaining the Contract Management ERP system with proper validation, security, and compliance measures.