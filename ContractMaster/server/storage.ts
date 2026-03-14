import { eq, desc, and, sql, isNull } from "drizzle-orm";
import { db } from "./db";
import {
  // Tables
  sysUsersTable,
  addressTypesTable,
  addressesTable,
  entityAddressesTable,
  partnerTypesTable,
  partnersTable,
  documentsTable,
  documentTypesTable,
  entityDocumentsTable,
  // clientsTable, - REMOVED: Migrated to use Partners
  contractsTable,
  contractServicesTable,
  contractBillingTable,
  beneficiariesTable,
  chargesTable,
  contractChargesTable,
  addendumsTable,
  batchChkTable,
  batchDetailTable,
  genderTable,
  paymentStatusTable,
  estadoTable,
  cidadeTable,
  currencyTable,
  generalStatusTable,
  companyTable,
  subsidiaryTable,
  sysUnitTable,
  classeTable,
  groupBatchTable,
  contractNumberRegistryTable,
  contractStatusHistoryTable,
  // Attendance/Service Tables
  paymentReceiptTable,
  carteirinhaTable,
  medicalForwardTable,
  // Financial Tables - TEMPORARILY DISABLED FOR MIGRATION
  // accountTypesTable,
  // accountsTable, 
  // costCentersTable,
  // departmentsTable,
  // projectsTable,
  // fiscalYearsTable, - temporarily commented out for migration
  // fiscalPeriodsTable, - temporarily commented out for migration
  // Types
  type NewSysUser,
  type SysUser,
  type NewAddressType,
  type AddressType,
  type NewAddress,
  type Address,
  type NewEntityAddress,
  type EntityAddress,
  type NewPartnerType,
  type PartnerType,
  type NewPartner,
  type Partner,
  type NewDocument,
  type Document,
  type NewDocumentType,
  type DocumentType,
  type NewEntityDocument,
  type EntityDocument,
  // type NewClient, - REMOVED: Migrated to use Partners
  // type Client, - REMOVED: Migrated to use Partners
  type NewContract,
  type Contract,
  type NewContractServices,
  type ContractServices,
  type NewContractBilling,
  type ContractBilling,
  type NewBeneficiary,
  type Beneficiary,
  type NewCharge,
  type Charge,
  type InsertContractCharge,
  type ContractCharge,
  type NewAddendum,
  type Addendum,
  type NewBatchChk,
  type BatchChk,
  type NewBatchDetail,
  type BatchDetail,
  type ContractNumberRegistry,
  type InsertContractNumberRegistry,
  type ContractStatusHistory,
  type InsertContractStatusHistory,
  // Attendance/Service Types
  type PaymentReceipt,
  type InsertPaymentReceipt,
  type Carteirinha,
  type InsertCarteirinha, 
  type MedicalForward,
  type InsertMedicalForward,
  type NewGender,
  type Gender,
  type NewPaymentStatus,
  type PaymentStatus,
  type NewEstado,
  type Estado,
  type NewCidade,
  type Cidade,
  type NewCurrency,
  type Currency,
  type NewGeneralStatus,
  type GeneralStatus,
  type NewCompany,
  type Company,
  type NewSubsidiary,
  type Subsidiary,
  type NewSysUnit,
  type SysUnit,
  type NewClasse,
  type Classe,
  type NewGroupBatch,
  type GroupBatch,
  // Financial Types - TEMPORARILY DISABLED FOR MIGRATION
  // type InsertAccountType,
  // type SelectAccountType,
  // type InsertAccount,
  // type SelectAccount,
  // type InsertCostCenter,
  // type SelectCostCenter,
  // type InsertDepartment,
  // type SelectDepartment,
  // type InsertProject,
  // type SelectProject,
  type InsertFiscalYear,
  type SelectFiscalYear,
  type InsertFiscalPeriod,
  type SelectFiscalPeriod,
} from "../shared/schema";

export interface IStorage {
  // System Users
  createSysUser(data: NewSysUser): Promise<SysUser>;
  getSysUsers(): Promise<SysUser[]>;
  getSysUserById(id: number): Promise<SysUser | null>;
  updateSysUser(id: number, data: Partial<NewSysUser>): Promise<SysUser | null>;
  deleteSysUser(id: number): Promise<void>;

  // Address Types
  createAddressType(data: NewAddressType): Promise<AddressType>;
  getAddressTypes(): Promise<AddressType[]>;
  getAddressTypeById(id: number): Promise<AddressType | null>;
  updateAddressType(id: number, data: Partial<NewAddressType>): Promise<AddressType | null>;
  deleteAddressType(id: number): Promise<void>;

  // Addresses
  createAddress(data: NewAddress): Promise<Address>;
  getAddresses(): Promise<Address[]>;
  getAddressById(id: number): Promise<Address | null>;
  updateAddress(id: number, data: Partial<NewAddress>): Promise<Address | null>;
  deleteAddress(id: number): Promise<void>;

  // Entity Addresses
  createEntityAddress(data: NewEntityAddress): Promise<EntityAddress>;
  getEntityAddresses(): Promise<EntityAddress[]>;
  getEntityAddressesByEntity(entityType: string, entityId: number): Promise<EntityAddress[]>;
  updateEntityAddress(id: number, data: Partial<NewEntityAddress>): Promise<EntityAddress | null>;
  deleteEntityAddress(id: number): Promise<void>;

  // Partner Types
  createPartnerType(data: NewPartnerType): Promise<PartnerType>;
  getPartnerTypes(): Promise<PartnerType[]>;
  getPartnerTypeById(id: number): Promise<PartnerType | null>;
  updatePartnerType(id: number, data: Partial<NewPartnerType>): Promise<PartnerType | null>;
  deletePartnerType(id: number): Promise<void>;

  // Partners
  createPartner(data: NewPartner): Promise<Partner>;
  getPartners(): Promise<Partner[]>;
  getPartnerById(id: number): Promise<Partner | null>;
  updatePartner(id: number, data: Partial<NewPartner>): Promise<Partner | null>;
  deletePartner(id: number): Promise<void>;

  // Document Types
  createDocumentType(data: NewDocumentType): Promise<DocumentType>;
  getDocumentTypes(): Promise<DocumentType[]>;
  getDocumentTypeById(id: number): Promise<DocumentType | null>;
  updateDocumentType(id: number, data: Partial<NewDocumentType>): Promise<DocumentType | null>;
  deleteDocumentType(id: number): Promise<void>;

  // Documents
  createDocument(data: NewDocument): Promise<Document>;
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | null>;
  updateDocument(id: number, data: Partial<NewDocument>): Promise<Document | null>;
  deleteDocument(id: number): Promise<void>;

  // Entity Documents
  createEntityDocument(data: NewEntityDocument): Promise<EntityDocument>;
  getEntityDocuments(): Promise<EntityDocument[]>;
  getEntityDocumentsByEntity(entityType: string, entityId: number): Promise<EntityDocument[]>;
  updateEntityDocument(id: number, data: Partial<NewEntityDocument>): Promise<EntityDocument | null>;
  deleteEntityDocument(id: number): Promise<void>;

  // Clients - REMOVED: Migrated to use Partners instead
  // Use partner methods: createPartner, getPartners, getPartnerById, updatePartner, deletePartner

  // Contracts (Core - Account Holder)
  createContract(data: NewContract): Promise<Contract>;
  createContractWithUser(contractData: NewContract, userData?: { email: string; password: string; name: string }): Promise<{ contract: Contract; user?: SysUser }>;
  getContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | null>;
  updateContract(id: number, data: Partial<NewContract>): Promise<Contract | null>;
  deleteContract(id: number): Promise<void>;

  // Contract Services
  createContractServices(data: NewContractServices): Promise<ContractServices>;
  getContractServicesByContractId(contractId: number): Promise<ContractServices | null>;
  updateContractServices(id: number, data: Partial<NewContractServices>): Promise<ContractServices | null>;
  deleteContractServices(id: number): Promise<void>;

  // Contract Billing
  createContractBilling(data: NewContractBilling): Promise<ContractBilling>;
  getContractBillingByContractId(contractId: number): Promise<ContractBilling | null>;
  updateContractBilling(id: number, data: Partial<NewContractBilling>): Promise<ContractBilling | null>;
  deleteContractBilling(id: number): Promise<void>;

  // Full Contract (with services and billing)
  createFullContract(
    contractData: NewContract, 
    servicesData: Omit<NewContractServices, 'contractId'>, 
    billingData: Omit<NewContractBilling, 'contractId'>,
    userData?: { email: string; password: string; name: string }
  ): Promise<{ contract: Contract; services: ContractServices; billing: ContractBilling; user?: SysUser }>;
  getFullContractById(id: number): Promise<{ contract: Contract; services: ContractServices | null; billing: ContractBilling | null } | null>;

