# Developer Implementation Guide
## Contract Management ERP System

### Version: 1.0.0
### Date: June 2025
### Target: Development Team

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module Implementation Strategy](#module-implementation-strategy)
3. [API Design Patterns](#api-design-patterns)
4. [Database Integration](#database-integration)
5. [Security Implementation](#security-implementation)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Guidelines](#deployment-guidelines)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Clients   │ │  Contracts  │ │  Financial  │           │
│  │   Module    │ │   Module    │ │   Module    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │  Inventory  │ │    Fleet    │                           │
│  │   Module    │ │   Module    │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   REST API  │ │ GraphQL API │ │  WebSocket  │           │
│  │  Endpoints  │ │  Resolvers  │ │   Events    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Business Logic Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Services   │ │ Validators  │ │ Controllers │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Access Layer                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    ORM      │ │  Migrations │ │   Seeders   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  Common     │ │  Contracts  │ │  Financial  │           │
│  │  Tables     │ │   Module    │ │   Module    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │  Inventory  │ │    Fleet    │                           │
│  │   Module    │ │   Module    │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Recommendations

#### Backend
- **Framework**: Node.js with Express.js or NestJS
- **ORM**: Drizzle ORM (already configured) or Prisma
- **Database**: MySQL 8.0+
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: Zod (already configured)
- **Testing**: Jest + Supertest

#### Frontend
- **Framework**: React 18+ with TypeScript (already configured)
- **State Management**: TanStack Query (already configured)
- **UI Library**: Tailwind CSS with shadcn/ui (already configured)
- **Routing**: Wouter (already configured)
- **Forms**: React Hook Form with Zod validation (already configured)

---

## Module Implementation Strategy

### Phase 1: Common Tables & User Management (✅ Completed)
- ✅ sys_user, company, subsidiary, sys_unit
- ✅ document, address management
- ✅ Geographic data (estado, cidade, cep_cache)
- ✅ Basic authentication and authorization

### Phase 2: Contract Management Module
Priority implementation order:

1. **Core Contract Tables**
   ```typescript
   // Implementation order
   contract_status → contract → beneficiary → contract_charge
   ```

2. **Service Management**
   ```typescript
   service_funeral → payment_receipt → bank_slip
   ```

3. **Contract Addendums & History**
   ```typescript
   contract_addendum → contract_status_history
   ```

### Phase 3: Financial Management Module
1. **Chart of Accounts**
   ```typescript
   account_type → account → bank_account
   ```

2. **Transaction Management**
   ```typescript
   transaction → transaction_line → journal_entry
   ```

3. **Reporting & Analytics**
   ```typescript
   financial_period → budget → financial_report
   ```

### Phase 4: Inventory Management Module
1. **Product Structure**
   ```typescript
   product_category → brand → product → product_variant
   ```

2. **Warehouse Management**
   ```typescript
   warehouse → storage_location → stock_level
   ```

3. **Movement Tracking**
   ```typescript
   stock_movement → purchase_order → sales_order
   ```

### Phase 5: Fleet Management Module
1. **Vehicle Management**
   ```typescript
   vehicle_type → vehicle_status → vehicle
   ```

2. **Driver & Maintenance**
   ```typescript
   driver → maintenance → service_record
   ```

3. **Operations & Expenses**
   ```typescript
   trip → vehicle_request → expense
   ```

---

## API Design Patterns

### RESTful API Structure

```typescript
// Base API structure
/api/v1/{module}/{resource}

// Examples:
GET    /api/v1/contracts/clients              // List clients
POST   /api/v1/contracts/clients              // Create client
GET    /api/v1/contracts/clients/:id          // Get client
PUT    /api/v1/contracts/clients/:id          // Update client
DELETE /api/v1/contracts/clients/:id          // Delete client

// Nested resources
GET    /api/v1/contracts/clients/:id/contracts        // Client's contracts
GET    /api/v1/contracts/contracts/:id/beneficiaries  // Contract beneficiaries
GET    /api/v1/contracts/contracts/:id/charges        // Contract charges
```

### Request/Response Patterns

#### Standard Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters?: Record<string, any>;
  };
}
```

#### Error Handling
```typescript
// Standard error codes
enum ApiErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION'
}
```

### Validation Patterns

#### Using Zod for Request Validation
```typescript
// schemas/contract.ts
import { z } from 'zod';

export const createContractSchema = z.object({
  contract_number: z.string().min(1).max(20),
  contract_type: z.string().min(1).max(50),
  start_date: z.string().datetime(),
  sys_unit_id: z.number().positive(),
  billing_frequency: z.number().default(1)
});

export const updateContractSchema = createContractSchema.partial();

// In route handler
app.post('/api/v1/contracts', async (req, res) => {
  try {
    const validData = createContractSchema.parse(req.body);
    const contract = await contractService.create(validData);
    res.json({ success: true, data: contract });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        }
      });
    }
  }
});
```

---

## Database Integration

### Drizzle ORM Implementation

#### Schema Definition Pattern
```typescript
// shared/schemas/contract.ts
import { mysqlTable, int, varchar, date, decimal, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const contracts = mysqlTable('contract', {
  contract_id: int('contract_id').primaryKey().autoincrement(),
  sys_unit_id: int('sys_unit_id').notNull(),
  contract_number: varchar('contract_number', { length: 20 }).notNull(),
  contract_type: varchar('contract_type', { length: 50 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date'),
  billing_frequency: int('billing_frequency').default(1),
  industry: varchar('industry', { length: 50 }).default('FUNERAL'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at')
});

export const beneficiaries = mysqlTable('beneficiary', {
  beneficiary_id: int('beneficiary_id').primaryKey().autoincrement(),
  contract_id: int('contract_id').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  relationship: varchar('relationship', { length: 50 }).notNull(),
  is_primary: boolean('is_primary').default(false),
  birth_at: date('birth_at'),
  is_alive: boolean('is_alive'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow()
});
```

#### Service Layer Pattern
```typescript
// services/contractService.ts
import { db } from '@/lib/database';
import { contracts, beneficiaries } from '@/shared/schemas';
import { eq, and, isNull } from 'drizzle-orm';

export class ContractService {
  async findAll(companyId: number, options?: {
    page?: number;
    limit?: number;
    includeDeleted?: boolean;
  }) {
    const { page = 1, limit = 50, includeDeleted = false } = options || {};
    
    let query = db.select().from(contracts);
    
    if (!includeDeleted) {
      query = query.where(isNull(contracts.deleted_at));
    }
    
    const results = await query
      .limit(limit)
      .offset((page - 1) * limit);
    
    return results;
  }

  async findById(id: number, includeDeleted = false) {
    let query = db.select().from(contracts).where(eq(contracts.contract_id, id));
    
    if (!includeDeleted) {
      query = query.where(
        and(
          eq(contracts.contract_id, id),
          isNull(contracts.deleted_at)
        )
      );
    }
    
    const result = await query;
    return result[0] || null;
  }

  async findWithBeneficiaries(contractId: number) {
    const contract = await this.findById(contractId);
    if (!contract) return null;

    const contractBeneficiaries = await db
      .select()
      .from(beneficiaries)
      .where(eq(beneficiaries.contract_id, contractId));

    return {
      ...contract,
      beneficiaries: contractBeneficiaries
    };
  }

  async create(data: InsertContract) {
    const result = await db.insert(contracts).values(data);
    return this.findById(result.insertId);
  }

  async update(id: number, data: Partial<InsertContract>) {
    await db
      .update(contracts)
      .set({ ...data, updated_at: new Date() })
      .where(eq(contracts.contract_id, id));
    
    return this.findById(id);
  }

  async softDelete(id: number, deletedBy: number) {
    await db
      .update(contracts)
      .set({ 
        deleted_at: new Date(),
        deleted_by: deletedBy,
        updated_at: new Date()
      })
      .where(eq(contracts.contract_id, id));
  }
}
```

### Migration Strategy

#### Migration File Structure
```typescript
// migrations/001_create_contracts.ts
import { sql } from 'drizzle-orm';
import type { MySql2Database } from 'drizzle-orm/mysql2';

export async function up(db: MySql2Database): Promise<void> {
  await db.execute(sql`
    CREATE TABLE contract (
      contract_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      sys_unit_id INT UNSIGNED NOT NULL,
      contract_number VARCHAR(20) NOT NULL,
      contract_type VARCHAR(50) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE,
      billing_frequency INT DEFAULT 1 NOT NULL,
      industry VARCHAR(50) DEFAULT 'FUNERAL',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL,
      FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function down(db: MySql2Database): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS contract`);
}
```

---

## Security Implementation

### Authentication Strategy

#### JWT Implementation
```typescript
// auth/jwt.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface TokenPayload {
  userId: number;
  email: string;
  companyId: number;
  role: string;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET!;
  private jwtExpiry = process.env.JWT_EXPIRY || '24h';

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry });
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.jwtSecret) as TokenPayload;
  }
}
```

#### Authorization Middleware
```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/auth/jwt';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    companyId: number;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Access token required' }
    });
  }

  try {
    const authService = new AuthService();
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Invalid or expired token' }
    });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
}
```

### Data Access Control

#### Multi-Company Data Isolation
```typescript
// middleware/companyIsolation.ts
export function enforceCompanyIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Add company filter to all database queries
  req.companyFilter = { company_id: req.user!.companyId };
  next();
}

