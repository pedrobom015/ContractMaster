set date brit
set dele on
set cent on

? "Preenchendo campos de referencia do contrato" 


sele 0
use grupos 

sele 0 
? "Reorganizando cobrador"
use cobrador
inde on cobrador to cobaux
sele grupos
? "identificando cobradores"
set rela to cobrador into cobrador 
go top
do while !eof()
 repl cob_id with cobrador->id, reg_id with cobrador->id
 skip
endd

sele grupos
? "identificando vendedores (cobradores e vendedores estao na mesma tabela)"
set rela to vendedor into cobrador 
go top
do while !eof()
 repl ven_id with cobrador->id
 skip
endd
sele cobrador 
use 

? "Identificando a categoria"
sele 0
use classes
inde on classcod to clatmp
go top 
do while !eof()
 repl class_id with 100+val(classcod)
 skip
endd

set date ansi

? "criando insert das tabelas básicas:"

file_dest:="tables.sql"
set print to ("tables.sql")
set devi to print 
set print on
sql_inicial()
sql_classes()
sql_arqgrup()
sql_grupos()
sql_document()
sql_entity_doc()
sql_benefic()
sql_contract_charge()
sql_cobrador()

set print to ("tables.sql")

return .t.

function sql_inicial
set print to ("tables1.sql")
inkey(2)

