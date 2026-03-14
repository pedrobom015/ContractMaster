# Contract Management ERP System

A comprehensive web-based Enterprise Resource Planning (ERP) system specifically designed for contract management with departmental tree navigation and master-detail CRUD interfaces.

## 🏗️ Architecture Overview

This system implements a modular architecture with five core modules:

- **Common Tables** - User management, documents, addresses, and shared entities
- **Contract Management** - Contract lifecycle, beneficiaries, charges, and services
- **Financial Management** - Chart of accounts, transactions, and banking
- **Inventory Management** - Warehouses, products, stock tracking
- **Fleet Management** - Vehicle management, maintenance, and operations

## 🚀 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MySQL 8.0+
- **ORM**: Drizzle ORM with Zod validation
- **Authentication**: JWT with bcrypt
- **Testing**: Jest with Supertest

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: TanStack Query v5
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Design System**: Neumorphic UI with monochromatic palette

### Database
- **Engine**: MySQL 8.0+
- **Character Set**: utf8mb4_unicode_ci
- **Features**: Multi-company support, soft deletes, audit trails
- **Performance**: Optimized indexes and query patterns

## 📁 Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── layout/      # Layout components (Header, Sidebar)
│   │   │   ├── clients/     # Client management components
│   │   │   └── contracts/   # Contract management components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions and configurations
│   └── index.html
├── server/                   # Backend Express application
│   ├── index.ts            # Main server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data access layer
│   └── vite.ts             # Vite development integration
├── shared/                  # Shared TypeScript definitions
│   └── schema.ts           # Database schema and types
├── docs/                   # Comprehensive documentation
│   ├── DATABASE_DICTIONARY.md
│   ├── DEVELOPER_GUIDE.md
│   ├── API_SPECIFICATION.md
│   └── BUSINESS_RULES.md
├── contratos/              # Contract management SQL schemas
├── financeiro/             # Financial management SQL schemas
├── estoque/                # Inventory management SQL schemas
├── frotas/                 # Fleet management SQL schemas
└── common_tables.sql       # Common/shared database tables
```

## 🗄️ Database Modules

### Common Tables (`common_tables.sql`)
Foundation tables for the entire system:
- **User Management**: `sys_user`, `sys_group`, `sys_unit`
- **Company Structure**: `company`, `subsidiary`
- **Document Management**: `document`, `document_type`, `entity_document`
- **Address Management**: `address`, `address_type`, `entity_address`
- **Geographic Data**: `estado`, `cidade`, `cep_cache`
- **System Administration**: `audit_log`, `api_error`, `schema_version`

### Contract Management (`contratos/plano25MyCr.sql`)
Contract lifecycle and service management:
- **Core Contracts**: `contract`, `contract_status`, `contract_status_history`
- **Beneficiaries**: `beneficiary` with relationship tracking
- **Billing**: `contract_charge`, `bank_slip`, `payment_receipt`
- **Services**: `service_funeral`, `medical_foward`, `performed_service`
- **Addendums**: `contract_addendum`, `addendum`

### Financial Management (`financeiro/finan25MyCr.sql`)
Complete financial management system:
- **Chart of Accounts**: `account_type`, `account` with hierarchical structure
- **Banking**: `bank_account`, `currency`, `exchange_rate`
- **Transactions**: `transaction`, `transaction_line`, `journal_entry`
- **Reporting**: `financial_period`, `budget`, `cost_center`

### Inventory Management (`estoque/estoque25MyCr.sql`)
Comprehensive inventory and warehouse management:
- **Warehouses**: `warehouse`, `storage_location`
- **Products**: `product`, `product_category`, `brand`, `product_variant`
- **Stock Management**: `stock_level`, `stock_movement`, `stock_adjustment`
- **Purchasing**: `purchase_order`, `purchase_order_line`, `supplier`
- **Sales**: `sales_order`, `sales_order_line`, `customer`

### Fleet Management (`frotas/fleet25MyCr.sql`)
Vehicle and fleet operations management:
- **Vehicle Management**: `vehicle`, `vehicle_type`, `vehicle_status`
- **Driver Management**: `driver`, `driver_status`, `driver_license`
- **Maintenance**: `maintenance_schedule`, `service_record`, `service_type`
- **Operations**: `trip`, `vehicle_request`, `vehicle_assignment`
- **Expenses**: `vehicle_expense`, `expense_type`, `fuel_log`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE erp_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Execute SQL files in order:
```bash
# 1. Common tables first
mysql -u username -p erp_system < common_tables.sql