// In service methods
async findAll(companyId: number, filters?: any) {
  return db.select()
    .from(contracts)
    .where(
      and(
        eq(contracts.company_id, companyId),
        isNull(contracts.deleted_at),
        ...Object.entries(filters || {}).map(([key, value]) => eq(contracts[key], value))
      )
    );
}
```

---

## Performance Optimization

### Database Optimization

#### Indexing Strategy
```sql
-- Performance indexes for common queries
CREATE INDEX idx_contract_company_status ON contract (company_id, status_id);
CREATE INDEX idx_contract_dates ON contract (start_date, end_date);
CREATE INDEX idx_beneficiary_contract ON beneficiary (contract_id, is_primary);
CREATE INDEX idx_charge_due_date ON contract_charge (due_date, payment_status_id);
CREATE INDEX idx_user_company_active ON sys_user (company_id, active);

-- Full-text search indexes
CREATE FULLTEXT INDEX ft_client_search ON client (name, email);
CREATE FULLTEXT INDEX ft_product_search ON product (name, description);
```

#### Query Optimization
```typescript
// Efficient pagination with cursor-based approach
async findContractsWithCursor(companyId: number, cursor?: number, limit = 50) {
  let query = db.select()
    .from(contracts)
    .where(eq(contracts.company_id, companyId));

  if (cursor) {
    query = query.where(gt(contracts.contract_id, cursor));
  }

  return query
    .orderBy(contracts.contract_id)
    .limit(limit + 1); // +1 to check if there are more records
}

