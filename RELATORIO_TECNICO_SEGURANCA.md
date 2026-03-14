# Relat¢rio T‚cnico de An lise de Seguran‡a
## Sistema ContractMaster - Gest?o de Contratos

**Data da An lise:** Janeiro 2025  
**Vers?o do Sistema:** 1.0.0 (Em Desenvolvimento)  
**Analista:** An lise T‚cnica Automatizada

---

## ?? Sum rio Executivo

Este relat¢rio apresenta uma an lise t‚cnica detalhada do sistema ContractMaster, um ERP para gest?o de contratos com benefici rios, coberturas, cobran‡a peri¢dica e por rateio. A an lise identificou **vulnerabilidades cr¡ticas de seguran‡a** que devem ser corrigidas antes da produ‡?o, al‚m de v rias melhorias recomendadas.

### Severidade das Vulnerabilidades Encontradas

- ?? **CR?TICAS:** 4 vulnerabilidades
- ?? **ALTAS:** 6 vulnerabilidades  
- ?? **MDIAS:** 8 vulnerabilidades
- ?? **BAIXAS:** 5 melhorias recomendadas

---

## 1. Vis?o Geral do Sistema

### 1.1 Arquitetura

O sistema utiliza uma arquitetura **full-stack** moderna:

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + TypeScript
- **Banco de Dados:** PostgreSQL (com suporte a MySQL legado)
- **ORM:** Drizzle ORM
- **Valida‡?o:** Zod schemas
- **UI:** Tailwind CSS + shadcn/ui

### 1.2 M¢dulos Principais

1. **Gest?o de Contratos** - Contratos, benefici rios, aditivos
2. **Cobran‡a e Pagamentos** - Cobran‡as peri¢dicas, rateio, recibos
3. **Gest?o de Parceiros** - Clientes, fornecedores, endere‡os
4. **Tabelas Auxiliares** - Tipos de documentos, endere‡os, status
5. **Atendimento** - Carteirinhas, encaminhamentos m‚dicos
6. **Financeiro** - (Temporariamente desabilitado para migra‡?o)

---

## 2. ?? VULNERABILIDADES CR?TICAS

### 2.1 Senhas Armazenadas em Texto Plano

**Severidade:** ?? CR?TICA  
**Localiza‡?o:** `server/storage.ts` linhas 642 e 769

**Problema:**
```typescript
// Linha 642 - createContractWithUser
password: userData.password, // In production, this should be hashed

// Linha 769 - createFullContract  
password: userData.password,
```

As senhas est?o sendo armazenadas **sem hash** no banco de dados. Embora o schema defina `password_hash` e `password_salt`, o c¢digo n?o est  aplicando hash antes de salvar.

**Impacto:**
- Qualquer pessoa com acesso ao banco de dados pode ver senhas em texto plano
- Viola‡?o grave de LGPD/GDPR
- Comprometimento total da seguran‡a de autentica‡?o

**Solu‡?o Recomendada:**
```typescript
import bcrypt from 'bcrypt';

// Ao criar usu rio
const saltRounds = 12;
const passwordHash = await bcrypt.hash(userData.password, saltRounds);

const sysUserData: NewSysUser = {
  // ...
  passwordHash: passwordHash,
  passwordSalt: null, // bcrypt j  inclui salt no hash
  // ...
};
```

**Prioridade:** CORRIGIR IMEDIATAMENTE

---

### 2.2 Ausˆncia de Autentica‡?o nas Rotas da API

**Severidade:** ?? CR?TICA  
**Localiza‡?o:** `server/routes.ts` - Todas as rotas

**Problema:**
Todas as rotas da API est?o **completamente desprotegidas**. N?o h  middleware de autentica‡?o implementado, permitindo acesso total a qualquer pessoa.

**Exemplo:**
```typescript
router.get("/api/sys-users", async (req, res) => {
  // Sem autentica‡?o - qualquer um pode acessar
  const users = await storage.getSysUsers();
  res.json(users);
});

router.delete("/api/contracts/:id", async (req, res) => {
  // Sem autentica‡?o - qualquer um pode deletar contratos
  await storage.deleteContract(contractId);
});
```

**Impacto:**
- Acesso n?o autorizado a dados sens¡veis
- Possibilidade de modifica‡?o/dele‡?o de dados por qualquer pessoa
- Viola‡?o de integridade dos dados

**Solu‡?o Recomendada:**
```typescript
import { authenticateToken, requireRole } from './middleware/auth';

// Proteger todas as rotas
router.get("/api/sys-users", authenticateToken, requireRole(['admin']), async (req, res) => {
  const users = await storage.getSysUsers();
  res.json(users);
});

router.delete("/api/contracts/:id", authenticateToken, async (req, res) => {
  // Verificar se o usu rio tem permiss?o para deletar este contrato
  await storage.deleteContract(contractId);
});
```

