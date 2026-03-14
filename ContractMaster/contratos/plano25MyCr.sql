BEGIN;
-- =========================================================================
-- Contracts Management System Database Schema - MySQL Version: 8.0+
-- =========================================================================
-- With multi-company support, "cobranças", "parcelamentos" and ERP integration.
-- Date: 28/03/2025, Revised 10,11,17,23,24,25,27,29/04, 02,03,06,16,21,22,23,24,27/05/2025,
--  01,04,05,06,10,11/06/2025. 
-- =========================================================================

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

-- =========================================================================
-- GENERAL SETUP 
-- =========================================================================

SET default_storage_engine = InnoDB;

-- Criar um BD para o estoque, não sei se usaremos o mesmo para plano, financeiro e estoque 
--    CREATE DATABASE IF NOT EXISTS inventory_system 
--    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--    USE inventory_system;

-- Criar um usuario com os privilegios de adm 
--    CREATE USER 'presserv_plano' IDENTIFIED BY 'Pr3ss3rv@Plano';
--    GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON inventory_system.* TO 'presserv_plano';
--    FLUSH PRIVILEGES;

--
-- =========================================================================
-- PLANO - (Administracao de contratos)
-- =========================================================================
-- Contratos do sistema. antigo grupos
CREATE TABLE contract( 
      contract_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 
      sys_user_id INT    NOT NULL , 
      group_batch_id INT    NOT NULL ,					-- grupos->grupo
      owner_id INT    NOT NULL , 					-- como pegar nome do titular no arquivo sys_user?
      class_id INT    NOT NULL , 					-- grupos->tipcont 
      status_id INT    NOT NULL , 					-- grupos->situacao
      contract_number varchar  (20)    NOT NULL , 			-- grupos->codigo (numero do contrato)
      contract_type varchar  (50)    NOT NULL , 			-- 
      start_date date    NOT NULL , 					-- grupos->admissao
      end_date date   , 						-- grupos->renovar_
      billing_frequenc INT    DEFAULT 1  NOT NULL , 			-- grupos->formapgto
      admission date    NOT NULL ,      				-- grupos->admissao
      final_grace date   , 						-- grupos->tcarencia
      month_initial_billing char  (2)    NOT NULL , 			-- left(grupos->saitxas,2)
      year_initial_billing char  (4)    NOT NULL , 			-- right(grupos->saitxas,2)
      opt_payday INT   , 						-- grupos->diapgto
      collector_id INT   , 						-- grupos->cobrador
      seller_id INT   , 						-- gurpos->vendedor
      region_id INT   , 						-- grupos->regiao (nao criei uma tabela pra essa informacao)
      obs text   , 							-- grupos->obs 
      services_amount INT   , 						-- grupos->funerais
      renew_at date   , 						-- grupos->renovar_
      first_charge INT   , 						-- grupos->circinic
      last_charge INT   , 						-- grupos->ultcirc
      charges_amount INT   , 						-- grupos->qtcircs
      charges_paid INT   , 						-- grupos->qtcircpg
      alives INT   , 							-- grupos->nrvivos
      deceaseds INT   , 						-- grupos->nrfalec
      dependents INT   , 						-- grupos->nrdepend
      service_option1 varchar  (100)   , 				-- grupos->atend1
      service_option2 varchar  (100)   , 				-- grupos->atend2
      indicated_by INT   , 						-- (os campos abaixo não existem no sistema atual)
      grace_period_days varchar (15)  ,					-- 
      late_fee_percentage DECIMAL  (8,5) ,				-- 
      is_partial_payments_allowed boolean ,				--
      default_plan_installments varchar(6)  ,				--
      default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,		--
      industry VARCHAR(50) DEFAULT 'FUNERAL' ,				-- (pensei nesse campo para diversificar o uso do sistema)
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

-- Beneficiários do contrato
CREATE TABLE beneficiary( 
      beneficiary_id  INT UNSIGNED AUTO_INCREMENT NOT NULL , 
      sys_unit_id INT    NOT NULL , 			-- Qual unidade ???
      contract_id INT    NOT NULL , 			-- beneficiario do contrato...
      relationship varchar  (50)    NOT NULL , 			-- grau de parentesco
      is_primary boolean    DEFAULT FALSE , 			-- identifica o titular
      name varchar  (100)    NOT NULL , 			
      birth_at date   , 				
      is_forbidden boolean   , 					-- interdito (hoje é usado para marcar direito a carteirinha)
      gender_id INT   , 					-- M/F
      document_id INT    NOT NULL , 				-- CPF/RG buscar da tabela document
      service_funeral_id INT   , 				-- inscrits->processo (buscar da tabela services)
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
    FOREIGN KEY (document_id) REFERENCES document(document_id) ,
    FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- Cobranças de cada contrato (antigo taxas)
CREATE TABLE contract_charge( 
      contract_charge_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      contract_id INT    NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      payment_status_id INT    NOT NULL , 
      charge_code varchar  (100)    NOT NULL ,				-- taxas(codigo+tipo+circ) ou nnumero 
      due_date date    NOT NULL , 					-- taxas->emissao_
      amount DECIMAL  (19,4)    NOT NULL , 				-- taxas->valor
      payment_date date   , 						-- taxas->pagto_
      amount_pago DECIMAL  (19,4)   , 					-- taxas->valorpg
      convenio varchar  (20)   , 					-- taxas->convenio (do banco)
      due_month char  (2)   , 						-- (mes do vencimento)
      due_year char  (4)   , 						-- (ano do vencimento)
      payd_month char  (2)   , 						-- (mes do pagamento)
      payd_year char  (4)   , 						-- (ano do pagamento)
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

-- arquivo de boletos (no sistema atual vip4 o arquivo boleto não é diretamente vinculado ao arquivo taxas)
CREATE TABLE bank_slip( 
      boletos_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 			-- boleto pertencente a qual unidade
      sys_user_id INT    NOT NULL , 			-- lancado por qual usuario
      contract_charge_id INT    NOT NULL , 			-- correspondente a qual cobranca (1 cobranca N boletos)
      seq varchar  (7)    NOT NULL , 				-- numero sequencial/linha do arquivo de remessa
      nnumber varchar  (50)    NOT NULL , 			-- numero atribuido ao boleto (Nosso Numero) 
      charge_code varchar  (100)    NOT NULL , 			-- codigo de barras do boleto (hoje ele nao eh armazenado)
      status varchar  (100)   , 				-- qual o status atual do boleto (não sei se existe essa necessidade)
      send_at timestamp   , 					-- horario do envio (ou q foi disponibilizado para o envio)
      send_batch char  (7)   , 					-- numero do arquivo de remessa 
      response_at timestamp   , 				-- data do retorno
      response_batch char  (7)   , 				-- numero da remessa
      response varchar  (100)   , 				-- resposta do processamento
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

-- Adendos de cada contrato
CREATE TABLE contract_addendum( 
      caddendum_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT   , 
      contract_id INT    NOT NULL , 
      addendum_id INT    NOT NULL , 				-- addendum(addendum_id) -> tabela de adendos
      name varchar  (100)    NOT NULL , 			-- cremacao/coroas/...
      product_code varchar  (100)    NOT NULL , 		-- add5/add9/addn
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

-- Status possíveis (situação) do contrato: Ativo, Suspenço, Cancelado,...
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

-- histórico do status (quando e qual o motivo da mudança de ativo/suspenso/Cob.Judicial/...) 
CREATE TABLE contract_status_history( 
      c_status_history_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      status_possible_id INT    NOT NULL , 			-- tabela de status  
      status_reason_id INT    NOT NULL , 			-- motivos possíveis (soh para manter o padrao digitado)
      contract_id INT    NOT NULL , 				-- 
      contract_number varchar  (20)    NOT NULL , 		-- necessario para acompanhar cancelamentos/reintegracoes/remanejamentos
      detail_status varchar  (250)   , 				--
      changed_at timestamp   , 					-- cronologia
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      delted_by INT   , 
    PRIMARY KEY (c_status_history_id) 
--    FOREIGN KEY (status_possible_id) REFERENCES status_possible(status_possible_id) ,
--    FOREIGN KEY (status_reason_id) REFERENCES status_reason(status_reason_id) ,
--    FOREIGN KEY (contract_id) REFERENCES contract(contract_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

--
-- =========================================================================
-- ATENDIMENTO AOS CLIENTES   
-- =========================================================================
-- Recebimentos feitos pela recepção das empresas (antigo bxrec).
CREATE TABLE payment_receipt( 
      payment_receipt_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      subsidiary_id INT    NOT NULL , 				--
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      contract_id INT    NOT NULL , 
      status char  (2)   , 					
      billing_number varchar  (100)   , 			-- numero da cobranca (contract_charge= codigo+tipo+circ)
      val_payment DECIMAL  (19,4)   , 				-- valor pago
      val_aux DECIMAL  (19,4)   , 				-- pago com	
      due_date date   , 					-- data do pagamento
      cashier_number char  (8)   , 				-- numero do caixa 
      method_pay varchar  (100)   , 				-- metodo (dindim, cartao, pix,...)
      obs_pay varchar  (200)   , 				-- Soyez détaillé et ajoutez tout texte que l'utilisateur jugera nécessaire.
      ordpgrc_id INT    NOT NULL , 				-- Caixa
      payment_status_id INT    NOT NULL , 
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

-- Guias médicas (ou qualquer outra guia de encaminhamento) emitidas aos beneficiários (um dos benefícios) 
CREATE TABLE medical_foward( 
      medical_foward_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      partner_id INT    NOT NULL , 				-- qual parceiro/medico/credenciado/...
      performed_service_id INT    NOT NULL , 			-- qual servico
      observation text   , 					-- Veuillez fournir un texte détaillé et informatif que l'utilisateur jugera utile d'imprimer sur l'onglet..
      val_payment DECIMAL  (19,4)   , 				-- valor pago
      val_aux DECIMAL  (19,4)   , 				-- pago com	
      due_date date   , 					-- data do pagamento
      cashier_number char  (8)   , 				-- numero do caixa 
      method_pay varchar  (100)   , 				-- metodo (dindim, cartao, pix,...)
      obs_pay varchar  (200)   , 				-- Soyez détaillé et ajoutez tout texte que l'utilisateur jugera nécessaire.
      ordpgrc_id INT    NOT NULL , 				-- Caixa 
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

-- Controle de caixa dos recebiveis (taxas,guias,...) 
-- o caixa deve ser criado no primeiro recebimento do usuario caso nao haja caixa do usuario aberto (empt(
CREATE TABLE ordpgrc( 
      ordpgrc_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      sys_user_name varchar (50) ,   				-- nome do usuario ???
      order_number varchar  (20)    NOT NULL , 			-- 
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,		-- data da abertura
      total_amount DECIMAL  (19,4)    NOT NULL , 		-- Total acumulado 
      number_receipt INT UNSIGNED   , 				-- Total acumulado 
      closing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,	-- data da fechamento
      status text    NOT NULL , 				-- ??? aberto,fechado,transferido,conciliado,... ??? (acompanhar no kamban) 
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

-- Serviço de atendimento funerário utilizado pelo contrato para posterior rateio
-- ??? estudar uma forma de registrar qualquer servico utilizado e nao soh o atendimento funerario ???
CREATE TABLE service_funeral ( 
      service_funeral_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL COMMENT 'Unit where service was performed' , 
      sys_user_id INT    NOT NULL COMMENT 'User who recorded the service', 
      performed_service_id INT    NOT NULL COMMENT 'Link to general service tracking', 
      declarant_id INT   , 					-- entidade user-declarante
      deceased_id INT   , 					-- beneficiario
      office_users_id INT    NOT NULL , 			-- entidade user-partner (funcionario)
      process_number varchar  (25)    NOT NULL , 		--
      occurr_at date    NOT NULL , 				-- data da ocorrencia (lancamento)
      category varchar  (25)    DEFAULT 'PL'  NOT NULL , 	-- Plano, Auxilio, ???
      contract_id INT UNSIGNED  , 				-- numero do contrato (ou contract_id???)
      kinship varchar  (25)    NOT NULL , 			-- grau de parentesco
      death_at date   , 					-- data do obito
      death_time char  (5)   , 					-- horario do obito
      death_address_id INT    NOT NULL , 			-- entidade service-address??? ou seria mais facil os campos aqui? 
      payment_at date   , 					-- data do pagamento
      burial_date date   , 					-- dados do obito
      burial_time char  (5)   , 				--  ...
      cemetery varchar  (200)   , 				--  ...
      paid_amount DECIMAL  (19,4)   , 				-- valor pago/ a pagar
      paid_in_date date   , 					-- data do pagamento
-- Add group_id to service_funeral to track which group the death belongs to (ad27s47)
      group_batch_id INT ,					--  grupo para posterior rateio
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
    FOREIGN KEY (deceased_id) REFERENCES beneficiary(beneficiary_id) ,
    FOREIGN KEY (office_users_id) REFERENCES sys_user(sys_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Funeral services provided to contract beneficiaries'; 

-- Carteirinha é um dos benefícios oferecidos aos usuários e beneficiarios
CREATE TABLE carteirinha( 
      carteirinha_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      performed_service_id INT    NOT NULL , 
      sys_unit_id INT   , 
      contract_id INT   , 
      beneficiary_id INT   , 
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

-- equipamentos para locação (ainda em planejamento ???)
CREATE TABLE equipament_rental( 
      eq_rental_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      performed_service_id INT    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
 PRIMARY KEY (eq_rental_id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

--
-- =========================================================================
-- CREDITO E COBRANCA (Acerto com cobradores e recepcoes)
-- =========================================================================
--  arquivo mãe do lote de baixas de cobrança (BxFcc)
CREATE TABLE batch_chk( 
      batch_chk_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      subsidiary_id INT    NOT NULL , 			-- qual a empresa
      sys_unit_id INT    NOT NULL , 			-- qual a unidade ??? (verificar se a unidade recebedora sera usada)	
      sys_user_id INT    NOT NULL , 			-- qual usuario
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
      ordpgrc_id INT    NOT NULL , 				-- id de relacionamento com o arquivo de caixas
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

-- arquivo de detalhe das baixas do lote. atual bxtxas
CREATE TABLE batch_detail( 
      batch_detail_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      batch_chk_id INT    NOT NULL , 			-- ligacao com o lote
      contract_charge_id INT    NOT NULL , 			-- ligacao com a cobranca do contrato
      seq_number varchar  (5)    NOT NULL , 			-- nr.sequencial de lancamento	
      billing_number varchar  (100)   , 			-- campo de identificacao lido
      amount_received DECIMAL  (19,4)    NOT NULL , 		-- valor recebido
      process_status char  (1)    NOT NULL , 			-- kambam de baixa
      payment_status_id INT    NOT NULL , 			
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

--
-- =========================================================================
-- TABLES (MAIN ADM TABLES)  
-- =========================================================================
-- Servicos ja utilizados pelos beneficiarios e contratos. 
CREATE TABLE performed_service( 
      performed_service_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT   , 
      contract_id INT   , 
      beneficiary_id INT   , 
      service_type_id INT    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (performed_service_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id) , 
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- Tabela de agrupamento de contratos, utilizada para cobrança do rateio
CREATE TABLE group_batch( 
      group_batch_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      name varchar  (100)    NOT NULL , 				-- um nome qualquer (PRATA, PEROLA, TOPAZIO,...)
      group_code varchar  (5)    NOT NULL , 				-- A,B,A1,Z12,...
      class_id INT    NOT NULL , 					-- categoria padrao do grupo (contratos com categoria diferente=valor diferente)
      begin_code varchar  (9)    NOT NULL , 				-- 
      final_code varchar  (9)    NOT NULL , 				--
      is_periodic boolean    NOT NULL , 				-- mensal ou por rateio
      amount_process INT    NOT NULL , 					-- qtdade de processos/servicos acumulados para rateio
      min_proc INT  UNSIGNED  NOT NULL , 				-- minimo necessario para cobranca 
      max_proc INT  UNSIGNED  NOT NULL , 				-- maximo para cobranca 
      compare_admission boolean    DEFAULT FALSE  NOT NULL , 		-- cobrar proporcional comparando admissao e atendimento 
      amount_redeem INT    NOT NULL , 					-- qtdade necessaria para o contrato ficar remido
      by_service boolean    DEFAULT TRUE  NOT NULL , 			-- remir por atendimento? 
      last_billing_number varchar  (3)    NOT NULL , 			-- ultima circular emitida (sbstituir por _id???) 
      last_issue_date date   , 						-- data da ultima 
      pending_process INT   , 						-- qtdade de servicos nao cobrados
      number_contracts INT   , 						-- qtdade de contratos no grupos
      number_lifes INT    NOT NULL , 					-- qtdade de inscritos no grupo
      death_count INT DEFAULT 0 ,					-- qtdade de atendimentos 
      next_billing_number varchar  (3)    NOT NULL , 			-- proxima circular (utilizado no processo de geracao da cobranca) 
      -- Add columns to group_batch table for death tracking (ad27s47)
      current_death_count INT DEFAULT 0 ,				-- verificar redundancia (amount_process, pending_process,...)
      last_death_charge_date TIMESTAMP ,				-- data da ultima cobranca
      death_threshold INT DEFAULT 10 NOT NULL ,				-- qtdade por cobranca (verificar com min_proc, max_proc
      -- 
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

-- Registro unico da cobrança gerada para o grupo. atual circular
CREATE TABLE charge( 
      charge_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      group_batch_id INT    NOT NULL , 
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

-- Processos da circular (para rateio) atual cprcirc - todos os processos cobrados nessa circular
CREATE TABLE prorated_service(
      prorated_service_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      charge_id INT NOT NULL ,
      service_funeral_id INT NOT NULL ,
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
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
  
-- Categoria de contratos, utilizada para diferenciar os benefícios e valores (Classes)
CREATE TABLE classe( 
      class_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      name varchar  (100)    NOT NULL , 				-- um nome para identificar 
      description varchar  (200)    NOT NULL , 				-- descricao dessa categoria
      amount_contracts INT   , 						-- qtdade de contratos nessa categoria (talvez um COUNT resolva)
      is_periodic boolean    DEFAULT TRUE  NOT NULL , 			-- default para mensais ou rateios
      purchase_value DECIMAL  (19,4)    NOT NULL , 			-- valor nominal (comum na cobrança)
      number_of_parcels INT    NOT NULL , 				-- ???
      generated_parcels INT    NOT NULL , 				-- ???
      month_value DECIMAL  (19,4)    NOT NULL , 			-- valor adicional mensal
      depend_value DECIMAL  (19,4)   , 					-- valor adicional por dependente
      number_of_month_valid INT   , 					-- ???
      is_renewable boolean   , 						-- ???
      is_renewable_used boolean   , 					-- ??? esses campos foram incluidos por algum motivo
      total_value DECIMAL  (19,4)   , 					-- ??? mas sabe Deus qual :(
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

--
-- =========================================================================
-- TABLES (GENERAL TABLES)  
-- =========================================================================
-- talvez necessário para apresentar os diferentes serviços utilizados pelo contrato
CREATE TABLE service_type( 
      service_type_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
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

-- Especialidades oferecidas pelos credenciados/medicos
CREATE TABLE specialty( 
      specialty_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
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

-- Status possiveis ao contrato (sequencia no kamban: 0[1-9]-vendas, 1[1-9]-Ativo, 2[1-9]-Cancelado, 3[1-9]-Suspenso,...)
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

-- Detalhamento do motivo da mudança de status do contrato (falta de pagamento, mudança de endereço, desistencia,...)
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

-- Add a death_event table to track deaths that trigger charges (ad27s47)
CREATE TABLE death_event (
    death_event_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    group_batch_id INT NOT NULL,
    beneficiary_id INT NOT NULL,
    service_funeral_id INT NOT NULL,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_for_billing BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (death_event_id),
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id),
    FOREIGN KEY (service_funeral_id) REFERENCES service_funeral(service_funeral_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Status para acompanhamento das baixas, desde o pagamento na recepção até o fechamento no plano.
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

--  Controle dos contratos para manter os números como único (não são permitidos dois com mesmo número)
CREATE TABLE contract_active( 
      contract_active_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      contract_number varchar  (20)    NOT NULL , 
      contract_id INT    NOT NULL , 
      created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
      updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
      deleted_at timestamp    DEFAULT NULL , 
      created_by INT   , 
      updated_by INT   , 
      deleted_by INT   , 
    PRIMARY KEY (contract_active_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- Contract Classes & grupos.  (talvez nao seja necessario limitar Classes em grupos pois existe um valor diferenciado na opcao) 
CREATE TABLE group_class( 
      group_class_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 
      sys_user_id INT    NOT NULL , 
      group_batch_id INT    NOT NULL , 
      class_id INT    NOT NULL , 
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

-- Produtos oferecidos aos clientes (contracts) antiga PrAdendos
CREATE TABLE addendum( 
      addendum_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      sys_unit_id INT    NOT NULL , 			-- adendo oferecido para qual unidade?
      general_status_id INT   , 				-- qual o status desse adendo?  Ativo, Suspenso ou Cancelado
      name varchar  (100)    NOT NULL , 			-- nome que descreve o adendo
      description varchar  (200)    NOT NULL , 			-- descricao da composicao do adendo  
      amount DECIMAL  (19,4) NOT NULL,				-- valor adicional 
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

--  limite de idade do beneficiário para ter direito aos adendos do contrato (atualmente é parte do classes)
CREATE TABLE age_addendum( 
      age_add_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      addendum_id INT    NOT NULL , 			-- limite de idade para o adendo da tabela
      class_id INT    NOT NULL , 				-- categoria para essa limitacao
      name varchar  (100)    NOT NULL , 			-- nome para identificar essa limitacao
      description varchar  (250)   , 				-- uma descricao qualquer
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
    FOREIGN KEY (class_id) REFERENCES classe(class_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

-- =========================================================================
-- BILLINGS
-- =========================================================================
-- Create billing cycle table (ad27s47)
CREATE TABLE billing_cycle (
    cycle_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    group_batch_id INT NOT NULL,
    death_event_count INT NOT NULL,
    charge_date TIMESTAMP NOT NULL,
    amount_per_contract DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (cycle_id),
    FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

-- Create contract billing record table (ad27s47)
CREATE TABLE contract_billing (
    billing_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    cycle_id INT NOT NULL,
    contract_id INT NOT NULL,
    charge_id INT ,
    amount DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    PRIMARY KEY (billing_id) ,
    FOREIGN KEY (cycle_id) REFERENCES billing_cycle(cycle_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (charge_id) REFERENCES contract_charge(contract_charge_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

-- Payment Plan Table Structure (ad27u15)
CREATE TABLE payment_plan (
    plan_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    contract_id INT NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    total_amount DECIMAL  (19,4) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT ,
    PRIMARY KEY (plan_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_plan_installment (
    installment_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    plan_id INT NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL  (19,4) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    paid_amount DECIMAL  (19,4) DEFAULT 0,
    paid_date DATE,
    charge_id INT ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    PRIMARY KEY (installment_id),
    FOREIGN KEY (plan_id) REFERENCES payment_plan(plan_id),
    FOREIGN KEY (charge_id) REFERENCES contract_charge(contract_charge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE payment_transaction (
    transaction_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    contract_id INT NOT NULL,
    charge_id INT ,
    installment_id INT ,
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
    FOREIGN KEY (charge_id) REFERENCES contract_charge(contract_charge_id) ,
    FOREIGN KEY (installment_id) REFERENCES payment_plan_installment(installment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;
--

-- Flexible Billing Rules (ad17u15)
CREATE TABLE billing_rule (
    rule_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    description TEXT,
    condition_expression TEXT,
    charge_expression TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (rule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;

CREATE TABLE billing_rule_application (
    application_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    rule_id INT NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'CONTRACT', 'GROUP', 'SERVICE'
    entity_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by INT ,
    PRIMARY KEY (application_id),
    FOREIGN KEY (rule_id) REFERENCES billing_rule(rule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ;


-- Add index for faster billing processing
CREATE INDEX idx_death_event_group_processed ON death_event (group_batch_id, processed_for_billing);
  
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
ALTER TABLE cep_cache ADD CONSTRAINT fk_cep_cache_cidade FOREIGN KEY (cidade_id) REFERENCES cidade(id); 
ALTER TABLE cep_cache ADD CONSTRAINT fk_cep_cache_estado FOREIGN KEY (estado_id) REFERENCES estado(id); 
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
-- Add group_id to service_funeral to track which group the death belongs to (ad27s47)
ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral_group FOREIGN KEY (group_batch_id) REFERENCES group_batch(group_batch_id);
--
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

-- audit_log which could grow large
ALTER TABLE audit_log 
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- Add Unique indexes
 CREATE UNIQUE INDEX unique_idx_addendum_name ON addendum  (name);
 CREATE UNIQUE INDEX unique_idx_address_type_name ON address_type  (name);
 CREATE UNIQUE INDEX unique_idx_age_addendum_name ON age_addendum  (name);
 CREATE UNIQUE INDEX unique_idx_class_name ON classe  (name);
 CREATE UNIQUE INDEX unique_idx_contract_active_contract_number ON contract_active  (contract_number);
 CREATE UNIQUE INDEX unique_idx_contract_status_name ON contract_status  (name);
 CREATE UNIQUE INDEX unique_idx_contract_status_code ON contract_status  (code);
 CREATE UNIQUE INDEX unique_idx_general_status_code ON general_status  (code);
 CREATE UNIQUE INDEX unique_idx_group_batch_name ON group_batch  (name);
 CREATE UNIQUE INDEX unique_idx_payment_status_name ON payment_status  (name);
 CREATE UNIQUE INDEX unique_idx_service_type_name ON service_type  (name);
 CREATE UNIQUE INDEX unique_idx_specialty_name ON specialty  (name);
 CREATE UNIQUE INDEX unique_idx_sys_unit_code ON sys_unit  (code);
 
-- Add indexes 
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

-- For sys_user table
CREATE INDEX idx_sys_user_login ON sys_user (login);
CREATE INDEX idx_sys_user_email ON sys_user (email);
CREATE INDEX idx_sys_user_active ON sys_user (active);

--  indices por datas ???
-- For audit_log table
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at);

-- For api_error table
CREATE INDEX idx_api_error_timestamp ON api_error (api_timestamp);

-- For charge table
CREATE INDEX idx_charge_issue_date ON charge (issue_date);
CREATE INDEX idx_charge_due_date ON charge (due_date);

-- For batch_chk table
CREATE INDEX idx_batch_chk_discharge_date ON batch_chk (discharge_date);
--  Indices compostos
-- For contract table
CREATE INDEX idx_contract_status_start_date ON contract (status_id, start_date);
CREATE INDEX idx_contract_class_status ON contract (class_id, status_id);

-- For contract_charge table
CREATE INDEX idx_contract_charge_contract_status ON contract_charge (contract_id, payment_status_id);
CREATE INDEX idx_contract_charge_due_date_status ON contract_charge (due_date, payment_status_id);

-- For service_funeral table
CREATE INDEX idx_service_funeral_occurr_category ON service_funeral (occurr_at, category);
CREATE INDEX idx_service_funeral_group_category ON service_funeral (group_batch_id, category);

-- For beneficiary table
CREATE INDEX idx_beneficiary_contract_primary ON beneficiary (contract_id, is_primary);
CREATE INDEX idx_beneficiary_contract_alive ON beneficiary (contract_id, is_alive);

-- For payment_plan_installment table
CREATE INDEX idx_payment_plan_installment_plan_status ON payment_plan_installment (plan_id, status);


-- Create a view for group status monitoring (ad27s47)
CREATE VIEW vw_group_billing_status AS
SELECT 
    gb.group_batch_id,
    gb.name AS group_name,
    gb.current_death_count,
    gb.death_threshold,
    gb.current_death_count >= gb.death_threshold AS ready_for_billing,
    COUNT(c.contract_id) AS contract_count,
    SUM(b.is_alives) AS total_beneficiary
FROM 
    group_batch gb
JOIN 
    contract c ON gb.group_batch_id = c.group_batch_id
LEFT JOIN (
    SELECT contract_id, COUNT(*) AS is_alives 
    FROM beneficiary 
    WHERE is_alive = TRUE OR is_alive IS NULL
    GROUP BY contract_id
) b ON c.contract_id = b.contract_id
GROUP BY gb.group_batch_id, gb.name, gb.current_death_count, gb.death_threshold;

-- Group death tracking view (ad27s27)
CREATE VIEW vw_group_death_tracking AS
SELECT 
    gb.group_batch_id,
    gb.name AS group_name,
    gb.current_death_count,
    gb.death_threshold,
    gb.current_death_count / gb.death_threshold AS completed_cycles,
    gb.current_death_count % gb.death_count AS remaining_deaths,
    COUNT(DISTINCT c.contract_id) AS contracts_affected,
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
    c.contract_id,
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
    contract_billing cb ON c.contract_id = cb.contract_id
JOIN 
    billing_cycle bc ON cb.cycle_id = bc.cycle_id
LEFT JOIN 
    death_event de ON bc.group_batch_id = de.group_batch_id 
    AND de.event_date <= bc.charge_date
LEFT JOIN 
    beneficiary b ON de.beneficiary_id = b.beneficiary_id
GROUP BY 
    c.contract_id, c.contract_number, gb.name, bc.charge_date, cb.amount, cb.status;

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
         action = 'AUTO_PROCESS'
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
    contract c ON pp.contract_id = c.contract_id
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
    contract c ON pp.contract_id = c.contract_id;
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
    contract c ON pt.contract_id = c.contract_id
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
SELECT c.contract_id, c.contract_number, c.start_date, c.end_date,
       COUNT(b.beneficiary_id) AS beneficiary_count
FROM contract c
LEFT JOIN beneficiary b ON c.contract_id = b.contract_id
WHERE c.end_date IS NULL OR c.end_date > CURDATE()
GROUP BY c.contract_id;

CREATE VIEW vw_unpaid_charges AS
SELECT cc.contract_charge_id, c.contract_number, 
       cc.due_date, cc.amount, cc.amount - COALESCE(cc.amount_paid, 0) AS balance
FROM contract_charge cc
JOIN contract c ON cc.contract_id = c.contract_id
WHERE cc.payment_status_id IN (
    SELECT payment_status_id FROM payment_status WHERE code IN ('PEND', 'PART')
);

-- Initial Setup for audit log (ad27t30)
-- Create an index for faster audit queries
CREATE INDEX idx_audit_auto_process ON audit_log(audit_action, process_name, created_at);

-- Create a system user for automated processes
INSERT INTO sys_user (sys_user_id, name, login, password, email, active) VALUES (0, 'System Automation', 'system', '', 'system@presserv.com.br', 'Y');
--


-- Death Event Processing (ae02o30)
-- Create a stored procedure to handle death registrations
-- Automatically increment group death counters
-- Trigger billing when threshold is reached
DELIMITER -- //

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
    JOIN contract c ON b.contract_id = c.contract_id
    WHERE b.beneficiary_id = p_beneficiary_id;
    
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
    WHERE group_batch_id = v_group_batch_id;
    
    -- Check if threshold reached
    IF v_current_count >= v_threshold THEN
        CALL trigger_group_billing(v_group_batch_id, v_current_count);
    END IF;
END -- //

-- Billing Trigger Procedure (ad27s47) / ae02o15)
CREATE PROCEDURE trigger_group_billing(
    IN p_group_batch_id INT,
    IN p_death_count INT
)
BEGIN
    DECLARE v_cycle_id INT;
    DECLARE v_rate_per_death DECIMAL  (19,4);
    DECLARE v_total_amount DECIMAL  (19,4);
    
    -- Get the current rate (would come from business rules)
    SELECT value_per_death INTO v_rate_per_death 
    FROM billing_rates 
    WHERE rate_type = 'FUNERAL';
    
    -- Calculate total amount per contract
    SET v_total_amount = p_death_count * v_rate_per_death;
    
    -- Create a new billing cycle
    INSERT INTO billing_cycle (group_batch_id, death_event_count, charge_date, amount_per_contract)
    VALUES (p_group_batch_id, p_death_count, CURRENT_TIMESTAMP, v_total_amount);
    
    SET v_cycle_id = LAST_INSERT_ID();
    
    -- Create billing records for all contracts in the group
    INSERT INTO contract_billing (cycle_id, contract_id, amount)
    SELECT v_cycle_id, contract_id, v_total_amount
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
END -- //



-- Create a Death Registration Function (ad27s47) (ae02o30)
--

-- Create Group Charge Function (ad27s47) (ae02o30)
DELIMITER //
CREATE PROCEDURE create_group_charge(
    p_group_batch_id INT,
    p_death_count INT
)
BEGIN
    DECLARE v_charge_id INT;
    DECLARE v_charge_number VARCHAR(7);
    DECLARE v_month_ref VARCHAR(100);
    DECLARE v_total_value DECIMAL  (19,4);
    DECLARE v_rate_per_death DECIMAL  (19,4) DEFAULT 50.00;
    
    -- Calculate total charge amount
    SET v_total_value = p_death_count * v_rate_per_death;
    
    -- Generate a charge number
    SET v_charge_number = CONCAT('CH', LPAD(NEXT_VAL('charge_seq'), 5, '0'));
    
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
    
    SET v_charge_id = LAST_INSERT_ID();
    
    -- Link funeral services to this charge
    INSERT INTO prorated_service (
        charge_id, service_funeral_id, sys_unit_id, sys_user_id
    )
    SELECT 
        v_charge_id, sf.service_funeral_id, 1, 1
    FROM 
        service_funeral sf
    WHERE 
        sf.group_batch_id = p_group_batch_id
        AND NOT EXISTS (
            SELECT 1 FROM prorated_service ps 
            WHERE ps.service_funeral_id = sf.service_funeral_id
        );
    
    -- Create contract charges for all contracts in the group
    CALL create_contract_charges(v_charge_id, p_group_batch_id, v_total_value);
    
    RETURN v_charge_id;
END -- //
--

-- Create Contract Charges Function (ad27s47) (ae02o30)
CREATE PROCEDURE create_contract_charges(
    IN p_charge_id INT,
    IN p_group_batch_id INT,
    IN p_total_value DECIMAL  (19,4)
)
BEGIN
    DECLARE v_contract_count INT;
    DECLARE v_individual_charge DECIMAL  (19,4);
    
    -- Count active contracts in group
    SELECT COUNT(*) INTO v_contract_count
    FROM contract c
    JOIN contract_status cs ON c.status_id = cs.status_id
    WHERE c.group_batch_id = p_group_batch_id
    AND cs.generate_charge = TRUE;
    
    -- Calculate individual charge amount
    SET v_individual_charge = ROUND(p_total_value / v_contract_count, 2);
    
    -- Create contract charge records
    INSERT INTO contract_charge (
        contract_id, unit_id, payment_status_id,
        charge_code, due_date, amount
    )
    SELECT 
        c.contract_id, 
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
END -- //

DELIMITER ;
--

-- Create Supporting Database Objects (ad27s47)
-- Create sequence for charge numbers if needed
--  ERRO nesta linha 
-- CREATE SEQUENCE charge_seq START WITH 1;

-- Create index for better performance
CREATE INDEX idx_service_funeral_group ON service_funeral(group_batch_id);
-- ERRO nesta linha abaixo
CREATE INDEX idx_contract_group_active ON contract(group_batch_id) 
 WHERE status_id IN (SELECT status_id FROM contract_status WHERE generate_charge = TRUE);
--

-- Audit Logging Function (ad27t30) (ae02o30)
DELIMITER -- //

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
END -- //

DELIMITER ;
--

-- Create a Payment Plan (ad27u15) (ae02o30)
DELIMITER -- //

CREATE FUNCTION create_payment_plan(
    p_contract_id INT,
    p_plan_name VARCHAR(100),
    p_total_amount DECIMAL  (19,4),
    p_start_date DATE,
    p_installment_count INT,
    p_frequency VARCHAR(20),
    p_user_id INT
) RETURNS INT
BEGIN
    DECLARE v_plan_id INT;
    DECLARE v_installment_amount DECIMAL  (19,4);
    DECLARE v_due_date DATE;
    DECLARE v_i INT;
    
    -- Calculate installment amount
    SET v_installment_amount = ROUND(p_total_amount / p_installment_count, 2);
    
    -- Create the payment plan
    INSERT INTO payment_plan (
        contract_id, plan_name, total_amount, start_date, created_by
    ) VALUES (
        p_contract_id, p_plan_name, p_total_amount, p_start_date, p_user_id
    );
    
    SET v_plan_id = LAST_INSERT_ID();
    
    -- Generate installments
    SET v_due_date = p_start_date;
    
    SET v_i = 1;
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
END -- //
--


-- Update Charge Status (ad27u15) ae02o30)
CREATE PROCEDURE update_charge_status(IN p_charge_id INT)
BEGIN
    DECLARE v_total_amount DECIMAL  (19,4);
    DECLARE v_paid_amount DECIMAL  (19,4);
    DECLARE v_new_status VARCHAR(20);
    
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
        amount_pago = v_paid_amount,
        payment_status_id = CASE 
            WHEN v_new_status = 'PAID' THEN (SELECT payment_status FROM payment_status WHERE name = 'Paid')
            WHEN v_new_status = 'PARTIAL' THEN (SELECT payment_status FROM payment_status WHERE name = 'Partial')
            ELSE payment_status_id
        END
    WHERE contract_charge_id = p_charge_id;
END -- //
--

-- Converting Group Charges to Payment Plans (ad27u15) (ae03s0)
DELIMITER -- //

CREATE FUNCTION convert_charge_to_payment_plan(
    p_charge_id INT,
    p_installment_count INT,
    p_start_date DATE,
    p_frequency VARCHAR(20),
    p_user_id INT
) RETURNS INT
BEGIN
    DECLARE v_plan_id INT;
    DECLARE v_contract_id INT;
    DECLARE v_total_amount DECIMAL  (19,4);
    DECLARE v_plan_name VARCHAR(100);
    
    -- Get charge details
    SELECT contract_id, amount INTO v_contract_id, v_total_amount
    FROM contract_charge
    WHERE contract_charge_id = p_charge_id;
    
    -- Create plan name
    SELECT CONCAT('Payment Plan for Charge ', charge_code) INTO v_plan_name
    FROM contract_charge
    WHERE contract_charge_id = p_charge_id;
    
    -- Create the payment plan
    SELECT create_payment_plan(
        v_contract_id,
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
    SET payment_status_id = (SELECT payment_status FROM payment_status WHERE name = 'Payment Plan')
    WHERE contract_charge_id = p_charge_id;
    
    RETURN v_plan_id;
END -- //

DELIMITER ;--




INSERT INTO document_type (document_type_id,description,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (1,'CPF',null,null,null,null,null,null); 

INSERT INTO document_type (document_type_id,description,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (2,'RG',null,null,null,null,null,null); 

INSERT INTO document_type (document_type_id,description,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (3,'CNH',null,null,null,null,null,null); 

INSERT INTO gender (gender_id,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by,name) VALUES (1,null,null,null,null,null,null,'Masculino'); 

INSERT INTO gender (gender_id,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by,name) VALUES (2,null,null,null,null,null,null,'Feminino'); 

INSERT INTO subsidiary (subsidiary_id,name,code,status,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (1,'Matriz','BPL','1','CURRENT_TIMESTAMP','NULL ON UPDATE CURRENT_TIMESTAMP','NULL',1,1,null); 

INSERT INTO subsidiary (subsidiary_id,name,code,status,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (2,'Poços','POC','1','CURRENT_TIMESTAMP','NULL ON UPDATE CURRENT_TIMESTAMP','NULL',1,1,null); 

INSERT INTO sys_group (sys_group_id,name,uuid) VALUES (1,'Admin',null); 

INSERT INTO sys_group (sys_group_id,name,uuid) VALUES (2,'Standard',null); 

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

INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (11,'System Sql Log','SystemSqlLogList',''); 

INSERT INTO sys_program (s_program_id,name,controller,actions) VALUES (12,'System Profile View','SystemProfileView',''); 

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

INSERT INTO sys_unit (sys_unit_id,subsidiary_id,general_status_id,name,connection_name,code) VALUES (1,1,null,'Matriz','matriz','BPL'); 

INSERT INTO sys_user_group (s_user_group_id,sys_user_id,sys_group_id) VALUES (1,1,1); 

INSERT INTO sys_user_group (s_user_group_id,sys_user_id,sys_group_id) VALUES (2,2,2); 

INSERT INTO sys_user_group (s_user_group_id,sys_user_id,sys_group_id) VALUES (3,1,2); 

INSERT INTO sys_user_program (s_user_program_id,sys_user_id,sys_program_id) VALUES (1,2,7); 

INSERT INTO sys_user (sys_user_id,name,login,password,email,frontpage_id,sys_unit_id,active,accepted_term_policy_at,accepted_term_policy,two_factor_enabled,two_factor_type,two_factor_secret,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (1,'Administrator','admin','21232f297a57a5a743894a0e4a801fc3','admin@admin.net',10,null,'Y','','','N','','',null,null,null,null,null,null); 

INSERT INTO sys_user (sys_user_id,name,login,password,email,frontpage_id,sys_unit_id,active,accepted_term_policy_at,accepted_term_policy,two_factor_enabled,two_factor_type,two_factor_secret,created_at,updated_at,deleted_at,created_by,updated_by,deleted_by) VALUES (2,'User','user','ee11cbb19052e40b07aac0ca060c23ee','user@user.net',7,null,'Y','','','N','','',null,null,null,null,null,null); 

INSERT INTO sys_user_unit (s_user_unit_id,sys_user_id,sys_unit_id) VALUES (1,1,1); 



-- Modify the register_service_funeral function to include auditing (ad27t30)
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
END; 
--

-- Record a Payment (ad27u15) (ae02o30)
CREATE FUNCTION record_payment(
    p_contract_id INT,
    p_amount DECIMAL  (19,4),
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
    DECLARE v_remaining_amount DECIMAL  (19,4) DEFAULT p_amount;
    DECLARE v_installment_id INT;
    DECLARE v_installment_amount DECIMAL  (19,4);
    DECLARE v_paid_amount DECIMAL  (19,4);
    DECLARE v_apply_amount DECIMAL  (19,4);
    
    -- Create the payment transaction
    INSERT INTO payment_transaction (
        contract_id, charge_id, installment_id,
        amount, payment_date, payment_method,
        reference_number, notes, created_by
    ) VALUES (
        p_contract_id, p_charge_id, p_installment_id,
        p_amount, p_payment_date, p_payment_method,
        p_reference_number, p_notes, p_user_id
    );
    
    SET v_transaction_id = LAST_INSERT_ID();
    
    -- If linked to a specific installment, update it
    IF p_installment_id IS NOT NULL THEN
        SELECT amount, paid_amount INTO v_installment_amount, v_paid_amount
        FROM payment_plan_installment
        WHERE installment_id = p_installment_id;
        
        UPDATE payment_plan_installment
        SET 
            paid_amount = LEAST(v_paid_amount + p_amount, v_installment_amount),
            paid_date = IF(v_paid_amount + p_amount >= v_installment_amount, p_payment_date, paid_date),
            status = CASE 
                WHEN v_paid_amount + p_amount >= v_installment_amount THEN 'PAID'
                WHEN v_paid_amount + p_amount > 0 THEN 'PARTIAL'
                ELSE status
            END
        WHERE installment_id = p_installment_id;
    END IF;
    
    -- If no specific installment, apply to oldest unpaid installments
    IF p_installment_id IS NULL THEN
        DECLARE done INT DEFAULT FALSE;
        DECLARE cur CURSOR FOR 
            SELECT installment_id, amount, paid_amount 
            FROM payment_plan_installment
            WHERE plan_id IN (SELECT plan_id FROM payment_plan WHERE contract_id = p_contract_id)
            AND status <> 'PAID'
            ORDER BY due_date;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
        
        OPEN cur;
        read_loop: LOOP
            FETCH cur INTO v_installment_id, v_installment_amount, v_paid_amount;
            IF done OR v_remaining_amount <= 0 THEN
                LEAVE read_loop;
            END IF;
            
            -- Calculate amount to apply to this installment
            SET v_apply_amount = LEAST(v_remaining_amount, v_installment_amount - v_paid_amount);
            
            UPDATE payment_plan_installment
            SET 
                paid_amount = paid_amount + v_apply_amount,
                paid_date = IF(paid_amount + v_apply_amount >= amount, p_payment_date, paid_date),
                status = CASE 
                    WHEN paid_amount + v_apply_amount >= amount THEN 'PAID'
                    WHEN paid_amount + v_apply_amount > 0 THEN 'PARTIAL'
                    ELSE status
                END
            WHERE installment_id = v_installment_id;
            
            SET v_remaining_amount = v_remaining_amount - v_apply_amount;
        END LOOP;
        CLOSE cur;
    END IF;
    
    -- Update contract charge status if specified
    IF p_charge_id IS NOT NULL THEN
        CALL update_charge_status(p_charge_id);
    END IF;
    
    RETURN v_transaction_id;
END -- //
--

-- Applying Partial Payments to Multiple Charges (ad27u15) (ae03s50)
DELIMITER -- //

CREATE PROCEDURE apply_partial_payment_to_contract(
    IN p_contract_id INT,
    IN p_amount DECIMAL  (19,4),
    IN p_payment_date DATE,
    IN p_payment_method VARCHAR(50),
    IN p_reference_number VARCHAR(100),
    IN p_notes TEXT,
    IN p_user_id INT,
    OUT p_transaction_ids TEXT
)
BEGIN
    DECLARE v_remaining_amount DECIMAL  (19,4) DEFAULT p_amount;
    DECLARE v_charge_id INT;
    DECLARE v_charge_amount DECIMAL  (19,4);
    DECLARE v_paid_amount DECIMAL  (19,4);
    DECLARE v_apply_amount DECIMAL  (19,4);
    DECLARE v_transaction_id INT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Initialize transaction IDs as comma-separated string
    SET p_transaction_ids = '';
    
    -- Cursor for unpaid charges
    DECLARE charge_cursor CURSOR FOR 
        SELECT contract_charge_id, amount 
        FROM contract_charge
        WHERE contract_id = p_contract_id
        AND payment_status_id IN (
            SELECT payment_status FROM payment_status WHERE name IN ('Pending', 'Partial')
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
        CALL record_payment(
            p_contract_id,
            v_apply_amount,
            p_payment_date,
            p_payment_method,
            p_reference_number,
            p_notes,
            p_user_id,
            v_charge_id,
            NULL, -- No specific installment
            v_transaction_id
        );
        
        -- Add to results
        IF p_transaction_ids = '' THEN
            SET p_transaction_ids = v_transaction_id;
        ELSE
            SET p_transaction_ids = CONCAT(p_transaction_ids, ',', v_transaction_id);
        END IF;
        
        SET v_remaining_amount = v_remaining_amount - v_apply_amount;
    END LOOP;
    
    CLOSE charge_cursor;
    
    -- If any amount remains, create a credit transaction
    IF v_remaining_amount > 0 THEN
        CALL record_payment(
            p_contract_id,
            v_remaining_amount,
            p_payment_date,
            p_payment_method,
            p_reference_number,
            'Credit balance from partial payment',
            p_user_id,
            NULL, -- No specific charge
            NULL, -- No specific installment
            v_transaction_id
        );
        
        -- Add to results
        IF p_transaction_ids = '' THEN
            SET p_transaction_ids = v_transaction_id;
        ELSE
            SET p_transaction_ids = CONCAT(p_transaction_ids, ',', v_transaction_id);
        END IF;
    END IF;
END -- //

DELIMITER ;
--


-- CREATE TRIGGER update_address_modtime
--     BEFORE UPDATE ON address
--     FOR EACH ROW
--     EXECUTE FUNCTION update_modified_column();

-- CREATE TRIGGER update_contract_modtime
--     BEFORE UPDATE ON contract
--     FOR EACH ROW
--     EXECUTE FUNCTION update_modified_column();

-- CREATE TRIGGER update_beneficiary_modtime
--     BEFORE UPDATE ON beneficiary
--     FOR EACH ROW
--     EXECUTE FUNCTION update_modified_column();

-- CREATE TRIGGER update_class_modtime
--     BEFORE UPDATE ON classe
--     FOR EACH ROW
--     EXECUTE FUNCTION update_modified_column();

COMMIT ;