// Efficient related data loading
async findContractWithRelations(contractId: number, companyId: number) {
  // Single query with joins instead of N+1 queries
  return db.select({
    contract: contracts,
    beneficiaries: beneficiaries,
    charges: contractCharges
  })
  .from(contracts)
  .leftJoin(beneficiaries, eq(contracts.contract_id, beneficiaries.contract_id))
  .leftJoin(contractCharges, eq(contracts.contract_id, contractCharges.contract_id))
  .where(
    and(
      eq(contracts.contract_id, contractId),
      eq(contracts.company_id, companyId)
    )
  );
}
```

### Caching Strategy

#### Redis Implementation
```typescript
// cache/redis.ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }
}

// Usage in service
export class ContractService {
  private cache = new CacheService();

  async findById(id: number): Promise<Contract | null> {
    const cacheKey = this.cache.generateKey('contract', id);
    let contract = await this.cache.get<Contract>(cacheKey);

    if (!contract) {
      contract = await db.select().from(contracts).where(eq(contracts.contract_id, id))[0];
      if (contract) {
        await this.cache.set(cacheKey, contract, 1800); // 30 minutes
      }
    }

    return contract;
  }
}
```

---

## Testing Strategy

### Unit Testing with Jest

#### Service Layer Tests
```typescript
// tests/services/contractService.test.ts
import { ContractService } from '@/services/contractService';
import { db } from '@/lib/database';
import { contracts } from '@/shared/schemas';

