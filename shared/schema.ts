import { mysqlTable, varchar, int, boolean, timestamp, decimal, char, text, mysqlEnum, AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Core System Tables ---

export const genderTable = mysqlTable("gender", {
  genderId: int("gender_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const documentTypesTable = mysqlTable("document_type", {
  documentTypeId: int("document_type_id").primaryKey().autoincrement(),
  description: varchar("description", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),

  active: boolean("active").default(true),});

export const addressTypesTable = mysqlTable("address_type", {
  addressTypeId: int("address_type_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),

  active: boolean("active").default(true),});

export const paymentStatusTable = mysqlTable("payment_status", {
  paymentStatusId: int("payment_status_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  code: char("code", { length: 2 }).notNull(),
  kanban: boolean("kanban").default(false),
  color: varchar("color", { length: 100 }),
  kanbanOrder: int("kanban_order"),
  finalState: boolean("final_state").default(false),
  initialState: boolean("initial_state").default(false),
  allowEdition: boolean("allow_edition").default(true),
  allowDeletion: boolean("allow_deletion").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const estadoTable = mysqlTable("state", {
  stateId: int("state_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  uf: char("uf", { length: 2 }).notNull(),
  codigoIbge: varchar("codigo_ibge", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const cidadeTable = mysqlTable("city", {
  cityId: int("city_id").primaryKey().autoincrement(),
  stateId: int("state_id").references(() => estadoTable.stateId),
  name: varchar("name", { length: 100 }).notNull(),
  codigoIbge: varchar("codigo_ibge", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const currencyTable = mysqlTable("currency", {
  currencyId: int("currency_id").primaryKey().autoincrement(),
  code: char("currency_code", { length: 3 }).notNull(),
  name: varchar("currency_name", { length: 50 }).notNull(),
  symbol: varchar("currency_symbol", { length: 10 }),
  decimalPlaces: int("decimal_places").default(2).notNull(),
  roundingMethod: varchar("rounding_method", { length: 20 }).default("HALF_UP"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const generalStatusTable = mysqlTable("general_status", {
  generalStatusId: int("general_status_id").primaryKey().autoincrement(),
  statusCode: varchar("status_code", { length: 20 }).notNull(),
  statusName: varchar("status_name", { length: 50 }).notNull(),
  description: text("description"),
  generateCharge: boolean("generate_charge").default(false),
  allowsService: boolean("allows_service").default(false),
  chargeAfter: int("charge_after"),
  kanban: boolean("kanban").default(false),
  color: varchar("color", { length: 100 }),
  kanbanOrder: int("kanban_order"),
  finalState: boolean("final_state").default(false),
  initialState: boolean("initial_state").default(false),
  allowEdition: boolean("allow_edition").default(true),
  allowDeletion: boolean("allow_deletion").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

// --- Main System Entities ---

export const companyTable = mysqlTable("company", {
  companyId: int("company_id").primaryKey().autoincrement(),
  parentCompanyId: int("parent_company_id").references((): AnyMySqlColumn => companyTable.companyId),
  companyName: varchar("company_name", { length: 100 }).notNull(),
  legalName: varchar("legal_name", { length: 150 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }).notNull(),
  addressId: int("address_id"),
  country: varchar("country", { length: 50 }),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  fiscalYearStart: timestamp("fiscal_year_start"),
  defaultCurrency: char("default_currency", { length: 3 }).default("BRL").notNull(),
  isConsolidated: boolean("is_consolidated").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const subsidiaryTable = mysqlTable("subsidiary", {
  subsidiaryId: int("subsidiary_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const sysUnitTable = mysqlTable("sys_unit", {
  sysUnitId: int("sys_unit_id").primaryKey().autoincrement(),
  subsidiaryId: int("subsidiary_id").references(() => subsidiaryTable.subsidiaryId).notNull(),
  generalStatusId: int("general_status_id").references(() => generalStatusTable.generalStatusId),
  name: text("name").notNull(),
  connectionName: text("connection_name"),
  code: varchar("code", { length: 20 }).notNull(),
});

export const sysUsersTable = mysqlTable("sys_user", {
  sysUserId: int("sys_user_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull(),
  login: varchar("login", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  passwordSalt: varchar("password_salt", { length: 100 }),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  frontpageId: int("frontpage_id"),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  active: boolean("active").default(true),
  acceptedTermPolicyAt: timestamp("accepted_term_policy_at"),
  acceptedTermPolicy: boolean("accepted_term_policy"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorType: varchar("two_factor_type", { length: 100 }),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  isAdmin: boolean("is_admin").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const addressesTable = mysqlTable("address", {
  addressId: int("address_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  addressTypeId: int("address_type_id").references(() => addressTypesTable.addressTypeId).notNull(),
  isMain: boolean("is_main").default(true),
  zipCode: varchar("zip_code", { length: 50 }).notNull(),
  address: varchar("address", { length: 200 }).notNull(),
  addressNumber: varchar("address_number", { length: 100 }),
  addressLine1: varchar("address_line1", { length: 250 }),
  addressLine2: varchar("address_line2", { length: 250 }),
  city: varchar("city", { length: 200 }).notNull(),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 50 }),
  observacao: text("observacao"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const entityAddressesTable = mysqlTable("entity_address", {
  entityAddressId: int("entity_address_id").primaryKey().autoincrement(),
  entityType: mysqlEnum("entity_type", ["client", "partner", "contract"]).notNull(),
  entityId: int("entity_id").notNull(),
  addressId: int("address_id").references(() => addressesTable.addressId).notNull(),
  isPrimary: boolean("is_primary").default(false),
});

export const partnerTypesTable = mysqlTable("partner_type", {
  partnerTypeId: int("partner_type_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  typeName: varchar("type_name", { length: 50 }).notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const documentsTable = mysqlTable("document", {
  documentId: int("document_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  documentTypeId: int("document_type_id").references(() => documentTypesTable.documentTypeId).notNull(),
  documentNumber: varchar("document_number", { length: 50 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const entityDocumentsTable = mysqlTable("entity_document", {
  entityDocumentId: int("entity_document_id").primaryKey().autoincrement(),
  entityType: mysqlEnum("entity_type", ["client", "partner", "contract"]).notNull(),
  entityId: int("entity_id").notNull(),
  documentId: int("document_id").references(() => documentsTable.documentId).notNull(),
  isActive: boolean("is_active").default(true),
});

// --- Business Entities ---

export const partnersTable = mysqlTable("partner", {
  partnerId: int("partner_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  ownerId: int("owner_id").references(() => sysUsersTable.sysUserId).notNull(),
  partnerCode: varchar("partner_code", { length: 30 }).notNull(),
  partnerName: varchar("partner_name", { length: 100 }).notNull(),
  legalName: varchar("legal_name", { length: 150 }),
  taxId: varchar("tax_id", { length: 30 }),
  partnerTypeId: int("partner_type_id").references(() => partnerTypesTable.partnerTypeId).notNull(),
  isCustomer: boolean("is_customer").default(false),
  isVendor: boolean("is_vendor").default(false),
  isCollector: boolean("is_collector").default(false),
  isEmployee: boolean("is_employee").default(false),
  isAccredited: boolean("is_accredited").default(false),
  specialtyId: int("specialty_id"),
  advantages: text("advantages"),
  observation: text("observation"),
  creditLimit: decimal("credit_limit", { precision: 19, scale: 4 }),
  paymentTerms: int("payment_terms"),
  billingAddressId: int("billing_address_id").references(() => addressesTable.addressId),
  shippingAddressId: int("shipping_address_id").references(() => addressesTable.addressId),
  document1Id: int("document1_id").references(() => documentsTable.documentId),
  document2Id: int("document2_id").references(() => documentsTable.documentId),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
  primaryPartnerPerson: varchar("primary_partner_person", { length: 100 }),
  notes: text("notes"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const classeTable = mysqlTable("category", {
  categoryId: int("category_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  amountContracts: int("amount_contracts"),
  isPeriodic: boolean("is_periodic").default(true).notNull(),
  purchaseValue: decimal("purchase_value", { precision: 19, scale: 4 }).notNull(),
  numberOfParcels: int("number_of_parcels").notNull(),
  generatedParcels: int("generated_parcels").notNull(),
  monthValue: decimal("month_value", { precision: 19, scale: 4 }).notNull(),
  dependValue: decimal("depend_value", { precision: 19, scale: 4 }),
  numberOfMonthValid: int("number_of_month_valid"),
  isRenewable: boolean("is_renewable").default(false),
  isRenewableUsed: boolean("is_renewable_used").default(false),
  totalValue: decimal("total_value", { precision: 19, scale: 4 }),
  message1: varchar("message1", { length: 30 }),
  message2: varchar("message2", { length: 30 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const groupBatchTable = mysqlTable("group_batch", {
  groupBatchId: int("group_batch_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  classId: int("class_id").references(() => classeTable.categoryId).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  groupCode: varchar("group_code", { length: 5 }).notNull(),
  beginCode: varchar("begin_code", { length: 9 }).notNull(),
  finalCode: varchar("final_code", { length: 9 }).notNull(),
  isPeriodic: boolean("is_periodic").notNull(),
  amountProcess: int("amount_process").notNull(),
  minProc: int("min_proc").notNull(),
  maxProc: int("max_proc").notNull(),
  compareAdmission: boolean("compare_admission").default(false).notNull(),
  amountRedeem: int("amount_redeem").notNull(),
  byService: boolean("by_service").default(true).notNull(),
  deathCount: int("death_count").default(0),
  currentDeathCount: int("current_death_count").default(0),
  deathThreshold: int("death_threshold").default(10).notNull(),
  lastBillingNumber: varchar("last_billing_number", { length: 3 }).notNull(),
  nextBillingNumber: varchar("next_billing_number", { length: 3 }).notNull(),
  lastIssueDate: timestamp("last_issue_date"),
  lastDeathChargeDate: timestamp("last_death_charge_date"),
  pendingProcess: int("pending_process"),
  numberContracts: int("number_contracts"),
  numberLifes: int("number_lifes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contractsTable = mysqlTable("contract", {
  contractId: int("contract_id").primaryKey().autoincrement(),
  currentVersionId: int("current_version_id"),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  ownerId: int("owner_id").references(() => sysUsersTable.sysUserId).notNull(),
  partnerId: int("partner_id").references(() => partnersTable.partnerId),
  indicatedBy: int("indicated_by").references(() => sysUsersTable.sysUserId),
  contractName: varchar("contract_name", { length: 100 }).notNull(),
  contractNumber: varchar("contract_number", { length: 20 }).notNull(),
  originalContractNumber: varchar("original_contract_number", { length: 100 }),
  currentStatus: varchar("current_status", { length: 50 }).default("active"),
  statusId: int("status_id"),
  classId: int("class_id").references(() => classeTable.categoryId),
  collectorId: int("collector_id").references(() => sysUsersTable.sysUserId),
  sellerId: int("seller_id").references(() => sysUsersTable.sysUserId),
  regionId: int("region_id"),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  obs: text("obs"),
  servicesAmount: int("services_amount"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contractVersionTable = mysqlTable("contract_version", {
  contractVersionId: int("contract_version_id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.contractId).notNull(),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId).notNull(),
  versionNumber: int("version_number").default(1).notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to"),
  isCurrent: boolean("is_current").default(true),
  changeReason: varchar("change_reason", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contractCoversTable = mysqlTable("contract_covers", {
  contractCoversId: int("contract_covers_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId).notNull(),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId).notNull(),
  classId: int("class_id").references(() => classeTable.categoryId).notNull(),
  statusId: int("status_id").references(() => generalStatusTable.generalStatusId).notNull(),
  contractType: varchar("contract_type", { length: 50 }).notNull(),
  industry: varchar("industry", { length: 50 }).default("FUNERAL"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  admission: timestamp("admission").notNull(),
  finalGrace: timestamp("final_grace"),
  gracePeriodDays: varchar("grace_period_days", { length: 50 }),
  renewAt: timestamp("renew_at"),
  servicesAmount: int("services_amount"),
  serviceOption1: varchar("service_option1", { length: 100 }),
  serviceOption2: varchar("service_option2", { length: 100 }),
  alives: int("alives"),
  deceaseds: int("deceaseds"),
  dependents: int("dependents"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contractConfigBillingTable = mysqlTable("contract_config_billing", {
  contractConfigBillingId: int("contract_config_billing_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId).notNull(),
  sellerId: int("seller_id").references(() => sysUsersTable.sysUserId),
  collectorId: int("collector_id").references(() => sysUsersTable.sysUserId),
  regionId: int("region_id"),
  billingFrequency: int("billing_frequency").default(1).notNull(),
  monthInitialBilling: char("month_initial_billing", { length: 2 }).notNull(),
  yearInitialBilling: char("year_initial_billing", { length: 4 }).notNull(),
  optPayday: int("opt_payday"),
  firstCharge: int("first_charge"),
  lastCharge: int("last_charge"),
  chargesAmount: int("charges_amount"),
  chargesPaid: int("charges_paid"),
  lateFeePercentage: decimal("late_fee_percentage", { precision: 8, scale: 5 }),
  isPartialPaymentsAllowed: boolean("is_partial_payments_allowed").default(false),
  defaultPlanInstallments: varchar("default_plan_installments", { length: 50 }),
  defaultPlanFrequency: varchar("default_plan_frequency", { length: 20 }).default("MONTHLY"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const beneficiariesTable = mysqlTable("beneficiary", {
  beneficiaryId: int("beneficiary_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId).notNull(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 50 }).notNull(),
  isPrimary: boolean("is_primary").default(false),
  birthAt: timestamp("birth_at"),
  genderId: int("gender_id").references(() => genderTable.genderId),
  documentId: int("document_id").references(() => documentsTable.documentId),
  graceAt: timestamp("grace_at"),
  isAlive: boolean("is_alive").default(true),
  isForbidden: boolean("is_forbidden").default(false),
  serviceFuneralId: int("service_funeral_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contractChargesTable = mysqlTable("contract_charge", {
  contractChargeId: int("contract_charge_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId).notNull(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  paymentStatusId: int("payment_status_id").references(() => paymentStatusTable.paymentStatusId).notNull(),
  chargeCode: varchar("charge_code", { length: 100 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  paymentDate: timestamp("payment_date"),
  paidAmount: decimal("paid_amount", { precision: 19, scale: 4 }),
  dueMonth: char("due_month", { length: 2 }),
  dueYear: char("due_year", { length: 4 }),
  convenio: varchar("convenio", { length: 20 }),
  paydMonth: char("payd_month", { length: 2 }),
  paydYear: char("payd_year", { length: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const clientsTable = mysqlTable("client", {
  clientId: int("client_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  taxId: varchar("tax_id", { length: 20 }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const addendumsTable = mysqlTable("addendum", {
  addendumId: int("addendum_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  contractId: int("contract_id").references(() => contractsTable.contractId).notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  valAddendum: decimal("val_addendum", { precision: 19, scale: 4 }).notNull(),
  dtAddendum: timestamp("dt_addendum").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const batchChkTable = mysqlTable("batch_chk", {
  batchChkId: int("batch_chk_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  dtBatch: timestamp("dt_batch").notNull(),
  amountBatch: int("amount_batch").notNull(),
  valBatch: decimal("val_batch", { precision: 19, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const batchDetailTable = mysqlTable("batch_detail", {
  batchDetailId: int("batch_detail_id").primaryKey().autoincrement(),
  batchChkId: int("batch_chk_id").references(() => batchChkTable.batchChkId).notNull(),
  contractId: int("contract_id").references(() => contractsTable.contractId).notNull(),
  valDetail: decimal("val_detail", { precision: 19, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const carteirinhaTable = mysqlTable("membership_card", {
  membershipCardId: int("membership_card_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  contractId: int("contract_id").references(() => contractsTable.contractId).notNull(),
  dtIssue: timestamp("dt_issue").notNull(),
  dtExpiry: timestamp("dt_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const medicalForwardTable = mysqlTable("medical_forward", {
  medicalForwardId: int("medical_forward_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  partnerId: int("partner_id").references(() => partnersTable.partnerId).notNull(),
  performedServiceId: int("performed_service_id").notNull(),
  observation: text("observation"),
  valPayment: decimal("val_payment", { precision: 19, scale: 4 }),
  valAux: decimal("val_aux", { precision: 19, scale: 4 }),
  dueDate: timestamp("due_date"),
  cashierNumber: char("cashier_number", { length: 8 }),
  methodPay: varchar("method_pay", { length: 100 }),
  obsPay: varchar("obs_pay", { length: 200 }),
  ordpgrcId: int("ordpgrc_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const paymentReceiptTable = mysqlTable("payment_receipt", {
  paymentReceiptId: int("payment_receipt_id").primaryKey().autoincrement(),
  subsidiaryId: int("subsidiary_id").references(() => subsidiaryTable.subsidiaryId).notNull(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId).notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId).notNull(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId).notNull(),
  status: char("status", { length: 2 }),
  billingNumber: varchar("billing_number", { length: 100 }),
  valPayment: decimal("val_payment", { precision: 19, scale: 4 }),
  valAux: decimal("val_aux", { precision: 19, scale: 4 }),
  dueDate: timestamp("due_date"),
  cashierNumber: char("cashier_number", { length: 8 }),
  methodPay: varchar("method_pay", { length: 100 }),
  obsPay: varchar("obs_pay", { length: 200 }),
  ordpgrcId: int("ordpgrc_id").notNull(),
  paymentStatusId: int("payment_status_id").references(() => paymentStatusTable.paymentStatusId).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

// --- Financial Tables ---

export const accountTypesTable = mysqlTable("account_type", {
  accountTypeId: int("account_type_id").primaryKey().autoincrement(),
  typeName: varchar("type_name", { length: 50 }).notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const accountsTable = mysqlTable("account", {
  accountId: int("account_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  accountTypeId: int("account_type_id").references(() => accountTypesTable.accountTypeId).notNull(),
  parentAccountId: int("parent_account_id").references((): AnyMySqlColumn => accountsTable.accountId),
  accountCode: varchar("account_code", { length: 30 }).notNull(),
  accountName: varchar("account_name", { length: 100 }).notNull(),
  description: text("description"),
  isBankAccount: boolean("is_bank_account").default(false),
  isControlAccount: boolean("is_control_account").default(false),
  isTaxRelevant: boolean("is_tax_relevant").default(false),
  currency: char("currency", { length: 3 }).default("BRL").notNull(),
  openingBalance: decimal("opening_balance", { precision: 19, scale: 4 }).default("0"),
  currentBalance: decimal("current_balance", { precision: 19, scale: 4 }).default("0"),
  level: int("level").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const costCentersTable = mysqlTable("cost_center", {
  costCenterId: int("cost_center_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  parentCostCenterId: int("parent_cost_center_id").references((): AnyMySqlColumn => costCentersTable.costCenterId),
  costCenterCode: varchar("cost_center_code", { length: 30 }).notNull(),
  costCenterName: varchar("cost_center_name", { length: 100 }).notNull(),
  description: text("description"),
  level: int("level").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const departmentsTable = mysqlTable("department", {
  departmentId: int("department_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  departmentCode: varchar("department_code", { length: 30 }).notNull(),
  departmentName: varchar("department_name", { length: 100 }).notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const projectsTable = mysqlTable("project", {
  projectId: int("project_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  projectCode: varchar("project_code", { length: 30 }).notNull(),
  projectName: varchar("project_name", { length: 100 }).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const fiscalYearsTable = mysqlTable("fiscal_year", {
  fiscalYearId: int("fiscal_year_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId).notNull(),
  yearName: varchar("year_name", { length: 50 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status", { length: 20 }).default("OPEN"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const fiscalPeriodsTable = mysqlTable("fiscal_period", {
  fiscalPeriodId: int("fiscal_period_id").primaryKey().autoincrement(),
  fiscalYearId: int("fiscal_year_id").references(() => fiscalYearsTable.fiscalYearId).notNull(),
  periodName: varchar("period_name", { length: 50 }).notNull(),
  periodNumber: int("period_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status", { length: 20 }).default("OPEN"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

// --- Registry & History Tables ---

export const contractNumberRegistryTable = mysqlTable("contract_number_registry", {
  contractNumberRegistryId: int("contract_number_registry_id").primaryKey().autoincrement(),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId).notNull(),
  contractNumber: varchar("contract_number", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("available"),
  currentContractId: int("current_contract_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contractStatusHistoryTable = mysqlTable("contract_status_history", {
  contractStatusHistoryId: int("contract_status_history_id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.contractId).notNull(),
  oldStatus: varchar("old_status", { length: 50 }),
  newStatus: varchar("new_status", { length: 50 }).notNull(),
  oldContractNumber: varchar("old_contract_number", { length: 20 }),
  newContractNumber: varchar("new_contract_number", { length: 20 }),
  oldGroupBatchId: int("old_group_batch_id"),
  newGroupBatchId: int("new_group_batch_id"),
  reason: varchar("reason", { length: 255 }),
  reasonDescription: text("reason_description"),
  effectiveDate: timestamp("effective_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
});

// For compatibility with legacy code
export const chargesTable = contractChargesTable;

// --- Zod Schemas ---

export const insertGenderSchema = createInsertSchema(genderTable);
export const insertDocumentTypeSchema = createInsertSchema(documentTypesTable);
export const insertAddressTypeSchema = createInsertSchema(addressTypesTable);
export const insertPaymentStatusSchema = createInsertSchema(paymentStatusTable);
export const insertEstadoSchema = createInsertSchema(estadoTable);
export const insertCidadeSchema = createInsertSchema(cidadeTable);
export const insertCurrencySchema = createInsertSchema(currencyTable);
export const insertGeneralStatusSchema = createInsertSchema(generalStatusTable);
export const insertCompanySchema = createInsertSchema(companyTable);
export const insertSubsidiarySchema = createInsertSchema(subsidiaryTable);
export const insertSysUnitSchema = createInsertSchema(sysUnitTable);
export const insertSysUserSchema = createInsertSchema(sysUsersTable);
export const insertAddressSchema = createInsertSchema(addressesTable);
export const insertEntityAddressSchema = createInsertSchema(entityAddressesTable);
export const insertPartnerTypeSchema = createInsertSchema(partnerTypesTable);
export const insertDocumentSchema = createInsertSchema(documentsTable);
export const insertEntityDocumentSchema = createInsertSchema(entityDocumentsTable);
export const insertPartnerSchema = createInsertSchema(partnersTable);
export const insertClasseSchema = createInsertSchema(classeTable);
export const insertGroupBatchSchema = createInsertSchema(groupBatchTable);
export const insertContractSchema = createInsertSchema(contractsTable);
export const insertContractVersionSchema = createInsertSchema(contractVersionTable);
export const insertContractCoversSchema = createInsertSchema(contractCoversTable);
export const insertContractConfigBillingSchema = createInsertSchema(contractConfigBillingTable);
export const insertBeneficiarySchema = createInsertSchema(beneficiariesTable);
export const insertContractChargeSchema = createInsertSchema(contractChargesTable);
export const insertChargeSchema = createInsertSchema(contractChargesTable); // Compatibility
export const insertClientSchema = createInsertSchema(clientsTable);
export const insertAddendumSchema = createInsertSchema(addendumsTable);
export const insertBatchChkSchema = createInsertSchema(batchChkTable);
export const insertBatchDetailSchema = createInsertSchema(batchDetailTable);
export const insertCarteirinhaSchema = createInsertSchema(carteirinhaTable);
export const insertMedicalForwardSchema = createInsertSchema(medicalForwardTable);
export const insertPaymentReceiptSchema = createInsertSchema(paymentReceiptTable);
export const insertAccountTypeSchema = createInsertSchema(accountTypesTable);
export const insertAccountSchema = createInsertSchema(accountsTable);
export const insertCostCenterSchema = createInsertSchema(costCentersTable);
export const insertDepartmentSchema = createInsertSchema(departmentsTable);
export const insertProjectSchema = createInsertSchema(projectsTable);
export const insertFiscalYearSchema = createInsertSchema(fiscalYearsTable);
export const insertFiscalPeriodSchema = createInsertSchema(fiscalPeriodsTable);
export const insertContractNumberRegistrySchema = createInsertSchema(contractNumberRegistryTable);
export const insertContractStatusHistorySchema = createInsertSchema(contractStatusHistoryTable);

// --- Types ---

export type Gender = typeof genderTable.$inferSelect;
export type NewGender = typeof genderTable.$inferInsert;
export type DocumentType = typeof documentTypesTable.$inferSelect;
export type NewDocumentType = typeof documentTypesTable.$inferInsert;
export type AddressType = typeof addressTypesTable.$inferSelect;
export type NewAddressType = typeof addressTypesTable.$inferInsert;
export type PaymentStatus = typeof paymentStatusTable.$inferSelect;
export type NewPaymentStatus = typeof paymentStatusTable.$inferInsert;
export type Estado = typeof estadoTable.$inferSelect;
export type NewEstado = typeof estadoTable.$inferInsert;
export type Cidade = typeof cidadeTable.$inferSelect;
export type NewCidade = typeof cidadeTable.$inferInsert;
export type Currency = typeof currencyTable.$inferSelect;
export type NewCurrency = typeof currencyTable.$inferInsert;
export type GeneralStatus = typeof generalStatusTable.$inferSelect;
export type NewGeneralStatus = typeof generalStatusTable.$inferInsert;
export type Company = typeof companyTable.$inferSelect;
export type NewCompany = typeof companyTable.$inferInsert;
export type Subsidiary = typeof subsidiaryTable.$inferSelect;
export type NewSubsidiary = typeof subsidiaryTable.$inferInsert;
export type SysUnit = typeof sysUnitTable.$inferSelect;
export type NewSysUnit = typeof sysUnitTable.$inferInsert;
export type SysUser = typeof sysUsersTable.$inferSelect;
export type NewSysUser = typeof sysUsersTable.$inferInsert;
export type Address = typeof addressesTable.$inferSelect;
export type NewAddress = typeof addressesTable.$inferInsert;
export type EntityAddress = typeof entityAddressesTable.$inferSelect;
export type NewEntityAddress = typeof entityAddressesTable.$inferInsert;
export type PartnerType = typeof partnerTypesTable.$inferSelect;
export type NewPartnerType = typeof partnerTypesTable.$inferInsert;
export type Document = typeof documentsTable.$inferSelect;
export type NewDocument = typeof documentsTable.$inferInsert;
export type EntityDocument = typeof entityDocumentsTable.$inferSelect;
export type NewEntityDocument = typeof entityDocumentsTable.$inferInsert;
export type Partner = typeof partnersTable.$inferSelect;
export type NewPartner = typeof partnersTable.$inferInsert;
export type Classe = typeof classeTable.$inferSelect;
export type NewClasse = typeof classeTable.$inferInsert;
export type GroupBatch = typeof groupBatchTable.$inferSelect;
export type NewGroupBatch = typeof groupBatchTable.$inferInsert;
export type Contract = typeof contractsTable.$inferSelect;
export type NewContract = typeof contractsTable.$inferInsert;
export type ContractVersion = typeof contractVersionTable.$inferSelect;
export type ContractCovers = typeof contractCoversTable.$inferSelect;
export type ContractConfigBilling = typeof contractConfigBillingTable.$inferSelect;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
export type NewBeneficiary = typeof beneficiariesTable.$inferInsert;
export type ContractCharge = typeof contractChargesTable.$inferSelect;
export type InsertContractCharge = typeof contractChargesTable.$inferInsert;
export type Charge = typeof contractChargesTable.$inferSelect;
export type NewCharge = typeof contractChargesTable.$inferInsert;
export type Client = typeof clientsTable.$inferSelect;
export type NewClient = typeof clientsTable.$inferInsert;
export type Addendum = typeof addendumsTable.$inferSelect;
export type NewAddendum = typeof addendumsTable.$inferInsert;
export type BatchChk = typeof batchChkTable.$inferSelect;
export type NewBatchChk = typeof batchChkTable.$inferInsert;
export type BatchDetail = typeof batchDetailTable.$inferSelect;
export type NewBatchDetail = typeof batchDetailTable.$inferInsert;
export type Carteirinha = typeof carteirinhaTable.$inferSelect;
export type InsertCarteirinha = typeof carteirinhaTable.$inferInsert;
export type MedicalForward = typeof medicalForwardTable.$inferSelect;
export type InsertMedicalForward = typeof medicalForwardTable.$inferInsert;
export type PaymentReceipt = typeof paymentReceiptTable.$inferSelect;
export type InsertPaymentReceipt = typeof paymentReceiptTable.$inferInsert;
export type SelectAccountType = typeof accountTypesTable.$inferSelect;
export type InsertAccountType = typeof accountTypesTable.$inferInsert;
export type SelectAccount = typeof accountsTable.$inferSelect;
export type InsertAccount = typeof accountsTable.$inferInsert;
export type SelectCostCenter = typeof costCentersTable.$inferSelect;
export type InsertCostCenter = typeof costCentersTable.$inferInsert;
export type SelectDepartment = typeof departmentsTable.$inferSelect;
export type InsertDepartment = typeof departmentsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectFiscalYear = typeof fiscalYearsTable.$inferSelect;
export type InsertFiscalYear = typeof fiscalYearsTable.$inferInsert;
export type SelectFiscalPeriod = typeof fiscalPeriodsTable.$inferSelect;
export type InsertFiscalPeriod = typeof fiscalPeriodsTable.$inferInsert;
export type ContractNumberRegistry = typeof contractNumberRegistryTable.$inferSelect;
export type InsertContractNumberRegistry = typeof contractNumberRegistryTable.$inferInsert;
export type ContractStatusHistory = typeof contractStatusHistoryTable.$inferSelect;
export type InsertContractStatusHistory = typeof contractStatusHistoryTable.$inferInsert;