  // Beneficiaries
  createBeneficiary(data: NewBeneficiary): Promise<Beneficiary>;
  getBeneficiaries(): Promise<Beneficiary[]>;
  getBeneficiaryById(id: number): Promise<Beneficiary | null>;
  getBeneficiariesByContract(contractId: number): Promise<Beneficiary[]>;
  updateBeneficiary(id: number, data: Partial<NewBeneficiary>): Promise<Beneficiary | null>;
  deleteBeneficiary(id: number): Promise<void>;

  // Contract Charges
  createContractCharge(data: InsertContractCharge): Promise<ContractCharge>;
  getContractCharges(): Promise<ContractCharge[]>;
  getContractChargeById(id: number): Promise<ContractCharge | null>;
  getContractChargesByContract(contractId: number): Promise<ContractCharge[]>;
  updateContractCharge(id: number, data: Partial<InsertContractCharge>): Promise<ContractCharge | null>;
  deleteContractCharge(id: number): Promise<void>;

  // Legacy Charges (kept for compatibility)
  createCharge(data: NewCharge): Promise<Charge>;
  getCharges(): Promise<Charge[]>;
  getChargeById(id: number): Promise<Charge | null>;
  getChargesByContract(contractId: number): Promise<Charge[]>;
  updateCharge(id: number, data: Partial<NewCharge>): Promise<Charge | null>;
  deleteCharge(id: number): Promise<void>;

  // Addendums
  createAddendum(data: NewAddendum): Promise<Addendum>;
  getAddendums(): Promise<Addendum[]>;
  getAddendumById(id: number): Promise<Addendum | null>;
  getAddendumsByContract(contractId: number): Promise<Addendum[]>;
  updateAddendum(id: number, data: Partial<NewAddendum>): Promise<Addendum | null>;
  deleteAddendum(id: number): Promise<void>;

  // Batch CHK
  createBatchChk(data: NewBatchChk): Promise<BatchChk>;
  getBatchChks(): Promise<BatchChk[]>;
  getBatchChkById(id: number): Promise<BatchChk | null>;
  updateBatchChk(id: number, data: Partial<NewBatchChk>): Promise<BatchChk | null>;
  deleteBatchChk(id: number): Promise<void>;

  // Batch Detail
  createBatchDetail(data: NewBatchDetail): Promise<BatchDetail>;
  getBatchDetails(): Promise<BatchDetail[]>;
  getBatchDetailById(id: number): Promise<BatchDetail | null>;
  getBatchDetailsByBatch(batchId: number): Promise<BatchDetail[]>;
  updateBatchDetail(id: number, data: Partial<NewBatchDetail>): Promise<BatchDetail | null>;
  deleteBatchDetail(id: number): Promise<void>;

  // Core System Tables
  createGender(data: NewGender): Promise<Gender>;
  getGenders(): Promise<Gender[]>;
  getGenderById(id: number): Promise<Gender | null>;
  updateGender(id: number, data: Partial<NewGender>): Promise<Gender | null>;
  deleteGender(id: number): Promise<void>;

  createPaymentStatus(data: NewPaymentStatus): Promise<PaymentStatus>;
  getPaymentStatuses(): Promise<PaymentStatus[]>;
  getPaymentStatusById(id: number): Promise<PaymentStatus | null>;
  updatePaymentStatus(id: number, data: Partial<NewPaymentStatus>): Promise<PaymentStatus | null>;
  deletePaymentStatus(id: number): Promise<void>;

  createEstado(data: NewEstado): Promise<Estado>;
  getEstados(): Promise<Estado[]>;
  getEstadoById(id: number): Promise<Estado | null>;
  updateEstado(id: number, data: Partial<NewEstado>): Promise<Estado | null>;
  deleteEstado(id: number): Promise<void>;

  createCidade(data: NewCidade): Promise<Cidade>;
  getCidades(): Promise<Cidade[]>;
  getCidadeById(id: number): Promise<Cidade | null>;
  getCidadesByEstado(estadoId: number): Promise<Cidade[]>;
  updateCidade(id: number, data: Partial<NewCidade>): Promise<Cidade | null>;
  deleteCidade(id: number): Promise<void>;

  createCurrency(data: NewCurrency): Promise<Currency>;
  getCurrencies(): Promise<Currency[]>;
  getCurrencyByCode(code: string): Promise<Currency | null>;
  updateCurrency(code: string, data: Partial<NewCurrency>): Promise<Currency | null>;
  deleteCurrency(code: string): Promise<void>;

  createGeneralStatus(data: NewGeneralStatus): Promise<GeneralStatus>;
  getGeneralStatuses(): Promise<GeneralStatus[]>;
  getGeneralStatusById(id: number): Promise<GeneralStatus | null>;
  updateGeneralStatus(id: number, data: Partial<NewGeneralStatus>): Promise<GeneralStatus | null>;
  deleteGeneralStatus(id: number): Promise<void>;

  createCompany(data: NewCompany): Promise<Company>;
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | null>;
  updateCompany(id: number, data: Partial<NewCompany>): Promise<Company | null>;
  deleteCompany(id: number): Promise<void>;

  createSubsidiary(data: NewSubsidiary): Promise<Subsidiary>;
  getSubsidiaries(): Promise<Subsidiary[]>;
  getSubsidiaryById(id: number): Promise<Subsidiary | null>;

  // Financial Module Methods
  // Account Types
  createAccountType(data: InsertAccountType): Promise<SelectAccountType>;
  getAccountTypes(): Promise<SelectAccountType[]>;
  getAccountTypeById(id: number): Promise<SelectAccountType | null>;
  updateAccountType(id: number, data: Partial<InsertAccountType>): Promise<SelectAccountType | null>;
  deleteAccountType(id: number): Promise<void>;

  // Accounts (Chart of Accounts)
  createAccount(data: InsertAccount): Promise<SelectAccount>;
  getAccounts(): Promise<SelectAccount[]>;
  getAccountById(id: number): Promise<SelectAccount | null>;
  getAccountsByType(accountTypeId: number): Promise<SelectAccount[]>;
  getAccountHierarchy(): Promise<SelectAccount[]>;
  updateAccount(id: number, data: Partial<InsertAccount>): Promise<SelectAccount | null>;
  deleteAccount(id: number): Promise<void>;

  // Cost Centers
  createCostCenter(data: InsertCostCenter): Promise<SelectCostCenter>;
  getCostCenters(): Promise<SelectCostCenter[]>;
  getCostCenterById(id: number): Promise<SelectCostCenter | null>;
  getCostCenterHierarchy(): Promise<SelectCostCenter[]>;
  updateCostCenter(id: number, data: Partial<InsertCostCenter>): Promise<SelectCostCenter | null>;
  deleteCostCenter(id: number): Promise<void>;

  // Departments
  createDepartment(data: InsertDepartment): Promise<SelectDepartment>;
  getDepartments(): Promise<SelectDepartment[]>;
  getDepartmentById(id: number): Promise<SelectDepartment | null>;
  updateDepartment(id: number, data: Partial<InsertDepartment>): Promise<SelectDepartment | null>;
  deleteDepartment(id: number): Promise<void>;

  // Projects
  createProject(data: InsertProject): Promise<SelectProject>;
  getProjects(): Promise<SelectProject[]>;
  getProjectById(id: number): Promise<SelectProject | null>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<SelectProject | null>;
  deleteProject(id: number): Promise<void>;

  // Fiscal Years
  createFiscalYear(data: InsertFiscalYear): Promise<SelectFiscalYear>;
  getFiscalYears(): Promise<SelectFiscalYear[]>;
  getFiscalYearById(id: number): Promise<SelectFiscalYear | null>;
  updateFiscalYear(id: number, data: Partial<InsertFiscalYear>): Promise<SelectFiscalYear | null>;
  deleteFiscalYear(id: number): Promise<void>;

  // Fiscal Periods
  createFiscalPeriod(data: InsertFiscalPeriod): Promise<SelectFiscalPeriod>;
  getFiscalPeriods(): Promise<SelectFiscalPeriod[]>;
  getFiscalPeriodById(id: number): Promise<SelectFiscalPeriod | null>;
  getFiscalPeriodsByYear(fiscalYearId: number): Promise<SelectFiscalPeriod[]>;
  updateFiscalPeriod(id: number, data: Partial<InsertFiscalPeriod>): Promise<SelectFiscalPeriod | null>;
  deleteFiscalPeriod(id: number): Promise<void>;
  updateSubsidiary(id: number, data: Partial<NewSubsidiary>): Promise<Subsidiary | null>;
  deleteSubsidiary(id: number): Promise<void>;

  createSysUnit(data: NewSysUnit): Promise<SysUnit>;
  getSysUnits(): Promise<SysUnit[]>;
  getSysUnitById(id: number): Promise<SysUnit | null>;
  updateSysUnit(id: number, data: Partial<NewSysUnit>): Promise<SysUnit | null>;
  deleteSysUnit(id: number): Promise<void>;