jest.mock('@/lib/database');

describe('ContractService', () => {
  let contractService: ContractService;
  let mockDb: jest.Mocked<typeof db>;

  beforeEach(() => {
    contractService = new ContractService();
    mockDb = db as jest.Mocked<typeof db>;
  });

  describe('findById', () => {
    it('should return contract when found', async () => {
      const mockContract = {
        contract_id: 1,
        contract_number: 'CT-001',
        contract_type: 'FUNERAL',
        created_at: new Date()
      };

      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockContract])
        })
      } as any);

      const result = await contractService.findById(1);
      expect(result).toEqual(mockContract);
    });

    it('should return null when contract not found', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([])
        })
      } as any);

      const result = await contractService.findById(999);
      expect(result).toBeNull();
    });
  });
});
```

#### API Integration Tests
```typescript
// tests/api/contracts.test.ts
import request from 'supertest';
import { app } from '@/app';
import { db } from '@/lib/database';

describe('Contracts API', () => {
  beforeEach(async () => {
    // Clean database
    await db.delete(contracts);
  });

  describe('POST /api/v1/contracts', () => {
    it('should create a new contract', async () => {
      const contractData = {
        contract_number: 'CT-001',
        contract_type: 'FUNERAL',
        start_date: '2025-01-01',
        sys_unit_id: 1
      };

      const response = await request(app)
        .post('/api/v1/contracts')
        .set('Authorization', `Bearer ${validToken}`)
        .send(contractData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contract_number).toBe('CT-001');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        contract_number: '', // Empty string should fail validation
        contract_type: 'FUNERAL'
      };

      const response = await request(app)
        .post('/api/v1/contracts')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

### End-to-End Testing

#### Playwright Test Setup
```typescript
// tests/e2e/contracts.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contract Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@test.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new contract', async ({ page }) => {
    await page.goto('/contracts');
    await page.click('[data-testid="new-contract-button"]');
    
    await page.fill('[data-testid="contract-number"]', 'CT-E2E-001');
    await page.selectOption('[data-testid="contract-type"]', 'FUNERAL');
    await page.fill('[data-testid="start-date"]', '2025-01-01');
    
    await page.click('[data-testid="save-contract"]');
    
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('text=CT-E2E-001')).toBeVisible();
  });
});
```

---

## Deployment Guidelines

### Environment Configuration

#### Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=mysql://user:password@host:3306/database
DATABASE_HOST=your-mysql-host
DATABASE_PORT=3306
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=erp_production

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12

# Redis Cache
REDIS_URL=redis://your-redis-host:6379

# File Storage
UPLOAD_PATH=/var/app/uploads
MAX_FILE_SIZE=10485760

# External Services
EMAIL_SMTP_HOST=smtp.your-provider.com
EMAIL_SMTP_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-email-password

# Monitoring
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### Docker Configuration

#### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://user:password@db:3306/erp_production
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - uploads:/var/app/uploads

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: erp_production
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./sql:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
  uploads:
```

### CI/CD Pipeline

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          # Build and deploy script
          docker build -t erp-system .
          docker tag erp-system ${{ secrets.REGISTRY_URL }}/erp-system:latest
          docker push ${{ secrets.REGISTRY_URL }}/erp-system:latest
```

### Database Migration Strategy

#### Production Migration Process
```bash
# Pre-deployment checklist
1. Backup production database
2. Test migrations on staging environment
3. Schedule maintenance window
4. Run migrations with rollback plan

# Migration commands
npm run migrate:up    # Apply pending migrations
npm run migrate:down  # Rollback last migration
npm run migrate:reset # Reset to initial state (development only)
```

---

## Monitoring and Maintenance

### Logging Strategy
```typescript
// logger/winston.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Health Checks
```typescript
// health/checks.ts
export async function healthCheck() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    diskSpace: await checkDiskSpace(),
    memory: process.memoryUsage()
  };

  const isHealthy = Object.values(checks).every(check => 
    typeof check === 'object' ? check.status === 'ok' : true
  );

  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  };
}
```

This developer guide provides comprehensive implementation strategies for building a robust, scalable ERP system with proper architecture, security, and deployment practices.