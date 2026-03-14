import { mysqlTable, text, int, boolean, timestamp, decimal, char, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core System Tables

// Gender table
export const genderTable = mysqlTable("gender", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Document Types table
export const documentTypesTable = mysqlTable("document_types", {
  id: int("id").primaryKey().autoincrement(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Address Types table
export const addressTypesTable = mysqlTable("address_types", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Payment Status table
export const paymentStatusTable = mysqlTable("payment_status", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  code: char("code", { length: 2 }).notNull(),
  kanban: boolean("kanban"),
  color: varchar("color", { length: 50 }),
  kanbanOrder: int("kanban_order"),
  finalState: boolean("final_state"),
  initialState: boolean("initial_state"),
  allowEdition: boolean("allow_edition"),
  allowDeletion: boolean("allow_deletion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Estado (State) table
export const estadoTable = mysqlTable("estado", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  uf: char("uf", { length: 2 }).notNull(),
  codigoIbge: varchar("codigo_ibge", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Cidade (City) table
export const cidadeTable = mysqlTable("cidade", {
  id: int("id").primaryKey().autoincrement(),
  estadoId: int("estado_id").references(() => estadoTable.id),
  name: varchar("name").notNull(),
  codigoIbge: varchar("codigo_ibge"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Currency table
export const currencyTable = mysqlTable("currency", {
  code: char("code", { length: 3 }).primaryKey(),
  name: varchar("name").notNull(),
  symbol: varchar("symbol"),
  decimalPlaces: int("decimal_places").default(2),
  roundingMethod: varchar("rounding_method").default("HALF_UP"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// General Status table
export const generalStatusTable = mysqlTable("general_status", {
  id: int("id").primaryKey().autoincrement(),
  statusCode: varchar("status_code").notNull(),
  statusName: varchar("status_name").notNull(),
  description: varchar("description"),
  generateCharge: boolean("generate_charge"),
  allowsService: boolean("allows_service"),
  chargeAfter: int("charge_after"),
  kanban: boolean("kanban"),
  color: varchar("color"),
  kanbanOrder: int("kanban_order"),
  finalState: boolean("final_state"),
  initialState: boolean("initial_state"),
  allowEdition: boolean("allow_edition"),
  allowDeletion: boolean("allow_deletion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Company table
export const companyTable = mysqlTable("company", {
  id: int("id").primaryKey().autoincrement(),
  parentCompanyId: int("parent_company_id").references(() => companyTable.id),
  companyName: varchar("company_name").notNull(),
  legalName: varchar("legal_name").notNull(),
  taxId: varchar("tax_id").notNull(),
  addressId: int("address_id"),
  country: varchar("country"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  logoUrl: varchar("logo_url"),
  fiscalYearStart: timestamp("fiscal_year_start"),
  defaultCurrency: char("default_currency", { length: 3 }).references(() => currencyTable.code),
  isConsolidated: boolean("is_consolidated").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Subsidiary table
export const subsidiaryTable = mysqlTable("subsidiary", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name").notNull(),
  code: varchar("code").notNull(),
  status: varchar("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// System Unit table
export const sysUnitTable = mysqlTable("sys_unit", {
  id: int("id").primaryKey().autoincrement(),
  subsidiaryId: int("subsidiary_id").references(() => subsidiaryTable.id),
  generalStatusId: int("general_status_id").references(() => generalStatusTable.id),
  name: varchar("name").notNull(),
  connectionName: varchar("connection_name"),
  code: varchar("code").notNull(),
});

// System User table
export const sysUsersTable = mysqlTable("sys_users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name").notNull(),
  login: varchar("login").notNull(),
  email: varchar("email").notNull(),
  passwordHash: varchar("password_hash").notNull(),
  passwordSalt: varchar("password_salt"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  frontpageId: int("frontpage_id"),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.id),
  active: boolean("active").default(true),
  acceptedTermPolicyAt: timestamp("accepted_term_policy_at"),
  acceptedTermPolicy: boolean("accepted_term_policy"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorType: varchar("two_factor_type"),
  twoFactorSecret: varchar("two_factor_secret"),
  isAdmin: boolean("is_admin").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Address table
export const addressesTable = mysqlTable("addresses", {
  id: int("id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.id),
  addressTypeId: int("address_type_id").references(() => addressTypesTable.id),
  isMain: boolean("is_main").default(true),
  zipCode: varchar("zip_code").notNull(),
  address: varchar("address").notNull(),
  addressNumber: varchar("address_number"),
  addressLine1: varchar("address_line1"),
  addressLine2: varchar("address_line2"),
  city: varchar("city").notNull(),
  state: varchar("state"),
  country: varchar("country"),
  observacao: varchar("observacao"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Entity Address table
export const entityAddressesTable = mysqlTable("entity_addresses", {
  id: int("id").primaryKey().autoincrement(),
  entityType: varchar("entity_type").notNull(), // 'client', 'partner'
  entityId: int("entity_id").notNull(),
  addressId: int("address_id").references(() => addressesTable.id),
  isPrimary: boolean("is_primary").default(false),
});

// Partner Type table
export const partnerTypesTable = mysqlTable("partner_types", {
  id: int("id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.id),
  typeName: varchar("type_name").notNull(),
  description: varchar("description"),
  isSystem: boolean("is_system").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document table
export const documentsTable = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.id),
  documentTypeId: int("document_type_id").references(() => documentTypesTable.id),
  documentNumber: varchar("document_number").notNull(),
  filename: varchar("filename").notNull(),
  filePath: varchar("file_path").notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Entity Document table
export const entityDocumentsTable = mysqlTable("entity_documents", {
  id: int("id").primaryKey().autoincrement(),
  entityType: varchar("entity_type").notNull(), // 'client', 'partner'
  entityId: int("entity_id").notNull(),
  documentId: int("document_id").references(() => documentsTable.id),
  isActive: boolean("is_active").default(true),
});

// Partners table
export const partnersTable = mysqlTable("partners", {
  id: int("id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.id),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.id),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.id),
  partnerCode: varchar("partner_code").notNull(),
  partnerName: varchar("partner_name").notNull(),
  legalName: varchar("legal_name"),
  taxId: varchar("tax_id"),
  partnerTypeId: int("partner_type_id").references(() => partnerTypesTable.id),
  isCustomer: boolean("is_customer").default(false),
  isVendor: boolean("is_vendor").default(false),
  isCollector: boolean("is_collector").default(false),
  isEmployee: boolean("is_employee").default(false),
  isAccredited: boolean("is_accredited").default(false),
  specialtyId: int("specialty_id"),
  advantages: varchar("advantages"),
  observation: varchar("observation"),
  creditLimit: decimal("credit_limit", { precision: 19, scale: 4 }),
  paymentTerms: int("payment_terms"),
  billingAddressId: int("billing_address_id").references(() => addressesTable.id),
  shippingAddressId: int("shipping_address_id").references(() => addressesTable.id),
  document1Id: int("document1_id").references(() => documentsTable.id),
  document2Id: int("document2_id").references(() => documentsTable.id),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  primaryPartnerPerson: varchar("primary_partner_person"),
  notes: varchar("notes"),
  receivableAccountId: int("receivable_account_id"),
  payableAccountId: int("payable_account_id"),
  currency: char("currency", { length: 3 }).default("BRL"),
  taxCodeId: int("tax_code_id"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Clients table (derived from partners or separate)
export const clientsTable = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  document: varchar("document"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classe table
export const classeTable = mysqlTable("classe", {
  id: int("id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.id),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.id),
  name: varchar("name").notNull(),
  description: varchar("description").notNull(),
  amountContracts: int("amount_contracts"),
  isPeriodic: boolean("is_periodic").default(true),
  purchaseValue: decimal("purchase_value", { precision: 19, scale: 4 }).notNull(),
  numberOfParcels: int("number_of_parcels").notNull(),
  generatedParcels: int("generated_parcels").notNull(),
  monthValue: decimal("month_value", { precision: 19, scale: 4 }).notNull(),
  dependValue: decimal("depend_value", { precision: 19, scale: 4 }),
  numberOfMonthValid: int("number_of_month_valid"),
  isRenewable: boolean("is_renewable"),
  isRenewableUsed: boolean("is_renewable_used"),
  totalValue: decimal("total_value", { precision: 19, scale: 4 }),
  message1: varchar("message1"),
  message2: varchar("message2"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Group Batch table
export const groupBatchTable = mysqlTable("group_batch", {
  id: int("id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.id),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.id),
  name: varchar("name").notNull(),
  groupCode: varchar("group_code").notNull(),
  classId: int("class_id").references(() => classeTable.id),
  beginCode: varchar("begin_code").notNull(),
  finalCode: varchar("final_code").notNull(),
  isPeriodic: boolean("is_periodic").notNull(),
  amountProcess: int("amount_process").notNull(),
  minProc: int("min_proc").notNull(),
  maxProc: int("max_proc").notNull(),
  compareAdmission: boolean("compare_admission").default(false),
  amountRedeem: int("amount_redeem").notNull(),
  byService: boolean("by_service").default(true),
  lastBillingNumber: varchar("last_billing_number").notNull(),
  lastIssueDate: timestamp("last_issue_date"),
  pendingProcess: int("pending_process"),
  numberContracts: int("number_contracts"),
  numberLifes: int("number_lifes").notNull(),
  deathCount: int("death_count").default(0),
  nextBillingNumber: varchar("next_billing_number").notNull(),
  currentDeathCount: int("current_death_count").default(0),
  lastDeathChargeDate: timestamp("last_death_charge_date"),
  deathThreshold: int("death_threshold").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Contracts table
export const contractsTable = mysqlTable("contracts", {
  id: int("id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.id),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.id),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.id),
  ownerId: int("owner_id").references(() => sysUsersTable.id),
  contractName: varchar("contract_name").notNull(),
  classId: int("class_id").references(() => classeTable.id),
  statusId: int("status_id").references(() => generalStatusTable.id),
  contractNumber: varchar("contract_number").notNull(),
  contractType: varchar("contract_type").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  billingFrequency: int("billing_frequency").default(1),
  admission: timestamp("admission").notNull(),
  finalGrace: timestamp("final_grace"),
  monthInitialBilling: char("month_initial_billing", { length: 2 }).notNull(),
  yearInitialBilling: char("year_initial_billing", { length: 4 }).notNull(),
  optPayday: int("opt_payday"),
  collectorId: int("collector_id").references(() => sysUsersTable.id),
  sellerId: int("seller_id").references(() => sysUsersTable.id),
  regionId: int("region_id"),
  obs: varchar("obs"),
  servicesAmount: int("services_amount"),
  renewAt: timestamp("renew_at"),
  firstCharge: int("first_charge"),
  lastCharge: int("last_charge"),
  chargesAmount: int("charges_amount"),
  chargesPaid: int("charges_paid"),
  alives: int("alives"),
  deceaseds: int("deceaseds"),
  dependents: int("dependents"),
  serviceOption1: varchar("service_option1"),
  serviceOption2: varchar("service_option2"),
  indicatedBy: int("indicated_by"),
  gracePeriodDays: varchar("grace_period_days"),
  lateFeePercentage: decimal("late_fee_percentage", { precision: 8, scale: 5 }),
  isPartialPaymentsAllowed: boolean("is_partial_payments_allowed"),
  defaultPlanInstallments: varchar("default_plan_installments"),
  defaultPlanFrequency: varchar("default_plan_frequency").default("MONTHLY"),
  industry: varchar("industry").default("FUNERAL"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Beneficiaries table
export const beneficiariesTable = mysqlTable("beneficiaries", {
  id: int("id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.id),
  name: varchar("name").notNull(),
  relationship: varchar("relationship"),
  birthDate: timestamp("birth_date"),
  document: varchar("document"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Charges table
export const chargesTable = mysqlTable("charges", {
  id: int("id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.id),
  reference: varchar("reference").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  status: varchar("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Addendums table
export const addendumsTable = mysqlTable("addendums", {
  id: int("id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.id),
  type: varchar("type").notNull(),
  description: varchar("description"),
  effectiveDate: timestamp("effective_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Batch CHK table
export const batchChkTable = mysqlTable("batch_chk", {
  id: int("id").primaryKey().autoincrement(),
  batchNumber: varchar("batch_number").notNull(),
  processDate: timestamp("process_date"),
  status: varchar("status").default("pending"),
  totalAmount: decimal("total_amount", { precision: 19, scale: 4 }),
  recordCount: int("record_count"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Batch Detail table
export const batchDetailTable = mysqlTable("batch_detail", {
  id: int("id").primaryKey().autoincrement(),
  batchId: int("batch_id").references(() => batchChkTable.id),
  contractId: int("contract_id").references(() => contractsTable.id),
  chargeId: int("charge_id").references(() => chargesTable.id),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  status: varchar("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertGenderSchema = createInsertSchema(genderTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentTypeSchema = createInsertSchema(documentTypesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAddressTypeSchema = createInsertSchema(addressTypesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentStatusSchema = createInsertSchema(paymentStatusTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEstadoSchema = createInsertSchema(estadoTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCidadeSchema = createInsertSchema(cidadeTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCurrencySchema = createInsertSchema(currencyTable).omit({ createdAt: true, updatedAt: true });
export const insertGeneralStatusSchema = createInsertSchema(generalStatusTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompanySchema = createInsertSchema(companyTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubsidiarySchema = createInsertSchema(subsidiaryTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSysUnitSchema = createInsertSchema(sysUnitTable).omit({ id: true });
export const insertSysUserSchema = createInsertSchema(sysUsersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAddressSchema = createInsertSchema(addressesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEntityAddressSchema = createInsertSchema(entityAddressesTable).omit({ id: true });
export const insertPartnerTypeSchema = createInsertSchema(partnerTypesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentSchema = createInsertSchema(documentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEntityDocumentSchema = createInsertSchema(entityDocumentsTable).omit({ id: true });
export const insertPartnerSchema = createInsertSchema(partnersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertClientSchema = createInsertSchema(clientsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertClasseSchema = createInsertSchema(classeTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGroupBatchSchema = createInsertSchema(groupBatchTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContractSchema = createInsertSchema(contractsTable).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  admission: z.string().transform((str) => new Date(str)),
  finalGrace: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  renewAt: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});
export const insertBeneficiarySchema = createInsertSchema(beneficiariesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertChargeSchema = createInsertSchema(chargesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAddendumSchema = createInsertSchema(addendumsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBatchChkSchema = createInsertSchema(batchChkTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBatchDetailSchema = createInsertSchema(batchDetailTable).omit({ id: true, createdAt: true, updatedAt: true });

// Types for TypeScript
export type Gender = typeof genderTable.$inferSelect;
export type NewGender = z.infer<typeof insertGenderSchema>;
export type DocumentType = typeof documentTypesTable.$inferSelect;
export type NewDocumentType = z.infer<typeof insertDocumentTypeSchema>;
export type AddressType = typeof addressTypesTable.$inferSelect;
export type NewAddressType = z.infer<typeof insertAddressTypeSchema>;
export type PaymentStatus = typeof paymentStatusTable.$inferSelect;
export type NewPaymentStatus = z.infer<typeof insertPaymentStatusSchema>;
export type Estado = typeof estadoTable.$inferSelect;
export type NewEstado = z.infer<typeof insertEstadoSchema>;
export type Cidade = typeof cidadeTable.$inferSelect;
export type NewCidade = z.infer<typeof insertCidadeSchema>;
export type Currency = typeof currencyTable.$inferSelect;
export type NewCurrency = z.infer<typeof insertCurrencySchema>;
export type GeneralStatus = typeof generalStatusTable.$inferSelect;
export type NewGeneralStatus = z.infer<typeof insertGeneralStatusSchema>;
export type Company = typeof companyTable.$inferSelect;
export type NewCompany = z.infer<typeof insertCompanySchema>;
export type Subsidiary = typeof subsidiaryTable.$inferSelect;
export type NewSubsidiary = z.infer<typeof insertSubsidiarySchema>;
export type SysUnit = typeof sysUnitTable.$inferSelect;
export type NewSysUnit = z.infer<typeof insertSysUnitSchema>;
export type SysUser = typeof sysUsersTable.$inferSelect;
export type NewSysUser = z.infer<typeof insertSysUserSchema>;
export type Address = typeof addressesTable.$inferSelect;
export type NewAddress = z.infer<typeof insertAddressSchema>;
export type EntityAddress = typeof entityAddressesTable.$inferSelect;
export type NewEntityAddress = z.infer<typeof insertEntityAddressSchema>;
export type PartnerType = typeof partnerTypesTable.$inferSelect;
export type NewPartnerType = z.infer<typeof insertPartnerTypeSchema>;
export type Document = typeof documentsTable.$inferSelect;
export type NewDocument = z.infer<typeof insertDocumentSchema>;
export type EntityDocument = typeof entityDocumentsTable.$inferSelect;
export type NewEntityDocument = z.infer<typeof insertEntityDocumentSchema>;
export type Partner = typeof partnersTable.$inferSelect;
export type NewPartner = z.infer<typeof insertPartnerSchema>;
export type Client = typeof clientsTable.$inferSelect;
export type NewClient = z.infer<typeof insertClientSchema>;
export type Classe = typeof classeTable.$inferSelect;
export type NewClasse = z.infer<typeof insertClasseSchema>;
export type GroupBatch = typeof groupBatchTable.$inferSelect;
export type NewGroupBatch = z.infer<typeof insertGroupBatchSchema>;
export type Contract = typeof contractsTable.$inferSelect;
export type NewContract = z.infer<typeof insertContractSchema>;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
export type NewBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type Charge = typeof chargesTable.$inferSelect;
export type NewCharge = z.infer<typeof insertChargeSchema>;
export type Addendum = typeof addendumsTable.$inferSelect;
export type NewAddendum = z.infer<typeof insertAddendumSchema>;
export type BatchChk = typeof batchChkTable.$inferSelect;
export type NewBatchChk = z.infer<typeof insertBatchChkSchema>;
export type BatchDetail = typeof batchDetailTable.$inferSelect;
export type NewBatchDetail = z.infer<typeof insertBatchDetailSchema>;