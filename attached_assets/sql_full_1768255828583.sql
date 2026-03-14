
CREATE TABLE schema_version (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

INSERT INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial contracts management system schema');

CREATE TABLE gender( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE document_type( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      description varchar  (100)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE address_type( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 			
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      column_9 INT   , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE payment_status( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      code char  (2)    NOT NULL , 
      kanban boolean   , 
      color char  (100)   , 
      kanban_order INT   , 
      final_state boolean   , 
      initial_state boolean   , 
      allow_edition boolean   , 
      allow_deletion boolean   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE estado( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      uf char  (2)    NOT NULL , 
      codigo_ibge varchar  (10)   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT,
      updated_by INT,
      deleted_by INT,
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE cidade( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      estado_id INT UNSIGNED  NOT NULL , 
      name varchar  (100)    NOT NULL , 
      codigo_ibge varchar  (10)   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT,
      updated_by INT,
      deleted_by INT,
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE currency (
    id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
    currency_code CHAR(3) NOT NULL ,
    currency_name VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(10),
    decimal_places INT NOT NULL DEFAULT 2 CHECK (decimal_places BETWEEN 0 AND 6),
    rounding_method VARCHAR(20) DEFAULT 'HALF_UP' CHECK (rounding_method IN ('UP', 'DOWN', 'HALF_UP', 'HALF_DOWN')),
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
    deleted_at timestamp    DEFAULT NULL , 
    created_by INT   , 
    updated_by INT   , 
    deleted_by INT   ,
    PRIMARY KEY  (id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE general_status( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      status_code varchar  (20)    NOT NULL , 
      status_name varchar  (50)    NOT NULL , 
      description TEXT,
      generate_charge boolean   , 
      allows_service boolean   , 
      charge_after INT   , 
      kanban boolean   , 
      color char  (100)   , 
      kanban_order INT   , 
      final_state boolean   , 
      initial_state boolean   , 
      allow_edition boolean   , 
      allow_deletion boolean   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'Reference table for status codes used throughout the system'; 


CREATE TABLE sys_group( 
      id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      name text    NOT NULL , 
      uuid varchar  (36)   , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_group_program( 
      id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      sys_group_id INT  UNSIGNED  NOT NULL , 
      sys_program_id INT  UNSIGNED   NOT NULL , 
      actions text   , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_preference( 
      id varchar  (200)    NOT NULL , 
      preference text   , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_program( 
      id INT UNSIGNED AUTO_INCREMENT   NOT NULL , 
      name text    NOT NULL , 
      controller text    NOT NULL , 
      actions text   , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_unit( 
      id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      subsidiary_id INT UNSIGNED   NOT NULL , 
      general_status_id INT UNSIGNED   , 
      name text    NOT NULL , 
      connection_name text   , 
      code varchar  (20)    NOT NULL , 
    PRIMARY KEY (id) , 
    FOREIGN KEY (general_status_id) REFERENCES general_status(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_user_group( 
      id INT UNSIGNED    NOT NULL , 
      sys_user_id INT UNSIGNED    NOT NULL , 
      sys_group_id INT  UNSIGNED   NOT NULL , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_user_program( 
      id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      sys_user_id INT  UNSIGNED   NOT NULL , 
      sys_program_id INT  UNSIGNED   NOT NULL , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_user( 
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    login varchar(200)   NOT NULL , 
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    frontpage_id INT UNSIGNED ,
    sys_unit_id INT UNSIGNED ,
    active TINYINT(1) DEFAULT 1,
    accepted_term_policy_at TIMESTAMP NULL,
    accepted_term_policy TINYINT(1),
    two_factor_enabled TINYINT(1) DEFAULT 0,
    two_factor_type VARCHAR(100),
    two_factor_secret VARCHAR(255),
    is_admin TINYINT(1) DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    deleted_by INT,
    PRIMARY KEY (id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_user_id ON sys_user (id);
CREATE INDEX idx_user_email ON sys_user (email);
CREATE INDEX idx_user_username ON sys_user (name);

CREATE TABLE address( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 			
      address_type_id INT UNSIGNED   NOT NULL , 			
      is_main boolean     DEFAULT TRUE , 			
      zip_code varchar  (50)    NOT NULL , 			
      address varchar  (200)    NOT NULL , 			
      address_number varchar  (100)   , 			
      address_line1 varchar  (250)   , 				
      address_line2 varchar  (250)   , 				 
      city varchar  (200)    NOT NULL , 			
      state varchar  (100)   , 				
      country VARCHAR(50),
      observacao text   , 					
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 	
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,    
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (address_type_id) REFERENCES address_type(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE entity_address (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('client', 'partner') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  address_id INT UNSIGNED NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE company (
    id INT UNSIGNED PRIMARY KEY,
    parent_company_id INT UNSIGNED ,
    company_name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(150) NOT NULL,
    tax_id VARCHAR(50) NOT NULL,
    address_id INT UNSIGNED NOT NULL REFERENCES address(id),
    country VARCHAR(50),
    phone VARCHAR(30),
    email VARCHAR(100),
    website VARCHAR(100),
    logo_url VARCHAR(255),
    fiscal_year_start DATE,
    default_currency CHAR(3) NOT NULL ,
    is_consolidated BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL ,
    created_by INT,
    updated_by INT,
    deleted_by INT,
    CONSTRAINT fk_company_parent FOREIGN KEY (parent_company_id) REFERENCES company(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;


CREATE INDEX idx_company_name ON company (company_name);
CREATE INDEX idx_company_tax_id ON company (tax_id);
CREATE INDEX idx_company_parent ON company (parent_company_id);
CREATE INDEX idx_company_is_active ON company (is_active); 

CREATE TABLE sys_user_unit( 
      id INT UNSIGNED AUTO_INCREMENT   NOT NULL , 
      sys_user_id INT UNSIGNED    NOT NULL , 
      sys_unit_id INT UNSIGNED    NOT NULL , 
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE user_company_access (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    company_id INT UNSIGNED NOT NULL,
    can_view TINYINT(1) DEFAULT 1,
    can_edit TINYINT(1) DEFAULT 0,
    can_approve TINYINT(1) DEFAULT 0,
    can_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id, company_id),
    CONSTRAINT fk_user_access_user FOREIGN KEY (id) REFERENCES sys_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_access_company FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE entity_sys_user (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('client', 'partner') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  sys_user_id INT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (sys_user_id) REFERENCES sys_user(id)
);

CREATE TABLE subsidiary( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      code varchar  (20)    NOT NULL , 
      status varchar  (50)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE partner_type (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNSIGNED  NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    UNIQUE (company_id, type_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_partner_type_company ON partner_type (id);

CREATE TABLE account_type (
    id INT UNSIGNED AUTO_INCREMENT ,
    company_id INT NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    nature VARCHAR(20) NOT NULL,
    description TEXT,
    is_system TINYINT(1) DEFAULT 0,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id) ,
    UNIQUE KEY uk_account_type_company (company_id, type_name),
    CONSTRAINT chk_account_type_nature CHECK (nature IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_account_type_company ON account_type (company_id);

CREATE TABLE classe( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      name varchar  (100)    NOT NULL , 				
      description varchar  (200)    NOT NULL , 				
      amount_contracts INT   , 						
      is_periodic boolean    DEFAULT TRUE  NOT NULL , 			
      purchase_value DECIMAL  (19,4)    NOT NULL , 			
      number_of_parcels INT    NOT NULL , 				
      generated_parcels INT    NOT NULL , 				
      month_value DECIMAL  (19,4)    NOT NULL , 			
      depend_value DECIMAL  (19,4)   , 					
      number_of_month_valid INT   , 					
      is_renewable boolean   , 						
      is_renewable_used boolean   , 					
      total_value DECIMAL  (19,4)   , 					
      message1 varchar  (30)   , 
      message2 varchar  (30)   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE group_batch( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      class_id INT UNSIGNED   NOT NULL , 					

      name varchar  (100)    NOT NULL , 				
      group_code varchar  (5)    NOT NULL , 				
      begin_code varchar  (9)    NOT NULL , 				 
      final_code varchar  (9)    NOT NULL , 				

      is_periodic boolean    NOT NULL , 				
      amount_process INT    NOT NULL , 					
      min_proc INT  UNSIGNED  NOT NULL , 				
      max_proc INT  UNSIGNED  NOT NULL , 				
      compare_admission boolean    DEFAULT FALSE  NOT NULL , 		
      amount_redeem INT    NOT NULL , 					
      by_service boolean    DEFAULT TRUE  NOT NULL , 			

      death_count INT DEFAULT 0 ,					
      current_death_count INT DEFAULT 0 ,				
      death_threshold INT DEFAULT 10 NOT NULL ,				

      last_billing_number varchar  (3)    NOT NULL , 			
      next_billing_number varchar  (3)    NOT NULL , 			
      last_issue_date date   , 						
      last_death_charge_date TIMESTAMP ,				

      pending_process INT   , 						
      number_contracts INT   , 						
      number_lifes INT    NOT NULL , 					
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (class_id) REFERENCES classe(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE document( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_user_id INT UNSIGNED  NOT NULL ,
      document_type_id INT UNSIGNED   NOT NULL , 
      document_number varchar  (50)    NOT NULL , 
      filename varchar  (255)    NOT NULL , 
      file_path varchar  (500)    NOT NULL , 
      file_size INT   , 
      mime_type varchar  (100)   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user (id)  ,
    FOREIGN KEY (document_type_id) REFERENCES document_type (id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE entity_document (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('client', 'partner') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  document_id INT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (document_id) REFERENCES document(id)
);

CREATE TABLE partner (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNSIGNED NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    sys_unit_id INT UNSIGNED    NOT NULL , 
    sys_user_id INT UNSIGNED    NOT NULL , 
    owner_id INT   UNSIGNED  NOT NULL , 					
    partner_code VARCHAR(30) NOT NULL,
    partner_name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(150),
    tax_id VARCHAR(30),
    partner_type_id INT UNSIGNED  NOT NULL REFERENCES partner_type(id),
    is_customer BOOLEAN DEFAULT FALSE,
    is_vendor BOOLEAN DEFAULT FALSE,
    is_collector BOOLEAN DEFAULT FALSE,
    is_employee BOOLEAN DEFAULT FALSE,       
    is_accredited BOOLEAN DEFAULT FALSE,     
    specialty_id INT UNSIGNED    NOT NULL , 			 
    advantages text   , 					 
    observation text   , 					 
    credit_limit DECIMAL(19, 4),
    payment_terms INT,  
    billing_address_id INT UNSIGNED  REFERENCES address(id),
    shipping_address_id INT UNSIGNED  REFERENCES address(id),
    doccument1_id INT UNSIGNED   REFERENCES document(id) ,
    doccument2_id INT UNSIGNED   REFERENCES document(id) ,
    phone VARCHAR(30),
    email VARCHAR(100),
    website VARCHAR(100),
    primary_partner_person VARCHAR(100),
    notes TEXT,
    receivable_account_id INT UNSIGNED ,
    payable_account_id INT UNSIGNED ,
    currency CHAR(3) DEFAULT 'BRL' ,
    tax_code_id INT UNSIGNED ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by INT,
    updated_by INT,
    deleted_by INT,
    UNIQUE (id, partner_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;
ALTER TABLE partner 
  ADD COLUMN is_customer_flag TINYINT(1) GENERATED ALWAYS AS (IF(is_customer = TRUE, 1, NULL)) VIRTUAL,
  ADD INDEX idx_partner_customer (company_id, is_customer_flag);
ALTER TABLE partner 
  ADD COLUMN is_vendor_flag TINYINT(1) GENERATED ALWAYS AS (IF(is_vendor = TRUE, 1, NULL)) VIRTUAL,
  ADD INDEX idx_partner_vendor (company_id, is_vendor_flag);
CREATE INDEX idx_partner_company ON partner (company_id);
CREATE INDEX idx_partner_type ON partner (partner_type_id);
CREATE INDEX idx_partner_name ON partner (partner_name);

CREATE TABLE contract_version (
    id SERIAL PRIMARY KEY,

    contract_id INTEGER NOT NULL REFERENCES contract(id),
    group_batch_id INTEGER NOT NULL REFERENCES group_batch(id),

    valid_from DATE NOT NULL,
    valid_to DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES sys_user(id)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    updated_by INT,
    deleted_by INT,
);

CREATE TABLE contract( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      created_version_id INT UNSIGNED NULL,

    -- Referências do sistema
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 

     owner_id INT   UNSIGNED  NOT NULL , 					
     partner_id INTEGER REFERENCES partners(id),             -- Parceiro/Cliente vinculado
      indicated_by INT UNSIGNED  , 						

    -- Identificação do contrato
      contract_name VARCHAR (100) NOT NULL ,
      contract_number varchar  (20)    NOT NULL , 			
    original_contract_number TEXT,                          -- Número original (para transferências)

    -- Informações adicionais
    current_status TEXT DEFAULT 'active',                   -- Status: active, canceled, redeemed, transferred
      obs text   , 							
      indicated_by INT UNSIGNED  , 						
      services_amount INT   , 						

    -- Campos de auditoria
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(id) ,
    FOREIGN KEY (owner_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (collector_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (seller_id) REFERENCES sys_user(id) ,
    CONSTRAINT fk_contract_created_version FOREIGN KEY (created_version_id) REFERENCES contract_version(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 
CREATE INDEX IF NOT EXISTS idx_contracts_sys_unit ON contracts(sys_unit_id);

-- -----------------------------------------------------------------------------
-- TABELA 2: contract_services (Serviços Contratados)
-- Contém todos os detalhes dos serviços vinculados ao contrato
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contract_services (
    id SERIAL PRIMARY KEY,

    contract_version_id INTEGER NOT NULL REFERENCES contract_version(id),


     -- Classificação do serviço
    group_batch_id INT  UNSIGNED   NOT NULL ,		    -- Grupo/Lote
    class_id INTEGER NOT NULL REFERENCES classe(id),
    status_id INTEGER NOT NULL REFERENCES general_status(id),
    contract_type varchar  (50)    NOT NULL , 		    -- Tipo do contrato

      industry VARCHAR(50) DEFAULT 'FUNERAL' ,	            -- Indústria/Segmento
    
    -- Datas do ciclo de vida
    start_date TIMESTAMP NOT NULL,                          -- Data de início
    end_date TIMESTAMP,                                     -- Data de término
    admission TIMESTAMP NOT NULL,                           -- Data de admissão
    final_grace TIMESTAMP,                                  -- Carência final
    grace_period_days TEXT,                                 -- Dias de carência
    renew_at TIMESTAMP,                                     -- Data de renovação
    
    -- Valores e opções de serviço
    services_amount INTEGER,                                -- Quantidade de serviços
    service_option1 varchar  (100),                         -- Opção de serviço 1
    service_option2 varchar  (100),                         -- Opção de serviço 2
    
    -- Contadores de dependentes
    alives INTEGER,                                         -- Vivos
    deceaseds INTEGER,                                      -- Falecidos
    dependents INTEGER,                                     -- Dependentes
    
    -- Campos de auditoria
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP ,
    created_by INTEGER ,
    updated_by INTEGER ,
    deleted_by INTEGER ,
);

-- Índices para contract_services
CREATE INDEX IF NOT EXISTS idx_contract_services_contract ON contract_services(contract_version_id);
CREATE INDEX IF NOT EXISTS idx_contract_services_type ON contract_services(contract_type);
CREATE INDEX IF NOT EXISTS idx_contract_services_start ON contract_services(start_date);
CREATE INDEX IF NOT EXISTS idx_contract_services_deleted ON contract_services(deleted_at) WHERE deleted_at IS NULL;


-- -----------------------------------------------------------------------------
-- TABELA 3: contract_billing (Cobrança e Comercial)
-- Contém informações de faturamento, cobradores e configuração financeira
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contract_billing (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    contract_version_id INTEGER NOT NULL REFERENCES contract_version(id),  -- FK para contracts
    
    -- Equipe comercial
    seller_id INTEGER REFERENCES sys_user(id),
    collector_id INTEGER REFERENCES sys_user(id),
    region_id INTEGER REFERENCES region(id),
    
    -- Configuração de cobrança
    billing_frequency INTEGER DEFAULT 1 NOT NULL ,                    -- Frequência (1=Mensal, 12=Anual)
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
CREATE INDEX IF NOT EXISTS idx_contract_billing_contract ON contract_billing(contract_version_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_seller ON contract_billing(seller_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_collector ON contract_billing(collector_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_region ON contract_billing(region_id);
CREATE INDEX IF NOT EXISTS idx_contract_billing_deleted ON contract_billing(deleted_at) WHERE deleted_at IS NULL;


-- =============================================================================
-- RELACIONAMENTOS
-- =============================================================================
-- 
-- ??? contracts (1) ←→ (1) contract_services ??? 
-- ??? contracts (1) ←→ (1) contract_billing ??? 
-- 
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

CREATE TABLE contract_events (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),
    contract_version_id INTEGER REFERENCES contract_version(id),

    event_type TEXT NOT NULL,   -- CRIACAO, ADITIVO, CANCELAMENTO, ATENDIMENTO
    event_date TIMESTAMP NOT NULL,
    payload JSONB NULL,

    created_by INTEGER REFERENCES sys_users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE performed_service( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   , 
      contract_version_id INT  UNSIGNED   NOT NULL , 
      beneficiary_id INT  UNSIGNED  , 
      service_type_id INT  UNSIGNED   NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE service_funeral ( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      contract_version_id INT  UNSIGNED   NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL COMMENT 'Unit where service was performed' , 
      sys_user_id INT  UNSIGNED  NOT NULL COMMENT 'User who recorded the service', 
      performed_service_id INT UNSIGNED   NOT NULL COMMENT 'Link to general service tracking', 
      declarant_id INT UNSIGNED  , 					
      deceased_id INT  UNSIGNED , 					
      office_users_id INT  UNSIGNED  NOT NULL , 			
      process_number varchar  (25)    NOT NULL , 		
      occurr_at date    NOT NULL , 				
      category varchar  (25)    DEFAULT 'PL'  NOT NULL , 	
      kinship varchar  (25)    NOT NULL , 			
      death_at date   , 					
      death_time char  (5)   , 					
      death_address_id INT    NOT NULL , 			
      payment_at date   , 					
      burial_date date   , 					
      burial_time char  (5)   , 				
      cemetery varchar  (200)   , 				
      paid_amount DECIMAL  (19,4)   , 				
      paid_in_date date   , 					
      group_batch_id INT UNSIGNED ,					
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 	
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (performed_service_id) REFERENCES performed_service(id) ,
    FOREIGN KEY (declarant_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (office_users_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Funeral services provided to contract beneficiaries'; 


CREATE TABLE beneficiary (
    id SERIAL PRIMARY KEY,

    contract_version_id INTEGER NOT NULL REFERENCES contract_version(id),
    sys_unit_id INTEGER NOT NULL REFERENCES sys_unit(id),

    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,

    birth_at DATE,
    gender_id INTEGER REFERENCES gender(id),
    document_id INTEGER NOT NULL REFERENCES document(id),

    grace_at DATE,
    is_alive BOOLEAN,
      is_forbidden boolean   , 					
      service_funeral_id INT  UNSIGNED , 				

    created_at TIMESTAMP DEFAULT NOW(),
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
    deleted_at TIMESTAMP
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE contract_charge (
    id SERIAL PRIMARY KEY,

    contract_version_id INTEGER NOT NULL REFERENCES contract_version(id),
    sys_unit_id INTEGER NOT NULL REFERENCES sys_unit(id),

    payment_status_id INTEGER NOT NULL REFERENCES payment_status(id),

    charge_code VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(19,4) NOT NULL,

    payment_date DATE,
    paid_amount DECIMAL(19,4),

    due_month CHAR(2),
    due_year CHAR(4),
      convenio varchar  (20)   , 					
      payd_month char  (2)   , 						
      payd_year char  (4)   , 						

    created_at TIMESTAMP DEFAULT NOW(),
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
    deleted_at TIMESTAMP


      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE addendum( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 			
      general_status_id INT UNSIGNED   , 				
      name varchar  (100)    NOT NULL , 			
      description varchar  (200)    NOT NULL , 			
      amount DECIMAL  (19,4) NOT NULL,				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (general_status_id) REFERENCES general_status(id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE contract_addendum( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED , 
      contract_version__id INT  UNSIGNED  NOT NULL , 
      addendum_id INT  UNSIGNED  NOT NULL , 				
      name varchar  (100)    NOT NULL , 			
      product_code varchar  (100)    NOT NULL , 		
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ,
    FOREIGN KEY (addendum_id) REFERENCES addendum(id) 
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 


CREATE TABLE account (
    id INT UNSIGNED PRIMARY KEY,
    company_id INT UNSIGNED NOT NULL,
    account_type_id INT UNSIGNED NOT NULL,
    parent_account_id INT UNSIGNED ,
    account_code VARCHAR(30) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_bank_account TINYINT(1) DEFAULT 0,
    is_control_account TINYINT(1) DEFAULT 0,
    is_tax_relevant TINYINT(1) DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    opening_balance DECIMAL(19, 4) DEFAULT 0,
    current_balance DECIMAL(19, 4) DEFAULT 0,
    level INT NOT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at timestamp    DEFAULT NULL , 
    created_by INT   , 
    updated_by INT   , 
    deleted_by INT   , 
    UNIQUE KEY uk_account_company_code (company_id, account_code),
    CONSTRAINT fk_account_company FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE,
    CONSTRAINT fk_account_type FOREIGN KEY (account_type_id) REFERENCES account_type(id),
    CONSTRAINT fk_account_parent FOREIGN KEY (parent_account_id) REFERENCES account(id) ON DELETE RESTRICT,
    CONSTRAINT chk_account_level CHECK (level >= 1) ,
    CONSTRAINT chk_no_self_parent CHECK (parent_account_id != id OR parent_account_id IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_account_company ON account (company_id);
CREATE INDEX idx_account_parent ON account (parent_account_id);
CREATE INDEX idx_account_type ON account (account_type_id);
CREATE INDEX idx_account_code ON account (company_id, account_code);

CREATE TABLE partner_bank_account (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    partner_id INT UNSIGNED NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50),
    routing_number VARCHAR(50),
    iban VARCHAR(50),
    swift_code VARCHAR(20),
    bank_address TEXT,
    account_holder VARCHAR(100),
    account_type VARCHAR(30),
    is_default BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP ,
    created_by INT,
    updated_by INT,
    deleted_by INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_partner_bank_partner ON partner_bank_account (partner_id);


ALTER TABLE company ADD CONSTRAINT fk_company_currency FOREIGN KEY (default_currency) REFERENCES currency(id); 
ALTER TABLE company ADD CONSTRAINT fk_company_parent2 FOREIGN KEY (parent_company_id) REFERENCES company(id);
ALTER TABLE company ADD CONSTRAINT valid_parent CHECK (parent_company_id != id OR parent_company_id IS NULL) ;


ALTER TABLE performed_service ADD FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id) ;
ALTER TABLE service_funeral ADD FOREIGN KEY (deceased_id) REFERENCES beneficiary(id) ;
ALTER TABLE beneficiary ADD  FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(id) ;

INSERT INTO general_status (status_code, status_name, description) VALUES
('ACTIVE', 'Active', 'Active record'),
('INACTIVE', 'Inactive', 'Inactive record'),
('DRAFT', 'Draft', 'Initial draft state'),
('PENDING', 'Pending', 'Awaiting action'),
('APPROVED', 'Approved', 'Approved for processing'),
('COMPLETED', 'Completed', 'Process completed'),
('CANCELED', 'Canceled', 'Process cancelado');

CREATE TABLE contract_status( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      code char  (2)    NOT NULL , 
      generate_charge boolean   , 
      allows_service boolean   , 
      charge_after INT   , 
      kanban boolean   , 
      color char  (100)   , 
      kanban_order INT   , 
      is_final_state boolean   , 
      is_initial_state boolean   , 
      allow_edition boolean   , 
      allow_deletion boolean   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      unit_id INT   , 
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE status_possible( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      code char  (2)    NOT NULL , 
      name varchar  (250)    NOT NULL , 
      generate_charge boolean   , 
      allows_service boolean   , 
      charge_after INT   , 
      kanban boolean   , 
      color char  (100)   , 
      kanban_order INT   , 
      final_state boolean   , 
      initial_state boolean   , 
      allow_edition boolean   , 
      allow_deletion boolean   , 
      created_at timestamp   , 
      updated_at timestamp   , 
      deleted_at timestamp   , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      unit_id INT   , 
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE status_reason( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      reason varchar  (200)    NOT NULL , 
      description varchar  (250)   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      unit_id INT   , 
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE contract_status_history( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      status_possible_id INT UNSIGNED   NOT NULL , 			  
      status_reason_id INT  UNSIGNED  NOT NULL , 			 
      contract_version_id INT UNSIGNED   NOT NULL , 				 
      contract_number varchar  (20)    NOT NULL , 		
      detail_status varchar  (250)   , 				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      delted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (status_possible_id) REFERENCES status_possible(id) ,
    FOREIGN KEY (status_reason_id) REFERENCES status_reason(id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE bank_slip( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 			 
      sys_user_id INT UNSIGNED   NOT NULL , 			
      contract_charge_id INT  UNSIGNED  NOT NULL , 	
      seq varchar  (7)    NOT NULL , 			
      nnumber varchar  (50)    NOT NULL , 			
      charge_code varchar  (100)    NOT NULL , 			 
      status varchar  (100)   , 				 
      send_at timestamp   , 					 
      send_batch char  (7)   , 					  
      response_at timestamp   , 				 
      response_batch char  (7)   , 				 
      response varchar  (100)   , 				 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE ordpgrc( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      sys_user_name varchar (50) ,   				
      order_number varchar  (20)    NOT NULL , 			 
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,		
      total_amount DECIMAL  (19,4)    NOT NULL , 		
      number_receipt INT UNSIGNED   , 				
      closing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,	
      status text    NOT NULL , 				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE payment_receipt( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      subsidiary_id INT UNSIGNED   NOT NULL , 				
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      contract_version_id INT  UNSIGNED  NOT NULL , 
      status char  (2)   , 					
      billing_number varchar  (100)   , 			
      val_payment DECIMAL  (19,4)   , 				
      val_aux DECIMAL  (19,4)   , 				
      due_date date   , 					
      cashier_number char  (8)   , 				
      method_pay varchar  (100)   , 				
      obs_pay varchar  (200)   , 				
      ordpgrc_id INT UNSIGNED   NOT NULL , 				
      payment_status_id INT  UNSIGNED  NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ,
    FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(id) ,
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE carteirinha( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      performed_service_id INT UNSIGNED   NOT NULL , 
      sys_unit_id INT UNSIGNED  , 
      sys_user_id INT UNSIGNED  , 
      contract_version_id INT  UNSIGNED , 
      beneficiary_id INT UNSIGNED  , 
      card_cod varchar  (100)   ,   				-- codigo impresso no cartao
      vencimento varchar  (100)   , 				-- valido ateh... hoje em texto (VAL 06/2025 A 05/2026)
      observacao text   , 					--
      importado_at timestamp   , 				-- data que foi importado do contrato/beneficiario/cobranca
      exportado_at timestamp   , 				-- data que exportou para impressao do cartao (terceiros)
      retorno_at timestamp   , 					-- data do recebimento do cartao impresso
      entregue_at timestamp   , 				-- data da entrega ao beneficiario
      valor DECIMAL  (19,4)   , 				-- valor (quando cobrado)
      pago_at timestamp   , 					-- data do pagamento
      numop varchar  (10)   , 					-- numero do caixa
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
    PRIMARY KEY (id),
    FOREIGN KEY (performed_service_id) REFERENCES performed_service(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE equipament_rental( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      performed_service_id INT  UNSIGNED  NOT NULL , 
      sys_unit_id INT UNSIGNED  , 
      sys_user_id INT UNSIGNED  , 
      contract_version_id INT  UNSIGNED , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
   PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE batch_chk( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      subsidiary_id INT UNSIGNED   NOT NULL , 			-- qual a empresa
      sys_unit_id INT  UNSIGNED  NOT NULL , 			-- qual a unidade ??? (verificar se a unidade recebedora sera usada)	
      sys_user_id INT UNSIGNED   NOT NULL , 			-- qual usuario
      batch_number varchar  (10)    NOT NULL , 			-- numero do lote
      detail varchar  (100)    NOT NULL , 			-- um complemento informativo
      expenses DECIMAL  (19,4)    NOT NULL , 			-- valor das despesas ja deduzidas do valor total recebido
      discharge_date date    NOT NULL , 			-- data da baixa
      commiss_bill DECIMAL  (5,2)    NOT NULL , 		-- comissao sobre o recebimento das taxas (tipos [2-9])
      qtd_other DECIMAL  (5,2)    NOT NULL , 			-- quntidades de outros recebimentos 
      vl_other DECIMAL  (19,4)    NOT NULL , 			-- valor de outros recebimentos 
      qtd_bill DECIMAL  (5,2)    NOT NULL , 			-- quantidade de recebimento de taxas (tipo [2-9] )
      vl_bill DECIMAL  (19,4)    NOT NULL , 			-- valor
      payment_value DECIMAL  (19,4)    NOT NULL , 		-- valor devido em comissao
      nrcctopay varchar  (7)    NOT NULL , 			-- numero de registro da comissao a pagar (falta incluir essa tabela)
      cashier_number varchar  (7)    NOT NULL , 		-- numero do caixa desse lote de recebimentos
      ordpgrc_id INT  UNSIGNED  NOT NULL , 				-- id de relacionamento com o arquivo de caixas
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   ,  
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE batch_detail( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      batch_chk_id INT  UNSIGNED  NOT NULL , 			-- ligacao com o lote
      contract_charge_id INT  UNSIGNED  NOT NULL , 			-- ligacao com a cobranca do contrato
      seq_number varchar  (5)    NOT NULL , 			-- nr.sequencial de lancamento	
      billing_number varchar  (100)   , 			-- campo de identificacao lido
      amount_received DECIMAL  (19,4)    NOT NULL , 		-- valor recebido
      process_status char  (1)    NOT NULL , 			-- kambam de baixa
      payment_status_id INT  UNSIGNED  NOT NULL , 			
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      deleted_by INT   , 
      updated_by INT   ,  
    PRIMARY KEY (id) ,
    FOREIGN KEY (batch_chk_id) REFERENCES batch_chk(id) ,
    FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(id) ,
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE charge( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      group_batch_id INT  UNSIGNED  NOT NULL , 
      charge_number varchar  (7)    NOT NULL , 				-- numero da cobranca 
      pending_cases_number INT   , 					-- 
      issue_date timestamp   , 						-- data da emissao
      due_date timestamp   , 						-- data do vencimento
      month_ref varchar  (100)   , 					-- mes de referencia (para kamban)
      amount DECIMAL  (19,4)   , 					-- valor
      message varchar  (100)   , 
      message1 varchar  (100)   , 
      message2 varchar  (100)   , 
      amount_issued INT   , 						-- qtdade gerada
      amount_paid INT   , 						-- qtdade paga
      canceled INT   , 						
      release_date timestamp   , 					-- data geracao
      printing_date timestamp   , 					-- data da impressao
      status VARCHAR(20) DEFAULT 'PENDING' ,				-- status (_id ???) gerada, impressa, enviada para registro,...) 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE prorated_service(
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      charge_id INT UNSIGNED NOT NULL ,
      service_funeral_id INT UNSIGNED NOT NULL ,
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (charge_id) REFERENCES charge(id) ,
    FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;
  
CREATE TABLE service_type( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      name varchar  (100)    NOT NULL , 
      route varchar  (200)   , 
-- (ad27u15)
      industry VARCHAR(50) DEFAULT 'FUNERAL' ,
      is_billable BOOLEAN DEFAULT TRUE ,
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE specialty( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 
      name varchar  (100)    NOT NULL , 
      description varchar  (250)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE death_event (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    group_batch_id INT UNSIGNED NOT NULL,
    beneficiary_id INT UNSIGNED NOT NULL,
    service_funeral_id INT  UNSIGNED NOT NULL,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_for_billing BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id),
    FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contract_active( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 
      contract_number varchar  (20)    NOT NULL , 
      contract_version_id INT  UNSIGNED  NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE group_class( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 
      group_batch_id INT  UNSIGNED  NOT NULL , 
      class_id INT  UNSIGNED  NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (class_id) REFERENCES classe(id) , 
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE age_addendum( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 
      addendum_id INT UNSIGNED   NOT NULL , 			-- limite de idade para o adendo da tabela
      class_id INT  UNSIGNED  NOT NULL , 				-- categoria para essa limitacao
      name varchar  (100)    NOT NULL , 			-- nome para identificar essa limitacao
      description varchar  (250)   , 				-- uma descricao qualquer
      min_age INT   , 					-- idade maxima permitida para o adendo
      max_age INT   , 					-- idade maxima permitida para o adendo
      additional_value DECIMAL  (19,4)   , 			-- valor adicional mensal por esse adendo no contrato
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (addendum_id) REFERENCES addendum(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (class_id) REFERENCES classe(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE billing_cycle (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    group_batch_id INT UNSIGNED NOT NULL,
    death_event_count INT NOT NULL,
    charge_date TIMESTAMP NOT NULL,
    amount_per_contract DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (id),
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE contract_billing (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    cycle_id INT UNSIGNED NOT NULL,
    contract_version_id INT UNSIGNED NOT NULL,
    charge_id INT UNSIGNED ,
    amount DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (id) ,
    FOREIGN KEY (cycle_id) REFERENCES billing_cycle(id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_plan (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    contract_version_id INT UNSIGNED NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    total_amount DECIMAL  (19,4) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT ,
    PRIMARY KEY (id) ,
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_plan_installment (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    plan_id INT UNSIGNED NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    paid_amount DECIMAL  (19,4) DEFAULT 0,
    paid_date DATE,
    charge_id INT UNSIGNED ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES payment_plan(id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_transaction (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    contract_version_id INT UNSIGNED NOT NULL,
    charge_id INT UNSIGNED ,
    installment_id INT UNSIGNED ,
    amount DECIMAL  (19,4) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'COMPLETED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT ,
    PRIMARY KEY (id),
    FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(id) ,
    FOREIGN KEY (installment_id) REFERENCES payment_plan_installment(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE billing_rule (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    rule_name VARCHAR(100) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    description TEXT,
    condition_expression TEXT,
    charge_expression TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE billing_rule_application (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT UNSIGNED  NOT NULL , 
    sys_user_id INT  UNSIGNED   NOT NULL , 
    rule_id INT UNSIGNED NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'CONTRACT', 'GROUP', 'SERVICE'
    entity_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by INT ,
    PRIMARY KEY (id),
    FOREIGN KEY (rule_id) REFERENCES billing_rule(id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE medical_foward( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT   UNSIGNED NOT NULL , 
      sys_user_id INT   UNSIGNED NOT NULL , 
      partner_id INT  UNSIGNED  NOT NULL , 				-- qual parceiro/medico/credenciado/...
      performed_service_id INT UNSIGNED   NOT NULL , 			-- qual servico
      observation text   , 					-- Veuillez fournir un texte détaillé et informatif que l'utilisateur jugera utile d'imprimer sur l'onglet..
      val_payment DECIMAL  (19,4)   , 				-- valor pago
      val_aux DECIMAL  (19,4)   , 				-- pago com	
      due_date date   , 					-- data do pagamento
      cashier_number char  (8)   , 				-- numero do caixa 
      method_pay varchar  (100)   , 				-- metodo (dindim, cartao, pix,...)
      obs_pay varchar  (200)   , 				-- Soyez détaillé et ajoutez tout texte que l'utilisateur jugera nécessaire.
      ordpgrc_id INT UNSIGNED   NOT NULL , 				-- Caixa 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(id) ,
    FOREIGN KEY (partner_id) REFERENCES partner(id) ,
    FOREIGN KEY (performed_service_id) REFERENCES performed_service(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE cep_cache( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      cep varchar  (8)   , 
      rua varchar  (500)   , 
      cidade varchar  (500)   , 
      bairro varchar  (500)   , 
      codigo_ibge varchar  (20)   , 
      uf char  (2)   , 
      cidade_id INT UNSIGNED   , 
      estado_id INT UNSIGNED   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT,
      updated_by INT,
      deleted_by INT,
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE api_error( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      api_timestamp timestamp    DEFAULT CURRENT_TIMESTAMP  NOT NULL , 
      severity text  , 
      error_code varchar  (50)   , 
      error_message text    NOT NULL , 
      error_details text   , 
      stack_trace text   , 
      http_method varchar  (10)   , 
      endpoint varchar  (255)    NOT NULL , 
      full_url text    NOT NULL , 
      request_headers text   , 
      request_body text   , 
      query_parameters text   , 
      http_status INT   , 
      response_body text   , 
      response_time_ms INT   , 
      class_name varchar  (255)   , 
      method_name varchar  (255)   , 
      line_number INT   , 
      file_name varchar  (255)   , 
      sys_user_id INT UNSIGNED   , 
      user_ip varchar  (45)   , 
      user_agent text   , 
      environment varchar  (50)   , 
      name_server varchar  (255)   , 
      is_resolved boolean   DEFAULT FALSE , 
      resolved_at timestamp   , 
      resolved_by INT   , 
      resolution_notes text   , 
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE audit_log( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_user_id INT UNSIGNED   , 
      audit_action varchar  (50)    NOT NULL , 
      name_table varchar  (100)    NOT NULL , 
      record_id INT    NOT NULL , 
      old_values text   , 
      new_values text   , 
      ip_address varchar  (45)   , 
      process_name VARCHAR(100) ,
      process_parameters TEXT ,
      process_outcome VARCHAR(50) ,
      error_message TEXT ,
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;









ALTER TABLE partner ADD CONSTRAINT fk_partner_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE partner ADD CONSTRAINT fk_partner_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE partner ADD CONSTRAINT fk_partner_specialty FOREIGN KEY (specialty_id) REFERENCES specialty(id); 
ALTER TABLE addendum ADD CONSTRAINT fk_addendum_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE addendum ADD CONSTRAINT fk_addendum_gstat FOREIGN KEY (general_status_id) REFERENCES general_status(id); 
ALTER TABLE address ADD CONSTRAINT fk_address_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE address ADD CONSTRAINT fk_address_addtype FOREIGN KEY (address_type_id) REFERENCES address_type(id); 
ALTER TABLE age_addendum ADD CONSTRAINT fk_age_addendum_class FOREIGN KEY (class_id) REFERENCES classe(id); 
ALTER TABLE age_addendum ADD CONSTRAINT fk_age_addendum_addendum FOREIGN KEY (addendum_id) REFERENCES addendum(id); 
ALTER TABLE bank_slip ADD CONSTRAINT fk_bank_slip_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE bank_slip ADD CONSTRAINT fk_bank_slip_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE bank_slip ADD CONSTRAINT fk_bank_slip_charge FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_ordpgrc FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(id); 
ALTER TABLE batch_detail ADD CONSTRAINT fk_batch_detail_batch FOREIGN KEY (batch_chk_id) REFERENCES batch_chk(id); 
ALTER TABLE batch_detail ADD CONSTRAINT fk_batch_detail_contcharge FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(id); 
ALTER TABLE batch_detail ADD CONSTRAINT fk_batch_detail_paymstat FOREIGN KEY (payment_status_id) REFERENCES payment_status(id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_document FOREIGN KEY (document_id) REFERENCES document(id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_funservice FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_gender FOREIGN KEY (gender_id) REFERENCES gender(id); 
ALTER TABLE carteirinha ADD CONSTRAINT fk_carteirinha_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE carteirinha ADD CONSTRAINT fk_carteirinha_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE carteirinha ADD CONSTRAINT fk_carteirinha_service FOREIGN KEY (performed_service_id) REFERENCES performed_service(id); 
ALTER TABLE charge ADD CONSTRAINT fk_charge_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE charge ADD CONSTRAINT fk_charge_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE charge ADD CONSTRAINT fk_charge_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(id); 
ALTER TABLE cidade ADD CONSTRAINT fk_cidade_estado FOREIGN KEY (estado_id) REFERENCES estado(id); 
ALTER TABLE classe ADD CONSTRAINT fk_class_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE classe ADD CONSTRAINT fk_class_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_owner FOREIGN KEY (owner_id) REFERENCES sys_user(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_status FOREIGN KEY (status_id) REFERENCES contract_status(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_collector FOREIGN KEY (collector_id) REFERENCES sys_user(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_seller FOREIGN KEY (seller_id) REFERENCES sys_user(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_indicated FOREIGN KEY (indicated_by) REFERENCES sys_user(id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_class FOREIGN KEY (class_id) REFERENCES classe(id); 
ALTER TABLE contract_active ADD CONSTRAINT fk_contract_number_unique_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id); 
ALTER TABLE contract_addendum ADD CONSTRAINT fk_contract_addendum_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id); 
ALTER TABLE contract_addendum ADD CONSTRAINT fk_contract_addendum_addendum FOREIGN KEY (addendum_id) REFERENCES addendum(id); 
ALTER TABLE contract_addendum ADD CONSTRAINT fk_contract_addendum_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE contract_charge ADD CONSTRAINT fk_contract_charge_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id) ON DELETE CASCADE ON UPDATE CASCADE; 
ALTER TABLE contract_charge ADD CONSTRAINT fk_contract_charge_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE contract_charge ADD CONSTRAINT fk_contract_charge_payment FOREIGN KEY (payment_status_id) REFERENCES payment_status(id); 
ALTER TABLE contract_status_history ADD CONSTRAINT fk_contract_status_history_statreason FOREIGN KEY (status_reason_id) REFERENCES status_reason(id); 
ALTER TABLE contract_status_history ADD CONSTRAINT fk_contract_status_history_statpossib FOREIGN KEY (status_possible_id) REFERENCES contract_status(id); 
ALTER TABLE contract_status_history ADD CONSTRAINT fk_contract_status_history_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id); 
ALTER TABLE document ADD CONSTRAINT fk_document_doctype FOREIGN KEY (document_type_id) REFERENCES document_type(id); 
ALTER TABLE document ADD CONSTRAINT fk_document_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE equipament_rental ADD CONSTRAINT fk_equipament_rental_perfservic FOREIGN KEY (performed_service_id) REFERENCES performed_service(id); 
ALTER TABLE group_batch ADD CONSTRAINT fk_group_batch_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE group_batch ADD CONSTRAINT fk_group_batch_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE group_batch ADD CONSTRAINT fk_group_batch_class FOREIGN KEY (class_id) REFERENCES classe(id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_class FOREIGN KEY (class_id) REFERENCES classe(id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_accredit FOREIGN KEY (partner_id) REFERENCES partner(id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_perfservic FOREIGN KEY (performed_service_id) REFERENCES performed_service(id); 
ALTER TABLE ordpgrc ADD CONSTRAINT fk_ordpgrc_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE ordpgrc ADD CONSTRAINT fk_ordpgrc_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_unit  FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_ordpgrc FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_paystat FOREIGN KEY (payment_status_id) REFERENCES payment_status(id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_servtype FOREIGN KEY (service_type_id) REFERENCES service_type(id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_contract FOREIGN KEY (contract_version_id) REFERENCES contract_version(id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_benefic FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_charge FOREIGN KEY (charge_id) REFERENCES charge(id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_servfuner FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_declarant FOREIGN KEY (declarant_id) REFERENCES sys_user(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_officer FOREIGN KEY (office_users_id) REFERENCES sys_user(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_perfservic FOREIGN KEY (performed_service_id) REFERENCES performed_service(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_deceased FOREIGN KEY (deceased_id) REFERENCES beneficiary(id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(id);
ALTER TABLE service_type ADD CONSTRAINT fk_service_type_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE specialty ADD CONSTRAINT fk_specialty_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE specialty ADD CONSTRAINT fk_specialty_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE sys_group_program ADD CONSTRAINT fk_sys_group_program_program FOREIGN KEY (sys_program_id) REFERENCES sys_program(id); 
ALTER TABLE sys_group_program ADD CONSTRAINT fk_sys_group_program_group FOREIGN KEY (sys_group_id) REFERENCES sys_group(id); 
ALTER TABLE sys_unit ADD CONSTRAINT fk_sys_unit_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(id); 
ALTER TABLE sys_unit ADD CONSTRAINT fk_sys_unit_genstat FOREIGN KEY (general_status_id) REFERENCES general_status(id); 
ALTER TABLE sys_user_group ADD CONSTRAINT fk_sys_user_group_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE sys_user_group ADD CONSTRAINT fk_sys_user_group_group FOREIGN KEY (sys_group_id) REFERENCES sys_group(id); 
ALTER TABLE sys_user_program ADD CONSTRAINT fk_sys_user_program_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE sys_user_program ADD CONSTRAINT fk_sys_user_program_progrm FOREIGN KEY (sys_program_id) REFERENCES sys_program(id); 
ALTER TABLE sys_user ADD CONSTRAINT fk_sys_user_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 
ALTER TABLE sys_user ADD CONSTRAINT fk_sys_user_frontpg FOREIGN KEY (frontpage_id) REFERENCES sys_program(id); 
ALTER TABLE sys_user_unit ADD CONSTRAINT fk_sys_user_unit_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(id); 
ALTER TABLE sys_user_unit ADD CONSTRAINT fk_sys_user_unit_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(id); 


--  Indices e views
CREATE INDEX idx_death_event_group_processed ON death_event (group_batch_id, processed_for_billing);
 CREATE UNIQUE INDEX unique_idx_addendum_name ON addendum  (name);
 CREATE UNIQUE INDEX unique_idx_address_type_name ON address_type  (name);
 CREATE UNIQUE INDEX unique_idx_age_addendum_name ON age_addendum  (name);
 CREATE UNIQUE INDEX unique_idx_class_name ON classe  (name);
 CREATE UNIQUE INDEX unique_idx_contract_active_contract_number ON contract_active  (contract_number);
 CREATE UNIQUE INDEX unique_idx_contract_status_name ON contract_status  (name);
 CREATE UNIQUE INDEX unique_idx_contract_status_code ON contract_status  (code);
 CREATE UNIQUE INDEX unique_idx_general_status_code ON general_status  (status_code);
 CREATE UNIQUE INDEX unique_idx_group_batch_name ON group_batch  (name);
 CREATE UNIQUE INDEX unique_idx_payment_status_name ON payment_status  (name);
 CREATE UNIQUE INDEX unique_idx_service_type_name ON service_type  (name);
 CREATE UNIQUE INDEX unique_idx_specialty_name ON specialty  (name);
 CREATE UNIQUE INDEX unique_idx_sys_unit_code ON sys_unit  (code);
 
CREATE INDEX idx_partner_sys_unit_id ON partner (sys_unit_id);
CREATE INDEX idx_partner_sys_user_id ON partner (sys_user_id);
CREATE INDEX idx_partner_specialty_id ON partner (specialty_id);
CREATE INDEX idx_addendum_sys_unit_id ON addendum (sys_unit_id);
CREATE INDEX idx_address_sys_user_id ON address (sys_user_id);
CREATE INDEX idx_age_addendum_addendum_id ON age_addendum (addendum_id);
CREATE INDEX idx_age_addendum_class_id ON age_addendum (class_id);
CREATE INDEX idx_api_error_user_id ON api_error (sys_user_id);
CREATE INDEX idx_audit_log_user_id ON audit_log (sys_user_id);
CREATE INDEX idx_audit_log_record_id ON audit_log (record_id);
CREATE INDEX idx_bank_slip_sys_unit_id ON bank_slip (sys_unit_id);
CREATE INDEX idx_bank_slip_sys_user_id ON bank_slip (sys_user_id);
CREATE INDEX idx_bank_slip_contract_charge_id ON bank_slip (contract_charge_id);
CREATE INDEX idx_batch_chk_subsidiary_id ON batch_chk (subsidiary_id);
CREATE INDEX idx_batch_chk_sys_unit_id ON batch_chk (sys_unit_id);
CREATE INDEX idx_batch_chk_sys_user_id ON batch_chk (sys_user_id);
CREATE INDEX idx_batch_detail_batch_chk_id ON batch_detail (batch_chk_id);
CREATE INDEX idx_batch_detail_contract_charge_id ON batch_detail (contract_charge_id);
CREATE INDEX idx_beneficiary_sys_unit_id ON beneficiary (sys_unit_id);
CREATE INDEX idx_beneficiary_contract_id ON beneficiary (contract_version_id);

-- CREATE INDEX idx_beneficiary_sys_user_id ON beneficiary (sys_user_id);

CREATE INDEX idx_carteirinha_performed_service_id ON carteirinha (performed_service_id);
CREATE INDEX idx_carteirinha_sys_unit_id ON carteirinha (sys_unit_id);
CREATE INDEX idx_carteirinha_sys_user_id ON carteirinha (sys_user_id);
CREATE INDEX idx_cep_cache_cidade_id ON cep_cache (cidade_id);
CREATE INDEX idx_cep_cache_estado_id ON cep_cache (estado_id);
CREATE INDEX idx_charge_sys_unit_id ON charge (sys_unit_id);
CREATE INDEX idx_charge_sys_user_id ON charge (sys_user_id);
CREATE INDEX idx_charge_group_id ON charge (group_batch_id);
CREATE INDEX idx_cidade_estado_id ON cidade (estado_id);
CREATE INDEX idx_class_sys_unit_id ON classe (sys_unit_id);
CREATE INDEX idx_class_sys_user_id ON classe (sys_user_id);
-- Índices para contracts
CREATE INDEX IF NOT EXISTS idx_contract_sys_unit ON contract (sys_unit_id);
CREATE INDEX IF NOT EXISTS idx_contract_sys_user ON contract (sys_user_id);
CREATE INDEX IF NOT EXISTS idx_contract_partner ON contract (partner_id);
CREATE INDEX IF NOT EXISTS idx_contract_number ON contract (contract_number);
CREATE INDEX IF NOT EXISTS idx_contract_status ON contract (current_status);
CREATE INDEX IF NOT EXISTS idx_contract_deleted ON contract (deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_contract_owner_id ON contract (owner_id);
CREATE INDEX idx_contract_class_id ON contract (class_id);
CREATE INDEX idx_contract_collector_id ON contract (collector_id);
CREATE INDEX idx_contract_seller_id ON contract (seller_id);
CREATE INDEX idx_contract_region_id ON contract (region_id);
CREATE INDEX idx_contract_status_id ON contract (status_id);
CREATE INDEX idx_contract_indicated_by ON contract (indicated_by);
CREATE INDEX idx_contract_active_contract_id ON contract_active (contract_version_id);
CREATE INDEX idx_contract_addendum_contract_id ON contract_addendum (contract_version_id);
CREATE INDEX idx_contract_addendum_addendum_id ON contract_addendum (addendum_id);
CREATE INDEX idx_contract_addendum_unit_id ON contract_addendum (sys_unit_id);
CREATE INDEX idx_contract_charge_contract_id ON contract_charge (contract_version_id);
CREATE INDEX idx_contract_charge_unit_id ON contract_charge (sys_unit_id);

-- For contract_status_history table
CREATE INDEX idx_contract_status_history_contract_id ON contract_status_history (contract_version_id);
CREATE INDEX idx_contract_status_history_status_possible_id ON contract_status_history (status_possible_id);
CREATE INDEX idx_contract_status_history_status_reason_id ON contract_status_history (status_reason_id);

-- For document table (missing index on document_type_id)
CREATE INDEX idx_document_document_type_id ON document (document_type_id);

-- For service_funeral table
CREATE INDEX idx_service_funeral_deceased_id ON service_funeral (deceased_id);
CREATE INDEX idx_service_funeral_declarant_id ON service_funeral (declarant_id);
CREATE INDEX idx_service_funeral_office_users_id ON service_funeral (office_users_id);
CREATE INDEX idx_service_funeral_performed_service_id ON service_funeral (performed_service_id);
CREATE INDEX idx_service_funeral_death_address_id ON service_funeral (death_address_id);

-- For medical_foward table
CREATE INDEX idx_medical_foward_partner_id ON medical_foward (partner_id);
CREATE INDEX idx_medical_foward_performed_service_id ON medical_foward (performed_service_id);

-- For payment_plan table
CREATE INDEX idx_payment_plan_contract_id ON payment_plan (contract_version_id);

-- For payment_plan_installment table
CREATE INDEX idx_payment_plan_installment_plan_id ON payment_plan_installment (plan_id);
CREATE INDEX idx_payment_plan_installment_charge_id ON payment_plan_installment (charge_id);
CREATE INDEX idx_payment_plan_installment_status ON payment_plan_installment (status);
CREATE INDEX idx_payment_plan_installment_due_date ON payment_plan_installment (due_date);

-- For payment_transaction table
CREATE INDEX idx_payment_transaction_contract_id ON payment_transaction (contract_version_id);
CREATE INDEX idx_payment_transaction_charge_id ON payment_transaction (charge_id);
CREATE INDEX idx_payment_transaction_installment_id ON payment_transaction (installment_id);
CREATE INDEX idx_payment_transaction_payment_date ON payment_transaction (payment_date);

-- For death_event table
CREATE INDEX idx_death_event_beneficiary_id ON death_event (beneficiary_id);
CREATE INDEX idx_death_event_service_funeral_id ON death_event (service_funeral_id);

-- For contract_billing table
CREATE INDEX idx_contract_billing_contract_id ON contract_billing (contract_version_id);
CREATE INDEX idx_contract_billing_charge_id ON contract_billing (charge_id);
CREATE INDEX idx_contract_billing_status ON contract_billing (status);

-- For contract table (common query filters)
CREATE INDEX idx_contract_start_date ON contract (start_date);
CREATE INDEX idx_contract_end_date ON contract (end_date);
CREATE INDEX idx_contract_contract_number ON contract (contract_number);

-- For contract_charge table (common query filters)
CREATE INDEX idx_contract_charge_due_date ON contract_charge (due_date);
CREATE INDEX idx_contract_charge_payment_date ON contract_charge (payment_date);
CREATE INDEX idx_contract_charge_payment_status_id ON contract_charge (payment_status_id);
CREATE INDEX idx_contract_charge_charge_code ON contract_charge (charge_code);

-- For bank_slip table
CREATE INDEX idx_bank_slip_nnumber ON bank_slip (nnumber);
CREATE INDEX idx_bank_slip_status ON bank_slip (status);
CREATE INDEX idx_bank_slip_send_at ON bank_slip (send_at);

-- For batch_detail table
CREATE INDEX idx_batch_detail_process_status ON batch_detail (process_status);
CREATE INDEX idx_batch_detail_full_number ON batch_detail (billing_number);

-- For service_funeral table
CREATE INDEX idx_service_funeral_process_number ON service_funeral (process_number);
CREATE INDEX idx_service_funeral_occurr_at ON service_funeral (occurr_at);
CREATE INDEX idx_service_funeral_death_at ON service_funeral (death_at);
CREATE INDEX idx_service_funeral_burial_date ON service_funeral (burial_date);
CREATE INDEX idx_sys_user_login ON sys_user (login);
CREATE INDEX idx_sys_user_email ON sys_user (email);
CREATE INDEX idx_sys_user_active ON sys_user (active);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at);
CREATE INDEX idx_api_error_timestamp ON api_error (api_timestamp);
CREATE INDEX idx_charge_issue_date ON charge (issue_date);
CREATE INDEX idx_charge_due_date ON charge (due_date);
CREATE INDEX idx_batch_chk_discharge_date ON batch_chk (discharge_date);
CREATE INDEX idx_contract_status_start_date ON contract (status_id, start_date);
CREATE INDEX idx_contract_class_status ON contract (class_id, status_id);
CREATE INDEX idx_contract_charge_contract_status ON contract_charge (contract_version_id, payment_status_id);
CREATE INDEX idx_contract_charge_due_date_status ON contract_charge (due_date, payment_status_id);
CREATE INDEX idx_service_funeral_occurr_category ON service_funeral (occurr_at, category);
CREATE INDEX idx_service_funeral_group_category ON service_funeral (group_batch_id, category);
CREATE INDEX idx_beneficiary_contract_primary ON beneficiary (contract_version_id, is_primary);
CREATE INDEX idx_beneficiary_contract_alive ON beneficiary (contract_version_id, is_alive);
CREATE INDEX idx_payment_plan_installment_plan_status ON payment_plan_installment (plan_id, status);

--  VIEWS --
CREATE VIEW vw_group_billing_status AS
SELECT 
    gb.id,
    gb.name AS group_name,
    gb.current_death_count,
    gb.death_threshold,
    gb.current_death_count >= gb.death_threshold AS ready_for_billing,
    COUNT(c.contract_version_id) AS contract_count,
    SUM(b.is_alives) AS total_beneficiary
FROM 
    group_batch gb
JOIN 
    contract c ON gb.id = c.id
LEFT JOIN (
    SELECT contract_version_id, COUNT(*) AS is_alives 
    FROM beneficiary 
    WHERE is_alive = TRUE OR is_alive IS NULL
    GROUP BY contract_version_id
) b ON c.contract_version_id = b.contract_version_id
GROUP BY gb.id, gb.name, gb.current_death_count, gb.death_threshold;

-- Group death tracking view (ad27s27)
CREATE VIEW vw_group_death_tracking AS
SELECT 
    gb.group_batch_id,
    gb.name AS group_name,
    gb.current_death_count,
    gb.death_threshold,
    gb.current_death_count / gb.death_threshold AS completed_cycles,
    gb.current_death_count % gb.death_count AS remaining_deaths,
    COUNT(DISTINCT c.contract_version_id) AS contracts_affected,
    MIN(de.event_date) AS first_death_date,
    MAX(de.event_date) AS last_death_date
FROM 
    group_batch gb
LEFT JOIN 
    death_event de ON gb.group_batch_id = de.group_batch_id
LEFT JOIN 
    contract c ON gb.group_batch_id = c.group_batch_id
GROUP BY 
    gb.group_batch_id, gb.name, gb.current_death_count, gb.death_threshold;

-- Contract billing history view (ad27s47)
CREATE VIEW vw_contract_billing_history AS
SELECT 
    c.contract_version_id,
    c.contract_number,
    gb.name AS group_name,
    bc.charge_date,
    cb.amount,
    cb.status,
    COUNT(de.death_event_id) AS deaths_covered,
    GROUP_CONCAT(b.name SEPARATOR ', ') AS deceased_beneficiary
FROM 
    contract c
JOIN 
    group_batch gb ON c.group_batch_id = gb.group_batch_id
JOIN 
    contract_billing cb ON c.contract_version_id = cb.contract_version_id
JOIN 
    billing_cycle bc ON cb.cycle_id = bc.cycle_id
LEFT JOIN 
    death_event de ON bc.group_batch_id = de.group_batch_id 
    AND de.event_date <= bc.charge_date
LEFT JOIN 
    beneficiary b ON de.beneficiary_id = b.beneficiary_id
GROUP BY 
    c.contract_version_id, c.contract_number, gb.name, bc.charge_date, cb.amount, cb.status;

-- Automated Process Summary View (ad27t30)
CREATE VIEW vw_audit_automated_processes AS
SELECT 
    process_name,
    name_table,
    process_outcome,
    COUNT(*) AS event_count,
    MIN(created_at) AS first_occurrence,
    MAX(created_at) AS last_occurrence
FROM 
    audit_log
WHERE 
    audit_action = 'AUTO_PROCESS'
GROUP BY 
    process_name, name_table, process_outcome
ORDER BY 
    last_occurrence DESC;
--

-- Failed Processes View (ad27t30)
CREATE VIEW vw_audit_failed_processes AS
SELECT 
    id,
    created_at,
    process_name,
    name_table,
    record_id,
    error_message,
    process_parameters
FROM 
    audit_log
WHERE 
    audit_action = 'AUTO_PROCESS'
    AND process_outcome = 'FAILED'
ORDER BY 
    created_at DESC;
--

-- -- Process Execution Flow View (ad27t30)
 CREATE VIEW vw_audit_process_flow AS
 WITH process_hierarchy AS (
     SELECT 
         id,
         created_at,
         process_name,
         name_table,
         record_id,
         process_outcome,
         LEAD(created_at) OVER (ORDER BY created_at) AS next_process_time
     FROM 
         audit_log
     WHERE 
         audit_action = 'AUTO_PROCESS'
 )
 SELECT 
     ph1.id,
     ph1.created_at,
     ph1.process_name,
     ph1.name_table,
     ph1.record_id,
     ph1.process_outcome,
     ph2.process_name AS next_process,
     ph2.process_outcome AS next_outcome,
     TIMESTAMPDIFF(SECOND, ph1.created_at, ph2.created_at) AS seconds_to_next
 FROM 
     process_hierarchy ph1
 LEFT JOIN 
     process_hierarchy ph2 ON ph1.next_process_time = ph2.created_at
 ORDER BY 
     ph1.created_at DESC;


-- Active Payment Plans (ad27u15)
CREATE VIEW vw_active_payment_plans AS
SELECT 
    pp.plan_id,
    pp.plan_name,
    c.contract_number,
    pp.total_amount,
    pp.start_date,
    pp.end_date,
    COUNT(pi.installment_id) AS total_installments,
    SUM(pi.amount) AS pi_total_amount,
    SUM(CASE WHEN pi.status = 'PAID' THEN pi.amount ELSE 0 END) AS paid_amount,
    SUM(CASE WHEN pi.status IN ('PENDING', 'PARTIAL') THEN pi.amount ELSE 0 END) AS pending_amount,
    MIN(CASE WHEN pi.status IN ('PENDING', 'PARTIAL') THEN pi.due_date ELSE NULL END) AS next_due_date
FROM 
    payment_plan pp
JOIN 
    contract c ON pp.contract_version_id = c.contract_version_id
LEFT JOIN 
    payment_plan_installment pi ON pp.plan_id = pi.plan_id
WHERE 
    pp.status = 'ACTIVE'
GROUP BY 
    pp.plan_id, pp.plan_name, c.contract_number, pp.total_amount, pp.start_date, pp.end_date;
--

-- Installment Payment Status (ad27u15)
CREATE VIEW vw_installment_payment_status AS
SELECT 
    pi.installment_id,
    pp.plan_id,
    pp.plan_name,
    c.contract_number,
    pi.due_date,
    pi.amount AS full_amount,
    pi.paid_amount,
    pi.amount - pi.paid_amount AS remaining_amount,
    pi.status,
    pi.paid_date,
    (SELECT COUNT(*) FROM payment_transaction pt WHERE pt.installment_id = pi.installment_id) AS payment_count
FROM 
    payment_plan_installment pi
JOIN 
    payment_plan pp ON pi.plan_id = pp.plan_id
JOIN 
    contract c ON pp.contract_version_id = c.contract_version_id;
--

-- Payment Transaction History (ad27u15)
CREATE VIEW vw_payment_transaction_history AS
SELECT 
    pt.transaction_id,
    pt.payment_date,
    c.contract_number,
    pt.amount,
    pt.payment_method,
    pt.reference_number,
    pt.status,
    pp.plan_name,
    pi.due_date AS installment_due_date,
    CONCAT('Installment ', ROW_NUMBER() OVER (PARTITION BY pi.plan_id ORDER BY pi.due_date)) AS installment_number,
    pt.notes,
    su.name AS received_by
FROM 
    payment_transaction pt
JOIN 
    contract c ON pt.contract_version_id = c.contract_version_id
LEFT JOIN 
    payment_plan_installment pi ON pt.installment_id = pi.installment_id
LEFT JOIN 
    payment_plan pp ON pi.plan_id = pp.plan_id
LEFT JOIN 
    sys_user su ON pt.created_by = su.sys_user_id
ORDER BY 
    pt.payment_date DESC;
--
-- Views for Common Queries
CREATE VIEW vw_active_contracts AS
SELECT c.contract_version_id, c.contract_number, c.start_date, c.end_date,
       COUNT(b.beneficiary_id) AS beneficiary_count
FROM contract c
LEFT JOIN beneficiary b ON c.contract_version_id = b.contract_version_id
WHERE c.end_date IS NULL OR c.end_date > CURDATE()
GROUP BY c.contract_version_id;

CREATE VIEW vw_unpaid_charges AS
SELECT cc.contract_charge_id, c.contract_number, 
       cc.due_date, cc.amount, cc.amount - COALESCE(cc.amount_pago, 0) AS balance
FROM contract_charge cc
JOIN contract c ON cc.contract_version_id = c.contract_version_id
WHERE cc.payment_status_id IN (
    SELECT payment_status_id FROM payment_status WHERE code IN ('PEND', 'PART')
);

-- Initial Setup for audit log (ad27t30)
-- Create an index for faster audit queries
CREATE INDEX idx_audit_auto_process ON audit_log(audit_action, process_name, created_at);

-- Create a system user for automated processes
INSERT INTO sys_user (sys_user_id, name, login, password_salt, email, active) VALUES (1, 'System Automation', 'system', '', 'system@presserv.com.br', 'Y');
INSERT INTO sys_user (sys_user_id, name, login, password_salt, email, active) VALUES (2, 'System Presserv', 'system', '', 'suporte@presserv.com.br', 'Y');
--

-- PROCEDURES --

DELIMITER //

CREATE PROCEDURE register_death_event(
    IN p_beneficiary_id INT UNSIGNED,
    IN p_service_funeral_id INT UNSIGNED
)
BEGIN
    DECLARE v_group_batch_id INT UNSIGNED;
    DECLARE v_current_count INT UNSIGNED;
    DECLARE v_threshold INT UNSIGNED DEFAULT 10;
    
    -- Get the group for this beneficiary's contract
    SELECT c.group_batch_id INTO v_group_batch_id
    FROM beneficiary b
    JOIN contract c ON b.contract_version_id = c.contract_version_id
    WHERE b.beneficiary_id = p_beneficiary_id
    LIMIT 1;
    
    -- Record the death event
    INSERT INTO death_event (group_batch_id, beneficiary_id, service_funeral_id)
    VALUES (v_group_batch_id, p_beneficiary_id, p_service_funeral_id);
    
    -- Update group death count
    UPDATE group_batch
    SET current_death_count = current_death_count + 1
    WHERE group_batch_id = v_group_batch_id;
    
    -- Get updated counts
    SELECT current_death_count, death_threshold 
    INTO v_current_count, v_threshold
    FROM group_batch
    WHERE group_batch_id = v_group_batch_id
    LIMIT 1;
    
    -- Check if threshold reached
    IF v_current_count >= v_threshold THEN
        CALL trigger_group_billing(v_group_batch_id, v_current_count);
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE trigger_group_billing(
    IN p_group_batch_id INT,
    IN p_death_count INT
)
BEGIN
    DECLARE v_cycle_id INT;
    DECLARE v_rate_per_death DECIMAL(19,4);
    DECLARE v_total_amount DECIMAL(19,4);
    
    -- Get the current rate (would come from business rules)
    SELECT value_per_death INTO v_rate_per_death 
    FROM billing_rates 
    WHERE rate_type = 'FUNERAL'
    LIMIT 1;
    
    -- Calculate total amount per contract
    SET v_total_amount = p_death_count * v_rate_per_death;
    
    -- Create a new billing cycle
    INSERT INTO billing_cycle (group_batch_id, death_event_count, charge_date, amount_per_contract)
    VALUES (p_group_batch_id, p_death_count, CURRENT_TIMESTAMP, v_total_amount);
    
    SET v_cycle_id = LAST_INSERT_ID();
    
    -- Create billing records for all contracts in the group
    INSERT INTO contract_billing (cycle_id, contract_version_id, amount)
    SELECT v_cycle_id, contract_version_id, v_total_amount
    FROM contract
    WHERE group_batch_id = p_group_batch_id;
    
    -- Mark death events as processed
    UPDATE death_event
    SET processed_for_billing = TRUE
    WHERE group_batch_id = p_group_batch_id AND processed_for_billing = FALSE;
    
    -- Reset group death counter
    UPDATE group_batch
    SET current_death_count = 0,
        last_death_charge_date = CURRENT_TIMESTAMP
    WHERE group_batch_id = p_group_batch_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE create_contract_charges(
    IN p_charge_id INT,
    IN p_group_batch_id INT,
    IN p_total_value DECIMAL(19,4)  -- Missing closing parenthesis was here
)
BEGIN
    DECLARE v_contract_count INT;
    DECLARE v_individual_charge DECIMAL(19,4);
    
    -- Count active contracts in group
    SELECT COUNT(*) INTO v_contract_count
    FROM contract c
    JOIN contract_status cs ON c.status_id = cs.status_id
    WHERE c.group_batch_id = p_group_batch_id
    AND cs.generate_charge = TRUE;
    
    -- Calculate individual charge amount
    IF v_contract_count = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No active contracts found for group batch';
    ELSE
        SET v_individual_charge = ROUND(p_total_value / v_contract_count, 2);
        
        -- Create contract charge records
        INSERT INTO contract_charge (
            contract_version_id, unit_id, payment_status_id,
            charge_code, due_date, amount
        )
        SELECT 
            c.contract_version_id, 
            c.sys_unit_id, 
            1, -- PENDING payment status
            CONCAT('GRP', p_charge_id),
            DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
            v_individual_charge
        FROM 
            contract c
        JOIN 
            contract_status cs ON c.status_id = cs.status_id
        WHERE 
            c.group_batch_id = p_group_batch_id
            AND cs.generate_charge = TRUE;
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE create_group_charge(
    IN p_group_batch_id INT,
    IN p_death_count INT,
    OUT p_charge_id INT
)
BEGIN
    DECLARE v_charge_number VARCHAR(7);
    DECLARE v_month_ref VARCHAR(100);
    DECLARE v_total_value DECIMAL(19,4);
    DECLARE v_rate_per_death DECIMAL(19,4) DEFAULT 50.00;
    
    -- Calculate total charge amount
    SET v_total_value = p_death_count * v_rate_per_death;
    
    -- Generate a charge number (using auto-increment or alternative method)
    -- Note: MySQL doesn't have a direct NEXT_VAL function like some other databases
    -- This assumes you have a sequence table or alternative method
    SET v_charge_number = CONCAT('CH', LPAD(
        (SELECT IFNULL(MAX(SUBSTRING(charge_number, 3)), 0) + 1 FROM charge), 
        5, '0'
    ));
    
    -- Set month reference
    SET v_month_ref = DATE_FORMAT(CURRENT_DATE, '%Y-%m');
    
    -- Create the charge record
    INSERT INTO charge (
        sys_unit_id, sys_user_id, group_batch_id,
        charge_number, month_ref, amount, status
    ) VALUES (
        1, 1, p_group_batch_id,
        v_charge_number, v_month_ref, v_total_value, 'PENDING'
    );
    
    SET p_charge_id = LAST_INSERT_ID();
    
    -- Link funeral services to this charge
    INSERT INTO prorated_service (
        charge_id, service_funeral_id, sys_unit_id, sys_user_id
    )
    SELECT 
        p_charge_id, sf.service_funeral_id, 1, 1
    FROM 
        service_funeral sf
    WHERE 
        sf.group_batch_id = p_group_batch_id
        AND NOT EXISTS (
            SELECT 1 FROM prorated_service ps 
            WHERE ps.service_funeral_id = sf.service_funeral_id
        );
    
    -- Create contract charges for all contracts in the group
    CALL create_contract_charges(p_charge_id, p_group_batch_id, v_total_value);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE log_automated_process(
    IN p_process_name VARCHAR(100),
    IN p_process_parameters TEXT,
    IN p_name_table VARCHAR(100),
    IN p_record_id INT,
    IN p_process_outcome VARCHAR(50),
    IN p_error_message TEXT
)
BEGIN
    INSERT INTO audit_log (
        user_id, action, name_table, record_id,
        process_name, process_parameters, process_outcome, error_message,
        ip_address, created_at
    ) VALUES (
        0, -- System user ID
        'AUTO_PROCESS',
        p_name_table,
        p_record_id,
        p_process_name,
        p_process_parameters,
        p_process_outcome,
        p_error_message,
        '0.0.0.0',
        CURRENT_TIMESTAMP
    );
END //

DELIMITER ;

DELIMITER //

CREATE FUNCTION create_payment_plan(
    p_contract_version_id INT,
    p_plan_name VARCHAR(100),
    p_total_amount DECIMAL(19,4),
    p_start_date DATE,
    p_installment_count INT,
    p_frequency VARCHAR(20),
    p_user_id INT
) RETURNS INT
BEGIN
    DECLARE v_plan_id INT;
    DECLARE v_installment_amount DECIMAL(19,4);
    DECLARE v_due_date DATE;
    DECLARE v_i INT DEFAULT 1;
    
    -- Calculate installment amount
    SET v_installment_amount = ROUND(p_total_amount / p_installment_count, 2);
    
    -- Create the payment plan
    INSERT INTO payment_plan (
        contract_version_id, plan_name, total_amount, start_date, created_by
    ) VALUES (
        p_contract_version_id, p_plan_name, p_total_amount, p_start_date, p_user_id
    );
    
    SET v_plan_id = LAST_INSERT_ID();
    
    -- Generate installments
    SET v_due_date = p_start_date;
    
    WHILE v_i <= p_installment_count DO
        -- Add installment
        INSERT INTO payment_plan_installment (
            plan_id, due_date, amount
        ) VALUES (
            v_plan_id, v_due_date, v_installment_amount
        );
        
        -- Calculate next due date based on frequency
        CASE p_frequency
            WHEN 'WEEKLY' THEN SET v_due_date = DATE_ADD(v_due_date, INTERVAL 1 WEEK);
            WHEN 'BIWEEKLY' THEN SET v_due_date = DATE_ADD(v_due_date, INTERVAL 2 WEEK);
            ELSE SET v_due_date = DATE_ADD(v_due_date, INTERVAL 1 MONTH);
        END CASE;
        
        SET v_i = v_i + 1;
    END WHILE;
    
    RETURN v_plan_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_charge_status(IN p_charge_id INT)
BEGIN
    DECLARE v_total_amount DECIMAL(19,4);
    DECLARE v_paid_amount DECIMAL(19,4);
    DECLARE v_new_status VARCHAR(20);
    DECLARE v_paid_status_id INT;
    DECLARE v_partial_status_id INT;
    
    -- Get status IDs first
    SELECT payment_status_id INTO v_paid_status_id 
    FROM payment_status WHERE name = 'Paid' LIMIT 1;
    
    SELECT payment_status_id INTO v_partial_status_id 
    FROM payment_status WHERE name = 'Partial' LIMIT 1;
    
    -- Get total and paid amounts
    SELECT amount INTO v_total_amount
    FROM contract_charge
    WHERE contract_charge_id = p_charge_id;
    
    SELECT COALESCE(SUM(amount), 0) INTO v_paid_amount
    FROM payment_transaction
    WHERE charge_id = p_charge_id;
    
    -- Determine new status
    IF v_paid_amount >= v_total_amount THEN
        SET v_new_status = 'PAID';
    ELSEIF v_paid_amount > 0 THEN
        SET v_new_status = 'PARTIAL';
    ELSE
        SET v_new_status = 'PENDING';
    END IF;
    
    -- Update charge status
    UPDATE contract_charge
    SET 
        amount_paid = v_paid_amount,
        payment_status_id = CASE 
            WHEN v_new_status = 'PAID' THEN v_paid_status_id
            WHEN v_new_status = 'PARTIAL' THEN v_partial_status_id
            ELSE payment_status_id
        END
    WHERE contract_charge_id = p_charge_id;
END //

DELIMITER ;


DELIMITER //

CREATE FUNCTION convert_charge_to_payment_plan(
    p_charge_id INT,
    p_installment_count INT,
    p_start_date DATE,
    p_frequency VARCHAR(20),
    p_user_id INT
) RETURNS INT
BEGIN
    DECLARE v_plan_id INT;
    DECLARE v_contract_version_id INT;
    DECLARE v_total_amount DECIMAL(19,4);
    DECLARE v_plan_name VARCHAR(100);
    DECLARE v_charge_code VARCHAR(50);
    DECLARE v_payment_plan_status_id INT;
    
    -- Get charge details
    SELECT contract_version_id, amount, charge_code 
    INTO v_contract_version_id, v_total_amount, v_charge_code
    FROM contract_charge
    WHERE contract_charge_id = p_charge_id;
    
    -- Create plan name
    SET v_plan_name = CONCAT('Payment Plan for Charge ', v_charge_code);
    
    -- Get payment plan status ID
    SELECT payment_status_id INTO v_payment_plan_status_id
    FROM payment_status 
    WHERE name = 'Payment Plan' LIMIT 1;
    
    -- Create the payment plan
    SELECT create_payment_plan(
        v_contract_version_id,
        v_plan_name,
        v_total_amount,
        p_start_date,
        p_installment_count,
        p_frequency,
        p_user_id
    ) INTO v_plan_id;
    
    -- Link installments to the charge
    UPDATE payment_plan_installment
    SET charge_id = p_charge_id
    WHERE plan_id = v_plan_id;
    
    -- Update charge status
    UPDATE contract_charge
    SET payment_status_id = v_payment_plan_status_id
    WHERE contract_charge_id = p_charge_id;
    
    RETURN v_plan_id;
END //

DELIMITER ;

INSERT INTO document_type (document_type_id,description,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (1,'CPF',null,null,null,null,null,null); 
INSERT INTO document_type (document_type_id,description,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (2,'RG',null,null,null,null,null,null); 
INSERT INTO document_type (document_type_id,description,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (3,'CNH',null,null,null,null,null,null); 
INSERT INTO gender (gender_id,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by,name) VALUES (1,null,null,null,null,null,null,'Masculino'); 
INSERT INTO gender (gender_id,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by,name) VALUES (2,null,null,null,null,null,null,'Feminino'); 
INSERT INTO subsidiary (subsidiary_id,name,code,status,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (1,'Matriz','BPL','1','CURRENT_TIMESTAMP','NULL ON UPDATE CURRENT_TIMESTAMP','NULL',1,1,null); 
INSERT INTO subsidiary (subsidiary_id,name,code,status,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (2,'Poços','POC','1','CURRENT_TIMESTAMP','NULL ON UPDATE CURRENT_TIMESTAMP','NULL',1,1,null); 
INSERT INTO sys_group (sys_group_id,name,uuid) VALUES (1,'Admin',null); 
INSERT INTO sys_group (sys_group_id,name,uuid) VALUES (2,'Standard',null); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (1,'System Group Form','SystemGroupForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (2,'System Group List','SystemGroupList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (3,'System Program Form','SystemProgramForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (4,'System Program List','SystemProgramList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (5,'System User Form','SystemUserForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (6,'System User List','SystemUserList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (7,'Common Page','CommonPage',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (8,'System PHP Info','SystemPHPInfoView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (9,'System ChangeLog View','SystemChangeLogView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (10,'Welcome View','WelcomeView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (11,'System Sql Log','SystemSqlLogList',''); INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (12,'System Profile View','SystemProfileView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (13,'System Profile Form','SystemProfileForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (14,'System SQL Panel','SystemSQLPanel',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (15,'System Access Log','SystemAccessLogList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (16,'System Message Form','SystemMessageForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (17,'System Message List','SystemMessageList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (18,'System Message Form View','SystemMessageFormView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (19,'System Notification List','SystemNotificationList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (20,'System Notification Form View','SystemNotificationFormView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (21,'System Document Category List','SystemDocumentCategoryFormList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (22,'System Document Form','SystemDocumentForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (23,'System Document Upload Form','SystemDocumentUploadForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (24,'System Document List','SystemDocumentList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (25,'System Shared Document List','SystemSharedDocumentList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (26,'System Unit Form','SystemUnitForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (27,'System Unit List','SystemUnitList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (28,'System Access stats','SystemAccessLogStats',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (29,'System Preference form','SystemPreferenceForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (30,'System Support form','SystemSupportForm',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (31,'System PHP Error','SystemPHPErrorLogView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (32,'System Database Browser','SystemDatabaseExplorer',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (33,'System Table List','SystemTableList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (34,'System Data Browser','SystemDataBrowser',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (35,'System Menu Editor','SystemMenuEditor',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (36,'System Request Log','SystemRequestLogList',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (37,'System Request Log View','SystemRequestLogView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (38,'System Administration Dashboard','SystemAdministrationDashboard',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (39,'System Log Dashboard','SystemLogDashboard',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (40,'System Session dump','SystemSessionDumpView',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (41,'Files diff','SystemFilesDiff',''); 
INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (42,'System Information','SystemInformationView',''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (1,1,1,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (2,1,2,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (3,1,3,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (4,1,4,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (5,1,5,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (6,1,6,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (7,1,8,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (8,1,9,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (9,1,11,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (10,1,14,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (11,1,15,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (12,2,10,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (13,2,12,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (14,2,13,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (15,2,16,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (16,2,17,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (17,2,18,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (18,2,19,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (19,2,20,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (20,1,21,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (21,2,22,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (22,2,23,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (23,2,24,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (24,2,25,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (25,1,26,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (26,1,27,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (27,1,28,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (28,1,29,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (29,2,30,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (30,1,31,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (31,1,32,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (32,1,33,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (33,1,34,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (34,1,35,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (35,1,36,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (36,1,37,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (37,1,38,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (38,1,39,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (39,1,40,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (40,1,41,''); 
INSERT INTO sys_group_program (s_g_program_id,sys_group_id,sys_program_id,actions) VALUES (41,1,42,''); 
INSERT INTO sys_unit (sys_unit_id,subsidiary_id,general_status_id,name,connection_name,code) VALUES (1,1,null,'Matriz','matriz','BPL'); 
INSERT INTO sys_user_group (s_user_group_id,sys_user_id,sys_group_id) VALUES (1,1,1); 
INSERT INTO sys_user_group (s_user_group_id,sys_user_id,sys_group_id) VALUES (2,2,2); 
INSERT INTO sys_user_group (s_user_group_id,sys_user_id,sys_group_id) VALUES (3,1,2); 
INSERT INTO sys_user_program (s_user_program_id,sys_user_id,sys_program_id) VALUES (1,2,7); 
INSERT INTO sys_user_unit (s_user_unit_id,sys_user_id,sys_unit_id) VALUES (1,1,1); 


-- Modify the register_service_funeral function to include auditing (ad27t30)
DELIMITER //

CREATE FUNCTION register_service_funeral(
    p_performed_service_id INT,
    p_deceased_id INT,
    p_process_number VARCHAR(25),
    p_occurr_at DATE,
    p_contract_number VARCHAR(25)
) RETURNS INT
BEGIN
    DECLARE v_service_id INT;
    DECLARE v_group_batch_id INT;
    DECLARE v_death_count INT;
    DECLARE v_threshold INT DEFAULT 10;
    
    SELECT c.group_batch_id INTO v_group_batch_id
    FROM contract c
    WHERE c.contract_number = p_contract_number;
    
    INSERT INTO service_funeral (
        sys_unit_id, sys_user_id, performed_service_id,
        deceased_id, process_number, occurr_at, contract, group_batch_id
    ) VALUES (
        1, 1, p_performed_service_id,
        p_deceased_id, p_process_number, p_occurr_at, p_contract_number, v_group_batch_id
    );
    
    SET v_service_id = LAST_INSERT_ID();
    
    SELECT COUNT(*) INTO v_death_count
    FROM service_funeral
    WHERE group_batch_id = v_group_batch_id;
    
    IF v_death_count >= v_threshold THEN
        CALL create_group_charge(v_group_batch_id, v_death_count);
    END IF;
    
    RETURN v_service_id;
END // 

DELIMITER //

CREATE FUNCTION record_payment(
    p_contract_version_id INT,
    p_amount DECIMAL(19,4),
    p_payment_date DATE,
    p_payment_method VARCHAR(50),
    p_reference_number VARCHAR(100),
    p_notes TEXT,
    p_user_id INT,
    p_charge_id INT,
    p_installment_id INT
) RETURNS INT
BEGIN
    DECLARE v_transaction_id INT;
    DECLARE v_remaining_amount DECIMAL(19,4) DEFAULT p_amount;
    DECLARE v_installment_id INT;
    DECLARE v_installment_amount DECIMAL(19,4);
    DECLARE v_paid_amount DECIMAL(19,4);
    DECLARE v_apply_amount DECIMAL(19,4);
    DECLARE done INT DEFAULT FALSE;
    
    -- Create the payment transaction
    INSERT INTO payment_transaction (
        contract_version_id, charge_id, installment_id,
        amount, payment_date, payment_method,
        reference_number, notes, created_by
    ) VALUES (
        p_contract_version_id, p_charge_id, p_installment_id,
        p_amount, p_payment_date, p_payment_method,
        p_reference_number, p_notes, p_user_id
    );
    
    SET v_transaction_id = LAST_INSERT_ID();
    
    -- If linked to a specific installment, update it
    IF p_installment_id IS NOT NULL THEN
        SELECT amount, COALESCE(paid_amount, 0) INTO v_installment_amount, v_paid_amount
        FROM payment_plan_installment
        WHERE installment_id = p_installment_id;
        
        SET v_apply_amount = LEAST(p_amount, v_installment_amount - v_paid_amount);
        
        UPDATE payment_plan_installment
        SET 
            paid_amount = v_paid_amount + v_apply_amount,
            paid_date = IF(v_paid_amount + v_apply_amount >= v_installment_amount, p_payment_date, paid_date),
            status = CASE 
                WHEN v_paid_amount + v_apply_amount >= v_installment_amount THEN 'PAID'
                WHEN v_paid_amount + v_apply_amount > 0 THEN 'PARTIAL'
                ELSE status
            END
        WHERE installment_id = p_installment_id;
    END IF;
    
    -- If no specific installment, apply to oldest unpaid installments
    IF p_installment_id IS NULL AND p_charge_id IS NULL THEN
        BEGIN
            DECLARE cur CURSOR FOR 
                SELECT installment_id, amount, COALESCE(paid_amount, 0)
                FROM payment_plan_installment
                WHERE plan_id IN (SELECT plan_id FROM payment_plan WHERE contract_version_id = p_contract_version_id)
                AND (status <> 'PAID' OR status IS NULL)
                ORDER BY due_date;
                
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
            
            OPEN cur;
            read_loop: LOOP
                FETCH cur INTO v_installment_id, v_installment_amount, v_paid_amount;
                IF done OR v_remaining_amount <= 0 THEN
                    LEAVE read_loop;
                END IF;
                
                SET v_apply_amount = LEAST(v_remaining_amount, v_installment_amount - v_paid_amount);
                
                UPDATE payment_plan_installment
                SET 
                    paid_amount = v_paid_amount + v_apply_amount,
                    paid_date = IF(v_paid_amount + v_apply_amount >= v_installment_amount, p_payment_date, paid_date),
                    status = CASE 
                        WHEN v_paid_amount + v_apply_amount >= v_installment_amount THEN 'PAID'
                        WHEN v_paid_amount + v_apply_amount > 0 THEN 'PARTIAL'
                        ELSE status
                    END
                WHERE installment_id = v_installment_id;
                
                SET v_remaining_amount = v_remaining_amount - v_apply_amount;
            END LOOP;
            CLOSE cur;
        END;
    END IF;
    
    -- Update contract charge status if specified
    IF p_charge_id IS NOT NULL THEN
        CALL update_charge_status(p_charge_id);
    END IF;
    
    RETURN v_transaction_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE apply_partial_payment_to_contract(
    IN p_contract_version_id INT,
    IN p_amount DECIMAL(19,4),
    IN p_payment_date DATE,
    IN p_payment_method VARCHAR(50),
    IN p_reference_number VARCHAR(100),
    IN p_notes TEXT,
    IN p_user_id INT,
    OUT p_transaction_ids TEXT
)
BEGIN
    DECLARE v_remaining_amount DECIMAL(19,4) DEFAULT p_amount;
    DECLARE v_charge_id INT;
    DECLARE v_charge_amount DECIMAL(19,4);
    DECLARE v_paid_amount DECIMAL(19,4);
    DECLARE v_apply_amount DECIMAL(19,4);
    DECLARE v_transaction_id INT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Initialize transaction IDs as comma-separated string
    SET p_transaction_ids = '';
    
    -- Cursor for unpaid charges
    BEGIN
        DECLARE charge_cursor CURSOR FOR 
            SELECT contract_charge_id, amount 
            FROM contract_charge
            WHERE contract_version_id = p_contract_version_id
            AND payment_status_id IN (
                SELECT payment_status_id FROM payment_status WHERE name IN ('Pending', 'Partial')
            )
            ORDER BY due_date;
        
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
        
        OPEN charge_cursor;
        
        charge_loop: LOOP
            FETCH charge_cursor INTO v_charge_id, v_charge_amount;
            IF done OR v_remaining_amount <= 0 THEN
                LEAVE charge_loop;
            END IF;
            
            -- Get already paid amount
            SELECT COALESCE(SUM(amount), 0) INTO v_paid_amount
            FROM payment_transaction
            WHERE charge_id = v_charge_id;
            
            -- Calculate remaining amount for this charge
            SET v_apply_amount = LEAST(v_remaining_amount, v_charge_amount - v_paid_amount);
            
            -- Record payment
            SET v_transaction_id = record_payment(
                p_contract_version_id,
                v_apply_amount,
                p_payment_date,
                p_payment_method,
                p_reference_number,
                p_notes,
                p_user_id,
                v_charge_id,
                NULL -- No specific installment
            );
            
            -- Add to results
            IF p_transaction_ids = '' THEN
                SET p_transaction_ids = CAST(v_transaction_id AS CHAR);
            ELSE
                SET p_transaction_ids = CONCAT(p_transaction_ids, ',', v_transaction_id);
            END IF;
            
            SET v_remaining_amount = v_remaining_amount - v_apply_amount;
        END LOOP;
        
        CLOSE charge_cursor;
    END;
    
    -- If any amount remains, create a credit transaction
    IF v_remaining_amount > 0 THEN
        SET v_transaction_id = record_payment(
            p_contract_version_id,
            v_remaining_amount,
            p_payment_date,
            p_payment_method,
            p_reference_number,
            'Credit balance from partial payment',
            p_user_id,
            NULL, -- No specific charge
            NULL  -- No specific installment
        );
        
        -- Add to results
        IF p_transaction_ids = '' THEN
            SET p_transaction_ids = CAST(v_transaction_id AS CHAR);
        ELSE
            SET p_transaction_ids = CONCAT(p_transaction_ids, ',', v_transaction_id);
        END IF;
    END IF;
END //

DELIMITER ;



-- estas duas linhas estao apresentando incompatibilidade e eu nao consegui resolver.
-- ALTER TABLE account ADD  CONSTRAINT fk_account_currency FOREIGN KEY (currency) REFERENCES currency(currency_code) ;
-- ALTER TABLE account_type ADD CONSTRAINT fk_account_type_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE;
-- Tabela CEP_CACHE talvez desnecessaria 
-- ALTER TABLE cep_cache ADD CONSTRAINT fk_cep_cache_cidade FOREIGN KEY (cidade_id) REFERENCES cidade(id); 
-- ALTER TABLE cep_cache ADD CONSTRAINT fk_cep_cache_estado FOREIGN KEY (estado_id) REFERENCES estado(id); 

-- Create sequence for charge numbers if needed
--  ERRO nesta linha 
--CREATE SEQUENCE charge_seq START WITH 1;

