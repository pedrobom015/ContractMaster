# DEVELOPER MANUAL - CONTRACT MANAGEMENT ERP SYSTEM

## Document Overview
This comprehensive developer manual provides technical guidance for working with the Contract Management ERP System, including architecture patterns, development workflows, coding standards, and integration guidelines.

---

## SYSTEM ARCHITECTURE

### Technology Stack
- **Frontend:** React 18+ with TypeScript
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL 16+ with Drizzle ORM
- **Build Tool:** Vite for development and production builds
- **UI Framework:** Tailwind CSS with shadcn/ui components
- **Design System:** Neumorphic design pattern
- **State Management:** TanStack Query v5 for server state
- **Routing:** Wouter for lightweight client-side routing
- **Validation:** Zod for schema validation (client & server)

### Architecture Patterns

#### 1. Full-Stack TypeScript Pattern
```typescript
// Shared schema definition (shared/schema.ts)
export const partnersTable = pgTable("partners", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  partnerName: text("partner_name").notNull(),
  // ... other fields
});

// Type inference
export type Partner = typeof partnersTable.$inferSelect;
export type NewPartner = typeof partnersTable.$inferInsert;

// Zod validation schemas
export const insertPartnerSchema = createInsertSchema(partnersTable);
export const insertPartnerSchemaWithValidation = insertPartnerSchema.extend({
  partnerName: z.string().min(1, "Nome é obrigatório"),
});
```

#### 2. Storage Interface Pattern
```typescript
// Storage interface (server/storage.ts)
interface IStorage {
  // CRUD operations for each entity
  getPartners(): Promise<Partner[]>;
  getPartnerById(id: number): Promise<Partner | null>;
  createPartner(partner: NewPartner): Promise<Partner>;
  updatePartner(id: number, partner: Partial<NewPartner>): Promise<Partner>;
  deletePartner(id: number): Promise<void>;
}

// Implementation with Drizzle ORM
class DrizzleStorage implements IStorage {
  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partnersTable)
      .where(isNull(partnersTable.deletedAt))
      .orderBy(desc(partnersTable.createdAt));
  }
}
```

#### 3. API Route Pattern
```typescript
// RESTful API routes (server/routes.ts)
router.get("/api/partners", async (req, res) => {
  try {
    const partners = await storage.getPartners();
    res.json(partners);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/partners", async (req, res) => {
  try {
    const validatedData = insertPartnerSchema.parse(req.body);
    const partner = await storage.createPartner(validatedData);
    res.status(201).json(partner);
  } catch (error) {
    handleError(res, error);
  }
});
```

#### 4. Frontend Component Pattern
```typescript
// React component with TanStack Query
export default function PartnersPage() {
  const { data: partners, isLoading } = useQuery({
    queryKey: ['/api/partners'],
    queryFn: () => fetch('/api/partners').then(res => res.json())
  });

  const createMutation = useMutation({
    mutationFn: (newPartner: NewPartner) => 
      apiRequest('/api/partners', { method: 'POST', body: newPartner }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/partners'] });
      toast({ title: "Parceiro criado com sucesso!" });
    }
  });

  // Component render logic...
}
```

---

## DEVELOPMENT PATTERNS

### 1. Standard CRUD Page Structure

#### File Organization
```
client/src/pages/
├── partners.tsx          # Partners management page
├── clients.tsx           # Clients management page
├── contracts-entries.tsx # Contract management page
└── attendance-entries.tsx # Attendance management page
```

#### Standard Page Layout
```typescript
export default function StandardCRUDPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {/* Page header with breadcrumb */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="neu-button">
              <Home className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Page Title</h1>
              <p className="text-muted-foreground">Page description</p>
            </div>
          </div>

          {/* Search and actions bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10"
              />
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>

          {/* Main content card */}
          <Card className="neu-card">
            <CardContent className="p-6">
              {/* Data table or content */}
              <DataTable data={filteredData} />
            </CardContent>
          </Card>

          {/* CRUD modals */}
          <CreateModal />
          <EditModal />
          <DeleteConfirmation />
        </main>
      </div>
    </div>
  );
}
```

