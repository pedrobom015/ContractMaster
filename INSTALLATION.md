# ContractMaster - Guia de Instalação e Migração (MySQL)

Este documento descreve os passos necessários para configurar o ambiente com a nova versão do schema MySQL (`Cria_DB_Castela_v2.sql`).

## 1. Pré-requisitos

- Node.js (v20+)
- MySQL Server (v8.0+)
- NPM ou Yarn

## 2. Configuração do Banco de Dados

1.  Crie um novo banco de dados no MySQL:
    ```sql
    CREATE DATABASE contractmaster_db;
    ```
2.  Importe o arquivo de schema atualizado:
    ```bash
    mysql -u seu_usuario -p contractmaster_db < sql/Cria_DB_Castela_v2.sql
    ```

## 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:

```env
DATABASE_URL=mysql://usuario:senha@localhost:3306/contractmaster_db
NODE_ENV=development
```

## 4. Instalação de Dependências

Instale os pacotes necessários (incluindo o novo driver MySQL):

```bash
npm install
```

## 5. Migração e Typescript

O projeto foi migrado de PostgreSQL para MySQL. As seguintes alterações foram feitas:

-   `shared/schema.ts` agora utiliza `mysqlTable` do Drizzle ORM.
-   As chaves primárias seguem o padrão `tabela_id`.
-   As propriedades no Typescript seguem o padrão `camelCase`.
-   O driver de conexão em `server/db.ts` foi atualizado para `mysql2`.

## 6. Executando o Sistema

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5000`.

## 7. Verificação de Integridade

Para garantir que o banco de dados e o código estão em sincronia:

```bash
# Verificar tipos
npm run check

# Gerar migrações do Drizzle (opcional)
npx drizzle-kit generate
```

---
*Documento preparado por Jules.*
