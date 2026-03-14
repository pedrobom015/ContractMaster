
CREATE TABLE schema_version (
    version_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

INSERT INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial contracts management system schema');

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

CREATE TABLE address_type( 
      address_type_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      name varchar  (100)    NOT NULL , 			
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      column_9 INT   , 
 PRIMARY KEY (address_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE payment_status( 
      payment_status_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
 PRIMARY KEY (payment_status_id)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

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

CREATE TABLE company (
    company_id INT UNSIGNED PRIMARY KEY,
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
    CONSTRAINT fk_company_parent FOREIGN KEY (parent_company_id) REFERENCES company(company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;


CREATE INDEX idx_company_name ON company (company_name);
CREATE INDEX idx_company_tax_id ON company (tax_id);
CREATE INDEX idx_company_parent ON company (parent_company_id);
CREATE INDEX idx_company_is_active ON company (is_active); 

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

CREATE TABLE partner_type (
    partner_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id INT UNSIGNED  NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    UNIQUE (company_id, type_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE INDEX idx_partner_type_company ON partner_type (company_id);

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
    CONSTRAINT chk_account_type_nature CHECK (nature IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_account_type_company ON account_type (company_id);

CREATE TABLE classe( 
      class_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (class_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE group_batch( 
      group_batch_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      name varchar  (100)    NOT NULL , 				
      group_code varchar  (5)    NOT NULL , 				
      class_id INT UNSIGNED   NOT NULL , 					
      begin_code varchar  (9)    NOT NULL , 				 
      final_code varchar  (9)    NOT NULL , 				
      is_periodic boolean    NOT NULL , 				
      amount_process INT    NOT NULL , 					
      min_proc INT  UNSIGNED  NOT NULL , 				
      max_proc INT  UNSIGNED  NOT NULL , 				
      compare_admission boolean    DEFAULT FALSE  NOT NULL , 		
      amount_redeem INT    NOT NULL , 					
      by_service boolean    DEFAULT TRUE  NOT NULL , 			
      last_billing_number varchar  (3)    NOT NULL , 			
      last_issue_date date   , 						
      pending_process INT   , 						
      number_contracts INT   , 						
      number_lifes INT    NOT NULL , 					
      death_count INT DEFAULT 0 ,					
      next_billing_number varchar  (3)    NOT NULL , 			
      current_death_count INT DEFAULT 0 ,				
      last_death_charge_date TIMESTAMP ,				
      death_threshold INT DEFAULT 10 NOT NULL ,				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (group_batch_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (class_id) REFERENCES classe(class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

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
    specialty_id INT UNSIGNED    NOT NULL , 			 
    advantages text   , 					 
    observation text   , 					 
    credit_limit DECIMAL(19, 4),
    payment_terms INT,  
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_by INT,
    updated_by INT,
    deleted_by INT,
    UNIQUE (partner_id, partner_code)
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


CREATE TABLE contract( 
      contract_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 
      group_batch_id INT  UNSIGNED   NOT NULL ,					
      owner_id INT   UNSIGNED  NOT NULL , 					
      contract_name VARCHAR (100) NOT NULL ,
      class_id INT   UNSIGNED  NOT NULL , 					
      status_id INT   UNSIGNED  NOT NULL , 					
      contract_number varchar  (20)    NOT NULL , 			
      contract_type varchar  (50)    NOT NULL , 			
      start_date date    NOT NULL , 					
      end_date date   , 						
      billing_frequenc INT    DEFAULT 1  NOT NULL , 			
      admission date    NOT NULL ,      				
      final_grace date   , 						
      month_initial_billing char  (2)    NOT NULL , 			
      year_initial_billing char  (4)    NOT NULL , 			
      opt_payday INT   , 						
      collector_id INT  UNSIGNED  , 						
      seller_id INT  UNSIGNED  , 						
      region_id INT  UNSIGNED , 						
      obs text   , 							
      services_amount INT   , 						
      renew_at date   , 						
      first_charge INT   , 						
      last_charge INT   , 						
      charges_amount INT   , 						
      charges_paid INT   , 						
      alives INT   , 							
      deceaseds INT   , 						
      dependents INT   , 						
      service_option1 varchar  (100)   , 				
      service_option2 varchar  (100)   , 				
      indicated_by INT UNSIGNED  , 						
      grace_period_days varchar (15)  ,					 
      late_fee_percentage DECIMAL  (8,5) ,				 
      is_partial_payments_allowed boolean ,				
      default_plan_installments varchar(6)  ,				
      default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,		
      industry VARCHAR(50) DEFAULT 'FUNERAL' ,				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (contract_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id) ,
    FOREIGN KEY (owner_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (collector_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (seller_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

CREATE TABLE performed_service( 
      performed_service_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   , 
      contract_id INT UNSIGNED   , 
      beneficiary_id INT  UNSIGNED  , 
      service_type_id INT  UNSIGNED   NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (performed_service_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE service_funeral ( 
      service_funeral_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL COMMENT 'Unit where service was performed' , 
      sys_user_id INT  UNSIGNED  NOT NULL COMMENT 'User who recorded the service', 
      performed_service_id INT UNSIGNED   NOT NULL COMMENT 'Link to general service tracking', 
      declarant_id INT UNSIGNED  , 					
      deceased_id INT  UNSIGNED , 					
      office_users_id INT  UNSIGNED  NOT NULL , 			
      process_number varchar  (25)    NOT NULL , 		
      occurr_at date    NOT NULL , 				
      category varchar  (25)    DEFAULT 'PL'  NOT NULL , 	
      contract_id INT UNSIGNED  , 				
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
    PRIMARY KEY (service_funeral_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id) ,
    FOREIGN KEY (declarant_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (office_users_id) REFERENCES sys_user(sys_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Funeral services provided to contract beneficiaries'; 


CREATE TABLE beneficiary( 
      beneficiary_id  INT UNSIGNED AUTO_INCREMENT NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 			
      contract_id INT UNSIGNED  NOT NULL , 			
      relationship varchar  (50)    NOT NULL , 			
      is_primary boolean    DEFAULT FALSE , 			
      name varchar  (100)    NOT NULL , 			
      birth_at date   , 				
      is_forbidden boolean   , 					
      gender_id INT  UNSIGNED , 					
      document_id INT UNSIGNED   NOT NULL , 				
      service_funeral_id INT  UNSIGNED , 				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 	
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      grace_at date   , 
      is_alive boolean   , 
    PRIMARY KEY (beneficiary_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (gender_id) REFERENCES gender(gender_id) ,
    FOREIGN KEY (document_id) REFERENCES document(document_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE contract_charge( 
      contract_charge_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      contract_id INT  UNSIGNED   NOT NULL , 
      sys_unit_id INT  UNSIGNED   NOT NULL , 
      payment_status_id INT  UNSIGNED   NOT NULL , 
      charge_code varchar  (100)    NOT NULL ,				
      due_date date    NOT NULL , 					
      amount DECIMAL  (19,4)    NOT NULL , 				
      payment_date date   , 						
      amount_pago DECIMAL  (19,4)   , 					
      convenio varchar  (20)   , 					
      due_month char  (2)   , 						
      due_year char  (4)   , 						
      payd_month char  (2)   , 						
      payd_year char  (4)   , 						
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 			
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (contract_charge_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE addendum( 
      addendum_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (addendum_id) ,
    FOREIGN KEY (general_status_id) REFERENCES general_status(general_status_id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE contract_addendum( 
      caddendum_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT  UNSIGNED , 
      contract_id INT  UNSIGNED  NOT NULL , 
      addendum_id INT  UNSIGNED  NOT NULL , 				
      name varchar  (100)    NOT NULL , 			
      product_code varchar  (100)    NOT NULL , 		
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (caddendum_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (addendum_id) REFERENCES addendum(addendum_id) 
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 


CREATE TABLE account (
    account_id INT UNSIGNED PRIMARY KEY,
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
    CONSTRAINT fk_account_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE,
    CONSTRAINT fk_account_type FOREIGN KEY (account_type_id) REFERENCES account_type(account_type_id),
    CONSTRAINT fk_account_parent FOREIGN KEY (parent_account_id) REFERENCES account(account_id) ON DELETE RESTRICT,
    CONSTRAINT chk_account_level CHECK (level >= 1) ,
    CONSTRAINT chk_no_self_parent CHECK (parent_account_id != account_id OR parent_account_id IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_account_company ON account (company_id);
CREATE INDEX idx_account_parent ON account (parent_account_id);
CREATE INDEX idx_account_type ON account (account_type_id);
CREATE INDEX idx_account_code ON account (company_id, account_code);

CREATE TABLE partner_bank_account (
    partner_bank_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    partner_id INT UNSIGNED NOT NULL REFERENCES partner(partner_id) ON DELETE CASCADE,
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


ALTER TABLE company ADD CONSTRAINT fk_company_currency FOREIGN KEY (default_currency) REFERENCES currency(currency_code); 
ALTER TABLE company ADD CONSTRAINT fk_company_parent2 FOREIGN KEY (parent_company_id) REFERENCES company(company_id);
ALTER TABLE company ADD CONSTRAINT valid_parent CHECK (parent_company_id != company_id OR parent_company_id IS NULL) ;


ALTER TABLE performed_service ADD FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id) ;
ALTER TABLE service_funeral ADD FOREIGN KEY (deceased_id) REFERENCES beneficiary(beneficiary_id) ;
ALTER TABLE beneficiary ADD  FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id) ;

INSERT INTO general_status (status_code, status_name, description) VALUES
('ACTIVE', 'Active', 'Active record'),
('INACTIVE', 'Inactive', 'Inactive record'),
('DRAFT', 'Draft', 'Initial draft state'),
('PENDING', 'Pending', 'Awaiting action'),
('APPROVED', 'Approved', 'Approved for processing'),
('COMPLETED', 'Completed', 'Process completed'),
('CANCELED', 'Canceled', 'Process cancelado');

CREATE TABLE contract_status( 
      status_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
 PRIMARY KEY (status_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE status_possible( 
      status_possible_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (status_possible_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE status_reason( 
      status_reason_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      reason varchar  (200)    NOT NULL , 
      description varchar  (250)   , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
      unit_id INT   , 
    PRIMARY KEY (status_reason_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE contract_status_history( 
      c_status_history_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      status_possible_id INT UNSIGNED   NOT NULL , 			  
      status_reason_id INT  UNSIGNED  NOT NULL , 			 
      contract_id INT UNSIGNED   NOT NULL , 				 
      contract_number varchar  (20)    NOT NULL , 		
      detail_status varchar  (250)   , 				
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      delted_by INT   , 
    PRIMARY KEY (c_status_history_id) ,
    FOREIGN KEY (status_possible_id) REFERENCES status_possible(status_possible_id) ,
    FOREIGN KEY (status_reason_id) REFERENCES status_reason(status_reason_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE bank_slip( 
      boletos_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (boletos_id) ,
    FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(contract_charge_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE ordpgrc( 
      ordpgrc_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (ordpgrc_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE payment_receipt( 
      payment_receipt_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      subsidiary_id INT UNSIGNED   NOT NULL , 				
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      sys_user_id INT  UNSIGNED  NOT NULL , 
      contract_id INT  UNSIGNED  NOT NULL , 
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
    PRIMARY KEY (payment_receipt_id) ,
    FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(subsidiary_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(ordpgrc_id) ,
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE carteirinha( 
      carteirinha_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      performed_service_id INT UNSIGNED   NOT NULL , 
      sys_unit_id INT UNSIGNED  , 
      sys_user_id INT UNSIGNED  , 
      contract_id INT  UNSIGNED , 
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
    PRIMARY KEY (carteirinha_id),
    FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE equipament_rental( 
      eq_rental_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      performed_service_id INT  UNSIGNED  NOT NULL , 
      sys_unit_id INT UNSIGNED  , 
      sys_user_id INT UNSIGNED  , 
      contract_id INT  UNSIGNED , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
   PRIMARY KEY (eq_rental_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE batch_chk( 
      batch_chk_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (batch_chk_id) ,
    FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(subsidiary_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(ordpgrc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE batch_detail( 
      batch_detail_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (batch_detail_id) ,
    FOREIGN KEY (batch_chk_id) REFERENCES batch_chk(batch_chk_id) ,
    FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(contract_charge_id) ,
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE charge( 
      charge_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (charge_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE prorated_service(
      prorated_service_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (prorated_service_id) ,
    FOREIGN KEY (charge_id) REFERENCES charge(charge_id) ,
    FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;
  
CREATE TABLE service_type( 
      service_type_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (service_type_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE specialty( 
      specialty_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (specialty_id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE death_event (
    death_event_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    group_batch_id INT UNSIGNED NOT NULL,
    beneficiary_id INT UNSIGNED NOT NULL,
    service_funeral_id INT  UNSIGNED NOT NULL,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_for_billing BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (death_event_id),
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id),
    FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contract_active( 
      contract_active_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT UNSIGNED   NOT NULL , 
      contract_number varchar  (20)    NOT NULL , 
      contract_id INT  UNSIGNED  NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (contract_active_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE group_class( 
      group_class_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (group_class_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (class_id) REFERENCES classe(class_id) , 
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE age_addendum( 
      age_add_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (age_add_id) ,
    FOREIGN KEY (addendum_id) REFERENCES addendum(addendum_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (class_id) REFERENCES classe(class_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

CREATE TABLE billing_cycle (
    cycle_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    group_batch_id INT UNSIGNED NOT NULL,
    death_event_count INT NOT NULL,
    charge_date TIMESTAMP NOT NULL,
    amount_per_contract DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (cycle_id),
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE contract_billing (
    billing_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    cycle_id INT UNSIGNED NOT NULL,
    contract_id INT UNSIGNED NOT NULL,
    charge_id INT UNSIGNED ,
    amount DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (billing_id) ,
    FOREIGN KEY (cycle_id) REFERENCES billing_cycle(cycle_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(contract_charge_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_plan (
    plan_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    contract_id INT UNSIGNED NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    total_amount DECIMAL  (19,4) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT ,
    PRIMARY KEY (plan_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_plan_installment (
    installment_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
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
    PRIMARY KEY (installment_id),
    FOREIGN KEY (plan_id) REFERENCES payment_plan(plan_id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(contract_charge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_transaction (
    transaction_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    contract_id INT UNSIGNED NOT NULL,
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
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(contract_charge_id) ,
    FOREIGN KEY (installment_id) REFERENCES payment_plan_installment(installment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE billing_rule (
    rule_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT  UNSIGNED  NOT NULL , 
    sys_user_id INT UNSIGNED   NOT NULL , 
    rule_name VARCHAR(100) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    description TEXT,
    condition_expression TEXT,
    charge_expression TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (rule_id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE billing_rule_application (
    application_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    sys_unit_id INT UNSIGNED  NOT NULL , 
    sys_user_id INT  UNSIGNED   NOT NULL , 
    rule_id INT UNSIGNED NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'CONTRACT', 'GROUP', 'SERVICE'
    entity_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by INT ,
    PRIMARY KEY (application_id),
    FOREIGN KEY (rule_id) REFERENCES billing_rule(rule_id),
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id) ,
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE medical_foward( 
      medical_foward_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
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
    PRIMARY KEY (medical_foward_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id) ,
    FOREIGN KEY (partner_id) REFERENCES partner(partner_id) ,
    FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id)
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







-- estas duas linhas estao apresentando incompatibilidade e eu nao consegui resolver.
-- ALTER TABLE account ADD  CONSTRAINT fk_account_currency FOREIGN KEY (currency) REFERENCES currency(currency_code) ;
-- ALTER TABLE account_type ADD CONSTRAINT fk_account_type_company FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE;
-- Tabela CEP_CACHE talvez desnecessaria 
-- ALTER TABLE cep_cache ADD CONSTRAINT fk_cep_cache_cidade FOREIGN KEY (cidade_id) REFERENCES cidade(id); 
-- ALTER TABLE cep_cache ADD CONSTRAINT fk_cep_cache_estado FOREIGN KEY (estado_id) REFERENCES estado(id); 


ALTER TABLE partner ADD CONSTRAINT fk_partner_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE partner ADD CONSTRAINT fk_partner_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE partner ADD CONSTRAINT fk_partner_specialty FOREIGN KEY (specialty_id) REFERENCES specialty(specialty_id); 
ALTER TABLE addendum ADD CONSTRAINT fk_addendum_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE addendum ADD CONSTRAINT fk_addendum_gstat FOREIGN KEY (general_status_id) REFERENCES general_status(general_status_id); 
ALTER TABLE address ADD CONSTRAINT fk_address_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE address ADD CONSTRAINT fk_address_addtype FOREIGN KEY (address_type_id) REFERENCES address_type(address_type_id); 
ALTER TABLE age_addendum ADD CONSTRAINT fk_age_addendum_class FOREIGN KEY (class_id) REFERENCES classe(class_id); 
ALTER TABLE age_addendum ADD CONSTRAINT fk_age_addendum_addendum FOREIGN KEY (addendum_id) REFERENCES addendum(addendum_id); 
ALTER TABLE bank_slip ADD CONSTRAINT fk_bank_slip_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE bank_slip ADD CONSTRAINT fk_bank_slip_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE bank_slip ADD CONSTRAINT fk_bank_slip_charge FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(contract_charge_id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(subsidiary_id); 
ALTER TABLE batch_chk ADD CONSTRAINT fk_batch_chk_ordpgrc FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(ordpgrc_id); 
ALTER TABLE batch_detail ADD CONSTRAINT fk_batch_detail_batch FOREIGN KEY (batch_chk_id) REFERENCES batch_chk(batch_chk_id); 
ALTER TABLE batch_detail ADD CONSTRAINT fk_batch_detail_contcharge FOREIGN KEY (contract_charge_id) REFERENCES contract_charge(contract_charge_id); 
ALTER TABLE batch_detail ADD CONSTRAINT fk_batch_detail_paymstat FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_document FOREIGN KEY (document_id) REFERENCES document(document_id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_funservice FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id); 
ALTER TABLE beneficiary ADD CONSTRAINT fk_beneficiary_gender FOREIGN KEY (gender_id) REFERENCES gender(gender_id); 
ALTER TABLE carteirinha ADD CONSTRAINT fk_carteirinha_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE carteirinha ADD CONSTRAINT fk_carteirinha_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE carteirinha ADD CONSTRAINT fk_carteirinha_service FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id); 
ALTER TABLE charge ADD CONSTRAINT fk_charge_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE charge ADD CONSTRAINT fk_charge_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE charge ADD CONSTRAINT fk_charge_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id); 
ALTER TABLE cidade ADD CONSTRAINT fk_cidade_estado FOREIGN KEY (estado_id) REFERENCES estado(id); 
ALTER TABLE classe ADD CONSTRAINT fk_class_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE classe ADD CONSTRAINT fk_class_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_owner FOREIGN KEY (owner_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_status FOREIGN KEY (status_id) REFERENCES contract_status(status_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_collector FOREIGN KEY (collector_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_seller FOREIGN KEY (seller_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_indicated FOREIGN KEY (indicated_by) REFERENCES sys_user(sys_user_id); 
ALTER TABLE contract ADD CONSTRAINT fk_contract_class FOREIGN KEY (class_id) REFERENCES classe(class_id); 
ALTER TABLE contract_active ADD CONSTRAINT fk_contract_number_unique_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id); 
ALTER TABLE contract_addendum ADD CONSTRAINT fk_contract_addendum_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id); 
ALTER TABLE contract_addendum ADD CONSTRAINT fk_contract_addendum_addendum FOREIGN KEY (addendum_id) REFERENCES addendum(addendum_id); 
ALTER TABLE contract_addendum ADD CONSTRAINT fk_contract_addendum_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE contract_charge ADD CONSTRAINT fk_contract_charge_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ON DELETE CASCADE ON UPDATE CASCADE; 
ALTER TABLE contract_charge ADD CONSTRAINT fk_contract_charge_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE contract_charge ADD CONSTRAINT fk_contract_charge_payment FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id); 
ALTER TABLE contract_status_history ADD CONSTRAINT fk_contract_status_history_statreason FOREIGN KEY (status_reason_id) REFERENCES status_reason(status_reason_id); 
ALTER TABLE contract_status_history ADD CONSTRAINT fk_contract_status_history_statpossib FOREIGN KEY (status_possible_id) REFERENCES contract_status(status_id); 
ALTER TABLE contract_status_history ADD CONSTRAINT fk_contract_status_history_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id); 
ALTER TABLE document ADD CONSTRAINT fk_document_doctype FOREIGN KEY (document_type_id) REFERENCES document_type(document_type_id); 
ALTER TABLE document ADD CONSTRAINT fk_document_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE equipament_rental ADD CONSTRAINT fk_equipament_rental_perfservic FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id); 
ALTER TABLE group_batch ADD CONSTRAINT fk_group_batch_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE group_batch ADD CONSTRAINT fk_group_batch_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE group_batch ADD CONSTRAINT fk_group_batch_class FOREIGN KEY (class_id) REFERENCES classe(class_id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id); 
ALTER TABLE group_class ADD CONSTRAINT fk_group_class_class FOREIGN KEY (class_id) REFERENCES classe(class_id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_accredit FOREIGN KEY (partner_id) REFERENCES partner(partner_id); 
ALTER TABLE medical_foward ADD CONSTRAINT fk_medical_foward_perfservic FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id); 
ALTER TABLE ordpgrc ADD CONSTRAINT fk_ordpgrc_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE ordpgrc ADD CONSTRAINT fk_ordpgrc_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_unit  FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(subsidiary_id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_ordpgrc FOREIGN KEY (ordpgrc_id) REFERENCES ordpgrc(ordpgrc_id); 
ALTER TABLE payment_receipt ADD CONSTRAINT fk_payment_receipt_paystat FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_servtype FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_contract FOREIGN KEY (contract_id) REFERENCES contract(contract_id); 
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service_benefic FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_charge FOREIGN KEY (charge_id) REFERENCES charge(charge_id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_servfuner FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE prorated_service ADD CONSTRAINT fk_prorated_service_id_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_declarant FOREIGN KEY (declarant_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_officer FOREIGN KEY (office_users_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_perfservic FOREIGN KEY (performed_service_id) REFERENCES performed_service(performed_service_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_deceased FOREIGN KEY (deceased_id) REFERENCES beneficiary(beneficiary_id); 
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id);
ALTER TABLE service_type ADD CONSTRAINT fk_service_type_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE specialty ADD CONSTRAINT fk_specialty_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE specialty ADD CONSTRAINT fk_specialty_users FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE sys_group_program ADD CONSTRAINT fk_sys_group_program_program FOREIGN KEY (sys_program_id) REFERENCES sys_program(s_program_id); 
ALTER TABLE sys_group_program ADD CONSTRAINT fk_sys_group_program_group FOREIGN KEY (sys_group_id) REFERENCES sys_group(sys_group_id); 
ALTER TABLE sys_unit ADD CONSTRAINT fk_sys_unit_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(subsidiary_id); 
ALTER TABLE sys_unit ADD CONSTRAINT fk_sys_unit_genstat FOREIGN KEY (general_status_id) REFERENCES general_status(general_status_id); 
ALTER TABLE sys_user_group ADD CONSTRAINT fk_sys_user_group_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE sys_user_group ADD CONSTRAINT fk_sys_user_group_group FOREIGN KEY (sys_group_id) REFERENCES sys_group(sys_group_id); 
ALTER TABLE sys_user_program ADD CONSTRAINT fk_sys_user_program_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE sys_user_program ADD CONSTRAINT fk_sys_user_program_progrm FOREIGN KEY (sys_program_id) REFERENCES sys_program(s_program_id); 
ALTER TABLE sys_user ADD CONSTRAINT fk_sys_user_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE sys_user ADD CONSTRAINT fk_sys_user_frontpg FOREIGN KEY (frontpage_id) REFERENCES sys_program(s_program_id); 
ALTER TABLE sys_user_unit ADD CONSTRAINT fk_sys_user_unit_user FOREIGN KEY (sys_user_id) REFERENCES sys_user(sys_user_id); 
ALTER TABLE sys_user_unit ADD CONSTRAINT fk_sys_user_unit_unit FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id); 
ALTER TABLE sys_unit ADD CONSTRAINT fk_sys_unit_genstat FOREIGN KEY (general_status_id) REFERENCES general_status(general_status_id); 
ALTER TABLE sys_unit ADD CONSTRAINT fk_sys_unit_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES subsidiary(subsidiary_id); 


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
CREATE INDEX idx_beneficiary_contract_id ON beneficiary (contract_id);

CREATE INDEX idx_beneficiary_sys_user_id ON beneficiary (sys_user_id);

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
CREATE INDEX idx_contract_sys_unit_id ON contract (sys_unit_id);
CREATE INDEX idx_contract_sys_user_id ON contract (sys_user_id);
CREATE INDEX idx_contract_owner_id ON contract (owner_id);
CREATE INDEX idx_contract_class_id ON contract (class_id);
CREATE INDEX idx_contract_collector_id ON contract (collector_id);
CREATE INDEX idx_contract_seller_id ON contract (seller_id);
CREATE INDEX idx_contract_region_id ON contract (region_id);
CREATE INDEX idx_contract_status_id ON contract (status_id);
CREATE INDEX idx_contract_indicated_by ON contract (indicated_by);
CREATE INDEX idx_contract_active_contract_id ON contract_active (contract_id);
CREATE INDEX idx_contract_addendum_contract_id ON contract_addendum (contract_id);
CREATE INDEX idx_contract_addendum_addendum_id ON contract_addendum (addendum_id);
CREATE INDEX idx_contract_addendum_unit_id ON contract_addendum (sys_unit_id);
CREATE INDEX idx_contract_charge_contract_id ON contract_charge (contract_id);
CREATE INDEX idx_contract_charge_unit_id ON contract_charge (sys_unit_id);

-- For contract_status_history table
CREATE INDEX idx_contract_status_history_contract_id ON contract_status_history (contract_id);
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
CREATE INDEX idx_payment_plan_contract_id ON payment_plan (contract_id);

-- For payment_plan_installment table
CREATE INDEX idx_payment_plan_installment_plan_id ON payment_plan_installment (plan_id);
CREATE INDEX idx_payment_plan_installment_charge_id ON payment_plan_installment (charge_id);
CREATE INDEX idx_payment_plan_installment_status ON payment_plan_installment (status);
CREATE INDEX idx_payment_plan_installment_due_date ON payment_plan_installment (due_date);

-- For payment_transaction table
CREATE INDEX idx_payment_transaction_contract_id ON payment_transaction (contract_id);
CREATE INDEX idx_payment_transaction_charge_id ON payment_transaction (charge_id);
CREATE INDEX idx_payment_transaction_installment_id ON payment_transaction (installment_id);
CREATE INDEX idx_payment_transaction_payment_date ON payment_transaction (payment_date);

-- For death_event table
CREATE INDEX idx_death_event_beneficiary_id ON death_event (beneficiary_id);
CREATE INDEX idx_death_event_service_funeral_id ON death_event (service_funeral_id);

-- For contract_billing table
CREATE INDEX idx_contract_billing_contract_id ON contract_billing (contract_id);
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
CREATE INDEX idx_batch_detail_full_number ON batch_detail (full_number);

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
CREATE INDEX idx_contract_charge_contract_status ON contract_charge (contract_id, payment_status_id);
CREATE INDEX idx_contract_charge_due_date_status ON contract_charge (due_date, payment_status_id);
CREATE INDEX idx_service_funeral_occurr_category ON service_funeral (occurr_at, category);
CREATE INDEX idx_service_funeral_group_category ON service_funeral (group_batch_id, category);
CREATE INDEX idx_beneficiary_contract_primary ON beneficiary (contract_id, is_primary);
CREATE INDEX idx_beneficiary_contract_alive ON beneficiary (contract_id, is_alive);
CREATE INDEX idx_payment_plan_installment_plan_status ON payment_plan_installment (plan_id, status);