### 2. Neumorphic Design System

#### CSS Classes (Tailwind Extensions)
```css
/* Neumorphic design classes (index.css) */
.neu-card {
  @apply bg-background border border-border/50 rounded-lg shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.1)];
}

.neu-flat {
  @apply bg-background border border-border/30 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.1)];
}

.neu-button {
  @apply bg-background border border-border/50 rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.1)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.1)] transition-all duration-200;
}

.neu-input {
  @apply bg-background border border-border/30 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.1)] focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.15)];
}
```

#### Component Usage
```typescript
// Standard neumorphic card
<Card className="neu-card">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>

// Standard neumorphic button
<Button className="neu-button">
  <Plus className="h-4 w-4 mr-2" />
  Novo Item
</Button>

// Standard neumorphic input
<Input
  placeholder="Digite algo..."
  className="neu-input"
/>
```

### 3. Form Handling Pattern

#### React Hook Form with Zod Validation
```typescript
const form = useForm<NewPartner>({
  resolver: zodResolver(insertPartnerSchemaWithValidation),
  defaultValues: {
    partnerName: "",
    partnerCode: "",
    // ... other defaults
  },
});

// Form component
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="partnerName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Parceiro</FormLabel>
          <FormControl>
            <Input placeholder="Nome completo" {...field} className="neu-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="neu-button" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  </form>
</Form>
```

### 4. Data Table Pattern