? "INSERT INTO `schema_version` (`version_id`, `version`, `applied_at`, `description`) VALUES (1, '1.0.0', '2025-06-24 12:13:18', 'Initial contracts management system schema');"
? "INSERT INTO `sys_unit` (`sys_unit_id`, `subsidiary_id`, `general_status_id`, `name`, `connection_name`, `code`) VALUES ('1', '1', '1', 'Unidade basica', NULL, 'LIM');"
? "INSERT INTO `gender` (`gender_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', 'Masculino', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `gender` (`gender_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('2', 'Feminino', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `gender` (`gender_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('3', 'Ignorado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `document_type` (`document_type_id`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', 'CPF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `document_type` (`document_type_id`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('2', 'RG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `document_type` (`document_type_id`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('3', 'CNH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
// Estudar uma tabela de status de pagamento para deixar mais detalhado (pagamento em banco: com cartão, pix,..., gerada manualmente, por processo, 
// por negociacao,..., impressa, e-mail, whasapp,..., )
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('01', 'Gerada', '01', '1', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('02', 'Impressa', '02', '2', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('03', 'Enviada', '03', '3', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('04', 'Rejeitada', '04', '4', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('05', 'Aceita', '05', '5', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('06', 'Paga na recepção', '06', '6', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('07', 'Paga em Banco', '07', '6', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('08', 'Baixada na Cobranca', '08', '8', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `payment_status` (`payment_status_id`, `name`, `code`, `kanban`, `color`, `kanban_order`, `final_state`, `initial_state`, `allow_edition`, `allow_deletion`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('09', 'Baixada na Adm', '099', '9', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `estado` (`id`, `name`, `uf`, `codigo_ibge`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', 'São Paulo', 'SP', '35', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `cidade` (`id`, `estado_id`, `name`, `codigo_ibge`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', '1', 'Limeira', '3526902', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `currency` (`currency_code`, `currency_name`, `currency_symbol`, `decimal_places`, `rounding_method`, `active`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('BRL', 'REAL', 'BRL', '2', 'HALF_UP', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `address_type` (`address_type_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `column_9`) VALUES ('1', 'Residencia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL);"
? "INSERT INTO `address_type` (`address_type_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `column_9`) VALUES ('2', 'Trabalho', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL);"
? "INSERT INTO `address_type` (`address_type_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `column_9`) VALUES ('3', 'Cobranca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL);"

? "INSERT INTO `address` (`address_id`, `sys_user_id`, `address_type_id`, `is_main`, `zip_code`, `address`, `address_number`, `address_line1`, `address_line2`, `city`, `state`, `country`, `observacao`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) " 
? " VALUES ('1', '1', '1', '1', '13485392','Rua Apparecida Bosqueiro Boldrin', '221' ,'Jd Porto Real II', NULL, 'Limeira', 'SP', 'BR','OBS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "SET @address_id = LAST_INSERT_ID();"
? "INSERT INTO `company` (`company_id`, `parent_company_id`, `company_name`, `legal_name`, `tax_id`, `address_id`, `country`, `phone`, `email`, `website`, `logo_url`, `fiscal_year_start`, `default_currency`, `is_consolidated`, `is_active`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', NULL, 'Presserv Informática', 'Presserv Informática Ltda.', 'Nao definido', '1', 'BR', '+55 (19)3452.3712', 'contato@presserv.com.br', 'https://www.presserv.com.br', NULL, '2025', 'BRL', '0', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "SET @company_id = LAST_INSERT_ID();"
? "INSERT INTO entity_address (entity_type, entity_id, address_id, is_primary) "
? "VALUES ('company',@company_id,@address_id, TRUE); "

// Estudar um melhor controle, apenas o can_admin parece ser insuficiente
? "INSERT INTO `user_company_access` (`sys_user_id`, `company_id`, `can_view`, `can_edit`, `can_approve`, `can_admin`, `created_at`, `updated_at`) VALUES ('1', '1', '1', '1', '1', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
? "INSERT INTO `subsidiary` (`subsidiary_id`, `name`, `code`, `status`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', 'Limeira', 'LIM', 'REVISAR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `partner_type` (`partner_type_id`, `company_id`, `type_name`, `description`, `is_system`, `active`, `created_at`, `updated_at`) VALUES ('1', '1', 'Colaborador', 'Colaborador', '0', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
? "INSERT INTO `partner_type` (`partner_type_id`, `company_id`, `type_name`, `description`, `is_system`, `active`, `created_at`, `updated_at`) VALUES ('2', '1', 'Cliente', 'Cliente', '0', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
? "INSERT INTO `partner_type` (`partner_type_id`, `company_id`, `type_name`, `description`, `is_system`, `active`, `created_at`, `updated_at`) VALUES ('3', '1', 'Fornecedor', 'Fornecedor ', '0', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
? "INSERT INTO `account_type` (`account_type_id`, `company_id`, `type_name`, `nature`, `description`, `is_system`, `active`, `created_at`, `updated_at`) VALUES ('1', '1', 'Conta Banco', 'ASSET', 'Conta de movimentação bancaria', '0', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
? "INSERT INTO `address_type` (`address_type_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `column_9`) VALUES ('1', 'Residencia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL);"
? "INSERT INTO `address_type` (`address_type_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `column_9`) VALUES ('2', 'Trabalho', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL);"
? "INSERT INTO `address_type` (`address_type_id`, `name`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `column_9`) VALUES ('3', 'Cobranca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL);"
? "INSERT INTO `specialty` (`specialty_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', '1', '1', 'Cobrador', 'Cobrador', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `specialty` (`specialty_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('2', '1', '1', 'Vendedor', 'Vendedor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `specialty` (`specialty_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('3', '1', '1', 'Fornecedor', 'Fornecedor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `specialty` (`specialty_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('4', '1', '1', 'Colaborador', 'Colaborador', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "INSERT INTO `specialty` (`specialty_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('5', '1', '1', 'Outros', 'Outros', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"

return .t.

function sql_classes
sele classes
inde on classcod to clatmp
go top 
set print to ("tables2.sql")
inkey(2)

// INSERT INTO `classe` (`class_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `amount_contracts`, `is_periodic`, `purchase_value`, `number_of_parcels`, `generated_parcels`, `month_value`, `depend_value`, `number_of_month_valid`, `is_renewable`, `is_renewable_used`, `total_value`, `message1`, `message2`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('100', '1', '1', 'Categoria Basica', 'Plano Basico A', '0', '1', 10, 20, 30, 40, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);

?
? "INSERT INTO `"+"classe` (`class_id`, `sys_unit_id`, `sys_user_id`, `name`, `description`, `amount_contracts`, `is_periodic`, `purchase_value`, `number_of_parcels`, `generated_parcels`, `month_value`, `depend_value`, `number_of_month_valid`, `is_renewable`, `is_renewable_used`, `total_value`, `message1`, `message2`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`)"
?? " VALUES "   //  CREATE TABLE classe(
linecreated:=.F. 
do while !eof()
 repl class_id with 100+val(classcod)
 if (linecreated)
  ?? ","
 endif
 ? " ('"+alltrim(str(class_id))+"',"
 ?? "'"+"1', "
 ?? "'"+"1', "
 ?? "'"+classcod+"-"+alltrim(descricao)+"', "     // name
 ?? "'"+alltrim(descricao)    +"', "   	// descritino
 ?? "'"+alltrim(str(contrat)) +"', "	// amount_contracts
 ?? "'"+iif(prior=[S],"1","0")+"', "	// is_periodic
 ?? "'"+alltrim(str(vljoia))  +"', " 	// purchase_value
 ?? "'"+alltrim(str(nrparc))  +"', "	// number_of_parcels
 ?? "'"+alltrim(str(parcger)) +"', " 	// generated_parcels  
 ?? "'"+alltrim(str(vlmensal))+"', "	// month_value
 ?? "'"+alltrim(str(vldepend))+"', "	// depend_value
 ?? "'"+alltrim(str(nrmesval))+"', "	// number_of_month_valid
 ?? "'"+"1', "	// is_renewable
 ?? "'"+"1', "	// is_renewable_used
 ?? "'"+alltrim(str(vltotal)) +"', "	// total_value
 ?? "NULL, NULL, CURRENT_TIMESTAMP,"    // message1, message2, created_at
 ?? "CURRENT_TIMESTAMP, NULL,"		// updated_at, deleted_at
 ?? "NULL, NULL, NULL"			// created_by, updated_by, deleted_by
 ?? ")"
 linecreated:=.T.
 skip
endd
IF (linecreated)
 ?? " ; "
 ?
ENDIF
RETURN .T.

FUNCTION  sql_arqgrup
use arqgrup
inde on grup to clatmp
go top 
set print to ("tables3.sql")
inkey(2)

// INSERT INTO `group_batch` (`group_batch_id`, `sys_unit_id`, `sys_user_id`, `name`, `group_code`, `class_id`, `begin_code`, `final_code`, `is_periodic`, `amount_process`, `min_proc`, `max_proc`, `compare_admission`, `amount_redeem`, `by_service`, `last_billing_number`, `last_issue_date`, `pending_process`, `number_contracts`, `number_lifes`, `death_count`, `next_billing_number`, `current_death_count`, `last_death_charge_date`, `death_threshold`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('16571', '1', '1', 'Grupo Principal', 'AG', '100', '000000001', '099999999', '0', '10', '7', '10', '0', '50', '1', '123', '2025-06-01', NULL, NULL, '', '0', '', '0', NULL, '10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL)

? "INSERT INTO `group_batch` (`group_batch_id`, `sys_unit_id`, `sys_user_id`, `name`, `group_code`, `class_id`, `begin_code`, `final_code`, `is_periodic`, `amount_process`, `min_proc`, `max_proc`, `compare_admission`, `amount_redeem`, `by_service`, `last_billing_number`, `last_issue_date`, `pending_process`, `number_contracts`, `number_lifes`, `death_count`, `next_billing_number`, `current_death_count`, `last_death_charge_date`, `death_threshold`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`)"
?? " VALUES "   //  CREATE TABLE group_batch
linecreated:=.F. 
do while !eof()
  if (linecreated)
   ?? ","
  endif
  gruaux:="1"+strzero(asc(left(grup,1)),2)    // A=65
  if right(grup,1)$[123456789]
   gruaux+="0"+right(grup,1)		   // A1=6501
  elseif right(grup,1)>=[A]
   gruaux+=strzero(asc(right(grup,1)),2)    // AG=6571
  endif
// repl arq_id with gruaux
 ? " ('"+gruaux+"',"     		//group_batch_id
 ?? "'"+"1"+"', "	// sys_unit_id
 ?? "'"+"l"+"', "	// sys_user_id
 ?? "'"+alltrim( grup) +"', "	// name
 ?? "'"+alltrim( grup ) +"', "	// group_code
 ?? "'"+alltrim(str(100+val(classe))) +"', "	// class_id
 ?? "'"+alltrim( inicio ) +"', "	// begin_code
 ?? "'"+alltrim( final ) +"', "	// final_code
 ?? "'" +"N', "	// is_periodic
 ?? "'"+alltrim(str( acumproc )) +"', "	// amount_process
 ?? "'"+alltrim(str( maxproc )) +"', "	// min_proc
 ?? "'"+alltrim(str( maxproc )) +"', "	// max_proc
 ?? "'"+"1', "	// compare_admission
 ?? "'"+alltrim(str( qtdremir )) +"', "	// amount_redeem
 ?? "'"+alltrim(poratend) +"', "	// by_service
 ?? "'"+alltrim(str( val(ultcirc))) +"', "	// last_billing_number
 ?? "'"+dtoc(emissao_ ) +"', "	// last_issue_date
 ?? "'"+alltrim(str( procpend )) +"', "	// pending_process
 ?? "'"+alltrim(str( contrat )) +"', "	// number_contracts
 ?? "'"+alltrim(str( partic )) +"', "	// number_lifes
 ?? "'"+alltrim(str( procpend )) +"', "	// death_count
 ?? "'"+alltrim(str(val( proxcirc) )) +"', "	// next_billing_number
 ?? "'"+alltrim(str( procpend )) +"', "	// current_death_count
 ?? "'"+dtoc( emissao_ ) +"', "	// last_death_charge_date
 ?? "'10', "	// death_threshold
 ?? "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL,"	// created_at, updated_at, deleted_at
 ?? "NULL, NULL, NULL"			// created_by, updated_by, deleted_by
 ?? ")"
 linecreated:=.T.
 skip
enddo
IF (linecreated)
 ?? " ; "
 ?
ENDIF
return .T. 

FUNCTION sql_grupos
sele grupos
go top
// 
set print to ("contract.sql")

? "INSERT INTO `"+"CONTRACT` (`contract_id`,`sys_unit_id`,`sys_user_id`,`group_batch_id`,`owner_id`,`class_id`,`status_id`,`contract_number`,`contract_type`,`start_date`,`end_date`,`billing_frequenc`,`admission`,`final_grace`,`month_initial_billing`,`year_initial_billing`,`opt_payday`,`collector_id`,`seller_id`,`region_id`,`obs`,`services_amount`,`renew_at`,`first_charge`,`last_charge`,`charges_amount`,`charges_paid`,`alives`,`deceaseds`,`dependents`,`service_option1`,`service_option2`,`indicated_by`,`grace_period_days`,`late_fee_percentage`,`is_partial_payments_allowed`,`default_plan_installments`,`default_plan_frequency`,`industry`,`created_at`,`updated_at`,`deleted_at`,`created_by`,`updated_by`,`deleted_by`)"

?? " VALUES "  // CREATE TABLE contract( 

linecreated:=.F.

do while !eof()
   if (linecreated)
    ?? ","
   endif
   ? "('"+alltrim(codigo)+"',"   	//    contract_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
   ?? "'"+"1',"		//    sys_unit_id INT UNSIGNED   NOT NULL , 
   ?? "'"+"1',"		//    sys_user_id INT UNSIGNED   NOT NULL , 
   //   group_batch_id INT UNSIGNED   NOT NULL , 
   gruaux:="1"+strzero(asc(left(grupo,1)),2)    // A=65
   if right(grupo,1)$[123456789]
    gruaux+="0"+right(grupo,1)		   // A1=6501
   elseif right(grupo,1)>=[A]
    gruaux+=strzero(asc(right(grupo,1)),2)    // AG=6571
   endif
   ?? "'"+gruaux+"',"       
   ?? "'"+alltrim(codigo)+"',"		    //owner_id INT UNSIGNED   NOT NULL , 					
   ?? "'"+alltrim(str(100+val(tipcont)))+"'," // class_id INT UNSIGNED   NOT NULL ,  					 
   ?? "'"+alltrim(str(val(situacao)*10))+"'," //   status_id INT    NOT NULL , 					 
   ?? "'"+codigo+"'," //   contract_number varchar  (20)    NOT NULL , 			
   ?? iif(empt(tipcont),  "NULL,","'"+tipcont+"',") //  contract_type varchar  (50)    NOT NULL , 			 
   ?? iif(empt(admissao), "NULL,","'"+dtoc(admissao)+"',") //     start_date date    NOT NULL , 					
   ?? "NULL," //    end_date date   , 						
   ?? iif(empt(formapgto),"NULL,","'"+formapgto+"',") //     billing_frequenc INT    DEFAULT 1  NOT NULL , 			
   ?? iif(empt(admissao), "NULL,","'"+dtoc(admissao)+"',") //     admission date    NOT NULL ,      				
   ?? iif(empt(tcarencia),"NULL,","'"+dtoc(tcarencia) +"',") //     final_grace date   , 						
   ?? iif(empt(saitxa),"NULL,","'"+left(saitxa,2)+"',") //     month_initial_billing char  (2)    NOT NULL , 			 
   ?? iif(empt(saitxa),"NULL,","'"+iif(right(saitxa,2)>[50],"19","20")+"',") //     year_initial_billing char  (4)    NOT NULL , 			
   ?? iif(empt(diapgto),"NULL,","'"+iif(diapgto>[00],diapgto,[])+"',") //     opt_payday INT   , 						
   ?? iif(empt(cob_id),"NULL,","'"+alltrim(str(cob_id))+"',") //  collector_id INT  UNSIGNED   , 						
   ?? iif(empt(ven_id),"NULL,","'"+alltrim(str(ven_id))+"',") //   seller_id INT  UNSIGNED   , 						
   ?? iif(empt(cob_id),"NULL,","'"+alltrim(str(cob_id))+"',") //     region_id INT   UNSIGNED  , 						 
   ?? iif(empt(obs),"NULL,","'"+obs+"',") //     obs text   , 							
   ?? IIF(EMPT(funerais),"'0","'"+alltrim(str(funerais))) +"'," //     services_amount INT   , 						 
   ?? iif(empt(renovar),"NULL,","'"+dtoc(renovar)+"',") //     renew_at date   , 						
   ?? "'"+alltrim(str(val(circinic))) +"'," //     first_charge INT   , 						
   ?? "'"+alltrim(str(val(ultcirc))) +"'," //     last_charge INT   , 						
   ?? "'"+alltrim(str(qtcircs)) +"'," //     charges_amount INT   , 						
   ?? "'"+alltrim(str(qtcircpg)) +"'," //     charges_paid INT   , 						 
   ?? "'"+alltrim(str(particv)) +"'," //     alives INT   , 							
   ?? "'"+alltrim(str(particf)) +"'," //     deceaseds INT   , 						
   ?? "'"+alltrim(str(nrdepend)) +"'," //     dependents INT   , 						
   ?? iif(empt(atend1),"NULL,","'"+alltrim(atend1)+"',") //     service_option1 varchar  (100)   , 				
   ?? iif(empt(atend2),"NULL,","'"+alltrim(atend2)+"',") //     service_option2 varchar  (100)   , 				
   ?? "NULL," //     indicated_by INT   , 						
   ?? "NULL," //     grace_period_days varchar (15)  ,					
   ?? "NULL," //     late_fee_percentage DECIMAL  (8,5) ,				 
   ?? "'"+"1'," //     is_partial_payments_allowed boolean ,				
   ?? "NULL," //     default_plan_installments varchar(6)  ,	
   if formapgto=[01]			
     ?? "'MENSAL"+"'," //     default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,		
   elseif formapgto=[02]			
     ?? "'BIMESTRAL"+"'," //     default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,		
   else			
     ?? "'RATEIO"+"'," //     default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,	
   endif	
   ?? "'FUNERAL"+ "'," //     industry VARCHAR(50) DEFAULT 'FUNERAL' ,				
   ?? "'"+DTOC(ULTIMP_) +"'," //     created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
   ?? "'"+DTOC(ENDER_) +"',NULL,NULL,NULL,NULL)" //     updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
   linecreated:=.T.
   SKIP
ENDDO
IF (linecreated)
 ?? " ; "
 ?
ENDIF
return .T. 

function sql_document
sele grupos
go top
set print to ("tables4.sql")
inkey(2)

// INSERT INTO `document` (`document_id`, `sys_user_id`, `document_type_id`, `document_number`, `filename`, `file_path`, `file_size`, `mime_type`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('140110101', '1', '1', '12345678999', '', '', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);
? "INSERT INTO `"+"document` (`document_id`, `sys_user_id`, `document_type_id`, `document_number`, `filename`, `file_path`, `file_size`, `mime_type`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`)"

?? " VALUES "  // CREATE TABLE contract( 

linecreated:=.F.
contaux:=1
do while !eof()
   if (linecreated)
    ?? ","
   endif
   //  CPF
   if !empt(grupos->cpf)
    ?? "('"+alltrim(codigo)+"01',"   	//    document_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
    ?? "'"+"1'," //sys_user_id`, `
    ?? "'"+"1'," //document_type_id`, `
    ?? "'"+grupos->cpf+"'," //document_number `, `
    ?? "'', '', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL) "   //filename, file_path, file_size, mime_type, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by
   endif
   //  RG 
   if !empt(grupos->rg)
    if !empt(grupos->cpf)
     ?? ", "
    endif
    ?? "('"+alltrim(codigo)+"02',"   	//    document_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
    ?? "'"+"1'," //sys_user_id`, `
    ?? "'"+"1'," //document_type_id`, `
    ?? "'"+ALLTRIM(grupos->rg)+"'," //document_number `, `
    ?? "'', '', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL) "
   endif
   linecreated:=.T.
   SKIP
ENDDO
IF (linecreated)
 ?? " ; "
 ?
ENDIF
return .T. 

function sql_entity_doc
sele grupos
go top
set print to ("tables5.sql")
inkey(2)

// INSERT INTO `entity_document` (`id`, `entity_type`, `entity_id`, `document_id`, `is_active`) VALUES ('140110101', 'client', '1401101', '140110101', '1');
? "INSERT INTO `entity_document` (`id`, `entity_type`, `entity_id`, `document_id`, `is_active`) "

?? " VALUES "  // CREATE TABLE contract( 

linecreated:=.F.
contaux:=1
do while !eof()
   if (linecreated)
    ?? ","
   endif
   //  CPF
   if !empt(grupos->cpf)
    ?? "('"+alltrim(codigo)+"01',"   	//    id 
    ?? "'"+"client'," 			//    entity_type
    ?? "'"+alltrim(codigo)+"',"   	//    entity_id
    ?? "'"+alltrim(codigo)+"01',"   	//    document_id
    ?? "'"+"1')" 			//is_active 
   endif
   //  RG 
   if !empt(grupos->rg)
    if !empt(grupos->cpf)
     ?? ", "
    endif
    ?? "('"+alltrim(codigo)+"02',"   	//    id 
    ?? "'"+"client'," 			//    entity_type 
    ?? "'"+alltrim(codigo)+"',"   	//    entity_id
    ?? "'"+alltrim(codigo)+"02',"   	//    document_id
    ?? "'"+"1') " 			//  is_active 
   endif
   linecreated:=.T.
   SKIP
ENDDO
IF (linecreated)
 ?? " ; "
 ?
ENDIF
return .T. 


function sql_benefic
use inscrits
go top
set print to ("benefic.sql")

//INSERT INTO `beneficiary` (`beneficiary_id`, `sys_unit_id`, `contract_id`, `relationship`, `is_primary`, `name`, `birth_at`, `is_forbidden`, `gender_id`, `document_id`, `service_funeral_id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `grace_at`, `is_alive`) VALUES ('010401101101', '1', '1001', 'Titular', '1', 'Nome do titular', '10/08/1965', '0', '1', '140110101', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, '1');
? "INSERT INTO `beneficiary` (`beneficiary_id`, `sys_unit_id`, `contract_id`, `relationship`, `is_primary`, `name`, `birth_at`, `is_forbidden`, `gender_id`, `document_id`, `service_funeral_id`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`, `grace_at`, `is_alive`) "

?? " VALUES "  // CREATE TABLE beneficiary( 

linecreated:=.F.
contaux:=1
do while !eof()
   if (linecreated)
    ?? ","
   endif
   ? "('"+alltrim(codigo)+grau+strzero(seq,2)+"',"   	//  beneficiary_id  
   ?? "'"+"1', "	// sys_unit_id
   ?? "'"+alltrim(codigo) +"', "	// contract_id
   grauaux:=[outros]
   if grau=[1]
    grauaux:=[Titular]
   elseif grau=[2]
    grauaux:=[Pai]
   elseif grau=[3]
    grauaux:=[Mae]
   elseif grau=[4]
    grauaux:=[Sogro] 
   elseif grau=[5]
    grauaux:=[Sogra]
   elseif grau=[6]
    grauaux:=[Conjuge]
   elseif grau=[7]
    grauaux:=[Filho]
   elseif grau=[8]
    grauaux:=[Dependente]
   elseif grau=[9]
    grauaux:=[Dependente]
   endif
   sexoaux:=[3]   // ignorado
   if sexo=[M]
    sexoaux:=[1]
   else
    sexoaux:=[2]
   endif
   ?? "'"+alltrim(grauaux) +"', "	// relationship
   ?? "'"+iif(inscrits->grau=[1],"1","0") +"', "	// is_primary 
   ?? "'"+alltrim(inscrits->nome) +"', "	// name
   ?? "'"+alltrim(dtoc(inscrits->nascto_)) +"', "	// birth_at
   ?? "'"+iif(inscrits->interdito=[S],"1","0") +"', "	// is_forbidden
   ?? sexoaux+", "	// gender_id
   ?? "	NULL, "	// document_id 
   ?? " NULL, "	// service_funeral_id  ???  revisar segundo a numeracao estipulada pelo processo
   ?? "CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, "	// created_at, updated_at, deleted_at
   ?? "NULL, NULL, NULL, NULL,"+iif(vivofalec=[F],"0","1")+") " 	// created_by, updated_by, deleted_by, grace_at, is_alive
   linecreated:=.T.
   SKIP
ENDDO
IF (linecreated)
 ?? " ; "
 ?
ENDIF
return .T. 

function sql_contract_charge
use taxas
go top
set print to ("cobranca.sql")

//INSERT INTO `contract_charge` (`contract_charge_id`, `contract_id`, `sys_unit_id`, `payment_status_id`, `charge_code`, `due_date`, `amount`, `payment_date`, `amount_pago`, `convenio`, `due_month`, `due_year`, `payd_month`, `payd_year`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('0104011012123', '1001', '1', '', '140104011012123', '10/07/2025', '100.00', '05/07/2025', '98', NULL, '07', '2025', '07', '2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL)
? "INSERT INTO `"+"contract_charge` "+"(`contract_charge_id`, `contract_id`, `sys_unit_id`, `payment_status_id`, `charge_code`, `due_date`, `amount`, `payment_date`, `amount_pago`, `convenio`, `due_month`, `due_year`, `payd_month`, `payd_year`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`)"

?? " VALUES "   //  CREATE TABLE group_batch
linecreated:=.F. 
do while !eof()
  if (linecreated)
   ?? ","
  endif
  ?? " ('"+codigo+tipo+circ+"', " // contract_charge_id
  ?? "'"+codigo +"', "	// contract_id
  ?? "'"+"1', "	// sys_unit_id 
  ?? "'"+taxas->stat +"', "	// payment_status_id
  ?? "'"+codigo+tipo+circ +"', "	// charge_code 
  ?? "'"+dtoc(emissao_) +"', "	// due_date
  ?? "'"+alltrim(str(valor)) +"', "	// amount
  ?? "'"+iif(empt(pgto_),"NULL",dtoc(pgto_)) +"', "	// payment_date
  ?? "'"+alltrim(str(valorpg)) +"', "	// amount_pago
  ?? "NULL, "	// convenio
  ?? "'"+alltrim(str(month(emissao_))) +"', "	// due_month
  ?? "'"+alltrim(str(year(emissao_))) +"', "	// due_year
  ?? iif(empt(pgto_),"NULL","'"+alltrim(str(month(pgto_))) +"'")+", "	// payd_month
  ?? iif(empt(pgto_),"NULL","'"+alltrim(str(year(pgto_))) +"',")+", "	// payd_year
  ?? " CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL ) "	// created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`
  linecreated:=.T.
  SKIP
ENDDO
IF (linecreated)
 ?? " ; "
 ?
ENDIF
return .T. 

function sql_cobrador
use cobrador
inde on cobrador to cobtmp
go top 
set print to ("tables6.sql")
inkey(2)

// INSERT INTO `address` (`address_id`, `sys_user_id`, `address_type_id`, `is_main`, `zip_code`, `address`, `address_number`, `address_line1`, `address_line2`, `city`, `state`, `country`, `observacao`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', '1', '1', '1', '13485392', 'Rua Apparecida Bosqueiro Boldrin', '221', 'Porto Real II', NULL, 'Limeira', 'SPB', 'BR', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);
// INSERT INTO `document` (`document_id`, `sys_user_id`, `document_type_id`, `document_number`, `filename`, `file_path`, `file_size`, `mime_type`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', '1', '1', '06479025830', '', '', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);
// INSERT INTO `partner` (`partner_id`, `company_id`, `sys_unit_id`, `sys_user_id`, `partner_code`, `partner_name`, `legal_name`, `tax_id`, `partner_type_id`, `is_customer`, `is_vendor`, `is_collector`, `is_employee`, `is_accredited`, `specialty_id`, `advantages`, `observation`, `credit_limit`, `payment_terms`, `billing_address_id`, `shipping_address_id`, `doccument1_id`, `doccument2_id`, `phone`, `email`, `website`, `primary_partner_person`, `notes`, `receivable_account_id`, `payable_account_id`, `currency`, `tax_code_id`, `active`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) VALUES ('1', '1', '1', '1', 'CODIGO', 'Nome', 'razao social', NULL, '1', '0', '0', '1', '0', '0', '1', 'vantagens', 'observacao', '0', NULL, '1', '1', '1', '1', '3452-3712', 'email', 'website', 'contato principal', 'anotacao', NULL, NULL, 'BRL', NULL, '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);
linecreated:=.F. 
do while !eof()
 if (linecreated)
  ?? ","
 endif
? "INSERT INTO `address` (`address_id`, `sys_user_id`, `address_type_id`, `is_main`, `zip_code`, `address`, `address_number`, `address_line1`, `address_line2`, `city`, `state`, `country`, `observacao`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) " 
? " VALUES ('"+alltrim(str(id))+"', '1', '1', '1', NULL,'"+ alltrim(ENDERECO)+"', '"+SUBSTR(endereco,RAT([,],ENDERECO)+1)+"' ,'"+alltrim( BAIRRO)+"', NULL, '"+alltrim(CIDADE)+"', NULL, 'BR','OBS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
? "SET @address_id = LAST_INSERT_ID();"
IF !EMPT(cpf)
 ? "INSERT INTO `document` (`document_id`, `sys_user_id`, `document_type_id`, `document_number`, `filename`, `file_path`, `file_size`, `mime_type`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) "
 ? "VALUES ('"+alltrim(str(id))+"', '1', '1',"+ cpf+", '', '', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
 ? "SET @document_id = LAST_INSERT_ID();"
ENDIF
? "INSERT INTO `partner` (`partner_id`, `company_id`, `sys_unit_id`, `sys_user_id`, `partner_code`, `partner_name`, `legal_name`, `tax_id`, `partner_type_id`, `is_customer`, `is_vendor`, `is_collector`, `is_employee`, `is_accredited`, `specialty_id`, `advantages`, `observation`, `credit_limit`, `payment_terms`, `billing_address_id`, `shipping_address_id`, `doccument1_id`, `doccument2_id`, `phone`, `email`, `website`, `primary_partner_person`, `notes`, `receivable_account_id`, `payable_account_id`, `currency`, `tax_code_id`, `active`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `deleted_by`) "
? "VALUES ("
 ?? "'"+alltrim(str(id))+"', '1', '1', '1', '"
 ?? alltrim(cobrador)+"', '"
 ?? alltrim(Nome)+"', '"
 ?? alltrim(nome)+"', NULL, '1', '0', '0', '1', '0', '0', '1', 'vantagens', 'observacao', '0', NULL,"
 ?? "'@address_id', '@address_id', '@document_id', '@document_id', '"
 ?? alltrim(telefone)
 ?? "', 'NULL', '"
 ?? "www.presserv.com.br', '"
 ?? alltrim(nome)+"', '"
 ?? obs+"', NULL, NULL, 'BRL', NULL, '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL);"
 ? "INSERT INTO `entity_address` (`entity_type`, `entity_id`, `address_id`, `is_primary`) "
 ?? " VALUES ('partner', '"+alltrim(str(id))+"', '@address_id', '1');"
IF !EMPT(cpf) 
 ? "INSERT INTO `entity_document` (`entity_type`, `entity_id`, `document_id`, `is_active`) "
 ? " VALUES ('partner', '"+alltrim(str(id))+"', '@document_id', '1');"
ENDIF
  linecreated:=.T.
  SKIP
ENDDO
IF (linecreated)
 ?? " ; "
 ?
ENDIF

return .T. 

