-- =============================================================================
-- ESTRUTURA SQL NORMALIZADA - CONTRATOS (PostgreSQL)
-- Sistema ERP de Gestão de Contratos
-- Data: Janeiro 2026
-- =============================================================================
-- 
-- A tabela monolítica de contratos (44 campos) foi reestruturada em 3 tabelas:
-- 1. contracts - Dados centrais/identidade do contrato (titular)
-- 2. contract_services - Detalhes dos serviços contratados  
-- 3. contract_billing - Informações de cobrança e comercial
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TABELA 1: contracts (Dados do Contrato/Titular)
-- Contém a identidade do contrato e referência ao proprietário
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    
    -- Referências do sistema
    sys_unit_id INTEGER,                                    -- Unidade do sistema
    sys_user_id INTEGER,                                    -- Usuário do sistema (proprietário)
    partner_id INTEGER REFERENCES partners(id),             -- Parceiro/Cliente vinculado
    
    -- Identificação do contrato
    contract_name TEXT NOT NULL,                            -- Nome do contrato
    contract_number TEXT NOT NULL,                          -- Número do contrato
    original_contract_number TEXT,                          -- Número original (para transferências)
    current_status TEXT DEFAULT 'active',                   -- Status: active, canceled, redeemed, transferred
    
    -- Informações adicionais
    obs TEXT,                                               -- Observações gerais
    indicated_by INTEGER,                                   -- Indicado por (ID do parceiro)
    
    -- Campos de auditoria
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    deleted_by INTEGER
);

-- Índices para contracts
CREATE INDEX IF NOT EXISTS idx_contracts_sys_unit ON contracts(sys_unit_id);
CREATE INDEX IF NOT EXISTS idx_contracts_sys_user ON contracts(sys_user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_partner ON contracts(partner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(contract_number);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(current_status);
CREATE INDEX IF NOT EXISTS idx_contracts_deleted ON contracts(deleted_at) WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- TABELA 2: contract_services (Serviços Contratados)
-- Contém todos os detalhes dos serviços vinculados ao contrato
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contract_services (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),  -- FK para contracts
    
    -- Classificação do serviço
    group_batch_id INTEGER,                                 -- Grupo/Lote
    class_id INTEGER,                                       -- Classe do contrato
    status_id INTEGER,                                      -- Status do serviço
    contract_type TEXT NOT NULL,                            -- Tipo do contrato
    industry TEXT DEFAULT 'FUNERAL',                        -- Indústria/Segmento
    
    -- Datas do ciclo de vida
    start_date TIMESTAMP NOT NULL,                          -- Data de início
    end_date TIMESTAMP,                                     -- Data de término
    admission TIMESTAMP NOT NULL,                           -- Data de admissão
    final_grace TIMESTAMP,                                  -- Carência final
    grace_period_days TEXT,                                 -- Dias de carência
    renew_at TIMESTAMP,                                     -- Data de renovação
    
    -- Valores e opções de serviço
    services_amount INTEGER,                                -- Quantidade de serviços
    service_option1 TEXT,                                   -- Opção de serviço 1
    service_option2 TEXT,                                   -- Opção de serviço 2
    
    -- Contadores de dependentes
    alives INTEGER,                                         -- Vivos
    deceaseds INTEGER,                                      -- Falecidos
    dependents INTEGER,                                     -- Dependentes
    
    -- Campos de auditoria
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    deleted_by INTEGER
);

-- Índices para contract_services
CREATE INDEX IF NOT EXISTS idx_contract_services_contract ON contract_services(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_services_type ON contract_services(contract_type);
CREATE INDEX IF NOT EXISTS idx_contract_services_start ON contract_services(start_date);
CREATE INDEX IF NOT EXISTS idx_contract_services_deleted ON contract_services(deleted_at) WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- TABELA 3: contract_billing (Cobrança e Comercial)
-- Contém informações de faturamento, cobradores e configuração financeira
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contract_billing (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),  -- FK para contracts
    
    -- Equipe comercial
    seller_id INTEGER,                                      -- Vendedor
    collector_id INTEGER,                                   -- Cobrador
    region_id INTEGER,                                      -- Região
    
    -- Configuração de cobrança
    billing_frequency INTEGER DEFAULT 1,                    -- Frequência (1=Mensal, 12=Anual)
    month_initial_billing CHAR(2) NOT NULL,                 -- Mês inicial (01-12)
    year_initial_billing CHAR(4) NOT NULL,                  -- Ano inicial (YYYY)
    opt_payday INTEGER,                                     -- Dia de vencimento preferencial
    
    -- Controle de cobranças
    first_charge INTEGER,                                   -- Primeira cobrança
    last_charge INTEGER,                                    -- Última cobrança
    charges_amount INTEGER,                                 -- Total de cobranças
    charges_paid INTEGER,                                   -- Cobranças pagas
    
    -- Configurações financeiras
    late_fee_percentage DECIMAL(8,5),                       -- Percentual de multa
    is_partial_payments_allowed BOOLEAN,                    -- Permite pagamento parcial
    default_plan_installments TEXT,                         -- Parcelas padrão do plano
    default_plan_frequency TEXT DEFAULT 'MONTHLY',          -- Frequência do plano
    
    -- Campos de auditoria
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    deleted_by INTEGER
);

-- Índices para contract_billing
CREATE INDEX IF NOT EXISTS idx_contract_billing_contract ON contract_billing(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_seller ON contract_billing(seller_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_collector ON contract_billing(collector_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_region ON contract_billing(region_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_deleted ON contract_billing(deleted_at) WHERE deleted_at IS NULL;

-- =============================================================================
-- RELACIONAMENTOS
-- =============================================================================
-- 
-- contracts (1) ←→ (1) contract_services
-- contracts (1) ←→ (1) contract_billing
-- 
-- Cada contrato possui EXATAMENTE um registro em contract_services
-- e EXATAMENTE um registro em contract_billing.
--
-- A API retorna os dados "flattened" para compatibilidade com código legado,
-- além de objetos aninhados (services, billing) para novo código.
--
-- =============================================================================

-- =============================================================================
-- COMENTÁRIOS NAS TABELAS
-- =============================================================================
COMMENT ON TABLE contracts IS 'Tabela principal de contratos - identidade e titular';
COMMENT ON TABLE contract_services IS 'Serviços contratados - detalhes do ciclo de vida';
COMMENT ON TABLE contract_billing IS 'Cobrança e comercial - configuração financeira';

COMMENT ON COLUMN contracts.sys_user_id IS 'ID do usuário proprietário do contrato (titular)';
COMMENT ON COLUMN contracts.current_status IS 'Status: active, canceled, redeemed, transferred';
COMMENT ON COLUMN contract_services.contract_type IS 'Tipo do contrato (obrigatório)';
COMMENT ON COLUMN contract_billing.billing_frequency IS '1=Mensal, 3=Trimestral, 6=Semestral, 12=Anual';