#### Standard Data Table Component
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function DataTable<T>({ data, columns, onEdit, onDelete }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-md border neu-flat">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## DATABASE DEVELOPMENT

### 1. Schema Development Pattern

#### Adding New Tables
```typescript
// 1. Define table in shared/schema.ts
export const newTable = pgTable("new_table", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  // ... other fields with audit trail
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// 2. Create Zod schemas
export const insertNewTableSchema = createInsertSchema(newTable);
export type NewTableType = typeof newTable.$inferSelect;
export type NewNewTableType = typeof newTable.$inferInsert;

// 3. Add to storage interface
interface IStorage {
  // ... existing methods
  getNewTableItems(): Promise<NewTableType[]>;
  createNewTableItem(item: NewNewTableType): Promise<NewTableType>;
  // ... other CRUD methods
}

// 4. Implement in storage class
class DrizzleStorage implements IStorage {
  async getNewTableItems(): Promise<NewTableType[]> {
    return await db.select().from(newTable)
      .where(isNull(newTable.deletedAt))
      .orderBy(desc(newTable.createdAt));
  }
}

// 5. Add API routes
router.get("/api/new-table", async (req, res) => {
  try {
    const items = await storage.getNewTableItems();
    res.json(items);
  } catch (error) {
    handleError(res, error);
  }
});

// 6. Push schema to database
npm run db:push
```

### 2. Database Migration Strategy
```bash
# Development workflow
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Drizzle Studio for data inspection

# Production workflow (when implemented)
npm run db:generate      # Generate migration files
npm run db:migrate       # Apply migrations to production database
```

### 3. Query Optimization Patterns
```typescript
// Efficient queries with Drizzle ORM
// 1. Use appropriate indexes
const partners = await db.select()
  .from(partnersTable)
  .where(and(
    isNull(partnersTable.deletedAt),
    eq(partnersTable.companyId, companyId)
  ))
  .orderBy(desc(partnersTable.createdAt))
  .limit(50);

// 2. Join related data efficiently
const partnersWithTypes = await db.select({
  partner: partnersTable,
  partnerType: partnerTypesTable
})
.from(partnersTable)
.leftJoin(partnerTypesTable, eq(partnersTable.partnerTypeId, partnerTypesTable.id))
.where(isNull(partnersTable.deletedAt));

// 3. Use transactions for data consistency
await db.transaction(async (tx) => {
  const partner = await tx.insert(partnersTable).values(newPartner).returning();
  await tx.insert(entityAddressesTable).values({
    entityId: partner[0].id,
    entityType: 'partner',
    addressId: addressId
  });
});
```

---

## FRONTEND DEVELOPMENT

### 1. Component Development Standards

#### Component File Structure
```typescript
// Standard component structure
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Types and schemas
import type { Partner, NewPartner } from "@shared/schema";
import { insertPartnerSchema } from "@shared/schema";

// Component implementation
export default function ComponentName() {
  // State management
  // Query hooks
  // Mutation hooks
  // Form handling
  // Event handlers
  // Render logic
}
```

#### State Management Pattern
```typescript
// Use TanStack Query for server state
const { data: partners, isLoading, error } = useQuery({
  queryKey: ['/api/partners'],
  queryFn: () => fetch('/api/partners').then(res => res.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Use useState for local UI state
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedItem, setSelectedItem] = useState<Partner | null>(null);

// Use React Hook Form for form state
const form = useForm<NewPartner>({
  resolver: zodResolver(insertPartnerSchema),
  defaultValues: { /* defaults */ },
});
```

### 2. Error Handling Pattern
```typescript
// API error handling
const mutation = useMutation({
  mutationFn: createPartner,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/partners'] });
    toast({
      title: "Sucesso!",
      description: "Parceiro criado com sucesso.",
    });
    setIsModalOpen(false);
  },
  onError: (error: any) => {
    toast({
      title: "Erro!",
      description: error.message || "Erro ao criar parceiro.",
      variant: "destructive",
    });
  },
});

// Form validation error handling
const onSubmit = (data: NewPartner) => {
  try {
    mutation.mutate(data);
  } catch (error) {
    console.error("Form submission error:", error);
  }
};
```

### 3. Performance Optimization
```typescript
// Memoize expensive computations
const filteredData = useMemo(() => {
  if (!data || !searchTerm) return data || [];
  return data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [data, searchTerm]);

// Debounce search input
const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

// Lazy load components
const LazyModal = lazy(() => import('./components/Modal'));
```

---

## TESTING STRATEGY

### 1. Unit Testing Pattern
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PartnersPage from './partners';

describe('PartnersPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithQuery = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  test('renders partners list', async () => {
    renderWithQuery(<PartnersPage />);
    expect(screen.getByText('Parceiros')).toBeInTheDocument();
  });

  test('creates new partner', async () => {
    renderWithQuery(<PartnersPage />);
    
    fireEvent.click(screen.getByText('Novo Parceiro'));
    fireEvent.change(screen.getByPlaceholderText('Nome do parceiro'), {
      target: { value: 'Test Partner' }
    });
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('Parceiro criado com sucesso')).toBeInTheDocument();
    });
  });
});
```

### 2. API Testing Pattern
```typescript
// API route testing with supertest
import request from 'supertest';
import { app } from '../server/app';

describe('Partners API', () => {
  test('GET /api/partners returns partners list', async () => {
    const response = await request(app)
      .get('/api/partners')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/partners creates new partner', async () => {
    const newPartner = {
      partnerName: 'Test Partner',
      partnerCode: 'TEST001',
    };

    const response = await request(app)
      .post('/api/partners')
      .send(newPartner)
      .expect(201);

    expect(response.body).toMatchObject(newPartner);
  });
});
```

---

## DEPLOYMENT & OPERATIONS

### 1. Environment Management
```bash
# Development environment
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
VITE_API_URL=http://localhost:5000

# Production environment
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:pass@prod_host:5432/prod_db
VITE_API_URL=https://api.yourdomain.com
```

### 2. Build Process
```bash
# Development
npm run dev          # Start development server

# Production build
npm run build        # Build frontend and backend
npm run start        # Start production server

# Database operations
npm run db:push      # Push schema changes
npm run db:studio    # Open database studio
```

### 3. Monitoring & Logging
```typescript
// Server-side logging
import { logger } from './utils/logger';

router.get('/api/partners', async (req, res) => {
  try {
    logger.info('Fetching partners list', { userId: req.user?.id });
    const partners = await storage.getPartners();
    logger.info('Partners fetched successfully', { count: partners.length });
    res.json(partners);
  } catch (error) {
    logger.error('Error fetching partners', { error: error.message, stack: error.stack });
    handleError(res, error);
  }
});