# 2. Then module-specific tables
mysql -u username -p erp_system < contratos/plano25MyCr.sql
mysql -u username -p erp_system < financeiro/finan25MyCr.sql
mysql -u username -p erp_system < estoque/estoque25MyCr.sql
mysql -u username -p erp_system < frotas/fleet25MyCr.sql
```

### Application Setup
1. Clone repository and install dependencies:
```bash
git clone <repository-url>
cd contract-management-erp
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and configuration
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🎨 UI Design System

### Neumorphic Design
- **Background**: Monochromatic gray palette (#e0e0e0)
- **Elements**: Soft extruded appearance with dual shadows
- **Buttons**: Tactile pressed/raised effects
- **Cards**: Carved-from-surface appearance
- **Navigation**: Tree-style departmental organization

### Component Classes
```css
.neu-card       /* Main content cards */
.neu-button     /* Interactive buttons */
.neu-pressed    /* Pressed/inset elements */
.neu-flat       /* Flat surface elements */
.neu-input      /* Form input fields */
.neu-sidebar    /* Navigation sidebar */
```

## 📋 Key Features

### ✅ Implemented
- **User Authentication & Authorization**
- **Multi-company Data Isolation**
- **Client Management** (CRUD operations)
- **Neumorphic UI Design System**
- **Responsive Layout with Sidebar Navigation**
- **Database Schema with Referential Integrity**
- **API Foundation with Error Handling**

### 🚧 In Development
- **Contract Management Module**
- **Financial Management Integration**
- **Inventory Management System**
- **Fleet Management Operations**
- **Advanced Reporting & Analytics**

## 🔐 Security Features

- **JWT Authentication** with secure token management
- **Role-based Access Control** (RBAC)
- **Multi-company Data Isolation**
- **Input Validation** with Zod schemas
- **SQL Injection Protection** via ORM
- **Audit Logging** for all data changes
- **Soft Delete** pattern for data retention

## 📊 Business Rules Implementation

The system implements comprehensive business rules covering:
- **Contract Lifecycle Management**
- **Financial Transaction Validation**
- **Inventory Stock Control**
- **Fleet Operations Compliance**
- **Document Management Standards**
- **Multi-level Approval Workflows**

## 🧪 Testing Strategy

### Unit Testing
```bash
npm run test           # Run unit tests
npm run test:coverage  # Run with coverage report
```

### Integration Testing
```bash
npm run test:integration  # API integration tests
```

### End-to-End Testing
```bash
npm run test:e2e  # Playwright E2E tests
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Database Dictionary](docs/DATABASE_DICTIONARY.md)** - Complete table and field documentation
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Implementation patterns and best practices  
- **[API Specification](docs/API_SPECIFICATION.md)** - Complete REST API documentation
- **[Business Rules](docs/BUSINESS_RULES.md)** - Business logic and validation rules

## 🚀 Deployment

### Production Environment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t erp-system .

# Run with Docker Compose
docker-compose up -d
```

## 🤝 Development Workflow

### Module Implementation Order
1. **Phase 1**: Common Tables & User Management ✅
2. **Phase 2**: Contract Management Module 🚧
3. **Phase 3**: Financial Management Module
4. **Phase 4**: Inventory Management Module  
5. **Phase 5**: Fleet Management Module

### Contributing Guidelines
1. Follow TypeScript strict mode guidelines
2. Implement comprehensive error handling
3. Add unit tests for all business logic
4. Update documentation for new features
5. Follow the established neumorphic design patterns

## 📈 Performance Considerations

- **Database Indexing**: Optimized indexes for common queries
- **Query Optimization**: Efficient pagination and filtering
- **Caching Strategy**: Redis caching for frequently accessed data
- **Connection Pooling**: Optimized database connection management
- **Code Splitting**: Lazy loading for frontend modules

## 🔍 Monitoring & Maintenance

- **Error Logging**: Comprehensive error tracking in `api_error` table
- **Audit Trails**: Complete audit logging in `audit_log` table
- **Performance Monitoring**: Database query performance tracking
- **Health Checks**: System health monitoring endpoints
- **Backup Strategy**: Automated database backup procedures

## 📞 Support & Maintenance

For development support and system maintenance:
- Review documentation in `/docs` directory
- Check API endpoints in `API_SPECIFICATION.md`
- Follow business rules in `BUSINESS_RULES.md`
- Reference database structure in `DATABASE_DICTIONARY.md`

## 📄 License

This project is proprietary software for contract management operations.

---

**Version**: 1.0.0  
**Last Updated**: June 2025  
**Database Schema Version**: 1.0.0