**Prioridade:** CORRIGIR IMEDIATAMENTE

---

### 2.3 Ausˆncia de CORS e Headers de Seguran‡a

**Severidade:** ?? CR?TICA  
**Localiza‡?o:** `server/index.ts`

**Problema:**
O servidor n?o possui:
- Configura‡?o de CORS
- Headers de seguran‡a (Helmet)
- Prote‡?o contra ataques comuns (XSS, clickjacking, etc.)

**Impacto:**
- Vulner vel a ataques CSRF
- Vulner vel a XSS
- Exposi‡?o de informa‡?es sens¡veis via headers
- Possibilidade de clickjacking

**Solu‡?o Recomendada:**
```typescript
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Headers de seguran‡a
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configurado
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**Prioridade:** CORRIGIR IMEDIATAMENTE

---

### 2.4 Ausˆncia de Rate Limiting

**Severidade:** ?? CR?TICA  
**Localiza‡?o:** `server/index.ts` e `server/routes.ts`

**Problema:**
N?o h  prote‡?o contra:
- Ataques de for‡a bruta
- DDoS
- Abuso de API

**Impacto:**
- Sistema vulner vel a sobrecarga
- Possibilidade de ataques de for‡a bruta em login
- Degrada‡?o de performance

**Solu‡?o Recomendada:**
```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // m ximo 100 requisi‡?es por IP
  message: 'Muitas requisi‡?es deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para login (mais restritivo)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // m ximo 5 tentativas de login
  skipSuccessfulRequests: true,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
```

**Prioridade:** CORRIGIR IMEDIATAMENTE

---

## 3. ?? VULNERABILIDADES DE ALTA SEVERIDADE

### 3.1 Tratamento de Erros Exp?e Informa‡?es Sens¡veis

**Severidade:** ?? ALTA  
**Localiza‡?o:** `server/routes.ts` linha 52-55

**Problema:**
```typescript
const handleError = (res: any, error: any) => {
  console.error("API Error:", error);
  res.status(500).json({ error: "Internal server error" });
};
```

Embora a resposta ao cliente seja gen‚rica, o `console.error` pode expor:
- Stack traces completos
- Informa‡?es de banco de dados
- Estrutura interna do sistema

**Solu‡?o Recomendada:**
```typescript
const handleError = (res: Response, error: unknown, req?: Request) => {
  // Log estruturado sem informa‡?es sens¡veis
  const errorId = nanoid();
  
  logger.error('API Error', {
    errorId,
    path: req?.path,
    method: req?.method,
    userId: req?.user?.id,
    message: error instanceof Error ? error.message : 'Unknown error',
    // N?O logar stack trace em produ‡?o
    stack: process.env.NODE_ENV === 'development' ? error : undefined,
  });

  // Resposta gen‚rica ao cliente
  res.status(500).json({ 
    error: "Internal server error",
    errorId, // Cliente pode reportar este ID
  });
};
```

---

### 3.2 Ausˆncia de Valida‡?o de Isolamento Multi-Empresa

**Severidade:** ?? ALTA  
**Localiza‡?o:** `server/storage.ts` - Todas as queries

**Problema:**
As queries n?o filtram por `companyId`, permitindo que usu rios acessem dados de outras empresas.

**Exemplo:**
```typescript
async getContracts(): Promise<Contract[]> {
  // SEM filtro de company_id!
  return await db.select()
    .from(contractsTable)
    .where(isNull(contractsTable.deletedAt))
    .orderBy(desc(contractsTable.createdAt));
}
```

**Solu‡?o Recomendada:**
```typescript
async getContracts(companyId: number): Promise<Contract[]> {
  return await db.select()
    .from(contractsTable)
    .where(
      and(
        eq(contractsTable.companyId, companyId),
        isNull(contractsTable.deletedAt)
      )
    )
    .orderBy(desc(contractsTable.createdAt));
}

// Middleware para extrair companyId do usu rio autenticado
router.get("/api/contracts", authenticateToken, async (req, res) => {
  const contracts = await storage.getContracts(req.user!.companyId);
  res.json(contracts);
});
```

---

### 3.3 Valida‡?o de Schema Incompleta

**Severidade:** ?? ALTA  
**Localiza‡?o:** `server/routes.ts` - V rios endpoints

**Problema:**
Alguns campos n?o s?o validados adequadamente:
- Emails podem ser inv lidos
- CPF/CNPJ n?o s?o validados
- Datas podem estar em formatos incorretos
- Valores monet rios n?o s?o validados

**Solu‡?o Recomendada:**
```typescript
import { z } from 'zod';