// Client-side error tracking
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});
```

---

## SECURITY CONSIDERATIONS

### 1. Input Validation
```typescript
// Always validate input with Zod schemas
const createPartnerSchema = z.object({
  partnerName: z.string().min(1).max(255),
  email: z.string().email().optional(),
  taxId: z.string().regex(/^\d{11}$|^\d{14}$/).optional(), // CPF or CNPJ
});

// Sanitize user input
import { escape } from 'html-escaper';
const sanitizedInput = escape(userInput);
```

### 2. Authentication & Authorization
```typescript
// JWT authentication middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route protection
router.get('/api/partners', authenticateToken, async (req, res) => {
  // Route handler
});
```

### 3. SQL Injection Prevention
```typescript
// Use parameterized queries with Drizzle
const partners = await db.select()
  .from(partnersTable)
  .where(eq(partnersTable.id, userId)); // Safe parameterized query

// Never use string concatenation
// BAD: `SELECT * FROM partners WHERE id = ${userId}`
// GOOD: Use Drizzle ORM or prepared statements
```

---

## CODING STANDARDS

### 1. TypeScript Guidelines
```typescript
// Use strict type checking
// Enable strict mode in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// Define clear interfaces
interface Partner {
  id: number;
  name: string;
  email?: string; // Optional properties with ?
  addresses: Address[]; // Arrays with proper typing
}

// Use utility types
type PartialPartner = Partial<Partner>;
type PartnerWithoutId = Omit<Partner, 'id'>;
type PartnerUpdateFields = Pick<Partner, 'name' | 'email'>;
```

### 2. Code Organization
```typescript
// Group imports logically
// 1. React/third-party libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Local components
import { DataTable } from './components/DataTable';

// 4. Types and utilities
import type { Partner } from '@shared/schema';
import { formatDate } from '@/lib/utils';
```

### 3. Error Handling Standards
```typescript
// Comprehensive error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn('Validation error', { error: error.message });
    throw new BadRequestError(error.message);
  } else if (error instanceof DatabaseError) {
    logger.error('Database error', { error: error.message });
    throw new InternalServerError('Database operation failed');
  } else {
    logger.error('Unexpected error', { error });
    throw new InternalServerError('An unexpected error occurred');
  }
}
```

---

## INTEGRATION PATTERNS

### 1. External API Integration
```typescript
// Structured API client
class ExternalAPIClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### 2. WebSocket Integration
```typescript
// Real-time updates with WebSocket
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    this.ws = new WebSocket('ws://localhost:5000/ws');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, 1000 * this.reconnectAttempts);
      }
    };
  }

  private handleMessage(data: any) {
    // Handle real-time updates
    queryClient.invalidateQueries({ queryKey: [data.entityType] });
  }
}
```

---

## PERFORMANCE GUIDELINES

### 1. Frontend Optimization
```typescript
// Code splitting
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Memoization
const ExpensiveComponent = memo(({ data }: { data: Partner[] }) => {
  const processedData = useMemo(() => {
    return data.map(partner => ({
      ...partner,
      displayName: `${partner.name} (${partner.code})`
    }));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }: { items: Partner[] }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        {data[index].name}
      </div>
    )}
  </List>
);
```

### 2. Backend Optimization
```typescript
// Database query optimization
const getPartnersWithPagination = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  
  return await db.select()
    .from(partnersTable)
    .where(isNull(partnersTable.deletedAt))
    .orderBy(desc(partnersTable.createdAt))
    .limit(limit)
    .offset(offset);
};

// Response caching
import { NodeCache } from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

router.get('/api/partners', async (req, res) => {
  const cacheKey = 'partners_list';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }

  const partners = await storage.getPartners();
  cache.set(cacheKey, partners);
  res.json(partners);
});
```

---

**Document Version:** 1.0  
**Last Updated:** January 25, 2025  
**Target Audience:** Development Team  
**Created By:** Senior Developer