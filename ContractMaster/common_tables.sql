-- Documentação do usuários (titulares, credenciados e colaboradores)
CREATE TABLE document( 
      document_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (document_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user (sys_user_id)  ,
    FOREIGN KEY (document_type_id) REFERENCES document_type (document_type_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE entity_document (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('client', 'partner') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  document_id INT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (document_id) REFERENCES document(document_id)
);
-- para usar DOCUMENTOS:
-- INSERT INTO partner (name) VALUES ('Empresa Parceira');
-- SET @partner_id = LAST_INSERT_ID();
-- INSERT INTO document (type, document_type, number)
-- VALUES ('CNPJ', 'juridica', '12.345.678/0001-99');
-- SET @document_id = LAST_INSERT_ID();
-- INSERT INTO entity_document (entity_type, entity_id, document_id, is_active)
-- VALUES ('partner', @partner_id, @document_id, TRUE);

-- Todos os endereço de todos os usuários (sys_user) antigo ecob
CREATE TABLE address( 
      address_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (address_id) ,    
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (address_type_id) REFERENCES address_type(address_type_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE entity_address (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('client', 'partner') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  address_id INT UNSIGNED NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (address_id) REFERENCES address(address_id)
);
-- para usar ENDERECO:  
-- INSERT INTO client (name) VALUES ('João Cliente');
-- SET @client_id = LAST_INSERT_ID();
-- INSERT INTO address (type, name, full_address)
-- VALUES ('residencial', 'casa do João', 'Rua A, 123 - Bairro B');
-- SET @address_id = LAST_INSERT_ID();
-- INSERT INTO entity_address (entity_type, entity_id, address_id, is_primary)
-- VALUES ('client', @client_id, @address_id, TRUE);


-- Empresa subsidiaria, segundo nível na hierarquia (matriz, subsidiaria, filiais)
CREATE TABLE subsidiary( 
      subsidiary_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      code varchar  (20)    NOT NULL , 
      status varchar  (50)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (subsidiary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

--  tipos de endereços (Principal, trabalho, cobrança,...)
CREATE TABLE address_type( 
      address_type_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 			-- Residencia, trabalho, cobranca,...
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      column_9 INT   , 
 PRIMARY KEY (address_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- city table
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

-- uf
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

-- cache de zip code
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

-- tipos possívels de documentos (cpf, Rg, cnh, ra,...)
CREATE TABLE document_type( 
      document_type_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      description varchar  (100)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
 PRIMARY KEY (document_type_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- Masculino, Feminino, Ignorado (em caso de falecido mutilado)
CREATE TABLE gender( 
      gender_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
 PRIMARY KEY (gender_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

--  erros de retorno da api
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

--  arquivo de log
CREATE TABLE audit_log( 
      id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_user_id INT UNSIGNED   , 
      audit_action varchar  (50)    NOT NULL , 
      name_table varchar  (100)    NOT NULL , 
      record_id INT    NOT NULL , 
      old_values text   , 
      new_values text   , 
      ip_address varchar  (45)   , 
-- (ad27t30)
      process_name VARCHAR(100) ,
      process_parameters TEXT ,
      process_outcome VARCHAR(50) ,
      error_message TEXT ,
--
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
 PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE schema_version (
    version_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

INSERT INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial contracts management system schema');

-- =========================================================================
-- USERS AND ACCESS CONTROL
-- ========================================================================
CREATE TABLE sys_group( 
      sys_group_id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      name text    NOT NULL , 
      uuid varchar  (36)   , 
 PRIMARY KEY (sys_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_group_program( 
      s_g_program_id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      sys_group_id INT  UNSIGNED  NOT NULL , 
      sys_program_id INT  UNSIGNED   NOT NULL , 
      actions text   , 
 PRIMARY KEY (s_g_program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_preference( 
      s_preference_id varchar  (200)    NOT NULL , 
      preference text   , 
 PRIMARY KEY (s_preference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_program( 
      s_program_id INT UNSIGNED AUTO_INCREMENT   NOT NULL , 
      name text    NOT NULL , 
      controller text    NOT NULL , 
      actions text   , 
 PRIMARY KEY (s_program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- Filiais
CREATE TABLE sys_unit( 
      sys_unit_id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      subsidiary_id INT UNSIGNED   NOT NULL , 
      general_status_id INT UNSIGNED   , 
      name text    NOT NULL , 
      connection_name text   , 
      code varchar  (20)    NOT NULL , 
    PRIMARY KEY (sys_unit_id) , 
    FOREIGN KEY (general_status_id) REFERENCES general_status(general_status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_user_group( 
      s_user_group_id INT UNSIGNED    NOT NULL , 
      sys_user_id INT UNSIGNED    NOT NULL , 
      sys_group_id INT  UNSIGNED   NOT NULL , 
 PRIMARY KEY (s_user_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE sys_user_program( 
      s_user_program_id INT  UNSIGNED AUTO_INCREMENT  NOT NULL , 
      sys_user_id INT  UNSIGNED   NOT NULL , 
      sys_program_id INT  UNSIGNED   NOT NULL , 
 PRIMARY KEY (s_user_program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- Usuarios do sistema, todos (clientes, funcionarios, colaboradores, parceiros,...) exceto os beneficiarios do contrato
CREATE TABLE sys_user( 
    sys_user_id INT UNSIGNED AUTO_INCREMENT,
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
    PRIMARY KEY (sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_user_id ON sys_user (sys_user_id);
CREATE INDEX idx_user_email ON sys_user (email);
CREATE INDEX idx_user_username ON sys_user (name);

CREATE TABLE sys_user_unit( 
      s_user_unit_id INT UNSIGNED AUTO_INCREMENT   NOT NULL , 
      sys_user_id INT UNSIGNED    NOT NULL , 
      sys_unit_id INT UNSIGNED    NOT NULL , 
 PRIMARY KEY (s_user_unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE user_company_access (
    sys_user_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    company_id INT UNSIGNED NOT NULL,
    can_view TINYINT(1) DEFAULT 1,
    can_edit TINYINT(1) DEFAULT 0,
    can_approve TINYINT(1) DEFAULT 0,
    can_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (sys_user_id, company_id),
    CONSTRAINT fk_user_access_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_access_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE entity_sys_user (
  entity_user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('client', 'partner') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  sys_user_id INT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id)
);
-- para usar SYS_USER:
-- INSERT INTO partner (name) VALUES ('Empresa Parceira');
-- SET @partner_id = LAST_INSERT_ID();
-- INSERT INTO sys_user (name, login, email)
-- VALUES ('Usuario Nome ', 'NameUser', 'nameuser@gmail.com');
-- SET @sys_user_id = LAST_INSERT_ID();
-- INSERT INTO entity_sys_user (entity_type, entity_id, document_id, is_active)
-- VALUES ('partner', @partner_id, @sys_user_id, TRUE);


--
-- =========================================================================
-- CONTACTS (VENDORS, COLLECTORS, EMPLOYEE, ACCREDITED AND CUSTOMERS  
-- =========================================================================
CREATE TABLE partner_type (
    partner_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNSIGNED  NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    UNIQUE (company_id, type_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_partner_type_company ON partner_type (company_id);

CREATE TABLE partner (
    partner_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNSIGNED NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    sys_unit_id INT UNSIGNED    NOT NULL , 
    sys_user_id INT UNSIGNED    NOT NULL , 
    partner_code VARCHAR(30) NOT NULL,
    partner_name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(150),
    tax_id VARCHAR(30),
    partner_type_id INT UNSIGNED  NOT NULL REFERENCES partner_type(partner_type_id),
    is_customer BOOLEAN DEFAULT FALSE,
    is_vendor BOOLEAN DEFAULT FALSE,
    is_collector BOOLEAN DEFAULT FALSE,
    is_employee BOOLEAN DEFAULT FALSE,       
    is_accredited BOOLEAN DEFAULT FALSE,     
    specialty_id INT UNSIGNED    NOT NULL , 			-- tabela de especialidades
    advantages text   , 					-- vantagens oferecidas pelo conveniado
    observation text   , 					-- Observacoes para a emissao da guia
    credit_limit DECIMAL(19, 4),
    payment_terms INT,  -- Days
    billing_address_id INT UNSIGNED NOT NULL REFERENCES address(address_id),
    shipping_address_id INT UNSIGNED  NOT NULL REFERENCES address(address_id),
    doccument1_id INT UNSIGNED  NOT NULL REFERENCES document(document_id) ,
    doccument2_id INT UNSIGNED  NOT NULL REFERENCES document(document_id) ,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    deleted_at TIMESTAMP,
    created_by INT,
    updated_by INT,
    deleted_by INT,
    UNIQUE (partner_id, partner_code),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_partner_company ON partner (company_id);
CREATE INDEX idx_partner_type ON partner (partner_type_id);
CREATE INDEX idx_partner_customer ON partner (company_id) WHERE is_customer = TRUE;
CREATE INDEX idx_partner_vendor ON partner (company_id) WHERE is_vendor = TRUE;
CREATE INDEX idx_partner_name ON partner (partner_name);

CREATE TABLE partner_bank_account (
    partner_bank_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    partner_id INT NOT NULL REFERENCES partner(partner_id) ON DELETE CASCADE,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    created_at TIMESTAMP ,
    created_by INT,
    updated_by INT,
    deleted_by INT,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_partner_bank_partner ON partner_bank_account (partner_id);

-- =========================================================================
-- COMPANIES
-- =========================================================================
CREATE TABLE company (
    company_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_company_id INT UNSIGNED ,
    company_name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(150) NOT NULL,
    tax_id VARCHAR(50) NOT NULL,
    address_id INT UNSIGNED NOT NULL REFERENCES address(address_id),
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
    CONSTRAINT fk_company_currency FOREIGN KEY (default_currency) REFERENCES currency(currency_code) ,
    CONSTRAINT valid_parent CHECK (parent_company_id != company_id OR parent_company_id IS NULL),
    CONSTRAINT fk_company_parent FOREIGN KEY (parent_company_id) REFERENCES company(company_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_company_name ON company (company_name);
CREATE INDEX idx_company_tax_id ON company (tax_id);
CREATE INDEX idx_company_parent ON company (parent_company_id);
CREATE INDEX idx_company_is_active ON company (is_active); -- Index on the new boolean column name

-- Status geral para tabelas diferentes de contrato (Ativo, suspenso e cancelado)
CREATE TABLE general_status( 
      general_status_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (general_status_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'Reference table for status codes used throughout the system'; 

-- Insert common statuses
INSERT INTO general_status (status_code, status_name, description) VALUES
('ACTIVE', 'Active', 'Active record'),
('INACTIVE', 'Inactive', 'Inactive record'),
('DRAFT', 'Draft', 'Initial draft state'),
('PENDING', 'Pending', 'Awaiting action'),
('APPROVED', 'Approved', 'Approved for processing'),
('COMPLETED', 'Completed', 'Process completed');
('CANCELED', 'Canceled', 'Process cancelado');

-- Create billing_rates table
CREATE TABLE billing_rates (
    rate_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rate_type VARCHAR(50) NOT NULL COMMENT 'Type of rate (e.g., FUNERAL, MEDICAL, etc.)',
    description VARCHAR(255) COMMENT 'Description of what this rate applies to',
    value_per_death DECIMAL(12,2) NOT NULL COMMENT 'Amount charged per death event',
    effective_date DATE NOT NULL COMMENT 'Date when this rate becomes effective',
    expiration_date DATE COMMENT 'Date when this rate expires (NULL means no expiration)',
    system_unit_id INT UNSIGNED COMMENT 'Which unit/branch this rate applies to (NULL for all)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    deleted_at TIMESTAMP NULL,
        FOREIGN KEY (system_unit_id) REFERENCES system_unit(system_unit_id),
    FOREIGN KEY (created_by) REFERENCES system_user(system_user_id),
    FOREIGN KEY (updated_by) REFERENCES system_user(system_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

-- Create index for faster lookups
CREATE INDEX idx_billing_rates_type ON billing_rates(rate_type, effective_date, expiration_date);
CREATE INDEX idx_billing_rates_unit ON billing_rates(system_unit_id);

-- Insert default funeral rate
INSERT INTO billing_rates (
    rate_type, 
    description, 
    value_per_death, 
    effective_date,
    created_by
) VALUES (
    'FUNERAL', 
    'Standard funeral service rate per death event', 
    50.00, 
    CURDATE(),
    1  -- Assuming user ID 1 is admin
);

CREATE VIEW vw_current_billing_rates AS
SELECT * FROM billing_rates
WHERE effective_date <= CURDATE() 
AND (expiration_date IS NULL OR expiration_date >= CURDATE())
AND deleted_at IS NULL;

DELIMITER //

CREATE PROCEDURE get_current_rate(
    IN p_rate_type VARCHAR(50),
    IN p_unit_id INT UNSIGNED ,
    OUT p_rate DECIMAL(12,2)
BEGIN
    -- Try to get unit-specific rate first
    SELECT value_per_death INTO p_rate
    FROM billing_rates
    WHERE rate_type = p_rate_type
    AND (system_unit_id = p_unit_id OR system_unit_id IS NULL)
    AND effective_date <= CURDATE()
    AND (expiration_date IS NULL OR expiration_date >= CURDATE())
    AND deleted_at IS NULL
    ORDER BY system_unit_id DESC, effective_date DESC
    LIMIT 1;

    -- If no rate found, return NULL
    IF p_rate IS NULL THEN
        SET p_rate = NULL;
    END IF;
END//

DELIMITER ;


-- =========================================================================
-- CHART OF ACCOUNTS
-- =========================================================================

CREATE TABLE account_type (
    account_type_id INT UNSIGNED AUTO_INCREMENT ,
    company_id INT NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    nature VARCHAR(20) NOT NULL,
    description TEXT,
    is_system TINYINT(1) DEFAULT 0,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (account_type_id) ,
    UNIQUE KEY uk_account_type_company (company_id, type_name),
    CONSTRAINT fk_account_type_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE,
    CONSTRAINT chk_account_type_nature CHECK (nature IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_account_type_company ON account_type (company_id);

CREATE TABLE account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    account_type_id INT NOT NULL,
    parent_account_id INT,
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
    CONSTRAINT fk_account_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE,
    CONSTRAINT fk_account_type FOREIGN KEY (account_type_id) REFERENCES account_type(account_type_id),
    CONSTRAINT fk_account_parent FOREIGN KEY (parent_account_id) REFERENCES account(account_id) ON DELETE RESTRICT,
    CONSTRAINT fk_account_currency FOREIGN KEY (currency) REFERENCES currency(currency_code),
    CONSTRAINT chk_account_level CHECK (level >= 1) ,
    CONSTRAINT chk_no_self_parent CHECK (parent_account_id != account_id OR parent_account_id IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_account_company ON account (company_id);
CREATE INDEX idx_account_parent ON account (parent_account_id);
CREATE INDEX idx_account_type ON account (account_type_id);
CREATE INDEX idx_account_code ON account (company_id, account_code);

-- =========================================================================
-- CURRENCIES AND EXCHANGE RATES (created first due to references)
-- =========================================================================
CREATE TABLE currency (
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
    PRIMARY KEY  (currency_code) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