// Valida‡?o de CPF
const cpfSchema = z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inv lido');

// Valida‡?o de CNPJ
const cnpjSchema = z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inv lido');

// Valida‡?o de email
const emailSchema = z.string().email('Email inv lido');

// Valida‡?o de valor monet rio
const moneySchema = z.number().positive('Valor deve ser positivo').max(999999999.99);
```

---

### 3.4 Logs Podem Conter Dados Sens¡veis

**Severidade:** ?? ALTA  
**Localiza‡?o:** `server/index.ts` linhas 20-33

**Problema:**
O sistema loga respostas JSON completas, que podem conter:
- Senhas (se n?o corrigido o problema #2.1)
- Tokens
- Dados pessoais

**Solu‡?o Recomendada:**
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  // Sanitizar dados sens¡veis antes de logar
  const sanitizeForLog = (data: any): any => {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveFields = ['password', 'passwordHash', 'token', 'authorization', 'cpf', 'cnpj'];
    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }
    
    return sanitized;
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      // N?o logar corpo de requisi‡?es POST/PUT com dados sens¡veis
      if (['GET', 'DELETE'].includes(req.method)) {
        // Logar apenas m‚todos seguros
      }
      log(logLine);
    }
  });
  next();
});
```

---

### 3.5 Ausˆncia de Valida‡?o de Autoriza‡?o por Recurso

**Severidade:** ?? ALTA  
**Localiza‡?o:** `server/routes.ts` - Endpoints de atualiza‡?o/dele‡?o

**Problema:**
Mesmo com autentica‡?o, n?o h  verifica‡?o se o usu rio tem permiss?o para modificar/deletar recursos espec¡ficos.

**Solu‡?o Recomendada:**
```typescript
router.put("/api/contracts/:id", authenticateToken, async (req, res) => {
  const contractId = parseInt(req.params.id);
  const contract = await storage.getContractById(contractId);
  
  // Verificar se o contrato pertence … empresa do usu rio
  if (contract?.companyId !== req.user!.companyId) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  
  // Verificar se o usu rio tem permiss?o para editar
  if (!req.user!.permissions.includes('contracts:write')) {
    return res.status(403).json({ error: "Permiss?o insuficiente" });
  }
  
  // Proceder com a atualiza‡?o
});
```

---

### 3.6 Ausˆncia de HTTPS Enforcement

**Severidade:** ?? ALTA  
**Localiza‡?o:** Configura‡?o de produ‡?o

**Problema:**
N?o h  verifica‡?o ou redirecionamento para HTTPS em produ‡?o.

