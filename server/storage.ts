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
  clientsTable,
  contractsTable,
  beneficiariesTable,
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
  // Financial Tables
  accountTypesTable,
  accountsTable,
  costCentersTable,
  departmentsTable,
  projectsTable,
  fiscalYearsTable,
  fiscalPeriodsTable,
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
  type NewClient,
  type Client,
  type NewContract,
  type Contract,
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
  // Financial Types
  type InsertAccountType,
  type SelectAccountType,
  type InsertAccount,
  type SelectAccount,
  type InsertCostCenter,
  type SelectCostCenter,
  type InsertDepartment,
  type SelectDepartment,
  type InsertProject,
  type SelectProject,
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

  // Clients
  createClient(data: NewClient): Promise<Client>;
  getClients(): Promise<Client[]>;
  getClientById(id: number): Promise<Client | null>;
  updateClient(id: number, data: Partial<NewClient>): Promise<Client | null>;
  deleteClient(id: number): Promise<void>;

  // Contracts
  createContract(data: NewContract): Promise<Contract>;
  createContractWithUser(contractData: NewContract, userData?: { email: string; password: string; name: string }): Promise<{ contract: Contract; user?: SysUser }>;
  getContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | null>;
  updateContract(id: number, data: Partial<NewContract>): Promise<Contract | null>;
  deleteContract(id: number): Promise<void>;

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
    const [result] = await db.insert(sysUsersTable).values(data);
    const [user] = await db.select().from(sysUsersTable).where(eq(sysUsersTable.sysUserId, result.insertId));
    return user;
  }

  async getSysUsers(): Promise<SysUser[]> {
    return await db.select().from(sysUsersTable).where(isNull(sysUsersTable.deletedAt)).orderBy(desc(sysUsersTable.createdAt));
  }

  async getSysUserById(id: number): Promise<SysUser | null> {
    const [user] = await db.select().from(sysUsersTable).where(and(eq(sysUsersTable.sysUserId, id), isNull(sysUsersTable.deletedAt)));
    return user || null;
  }

  async updateSysUser(id: number, data: Partial<NewSysUser>): Promise<SysUser | null> {
    await db.update(sysUsersTable).set({ ...data, updatedAt: new Date() }).where(eq(sysUsersTable.sysUserId, id));
    const [user] = await db.select().from(sysUsersTable).where(eq(sysUsersTable.sysUserId, id));
    return user || null;
  }

  async deleteSysUser(id: number): Promise<void> {
    await db.update(sysUsersTable).set({ deletedAt: new Date() }).where(eq(sysUsersTable.sysUserId, id));
  }

  // Address Types
  async createAddressType(data: NewAddressType): Promise<AddressType> {
    const [result] = await db.insert(addressTypesTable).values(data);
    const [addressType] = await db.select().from(addressTypesTable).where(eq(addressTypesTable.addressTypeId, result.insertId));
    return addressType;
  }

  async getAddressTypes(): Promise<AddressType[]> {
    return await db.select().from(addressTypesTable).where(isNull(addressTypesTable.deletedAt)).orderBy(desc(addressTypesTable.createdAt));
  }

  async getAddressTypeById(id: number): Promise<AddressType | null> {
    const [addressType] = await db.select().from(addressTypesTable).where(and(eq(addressTypesTable.addressTypeId, id), isNull(addressTypesTable.deletedAt)));
    return addressType || null;
  }

  async updateAddressType(id: number, data: Partial<NewAddressType>): Promise<AddressType | null> {
    await db.update(addressTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(addressTypesTable.addressTypeId, id));
    const [addressType] = await db.select().from(addressTypesTable).where(eq(addressTypesTable.addressTypeId, id));
    return addressType || null;
  }

  async deleteAddressType(id: number): Promise<void> {
    await db.update(addressTypesTable).set({ deletedAt: new Date() }).where(eq(addressTypesTable.addressTypeId, id));
  }

  // Addresses
  async createAddress(data: NewAddress): Promise<Address> {
    const [result] = await db.insert(addressesTable).values(data);
    const [address] = await db.select().from(addressesTable).where(eq(addressesTable.addressId, result.insertId));
    return address;
  }

  async getAddresses(): Promise<Address[]> {
    return await db.select().from(addressesTable).where(isNull(addressesTable.deletedAt)).orderBy(desc(addressesTable.createdAt));
  }

  async getAddressById(id: number): Promise<Address | null> {
    const [address] = await db.select().from(addressesTable).where(and(eq(addressesTable.addressId, id), isNull(addressesTable.deletedAt)));
    return address || null;
  }

  async updateAddress(id: number, data: Partial<NewAddress>): Promise<Address | null> {
    await db.update(addressesTable).set({ ...data, updatedAt: new Date() }).where(eq(addressesTable.addressId, id));
    const [address] = await db.select().from(addressesTable).where(eq(addressesTable.addressId, id));
    return address || null;
  }

  async deleteAddress(id: number): Promise<void> {
    await db.update(addressesTable).set({ deletedAt: new Date() }).where(eq(addressesTable.addressId, id));
  }

  // Entity Addresses
  async createEntityAddress(data: NewEntityAddress): Promise<EntityAddress> {
    const [result] = await db.insert(entityAddressesTable).values(data);
    const [entityAddress] = await db.select().from(entityAddressesTable).where(eq(entityAddressesTable.entityAddressId, result.insertId));
    return entityAddress;
  }

  async getEntityAddresses(): Promise<EntityAddress[]> {
    return await db.select().from(entityAddressesTable).orderBy(desc(entityAddressesTable.entityAddressId));
  }

  async getEntityAddressesByEntity(entityType: string, entityId: number): Promise<EntityAddress[]> {
    return await db.select().from(entityAddressesTable)
      .where(and(eq(entityAddressesTable.entityType, entityType as 'client' | 'partner' | 'contract'), eq(entityAddressesTable.entityId, entityId)));
  }

  async updateEntityAddress(id: number, data: Partial<NewEntityAddress>): Promise<EntityAddress | null> {
    await db.update(entityAddressesTable).set(data).where(eq(entityAddressesTable.entityAddressId, id));
    const [entityAddress] = await db.select().from(entityAddressesTable).where(eq(entityAddressesTable.entityAddressId, id));
    return entityAddress || null;
  }

  async deleteEntityAddress(id: number): Promise<void> {
    await db.delete(entityAddressesTable).where(eq(entityAddressesTable.entityAddressId, id));
  }

  // Partner Types
  async createPartnerType(data: NewPartnerType): Promise<PartnerType> {
    const [result] = await db.insert(partnerTypesTable).values(data);
    const [partnerType] = await db.select().from(partnerTypesTable).where(eq(partnerTypesTable.partnerTypeId, result.insertId));
    return partnerType;
  }

  async getPartnerTypes(): Promise<PartnerType[]> {
    return await db.select().from(partnerTypesTable).where(isNull(partnerTypesTable.deletedAt)).orderBy(desc(partnerTypesTable.createdAt));
  }

  async getPartnerTypeById(id: number): Promise<PartnerType | null> {
    const [partnerType] = await db.select().from(partnerTypesTable).where(eq(partnerTypesTable.partnerTypeId, id));
    return partnerType || null;
  }

  async updatePartnerType(id: number, data: Partial<NewPartnerType>): Promise<PartnerType | null> {
    await db.update(partnerTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(partnerTypesTable.partnerTypeId, id));
    const [partnerType] = await db.select().from(partnerTypesTable).where(eq(partnerTypesTable.partnerTypeId, id));
    return partnerType || null;
  }

  async deletePartnerType(id: number): Promise<void> {
    await db.delete(partnerTypesTable).where(eq(partnerTypesTable.partnerTypeId, id));
  }

  // Partners
  async createPartner(data: NewPartner): Promise<Partner> {
    const [result] = await db.insert(partnersTable).values(data);
    const [partner] = await db.select().from(partnersTable).where(eq(partnersTable.partnerId, result.insertId));
    return partner;
  }

