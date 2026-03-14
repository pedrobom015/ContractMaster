import { pgTable, text, integer, boolean, timestamp, decimal, char } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core System Tables

// Gender table
export const genderTable = pgTable("gender", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Document Types table
export const documentTypesTable = pgTable("document_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Address Types table
export const addressTypesTable = pgTable("address_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Payment Status table
export const paymentStatusTable = pgTable("payment_status", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  code: char("code", { length: 2 }).notNull(),
  kanban: boolean("kanban"),
  color: text("color"),
  kanbanOrder: integer("kanban_order"),
  finalState: boolean("final_state"),
  initialState: boolean("initial_state"),
  allowEdition: boolean("allow_edition"),
  allowDeletion: boolean("allow_deletion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Estado (State) table
export const estadoTable = pgTable("estado", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  uf: char("uf", { length: 2 }).notNull(),
  codigoIbge: text("codigo_ibge"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Cidade (City) table
export const cidadeTable = pgTable("cidade", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  estadoId: integer("estado_id").references(() => estadoTable.id),
  name: text("name").notNull(),
  codigoIbge: text("codigo_ibge"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Currency table
export const currencyTable = pgTable("currency", {
  code: char("code", { length: 3 }).primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol"),
  decimalPlaces: integer("decimal_places").default(2),
  roundingMethod: text("rounding_method").default("HALF_UP"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// General Status table
export const generalStatusTable = pgTable("general_status", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  statusCode: text("status_code").notNull(),
  statusName: text("status_name").notNull(),
  description: text("description"),
  generateCharge: boolean("generate_charge"),
  allowsService: boolean("allows_service"),
  chargeAfter: integer("charge_after"),
  kanban: boolean("kanban"),
  color: text("color"),
  kanbanOrder: integer("kanban_order"),
  finalState: boolean("final_state"),
  initialState: boolean("initial_state"),
  allowEdition: boolean("allow_edition"),
  allowDeletion: boolean("allow_deletion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Company table
export const companyTable = pgTable("company", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyName: text("company_name").notNull(),
  legalName: text("legal_name").notNull(),
  taxId: text("tax_id").notNull(),
  logoUrl: text("logo_url"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Subsidiary table
export const subsidiaryTable = pgTable("subsidiary", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// System Unit table
export const sysUnitTable = pgTable("sys_unit", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  connectionName: text("connection_name"),
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System Users table
export const sysUsersTable = pgTable("sys_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  login: text("login").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  active: boolean("active").default(true),
  genderId: integer("gender_id"),
  companyId: integer("company_id"),
  subsidiaryId: integer("subsidiary_id"),
  sysUnitId: integer("sys_unit_id"),
  twoFactorEnabled: boolean("two_factor_enabled"),
  twoFactorType: text("two_factor_type"),
  twoFactorSecret: text("two_factor_secret"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Addresses table
export const addressesTable = pgTable("addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  zipCode: text("zip_code").notNull(),
  address: text("address").notNull(),
  addressNumber: text("address_number"),
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country"),
  observacao: text("observacao"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Entity Addresses table (many-to-many)
export const entityAddressesTable = pgTable("entity_addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  entityId: integer("entity_id").notNull(),
  entityType: text("entity_type").notNull(), // 'client', 'partner'
  addressId: integer("address_id").references(() => addressesTable.id),
  addressTypeId: integer("address_type_id").references(() => addressTypesTable.id),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner Types table
export const partnerTypesTable = pgTable("partner_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  typeName: text("type_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Documents table
export const documentsTable = pgTable("documents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  documentTypeId: integer("document_type_id").references(() => documentTypesTable.id),
  documentNumber: text("document_number").notNull(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Entity Documents table (many-to-many)
export const entityDocumentsTable = pgTable("entity_documents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  entityId: integer("entity_id").notNull(),
  entityType: text("entity_type").notNull(), // 'client', 'partner'
  documentId: integer("document_id").references(() => documentsTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners table
export const partnersTable = pgTable("partners", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  partnerCode: text("partner_code").notNull(),
  partnerName: text("partner_name").notNull(),
  legalName: text("legal_name"),
  taxId: text("tax_id"),
  partnerTypeId: integer("partner_type_id").references(() => partnerTypesTable.id),
  statusId: integer("status_id"),
  genderId: integer("gender_id"),
  birthDate: timestamp("birth_date"),
  grantedLimit: decimal("granted_limit", { precision: 19, scale: 4 }),
  advantages: text("advantages"),
  observation: text("observation"),
  currencyCode: char("currency_code", { length: 3 }),
  companyId: integer("company_id"),
  subsidiaryId: integer("subsidiary_id"),
  sysUnitId: integer("sys_unit_id"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  primaryPartnerPerson: text("primary_partner_person"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Clients table
export const clientsTable = pgTable("clients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  document: text("document"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Classe table
export const classeTable = pgTable("classe", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Messages table
export const messagesTable = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  message1: text("message1"),
  message2: text("message2"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Group table
export const groupTable = pgTable("group", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  groupCode: text("group_code").notNull(),
  priority: integer("priority"),
  beginCode: text("begin_code").notNull(),
  finalCode: text("final_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Billing Control table
export const billingControlTable = pgTable("billing_control", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  lastBillingNumber: text("last_billing_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
  nextBillingNumber: text("next_billing_number").notNull(),
});

// Contracts table
export const contractsTable = pgTable("contracts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sysUnitId: integer("sys_unit_id"),
  sysUserId: integer("sys_user_id"),
  groupBatchId: integer("group_batch_id"),
  ownerId: integer("owner_id"),
  contractName: text("contract_name").notNull(),
  classId: integer("class_id"),
  statusId: integer("status_id"),
  contractNumber: text("contract_number").notNull(),
  originalContractNumber: text("original_contract_number"),
  currentStatus: text("current_status").default("active"), // active, canceled, redeemed, transferred
  contractType: text("contract_type").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  billingFrequency: integer("billing_frequency").default(1),
  admission: timestamp("admission").notNull(),
  finalGrace: timestamp("final_grace"),
  monthInitialBilling: char("month_initial_billing", { length: 2 }).notNull(),
  yearInitialBilling: char("year_initial_billing", { length: 4 }).notNull(),
  optPayday: integer("opt_payday"),
  collectorId: integer("collector_id"),
  sellerId: integer("seller_id"),
  regionId: integer("region_id"),
  obs: text("obs"),
  servicesAmount: integer("services_amount"),
  renewAt: timestamp("renew_at"),
  firstCharge: integer("first_charge"),
  lastCharge: integer("last_charge"),
  chargesAmount: integer("charges_amount"),
  chargesPaid: integer("charges_paid"),
  alives: integer("alives"),
  deceaseds: integer("deceaseds"),
  dependents: integer("dependents"),
  serviceOption1: text("service_option1"),
  serviceOption2: text("service_option2"),
  indicatedBy: integer("indicated_by"),
  gracePeriodDays: text("grace_period_days"),
  lateFeePercentage: decimal("late_fee_percentage", { precision: 8, scale: 5 }),
  isPartialPaymentsAllowed: boolean("is_partial_payments_allowed"),
  defaultPlanInstallments: text("default_plan_installments"),
  defaultPlanFrequency: text("default_plan_frequency").default("MONTHLY"),
  industry: text("industry").default("FUNERAL"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Contract Number Registry table - Enhanced contract numbering system
export const contractNumberRegistryTable = pgTable("contract_number_registry", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  groupBatchId: integer("group_batch_id").references(() => groupBatchTable.id).notNull(),
  contractNumber: text("contract_number").notNull().unique(), // e.g., "000001"
  currentContractId: integer("current_contract_id").references(() => contractsTable.id),
  status: text("status").notNull().default("available"), // available, assigned, reserved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Contract Status History table - Tracks all contract status changes and number transfers
export const contractStatusHistoryTable = pgTable("contract_status_history", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  contractId: integer("contract_id").references(() => contractsTable.id).notNull(),
  oldStatus: text("old_status"),
  newStatus: text("new_status").notNull(),
  oldContractNumber: text("old_contract_number"),
  newContractNumber: text("new_contract_number"),
  oldGroupBatchId: integer("old_group_batch_id").references(() => groupBatchTable.id),
  newGroupBatchId: integer("new_group_batch_id").references(() => groupBatchTable.id),
  reason: text("reason").notNull(), // canceled, redeemed, transferred, new_sale, group_transfer
  reasonDescription: text("reason_description"), // Additional details
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Beneficiaries table
export const beneficiariesTable = pgTable("beneficiaries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  contractId: integer("contract_id").references(() => contractsTable.id),
  name: text("name").notNull(),
  relationship: text("relationship"),
  birthDate: timestamp("birth_date"),
  document: text("document"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contract Charges table (based on contract_charge SQL structure)
export const contractChargesTable = pgTable("contract_charges", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  contractId: integer("contract_id").references(() => contractsTable.id).notNull(),
  sysUnitId: integer("sys_unit_id"),
  paymentStatusId: integer("payment_status_id"),
  chargeCode: text("charge_code").notNull(),
  dueDate: timestamp("due_date").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  paymentDate: timestamp("payment_date"),
  amountPaid: decimal("amount_paid", { precision: 19, scale: 4 }),
  convenio: text("convenio"),
  dueMonth: char("due_month", { length: 2 }),
  dueYear: char("due_year", { length: 4 }),
  paidMonth: char("paid_month", { length: 2 }),
  paidYear: char("paid_year", { length: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Legacy Charges table (kept for compatibility)
export const chargesTable = pgTable("charges", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  contractId: integer("contract_id").references(() => contractsTable.id),
  reference: text("reference").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Addendums table
export const addendumsTable = pgTable("addendums", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  contractId: integer("contract_id").references(() => contractsTable.id),
  type: text("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Batch Detail table
export const batchDetailTable = pgTable("batch_detail", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  batchNumber: text("batch_number").notNull(),
  contractId: integer("contract_id").references(() => contractsTable.id),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group Batch table  
export const groupBatchTable = pgTable("group_batch", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  batchName: text("batch_name").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Batch CHK table  
export const batchChkTable = pgTable("batch_chk", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  batchNumber: text("batch_number").notNull(),
  processDate: timestamp("process_date"),
  status: text("status").default("pending"),
  totalAmount: decimal("total_amount", { precision: 19, scale: 4 }),
  recordCount: integer("record_count"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =========================================================================
// FINANCIAL MODULE TABLES
// =========================================================================

// Account Types table
export const accountTypesTable = pgTable("account_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").references(() => companyTable.id).notNull(),
  typeName: text("type_name").notNull(),
  nature: text("nature").notNull(), // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  description: text("description"),
  isSystem: boolean("is_system").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// Chart of Accounts table
export const accountsTable = pgTable("accounts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").references(() => companyTable.id).notNull(),
  accountTypeId: integer("account_type_id").references(() => accountTypesTable.id).notNull(),
  parentAccountId: integer("parent_account_id").references(() => accountsTable.id),
  accountCode: text("account_code").notNull(),
  accountName: text("account_name").notNull(),
  description: text("description"),
  isBankAccount: boolean("is_bank_account").default(false),
  isControlAccount: boolean("is_control_account").default(false),
  isTaxRelevant: boolean("is_tax_relevant").default(false),
  currency: char("currency", { length: 3 }).default("BRL"),
  openingBalance: decimal("opening_balance", { precision: 19, scale: 4 }).default("0"),
  currentBalance: decimal("current_balance", { precision: 19, scale: 4 }).default("0"),
  level: integer("level").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// Cost Centers table
export const costCentersTable = pgTable("cost_centers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").references(() => companyTable.id).notNull(),
  parentCostCenterId: integer("parent_cost_center_id").references(() => costCentersTable.id),
  costCenterCode: text("cost_center_code").notNull(),
  costCenterName: text("cost_center_name").notNull(),
  description: text("description"),
  managerName: text("manager_name"),
  budget: decimal("budget", { precision: 19, scale: 4 }),
  level: integer("level").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// Departments table
export const departmentsTable = pgTable("departments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").references(() => companyTable.id).notNull(),
  parentDepartmentId: integer("parent_department_id").references(() => departmentsTable.id),
  departmentCode: text("department_code").notNull(),
  departmentName: text("department_name").notNull(),
  description: text("description"),
  managerName: text("manager_name"),
  costCenterId: integer("cost_center_id").references(() => costCentersTable.id),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// Projects table
export const projectsTable = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").references(() => companyTable.id).notNull(),
  projectCode: text("project_code").notNull(),
  projectName: text("project_name").notNull(),
  description: text("description"),
  managerName: text("manager_name"),
  costCenterId: integer("cost_center_id").references(() => costCentersTable.id),
  departmentId: integer("department_id").references(() => departmentsTable.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 19, scale: 4 }),
  status: text("status").notNull().default("PLANNED"), // PLANNED, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
  completionPercentage: decimal("completion_percentage", { precision: 5, scale: 2 }).default("0"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// Fiscal Years table
export const fiscalYearsTable = pgTable("fiscal_years", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer("company_id").references(() => companyTable.id).notNull(),
  yearName: text("year_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// Fiscal Periods table
export const fiscalPeriodsTable = pgTable("fiscal_periods", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fiscalYearId: integer("fiscal_year_id").references(() => fiscalYearsTable.id).notNull(),
  periodName: text("period_name").notNull(),
  periodNumber: integer("period_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isAdjustment: boolean("is_adjustment").default(false),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
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

export const insertContractChargeSchema = createInsertSchema(contractChargesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  createdBy: true,
  updatedBy: true,
  deletedBy: true,
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

// Financial module insert schemas
export const insertAccountTypeSchema = createInsertSchema(accountTypesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountSchema = createInsertSchema(accountsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCostCenterSchema = createInsertSchema(costCentersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departmentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFiscalYearSchema = createInsertSchema(fiscalYearsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFiscalPeriodSchema = createInsertSchema(fiscalPeriodsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Financial module type definitions
export type InsertAccountType = z.infer<typeof insertAccountTypeSchema>;
export type SelectAccountType = typeof accountTypesTable.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type SelectAccount = typeof accountsTable.$inferSelect;

export type InsertCostCenter = z.infer<typeof insertCostCenterSchema>;
export type SelectCostCenter = typeof costCentersTable.$inferSelect;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type SelectDepartment = typeof departmentsTable.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type SelectProject = typeof projectsTable.$inferSelect;

export type InsertFiscalYear = z.infer<typeof insertFiscalYearSchema>;
export type SelectFiscalYear = typeof fiscalYearsTable.$inferSelect;

export type InsertFiscalPeriod = z.infer<typeof insertFiscalPeriodSchema>;
export type SelectFiscalPeriod = typeof fiscalPeriodsTable.$inferSelect;

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

export const insertContractNumberRegistrySchema = createInsertSchema(contractNumberRegistryTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractStatusHistorySchema = createInsertSchema(contractStatusHistoryTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Attendance/Service Management Tables

// Payment Receipt table - Recibo de Pagamento
export const paymentReceiptTable = pgTable("payment_receipt", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subsidiaryId: integer("subsidiary_id"),
  sysUnitId: integer("sys_unit_id"),
  sysUserId: integer("sys_user_id"),
  contractId: integer("contract_id").references(() => contractsTable.id),
  status: char("status", { length: 2 }),
  billingNumber: text("billing_number"),
  valPayment: decimal("val_payment", { precision: 19, scale: 4 }),
  valAux: decimal("val_aux", { precision: 19, scale: 4 }),
  dueDate: timestamp("due_date"),
  cashierNumber: char("cashier_number", { length: 8 }),
  methodPay: text("method_pay"),
  obsPay: text("obs_pay"),
  ordpgrcId: integer("ordpgrc_id"),
  paymentStatusId: integer("payment_status_id").references(() => paymentStatusTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Member Card table - Carteirinha
export const carteirinhaTable = pgTable("carteirinha", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  performedServiceId: integer("performed_service_id"),
  sysUnitId: integer("sys_unit_id"),
  sysUserId: integer("sys_user_id"),
  contractId: integer("contract_id").references(() => contractsTable.id),
  beneficiaryId: integer("beneficiary_id").references(() => beneficiariesTable.id),
  cardCod: text("card_cod"), // código impresso no cartão
  vencimento: text("vencimento"), // válido até... (VAL 06/2025 A 05/2026)
  observacao: text("observacao"),
  importadoAt: timestamp("importado_at"), // data que foi importado do contrato/beneficiário/cobrança
  exportadoAt: timestamp("exportado_at"), // data que exportou para impressão do cartão
  retornoAt: timestamp("retorno_at"), // data do recebimento do cartão impresso
  entregueAt: timestamp("entregue_at"), // data da entrega ao beneficiário
  valor: decimal("valor", { precision: 19, scale: 4 }),
  pagoAt: timestamp("pago_at"), // data do pagamento
  numop: char("numop", { length: 10 }), // número do caixa
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Medical Forward table - Encaminhamento Médico
export const medicalForwardTable = pgTable("medical_forward", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sysUnitId: integer("sys_unit_id"), 
  sysUserId: integer("sys_user_id"),
  partnerId: integer("partner_id").references(() => partnersTable.id), // qual parceiro/médico/credenciado
  performedServiceId: integer("performed_service_id"), // qual serviço
  observation: text("observation"),
  valPayment: decimal("val_payment", { precision: 19, scale: 4 }), // valor pago
  valAux: decimal("val_aux", { precision: 19, scale: 4 }), // pago com
  dueDate: timestamp("due_date"), // data do pagamento
  cashierNumber: char("cashier_number", { length: 8 }), // número do caixa
  methodPay: text("method_pay"), // método (dinheiro, cartão, pix...)
  obsPay: text("obs_pay"),
  ordpgrcId: integer("ordpgrc_id"), // Caixa
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
  deletedBy: integer("deleted_by"),
});

// Insert schemas for attendance tables
export const insertPaymentReceiptSchema = createInsertSchema(paymentReceiptTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarteirinhaSchema = createInsertSchema(carteirinhaTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalForwardSchema = createInsertSchema(medicalForwardTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type Contract = typeof contractsTable.$inferSelect;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
export type ContractCharge = typeof contractChargesTable.$inferSelect;
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
export type ContractNumberRegistry = typeof contractNumberRegistryTable.$inferSelect;
export type ContractStatusHistory = typeof contractStatusHistoryTable.$inferSelect;
export type PaymentReceipt = typeof paymentReceiptTable.$inferSelect;
export type Carteirinha = typeof carteirinhaTable.$inferSelect;
export type MedicalForward = typeof medicalForwardTable.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
export type InsertContractCharge = z.infer<typeof insertContractChargeSchema>;
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
export type InsertContractNumberRegistry = z.infer<typeof insertContractNumberRegistrySchema>;
export type InsertContractStatusHistory = z.infer<typeof insertContractStatusHistorySchema>;
export type InsertPaymentReceipt = z.infer<typeof insertPaymentReceiptSchema>;
export type InsertCarteirinha = z.infer<typeof insertCarteirinhaSchema>;
export type InsertMedicalForward = z.infer<typeof insertMedicalForwardSchema>;

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