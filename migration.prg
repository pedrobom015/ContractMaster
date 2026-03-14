use grupos 

go top
file_dest:="gru2new.sql"
set print to (file_dest)
set devi to print 

set date ansi

? "INSERT INTO `"+"CONTRACT` VALUES "  // CREATE TABLE contract( 

linecreated:=.F.

do while !eof()
   if (linecreated)
    ?? ","
   ?? "("+alltrim(str(id))   		//    contract_id  INT UNSIGNED AUTO_INCREMENT     NOT NULL , 
   ?? ",1"		//    sys_unit_id INT UNSIGNED   NOT NULL , 
   ?? ",1"		//    sys_user_id INT UNSIGNED   NOT NULL , 
   //   group_batch_id INT UNSIGNED   NOT NULL , 
   gruaux:="1"+strzero(asc(left(grupo,1)),2)    // A=65
   if right(grupo,1)$[123456789]
    gruaux+=strzero(right(grupo,1),2)		   // A=6501
   elseif right(grupo,1)>=[A]
    gruaux+=strzero(asc(left(grupo,1)),2)    // A=6565
   endif
   ?? ","+gruaux+","       
   ?? alltrim(str(id))+","		    //owner_id INT UNSIGNED   NOT NULL , 					
   ?? alltrim(str(100+val(tipcont)))+"," // class_id INT UNSIGNED   NOT NULL ,  					 
   ?? alltrim(str(val(situacao)*10))+"," //   status_id INT    NOT NULL , 					 
   ?? "`"+codigo+"`," //   contract_number varchar  (20)    NOT NULL , 			
   ?? "`"+tipcont+"`," //  contract_type varchar  (50)    NOT NULL , 			 
   ?? "`"+dtoc(admissao_)+"`," //     start_date date    NOT NULL , 					
   ?? "`"+ "`," //    end_date date   , 						
   ?? "`"+formapgto+"`," //     billing_frequenc INT    DEFAULT 1  NOT NULL , 			
   ?? "`"+dtoc(admissao_) +"`," //     admission date    NOT NULL ,      				
   ?? "`"+dtoc(tcarencia) +"`," //     final_grace date   , 						
   ?? "`"+left(saitxa,2) +"`," //     month_initial_billing char  (2)    NOT NULL , 			 
   ?? "`"+iif(right(saitxa,2)>[50],"19","20")+"`," //     year_initial_billing char  (4)    NOT NULL , 			
   ?? "`"+iif(diapgto>[00],diapgto,[]) +"`," //     opt_payday INT   , 						
   ?? ""+alltrim(str(cob_id)) +"," //  collector_id INT  UNSIGNED   , 						
   ?? ""+alltrim(str(ven_id)) +"," //   seller_id INT  UNSIGNED   , 						
   ?? ""+alltrim(str(cob_id)) +"," //     region_id INT   UNSIGNED  , 						 
   ?? "`"+ obs+"`," //     obs text   , 							
   ?? ""+alltrim(str(funerais)) +"," //     services_amount INT   , 						 
   ?? "`"+dtoc(renovar_) +"`," //     renew_at date   , 						
   ?? ""+alltrim(str(val(circinic))) +"," //     first_charge INT   , 						
   ?? ""+alltrim(str(val(ultcirc))) +"," //     last_charge INT   , 						
   ?? ""+alltrim(str(qtcircs)) +"," //     charges_amount INT   , 						
   ?? ""+alltrim(str(qtcircpg)) +"," //     charges_paid INT   , 						 
   ?? ""+alltrim(str(particv)) +"," //     alives INT   , 							
   ?? ""+alltrim(str(particf)) +"," //     deceaseds INT   , 						
   ?? ""+alltrim(str(nrdepend)) +"," //     dependents INT   , 						
   ?? "`"+alltrim(atend1) +"`," //     service_option1 varchar  (100)   , 				
   ?? "`"+alltrim(atend2) +"`," //     service_option2 varchar  (100)   , 				
   ?? ""+"," //     indicated_by INT   , 						
   ?? "`"+ "`," //     grace_period_days varchar (15)  ,					
   ?? ""+"," //     late_fee_percentage DECIMAL  (8,5) ,				 
   ?? "1," //     is_partial_payments_allowed boolean ,				
   ?? "`"+"`," //     default_plan_installments varchar(6)  ,	
   if formapgto=[01]			
     ?? "`MENSAL"+"`," //     default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,		
   elseif formapgto=[02]			
     ?? "`BIMESTRAL"+"`," //     default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,		
   else			
     ?? "`RATEIO"+"`," //     default_plan_frequency varchar (50) DEFAULT 'MONTHLY'  ,	
   endif	
   ?? "`FUNERAL"+ "`," //     industry VARCHAR(50) DEFAULT 'FUNERAL' ,				
   ?? "`"+DTOC(ULTIMP_) +"`," //     created_at timestamp    DEFAULT CURRENT_TIMESTAMP , 
   ?? "`"+DTOC(ENDER_) +")" //     updated_at timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP , 
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
