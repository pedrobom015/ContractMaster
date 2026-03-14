set date brit
set dele on
set cent on

? "Reorganizando cobrador"
use cobrador
inde on cobrador to cobaux

? "identificando cobradores dos contratos"
sele 0
use grupos 
set rela to cobrador into cobrador 
go top
do while !eof()
 repl cob_id with cobrador->id, reg_id with cobrador->id
 skip
endd

? "identificando vendedores"
set rela to vendedor into cobrador 
go top
do while !eof()
 repl ven_id with cobrador->id
 skip
endd
sele cobrador 
use 

use classes
inde on classcod to clatmp
go top 
do while !eof()
 repl class_id with 100+val(classcod)
 skip
endd

set date ansi

? "criando insert "

file_dest:="gru2new.sql"
set print to (file_dest)
set devi to print 
set print on

? "INSERT INTO `sys_unit` (`sys_unit_id`, `subsidiary_id`, `general_status_id`, `name`, `connection_name`, `code`) VALUES ('1', '1', '1', 'Unidade basica', NULL, 'LIM');"

sele classes
inde on classcod to clatmp
go top 
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

use arqgrup
inde on grup to clatmp
go top 
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
 ?? "'"+gruaux+"',"     		//group_batch_id
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
 ?? "NULL, "	// death_threshold
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

sele grupos
go top

// 

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
? 
set print to

/* 
-- Beneficiários do contrato
CREATE TABLE beneficiary( 
      beneficiary_id  INT UNSIGNED AUTO_INCREMENT NOT NULL , 
      sys_unit_id INT UNSIGNED   NOT NULL , 			
      contract_id INT UNSIGNED   NOT NULL , 			
      relationship varchar  (50)    NOT NULL , 			
      is_primary boolean    DEFAULT FALSE , 			
      name varchar  (100)    NOT NULL , 			
      birth_at date   , 				
      is_forbidden boolean   , 					
      gender_id INT UNSIGNED  , 					
      document_id INT UNSIGNED   NOT NULL , 				
      service_funeral_id INT UNSIGNED  , 				
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

ALTER TABLE service_funeral ADD CONSTRAINT fk_service_funeral FOREIGN KEY (deceased_id) REFERENCES beneficiary(beneficiary_id) ;
ALTER TABLE performed_service ADD CONSTRAINT fk_performed_service FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id) ;

-- Cobranças de cada contrato (antigo taxas)
CREATE TABLE contract_charge( 
      contract_charge_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
      contract_id INT  UNSIGNED  NOT NULL , 
      sys_unit_id INT  UNSIGNED  NOT NULL , 
      payment_status_id INT UNSIGNED   NOT NULL , 
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
      created_by INT  UNSIGNED , 
      updated_by INT  UNSIGNED , 
      deleted_by INT  UNSIGNED , 
    PRIMARY KEY (contract_charge_id) ,
    FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ,
    FOREIGN KEY (sys_unit_id) REFERENCES sys_unit(sys_unit_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ; 

*/
