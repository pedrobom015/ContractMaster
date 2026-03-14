import { mysqlTable, text, varchar, int, boolean, timestamp, decimal, char, date, mysqlEnum, json, bigint } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// -----------------------------------------------------------------------------
// PARTE 1: CONTROLE DE VERSÃO DO SCHEMA
// -----------------------------------------------------------------------------

export const schemaVersionTable = mysqlTable("schema_version", {
  schemaVersionId: int("schema_version_id").primaryKey().autoincrement(),
  version: varchar("version", { length: 20 }).notNull(),
  appliedAt: timestamp("applied_at").default(sql`CURRENT_TIMESTAMP`),
  description: text("description"),
});

// -----------------------------------------------------------------------------
// PARTE 2: TABELAS BASE (sem dependências)
// -----------------------------------------------------------------------------

export const genderTable = mysqlTable("gender", {
  genderId: int("gender_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const documentTypesTable = mysqlTable("document_type", {
  documentTypeId: int("document_type_id").primaryKey().autoincrement(),
  description: varchar("description", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const addressTypesTable = mysqlTable("address_type", {
  addressTypeId: int("address_type_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const estadoTable = mysqlTable("state", {
  stateId: int("state_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  uf: char("uf", { length: 2 }).notNull(),
  codigoIbge: varchar("codigo_ibge", { length: 10 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const cidadeTable = mysqlTable("city", {
  cityId: int("city_id").primaryKey().autoincrement(),
  stateId: int("state_id").references(() => estadoTable.stateId),
  name: varchar("name", { length: 100 }).notNull(),
  codigoIbge: varchar("codigo_ibge", { length: 10 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const currencyTable = mysqlTable("currency", {
  currencyId: int("currency_id").primaryKey().autoincrement(),
  currencyCode: char("currency_code", { length: 3 }).notNull(),
  currencyName: varchar("currency_name", { length: 50 }).notNull(),
  currencySymbol: varchar("currency_symbol", { length: 10 }),
  decimalPlaces: int("decimal_places").default(2),
  roundingMethod: varchar("rounding_method", { length: 20 }).default("HALF_UP"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const contractStatusTable = mysqlTable("contract_status", {
  contractStatusId: int("contract_status_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  code: char("code", { length: 2 }).notNull(),
  generateCharge: boolean("generate_charge").default(false),
  allowsService: boolean("allows_service").default(false),
  chargeAfter: int("charge_after"),
  kanban: boolean("kanban").default(false),
  color: varchar("color", { length: 100 }),
  kanbanOrder: int("kanban_order"),
  isFinalState: boolean("is_final_state").default(false),
  isInitialState: boolean("is_initial_state").default(false),
  allowEdition: boolean("allow_edition").default(true),
  allowDeletion: boolean("allow_deletion").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
  unitId: int("unit_id"),
});

export const stateMachineTransitionsTable = mysqlTable("state_machine_transitions", {
  stateMachineTransitionsId: int("state_machine_transitions_id").primaryKey().autoincrement(),
  contractStatusIdFrom: int("contract_status_id_from").references(() => contractStatusTable.contractStatusId),
  contractStatusIdTo: int("contract_status_id_to").references(() => contractStatusTable.contractStatusId),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
  unitId: int("unit_id"),
});

export const statusReasonTable = mysqlTable("status_reason", {
  statusReasonId: int("status_reason_id").primaryKey().autoincrement(),
  reason: varchar("reason", { length: 200 }).notNull(),
  description: varchar("description", { length: 250 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
  unitId: int("unit_id"),
});

// -----------------------------------------------------------------------------
// PARTE 3: TABELAS DE SISTEMA
// -----------------------------------------------------------------------------

export const sysGroupTable = mysqlTable("sys_group", {
  sysGroupId: int("sys_group_id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  uuid: varchar("uuid", { length: 36 }),
});

export const sysProgramTable = mysqlTable("sys_program", {
  sysProgramId: int("sys_program_id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  controller: text("controller").notNull(),
  actions: text("actions"),
});

export const sysGroupProgramTable = mysqlTable("sys_group_program", {
  sysGroupProgramId: int("sys_group_program_id").primaryKey().autoincrement(),
  sysGroupId: int("sys_group_id").references(() => sysGroupTable.sysGroupId),
  sysProgramId: int("sys_program_id").references(() => sysProgramTable.sysProgramId),
  actions: text("actions"),
});

export const sysPreferenceTable = mysqlTable("sys_preference", {
  sysPreferenceId: varchar("sys_preference_id", { length: 200 }).primaryKey(),
  preference: text("preference"),
});

export const subsidiaryTable = mysqlTable("subsidiary", {
  subsidiaryId: int("subsidiary_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const sysUnitTable = mysqlTable("sys_unit", {
  sysUnitId: int("sys_unit_id").primaryKey().autoincrement(),
  subsidiaryId: int("subsidiary_id").references(() => subsidiaryTable.subsidiaryId),
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
  frontpageId: int("frontpage_id").references(() => sysProgramTable.sysProgramId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  active: boolean("active").default(true),
  acceptedTermPolicyAt: timestamp("accepted_term_policy_at"),
  acceptedTermPolicy: boolean("accepted_term_policy"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorType: varchar("two_factor_type", { length: 100 }),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  isAdmin: boolean("is_admin").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const sysUserGroupTable = mysqlTable("sys_user_group", {
  sysUserGroupId: int("sys_user_group_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  sysGroupId: int("sys_group_id").references(() => sysGroupTable.sysGroupId),
});

export const sysUserProgramTable = mysqlTable("sys_user_program", {
  sysUserProgramId: int("sys_user_program_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  sysProgramId: int("sys_program_id").references(() => sysProgramTable.sysProgramId),
});

export const sysUserUnitTable = mysqlTable("sys_user_unit", {
  sysUserUnitId: int("sys_user_unit_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
});

// -----------------------------------------------------------------------------
// PARTE 4: ENDEREÇOS E DOCUMENTOS
// -----------------------------------------------------------------------------

export const addressesTable = mysqlTable("address", {
  addressId: int("address_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  addressTypeId: int("address_type_id").references(() => addressTypesTable.addressTypeId),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const entityAddressesTable = mysqlTable("entity_address", {
  entityAddressId: int("entity_address_id").primaryKey().autoincrement(),
  entityType: mysqlEnum("entity_type", ['client', 'partner']).notNull(),
  entityId: int("entity_id").notNull(),
  addressId: int("address_id").references(() => addressesTable.addressId),
  isPrimary: boolean("is_primary").default(false),
});

export const documentsTable = mysqlTable("document", {
  documentId: int("document_id").primaryKey().autoincrement(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  documentTypeId: int("document_type_id").references(() => documentTypesTable.documentTypeId),
  documentNumber: varchar("document_number", { length: 50 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const entityDocumentsTable = mysqlTable("entity_document", {
  entityDocumentId: int("entity_document_id").primaryKey().autoincrement(),
  entityType: mysqlEnum("entity_type", ['client', 'partner']).notNull(),
  entityId: int("entity_id").notNull(),
  documentId: int("document_id").references(() => documentsTable.documentId),
  isActive: boolean("is_active").default(true),
});

// -----------------------------------------------------------------------------
// PARTE 5: EMPRESA E PARCEIROS
// -----------------------------------------------------------------------------

export const companyTable = mysqlTable("company", {
  companyId: int("company_id").primaryKey().autoincrement(),
  parentCompanyId: int("parent_company_id").references((): any => companyTable.companyId),
  companyName: varchar("company_name", { length: 100 }).notNull(),
  legalName: varchar("legal_name", { length: 150 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }).notNull(),
  addressId: int("address_id").references(() => addressesTable.addressId),
  country: varchar("country", { length: 50 }),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  fiscalYearStart: date("fiscal_year_start"),
  defaultCurrency: char("default_currency", { length: 3 }).default("BRL").notNull(),
  isConsolidated: boolean("is_consolidated").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const userCompanyAccessTable = mysqlTable("user_company_access", {
  userCompanyAccessId: int("user_company_access_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  canView: boolean("can_view").default(true),
  canEdit: boolean("can_edit").default(false),
  canApprove: boolean("can_approve").default(false),
  canAdmin: boolean("can_admin").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const entitySysUserTable = mysqlTable("entity_sys_user", {
  entitySysUserId: int("entity_sys_user_id").primaryKey().autoincrement(),
  entityType: mysqlEnum("entity_type", ['client', 'partner']).notNull(),
  entityId: int("entity_id").notNull(),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  isActive: boolean("is_active").default(true),
});

export const partnerTypesTable = mysqlTable("partner_type", {
  partnerTypeId: int("partner_type_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  typeName: varchar("type_name", { length: 50 }).notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const accountTypesTable = mysqlTable("account_type", {
  accountTypeId: int("account_type_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  typeName: varchar("type_name", { length: 50 }).notNull(),
  nature: varchar("nature", { length: 20 }).notNull(), // ASSET, LIABILITY, etc.
  description: text("description"),
  isSystem: boolean("is_system").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const regionTable = mysqlTable("region", {
  regionId: int("region_id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const specialtyTable = mysqlTable("specialty", {
  specialtyId: int("specialty_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 250 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const partnersTable = mysqlTable("partner", {
  partnerId: int("partner_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  ownerId: int("owner_id").references(() => sysUsersTable.sysUserId),
  partnerCode: varchar("partner_code", { length: 30 }).notNull(),
  partnerName: varchar("partner_name", { length: 100 }).notNull(),
  legalName: varchar("legal_name", { length: 150 }),
  taxId: varchar("tax_id", { length: 30 }),
  partnerTypeId: int("partner_type_id").references(() => partnerTypesTable.partnerTypeId),
  isCustomer: boolean("is_customer").default(false),
  isVendor: boolean("is_vendor").default(false),
  isCollector: boolean("is_collector").default(false),
  isEmployee: boolean("is_employee").default(false),
  isAccredited: boolean("is_accredited").default(false),
  specialtyId: int("specialty_id").references(() => specialtyTable.specialtyId),
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
  receivableAccountId: int("receivable_account_id"),
  payableAccountId: int("payable_account_id"),
  currency: char("currency", { length: 3 }).default("BRL"),
  taxCodeId: int("tax_code_id"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const partnerBankAccountTable = mysqlTable("partner_bank_account", {
  partnerBankAccountId: int("partner_bank_account_id").primaryKey().autoincrement(),
  partnerId: int("partner_id").references(() => partnersTable.partnerId),
  bankName: varchar("bank_name", { length: 100 }).notNull(),
  accountNumber: varchar("account_number", { length: 50 }),
  routingNumber: varchar("routing_number", { length: 50 }),
  iban: varchar("iban", { length: 50 }),
  swiftCode: varchar("swift_code", { length: 20 }),
  bankAddress: text("bank_address"),
  accountHolder: varchar("account_holder", { length: 100 }),
  accountType: varchar("account_type", { length: 30 }),
  isDefault: boolean("is_default").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// -----------------------------------------------------------------------------
// PARTE 6: CLASSES E GRUPOS
// -----------------------------------------------------------------------------

export const categoryTable = mysqlTable("category", {
  categoryId: int("category_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const groupBatchTable = mysqlTable("group_batch", {
  groupBatchId: int("group_batch_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  classId: int("class_id").references(() => categoryTable.categoryId),
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
  lastIssueDate: date("last_issue_date"),
  lastDeathChargeDate: timestamp("last_death_charge_date"),
  pendingProcess: int("pending_process"),
  numberContracts: int("number_contracts"),
  numberLifes: int("number_lifes").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const groupClassTable = mysqlTable("group_class", {
  groupClassId: int("group_class_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  classId: int("class_id").references(() => categoryTable.categoryId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// -----------------------------------------------------------------------------
// PARTE 7: CONTRATOS E VERSIONAMENTO
// -----------------------------------------------------------------------------

export const contractsTable = mysqlTable("contract", {
  contractId: int("contract_id").primaryKey().autoincrement(),
  currentVersionId: int("current_version_id"), // FK set after contract_version creation
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  ownerId: int("owner_id").references(() => sysUsersTable.sysUserId),
  partnerId: int("partner_id").references(() => partnersTable.partnerId),
  indicatedBy: int("indicated_by").references(() => sysUsersTable.sysUserId),
  contractName: varchar("contract_name", { length: 100 }).notNull(),
  contractNumber: varchar("contract_number", { length: 20 }).notNull(),
  originalContractNumber: varchar("original_contract_number", { length: 100 }),
  currentStatus: varchar("current_status", { length: 50 }).default("active"),
  statusId: int("status_id").references(() => contractStatusTable.contractStatusId),
  classId: int("class_id").references(() => categoryTable.categoryId),
  collectorId: int("collector_id").references(() => sysUsersTable.sysUserId),
  sellerId: int("seller_id").references(() => sysUsersTable.sysUserId),
  regionId: int("region_id").references(() => regionTable.regionId),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  obs: text("obs"),
  servicesAmount: int("services_amount"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const contractVersionTable = mysqlTable("contract_version", {
  contractVersionId: int("contract_version_id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.contractId),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  versionNumber: int("version_number").default(1).notNull(),
  validFrom: date("valid_from").notNull(),
  validTo: date("valid_to"),
  isCurrent: boolean("is_current").default(true),
  changeReason: varchar("change_reason", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by").references(() => sysUsersTable.sysUserId),
  updatedBy: int("updated_by").references(() => sysUsersTable.sysUserId),
  deletedBy: int("deleted_by").references(() => sysUsersTable.sysUserId),
});

export const contractCoversTable = mysqlTable("contract_covers", {
  contractCoversId: int("contract_covers_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  classId: int("class_id").references(() => categoryTable.categoryId),
  statusId: int("status_id").references(() => generalStatusTable.generalStatusId),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const contractConfigBillingTable = mysqlTable("contract_config_billing", {
  contractConfigBillingId: int("contract_config_billing_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  sellerId: int("seller_id").references(() => sysUsersTable.sysUserId),
  collectorId: int("collector_id").references(() => sysUsersTable.sysUserId),
  regionId: int("region_id").references(() => regionTable.regionId),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const contractEventsTable = mysqlTable("contract_events", {
  contractEventsId: int("contract_events_id").primaryKey().autoincrement(),
  contractId: int("contract_id").references(() => contractsTable.contractId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  payload: json("payload"),
  createdBy: int("created_by").references(() => sysUsersTable.sysUserId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const contractStatusHistoryTable = mysqlTable("contract_status_history", {
  contractStatusHistoryId: int("contract_status_history_id").primaryKey().autoincrement(),
  stateMachineTransitionId: int("state_machine_transition_id").references(() => stateMachineTransitionsTable.stateMachineTransitionsId),
  statusReasonId: int("status_reason_id").references(() => statusReasonTable.statusReasonId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  contractNumber: varchar("contract_number", { length: 20 }).notNull(),
  detailStatus: varchar("detail_status", { length: 250 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const contractActiveTable = mysqlTable("contract_active", {
  contractActiveId: int("contract_active_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractNumber: varchar("contract_number", { length: 20 }).notNull(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// -----------------------------------------------------------------------------
// PARTE 8: BENEFICIÁRIOS
// -----------------------------------------------------------------------------

export const beneficiariesTable = mysqlTable("beneficiary", {
  beneficiaryId: int("beneficiary_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  name: varchar("name", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 50 }).notNull(),
  isPrimary: boolean("is_primary").default(false),
  birthAt: date("birth_at"),
  genderId: int("gender_id").references(() => genderTable.genderId),
  documentId: int("document_id").references(() => documentsTable.documentId),
  graceAt: date("grace_at"),
  isAlive: boolean("is_alive").default(true),
  isForbidden: boolean("is_forbidden").default(false),
  serviceFuneralId: int("service_funeral_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// -----------------------------------------------------------------------------
// PARTE 9: SERVIÇOS E ATENDIMENTOS
// -----------------------------------------------------------------------------

export const serviceTypeTable = mysqlTable("service_type", {
  serviceTypeId: int("service_type_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  name: varchar("name", { length: 100 }).notNull(),
  route: varchar("route", { length: 200 }),
  industry: varchar("industry", { length: 50 }).default("FUNERAL"),
  isBillable: boolean("is_billable").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const performedServiceTable = mysqlTable("performed_service", {
  performedServiceId: int("performed_service_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  beneficiaryId: int("beneficiary_id").references(() => beneficiariesTable.beneficiaryId),
  serviceTypeId: int("service_type_id").references(() => serviceTypeTable.serviceTypeId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const serviceFuneralTable = mysqlTable("service_funeral", {
  serviceFuneralId: int("service_funeral_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  performedServiceId: int("performed_service_id").references(() => performedServiceTable.performedServiceId),
  declarantId: int("declarant_id").references(() => sysUsersTable.sysUserId),
  deceasedId: int("deceased_id").references(() => beneficiariesTable.beneficiaryId),
  officeUsersId: int("office_users_id").references(() => sysUsersTable.sysUserId),
  processNumber: varchar("process_number", { length: 25 }).notNull(),
  occurrAt: date("occurr_at").notNull(),
  category: varchar("category", { length: 25 }).default("PL").notNull(),
  kinship: varchar("kinship", { length: 25 }).notNull(),
  deathAt: date("death_at"),
  deathTime: char("death_time", { length: 5 }),
  deathAddressId: int("death_address_id").references(() => addressesTable.addressId),
  paymentAt: date("payment_at"),
  burialDate: date("burial_date"),
  burialTime: char("burial_time", { length: 5 }),
  cemetery: varchar("cemetery", { length: 200 }),
  paidAmount: decimal("paid_amount", { precision: 19, scale: 4 }),
  paidInDate: date("paid_in_date"),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const deathEventTable = mysqlTable("death_event", {
  deathEventId: int("death_event_id").primaryKey().autoincrement(),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  beneficiaryId: int("beneficiary_id").references(() => beneficiariesTable.beneficiaryId),
  serviceFuneralId: int("service_funeral_id").references(() => serviceFuneralTable.serviceFuneralId),
  eventDate: timestamp("event_date").default(sql`CURRENT_TIMESTAMP`),
  processedForBilling: boolean("processed_for_billing").default(false),
});

export const membershipCardTable = mysqlTable("membership_card", {
  membershipCardId: int("membership_card_id").primaryKey().autoincrement(),
  performedServiceId: int("performed_service_id").references(() => performedServiceTable.performedServiceId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  beneficiaryId: int("beneficiary_id").references(() => beneficiariesTable.beneficiaryId),
  cardCod: varchar("card_cod", { length: 100 }),
  vencimento: varchar("vencimento", { length: 100 }),
  observacao: text("observacao"),
  importadoAt: timestamp("importado_at"),
  exportadoAt: timestamp("exportado_at"),
  retornoAt: timestamp("retorno_at"),
  entregueAt: timestamp("entregue_at"),
  valor: decimal("valor", { precision: 19, scale: 4 }),
  pagoAt: timestamp("pago_at"),
  numop: varchar("numop", { length: 10 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
});

export const equipmentRentalTable = mysqlTable("equipament_rental", {
  equipmentRentalId: int("equipament_rental_id").primaryKey().autoincrement(),
  performedServiceId: int("performed_service_id").references(() => performedServiceTable.performedServiceId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// -----------------------------------------------------------------------------
// PARTE 10: ADENDOS
// -----------------------------------------------------------------------------

export const addendumTable = mysqlTable("addendum", {
  addendumId: int("addendum_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  generalStatusId: int("general_status_id").references(() => generalStatusTable.generalStatusId),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const ageAddendumTable = mysqlTable("age_addendum", {
  ageAddendumId: int("age_addendum_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  addendumId: int("addendum_id").references(() => addendumTable.addendumId),
  classId: int("class_id").references(() => categoryTable.categoryId),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 250 }),
  minAge: int("min_age"),
  maxAge: int("max_age"),
  additionalValue: decimal("additional_value", { precision: 19, scale: 4 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const contractAddendumTable = mysqlTable("contract_addendum", {
  contractAddendumId: int("contract_addendum_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  addendumId: int("addendum_id").references(() => addendumTable.addendumId),
  name: varchar("name", { length: 100 }).notNull(),
  productCode: varchar("product_code", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// -----------------------------------------------------------------------------
// PARTE 11: COBRANÇAS E PAGAMENTOS
// -----------------------------------------------------------------------------

export const contractChargeTable = mysqlTable("contract_charge", {
  contractChargeId: int("contract_charge_id").primaryKey().autoincrement(),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  paymentStatusId: int("payment_status_id").references(() => paymentStatusTable.paymentStatusId),
  chargeCode: varchar("charge_code", { length: 100 }).notNull(),
  dueDate: date("due_date").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  paymentDate: date("payment_date"),
  paidAmount: decimal("paid_amount", { precision: 19, scale: 4 }),
  dueMonth: char("due_month", { length: 2 }),
  dueYear: char("due_year", { length: 4 }),
  convenio: varchar("convenio", { length: 20 }),
  paydMonth: char("payd_month", { length: 2 }),
  paydYear: char("payd_year", { length: 4 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const chargeTable = mysqlTable("charge", {
  chargeId: int("charge_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  chargeNumber: varchar("charge_number", { length: 7 }).notNull(),
  pendingCasesNumber: int("pending_cases_number"),
  issueDate: timestamp("issue_date"),
  dueDate: timestamp("due_date"),
  monthRef: varchar("month_ref", { length: 100 }),
  amount: decimal("amount", { precision: 19, scale: 4 }),
  message: varchar("message", { length: 100 }),
  message1: varchar("message1", { length: 100 }),
  message2: varchar("message2", { length: 100 }),
  amountIssued: int("amount_issued"),
  amountPaid: int("amount_paid"),
  canceled: int("canceled"),
  releaseDate: timestamp("release_date"),
  printingDate: timestamp("printing_date"),
  status: varchar("status", { length: 20 }).default("PENDING"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const proratedServiceTable = mysqlTable("prorated_service", {
  proratedServiceId: int("prorated_service_id").primaryKey().autoincrement(),
  chargeId: int("charge_id").references(() => chargeTable.chargeId),
  serviceFuneralId: int("service_funeral_id").references(() => serviceFuneralTable.serviceFuneralId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const bankSlipTable = mysqlTable("bank_slip", {
  bankSlipId: int("bank_slip_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractChargeId: int("contract_charge_id").references(() => contractChargeTable.contractChargeId),
  seq: varchar("seq", { length: 7 }).notNull(),
  nnumber: varchar("nnumber", { length: 50 }).notNull(),
  chargeCode: varchar("charge_code", { length: 100 }).notNull(),
  status: varchar("status", { length: 100 }),
  sendAt: timestamp("send_at"),
  sendBatch: char("send_batch", { length: 7 }),
  responseAt: timestamp("response_at"),
  responseBatch: char("response_batch", { length: 7 }),
  response: varchar("response", { length: 100 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const ordpgrcTable = mysqlTable("ordpgrc", {
  ordpgrcId: int("ordpgrc_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  sysUserName: varchar("sys_user_name", { length: 50 }),
  orderNumber: varchar("order_number", { length: 20 }).notNull(),
  orderDate: timestamp("order_date").default(sql`CURRENT_TIMESTAMP`),
  totalAmount: decimal("total_amount", { precision: 19, scale: 4 }).notNull(),
  numberReceipt: int("number_receipt"),
  closingDate: timestamp("closing_date"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const paymentReceiptTable = mysqlTable("payment_receipt", {
  paymentReceiptId: int("payment_receipt_id").primaryKey().autoincrement(),
  subsidiaryId: int("subsidiary_id").references(() => subsidiaryTable.subsidiaryId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  status: char("status", { length: 2 }),
  billingNumber: varchar("billing_number", { length: 100 }),
  valPayment: decimal("val_payment", { precision: 19, scale: 4 }),
  valAux: decimal("val_aux", { precision: 19, scale: 4 }),
  dueDate: date("due_date"),
  cashierNumber: char("cashier_number", { length: 8 }),
  methodPay: varchar("method_pay", { length: 100 }),
  obsPay: varchar("obs_pay", { length: 200 }),
  ordpgrcId: int("ordpgrc_id").references(() => ordpgrcTable.ordpgrcId),
  paymentStatusId: int("payment_status_id").references(() => paymentStatusTable.paymentStatusId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const batchChkTable = mysqlTable("batch_chk", {
  batchChkId: int("batch_chk_id").primaryKey().autoincrement(),
  subsidiaryId: int("subsidiary_id").references(() => subsidiaryTable.subsidiaryId),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  batchNumber: varchar("batch_number", { length: 10 }).notNull(),
  detail: varchar("detail", { length: 100 }).notNull(),
  expenses: decimal("expenses", { precision: 19, scale: 4 }).notNull(),
  dischargeDate: date("discharge_date").notNull(),
  commissBill: decimal("commiss_bill", { precision: 5, scale: 2 }).notNull(),
  qtdOther: decimal("qtd_other", { precision: 5, scale: 2 }).notNull(),
  vlOther: decimal("vl_other", { precision: 19, scale: 4 }).notNull(),
  qtdBill: decimal("qtd_bill", { precision: 5, scale: 2 }).notNull(),
  vlBill: decimal("vl_bill", { precision: 19, scale: 4 }).notNull(),
  paymentValue: decimal("payment_value", { precision: 19, scale: 4 }).notNull(),
  nrcctopay: varchar("nrcctopay", { length: 7 }).notNull(),
  cashierNumber: varchar("cashier_number", { length: 7 }).notNull(),
  ordpgrcId: int("ordpgrc_id").references(() => ordpgrcTable.ordpgrcId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const batchDetailTable = mysqlTable("batch_detail", {
  batchDetailId: int("batch_detail_id").primaryKey().autoincrement(),
  batchChkId: int("batch_chk_id").references(() => batchChkTable.batchChkId),
  contractChargeId: int("contract_charge_id").references(() => contractChargeTable.contractChargeId),
  seqNumber: varchar("seq_number", { length: 5 }).notNull(),
  billingNumber: varchar("billing_number", { length: 100 }),
  amountReceived: decimal("amount_received", { precision: 19, scale: 4 }).notNull(),
  processStatus: char("process_status", { length: 1 }).notNull(),
  paymentStatusId: int("payment_status_id").references(() => paymentStatusTable.paymentStatusId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const billingCycleTable = mysqlTable("billing_cycle", {
  billingCycleId: int("billing_cycle_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  groupBatchId: int("group_batch_id").references(() => groupBatchTable.groupBatchId),
  deathEventCount: int("death_event_count").notNull(),
  chargeDate: timestamp("charge_date").notNull(),
  amountPerContract: decimal("amount_per_contract", { precision: 19, scale: 4 }).notNull(),
  status: varchar("status", { length: 20 }).default("PENDING"),
});

export const contractBillingTable = mysqlTable("contract_billing", {
  contractBillingId: int("contract_billing_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  cycleId: int("cycle_id").references(() => billingCycleTable.billingCycleId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  chargeId: int("charge_id").references(() => contractChargeTable.contractChargeId),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  status: varchar("status", { length: 20 }).default("PENDING"),
});

export const paymentPlanTable = mysqlTable("payment_plan", {
  paymentPlanId: int("payment_plan_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  planName: varchar("plan_name", { length: 100 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 19, scale: 4 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: varchar("status", { length: 20 }).default("ACTIVE"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  createdBy: int("created_by"),
});

export const paymentPlanInstallmentTable = mysqlTable("payment_plan_installment", {
  paymentPlanInstallmentId: int("payment_plan_installment_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  planId: int("plan_id").references(() => paymentPlanTable.paymentPlanId),
  dueDate: date("due_date").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  status: varchar("status", { length: 20 }).default("PENDING"),
  paidAmount: decimal("paid_amount", { precision: 19, scale: 4 }).default("0"),
  paidDate: date("paid_date"),
  chargeId: int("charge_id").references(() => contractChargeTable.contractChargeId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});

export const paymentTransactionTable = mysqlTable("payment_transaction", {
  paymentTransactionId: bigint("payment_transaction_id", { mode: "number" }).primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  contractVersionId: int("contract_version_id").references(() => contractVersionTable.contractVersionId),
  chargeId: int("charge_id").references(() => contractChargeTable.contractChargeId),
  installmentId: int("installment_id").references(() => paymentPlanInstallmentTable.paymentPlanInstallmentId),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  referenceNumber: varchar("reference_number", { length: 100 }),
  status: varchar("status", { length: 20 }).default("COMPLETED"),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: int("created_by"),
});

export const billingRuleTable = mysqlTable("billing_rule", {
  billingRuleId: int("billing_rule_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  ruleName: varchar("rule_name", { length: 100 }).notNull(),
  industry: varchar("industry", { length: 50 }).notNull(),
  description: text("description"),
  conditionExpression: text("condition_expression"),
  chargeExpression: text("charge_expression"),
  isActive: boolean("is_active").default(true),
});

export const billingRuleApplicationTable = mysqlTable("billing_rule_application", {
  billingRuleApplicationId: int("billing_rule_application_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  ruleId: int("rule_id").references(() => billingRuleTable.billingRuleId),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: int("entity_id").notNull(),
  appliedAt: timestamp("applied_at").default(sql`CURRENT_TIMESTAMP`),
  appliedBy: int("applied_by"),
});

export const medicalForwardTable = mysqlTable("medical_foward", {
  medicalForwardId: int("medical_foward_id").primaryKey().autoincrement(),
  sysUnitId: int("sys_unit_id").references(() => sysUnitTable.sysUnitId),
  sysUserId: int("sys_user_id").references(() => sysUsersTable.sysUserId),
  partnerId: int("partner_id").references(() => partnersTable.partnerId),
  performedServiceId: int("performed_service_id").references(() => performedServiceTable.performedServiceId),
  observation: text("observation"),
  valPayment: decimal("val_payment", { precision: 19, scale: 4 }),
  valAux: decimal("val_aux", { precision: 19, scale: 4 }),
  dueDate: date("due_date"),
  cashierNumber: char("cashier_number", { length: 8 }),
  methodPay: varchar("method_pay", { length: 100 }),
  obsPay: varchar("obs_pay", { length: 200 }),
  ordpgrcId: int("ordpgrc_id").references(() => ordpgrcTable.ordpgrcId),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const accountsTable = mysqlTable("account", {
  accountId: int("account_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  accountTypeId: int("account_type_id").references(() => accountTypesTable.accountTypeId),
  parentAccountId: int("parent_account_id").references((): any => accountsTable.accountId),
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
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const costCentersTable = mysqlTable("cost_center", {
  costCenterId: int("cost_center_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  parentCostCenterId: int("parent_cost_center_id").references((): any => costCentersTable.costCenterId),
  costCenterCode: varchar("cost_center_code", { length: 30 }).notNull(),
  costCenterName: varchar("cost_center_name", { length: 100 }).notNull(),
  description: text("description"),
  managerName: varchar("manager_name", { length: 100 }),
  budget: decimal("budget", { precision: 19, scale: 4 }),
  level: int("level").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const departmentsTable = mysqlTable("department", {
  departmentId: int("department_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  parentDepartmentId: int("parent_department_id").references((): any => departmentsTable.departmentId),
  departmentCode: varchar("department_code", { length: 30 }).notNull(),
  departmentName: varchar("department_name", { length: 100 }).notNull(),
  description: text("description"),
  managerName: varchar("manager_name", { length: 100 }),
  costCenterId: int("cost_center_id").references(() => costCentersTable.costCenterId),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const projectsTable = mysqlTable("project", {
  projectId: int("project_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  projectCode: varchar("project_code", { length: 30 }).notNull(),
  projectName: varchar("project_name", { length: 100 }).notNull(),
  description: text("description"),
  managerName: varchar("manager_name", { length: 100 }),
  costCenterId: int("cost_center_id").references(() => costCentersTable.costCenterId),
  departmentId: int("department_id").references(() => departmentsTable.departmentId),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 19, scale: 4 }),
  status: varchar("status", { length: 20 }).notNull().default("PLANNED"),
  completionPercentage: decimal("completion_percentage", { precision: 5, scale: 2 }).default("0"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const fiscalYearsTable = mysqlTable("fiscal_year", {
  fiscalYearId: int("fiscal_year_id").primaryKey().autoincrement(),
  companyId: int("company_id").references(() => companyTable.companyId),
  yearName: varchar("year_name", { length: 100 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

export const fiscalPeriodsTable = mysqlTable("fiscal_period", {
  fiscalPeriodId: int("fiscal_period_id").primaryKey().autoincrement(),
  fiscalYearId: int("fiscal_year_id").references(() => fiscalYearsTable.fiscalYearId),
  periodName: varchar("period_name", { length: 100 }).notNull(),
  periodNumber: int("period_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isAdjustment: boolean("is_adjustment").default(false),
  isClosed: boolean("is_closed").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  deletedAt: timestamp("deleted_at"),
  createdBy: int("created_by"),
  updatedBy: int("updated_by"),
  deletedBy: int("deleted_by"),
});

// Zod schemas for validation
export const insertSysUserSchema = createInsertSchema(sysUsersTable);
export const insertContractSchema = createInsertSchema(contractsTable);
export const insertContractVersionSchema = createInsertSchema(contractVersionTable);
export const insertPartnerSchema = createInsertSchema(partnersTable);
export const insertBeneficiarySchema = createInsertSchema(beneficiariesTable);
export const insertContractChargeSchema = createInsertSchema(contractChargeTable);
export const insertAddressTypeSchema = createInsertSchema(addressTypesTable);
export const insertAddressSchema = createInsertSchema(addressesTable);
export const insertEntityAddressSchema = createInsertSchema(entityAddressesTable);
export const insertPartnerTypeSchema = createInsertSchema(partnerTypesTable);
export const insertDocumentTypeSchema = createInsertSchema(documentTypesTable);
export const insertDocumentSchema = createInsertSchema(documentsTable);
export const insertEntityDocumentSchema = createInsertSchema(entityDocumentsTable);
export const insertClientSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  document: z.string().optional(),
});
export const insertCompanySchema = createInsertSchema(companyTable);
export const insertSubsidiarySchema = createInsertSchema(subsidiaryTable);
export const insertSysUnitSchema = createInsertSchema(sysUnitTable);
export const insertClasseSchema = createInsertSchema(categoryTable);
export const insertGroupBatchSchema = createInsertSchema(groupBatchTable);
export const insertAccountTypeSchema = createInsertSchema(accountTypesTable);
export const insertAccountSchema = createInsertSchema(accountsTable);
export const insertCostCenterSchema = createInsertSchema(costCentersTable);
export const insertDepartmentSchema = createInsertSchema(departmentsTable);
export const insertProjectSchema = createInsertSchema(projectsTable);
export const insertFiscalYearSchema = createInsertSchema(fiscalYearsTable);
export const insertFiscalPeriodSchema = createInsertSchema(fiscalPeriodsTable);
export const insertGenderSchema = createInsertSchema(genderTable);
export const insertPaymentStatusSchema = createInsertSchema(paymentStatusTable);
export const insertEstadoSchema = createInsertSchema(estadoTable);
export const insertCidadeSchema = createInsertSchema(cidadeTable);
export const insertCurrencySchema = createInsertSchema(currencyTable);
export const insertGeneralStatusSchema = createInsertSchema(generalStatusTable);
export const insertContractStatusHistorySchema = createInsertSchema(contractStatusHistoryTable);
export const insertPaymentReceiptSchema = createInsertSchema(paymentReceiptTable);
export const insertCarteirinhaSchema = createInsertSchema(membershipCardTable);
export const insertMedicalForwardSchema = createInsertSchema(medicalForwardTable);
export const insertAddendumSchema = createInsertSchema(addendumTable);
export const insertChargeSchema = createInsertSchema(chargeTable);
export const insertBatchChkSchema = createInsertSchema(batchChkTable);
export const insertBatchDetailSchema = createInsertSchema(batchDetailTable);
export const insertContractNumberRegistrySchema = createInsertSchema(contractActiveTable);

// Export types
export type SysUser = typeof sysUsersTable.$inferSelect;
export type InsertSysUser = typeof sysUsersTable.$inferInsert;
export type Contract = typeof contractsTable.$inferSelect & {
  contractType?: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  admission?: Date | string | null;
  billingFrequency?: number | null;
  monthInitialBilling?: string | null;
  yearInitialBilling?: string | null;
  optPayday?: number | null;
  finalGrace?: Date | string | null;
  firstCharge?: number | null;
  lastCharge?: number | null;
  chargesAmount?: number | null;
  chargesPaid?: number | null;
  renewAt?: Date | string | null;
  serviceOption1?: string | null;
  serviceOption2?: string | null;
  alives?: number | null;
  deceaseds?: number | null;
  dependents?: number | null;
};
export type InsertContract = typeof contractsTable.$inferInsert;
export type ContractVersion = typeof contractVersionTable.$inferSelect;
export type InsertContractVersion = typeof contractVersionTable.$inferInsert;
export type Partner = typeof partnersTable.$inferSelect;
export type InsertPartner = typeof partnersTable.$inferInsert;
export type Beneficiary = typeof beneficiariesTable.$inferSelect;
export type InsertBeneficiary = typeof beneficiariesTable.$inferInsert;
export type ContractCharge = typeof contractChargeTable.$inferSelect;
export type InsertContractCharge = typeof contractChargeTable.$inferInsert;
export type Address = typeof addressesTable.$inferSelect;
export type InsertAddress = typeof addressesTable.$inferInsert;
export type Company = typeof companyTable.$inferSelect;
export type InsertCompany = typeof companyTable.$inferInsert;
export type Subsidiary = typeof subsidiaryTable.$inferSelect;
export type InsertSubsidiary = typeof subsidiaryTable.$inferInsert;
export type SysUnit = typeof sysUnitTable.$inferSelect;
export type InsertSysUnit = typeof sysUnitTable.$inferInsert;
export type Category = typeof categoryTable.$inferSelect;
export type InsertCategory = typeof categoryTable.$inferInsert;
export type GroupBatch = typeof groupBatchTable.$inferSelect;
export type InsertGroupBatch = typeof groupBatchTable.$inferInsert;
export type AccountType = typeof accountTypesTable.$inferSelect;
export type InsertAccountType = typeof accountTypesTable.$inferInsert;
export type Account = typeof accountsTable.$inferSelect;
export type InsertAccount = typeof accountsTable.$inferInsert;
export type CostCenter = typeof costCentersTable.$inferSelect;
export type InsertCostCenter = typeof costCentersTable.$inferInsert;
export type Department = typeof departmentsTable.$inferSelect;
export type InsertDepartment = typeof departmentsTable.$inferInsert;
export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
export type FiscalYear = typeof fiscalYearsTable.$inferSelect;
export type InsertFiscalYear = typeof fiscalYearsTable.$inferInsert;
export type FiscalPeriod = typeof fiscalPeriodsTable.$inferSelect;
export type InsertFiscalPeriod = typeof fiscalPeriodsTable.$inferInsert;
export type Region = typeof regionTable.$inferSelect;
export type InsertRegion = typeof regionTable.$inferInsert;
export type Specialty = typeof specialtyTable.$inferSelect;
export type InsertSpecialty = typeof specialtyTable.$inferInsert;
export type Gender = typeof genderTable.$inferSelect;
export type InsertGender = typeof genderTable.$inferInsert;
export type DocumentType = typeof documentTypesTable.$inferSelect;
export type InsertDocumentType = typeof documentTypesTable.$inferInsert;
export type PaymentStatus = typeof paymentStatusTable.$inferSelect;
export type InsertPaymentStatus = typeof paymentStatusTable.$inferInsert;
export type GeneralStatus = typeof generalStatusTable.$inferSelect;
export type InsertGeneralStatus = typeof generalStatusTable.$inferInsert;
export type AddressType = typeof addressTypesTable.$inferSelect;
export type InsertAddressType = typeof addressTypesTable.$inferInsert;
export type Estado = typeof estadoTable.$inferSelect;
export type InsertEstado = typeof estadoTable.$inferInsert;
export type Cidade = typeof cidadeTable.$inferSelect;
export type InsertCidade = typeof cidadeTable.$inferInsert;
export type Currency = typeof currencyTable.$inferSelect;
export type InsertCurrency = typeof currencyTable.$inferInsert;
export type PaymentReceipt = typeof paymentReceiptTable.$inferSelect;
export type InsertPaymentReceipt = typeof paymentReceiptTable.$inferInsert;
export type MedicalForward = typeof medicalForwardTable.$inferSelect;
export type InsertMedicalForward = typeof medicalForwardTable.$inferInsert;

export type PerformedService = typeof performedServiceTable.$inferSelect;
export type InsertPerformedService = typeof performedServiceTable.$inferInsert;
export type Client = any;
export type Plan = any;
export type ContractHistory = any;

// Temporary Compatibility Aliases (to be replaced)
export type NewSysUser = InsertSysUser;
export type NewPartner = InsertPartner;
export type NewContract = InsertContract;
export type NewBeneficiary = InsertBeneficiary;
export type NewAddress = InsertAddress;
export type NewCompany = InsertCompany;
export type NewSubsidiary = InsertSubsidiary;
export type NewSysUnit = InsertSysUnit;
export type NewClasse = InsertCategory;
export type NewGroupBatch = InsertGroupBatch;
export type SelectAccountType = AccountType;
export type SelectAccount = Account;
export type NewGender = InsertGender;
export type NewPaymentStatus = InsertPaymentStatus;
export type NewGeneralStatus = InsertGeneralStatus;
export type NewAddressType = InsertAddressType;
export type NewEstado = InsertEstado;
export type NewCidade = InsertCidade;
export type NewCurrency = InsertCurrency;
export type NewDocumentType = InsertDocumentType;
export type Document = typeof documentsTable.$inferSelect;
export type NewDocument = typeof documentsTable.$inferInsert;
export type EntityAddress = typeof entityAddressesTable.$inferSelect;
export type NewEntityAddress = typeof entityAddressesTable.$inferInsert;
export type EntityDocument = typeof entityDocumentsTable.$inferSelect;
export type NewEntityDocument = typeof entityDocumentsTable.$inferInsert;
export type PartnerType = typeof partnerTypesTable.$inferSelect;
export type NewPartnerType = typeof partnerTypesTable.$inferInsert;
export type NewBatchChk = typeof batchChkTable.$inferInsert;
export type BatchChk = typeof batchChkTable.$inferSelect & {
  processDate?: Date | string | null;
  status?: string | null;
  totalAmount?: string | number | null;
  recordCount?: number | null;
};
export type NewBatchDetail = typeof batchDetailTable.$inferInsert;
export type BatchDetail = typeof batchDetailTable.$inferSelect;
export type NewCharge = typeof chargeTable.$inferInsert;
export type Charge = typeof chargeTable.$inferSelect;
export type Addendum = typeof addendumTable.$inferSelect;
export type InsertAddendum = typeof addendumTable.$inferInsert;
export type NewAddendum = InsertAddendum;

export type InsertEntityAddress = typeof entityAddressesTable.$inferInsert;
export type InsertPartnerType = typeof partnerTypesTable.$inferInsert;
export type InsertDocument = typeof documentsTable.$inferInsert;
export type InsertEntityDocument = typeof entityDocumentsTable.$inferInsert;
export type InsertCharge = typeof chargeTable.$inferInsert;
export type InsertBatchChk = typeof batchChkTable.$inferInsert;
export type InsertBatchDetail = typeof batchDetailTable.$inferInsert;
export type ContractStatusHistory = typeof contractStatusHistoryTable.$inferSelect;
export type InsertContractStatusHistory = typeof contractStatusHistoryTable.$inferInsert;
export type Carteirinha = typeof membershipCardTable.$inferSelect;
export type InsertCarteirinha = typeof membershipCardTable.$inferInsert;