async getPartners(): Promise<Partner[]> {
    const results = await db.select({
      partner: partnersTable,
      partnerType: partnerTypesTable,
      sysUser: sysUsersTable
    })
    .from(partnersTable)
    .leftJoin(partnerTypesTable, eq(partnersTable.partnerTypeId, partnerTypesTable.partnerTypeId))
    .leftJoin(sysUsersTable, eq(partnersTable.sysUserId, sysUsersTable.sysUserId))
    .where(isNull(partnersTable.deletedAt))
    .orderBy(desc(partnersTable.createdAt));

    return results.map(r => ({
      ...r.partner,
      partnerType: r.partnerType,
      sysUser: r.sysUser
    })) as Partner[];
  }

  async getPartnerById(id: number): Promise<Partner | null> {
    const [result] = await db.select({
      partner: partnersTable,
      partnerType: partnerTypesTable,
      sysUser: sysUsersTable
    })
    .from(partnersTable)
    .leftJoin(partnerTypesTable, eq(partnersTable.partnerTypeId, partnerTypesTable.partnerTypeId))
    .leftJoin(sysUsersTable, eq(partnersTable.sysUserId, sysUsersTable.sysUserId))
    .where(eq(partnersTable.partnerId, id));

    if (!result) return null;

    return {
      ...result.partner,
      partnerType: result.partnerType,
      sysUser: result.sysUser
    } as any;
  }

  async updatePartner(id: number, data: Partial<NewPartner>): Promise<Partner | null> {
    await db.update(partnersTable).set({ ...data, updatedAt: new Date() }).where(eq(partnersTable.partnerId, id));
    const [partner] = await db.select().from(partnersTable).where(eq(partnersTable.partnerId, id));
    return partner || null;
  }

  async deletePartner(id: number): Promise<void> {
    await db.update(partnersTable).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(partnersTable.partnerId, id));
  }

  // Document Types
  async createDocumentType(data: NewDocumentType): Promise<DocumentType> {
    const [result] = await db.insert(documentTypesTable).values(data);
    const [documentType] = await db.select().from(documentTypesTable).where(eq(documentTypesTable.documentTypeId, result.insertId));
    return documentType;
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    return await db.select().from(documentTypesTable).where(isNull(documentTypesTable.deletedAt)).orderBy(desc(documentTypesTable.createdAt));
  }

  async getDocumentTypeById(id: number): Promise<DocumentType | null> {
    const [documentType] = await db.select().from(documentTypesTable).where(and(eq(documentTypesTable.documentTypeId, id), isNull(documentTypesTable.deletedAt)));
    return documentType || null;
  }

  async updateDocumentType(id: number, data: Partial<NewDocumentType>): Promise<DocumentType | null> {
    await db.update(documentTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(documentTypesTable.documentTypeId, id));
    const [documentType] = await db.select().from(documentTypesTable).where(eq(documentTypesTable.documentTypeId, id));
    return documentType || null;
  }

  async deleteDocumentType(id: number): Promise<void> {
    await db.update(documentTypesTable).set({ deletedAt: new Date() }).where(eq(documentTypesTable.documentTypeId, id));
  }

  // Documents
  async createDocument(data: NewDocument): Promise<Document> {
    const [result] = await db.insert(documentsTable).values(data);
    const [document] = await db.select().from(documentsTable).where(eq(documentsTable.documentId, result.insertId));
    return document;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documentsTable).where(isNull(documentsTable.deletedAt)).orderBy(desc(documentsTable.createdAt));
  }

  async getDocumentById(id: number): Promise<Document | null> {
    const [document] = await db.select().from(documentsTable).where(and(eq(documentsTable.documentId, id), isNull(documentsTable.deletedAt)));
    return document || null;
  }

  async updateDocument(id: number, data: Partial<NewDocument>): Promise<Document | null> {
    await db.update(documentsTable).set({ ...data, updatedAt: new Date() }).where(eq(documentsTable.documentId, id));
    const [document] = await db.select().from(documentsTable).where(eq(documentsTable.documentId, id));
    return document || null;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.update(documentsTable).set({ deletedAt: new Date() }).where(eq(documentsTable.documentId, id));
  }

  // Entity Documents
  async createEntityDocument(data: NewEntityDocument): Promise<EntityDocument> {
    const [result] = await db.insert(entityDocumentsTable).values(data);
    const [entityDocument] = await db.select().from(entityDocumentsTable).where(eq(entityDocumentsTable.entityDocumentId, result.insertId));
    return entityDocument;
  }

  async getEntityDocuments(): Promise<EntityDocument[]> {
    return await db.select().from(entityDocumentsTable).orderBy(desc(entityDocumentsTable.entityDocumentId));
  }

  async getEntityDocumentsByEntity(entityType: string, entityId: number): Promise<EntityDocument[]> {
    return await db.select().from(entityDocumentsTable)
      .where(and(eq(entityDocumentsTable.entityType, entityType as 'client' | 'partner' | 'contract'), eq(entityDocumentsTable.entityId, entityId)));
  }

  async updateEntityDocument(id: number, data: Partial<NewEntityDocument>): Promise<EntityDocument | null> {
    await db.update(entityDocumentsTable).set(data).where(eq(entityDocumentsTable.entityDocumentId, id));
    const [entityDocument] = await db.select().from(entityDocumentsTable).where(eq(entityDocumentsTable.entityDocumentId, id));
    return entityDocument || null;
  }

  async deleteEntityDocument(id: number): Promise<void> {
    await db.delete(entityDocumentsTable).where(eq(entityDocumentsTable.entityDocumentId, id));
  }

  // Clients
  async createClient(data: NewClient): Promise<Client> {
    const [result] = await db.insert(clientsTable).values(data);
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.clientId, result.insertId));
    return client;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clientsTable).orderBy(desc(clientsTable.createdAt));
  }

  async getClientById(id: number): Promise<Client | null> {
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.clientId, id));
    return client || null;
  }

  async updateClient(id: number, data: Partial<NewClient>): Promise<Client | null> {
    await db.update(clientsTable).set({ ...data, updatedAt: new Date() }).where(eq(clientsTable.clientId, id));
    const [client] = await db.select().from(clientsTable).where(eq(clientsTable.clientId, id));
    return client || null;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clientsTable).where(eq(clientsTable.clientId, id));
  }

  // Contracts
  async createContract(data: NewContract): Promise<Contract> {
    const [result] = await db.insert(contractsTable).values(data);
    const [contract] = await db.select().from(contractsTable).where(eq(contractsTable.contractId, result.insertId));
    return contract;
  }

  async createContractWithUser(contractData: NewContract, userData?: { email: string; password: string; name: string }): Promise<{ contract: Contract; user?: SysUser }> {
    // First create the contract
    const [result] = await db.insert(contractsTable).values(contractData);
    const [contract] = await db.select().from(contractsTable).where(eq(contractsTable.contractId, result.insertId));
    
    let user: SysUser | undefined;
    
    // If user data is provided, create a sys_user account
    if (userData && userData.email && userData.password && userData.name) {
      const sysUserData: NewSysUser = {
        login: userData.email,
        email: userData.email,
        passwordHash: userData.password, // In production, this should be hashed
        name: userData.name,


        sysUnitId: contract.sysUnitId,
         // Default company ID
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      try {
        user = await this.createSysUser(sysUserData);
        
        // Update the contract to link it to the created user
        await db.update(contractsTable)
          .set({ sysUserId: user.sysUserId, updatedAt: new Date() })
          .where(eq(contractsTable.contractId, contract.contractId));
          
        // Re-fetch the updated contract
        const [updatedContract] = await db.select().from(contractsTable).where(eq(contractsTable.contractId, contract.contractId));
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
    const [contract] = await db.select().from(contractsTable).where(and(eq(contractsTable.contractId, id), isNull(contractsTable.deletedAt)));
    return contract || null;
  }

  async updateContract(id: number, data: Partial<NewContract>): Promise<Contract | null> {
    await db.update(contractsTable).set({ ...data, updatedAt: new Date() }).where(eq(contractsTable.contractId, id));
    const [contract] = await db.select().from(contractsTable).where(eq(contractsTable.contractId, id));
    return contract || null;
  }

  async deleteContract(id: number): Promise<void> {
    await db.update(contractsTable).set({ deletedAt: new Date() }).where(eq(contractsTable.contractId, id));
  }

  // Beneficiaries
  async createBeneficiary(data: NewBeneficiary): Promise<Beneficiary> {
    const [result] = await db.insert(beneficiariesTable).values(data);
    const [beneficiary] = await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.beneficiaryId, result.insertId));
    return beneficiary;
  }

  async getBeneficiaries(): Promise<Beneficiary[]> {
    return await db.select().from(beneficiariesTable).orderBy(desc(beneficiariesTable.createdAt));
  }

  async getBeneficiaryById(id: number): Promise<Beneficiary | null> {
    const [beneficiary] = await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.beneficiaryId, id));
    return beneficiary || null;
  }

  async getBeneficiariesByContract(contractId: number): Promise<Beneficiary[]> {
    return await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.contractVersionId, contractId));
  }

  async updateBeneficiary(id: number, data: Partial<NewBeneficiary>): Promise<Beneficiary | null> {
    await db.update(beneficiariesTable).set({ ...data, updatedAt: new Date() }).where(eq(beneficiariesTable.beneficiaryId, id));
    const [beneficiary] = await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.beneficiaryId, id));
    return beneficiary || null;
  }

  async deleteBeneficiary(id: number): Promise<void> {
    await db.delete(beneficiariesTable).where(eq(beneficiariesTable.beneficiaryId, id));
  }

  // Charges
  async createCharge(data: NewCharge): Promise<Charge> {
    const [result] = await db.insert(contractChargesTable).values(data);
    const [charge] = await db.select().from(contractChargesTable).where(eq(contractChargesTable.contractChargeId, result.insertId));
    return charge;
  }

  async getCharges(): Promise<Charge[]> {
    return await db.select().from(contractChargesTable).orderBy(desc(contractChargesTable.createdAt));
  }

  async getChargeById(id: number): Promise<Charge | null> {
    const [charge] = await db.select().from(contractChargesTable).where(eq(contractChargesTable.contractChargeId, id));
    return charge || null;
  }

  async getChargesByContract(contractId: number): Promise<Charge[]> {
    return await db.select().from(contractChargesTable).where(eq(contractChargesTable.contractVersionId, contractId));
  }

  async updateCharge(id: number, data: Partial<NewCharge>): Promise<Charge | null> {
    await db.update(contractChargesTable).set({ ...data, updatedAt: new Date() }).where(eq(contractChargesTable.contractChargeId, id));
    const [charge] = await db.select().from(contractChargesTable).where(eq(contractChargesTable.contractChargeId, id));
    return charge || null;
  }

  async deleteCharge(id: number): Promise<void> {
    await db.delete(contractChargesTable).where(eq(contractChargesTable.contractChargeId, id));
  }

  // Contract Charges Implementation
  async createContractCharge(data: InsertContractCharge): Promise<ContractCharge> {
    const [result] = await db.insert(contractChargesTable).values(data);
    const [contractCharge] = await db.select().from(contractChargesTable).where(eq(contractChargesTable.contractChargeId, result.insertId));
    return contractCharge;
  }

  async getContractCharges(): Promise<ContractCharge[]> {
    return await db.select().from(contractChargesTable).where(isNull(contractChargesTable.deletedAt)).orderBy(desc(contractChargesTable.createdAt));
  }

  async getContractChargeById(id: number): Promise<ContractCharge | null> {
    const [contractCharge] = await db.select().from(contractChargesTable).where(and(eq(contractChargesTable.contractChargeId, id), isNull(contractChargesTable.deletedAt)));
    return contractCharge || null;
  }

  async getContractChargesByContract(contractId: number): Promise<ContractCharge[]> {
    return await db.select().from(contractChargesTable).where(and(eq(contractChargesTable.contractVersionId, contractId), isNull(contractChargesTable.deletedAt))).orderBy(desc(contractChargesTable.dueDate));
  }

  async updateContractCharge(id: number, data: Partial<InsertContractCharge>): Promise<ContractCharge | null> {
    await db.update(contractChargesTable).set({ ...data, updatedAt: new Date() }).where(eq(contractChargesTable.contractChargeId, id));
    const [contractCharge] = await db.select().from(contractChargesTable).where(eq(contractChargesTable.contractChargeId, id));
    return contractCharge || null;
  }

  async deleteContractCharge(id: number): Promise<void> {
    await db.update(contractChargesTable).set({ deletedAt: new Date() }).where(eq(contractChargesTable.contractChargeId, id));
  }

  // Addendums
  async createAddendum(data: NewAddendum): Promise<Addendum> {
    const [result] = await db.insert(addendumsTable).values(data);
    const [addendum] = await db.select().from(addendumsTable).where(eq(addendumsTable.addendumId, result.insertId));
    return addendum;
  }

  async getAddendums(): Promise<Addendum[]> {
    return await db.select().from(addendumsTable).orderBy(desc(addendumsTable.createdAt));
  }

  async getAddendumById(id: number): Promise<Addendum | null> {
    const [addendum] = await db.select().from(addendumsTable).where(eq(addendumsTable.addendumId, id));
    return addendum || null;
  }

  async getAddendumsByContract(contractId: number): Promise<Addendum[]> {
    return await db.select().from(addendumsTable).where(eq(addendumsTable.contractId, contractId));
  }

  async updateAddendum(id: number, data: Partial<NewAddendum>): Promise<Addendum | null> {
    await db.update(addendumsTable).set({ ...data, updatedAt: new Date() }).where(eq(addendumsTable.addendumId, id));
    const [addendum] = await db.select().from(addendumsTable).where(eq(addendumsTable.addendumId, id));
    return addendum || null;
  }

  async deleteAddendum(id: number): Promise<void> {
    await db.delete(addendumsTable).where(eq(addendumsTable.addendumId, id));
  }

  // Batch CHK
  async createBatchChk(data: NewBatchChk): Promise<BatchChk> {
    const [result] = await db.insert(batchChkTable).values(data);
    const [batchChk] = await db.select().from(batchChkTable).where(eq(batchChkTable.batchChkId, result.insertId));
    return batchChk;
  }

  async getBatchChks(): Promise<BatchChk[]> {
    return await db.select().from(batchChkTable).orderBy(desc(batchChkTable.createdAt));
  }

  async getBatchChkById(id: number): Promise<BatchChk | null> {
    const [batchChk] = await db.select().from(batchChkTable).where(eq(batchChkTable.batchChkId, id));
    return batchChk || null;
  }

  async updateBatchChk(id: number, data: Partial<NewBatchChk>): Promise<BatchChk | null> {
    await db.update(batchChkTable).set({ ...data, updatedAt: new Date() }).where(eq(batchChkTable.batchChkId, id));
    const [batchChk] = await db.select().from(batchChkTable).where(eq(batchChkTable.batchChkId, id));
    return batchChk || null;
  }

  async deleteBatchChk(id: number): Promise<void> {
    await db.delete(batchChkTable).where(eq(batchChkTable.batchChkId, id));
  }

  // Batch Detail
  async createBatchDetail(data: NewBatchDetail): Promise<BatchDetail> {
    const [result] = await db.insert(batchDetailTable).values(data);
    const [batchDetail] = await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchDetailId, result.insertId));
    return batchDetail;
  }

  async getBatchDetails(): Promise<BatchDetail[]> {
    return await db.select().from(batchDetailTable).orderBy(desc(batchDetailTable.createdAt));
  }

  async getBatchDetailById(id: number): Promise<BatchDetail | null> {
    const [batchDetail] = await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchDetailId, id));
    return batchDetail || null;
  }

  async getBatchDetailsByBatch(batchId: number): Promise<BatchDetail[]> {
    return await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchChkId, batchId));
  }

  async updateBatchDetail(id: number, data: Partial<NewBatchDetail>): Promise<BatchDetail | null> {
    await db.update(batchDetailTable).set({ ...data, updatedAt: new Date() }).where(eq(batchDetailTable.batchDetailId, id));
    const [batchDetail] = await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchDetailId, id));
    return batchDetail || null;
  }

  async deleteBatchDetail(id: number): Promise<void> {
    await db.delete(batchDetailTable).where(eq(batchDetailTable.batchDetailId, id));
  }

  // Core System Tables Implementation
  async createGender(data: NewGender): Promise<Gender> {
    const [result] = await db.insert(genderTable).values(data);
    const [gender] = await db.select().from(genderTable).where(eq(genderTable.genderId, result.insertId));
    return gender;
  }

  async getGenders(): Promise<Gender[]> {
    return await db.select().from(genderTable).where(isNull(genderTable.deletedAt)).orderBy(desc(genderTable.createdAt));
  }

  async getGenderById(id: number): Promise<Gender | null> {
    const [gender] = await db.select().from(genderTable).where(and(eq(genderTable.genderId, id), isNull(genderTable.deletedAt)));
    return gender || null;
  }

  async updateGender(id: number, data: Partial<NewGender>): Promise<Gender | null> {
    await db.update(genderTable).set({ ...data, updatedAt: new Date() }).where(eq(genderTable.genderId, id));
    const [gender] = await db.select().from(genderTable).where(eq(genderTable.genderId, id));
    return gender || null;
  }

  async deleteGender(id: number): Promise<void> {
    await db.update(genderTable).set({ deletedAt: new Date() }).where(eq(genderTable.genderId, id));
  }

  async createPaymentStatus(data: NewPaymentStatus): Promise<PaymentStatus> {
    const [result] = await db.insert(paymentStatusTable).values(data);
    const [paymentStatus] = await db.select().from(paymentStatusTable).where(eq(paymentStatusTable.paymentStatusId, result.insertId));
    return paymentStatus;
  }

  async getPaymentStatuses(): Promise<PaymentStatus[]> {
    return await db.select().from(paymentStatusTable).where(isNull(paymentStatusTable.deletedAt)).orderBy(desc(paymentStatusTable.createdAt));
  }

  async getPaymentStatusById(id: number): Promise<PaymentStatus | null> {
    const [paymentStatus] = await db.select().from(paymentStatusTable).where(and(eq(paymentStatusTable.paymentStatusId, id), isNull(paymentStatusTable.deletedAt)));
    return paymentStatus || null;
  }

  async updatePaymentStatus(id: number, data: Partial<NewPaymentStatus>): Promise<PaymentStatus | null> {
    await db.update(paymentStatusTable).set({ ...data, updatedAt: new Date() }).where(eq(paymentStatusTable.paymentStatusId, id));
    const [paymentStatus] = await db.select().from(paymentStatusTable).where(eq(paymentStatusTable.paymentStatusId, id));
    return paymentStatus || null;
  }

  async deletePaymentStatus(id: number): Promise<void> {
    await db.update(paymentStatusTable).set({ deletedAt: new Date() }).where(eq(paymentStatusTable.paymentStatusId, id));
  }

  async createEstado(data: NewEstado): Promise<Estado> {
    const [result] = await db.insert(estadoTable).values(data);
    const [estado] = await db.select().from(estadoTable).where(eq(estadoTable.stateId, result.insertId));
    return estado;
  }

  async getEstados(): Promise<Estado[]> {
    return await db.select().from(estadoTable).where(isNull(estadoTable.deletedAt)).orderBy(desc(estadoTable.createdAt));
  }

  async getEstadoById(id: number): Promise<Estado | null> {
    const [estado] = await db.select().from(estadoTable).where(and(eq(estadoTable.stateId, id), isNull(estadoTable.deletedAt)));
    return estado || null;
  }

  async updateEstado(id: number, data: Partial<NewEstado>): Promise<Estado | null> {
    await db.update(estadoTable).set({ ...data, updatedAt: new Date() }).where(eq(estadoTable.stateId, id));
    const [estado] = await db.select().from(estadoTable).where(eq(estadoTable.stateId, id));
    return estado || null;
  }

  async deleteEstado(id: number): Promise<void> {
    await db.update(estadoTable).set({ deletedAt: new Date() }).where(eq(estadoTable.stateId, id));
  }

  async createCidade(data: NewCidade): Promise<Cidade> {
    const [result] = await db.insert(cidadeTable).values(data);
    const [cidade] = await db.select().from(cidadeTable).where(eq(cidadeTable.cityId, result.insertId));
    return cidade;
  }

  async getCidades(): Promise<Cidade[]> {
    return await db.select().from(cidadeTable).where(isNull(cidadeTable.deletedAt)).orderBy(desc(cidadeTable.createdAt));
  }

  async getCidadeById(id: number): Promise<Cidade | null> {
    const [cidade] = await db.select().from(cidadeTable).where(and(eq(cidadeTable.cityId, id), isNull(cidadeTable.deletedAt)));
    return cidade || null;
  }

  async getCidadesByEstado(estadoId: number): Promise<Cidade[]> {
    return await db.select().from(cidadeTable).where(and(eq(cidadeTable.stateId, estadoId), isNull(cidadeTable.deletedAt)));
  }

  async updateCidade(id: number, data: Partial<NewCidade>): Promise<Cidade | null> {
    await db.update(cidadeTable).set({ ...data, updatedAt: new Date() }).where(eq(cidadeTable.cityId, id));
    const [cidade] = await db.select().from(cidadeTable).where(eq(cidadeTable.cityId, id));
    return cidade || null;
  }

  async deleteCidade(id: number): Promise<void> {
    await db.update(cidadeTable).set({ deletedAt: new Date() }).where(eq(cidadeTable.cityId, id));
  }

  async createCurrency(data: NewCurrency): Promise<Currency> {
    const [result] = await db.insert(currencyTable).values(data);
    const [currency] = await db.select().from(currencyTable).where(eq(currencyTable.currencyId, result.insertId));
    return currency;
  }

  async getCurrencies(): Promise<Currency[]> {
    return await db.select().from(currencyTable).where(isNull(currencyTable.deletedAt)).orderBy(desc(currencyTable.createdAt));
  }

  async getCurrencyByCode(code: string): Promise<Currency | null> {
    const [currency] = await db.select().from(currencyTable).where(and(eq(currencyTable.code, code), isNull(currencyTable.deletedAt)));
    return currency || null;
  }

  async updateCurrency(code: string, data: Partial<NewCurrency>): Promise<Currency | null> {
    await db.update(currencyTable).set({ ...data, updatedAt: new Date() }).where(eq(currencyTable.code, code));
    const [currency] = await db.select().from(currencyTable).where(eq(currencyTable.code, code));
    return currency || null;
  }

  async deleteCurrency(code: string): Promise<void> {
    await db.update(currencyTable).set({ deletedAt: new Date() }).where(eq(currencyTable.code, code));
  }

  async createGeneralStatus(data: NewGeneralStatus): Promise<GeneralStatus> {
    const [result] = await db.insert(generalStatusTable).values(data);
    const [generalStatus] = await db.select().from(generalStatusTable).where(eq(generalStatusTable.generalStatusId, result.insertId));
    return generalStatus;
  }

  async getGeneralStatuses(): Promise<GeneralStatus[]> {
    return await db.select().from(generalStatusTable).where(isNull(generalStatusTable.deletedAt)).orderBy(desc(generalStatusTable.createdAt));
  }

  async getGeneralStatusById(id: number): Promise<GeneralStatus | null> {
    const [generalStatus] = await db.select().from(generalStatusTable).where(and(eq(generalStatusTable.generalStatusId, id), isNull(generalStatusTable.deletedAt)));
    return generalStatus || null;
  }

  async updateGeneralStatus(id: number, data: Partial<NewGeneralStatus>): Promise<GeneralStatus | null> {
    await db.update(generalStatusTable).set({ ...data, updatedAt: new Date() }).where(eq(generalStatusTable.generalStatusId, id));
    const [generalStatus] = await db.select().from(generalStatusTable).where(eq(generalStatusTable.generalStatusId, id));
    return generalStatus || null;
  }

  async deleteGeneralStatus(id: number): Promise<void> {
    await db.update(generalStatusTable).set({ deletedAt: new Date() }).where(eq(generalStatusTable.generalStatusId, id));
  }

  async createCompany(data: NewCompany): Promise<Company> {
    const [result] = await db.insert(companyTable).values(data);
    const [company] = await db.select().from(companyTable).where(eq(companyTable.companyId, result.insertId));
    return company;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companyTable).where(isNull(companyTable.deletedAt)).orderBy(desc(companyTable.createdAt));
  }

  async getCompanyById(id: number): Promise<Company | null> {
    const [company] = await db.select().from(companyTable).where(and(eq(companyTable.companyId, id), isNull(companyTable.deletedAt)));
    return company || null;
  }

  async updateCompany(id: number, data: Partial<NewCompany>): Promise<Company | null> {
    await db.update(companyTable).set({ ...data, updatedAt: new Date() }).where(eq(companyTable.companyId, id));
    const [company] = await db.select().from(companyTable).where(eq(companyTable.companyId, id));
    return company || null;
  }

  async deleteCompany(id: number): Promise<void> {
    await db.update(companyTable).set({ deletedAt: new Date() }).where(eq(companyTable.companyId, id));
  }

  async createSubsidiary(data: NewSubsidiary): Promise<Subsidiary> {
    const [result] = await db.insert(subsidiaryTable).values(data);
    const [subsidiary] = await db.select().from(subsidiaryTable).where(eq(subsidiaryTable.subsidiaryId, result.insertId));
    return subsidiary;
  }

  async getSubsidiaries(): Promise<Subsidiary[]> {
    return await db.select().from(subsidiaryTable).where(isNull(subsidiaryTable.deletedAt)).orderBy(desc(subsidiaryTable.createdAt));
  }

  async getSubsidiaryById(id: number): Promise<Subsidiary | null> {
    const [subsidiary] = await db.select().from(subsidiaryTable).where(and(eq(subsidiaryTable.subsidiaryId, id), isNull(subsidiaryTable.deletedAt)));
    return subsidiary || null;
  }

  async updateSubsidiary(id: number, data: Partial<NewSubsidiary>): Promise<Subsidiary | null> {
    await db.update(subsidiaryTable).set({ ...data, updatedAt: new Date() }).where(eq(subsidiaryTable.subsidiaryId, id));
    const [subsidiary] = await db.select().from(subsidiaryTable).where(eq(subsidiaryTable.subsidiaryId, id));
    return subsidiary || null;
  }

  async deleteSubsidiary(id: number): Promise<void> {
    await db.update(subsidiaryTable).set({ deletedAt: new Date() }).where(eq(subsidiaryTable.subsidiaryId, id));
  }

  async createSysUnit(data: NewSysUnit): Promise<SysUnit> {
    const [result] = await db.insert(sysUnitTable).values(data);
    const [sysUnit] = await db.select().from(sysUnitTable).where(eq(sysUnitTable.sysUnitId, result.insertId));
    return sysUnit;
  }

  async getSysUnits(): Promise<SysUnit[]> {
    return await db.select().from(sysUnitTable).orderBy(desc(sysUnitTable.sysUnitId));
  }

  async getSysUnitById(id: number): Promise<SysUnit | null> {
    const [sysUnit] = await db.select().from(sysUnitTable).where(eq(sysUnitTable.sysUnitId, id));
    return sysUnit || null;
  }

  async updateSysUnit(id: number, data: Partial<NewSysUnit>): Promise<SysUnit | null> {
    await db.update(sysUnitTable).set(data).where(eq(sysUnitTable.sysUnitId, id));
    const [sysUnit] = await db.select().from(sysUnitTable).where(eq(sysUnitTable.sysUnitId, id));
    return sysUnit || null;
  }

  async deleteSysUnit(id: number): Promise<void> {
    await db.delete(sysUnitTable).where(eq(sysUnitTable.sysUnitId, id));
  }

  async createClasse(data: NewClasse): Promise<Classe> {
    const [result] = await db.insert(classeTable).values(data);
    const [classe] = await db.select().from(classeTable).where(eq(classeTable.categoryId, result.insertId));
    return classe;
  }

  async getClasses(): Promise<Classe[]> {
    return await db.select().from(classeTable).where(isNull(classeTable.deletedAt)).orderBy(desc(classeTable.createdAt));
  }

  async getClasseById(id: number): Promise<Classe | null> {
    const [classe] = await db.select().from(classeTable).where(and(eq(classeTable.categoryId, id), isNull(classeTable.deletedAt)));
    return classe || null;
  }

  async updateClasse(id: number, data: Partial<NewClasse>): Promise<Classe | null> {
    await db.update(classeTable).set({ ...data, updatedAt: new Date() }).where(eq(classeTable.categoryId, id));
    const [classe] = await db.select().from(classeTable).where(eq(classeTable.categoryId, id));
    return classe || null;
  }

  async deleteClasse(id: number): Promise<void> {
    await db.update(classeTable).set({ deletedAt: new Date() }).where(eq(classeTable.categoryId, id));
  }

  async createGroupBatch(data: NewGroupBatch): Promise<GroupBatch> {
    const [result] = await db.insert(groupBatchTable).values(data);
    const [groupBatch] = await db.select().from(groupBatchTable).where(eq(groupBatchTable.groupBatchId, result.insertId));
    return groupBatch;
  }

  async getGroupBatches(): Promise<GroupBatch[]> {
    return await db.select().from(groupBatchTable).where(isNull(groupBatchTable.deletedAt)).orderBy(desc(groupBatchTable.createdAt));
  }

  async getGroupBatchById(id: number): Promise<GroupBatch | null> {
    const [groupBatch] = await db.select().from(groupBatchTable).where(and(eq(groupBatchTable.groupBatchId, id), isNull(groupBatchTable.deletedAt)));
    return groupBatch || null;
  }

  async updateGroupBatch(id: number, data: Partial<NewGroupBatch>): Promise<GroupBatch | null> {
    await db.update(groupBatchTable).set({ ...data, updatedAt: new Date() }).where(eq(groupBatchTable.groupBatchId, id));
    const [groupBatch] = await db.select().from(groupBatchTable).where(eq(groupBatchTable.groupBatchId, id));
    return groupBatch || null;
  }

  async deleteGroupBatch(id: number): Promise<void> {
    await db.update(groupBatchTable).set({ deletedAt: new Date() }).where(eq(groupBatchTable.groupBatchId, id));
  }

  // =====================================================================================
  // FINANCIAL MODULE STORAGE METHODS
  // =====================================================================================

  // Account Types
  async createAccountType(data: InsertAccountType): Promise<SelectAccountType> {
    const [result] = await db.insert(accountTypesTable).values(data);
    const [accountType] = await db.select().from(accountTypesTable).where(eq(accountTypesTable.accountTypeId, result.insertId));
    return accountType;
  }

  async getAccountTypes(): Promise<SelectAccountType[]> {
    return await db.select().from(accountTypesTable).where(eq(accountTypesTable.active, true)).orderBy(accountTypesTable.typeName);
  }

  async getAccountTypeById(id: number): Promise<SelectAccountType | null> {
    const [accountType] = await db.select().from(accountTypesTable).where(eq(accountTypesTable.accountTypeId, id));
    return accountType || null;
  }

  async updateAccountType(id: number, data: Partial<InsertAccountType>): Promise<SelectAccountType | null> {
    await db.update(accountTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(accountTypesTable.accountTypeId, id));
    const [accountType] = await db.select().from(accountTypesTable).where(eq(accountTypesTable.accountTypeId, id));
    return accountType || null;
  }

  async deleteAccountType(id: number): Promise<void> {
    await db.update(accountTypesTable).set({ active: false }).where(eq(accountTypesTable.accountTypeId, id));
  }

  // Accounts (Chart of Accounts)
  async createAccount(data: InsertAccount): Promise<SelectAccount> {
    const [result] = await db.insert(accountsTable).values(data);
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.accountId, result.insertId));
    return account;
  }

  async getAccounts(): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(eq(accountsTable.active, true)).orderBy(accountsTable.accountCode);
  }

  async getAccountById(id: number): Promise<SelectAccount | null> {
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.accountId, id));
    return account || null;
  }

  async getAccountsByType(accountTypeId: number): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(and(eq(accountsTable.accountTypeId, accountTypeId), eq(accountsTable.active, true))).orderBy(accountsTable.accountCode);
  }

  async getAccountHierarchy(): Promise<SelectAccount[]> {
    return await db.select().from(accountsTable).where(eq(accountsTable.active, true)).orderBy(accountsTable.level, accountsTable.accountCode);
  }

  async updateAccount(id: number, data: Partial<InsertAccount>): Promise<SelectAccount | null> {
    await db.update(accountsTable).set({ ...data, updatedAt: new Date() }).where(eq(accountsTable.accountId, id));
    const [account] = await db.select().from(accountsTable).where(eq(accountsTable.accountId, id));
    return account || null;
  }

  async deleteAccount(id: number): Promise<void> {
    await db.update(accountsTable).set({ active: false }).where(eq(accountsTable.accountId, id));
  }

  // Cost Centers
  async createCostCenter(data: InsertCostCenter): Promise<SelectCostCenter> {
    const [result] = await db.insert(costCentersTable).values(data);
    const [costCenter] = await db.select().from(costCentersTable).where(eq(costCentersTable.costCenterId, result.insertId));
    return costCenter;
  }

  async getCostCenters(): Promise<SelectCostCenter[]> {
    return await db.select().from(costCentersTable).where(eq(costCentersTable.active, true)).orderBy(costCentersTable.costCenterCode);
  }

  async getCostCenterById(id: number): Promise<SelectCostCenter | null> {
    const [costCenter] = await db.select().from(costCentersTable).where(eq(costCentersTable.costCenterId, id));
    return costCenter || null;
  }

  async getCostCenterHierarchy(): Promise<SelectCostCenter[]> {
    return await db.select().from(costCentersTable).where(eq(costCentersTable.active, true)).orderBy(costCentersTable.level, costCentersTable.costCenterCode);
  }

  async updateCostCenter(id: number, data: Partial<InsertCostCenter>): Promise<SelectCostCenter | null> {
    await db.update(costCentersTable).set({ ...data, updatedAt: new Date() }).where(eq(costCentersTable.costCenterId, id));
    const [costCenter] = await db.select().from(costCentersTable).where(eq(costCentersTable.costCenterId, id));
    return costCenter || null;
  }

  async deleteCostCenter(id: number): Promise<void> {
    await db.update(costCentersTable).set({ active: false }).where(eq(costCentersTable.costCenterId, id));
  }

  // Departments
  async createDepartment(data: InsertDepartment): Promise<SelectDepartment> {
    const [result] = await db.insert(departmentsTable).values(data);
    const [department] = await db.select().from(departmentsTable).where(eq(departmentsTable.departmentId, result.insertId));
    return department;
  }

  async getDepartments(): Promise<SelectDepartment[]> {
    return await db.select().from(departmentsTable).where(eq(departmentsTable.active, true)).orderBy(departmentsTable.departmentCode);
  }

  async getDepartmentById(id: number): Promise<SelectDepartment | null> {
    const [department] = await db.select().from(departmentsTable).where(eq(departmentsTable.departmentId, id));
    return department || null;
  }

  async updateDepartment(id: number, data: Partial<InsertDepartment>): Promise<SelectDepartment | null> {
    await db.update(departmentsTable).set({ ...data, updatedAt: new Date() }).where(eq(departmentsTable.departmentId, id));
    const [department] = await db.select().from(departmentsTable).where(eq(departmentsTable.departmentId, id));
    return department || null;
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.update(departmentsTable).set({ active: false }).where(eq(departmentsTable.departmentId, id));
  }

  // Projects
  async createProject(data: InsertProject): Promise<SelectProject> {
    const [result] = await db.insert(projectsTable).values(data);
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.projectId, result.insertId));
    return project;
  }

  async getProjects(): Promise<SelectProject[]> {
    return await db.select().from(projectsTable).where(eq(projectsTable.active, true)).orderBy(projectsTable.projectCode);
  }

  async getProjectById(id: number): Promise<SelectProject | null> {
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.projectId, id));
    return project || null;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<SelectProject | null> {
    await db.update(projectsTable).set({ ...data, updatedAt: new Date() }).where(eq(projectsTable.projectId, id));
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.projectId, id));
    return project || null;
  }

  async deleteProject(id: number): Promise<void> {
    await db.update(projectsTable).set({ active: false }).where(eq(projectsTable.projectId, id));
  }

  // Fiscal Years
  async createFiscalYear(data: InsertFiscalYear): Promise<SelectFiscalYear> {
    const [result] = await db.insert(fiscalYearsTable).values(data);
    const [fiscalYear] = await db.select().from(fiscalYearsTable).where(eq(fiscalYearsTable.fiscalYearId, result.insertId));
    return fiscalYear;
  }

  async getFiscalYears(): Promise<SelectFiscalYear[]> {
    return await db.select().from(fiscalYearsTable).orderBy(desc(fiscalYearsTable.startDate));
  }

  async getFiscalYearById(id: number): Promise<SelectFiscalYear | null> {
    const [fiscalYear] = await db.select().from(fiscalYearsTable).where(eq(fiscalYearsTable.fiscalYearId, id));
    return fiscalYear || null;
  }

  async updateFiscalYear(id: number, data: Partial<InsertFiscalYear>): Promise<SelectFiscalYear | null> {
    await db.update(fiscalYearsTable).set({ ...data, updatedAt: new Date() }).where(eq(fiscalYearsTable.fiscalYearId, id));
    const [fiscalYear] = await db.select().from(fiscalYearsTable).where(eq(fiscalYearsTable.fiscalYearId, id));
    return fiscalYear || null;
  }

  async deleteFiscalYear(id: number): Promise<void> {
    await db.delete(fiscalYearsTable).where(eq(fiscalYearsTable.fiscalYearId, id));
  }

  // Fiscal Periods
  async createFiscalPeriod(data: InsertFiscalPeriod): Promise<SelectFiscalPeriod> {
    const [result] = await db.insert(fiscalPeriodsTable).values(data);
    const [fiscalPeriod] = await db.select().from(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.fiscalPeriodId, result.insertId));
    return fiscalPeriod;
  }

  async getFiscalPeriods(): Promise<SelectFiscalPeriod[]> {
    return await db.select().from(fiscalPeriodsTable).orderBy(fiscalPeriodsTable.startDate);
  }

  async getFiscalPeriodById(id: number): Promise<SelectFiscalPeriod | null> {
    const [fiscalPeriod] = await db.select().from(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.fiscalPeriodId, id));
    return fiscalPeriod || null;
  }

  async getFiscalPeriodsByYear(fiscalYearId: number): Promise<SelectFiscalPeriod[]> {
    return await db.select().from(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.fiscalYearId, fiscalYearId)).orderBy(fiscalPeriodsTable.periodNumber);
  }

  async updateFiscalPeriod(id: number, data: Partial<InsertFiscalPeriod>): Promise<SelectFiscalPeriod | null> {
    await db.update(fiscalPeriodsTable).set({ ...data, updatedAt: new Date() }).where(eq(fiscalPeriodsTable.fiscalPeriodId, id));
    const [fiscalPeriod] = await db.select().from(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.fiscalPeriodId, id));
    return fiscalPeriod || null;
  }

  async deleteFiscalPeriod(id: number): Promise<void> {
    await db.delete(fiscalPeriodsTable).where(eq(fiscalPeriodsTable.fiscalPeriodId, id));
  }

  // Contract Number Registry - Enhanced contract numbering system
  async createContractNumberRegistry(data: InsertContractNumberRegistry): Promise<ContractNumberRegistry> {
    const [result] = await db.insert(contractNumberRegistryTable).values(data);
    const [registry] = await db.select().from(contractNumberRegistryTable).where(eq(contractNumberRegistryTable.contractNumberRegistryId, result.insertId));
    return registry;
  }

  async getContractNumberRegistries(): Promise<ContractNumberRegistry[]> {
    return await db.select().from(contractNumberRegistryTable).where(isNull(contractNumberRegistryTable.deletedAt)).orderBy(contractNumberRegistryTable.contractNumber);
  }

  async getContractNumberRegistryById(id: number): Promise<ContractNumberRegistry | null> {
    const [registry] = await db.select().from(contractNumberRegistryTable).where(and(eq(contractNumberRegistryTable.contractNumberRegistryId, id), isNull(contractNumberRegistryTable.deletedAt)));
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
    await db.update(contractNumberRegistryTable).set({ currentContractId: contractId, status: 'assigned', updatedAt: new Date() }).where(eq(contractNumberRegistryTable.contractNumber, contractNumber));
    const [registry] = await db.select().from(contractNumberRegistryTable).where(eq(contractNumberRegistryTable.contractNumber, contractNumber));
    return registry || null;
  }

  async releaseContractNumber(contractNumber: string): Promise<ContractNumberRegistry | null> {
    await db.update(contractNumberRegistryTable).set({ currentContractId: null, status: 'available', updatedAt: new Date() }).where(eq(contractNumberRegistryTable.contractNumber, contractNumber));
    const [registry] = await db.select().from(contractNumberRegistryTable).where(eq(contractNumberRegistryTable.contractNumber, contractNumber));
    return registry || null;
  }

  async updateContractNumberRegistry(id: number, data: Partial<InsertContractNumberRegistry>): Promise<ContractNumberRegistry | null> {
    await db.update(contractNumberRegistryTable).set({ ...data, updatedAt: new Date() }).where(eq(contractNumberRegistryTable.contractNumberRegistryId, id));
    const [registry] = await db.select().from(contractNumberRegistryTable).where(eq(contractNumberRegistryTable.contractNumberRegistryId, id));
    return registry || null;
  }

  async deleteContractNumberRegistry(id: number): Promise<void> {
    await db.update(contractNumberRegistryTable).set({ deletedAt: new Date() }).where(eq(contractNumberRegistryTable.contractNumberRegistryId, id));
  }

  // Contract Status History - Historical tracking
  async createContractStatusHistory(data: InsertContractStatusHistory): Promise<ContractStatusHistory> {
    const [result] = await db.insert(contractStatusHistoryTable).values(data);
    const [history] = await db.select().from(contractStatusHistoryTable).where(eq(contractStatusHistoryTable.contractStatusHistoryId, result.insertId));
    return history;
  }

  async getContractStatusHistories(): Promise<ContractStatusHistory[]> {
    return await db.select().from(contractStatusHistoryTable).where(isNull(contractStatusHistoryTable.deletedAt)).orderBy(desc(contractStatusHistoryTable.effectiveDate));
  }

  async getContractStatusHistoryById(id: number): Promise<ContractStatusHistory | null> {
    const [history] = await db.select().from(contractStatusHistoryTable).where(and(eq(contractStatusHistoryTable.contractStatusHistoryId, id), isNull(contractStatusHistoryTable.deletedAt)));
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
    await db.update(contractStatusHistoryTable).set({ ...data, updatedAt: new Date() }).where(eq(contractStatusHistoryTable.contractStatusHistoryId, id));
    const [history] = await db.select().from(contractStatusHistoryTable).where(eq(contractStatusHistoryTable.contractStatusHistoryId, id));
    return history || null;
  }

  async deleteContractStatusHistory(id: number): Promise<void> {
    await db.update(contractStatusHistoryTable).set({ deletedAt: new Date() }).where(eq(contractStatusHistoryTable.contractStatusHistoryId, id));
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
    const [result] = await db.insert(paymentReceiptTable).values(data);
    const [paymentReceipt] = await db.select().from(paymentReceiptTable).where(eq(paymentReceiptTable.paymentReceiptId, result.insertId));
    return paymentReceipt;
  }

  async getPaymentReceiptById(id: number): Promise<PaymentReceipt | null> {
    const [paymentReceipt] = await db.select().from(paymentReceiptTable).where(
      and(
        eq(paymentReceiptTable.paymentReceiptId, id),
        isNull(paymentReceiptTable.deletedAt)
      )
    );
    return paymentReceipt || null;
  }

  async updatePaymentReceipt(id: number, data: Partial<InsertPaymentReceipt>): Promise<PaymentReceipt | null> {
    await db.update(paymentReceiptTable).set({ ...data, updatedAt: new Date() }).where(eq(paymentReceiptTable.paymentReceiptId, id));
    const [paymentReceipt] = await db.select().from(paymentReceiptTable).where(eq(paymentReceiptTable.paymentReceiptId, id));
    return paymentReceipt || null;
  }

  async deletePaymentReceipt(id: number): Promise<void> {
    await db.update(paymentReceiptTable).set({ deletedAt: new Date() }).where(eq(paymentReceiptTable.paymentReceiptId, id));
  }

  // Carteirinha (Member Card) Methods
  async getCarteirinhas(): Promise<Carteirinha[]> {
    return await db.select().from(carteirinhaTable)
      .where(isNull(carteirinhaTable.deletedAt))
      .orderBy(desc(carteirinhaTable.createdAt));
  }

  async createCarteirinha(data: InsertCarteirinha): Promise<Carteirinha> {
    const [result] = await db.insert(carteirinhaTable).values(data);
    const [carteirinha] = await db.select().from(carteirinhaTable).where(eq(carteirinhaTable.membershipCardId, result.insertId));
    return carteirinha;
  }

  async getCarteirinhaById(id: number): Promise<Carteirinha | null> {
    const [carteirinha] = await db.select().from(carteirinhaTable).where(
      and(
        eq(carteirinhaTable.membershipCardId, id),
        isNull(carteirinhaTable.deletedAt)
      )
    );
    return carteirinha || null;
  }

  async updateCarteirinha(id: number, data: Partial<InsertCarteirinha>): Promise<Carteirinha | null> {
    await db.update(carteirinhaTable).set({ ...data, updatedAt: new Date() }).where(eq(carteirinhaTable.membershipCardId, id));
    const [carteirinha] = await db.select().from(carteirinhaTable).where(eq(carteirinhaTable.membershipCardId, id));
    return carteirinha || null;
  }

  async deleteCarteirinha(id: number): Promise<void> {
    await db.update(carteirinhaTable).set({ deletedAt: new Date() }).where(eq(carteirinhaTable.membershipCardId, id));
  }

  // Medical Forward Methods
  async getMedicalForwards(): Promise<MedicalForward[]> {
    return await db.select().from(medicalForwardTable)
      .where(isNull(medicalForwardTable.deletedAt))
      .orderBy(desc(medicalForwardTable.createdAt));
  }

  async createMedicalForward(data: InsertMedicalForward): Promise<MedicalForward> {
    const [result] = await db.insert(medicalForwardTable).values(data);
    const [medicalForward] = await db.select().from(medicalForwardTable).where(eq(medicalForwardTable.medicalForwardId, result.insertId));
    return medicalForward;
  }

  async getMedicalForwardById(id: number): Promise<MedicalForward | null> {
    const [medicalForward] = await db.select().from(medicalForwardTable).where(
      and(
        eq(medicalForwardTable.medicalForwardId, id),
        isNull(medicalForwardTable.deletedAt)
      )
    );
    return medicalForward || null;
  }

  async updateMedicalForward(id: number, data: Partial<InsertMedicalForward>): Promise<MedicalForward | null> {
    await db.update(medicalForwardTable).set({ ...data, updatedAt: new Date() }).where(eq(medicalForwardTable.medicalForwardId, id));
    const [medicalForward] = await db.select().from(medicalForwardTable).where(eq(medicalForwardTable.medicalForwardId, id));
    return medicalForward || null;
  }

  async deleteMedicalForward(id: number): Promise<void> {
    await db.update(medicalForwardTable).set({ deletedAt: new Date() }).where(eq(medicalForwardTable.medicalForwardId, id));
  }
}

export const storage = new DrizzleStorage();