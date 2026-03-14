import { mysqlTable, varchar, int, boolean, timestamp, decimal, char } from "drizzle-orm/mysql-core";
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
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
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
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Cidade (City) table
export const cidadeTable = mysqlTable("cidade", {
  id: int("id").primaryKey().autoincrement(),
  estadoId: int("estado_id").references(() => estadoTable.id),
  name: varchar("name", { length: 100 }).notNull(),
  codigoIbge: varchar("codigo_ibge", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Currency table
export const currencyTable = mysqlTable("currency", {
  id: int("id").primaryKey().autoincrement(),
  code: char("code", { length: 3 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  symbol: varchar("symbol", { length: 10 }),
  decimalPlaces: int("decimal_places").default(2),
  roundingMethod: varchar("rounding_method", { length: 20 }).default("HALF_UP"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// General Status table
export const generalStatusTable = mysqlTable("general_status", {
  id: int("id").primaryKey().autoincrement(),
  statusCode: varchar("status_code", { length: 50 }).notNull(),
  statusName: varchar("status_name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  generateCharge: boolean("generate_charge"),
  allowsService: boolean("allows_service"),
  chargeAfter: int("charge_after"),
  kanban: boolean("kanban"),
  color: varchar("color", { length: 50 }),
  kanbanOrder: int("kanban_order"),
  finalState: boolean("final_state"),
  initialState: boolean("initial_state"),
  allowEdition: boolean("allow_edition"),
  allowDeletion: boolean("allow_deletion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Company table
export const companyTable = mysqlTable("company", {
  id: int("id").primaryKey().autoincrement(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  legalName: varchar("legal_name", { length: 200 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  country: varchar("country", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 150 }),
  website: varchar("website", { length: 200 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Contracts table
export const contractsTable = mysqlTable("contracts", {
  id: int("id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id"),
  sysUserId: int("sys_user_id"),
  groupBatchId: int("group_batch_id"),
  ownerId: int("owner_id"),
  contractName: varchar("contract_name", { length: 200 }).notNull(),
  classId: int("class_id"),
  statusId: int("status_id"),
  contractNumber: varchar("contract_number", { length: 50 }).notNull(),
  contractType: varchar("contract_type", { length: 50 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  billingFrequency: int("billing_frequency").default(1),
  admission: timestamp("admission").notNull(),
  finalGrace: timestamp("final_grace"),
  monthInitialBilling: char("month_initial_billing", { length: 2 }).notNull(),
  yearInitialBilling: char("year_initial_billing", { length: 4 }).notNull(),
  optPayday: int("opt_payday"),
  collectorId: int("collector_id"),
  sellerId: int("seller_id"),
  regionId: int("region_id"),
  obs: varchar("obs", { length: 1000 }),
  servicesAmount: int("services_amount"),
  renewAt: timestamp("renew_at"),
  firstCharge: int("first_charge"),
  lastCharge: int("last_charge"),
  chargesAmount: int("charges_amount"),
  chargesPaid: int("charges_paid"),
  alives: int("alives"),
  deceaseds: int("deceaseds"),
  dependents: int("dependents"),
  serviceOption1: varchar("service_option1", { length: 200 }),
  serviceOption2: varchar("service_option2", { length: 200 }),
  indicatedBy: int("indicated_by"),
  gracePeriodDays: varchar("grace_period_days", { length: 10 }),
  lateFeePercentage: decimal("late_fee_percentage", { precision: 8, scale: 5 }),
  isPartialPaymentsAllowed: boolean("is_partial_payments_allowed"),
  defaultPlanInstallments: varchar("default_plan_installments", { length: 50 }),
  defaultPlanFrequency: varchar("default_plan_frequency", { length: 20 }).default("MONTHLY"),
  industry: varchar("industry", { length: 50 }).default("FUNERAL"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Beneficiaries table
export const beneficiariesTable = mysqlTable("beneficiaries", {
  id: int("id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.id),
  name: varchar("name", { length: 200 }).notNull(),
  relationship: varchar("relationship", { length: 100 }),
  birthDate: timestamp("birth_date"),
  document: varchar("document", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Charges table
export const chargesTable = mysqlTable("charges", {
  id: int("id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.id),
  reference: varchar("reference", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Addendums table
export const addendumsTable = mysqlTable("addendums", {
  id: int("id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.id),
  type: varchar("type", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Batch Detail table
export const batchDetailTable = mysqlTable("batch_detail", {
  id: int("id").primaryKey().autoincrement(),
  batchNumber: varchar("batch_number", { length: 50 }).notNull(),
  contractId: int("contract_id").references(() => contractsTable.id),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Group Batch table  
export const groupBatchTable = mysqlTable("group_batch", {
  id: int("id").primaryKey().autoincrement(),
  batchName: varchar("batch_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Batch CHK table  
export const batchChkTable = mysqlTable("batch_chk", {
  id: int("id").primaryKey().autoincrement(),
  batchNumber: varchar("batch_number", { length: 50 }).notNull(),
  contractId: int("contract_id").references(() => contractsTable.id),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Subsidiary table
export const subsidiaryTable = mysqlTable("subsidiary", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// System Unit table
export const sysUnitTable = mysqlTable("sys_unit", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  connectionName: varchar("connection_name", { length: 100 }),
  code: varchar("code", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// System Users table
export const sysUsersTable = mysqlTable("sys_users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  login: varchar("login", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  passwordSalt: varchar("password_salt", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  active: boolean("active").default(true),
  genderId: int("gender_id"),
  companyId: int("company_id"),
  subsidiaryId: int("subsidiary_id"),
  sysUnitId: int("sys_unit_id"),
  twoFactorEnabled: boolean("two_factor_enabled"),
  twoFactorType: varchar("two_factor_type", { length: 50 }),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Addresses table
export const addressesTable = mysqlTable("addresses", {
  id: int("id").primaryKey().autoincrement(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  addressNumber: varchar("address_number", { length: 50 }),
  addressLine1: varchar("address_line1", { length: 500 }),
  addressLine2: varchar("address_line2", { length: 500 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  observacao: varchar("observacao", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Entity Addresses table (many-to-many)
export const entityAddressesTable = mysqlTable("entity_addresses", {
  id: int("id").primaryKey().autoincrement(),
  entityId: int("entity_id").notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'client', 'partner'
  addressId: int("address_id").references(() => addressesTable.id),
  addressTypeId: int("address_type_id").references(() => addressTypesTable.id),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Partner Types table
export const partnerTypesTable = mysqlTable("partner_types", {
  id: int("id").primaryKey().autoincrement(),
  typeName: varchar("type_name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Documents table
export const documentsTable = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  documentTypeId: int("document_type_id").references(() => documentTypesTable.id),
  documentNumber: varchar("document_number", { length: 100 }).notNull(),
  filename: varchar("filename", { length: 500 }).notNull(),
  filePath: varchar("file_path", { length: 1000 }).notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Entity Documents table (many-to-many)
export const entityDocumentsTable = mysqlTable("entity_documents", {
  id: int("id").primaryKey().autoincrement(),
  entityId: int("entity_id").notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'client', 'partner'
  documentId: int("document_id").references(() => documentsTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Partners table
export const partnersTable = mysqlTable("partners", {
  id: int("id").primaryKey().autoincrement(),
  partnerCode: varchar("partner_code", { length: 50 }).notNull(),
  partnerName: varchar("partner_name", { length: 200 }).notNull(),
  legalName: varchar("legal_name", { length: 200 }),
  taxId: varchar("tax_id", { length: 50 }),
  partnerTypeId: int("partner_type_id").references(() => partnerTypesTable.id),
  statusId: int("status_id"),
  genderId: int("gender_id"),
  birthDate: timestamp("birth_date"),
  grantedLimit: decimal("granted_limit", { precision: 19, scale: 4 }),
  advantages: varchar("advantages", { length: 1000 }),
  observation: varchar("observation", { length: 1000 }),
  currencyId: int("currency_id").references(() => currencyTable.id),
  companyId: int("company_id"),
  subsidiaryId: int("subsidiary_id"),
  sysUnitId: int("sys_unit_id"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 150 }),
  website: varchar("website", { length: 200 }),
  primaryPartnerPerson: varchar("primary_partner_person", { length: 200 }),
  notes: varchar("notes", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Clients table
export const clientsTable = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 150 }),
  phone: varchar("phone", { length: 20 }),
  document: varchar("document", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Classe table
export const classeTable = mysqlTable("classe", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Messages table
export const messagesTable = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  message1: varchar("message1", { length: 1000 }),
  message2: varchar("message2", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Group table
export const groupTable = mysqlTable("group", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  groupCode: varchar("group_code", { length: 50 }).notNull(),
  priority: int("priority"),
  beginCode: varchar("begin_code", { length: 50 }).notNull(),
  finalCode: varchar("final_code", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Billing Control table
export const billingControlTable = mysqlTable("billing_control", {
  id: int("id").primaryKey().autoincrement(),
  lastBillingNumber: varchar("last_billing_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
  nextBillingNumber: varchar("next_billing_number", { length: 50 }).notNull(),
});

// Create insert schemas
export const insertContractSchema = createInsertSchema(contractsTable).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  admission: z.string().transform((val) => new Date(val)),
});

export const insertBeneficiarySchema = createInsertSchema(beneficiariesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChargeSchema = createInsertSchema(chargesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAddendumSchema = createInsertSchema(addendumsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Additional insert schemas
export const insertAddressSchema = createInsertSchema(addressesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAddressTypeSchema = createInsertSchema(addressTypesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEntityAddressSchema = createInsertSchema(entityAddressesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerTypeSchema = createInsertSchema(partnerTypesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerSchema = createInsertSchema(partnersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentTypeSchema = createInsertSchema(documentTypesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clientsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBatchDetailSchema = createInsertSchema(batchDetailTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBatchChkSchema = createInsertSchema(batchChkTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSysUserSchema = createInsertSchema(sysUsersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEstadoSchema = createInsertSchema(estadoTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCidadeSchema = createInsertSchema(cidadeTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGenderSchema = createInsertSchema(genderTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentStatusSchema = createInsertSchema(paymentStatusTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeneralStatusSchema = createInsertSchema(generalStatusTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companyTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubsidiarySchema = createInsertSchema(subsidiaryTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSysUnitSchema = createInsertSchema(sysUnitTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClasseSchema = createInsertSchema(classeTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupBatchSchema = createInsertSchema(groupBatchTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCurrencySchema = createInsertSchema(currencyTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessagesSchema = createInsertSchema(messagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupSchema = createInsertSchema(groupTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBillingControlSchema = createInsertSchema(billingControlTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEntityDocumentSchema = createInsertSchema(entityDocumentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type Contract = typeof contractsTable.$inferSelect;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
export type Charge = typeof chargesTable.$inferSelect;
export type Addendum = typeof addendumsTable.$inferSelect;
export type BatchDetail = typeof batchDetailTable.$inferSelect;
export type GroupBatch = typeof groupBatchTable.$inferSelect;
export type BatchChk = typeof batchChkTable.$inferSelect;
export type Address = typeof addressesTable.$inferSelect;
export type AddressType = typeof addressTypesTable.$inferSelect;
export type EntityAddress = typeof entityAddressesTable.$inferSelect;
export type PartnerType = typeof partnerTypesTable.$inferSelect;
export type Partner = typeof partnersTable.$inferSelect;
export type DocumentType = typeof documentTypesTable.$inferSelect;
export type Document = typeof documentsTable.$inferSelect;
export type Client = typeof clientsTable.$inferSelect;
export type SysUser = typeof sysUsersTable.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type InsertCharge = z.infer<typeof insertChargeSchema>;
export type InsertAddendum = z.infer<typeof insertAddendumSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type InsertAddressType = z.infer<typeof insertAddressTypeSchema>;
export type InsertEntityAddress = z.infer<typeof insertEntityAddressSchema>;
export type InsertPartnerType = z.infer<typeof insertPartnerTypeSchema>;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type InsertDocumentType = z.infer<typeof insertDocumentTypeSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertBatchDetail = z.infer<typeof insertBatchDetailSchema>;
export type InsertBatchChk = z.infer<typeof insertBatchChkSchema>;
export type InsertSysUser = z.infer<typeof insertSysUserSchema>;

// Legacy type aliases for compatibility
export type NewSysUser = InsertSysUser;
export type NewAddressType = InsertAddressType;
export type NewAddress = InsertAddress;
export type NewEntityAddress = InsertEntityAddress;
export type NewPartnerType = InsertPartnerType;
export type NewPartner = InsertPartner;
export type NewDocument = InsertDocument;
export type NewDocumentType = InsertDocumentType;
export type NewEntityDocument = typeof entityDocumentsTable.$inferInsert;
export type EntityDocument = typeof entityDocumentsTable.$inferSelect;