  createClasse(data: NewClasse): Promise<Classe>;
  getClasses(): Promise<Classe[]>;
  getClasseById(id: number): Promise<Classe | null>;
  updateClasse(id: number, data: Partial<NewClasse>): Promise<Classe | null>;
  deleteClasse(id: number): Promise<void>;

  createGroupBatch(data: NewGroupBatch): Promise<GroupBatch>;
  getGroupBatches(): Promise<GroupBatch[]>;
  getGroupBatchById(id: number): Promise<GroupBatch | null>;
  updateGroupBatch(id: number, data: Partial<NewGroupBatch>): Promise<GroupBatch | null>;
  deleteGroupBatch(id: number): Promise<void>;
}

export class DrizzleStorage implements IStorage {
  // System Users
  async createSysUser(data: NewSysUser): Promise<SysUser> {
    const [user] = await db.insert(sysUsersTable).values(data).returning();
    return user;
  }

  async getSysUsers(): Promise<SysUser[]> {
    return await db.select().from(sysUsersTable).where(eq(sysUsersTable.deletedAt, null)).orderBy(desc(sysUsersTable.createdAt));
  }

  async getSysUserById(id: number): Promise<SysUser | null> {
    const [user] = await db.select().from(sysUsersTable).where(and(eq(sysUsersTable.id, id), eq(sysUsersTable.deletedAt, null)));
    return user || null;
  }

  async updateSysUser(id: number, data: Partial<NewSysUser>): Promise<SysUser | null> {
    const [user] = await db.update(sysUsersTable).set({ ...data, updatedAt: new Date() }).where(eq(sysUsersTable.id, id)).returning();
    return user || null;
  }

  async deleteSysUser(id: number): Promise<void> {
    await db.update(sysUsersTable).set({ deletedAt: new Date() }).where(eq(sysUsersTable.id, id));
  }

  // Address Types
  async createAddressType(data: NewAddressType): Promise<AddressType> {
    const [addressType] = await db.insert(addressTypesTable).values(data).returning();
    return addressType;
  }

  async getAddressTypes(): Promise<AddressType[]> {
    return await db.select().from(addressTypesTable).where(eq(addressTypesTable.deletedAt, null)).orderBy(desc(addressTypesTable.createdAt));
  }

  async getAddressTypeById(id: number): Promise<AddressType | null> {
    const [addressType] = await db.select().from(addressTypesTable).where(and(eq(addressTypesTable.id, id), eq(addressTypesTable.deletedAt, null)));
    return addressType || null;
  }

  async updateAddressType(id: number, data: Partial<NewAddressType>): Promise<AddressType | null> {
    const [addressType] = await db.update(addressTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(addressTypesTable.id, id)).returning();
    return addressType || null;
  }

  async deleteAddressType(id: number): Promise<void> {
    await db.update(addressTypesTable).set({ deletedAt: new Date() }).where(eq(addressTypesTable.id, id));
  }

  // Addresses
  async createAddress(data: NewAddress): Promise<Address> {
    const [address] = await db.insert(addressesTable).values(data).returning();
    return address;
  }

  async getAddresses(): Promise<Address[]> {
    return await db.select().from(addressesTable).where(eq(addressesTable.deletedAt, null)).orderBy(desc(addressesTable.createdAt));
  }

  async getAddressById(id: number): Promise<Address | null> {
    const [address] = await db.select().from(addressesTable).where(and(eq(addressesTable.id, id), eq(addressesTable.deletedAt, null)));
    return address || null;
  }

  async updateAddress(id: number, data: Partial<NewAddress>): Promise<Address | null> {
    const [address] = await db.update(addressesTable).set({ ...data, updatedAt: new Date() }).where(eq(addressesTable.id, id)).returning();
    return address || null;
  }

  async deleteAddress(id: number): Promise<void> {
    await db.update(addressesTable).set({ deletedAt: new Date() }).where(eq(addressesTable.id, id));
  }

  // Entity Addresses
  async createEntityAddress(data: NewEntityAddress): Promise<EntityAddress> {
    const [entityAddress] = await db.insert(entityAddressesTable).values(data).returning();
    return entityAddress;
  }

  async getEntityAddresses(): Promise<EntityAddress[]> {
    return await db.select().from(entityAddressesTable).orderBy(desc(entityAddressesTable.id));
  }

  async getEntityAddressesByEntity(entityType: string, entityId: number): Promise<EntityAddress[]> {
    return await db.select().from(entityAddressesTable)
      .where(and(eq(entityAddressesTable.entityType, entityType), eq(entityAddressesTable.entityId, entityId)));
  }

  async updateEntityAddress(id: number, data: Partial<NewEntityAddress>): Promise<EntityAddress | null> {
    const [entityAddress] = await db.update(entityAddressesTable).set(data).where(eq(entityAddressesTable.id, id)).returning();
    return entityAddress || null;
  }

  async deleteEntityAddress(id: number): Promise<void> {
    await db.delete(entityAddressesTable).where(eq(entityAddressesTable.id, id));
  }

  // Partner Types
  async createPartnerType(data: NewPartnerType): Promise<PartnerType> {
    const [partnerType] = await db.insert(partnerTypesTable).values(data).returning();
    return partnerType;
  }

  async getPartnerTypes(): Promise<PartnerType[]> {
    return await db.select().from(partnerTypesTable).where(isNull(partnerTypesTable.deletedAt)).orderBy(desc(partnerTypesTable.createdAt));
  }

  async getPartnerTypeById(id: number): Promise<PartnerType | null> {
    const [partnerType] = await db.select().from(partnerTypesTable).where(eq(partnerTypesTable.id, id));
    return partnerType || null;
  }

  async updatePartnerType(id: number, data: Partial<NewPartnerType>): Promise<PartnerType | null> {
    const [partnerType] = await db.update(partnerTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(partnerTypesTable.id, id)).returning();
    return partnerType || null;
  }

  async deletePartnerType(id: number): Promise<void> {
    await db.delete(partnerTypesTable).where(eq(partnerTypesTable.id, id));
  }