**Solu‡?o Recomendada:**
```typescript
// Middleware para for‡ar HTTPS em produ‡?o
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 4. ?? VULNERABILIDADES DE MDIA SEVERIDADE

### 4.1 Ausˆncia de Valida‡?o de Tamanho de Upload

**Problema:** N?o h  limite de tamanho para uploads de documentos.

**Solu‡?o:**
```typescript
import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB m ximo
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo n?o permitido'));
    }
  },
});
```

---

### 4.2 Ausˆncia de Valida‡?o de CSRF Token

**Problema:** N?o h  prote‡?o CSRF para requisi‡?es de estado (POST, PUT, DELETE).

**Solu‡?o:**
```typescript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Em rotas que modificam estado
router.post("/api/contracts", authenticateToken, csrfProtection, async (req, res) => {
  // ...
});
```

---

### 4.3 Timestamps N?o S?o Atualizados Automaticamente

**Problema:** `updatedAt` precisa ser setado manualmente em cada update.

**Solu‡?o:**
Implementar triggers no banco de dados ou usar hooks do Drizzle ORM.

---

### 4.4 Ausˆncia de Valida‡?o de Integridade Referencial

**Problema:** Algumas foreign keys podem ser nulas sem valida‡?o adequada.

**Solu‡?o:**
Adicionar valida‡?es no schema Zod antes de inserir/atualizar.

---

### 4.5 Ausˆncia de Pagina‡?o em Listagens

**Problema:** Endpoints como `/api/contracts` retornam todos os registros.

**Solu‡?o:**
```typescript
router.get("/api/contracts", authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  
  const [contracts, total] = await Promise.all([
    storage.getContracts(req.user!.companyId, { limit, offset }),
    storage.countContracts(req.user!.companyId),
  ]);
  
  res.json({
    data: contracts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
```

---

### 4.6 Ausˆncia de ?ndices em Campos de Busca Frequente

**Problema:** Campos como `email`, `contract_number`, `tax_id` podem n?o ter ¡ndices.

**Solu‡?o:**
Verificar e adicionar ¡ndices no banco de dados:
```sql
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_contracts_number ON contracts(contract_number);
CREATE INDEX idx_partners_tax_id ON partners(tax_id);
```

---

### 4.7 Tratamento de Erros de Banco de Dados Gen‚rico

**Problema:** Erros de constraint, duplica‡?o, etc. n?o s?o tratados especificamente.

**Solu‡?o:**
```typescript
try {
  await storage.createPartner(data);
} catch (error) {
  if (error.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ error: "Parceiro j  existe" });
  }
  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json({ error: "Referˆncia inv lida" });
  }
  throw error;
}
```

---

### 4.8 Ausˆncia de Valida‡?o de Sess?o/Token Expiration

**Problema:** N?o h  verifica‡?o de expira‡?o de tokens JWT (se implementados).

**Solu‡?o:**
Implementar refresh tokens e verifica‡?o de expira‡?o adequada.

---

## 5. ?? Melhorias Recomendadas

### 5.1 Implementar Auditoria Completa

**Recomenda‡?o:**
```typescript
// Middleware de auditoria
const auditLog = async (req: Request, action: string, resource: string, resourceId?: number) => {
  await db.insert(auditLogTable).values({
    userId: req.user?.id,
    action,
    resource,
    resourceId,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date(),
  });
};
```

---

### 5.2 Implementar Cache para Dados Est ticos

**Recomenda‡?o:**
Usar Redis para cache de:
- Tipos de documentos
- Status
- Tabelas auxiliares

---

### 5.3 Implementar Webhooks para Eventos Importantes

**Recomenda‡?o:**
Notificar sistemas externos sobre:
- Cria‡?o de contratos
- Mudan‡as de status
- Pagamentos recebidos

---

### 5.4 Melhorar Tratamento de Transa‡?es

**Recomenda‡?o:**
Usar transa‡?es do banco para opera‡?es que modificam m£ltiplas tabelas:
```typescript
await db.transaction(async (tx) => {
  const contract = await tx.insert(contractsTable).values(contractData);
  await tx.insert(contractServicesTable).values({ ...servicesData, contractId: contract.id });
  await tx.insert(contractBillingTable).values({ ...billingData, contractId: contract.id });
});
```

---

### 5.5 Implementar Health Checks

**Recomenda‡?o:**
```typescript
router.get("/api/health", async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: "healthy", timestamp: new Date() });
  } catch (error) {
    res.status(503).json({ status: "unhealthy", error: error.message });
  }
});
```

---

## 6. Checklist de Corre‡?es Priorit rias

### ?? Cr¡ticas (Corrigir Antes de Produ‡?o)

- [ ] Implementar hash de senhas com bcrypt
- [ ] Adicionar autentica‡?o JWT em todas as rotas
- [ ] Configurar CORS e Helmet
- [ ] Implementar rate limiting

### ?? Altas (Corrigir o Mais R pido Poss¡vel)

- [ ] Melhorar tratamento de erros
- [ ] Implementar isolamento multi-empresa
- [ ] Adicionar valida‡?es completas (CPF, CNPJ, email)
- [ ] Sanitizar logs
- [ ] Implementar autoriza‡?o por recurso
- [ ] For‡ar HTTPS em produ‡?o

### ?? M‚dias (Planejar Corre‡?o)

- [ ] Limitar tamanho de uploads
- [ ] Implementar CSRF protection
- [ ] Adicionar pagina‡?o
- [ ] Criar ¡ndices de performance
- [ ] Melhorar tratamento de erros de BD

---

## 7. Conclus?o

O sistema ContractMaster apresenta uma **arquitetura s¢lida** e **boas pr ticas de desenvolvimento**, por‚m possui **vulnerabilidades cr¡ticas de seguran‡a** que devem ser corrigidas **antes de qualquer deploy em produ‡?o**.

### Pontos Positivos

? Uso de TypeScript para type safety  
? Valida‡?o com Zod schemas  
? ORM (Drizzle) previne SQL injection  
? Soft deletes para auditoria  
? Estrutura modular bem organizada  
? Documenta‡?o abrangente

### Pontos Cr¡ticos a Corrigir

? Senhas em texto plano  
? Ausˆncia total de autentica‡?o  
? Sem prote‡?o CORS/headers  
? Sem rate limiting  
? Sem isolamento multi-empresa

### Recomenda‡?o Final

**N?O colocar em produ‡?o** at‚ que todas as vulnerabilidades cr¡ticas sejam corrigidas. O sistema est  em um estado adequado para desenvolvimento, mas requer trabalho significativo de seguran‡a antes de ser exposto a usu rios reais.

---

**Fim do Relat¢rio**


