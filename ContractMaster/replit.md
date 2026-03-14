# Contract Management ERP System

## Overview

This is a comprehensive web-based Enterprise Resource Planning (ERP) system specifically designed for contract management. The system implements a modern full-stack architecture with React frontend, Express.js backend, and PostgreSQL database integration. It features a departmental tree navigation structure and master-detail CRUD interfaces for efficient contract lifecycle management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Design System**: Neumorphic design pattern with monochromatic color palette
- **State Management**: TanStack Query v5 for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full type safety
- **API Design**: RESTful endpoints with consistent response patterns
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas for request/response validation
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Database Architecture
- **Primary Database**: PostgreSQL with utf8mb4 encoding
- **ORM**: Drizzle ORM with TypeScript integration
- **Schema Management**: Migration-based schema evolution
- **Data Integrity**: Foreign key constraints and validation rules
- **Multi-tenancy**: Company-based data separation

## Key Components

### Departmental Modules

#### Contracts Management (Contratos)
- **Normalized 3-Table Structure** (December 2025):
  - `contracts` - Core contract identity (account holder): sysUserId, partnerId, contractName, contractNumber, currentStatus, etc.
  - `contract_services` - Contracted services: contractType, startDate, admission, gracePeriod, industry, servicesAmount, etc.
  - `contract_billing` - Billing/commercial info: sellerId, collectorId, regionId, billingFrequency, payment configuration, etc.
- Contract lifecycle management with client and plan relationships
- Beneficiary management per contract with detailed tracking
- Charge management and billing system integration
- Contract addendums and modification tracking
- Contract history with comprehensive user audit trails
- Master-detail interface with expandable sections for detailed views
- **Backward-compatible API**: All contract endpoints return flattened responses for legacy support plus nested services/billing objects

#### Tables Management (Tabelas)
- Partner management with comprehensive CRUD operations
- Partner type categorization and classification system
- **Advanced Address Management**: Full billing and shipping address system with multiple address types per entity
- Address type definitions with flexible categorization
- Entity-address relationship management with primary/secondary designations
- System user administration with role-based access control

#### Billing Management (Cobrança)
- Batch processing for charge management (BatchChk and BatchDetail)
- Payment tracking and reconciliation
- Invoice generation and management
- Financial reporting and analytics

#### Administration
- Multi-company support with data isolation
- User management with role-based permissions
- Document management with file upload capabilities
- System configuration and maintenance tools

### Core Infrastructure Components

#### Authentication & Authorization
- JWT-based authentication system
- Role-based access control (RBAC)
- Session management with PostgreSQL storage
- Password security with bcrypt hashing

#### Data Management
- Comprehensive CRUD operations for all entities
- Soft delete functionality for data preservation
- Audit trails with created/updated timestamps and user tracking
- Data validation at both client and server levels

#### User Interface Components
- Responsive neumorphic design system
- Professional sidebar navigation with departmental organization
- Consistent card-based layouts across all modules
- Modal dialogs for CRUD operations with form validation
- Data tables with search, filtering, and pagination capabilities
- Toast notifications for user feedback and error handling
- Loading states and comprehensive error handling

## Data Flow

### Client-Server Communication
1. **Frontend** makes API requests through TanStack Query
2. **Express.js server** handles requests with TypeScript route handlers
3. **Zod validation** ensures data integrity at API boundaries
4. **Drizzle ORM** manages database operations with type safety
5. **PostgreSQL** stores and retrieves data with ACID compliance

### State Management Flow
1. **TanStack Query** manages server state with caching and synchronization
2. **React Hook Form** handles local form state with validation
3. **Zod schemas** provide consistent validation across client and server
4. **Toast notifications** provide user feedback for all operations

### Address Management Flow
The system implements a sophisticated address management system:
1. **Entities** (partners, clients) can have multiple addresses
2. **Address types** define the purpose (billing, shipping, correspondence)
3. **Entity-address relationships** manage the associations with primary/secondary flags
4. **Tabbed interface** allows easy switching between address types

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL connection management
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI primitives
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing

### Development Dependencies
- **typescript**: Type checking and compilation
- **vite**: Build tool and development server
- **eslint**: Code quality and consistency
- **@types/**: TypeScript type definitions

### Database Dependencies
- **PostgreSQL 16**: Primary database engine
- **connect-pg-simple**: Session storage in PostgreSQL
- **ws**: WebSocket support for real-time features

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite provides instant feedback during development
- **Development Server**: Runs on port 5000 with automatic restart
- **Database**: PostgreSQL 16 module provisioned automatically

### Production Build
- **Build Process**: `npm run build` creates optimized production assets
- **Asset Optimization**: Vite handles code splitting and asset optimization
- **Environment Variables**: Secure configuration management
- **Database Migrations**: Drizzle kit handles schema updates

### Autoscale Deployment
- **Deployment Target**: Configured for autoscale deployment
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port Configuration**: External port 80 mapped to internal port 5000

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 24, 2025. Initial setup
- January 14, 2025. Converted multiple modules to real API calls:
  - Partners module: Full CRUD operations with real API
  - Document Types module: Full CRUD operations with real API
  - Clients module: Full CRUD operations with real API
  - Batch Management module: Full CRUD operations with real API
  - Address Types module: Full CRUD operations with real API (in Auxiliary Tables)
  - Storage layer: Added methods for address types, addresses, and entity addresses
  - Backend routes: Added endpoints for address types management
  - Admin Users module: In progress - API integration started
- January 18, 2025. Financial Module Implementation:
  - Added comprehensive financial database schema including account types, accounts, cost centers, departments, projects, and fiscal periods
  - Implemented Chart of Accounts page with hierarchical display and full CRUD operations
  - Created financial API endpoints with complete backend storage layer
  - Added financial menu structure in sidebar with user-friendly hierarchical organization
  - Database tables created: account_types, accounts, cost_centers, departments, projects, fiscal_years, fiscal_periods
  - Chart of Accounts supports multi-level hierarchical structure with account types, nature classification, and detailed properties
- January 19, 2025. Partners CRUD Pattern Standardization:
  - Successfully applied Partners CRUD pattern to ALL financial setup pages
  - Cost Centers, Departments, Projects, and Chart of Accounts now follow exact same design pattern
  - Consistent neumorphic styling with neu-card, neu-flat, neu-input, neu-button classes
  - Portuguese labels and validation throughout all pages
  - Same layout structure: sidebar, header, search bar, action buttons, main content card
  - React Hook Form with Zod validation for all forms
  - Chart of Accounts maintains special accounting features within Partners pattern (hierarchical display, balance formatting, account properties)
- January 25, 2025. Navigation and Billing Module Updates:
  - Fixed navigation behavior: sidebar now returns to collapsed state when navigating to dashboard
  - Added "Início" (Home) buttons in both sidebar and header for easy navigation reset
  - Transformed "Cobrança - Lançamentos" (Billing Entries) page to follow Partners CRUD pattern
  - Billing page now has consistent neumorphic design, Portuguese labels, and same layout structure
  - Maintained financial data fields (batch numbers, payment values, expenses) within clean CRUD interface
- January 25, 2025. Comprehensive Documentation Package Creation:
  - Created complete documentation package for team alignment and legacy migration planning
  - 01_DATA_DICTIONARY.md: Complete database field definitions, relationships, and business rules
  - 02_SQL_STRUCTURE_DOCUMENTATION.md: Full database creation scripts, indexes, and maintenance procedures
  - 03_DEVELOPER_MANUAL.md: Technical development guidelines, patterns, and architecture documentation
  - 04_TABLE_RELATIONSHIP_DIAGRAM.md: Visual database relationships and integration patterns with ASCII ERDs
  - 05_LEGACY_MIGRATION_STRATEGY.md: Complete framework for legacy system assessment and migration
  - 00_DOCUMENTATION_INDEX.md: Master index with quick reference guide and system overview
  - Documentation covers current system status, known issues, next development phases, and team coordination
- December 29, 2025. Contract Table Normalization:
  - Restructured monolithic contracts table (44 fields) into 3 normalized tables:
    - `contracts` (core): 9 fields - sysUserId, partnerId, contractName, contractNumber, currentStatus, etc.
    - `contract_services`: 17 fields - contractType, startDate, admission, industry, timestamps (5 fields), etc.
    - `contract_billing`: 15 fields - sellerId, collectorId, billingFrequency, payment configuration, etc.
  - API backward compatibility maintained with flattened responses and ownerId alias
  - Empty string handling: All optional fields use emptyToUndefined helper to accept legacy "" values
  - Timestamp handling: z.coerce.date() in schemas accepts both ISO strings and Date objects
  - Required fields (startDate, admission) fail validation if missing - no silent defaults