  // Partners
  async createPartner(data: NewPartner): Promise<Partner> {
    const [partner] = await db.insert(partnersTable).values(data).returning();
    return partner;
  }

  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partnersTable).where(isNull(partnersTable.deletedAt)).orderBy(desc(partnersTable.createdAt));
  }

  async getPartnerById(id: number): Promise<Partner | null> {
    const [partner] = await db.select().from(partnersTable).where(eq(partnersTable.id, id));
    return partner || null;
  }

  async updatePartner(id: number, data: Partial<NewPartner>): Promise<Partner | null> {
    const [partner] = await db.update(partnersTable).set({ ...data, updatedAt: new Date() }).where(eq(partnersTable.id, id)).returning();
    return partner || null;
  }

  async deletePartner(id: number): Promise<void> {
    await db.update(partnersTable).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(partnersTable.id, id));
  }

  // Document Types
  async createDocumentType(data: NewDocumentType): Promise<DocumentType> {
    const [documentType] = await db.insert(documentTypesTable).values(data).returning();
    return documentType;
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    return await db.select().from(documentTypesTable).where(eq(documentTypesTable.deletedAt, null)).orderBy(desc(documentTypesTable.createdAt));
  }

  async getDocumentTypeById(id: number): Promise<DocumentType | null> {
    const [documentType] = await db.select().from(documentTypesTable).where(and(eq(documentTypesTable.id, id), eq(documentTypesTable.deletedAt, null)));
    return documentType || null;
  }

  async updateDocumentType(id: number, data: Partial<NewDocumentType>): Promise<DocumentType | null> {
    const [documentType] = await db.update(documentTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(documentTypesTable.id, id)).returning();
    return documentType || null;
  }

  async deleteDocumentType(id: number): Promise<void> {
    await db.update(documentTypesTable).set({ deletedAt: new Date() }).where(eq(documentTypesTable.id, id));
  }

  // Documents
  async createDocument(data: NewDocument): Promise<Document> {
    const [document] = await db.insert(documentsTable).values(data).returning();
    return document;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documentsTable).where(eq(documentsTable.deletedAt, null)).orderBy(desc(documentsTable.createdAt));
  }

  async getDocumentById(id: number): Promise<Document | null> {
    const [document] = await db.select().from(documentsTable).where(and(eq(documentsTable.id, id), eq(documentsTable.deletedAt, null)));
    return document || null;
  }

  async updateDocument(id: number, data: Partial<NewDocument>): Promise<Document | null> {
    const [document] = await db.update(documentsTable).set({ ...data, updatedAt: new Date() }).where(eq(documentsTable.id, id)).returning();
    return document || null;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.update(documentsTable).set({ deletedAt: new Date() }).where(eq(documentsTable.id, id));
  }

  // Entity Documents
  async createEntityDocument(data: NewEntityDocument): Promise<EntityDocument> {
    const [entityDocument] = await db.insert(entityDocumentsTable).values(data).returning();
    return entityDocument;
  }

  async getEntityDocuments(): Promise<EntityDocument[]> {
    return await db.select().from(entityDocumentsTable).orderBy(desc(entityDocumentsTable.id));
  }

  async getEntityDocumentsByEntity(entityType: string, entityId: number): Promise<EntityDocument[]> {
    return await db.select().from(entityDocumentsTable)
      .where(and(eq(entityDocumentsTable.entityType, entityType), eq(entityDocumentsTable.entityId, entityId)));
  }

  async updateEntityDocument(id: number, data: Partial<NewEntityDocument>): Promise<EntityDocument | null> {
    const [entityDocument] = await db.update(entityDocumentsTable).set(data).where(eq(entityDocumentsTable.id, id)).returning();
    return entityDocument || null;
  }

  async deleteEntityDocument(id: number): Promise<void> {
    await db.delete(entityDocumentsTable).where(eq(entityDocumentsTable.id, id));
  }

  // Clients - REMOVED: Migrated to use Partners instead
  // All client functionality has been replaced with the Partners system
  // Use the existing partner methods for equivalent functionality

  // Contracts
  async createContract(data: NewContract): Promise<Contract> {
    const [contract] = await db.insert(contractsTable).values(data).returning();
    return contract;
  }

  async createContractWithUser(contractData: NewContract, userData?: { email: string; password: string; name: string }): Promise<{ contract: Contract; user?: SysUser }> {
    // First create the contract
    const [contract] = await db.insert(contractsTable).values(contractData).returning();
    
    let user: SysUser | undefined;
    
    // If user data is provided, create a sys_user account
    if (userData && userData.email && userData.password && userData.name) {
      const sysUserData: NewSysUser = {
        login: userData.email,
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        name: userData.name,
        phone: null,
        contactId: null,
        sysUnitId: contract.sysUnitId,
        companyId: 1, // Default company ID
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      try {
        user = await this.createSysUser(sysUserData);
        
        // Update the contract to link it to the created user
        await db.update(contractsTable)
          .set({ sysUserId: user.id, updatedAt: new Date() })
          .where(eq(contractsTable.id, contract.id));
          
        // Re-fetch the updated contract
        const [updatedContract] = await db.select().from(contractsTable).where(eq(contractsTable.id, contract.id));
        return { contract: updatedContract, user };
      } catch (error) {
        console.error('Error creating sys_user for contract:', error);
        // Contract was already created, return it without the user
        return { contract, user: undefined };
      }
    }
    
    return { contract, user: undefined };
  }

  async getContracts(): Promise<Contract[]> {
    return await db.select().from(contractsTable).where(isNull(contractsTable.deletedAt)).orderBy(desc(contractsTable.createdAt));
  }

  async getContractById(id: number): Promise<Contract | null> {
    const [contract] = await db.select().from(contractsTable).where(and(eq(contractsTable.id, id), isNull(contractsTable.deletedAt)));
    return contract || null;
  }

  async updateContract(id: number, data: Partial<NewContract>): Promise<Contract | null> {
    const [contract] = await db.update(contractsTable).set({ ...data, updatedAt: new Date() }).where(eq(contractsTable.id, id)).returning();
    return contract || null;
  }

  async deleteContract(id: number): Promise<void> {
    await db.update(contractsTable).set({ deletedAt: new Date() }).where(eq(contractsTable.id, id));
  }

  // Contract Services
  async createContractServices(data: NewContractServices): Promise<ContractServices> {
    const [services] = await db.insert(contractServicesTable).values(data).returning();
    return services;
  }

  async getContractServicesByContractId(contractId: number): Promise<ContractServices | null> {
    const [services] = await db.select().from(contractServicesTable)
      .where(and(eq(contractServicesTable.contractId, contractId), isNull(contractServicesTable.deletedAt)));
    return services || null;
  }

  async updateContractServices(id: number, data: Partial<NewContractServices>): Promise<ContractServices | null> {
    const [services] = await db.update(contractServicesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contractServicesTable.id, id))
      .returning();
    return services || null;
  }

  async deleteContractServices(id: number): Promise<void> {
    await db.update(contractServicesTable).set({ deletedAt: new Date() }).where(eq(contractServicesTable.id, id));
  }

  // Contract Billing
  async createContractBilling(data: NewContractBilling): Promise<ContractBilling> {
    const [billing] = await db.insert(contractBillingTable).values(data).returning();
    return billing;
  }

  async getContractBillingByContractId(contractId: number): Promise<ContractBilling | null> {
    const [billing] = await db.select().from(contractBillingTable)
      .where(and(eq(contractBillingTable.contractId, contractId), isNull(contractBillingTable.deletedAt)));
    return billing || null;
  }

  async updateContractBilling(id: number, data: Partial<NewContractBilling>): Promise<ContractBilling | null> {
    const [billing] = await db.update(contractBillingTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contractBillingTable.id, id))
      .returning();
    return billing || null;
  }

  async deleteContractBilling(id: number): Promise<void> {
    await db.update(contractBillingTable).set({ deletedAt: new Date() }).where(eq(contractBillingTable.id, id));
  }

  // Full Contract (with services and billing)
  async createFullContract(
    contractData: NewContract, 
    servicesData: Omit<NewContractServices, 'contractId'>, 
    billingData: Omit<NewContractBilling, 'contractId'>,
    userData?: { email: string; password: string; name: string }
  ): Promise<{ contract: Contract; services: ContractServices; billing: ContractBilling; user?: SysUser }> {
    // Create the base contract first
    const [contract] = await db.insert(contractsTable).values(contractData).returning();
    
    // Create associated services and billing with the contract ID
    const [services] = await db.insert(contractServicesTable).values({
      ...servicesData,
      contractId: contract.id
    }).returning();
    
    const [billing] = await db.insert(contractBillingTable).values({
      ...billingData,
      contractId: contract.id
    }).returning();

    let user: SysUser | undefined;
    
    // If user data is provided, create a sys_user account
    if (userData && userData.email && userData.password && userData.name) {
      const sysUserData: NewSysUser = {
        login: userData.email,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: null,
        contactId: null,
        sysUnitId: contract.sysUnitId,
        companyId: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      try {
        user = await this.createSysUser(sysUserData);
        await db.update(contractsTable)
          .set({ sysUserId: user.id, updatedAt: new Date() })
          .where(eq(contractsTable.id, contract.id));
        const [updatedContract] = await db.select().from(contractsTable).where(eq(contractsTable.id, contract.id));
        return { contract: updatedContract, services, billing, user };
      } catch (error) {
        console.error('Error creating sys_user for contract:', error);
        return { contract, services, billing, user: undefined };
      }
    }
    
    return { contract, services, billing, user: undefined };
  }

  async getFullContractById(id: number): Promise<{ contract: Contract; services: ContractServices | null; billing: ContractBilling | null } | null> {
    const contract = await this.getContractById(id);
    if (!contract) return null;
    
    const services = await this.getContractServicesByContractId(id);
    const billing = await this.getContractBillingByContractId(id);
    
    return { contract, services, billing };
  }

  // Beneficiaries
  async createBeneficiary(data: NewBeneficiary): Promise<Beneficiary> {
    const [beneficiary] = await db.insert(beneficiariesTable).values(data).returning();
    return beneficiary;
  }

  async getBeneficiaries(): Promise<Beneficiary[]> {
    return await db.select().from(beneficiariesTable).orderBy(desc(beneficiariesTable.createdAt));
  }

  async getBeneficiaryById(id: number): Promise<Beneficiary | null> {
    const [beneficiary] = await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.id, id));
    return beneficiary || null;
  }

  async getBeneficiariesByContract(contractId: number): Promise<Beneficiary[]> {
    return await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.contractId, contractId));
  }

  async updateBeneficiary(id: number, data: Partial<NewBeneficiary>): Promise<Beneficiary | null> {
    const [beneficiary] = await db.update(beneficiariesTable).set({ ...data, updatedAt: new Date() }).where(eq(beneficiariesTable.id, id)).returning();
    return beneficiary || null;
  }

  async deleteBeneficiary(id: number): Promise<void> {
    await db.delete(beneficiariesTable).where(eq(beneficiariesTable.id, id));
  }

  // Charges
  async createCharge(data: NewCharge): Promise<Charge> {
    const [charge] = await db.insert(chargesTable).values(data).returning();
    return charge;
  }

  async getCharges(): Promise<Charge[]> {
    return await db.select().from(chargesTable).orderBy(desc(chargesTable.createdAt));
  }

  async getChargeById(id: number): Promise<Charge | null> {
    const [charge] = await db.select().from(chargesTable).where(eq(chargesTable.id, id));
    return charge || null;
  }

  async getChargesByContract(contractId: number): Promise<Charge[]> {
    return await db.select().from(chargesTable).where(eq(chargesTable.contractId, contractId));
  }

  async updateCharge(id: number, data: Partial<NewCharge>): Promise<Charge | null> {
    const [charge] = await db.update(chargesTable).set({ ...data, updatedAt: new Date() }).where(eq(chargesTable.id, id)).returning();
    return charge || null;
  }

  async deleteCharge(id: number): Promise<void> {
    await db.delete(chargesTable).where(eq(chargesTable.id, id));
  }

  // Contract Charges Implementation
  async createContractCharge(data: InsertContractCharge): Promise<ContractCharge> {
    const [contractCharge] = await db.insert(contractChargesTable).values(data).returning();
    return contractCharge;
  }

  async getContractCharges(): Promise<ContractCharge[]> {
    return await db.select().from(contractChargesTable).where(isNull(contractChargesTable.deletedAt)).orderBy(desc(contractChargesTable.createdAt));
  }

  async getContractChargeById(id: number): Promise<ContractCharge | null> {
    const [contractCharge] = await db.select().from(contractChargesTable).where(and(eq(contractChargesTable.id, id), isNull(contractChargesTable.deletedAt)));
    return contractCharge || null;
  }

  async getContractChargesByContract(contractId: number): Promise<ContractCharge[]> {
    return await db.select().from(contractChargesTable).where(and(eq(contractChargesTable.contractId, contractId), isNull(contractChargesTable.deletedAt))).orderBy(desc(contractChargesTable.dueDate));
  }

  async updateContractCharge(id: number, data: Partial<InsertContractCharge>): Promise<ContractCharge | null> {
    const [contractCharge] = await db.update(contractChargesTable).set({ ...data, updatedAt: new Date() }).where(eq(contractChargesTable.id, id)).returning();
    return contractCharge || null;
  }

  async deleteContractCharge(id: number): Promise<void> {
    await db.update(contractChargesTable).set({ deletedAt: new Date() }).where(eq(contractChargesTable.id, id));
  }

  // Addendums
  async createAddendum(data: NewAddendum): Promise<Addendum> {
    const [addendum] = await db.insert(addendumsTable).values(data).returning();
    return addendum;
  }

  async getAddendums(): Promise<Addendum[]> {
    return await db.select().from(addendumsTable).orderBy(desc(addendumsTable.createdAt));
  }

  async getAddendumById(id: number): Promise<Addendum | null> {
    const [addendum] = await db.select().from(addendumsTable).where(eq(addendumsTable.id, id));
    return addendum || null;
  }

  async getAddendumsByContract(contractId: number): Promise<Addendum[]> {
    return await db.select().from(addendumsTable).where(eq(addendumsTable.contractId, contractId));
  }

  async updateAddendum(id: number, data: Partial<NewAddendum>): Promise<Addendum | null> {
    const [addendum] = await db.update(addendumsTable).set({ ...data, updatedAt: new Date() }).where(eq(addendumsTable.id, id)).returning();
    return addendum || null;
  }

  async deleteAddendum(id: number): Promise<void> {
    await db.delete(addendumsTable).where(eq(addendumsTable.id, id));
  }

  // Batch CHK
  async createBatchChk(data: NewBatchChk): Promise<BatchChk> {
    const [batchChk] = await db.insert(batchChkTable).values(data).returning();
    return batchChk;
  }

  async getBatchChks(): Promise<BatchChk[]> {
    return await db.select().from(batchChkTable).orderBy(desc(batchChkTable.createdAt));
  }

  async getBatchChkById(id: number): Promise<BatchChk | null> {
    const [batchChk] = await db.select().from(batchChkTable).where(eq(batchChkTable.id, id));
    return batchChk || null;
  }

  async updateBatchChk(id: number, data: Partial<NewBatchChk>): Promise<BatchChk | null> {
    const [batchChk] = await db.update(batchChkTable).set({ ...data, updatedAt: new Date() }).where(eq(batchChkTable.id, id)).returning();
    return batchChk || null;
  }

  async deleteBatchChk(id: number): Promise<void> {
    await db.delete(batchChkTable).where(eq(batchChkTable.id, id));
  }

  // Batch Detail
  async createBatchDetail(data: NewBatchDetail): Promise<BatchDetail> {
    const [batchDetail] = await db.insert(batchDetailTable).values(data).returning();
    return batchDetail;
  }

  async getBatchDetails(): Promise<BatchDetail[]> {
    return await db.select().from(batchDetailTable).orderBy(desc(batchDetailTable.createdAt));
  }

  async getBatchDetailById(id: number): Promise<BatchDetail | null> {
    const [batchDetail] = await db.select().from(batchDetailTable).where(eq(batchDetailTable.id, id));
    return batchDetail || null;
  }

  async getBatchDetailsByBatch(batchId: number): Promise<BatchDetail[]> {
    return await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchId, batchId));
  }

  async updateBatchDetail(id: number, data: Partial<NewBatchDetail>): Promise<BatchDetail | null> {
    const [batchDetail] = await db.update(batchDetailTable).set({ ...data, updatedAt: new Date() }).where(eq(batchDetailTable.id, id)).returning();
    return batchDetail || null;
  }

  async deleteBatchDetail(id: number): Promise<void> {
    await db.delete(batchDetailTable).where(eq(batchDetailTable.id, id));
  }

  // Core System Tables Implementation
  async createGender(data: NewGender): Promise<Gender> {
    const [gender] = await db.insert(genderTable).values(data).returning();
    return gender;
  }

  async getGenders(): Promise<Gender[]> {
    return await db.select().from(genderTable).where(eq(genderTable.deletedAt, null)).orderBy(desc(genderTable.createdAt));
  }

  async getGenderById(id: number): Promise<Gender | null> {
    const [gender] = await db.select().from(genderTable).where(and(eq(genderTable.id, id), eq(genderTable.deletedAt, null)));
    return gender || null;
  }

  async updateGender(id: number, data: Partial<NewGender>): Promise<Gender | null> {
    const [gender] = await db.update(genderTable).set({ ...data, updatedAt: new Date() }).where(eq(genderTable.id, id)).returning();
    return gender || null;
  }

  async deleteGender(id: number): Promise<void> {
    await db.update(genderTable).set({ deletedAt: new Date() }).where(eq(genderTable.id, id));
  }

  async createPaymentStatus(data: NewPaymentStatus): Promise<PaymentStatus> {
    const [paymentStatus] = await db.insert(paymentStatusTable).values(data).returning();
    return paymentStatus;
  }

  async getPaymentStatuses(): Promise<PaymentStatus[]> {
    return await db.select().from(paymentStatusTable).where(eq(paymentStatusTable.deletedAt, null)).orderBy(desc(paymentStatusTable.createdAt));
  }

  async getPaymentStatusById(id: number): Promise<PaymentStatus | null> {
    const [paymentStatus] = await db.select().from(paymentStatusTable).where(and(eq(paymentStatusTable.id, id), eq(paymentStatusTable.deletedAt, null)));
    return paymentStatus || null;
  }

  async updatePaymentStatus(id: number, data: Partial<NewPaymentStatus>): Promise<PaymentStatus | null> {
    const [paymentStatus] = await db.update(paymentStatusTable).set({ ...data, updatedAt: new Date() }).where(eq(paymentStatusTable.id, id)).returning();
    return paymentStatus || null;
  }

  async deletePaymentStatus(id: number): Promise<void> {
    await db.update(paymentStatusTable).set({ deletedAt: new Date() }).where(eq(paymentStatusTable.id, id));
  }

  async createEstado(data: NewEstado): Promise<Estado> {
    const [estado] = await db.insert(estadoTable).values(data).returning();
    return estado;
  }

  async getEstados(): Promise<Estado[]> {
    return await db.select().from(estadoTable).where(eq(estadoTable.deletedAt, null)).orderBy(desc(estadoTable.createdAt));
  }

  async getEstadoById(id: number): Promise<Estado | null> {
    const [estado] = await db.select().from(estadoTable).where(and(eq(estadoTable.id, id), eq(estadoTable.deletedAt, null)));
    return estado || null;
  }

  async updateEstado(id: number, data: Partial<NewEstado>): Promise<Estado | null> {
    const [estado] = await db.update(estadoTable).set({ ...data, updatedAt: new Date() }).where(eq(estadoTable.id, id)).returning();
    return estado || null;
  }

  async deleteEstado(id: number): Promise<void> {
    await db.update(estadoTable).set({ deletedAt: new Date() }).where(eq(estadoTable.id, id));
  }

  async createCidade(data: NewCidade): Promise<Cidade> {
    const [cidade] = await db.insert(cidadeTable).values(data).returning();
    return cidade;
  }

  async getCidades(): Promise<Cidade[]> {
    return await db.select().from(cidadeTable).where(eq(cidadeTable.deletedAt, null)).orderBy(desc(cidadeTable.createdAt));
  }

  async getCidadeById(id: number): Promise<Cidade | null> {
    const [cidade] = await db.select().from(cidadeTable).where(and(eq(cidadeTable.id, id), eq(cidadeTable.deletedAt, null)));
    return cidade || null;
  }

  async getCidadesByEstado(estadoId: number): Promise<Cidade[]> {
    return await db.select().from(cidadeTable).where(and(eq(cidadeTable.estadoId, estadoId), eq(cidadeTable.deletedAt, null)));
  }

  async updateCidade(id: number, data: Partial<NewCidade>): Promise<Cidade | null> {
    const [cidade] = await db.update(cidadeTable).set({ ...data, updatedAt: new Date() }).where(eq(cidadeTable.id, id)).returning();
    return cidade || null;
  }

  async deleteCidade(id: number): Promise<void> {
    await db.update(cidadeTable).set({ deletedAt: new Date() }).where(eq(cidadeTable.id, id));
  }

  async createCurrency(data: NewCurrency): Promise<Currency> {
    const [currency] = await db.insert(currencyTable).values(data).returning();
    return currency;
  }

  async getCurrencies(): Promise<Currency[]> {
    return await db.select().from(currencyTable).where(eq(currencyTable.deletedAt, null)).orderBy(desc(currencyTable.createdAt));
  }

  async getCurrencyByCode(code: string): Promise<Currency | null> {
    const [currency] = await db.select().from(currencyTable).where(and(eq(currencyTable.code, code), eq(currencyTable.deletedAt, null)));
    return currency || null;
  }

  async updateCurrency(code: string, data: Partial<NewCurrency>): Promise<Currency | null> {
    const [currency] = await db.update(currencyTable).set({ ...data, updatedAt: new Date() }).where(eq(currencyTable.code, code)).returning();
    return currency || null;
  }

  async deleteCurrency(code: string): Promise<void> {
    await db.update(currencyTable).set({ deletedAt: new Date() }).where(eq(currencyTable.code, code));
  }

  async createGeneralStatus(data: NewGeneralStatus): Promise<GeneralStatus> {
    const [generalStatus] = await db.insert(generalStatusTable).values(data).returning();
    return generalStatus;
  }

  async getGeneralStatuses(): Promise<GeneralStatus[]> {
    return await db.select().from(generalStatusTable).where(eq(generalStatusTable.deletedAt, null)).orderBy(desc(generalStatusTable.createdAt));
  }

  async getGeneralStatusById(id: number): Promise<GeneralStatus | null> {
    const [generalStatus] = await db.select().from(generalStatusTable).where(and(eq(generalStatusTable.id, id), eq(generalStatusTable.deletedAt, null)));
    return generalStatus || null;
  }

  async updateGeneralStatus(id: number, data: Partial<NewGeneralStatus>): Promise<GeneralStatus | null> {
    const [generalStatus] = await db.update(generalStatusTable).set({ ...data, updatedAt: new Date() }).where(eq(generalStatusTable.id, id)).returning();
    return generalStatus || null;
  }

  async deleteGeneralStatus(id: number): Promise<void> {
    await db.update(generalStatusTable).set({ deletedAt: new Date() }).where(eq(generalStatusTable.id, id));
  }

  async createCompany(data: NewCompany): Promise<Company> {
    const [company] = await db.insert(companyTable).values(data).returning();
    return company;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companyTable).where(eq(companyTable.deletedAt, null)).orderBy(desc(companyTable.createdAt));
  }

  async getCompanyById(id: number): Promise<Company | null> {
    const [company] = await db.select().from(companyTable).where(and(eq(companyTable.id, id), eq(companyTable.deletedAt, null)));
    return company || null;
  }

  async updateCompany(id: number, data: Partial<NewCompany>): Promise<Company | null> {
    const [company] = await db.update(companyTable).set({ ...data, updatedAt: new Date() }).where(eq(companyTable.id, id)).returning();
    return company || null;
  }

  async deleteCompany(id: number): Promise<void> {
    await db.update(companyTable).set({ deletedAt: new Date() }).where(eq(companyTable.id, id));
  }

  async createSubsidiary(data: NewSubsidiary): Promise<Subsidiary> {
    const [subsidiary] = await db.insert(subsidiaryTable).values(data).returning();
    return subsidiary;
  }

  async getSubsidiaries(): Promise<Subsidiary[]> {
    return await db.select().from(subsidiaryTable).where(eq(subsidiaryTable.deletedAt, null)).orderBy(desc(subsidiaryTable.createdAt));
  }

  async getSubsidiaryById(id: number): Promise<Subsidiary | null> {
    const [subsidiary] = await db.select().from(subsidiaryTable).where(and(eq(subsidiaryTable.id, id), eq(subsidiaryTable.deletedAt, null)));
    return subsidiary || null;
  }

  async updateSubsidiary(id: number, data: Partial<NewSubsidiary>): Promise<Subsidiary | null> {
    const [subsidiary] = await db.update(subsidiaryTable).set({ ...data, updatedAt: new Date() }).where(eq(subsidiaryTable.id, id)).returning();
    return subsidiary || null;
  }

  async deleteSubsidiary(id: number): Promise<void> {
    await db.update(subsidiaryTable).set({ deletedAt: new Date() }).where(eq(subsidiaryTable.id, id));
  }

  async createSysUnit(data: NewSysUnit): Promise<SysUnit> {
    const [sysUnit] = await db.insert(sysUnitTable).values(data).returning();
    return sysUnit;
  }

  async getSysUnits(): Promise<SysUnit[]> {
    return await db.select().from(sysUnitTable).orderBy(desc(sysUnitTable.id));
  }

  async getSysUnitById(id: number): Promise<SysUnit | null> {
    const [sysUnit] = await db.select().from(sysUnitTable).where(eq(sysUnitTable.id, id));
    return sysUnit || null;
  }

  async updateSysUnit(id: number, data: Partial<NewSysUnit>): Promise<SysUnit | null> {
    const [sysUnit] = await db.update(sysUnitTable).set(data).where(eq(sysUnitTable.id, id)).returning();
    return sysUnit || null;
  }

  async deleteSysUnit(id: number): Promise<void> {
    await db.delete(sysUnitTable).where(eq(sysUnitTable.id, id));
  }

  async createClasse(data: NewClasse): Promise<Classe> {
    const [classe] = await db.insert(classeTable).values(data).returning();
    return classe;
  }

  async getClasses(): Promise<Classe[]> {
    return await db.select().from(classeTable).where(eq(classeTable.deletedAt, null)).orderBy(desc(classeTable.createdAt));
  }

  async getClasseById(id: number): Promise<Classe | null> {
    const [classe] = await db.select().from(classeTable).where(and(eq(classeTable.id, id), eq(classeTable.deletedAt, null)));
    return classe || null;
  }

  async updateClasse(id: number, data: Partial<NewClasse>): Promise<Classe | null> {
    const [classe] = await db.update(classeTable).set({ ...data, updatedAt: new Date() }).where(eq(classeTable.id, id)).returning();
    return classe || null;
  }

  async deleteClasse(id: number): Promise<void> {
    await db.update(classeTable).set({ deletedAt: new Date() }).where(eq(classeTable.id, id));
  }

  async createGroupBatch(data: NewGroupBatch): Promise<GroupBatch> {
    const [groupBatch] = await db.insert(groupBatchTable).values(data).returning();
    return groupBatch;
  }

  async getGroupBatches(): Promise<GroupBatch[]> {
    return await db.select().from(groupBatchTable).where(eq(groupBatchTable.deletedAt, null)).orderBy(desc(groupBatchTable.createdAt));
  }

  async getGroupBatchById(id: number): Promise<GroupBatch | null> {
    const [groupBatch] = await db.select().from(groupBatchTable).where(and(eq(groupBatchTable.id, id), eq(groupBatchTable.deletedAt, null)));
    return groupBatch || null;
  }

  async updateGroupBatch(id: number, data: Partial<NewGroupBatch>): Promise<GroupBatch | null> {
    const [groupBatch] = await db.update(groupBatchTable).set({ ...data, updatedAt: new Date() }).where(eq(groupBatchTable.id, id)).returning();
    return groupBatch || null;
  }

  async deleteGroupBatch(id: number): Promise<void> {
    await db.update(groupBatchTable).set({ deletedAt: new Date() }).where(eq(groupBatchTable.id, id));
  }

  // =====================================================================================
  // FINANCIAL MODULE STORAGE METHODS
  // =====================================================================================

  // Account Types
  async createAccountType(data: InsertAccountType): Promise<SelectAccountType> {
    const [accountType] = await db.insert(accountTypesTable).values(data).returning();
    return accountType;
  }

  async getAccountTypes(): Promise<SelectAccountType[]> {
    return await db.select().from(accountTypesTable).where(eq(accountTypesTable.active, true)).orderBy(accountTypesTable.typeName);
  }

  async getAccountTypeById(id: number): Promise<SelectAccountType | null> {
    const [accountType] = await db.select().from(accountTypesTable).where(eq(accountTypesTable.id, id));
    return accountType || null;
  }

  async updateAccountType(id: number, data: Partial<InsertAccountType>): Promise<SelectAccountType | null> {
    const [accountType] = await db.update(accountTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(accountTypesTable.id, id)).returning();
    return accountType || null;
  }

  async deleteAccountType(id: number): Promise<void> {
    await db.update(accountTypesTable).set({ active: false }).where(eq(accountTypesTable.id, id));
  }

  // Accounts (Chart of Accounts)
  async createAccount(data: InsertAccount): Promise<SelectAccount> {
    const [account] = await db.insert(accountsTable).values(data).returning();
    return account;
  }

  async getAccounts(): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(eq(accountsTable.active, true)).orderBy(accountsTable.accountCode);
  }

  async getAccountById(id: number): Promise<SelectAccount | null> {
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.id, id));
    return account || null;
  }

  async getAccountsByType(accountTypeId: number): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(and(eq(accountsTable.accountTypeId, accountTypeId), eq(accountsTable.active, true))).orderBy(accountsTable.accountCode);
  }

  async getAccountHierarchy(): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(eq(accountsTable.active, true)).orderBy(accountsTable.level, accountsTable.accountCode);
  }

  async updateAccount(id: number, data: Partial<InsertAccount>): Promise<SelectAccount | null> {
    const [account] = await db.update(accountsTable).set({ ...data, updatedAt: new Date() }).where(eq(accountsTable.id, id)).returning();
    return account || null;
  }

  async deleteAccount(id: number): Promise<void> {
    await db.update(accountsTable).set({ active: false }).where(eq(accountsTable.id, id));
  }

  // Cost Centers
  async createCostCenter(data: InsertCostCenter): Promise<SelectCostCenter> {
    const [costCenter] = await db.insert(costCentersTable).values(data).returning();
    return costCenter;
  }

  async getCostCenters(): Promise<SelectCostCenter[]> {
    return await db.select().from(costCentersTable).where(eq(costCentersTable.active, true)).orderBy(costCentersTable.costCenterCode);
  }

  async getCostCenterById(id: number): Promise<SelectCostCenter | null> {
    const [costCenter] = await db.select().from(costCentersTable).where(eq(costCentersTable.id, id));
    return costCenter || null;
  }

  async getCostCenterHierarchy(): Promise<SelectCostCenter[]> {
    return await db.select().from(costCentersTable).where(eq(costCentersTable.active, true)).orderBy(costCentersTable.level, costCentersTable.costCenterCode);
  }

  async updateCostCenter(id: number, data: Partial<InsertCostCenter>): Promise<SelectCostCenter | null> {
    const [costCenter] = await db.update(costCentersTable).set({ ...data, updatedAt: new Date() }).where(eq(costCentersTable.id, id)).returning();
    return costCenter || null;
  }

  async deleteCostCenter(id: number): Promise<void> {
    await db.update(costCentersTable).set({ active: false }).where(eq(costCentersTable.id, id));
  }

  // Departments
  async createDepartment(data: InsertDepartment): Promise<SelectDepartment> {
    const [department] = await db.insert(departmentsTable).values(data).returning();
    return department;
  }

  async getDepartments(): Promise<SelectDepartment[]> {
    return await db.select().from(departmentsTable).where(eq(departmentsTable.active, true)).orderBy(departmentsTable.departmentCode);
  }

  async getDepartmentById(id: number): Promise<SelectDepartment | null> {
    const [department] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, id));
    return department || null;
  }

  async updateDepartment(id: number, data: Partial<InsertDepartment>): Promise<SelectDepartment | null> {
    const [department] = await db.update(departmentsTable).set({ ...data, updatedAt: new Date() }).where(eq(departmentsTable.id, id)).returning();
    return department || null;
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.update(departmentsTable).set({ active: false }).where(eq(departmentsTable.id, id));
  }

  // Projects
  async createProject(data: InsertProject): Promise<SelectProject> {
    const [project] = await db.insert(projectsTable).values(data).returning();
    return project;
  }

  async getProjects(): Promise<SelectProject[]> {
    return await db.select().from(projectsTable).where(eq(projectsTable.active, true)).orderBy(projectsTable.projectCode);
  }

  async getProjectById(id: number): Promise<SelectProject | null> {
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    return project || null;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<SelectProject | null> {
    const [project] = await db.update(projectsTable).set({ ...data, updatedAt: new Date() }).where(eq(projectsTable.id, id)).returning();
    return project || null;
  }

  async deleteProject(id: number): Promise<void> {
    await db.update(projectsTable).set({ active: false }).where(eq(projectsTable.id, id));
  }

  // Fiscal Years
  async createFiscalYear(data: InsertFiscalYear): Promise<SelectFiscalYear> {
    const [fiscalYear] = await db.insert(fiscalYearsTable).values(data).returning();
    return fiscalYear;
  }

  async getFiscalYears(): Promise<SelectFiscalYear[]> {
    return await db.select().from(fiscalYearsTable).orderBy(desc(fiscalYearsTable.startDate));
  }

  async getFiscalYearById(id: number): Promise<SelectFiscalYear | null> {
    const [fiscalYear] = await db.select().from(fiscalYearsTable).where(eq(fiscalYearsTable.id, id));
    return fiscalYear || null;
  }

  async updateFiscalYear(id: number, data: Partial<InsertFiscalYear>): Promise<SelectFiscalYear | null> {
    const [fiscalYear] = await db.update(fiscalYearsTable).set({ ...data, updatedAt: new Date() }).where(eq(fiscalYearsTable.id, id)).returning();
    return fiscalYear || null;
  }

  async deleteFiscalYear(id: number): Promise<void> {
    await db.delete(fiscalYearsTable).where(eq(fiscalYearsTable.id, id));
  }

  // Fiscal Periods
  async createFiscalPeriod(data: InsertFiscalPeriod): Promise<SelectFiscalPeriod> {
    const [fiscalPeriod] = await db.insert(fiscalPeriodsTable).values(data).returning();
    return fiscalPeriod;
  }

  async getFiscalPeriods(): Promise<SelectFiscalPeriod[]> {
    return await db.select().from(fiscalPeriodsTable).orderBy(fiscalPeriodsTable.startDate);
  }

  async getFiscalPeriodById(id: number): Promise<SelectFiscalPeriod | null> {
    const [fiscalPeriod] = await db.select().from(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.id, id));
    return fiscalPeriod || null;
  }

  async getFiscalPeriodsByYear(fiscalYearId: number): Promise<SelectFiscalPeriod[]> {
    return await db.select().from(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.fiscalYearId, fiscalYearId)).orderBy(fiscalPeriodsTable.periodNumber);
  }

  async updateFiscalPeriod(id: number, data: Partial<InsertFiscalPeriod>): Promise<SelectFiscalPeriod | null> {
    const [fiscalPeriod] = await db.update(fiscalPeriodsTable).set({ ...data, updatedAt: new Date() }).where(eq(fiscalPeriodsTable.id, id)).returning();
    return fiscalPeriod || null;
  }

  async deleteFiscalPeriod(id: number): Promise<void> {
    await db.delete(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.id, id));
  }

  // Contract Number Registry - Enhanced contract numbering system
  async createContractNumberRegistry(data: InsertContractNumberRegistry): Promise<ContractNumberRegistry> {
    const [registry] = await db.insert(contractNumberRegistryTable).values(data).returning();
    return registry;
  }

  async getContractNumberRegistries(): Promise<ContractNumberRegistry[]> {
    return await db.select().from(contractNumberRegistryTable).where(isNull(contractNumberRegistryTable.deletedAt)).orderBy(contractNumberRegistryTable.contractNumber);
  }

  async getContractNumberRegistryById(id: number): Promise<ContractNumberRegistry | null> {
    const [registry] = await db.select().from(contractNumberRegistryTable).where(and(eq(contractNumberRegistryTable.id, id), isNull(contractNumberRegistryTable.deletedAt)));
    return registry || null;
  }

  async getAvailableContractNumbers(groupBatchId: number): Promise<ContractNumberRegistry[]> {
    return await db.select().from(contractNumberRegistryTable).where(
      and(
        eq(contractNumberRegistryTable.groupBatchId, groupBatchId),
        eq(contractNumberRegistryTable.status, "available"),
        isNull(contractNumberRegistryTable.deletedAt)
      )
    ).orderBy(contractNumberRegistryTable.contractNumber);
  }

  async getContractNumberByNumber(contractNumber: string): Promise<ContractNumberRegistry | null> {
    const [registry] = await db.select().from(contractNumberRegistryTable).where(
      and(
        eq(contractNumberRegistryTable.contractNumber, contractNumber),
        isNull(contractNumberRegistryTable.deletedAt)
      )
    );
    return registry || null;
  }

  async assignContractNumber(contractNumber: string, contractId: number): Promise<ContractNumberRegistry | null> {
    const [registry] = await db.update(contractNumberRegistryTable)
      .set({ 
        currentContractId: contractId, 
        status: "assigned",
        updatedAt: new Date() 
      })
      .where(eq(contractNumberRegistryTable.contractNumber, contractNumber))
      .returning();
    return registry || null;
  }

  async releaseContractNumber(contractNumber: string): Promise<ContractNumberRegistry | null> {
    const [registry] = await db.update(contractNumberRegistryTable)
      .set({ 
        currentContractId: null, 
        status: "available",
        updatedAt: new Date() 
      })
      .where(eq(contractNumberRegistryTable.contractNumber, contractNumber))
      .returning();
    return registry || null;
  }

  async updateContractNumberRegistry(id: number, data: Partial<InsertContractNumberRegistry>): Promise<ContractNumberRegistry | null> {
    const [registry] = await db.update(contractNumberRegistryTable).set({ ...data, updatedAt: new Date() }).where(eq(contractNumberRegistryTable.id, id)).returning();
    return registry || null;
  }

  async deleteContractNumberRegistry(id: number): Promise<void> {
    await db.update(contractNumberRegistryTable).set({ deletedAt: new Date() }).where(eq(contractNumberRegistryTable.id, id));
  }

  // Contract Status History - Historical tracking
  async createContractStatusHistory(data: InsertContractStatusHistory): Promise<ContractStatusHistory> {
    const [history] = await db.insert(contractStatusHistoryTable).values(data).returning();
    return history;
  }

  async getContractStatusHistories(): Promise<ContractStatusHistory[]> {
    return await db.select().from(contractStatusHistoryTable).where(isNull(contractStatusHistoryTable.deletedAt)).orderBy(desc(contractStatusHistoryTable.effectiveDate));
  }

  async getContractStatusHistoryById(id: number): Promise<ContractStatusHistory | null> {
    const [history] = await db.select().from(contractStatusHistoryTable).where(and(eq(contractStatusHistoryTable.id, id), isNull(contractStatusHistoryTable.deletedAt)));
    return history || null;
  }

  async getContractStatusHistoryByContract(contractId: number): Promise<ContractStatusHistory[]> {
    return await db.select().from(contractStatusHistoryTable).where(
      and(
        eq(contractStatusHistoryTable.contractId, contractId),
        isNull(contractStatusHistoryTable.deletedAt)
      )
    ).orderBy(desc(contractStatusHistoryTable.effectiveDate));
  }

  async updateContractStatusHistory(id: number, data: Partial<InsertContractStatusHistory>): Promise<ContractStatusHistory | null> {
    const [history] = await db.update(contractStatusHistoryTable).set({ ...data, updatedAt: new Date() }).where(eq(contractStatusHistoryTable.id, id)).returning();
    return history || null;
  }

  async deleteContractStatusHistory(id: number): Promise<void> {
    await db.update(contractStatusHistoryTable).set({ deletedAt: new Date() }).where(eq(contractStatusHistoryTable.id, id));
  }

  // Contract numbering business logic
  async getNextAvailableContractNumber(groupBatchId: number): Promise<string | null> {
    const availableNumbers = await this.getAvailableContractNumbers(groupBatchId);
    return availableNumbers.length > 0 ? availableNumbers[0].contractNumber : null;
  }

  async initializeGroupContractNumbers(groupBatchId: number, startNumber: number = 1, endNumber: number = 500): Promise<void> {
    const registries: InsertContractNumberRegistry[] = [];
    
    for (let i = startNumber; i <= endNumber; i++) {
      const contractNumber = i.toString().padStart(6, '0'); // Format: 000001, 000002, etc.
      registries.push({
        groupBatchId,
        contractNumber,
        status: "available"
      });
    }
    
    await db.insert(contractNumberRegistryTable).values(registries);
  }

  async changeContractStatus(contractId: number, newStatus: string, reason: string, reasonDescription?: string): Promise<void> {
    // Get current contract info
    const contract = await this.getContractById(contractId);
    if (!contract) throw new Error("Contract not found");

    const oldStatus = contract.currentStatus;
    const oldContractNumber = contract.contractNumber;

    // Create status history record
    await this.createContractStatusHistory({
      contractId,
      oldStatus,
      newStatus,
      oldContractNumber,
      newContractNumber: contract.contractNumber,
      oldGroupBatchId: contract.groupBatchId,
      newGroupBatchId: contract.groupBatchId,
      reason,
      reasonDescription,
      effectiveDate: new Date()
    });

    // Update contract status
    await this.updateContract(contractId, { currentStatus: newStatus });

    // Handle contract number based on status change
    if (newStatus === "canceled" || newStatus === "redeemed") {
      // Release the contract number for reuse
      await this.releaseContractNumber(contract.contractNumber);
    }
  }

  // ============================================================================
  // ATTENDANCE/SERVICE MANAGEMENT - Payment Receipt, Carteirinha, Medical Forward
  // ============================================================================

  // Payment Receipt Methods
  async getPaymentReceipts(): Promise<PaymentReceipt[]> {
    return await db.select().from(paymentReceiptTable)
      .where(isNull(paymentReceiptTable.deletedAt))
      .orderBy(desc(paymentReceiptTable.createdAt));
  }

  async createPaymentReceipt(data: InsertPaymentReceipt): Promise<PaymentReceipt> {
    const [paymentReceipt] = await db.insert(paymentReceiptTable).values(data).returning();
    return paymentReceipt;
  }

  async getPaymentReceiptById(id: number): Promise<PaymentReceipt | null> {
    const [paymentReceipt] = await db.select().from(paymentReceiptTable).where(
      and(
        eq(paymentReceiptTable.id, id),
        isNull(paymentReceiptTable.deletedAt)
      )
    );
    return paymentReceipt || null;
  }

  async updatePaymentReceipt(id: number, data: Partial<InsertPaymentReceipt>): Promise<PaymentReceipt | null> {
    const [paymentReceipt] = await db.update(paymentReceiptTable).set({ ...data, updatedAt: new Date() }).where(eq(paymentReceiptTable.id, id)).returning();
    return paymentReceipt || null;
  }

  async deletePaymentReceipt(id: number): Promise<void> {
    await db.update(paymentReceiptTable).set({ deletedAt: new Date() }).where(eq(paymentReceiptTable.id, id));
  }

  // Carteirinha (Member Card) Methods
  async getCarteirinhas(): Promise<Carteirinha[]> {
    return await db.select().from(carteirinhaTable)
      .where(isNull(carteirinhaTable.deletedAt))
      .orderBy(desc(carteirinhaTable.createdAt));
  }

  async createCarteirinha(data: InsertCarteirinha): Promise<Carteirinha> {
    const [carteirinha] = await db.insert(carteirinhaTable).values(data).returning();
    return carteirinha;
  }

  async getCarteirinhaById(id: number): Promise<Carteirinha | null> {
    const [carteirinha] = await db.select().from(carteirinhaTable).where(
      and(
        eq(carteirinhaTable.id, id),
        isNull(carteirinhaTable.deletedAt)
      )
    );
    return carteirinha || null;
  }

  async updateCarteirinha(id: number, data: Partial<InsertCarteirinha>): Promise<Carteirinha | null> {
    const [carteirinha] = await db.update(carteirinhaTable).set({ ...data, updatedAt: new Date() }).where(eq(carteirinhaTable.id, id)).returning();
    return carteirinha || null;
  }

  async deleteCarteirinha(id: number): Promise<void> {
    await db.update(carteirinhaTable).set({ deletedAt: new Date() }).where(eq(carteirinhaTable.id, id));
  }

  // Medical Forward Methods
  async getMedicalForwards(): Promise<MedicalForward[]> {
    return await db.select().from(medicalForwardTable)
      .where(isNull(medicalForwardTable.deletedAt))
      .orderBy(desc(medicalForwardTable.createdAt));
  }

  async createMedicalForward(data: InsertMedicalForward): Promise<MedicalForward> {
    const [medicalForward] = await db.insert(medicalForwardTable).values(data).returning();
    return medicalForward;
  }

  async getMedicalForwardById(id: number): Promise<MedicalForward | null> {
    const [medicalForward] = await db.select().from(medicalForwardTable).where(
      and(
        eq(medicalForwardTable.id, id),
        isNull(medicalForwardTable.deletedAt)
      )
    );
    return medicalForward || null;
  }

  async updateMedicalForward(id: number, data: Partial<InsertMedicalForward>): Promise<MedicalForward | null> {
    const [medicalForward] = await db.update(medicalForwardTable).set({ ...data, updatedAt: new Date() }).where(eq(medicalForwardTable.id, id)).returning();
    return medicalForward || null;
  }

  async deleteMedicalForward(id: number): Promise<void> {
    await db.update(medicalForwardTable).set({ deletedAt: new Date() }).where(eq(medicalForwardTable.id, id));
  }
}

export const storage = new DrizzleStorage();