// @ts-nocheck
import { pgTable, serial, integer, varchar, text, timestamp, date, boolean, decimal, char, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sysUsers } from "../../../shared/schema"; // Assuming sysUsers is the correct user table
// Re-importing necessary tables from shared/schema.ts if they are confirmed to be compatible
// For now, let's assume we might need to redefine some or ensure compatibility.
// We'll use existing document/address related schemas from shared/schema.ts later.

// Helper for timestamp columns
const createdAt = timestamp("created_at").defaultNow();
const updatedAt = timestamp("updated_at").defaultNow(); // .onUpdateNow() is not a drizzle-orm pg-core standard feature. Manual update needed.
const deletedAt = timestamp("deleted_at");

const createdBy = integer("created_by"); // Assuming FK to sysUsers
const updatedBy = integer("updated_by"); // Assuming FK to sysUsers
const deletedBy = integer("deleted_by"); // Assuming FK to sysUsers

// General Tables from plano25MyCr.sql (if not already in shared/schema.ts or if different)

export const sysUnitSql = pgTable("sys_unit", {
  sys_unit_id: serial("sys_unit_id").primaryKey(), // In SQL: INT UNSIGNED AUTO_INCREMENT NOT NULL
  // subsidiary_id: integer("subsidiary_id").references(() => subsidiary.id), // Assuming subsidiary table exists
  // general_status_id: integer("general_status_id").references(() => generalStatus.id), // Assuming generalStatus table exists
  name: varchar("name", { length: 100 }).notNull(),
  connection_name: varchar("connection_name", { length: 100 }),
  code: varchar("code", { length: 20 }),
  // Foreign keys will be added if/when subsidiary and general_status tables are defined/confirmed
});
export const selectSysUnitSchema = createSelectSchema(sysUnitSql);
export const insertSysUnitSchema = createInsertSchema(sysUnitSql);
export type SysUnitSql = z.infer<typeof selectSysUnitSchema>;
export type InsertSysUnitSql = z.infer<typeof insertSysUnitSchema>;

export const genderSql = pgTable("gender", {
  gender_id: serial("gender_id").primaryKey(), // In SQL: INT UNSIGNED AUTO_INCREMENT NOT NULL
  name: varchar("name", { length: 50 }).notNull(),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectGenderSchema = createSelectSchema(genderSql);
export const insertGenderSchema = createInsertSchema(genderSql);
export type GenderSql = z.infer<typeof selectGenderSchema>;
export type InsertGenderSql = z.infer<typeof insertGenderSchema>;

export const paymentStatusSql = pgTable("payment_status", {
  payment_status_id: serial("payment_status_id").primaryKey(), // In SQL: INT UNSIGNED AUTO_INCREMENT NOT NULL
  name: varchar("name", { length: 100 }).notNull(),
  code: char("code", { length: 2 }).notNull(),
  kanban: boolean("kanban"),
  color: varchar("color", { length: 100 }), // SQL uses char(100)
  kanban_order: integer("kanban_order"),
  is_final_state: boolean("is_final_state"), // SQL uses final_state
  is_initial_state: boolean("is_initial_state"), // SQL uses initial_state
  allow_edition: boolean("allow_edition"),
  allow_deletion: boolean("allow_deletion"),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectPaymentStatusSchema = createSelectSchema(paymentStatusSql);
export const insertPaymentStatusSchema = createInsertSchema(paymentStatusSql);
export type PaymentStatusSql = z.infer<typeof selectPaymentStatusSchema>;
export type InsertPaymentStatusSql = z.infer<typeof insertPaymentStatusSchema>;

export const contractStatusSql = pgTable("contract_status", {
  status_id: serial("status_id").primaryKey(), // In SQL: INT UNSIGNED AUTO_INCREMENT NOT NULL
  name: varchar("name", { length: 100 }).notNull(),
  code: char("code", { length: 2 }).notNull(),
  generate_charge: boolean("generate_charge"),
  allows_service: boolean("allows_service"),
  charge_after: integer("charge_after"),
  kanban: boolean("kanban"),
  color: varchar("color", { length: 100 }), // SQL uses char(100)
  kanban_order: integer("kanban_order"),
  is_final_state: boolean("is_final_state"),
  is_initial_state: boolean("is_initial_state"),
  allow_edition: boolean("allow_edition"),
  allow_deletion: boolean("allow_deletion"),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
  unit_id: integer("unit_id"), // Assuming FK to sysUnitSql
});
export const selectContractStatusSchema = createSelectSchema(contractStatusSql);
export const insertContractStatusSchema = createInsertSchema(contractStatusSql);
export type ContractStatusSql = z.infer<typeof selectContractStatusSchema>;
export type InsertContractStatusSql = z.infer<typeof insertContractStatusSchema>;

// Assuming `classe` and `groupBatch` from `shared/schema.ts` are compatible.
// If not, they would need to be defined here as well.
// For now, let's import them. If there are issues, we can redefine.
import { classe, groupBatch, documents, addresses } from "../../../shared/schema";

// Addendum Lookup Table (from plano25MyCr.sql, distinct from contract_addendum)
export const addendumLookupSql = pgTable("addendum", {
  addendum_id: serial("addendum_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  // general_status_id: integer("general_status_id"), // FK to general_status table
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectAddendumLookupSchema = createSelectSchema(addendumLookupSql);
export const insertAddendumLookupSchema = createInsertSchema(addendumLookupSql);
export type AddendumLookupSql = z.infer<typeof selectAddendumLookupSchema>;
export type InsertAddendumLookupSql = z.infer<typeof insertAddendumLookupSchema>;


// Main Contract Table from plano25MyCr.sql
export const contractSql = pgTable("contract", {
  contract_id: serial("contract_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  sys_user_id: integer("sys_user_id").notNull().references(() => sysUsers.id),
  group_batch_id: integer("group_batch_id").notNull().references(() => groupBatch.id),
  owner_id: integer("owner_id").notNull().references(() => sysUsers.id),
  contract_name: varchar("contract_name", { length: 100 }).notNull(),
  class_id: integer("class_id").notNull().references(() => classe.id),
  status_id: integer("status_id").notNull().references(() => contractStatusSql.status_id),
  contract_number: varchar("contract_number", { length: 20 }).notNull(),
  contract_type: varchar("contract_type", { length: 50 }).notNull(),
  start_date: date("start_date").notNull(),
  end_date: date("end_date"),
  billing_frequenc: integer("billing_frequenc").default(1).notNull(),
  admission: date("admission").notNull(),
  final_grace: date("final_grace"),
  month_initial_billing: char("month_initial_billing", { length: 2 }).notNull(),
  year_initial_billing: char("year_initial_billing", { length: 4 }).notNull(),
  opt_payday: integer("opt_payday"),
  collector_id: integer("collector_id").references(() => sysUsers.id),
  seller_id: integer("seller_id").references(() => sysUsers.id),
  region_id: integer("region_id"),
  obs: text("obs"),
  services_amount: integer("services_amount"),
  renew_at: date("renew_at"),
  first_charge: integer("first_charge"),
  last_charge: integer("last_charge"),
  charges_amount: integer("charges_amount"),
  charges_paid: integer("charges_paid"),
  alives: integer("alives"),
  deceaseds: integer("deceaseds"),
  dependents: integer("dependents"),
  service_option1: varchar("service_option1", { length: 100 }),
  service_option2: varchar("service_option2", { length: 100 }),
  indicated_by: integer("indicated_by").references(() => sysUsers.id),
  grace_period_days: varchar("grace_period_days", { length: 15 }),
  late_fee_percentage: decimal("late_fee_percentage", { precision: 8, scale: 5 }),
  is_partial_payments_allowed: boolean("is_partial_payments_allowed"),
  default_plan_installments: varchar("default_plan_installments", {length: 6}),
  default_plan_frequency: varchar("default_plan_frequency", { length: 50 }).default("MONTHLY"),
  industry: varchar("industry", { length: 50 }).default("FUNERAL"),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectContractSchema = createSelectSchema(contractSql);
export const insertContractSchema = createInsertSchema(contractSql);
export type ContractSql = z.infer<typeof selectContractSchema>;
export type InsertContractSql = z.infer<typeof insertContractSchema>;

// Beneficiary Table
export const beneficiarySql = pgTable("beneficiary", {
  beneficiary_id: serial("beneficiary_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  contract_id: integer("contract_id").notNull().references(() => contractSql.contract_id),
  relationship: varchar("relationship", { length: 50 }).notNull(),
  is_primary: boolean("is_primary").default(false),
  name: varchar("name", { length: 100 }).notNull(),
  birth_at: date("birth_at"),
  is_forbidden: boolean("is_forbidden"),
  gender_id: integer("gender_id").references(() => genderSql.gender_id),
  document_id: integer("document_id").notNull().references(() => documents.id), // Assuming documents table from shared/schema.ts
  // service_funeral_id: integer("service_funeral_id").references(() => serviceFuneralSql.service_funeral_id), // Define serviceFuneralSql later
  grace_at: date("grace_at"),
  is_alive: boolean("is_alive"),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectBeneficiarySchema = createSelectSchema(beneficiarySql);
export const insertBeneficiarySchema = createInsertSchema(beneficiarySql);
export type BeneficiarySql = z.infer<typeof selectBeneficiarySchema>;
export type InsertBeneficiarySql = z.infer<typeof insertBeneficiarySchema>;

// Contract Charge Table
export const contractChargeSql = pgTable("contract_charge", {
  contract_charge_id: serial("contract_charge_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  contract_id: integer("contract_id").notNull().references(() => contractSql.contract_id),
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  payment_status_id: integer("payment_status_id").notNull().references(() => paymentStatusSql.payment_status_id),
  charge_code: varchar("charge_code", { length: 100 }).notNull(),
  due_date: date("due_date").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  payment_date: date("payment_date"),
  amount_pago: decimal("amount_pago", { precision: 19, scale: 4 }), // SQL uses amount_pago
  convenio: varchar("convenio", { length: 20 }),
  due_month: char("due_month", { length: 2 }),
  due_year: char("due_year", { length: 4 }),
  payd_month: char("payd_month", { length: 2 }), // SQL uses payd_month
  payd_year: char("payd_year", { length: 4 }),   // SQL uses payd_year
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectContractChargeSchema = createSelectSchema(contractChargeSql);
export const insertContractChargeSchema = createInsertSchema(contractChargeSql);
export type ContractChargeSql = z.infer<typeof selectContractChargeSchema>;
export type InsertContractChargeSql = z.infer<typeof insertContractChargeSchema>;

// Contract Addendum Table
export const contractAddendumSql = pgTable("contract_addendum", {
  caddendum_id: serial("caddendum_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  sys_unit_id: integer("sys_unit_id").references(() => sysUnitSql.sys_unit_id),
  contract_id: integer("contract_id").notNull().references(() => contractSql.contract_id),
  addendum_id: integer("addendum_id").notNull().references(() => addendumLookupSql.addendum_id),
  name: varchar("name", { length: 100 }).notNull(),
  product_code: varchar("product_code", { length: 100 }).notNull(),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectContractAddendumSchema = createSelectSchema(contractAddendumSql);
export const insertContractAddendumSchema = createInsertSchema(contractAddendumSql);
export type ContractAddendumSql = z.infer<typeof selectContractAddendumSchema>;
export type InsertContractAddendumSql = z.infer<typeof insertContractAddendumSchema>;

// Contract Status History Table
// Foreign key status_reason_id refers to status_reason table, which is not defined yet.
// Foreign key status_possible_id refers to status_possible table (which I've named contractStatusSql).
// For now, status_reason_id will be a simple integer.
export const contractStatusHistorySql = pgTable("contract_status_history", {
  c_status_history_id: serial("c_status_history_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  status_possible_id: integer("status_possible_id").notNull().references(() => contractStatusSql.status_id), // FK to contract_status
  status_reason_id: integer("status_reason_id").notNull(), // FK to status_reason (to be defined if needed)
  contract_id: integer("contract_id").notNull().references(() => contractSql.contract_id),
  contract_number: varchar("contract_number", { length: 20 }).notNull(),
  detail_status: varchar("detail_status", { length: 250 }),
  changed_at: timestamp("changed_at"),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: integer("delted_by"), // SQL uses delted_by
});
export const selectContractStatusHistorySchema = createSelectSchema(contractStatusHistorySql);
export const insertContractStatusHistorySchema = createInsertSchema(contractStatusHistorySql);
export type ContractStatusHistorySql = z.infer<typeof selectContractStatusHistorySchema>;
export type InsertContractStatusHistorySql = z.infer<typeof insertContractStatusHistorySchema>;

// TODO: Define serviceFuneralSql if needed by beneficiarySql.
// TODO: Define status_reason table if its details are required beyond an ID.
// TODO: Define subsidiary and general_status tables if sysUnitSql needs them.

// Note: Drizzle Zod's createInsertSchema typically omits primary keys and default-generated fields.
// Date fields are strings by default with Zod; coercions might be needed for Date objects in forms.
// Timestamps also are strings.
// Numeric fields (integer, decimal) are numbers.
// Boolean fields are booleans.
// Text, varchar, char are strings.
// Optional fields in DB (nullable) become optional in Zod schemas.
// Not-null fields in DB become required in Zod schemas.
// Default values in DB are not automatically part of Zod schemas for insertion (client should provide or DB handles).
// The .onUpdateNow() for `updated_at` is a common ORM feature but not standard in Drizzle PG core declaration.
// It's usually handled by database triggers or application logic. For Zod, it's just a timestamp.

// For relationships (Drizzle ORM relations object), those would be defined after all relevant tables are declared.
// For now, focusing on individual table schemas and their Zod counterparts.

// subsidiary table - needed for payment_receipt
// This is a simplified version. Actual one might be in shared/schema.ts or more complex.
export const subsidiarySql = pgTable("subsidiary", {
  subsidiary_id: serial("subsidiary_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }),
  // ... other fields if necessary
});
export const selectSubsidiarySchema = createSelectSchema(subsidiarySql);
export type SubsidiarySql = z.infer<typeof selectSubsidiarySchema>;

// ordpgrc table (Cashier Record)
export const ordpgrcSql = pgTable("ordpgrc", {
  ordpgrc_id: serial("ordpgrc_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  sys_user_id: integer("sys_user_id").notNull().references(() => sysUsers.id),
  sys_user_name: varchar("sys_user_name", { length: 50 }), // User's login
  order_number: varchar("order_number", { length: 20 }).notNull(),
  order_date: timestamp("order_date").defaultNow(),
  total_amount: decimal("total_amount", { precision: 19, scale: 4 }).notNull(),
  number_receipt: integer("number_receipt"), // INT UNSIGNED
  closing_date: timestamp("closing_date"), // Nullable, as per logic
  status: text("status").notNull(), // open, closed, transferred, reconciled
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectOrdpgrcSchema = createSelectSchema(ordpgrcSql);
export const insertOrdpgrcSchema = createInsertSchema(ordpgrcSql);
export type OrdpgrcSql = z.infer<typeof selectOrdpgrcSchema>;
export type InsertOrdpgrcSql = z.infer<typeof insertOrdpgrcSchema>;

// payment_receipt table
export const paymentReceiptSql = pgTable("payment_receipt", {
  payment_receipt_id: serial("payment_receipt_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  subsidiary_id: integer("subsidiary_id").notNull().references(() => subsidiarySql.subsidiary_id),
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  sys_user_id: integer("sys_user_id").notNull().references(() => sysUsers.id),
  contract_id: integer("contract_id").notNull().references(() => contractSql.contract_id),
  status: char("status", { length: 2 }), // Nullable
  billing_number: varchar("billing_number", { length: 100 }), // Nullable
  val_payment: decimal("val_payment", { precision: 19, scale: 4 }), // Nullable in DB, but likely required in form
  val_aux: decimal("val_aux", { precision: 19, scale: 4 }), // Nullable
  due_date: date("due_date"), // Nullable in DB (payment date), but required in form (system date)
  cashier_number: char("cashier_number", { length: 8 }), // Nullable
  method_pay: varchar("method_pay", { length: 100 }), // Nullable
  obs_pay: varchar("obs_pay", { length: 200 }), // Nullable
  ordpgrc_id: integer("ordpgrc_id").notNull().references(() => ordpgrcSql.ordpgrc_id),
  payment_status_id: integer("payment_status_id").notNull().references(() => paymentStatusSql.payment_status_id),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});
export const selectPaymentReceiptSchema = createSelectSchema(paymentReceiptSql);
export const insertPaymentReceiptSchema = createInsertSchema(paymentReceiptSql).extend({
  // Making fields required for the form that might be nullable in DB but essential for creation
  val_payment: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val), { message: "Valor de pagamento inválido"}).or(z.number()),
  val_aux: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val), { message: "Valor auxiliar inválido"}).or(z.number()).nullable().optional(),
  due_date: z.string().min(1, "Data do pagamento é obrigatória"), // Will be system date
  method_pay: z.string().min(1, "Método de pagamento é obrigatório"),
  billing_number: z.string().min(1, "Identificação da cobrança é obrigatória"),
});
export type PaymentReceiptSql = z.infer<typeof selectPaymentReceiptSchema>;
export type InsertPaymentReceiptSql = z.infer<typeof insertPaymentReceiptSchema>;

// performed_service table - referenced by medical_foward
// This is a simplified version. Actual one might be in shared/schema.ts or more complex.
// Using the one from shared/schema.ts if compatible, otherwise define here.
// For now, assuming `performedService` from shared/schema.ts is sufficient or we create a local one.
// Let's assume a simplified local one for now if not readily available in shared/schema.ts
export const performedServiceSql = pgTable("performed_service", {
  performed_service_id: serial("performed_service_id").primaryKey(),
  service_type_id: integer("service_type_id").notNull(), // FK to service_type table
  // ... other fields
});
export const selectPerformedServiceSchema = createSelectSchema(performedServiceSql);
export type PerformedServiceSql = z.infer<typeof selectPerformedServiceSchema>;


// medical_foward table
export const medicalFowardSql = pgTable("medical_foward", {
  medical_foward_id: serial("medical_foward_id").primaryKey(), // INT UNSIGNED AUTO_INCREMENT
  sys_unit_id: integer("sys_unit_id").notNull().references(() => sysUnitSql.sys_unit_id),
  sys_user_id: integer("sys_user_id").notNull().references(() => sysUsers.id),
  partner_id: integer("partner_id").notNull(), // FK to partner table (needs partner schema)
  performed_service_id: integer("performed_service_id").notNull().references(() => performedServiceSql.performed_service_id),
  observation: text("observation"), // Nullable
  val_payment: decimal("val_payment", { precision: 19, scale: 4 }), // Nullable
  val_aux: decimal("val_aux", { precision: 19, scale: 4 }), // Nullable
  due_date: date("due_date"), // Nullable (payment date)
  cashier_number: char("cashier_number", { length: 8 }), // Nullable
  method_pay: varchar("method_pay", { length: 100 }), // Nullable
  obs_pay: varchar("obs_pay", { length: 200 }), // Nullable
  ordpgrc_id: integer("ordpgrc_id").notNull().references(() => ordpgrcSql.ordpgrc_id),
  created_at: createdAt,
  updated_at: updatedAt,
  deleted_at: deletedAt,
  created_by: createdBy,
  updated_by: updatedBy,
  deleted_by: deletedBy,
});

export const selectMedicalFowardSchema = createSelectSchema(medicalFowardSql);
export const insertMedicalFowardSchema = createInsertSchema(medicalFowardSql).extend({
  // Define required fields for the form, if different from DB nullability
  partner_id: z.number({required_error: "Parceiro/Credenciado é obrigatório."}),
  performed_service_id: z.number({required_error: "Serviço realizado é obrigatório."}),
  due_date: z.string().min(1, "Data é obrigatória."), // Assuming this will be the service/payment date
  // If val_payment is for a paid service, it should be required
  val_payment: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val >= 0, { message: "Valor de pagamento inválido"}).or(z.number().min(0)).optional().nullable(),
  val_aux: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val >= 0, { message: "Valor auxiliar inválido"}).or(z.number().min(0)).optional().nullable(),
  method_pay: z.string().optional().nullable(), // Optional if no payment (val_payment is 0 or null)
}).superRefine((data, ctx) => {
  if ((data.val_payment && data.val_payment > 0) && !data.method_pay) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["method_pay"],
      message: "Método de pagamento é obrigatório se houver valor pago.",
    });
  }
});

export type MedicalFowardSql = z.infer<typeof selectMedicalFowardSchema>;
export type InsertMedicalFowardSql = z.infer<typeof insertMedicalFowardSchema>;