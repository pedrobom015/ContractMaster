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
  companyTable,
  subsidiaryTable,
  sysUnitTable,
  genderTable,
  paymentStatusTable,
  estadoTable,
  cidadeTable,
  currencyTable,
  generalStatusTable,
  categoryTable,
  groupBatchTable,
  contractsTable,
  contractVersionTable,
  beneficiariesTable,
  contractChargeTable,
  chargeTable,
  addendumTable,
  batchChkTable,
  batchDetailTable,
  contractStatusHistoryTable,
  paymentReceiptTable,
  medicalForwardTable,
  accountTypesTable,
  accountsTable,
  costCentersTable,
  departmentsTable,
  projectsTable,
  membershipCardTable,
  // Types
  type SysUser,
  type InsertSysUser,
  type AddressType,
  type InsertAddressType,
  type Address,
  type InsertAddress,
  type EntityAddress,
  type NewEntityAddress as InsertEntityAddress,
  type PartnerType,
  type NewPartnerType as InsertPartnerType,
  type Partner,
  type InsertPartner,
  type Document,
  type NewDocument as InsertDocument,
  type DocumentType,
  type InsertDocumentType,
  type EntityDocument,
  type NewEntityDocument as InsertEntityDocument,
  type Contract,
  type InsertContract,
  type ContractVersion,
  type InsertContractVersion,
  type Beneficiary,
  type InsertBeneficiary,
  type ContractCharge,
  type InsertContractCharge,
  type Charge,
  type NewCharge as InsertCharge,
  type Addendum,
  type InsertAddendum,
  type BatchChk,
  type NewBatchChk as InsertBatchChk,
  type BatchDetail,
  type NewBatchDetail as InsertBatchDetail,
  type PaymentReceipt,
  type InsertPaymentReceipt,
  type MedicalForward,
  type InsertMedicalForward,
  type Gender,
  type InsertGender,
  type PaymentStatus,
  type InsertPaymentStatus,
  type Estado,
  type InsertEstado,
  type Cidade,
  type InsertCidade,
  type Currency,
  type InsertCurrency,
  type GeneralStatus,
  type InsertGeneralStatus,
  type Company,
  type InsertCompany,
  type Subsidiary,
  type InsertSubsidiary,
  type SysUnit,
  type InsertSysUnit,
  type Category,
  type InsertCategory,
  type GroupBatch,
  type InsertGroupBatch,
  type AccountType,
  type InsertAccountType,
  type Account,
  type InsertAccount,
  type CostCenter,
  type InsertCostCenter,
  type Department,
  type InsertDepartment,
  type Project,
  type InsertProject,
} from "../shared/schema";

export interface IStorage {
  // System Users
  createSysUser(data: InsertSysUser): Promise<SysUser>;
  getSysUsers(): Promise<SysUser[]>;
  getSysUserById(id: number): Promise<SysUser | null>;
  updateSysUser(id: number, data: Partial<InsertSysUser>): Promise<SysUser | null>;
  deleteSysUser(id: number): Promise<void>;

  // Address Types
  createAddressType(data: InsertAddressType): Promise<AddressType>;
  getAddressTypes(): Promise<AddressType[]>;
  getAddressTypeById(id: number): Promise<AddressType | null>;
  updateAddressType(id: number, data: Partial<InsertAddressType>): Promise<AddressType | null>;
  deleteAddressType(id: number): Promise<void>;

  // Addresses
  createAddress(data: InsertAddress): Promise<Address>;
  getAddresses(): Promise<Address[]>;
  getAddressById(id: number): Promise<Address | null>;
  updateAddress(id: number, data: Partial<InsertAddress>): Promise<Address | null>;
  deleteAddress(id: number): Promise<void>;

  // Entity Addresses
  createEntityAddress(data: InsertEntityAddress): Promise<EntityAddress>;
  getEntityAddresses(): Promise<EntityAddress[]>;
  getEntityAddressesByEntity(entityType: string, entityId: number): Promise<EntityAddress[]>;
  updateEntityAddress(id: number, data: Partial<InsertEntityAddress>): Promise<EntityAddress | null>;
  deleteEntityAddress(id: number): Promise<void>;

  // Partner Types
  createPartnerType(data: InsertPartnerType): Promise<PartnerType>;
  getPartnerTypes(): Promise<PartnerType[]>;
  getPartnerTypeById(id: number): Promise<PartnerType | null>;
  updatePartnerType(id: number, data: Partial<InsertPartnerType>): Promise<PartnerType | null>;
  deletePartnerType(id: number): Promise<void>;

  // Partners
  createPartner(data: InsertPartner): Promise<Partner>;
  getPartners(): Promise<Partner[]>;
  getPartnerById(id: number): Promise<Partner | null>;
  updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | null>;
  deletePartner(id: number): Promise<void>;

  // Document Types
  createDocumentType(data: InsertDocumentType): Promise<DocumentType>;
  getDocumentTypes(): Promise<DocumentType[]>;
  getDocumentTypeById(id: number): Promise<DocumentType | null>;
  updateDocumentType(id: number, data: Partial<InsertDocumentType>): Promise<DocumentType | null>;
  deleteDocumentType(id: number): Promise<void>;

  // Documents
  createDocument(data: InsertDocument): Promise<Document>;
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | null>;
  updateDocument(id: number, data: Partial<InsertDocument>): Promise<Document | null>;
  deleteDocument(id: number): Promise<void>;

  // Entity Documents
  createEntityDocument(data: InsertEntityDocument): Promise<EntityDocument>;
  getEntityDocuments(): Promise<EntityDocument[]>;
  getEntityDocumentsByEntity(entityType: string, entityId: number): Promise<EntityDocument[]>;
  updateEntityDocument(id: number, data: Partial<InsertEntityDocument>): Promise<EntityDocument | null>;
  deleteEntityDocument(id: number): Promise<void>;

  // Clients
  createClient(data: any): Promise<any>;
  getClients(): Promise<any[]>;
  getClientById(id: number): Promise<any | null>;
  updateClient(id: number, data: any): Promise<any | null>;
  deleteClient(id: number): Promise<void>;

  // Contracts & Versions
  createContract(data: InsertContract): Promise<Contract>;
  getContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | null>;
  updateContract(id: number, data: Partial<InsertContract>): Promise<Contract | null>;
  deleteContract(id: number): Promise<void>;
  createContractVersion(data: InsertContractVersion): Promise<ContractVersion>;
  getCurrentContractVersion(contractId: number): Promise<ContractVersion | null>;
  createContractWithUser(contractData: InsertContract, userData?: any): Promise<{ contract: Contract; user?: SysUser }>;

  // Beneficiaries
  createBeneficiary(data: InsertBeneficiary): Promise<Beneficiary>;
  getBeneficiaries(): Promise<Beneficiary[]>;
  getBeneficiaryById(id: number): Promise<Beneficiary | null>;
  getBeneficiariesByContract(contractId: number): Promise<Beneficiary[]>;
  updateBeneficiary(id: number, data: Partial<InsertBeneficiary>): Promise<Beneficiary | null>;
  deleteBeneficiary(id: number): Promise<void>;

  // Contract Charges
  createContractCharge(data: InsertContractCharge): Promise<ContractCharge>;
  getContractCharges(): Promise<ContractCharge[]>;
  getContractChargeById(id: number): Promise<ContractCharge | null>;
  getContractChargesByContract(contractId: number): Promise<ContractCharge[]>;
  updateContractCharge(id: number, data: Partial<InsertContractCharge>): Promise<ContractCharge | null>;
  deleteContractCharge(id: number): Promise<void>;

  // Legacy Charges
  createCharge(data: InsertCharge): Promise<Charge>;
  getCharges(): Promise<Charge[]>;
  getChargeById(id: number): Promise<Charge | null>;
  getChargesByContract(contractId: number): Promise<Charge[]>;
  updateCharge(id: number, data: Partial<InsertCharge>): Promise<Charge | null>;
  deleteCharge(id: number): Promise<void>;

  // Addendums
  createAddendum(data: InsertAddendum): Promise<Addendum>;
  getAddendums(): Promise<Addendum[]>;
  getAddendumById(id: number): Promise<Addendum | null>;
  getAddendumsByContract(contractId: number): Promise<Addendum[]>;
  updateAddendum(id: number, data: Partial<InsertAddendum>): Promise<Addendum | null>;
  deleteAddendum(id: number): Promise<void>;

  // Batch CHK
  createBatchChk(data: InsertBatchChk): Promise<BatchChk>;
  getBatchChks(): Promise<BatchChk[]>;
  getBatchChkById(id: number): Promise<BatchChk | null>;
  updateBatchChk(id: number, data: Partial<InsertBatchChk>): Promise<BatchChk | null>;
  deleteBatchChk(id: number): Promise<void>;

  // Batch Detail
  createBatchDetail(data: InsertBatchDetail): Promise<BatchDetail>;
  getBatchDetails(): Promise<BatchDetail[]>;
  getBatchDetailById(id: number): Promise<BatchDetail | null>;
  getBatchDetailsByBatch(batchId: number): Promise<BatchDetail[]>;
  updateBatchDetail(id: number, data: Partial<InsertBatchDetail>): Promise<BatchDetail | null>;
  deleteBatchDetail(id: number): Promise<void>;

  // Core System Tables
  createGender(data: InsertGender): Promise<Gender>;
  getGenders(): Promise<Gender[]>;
  getGenderById(id: number): Promise<Gender | null>;
  updateGender(id: number, data: Partial<InsertGender>): Promise<Gender | null>;
  deleteGender(id: number): Promise<void>;

  createPaymentStatus(data: InsertPaymentStatus): Promise<PaymentStatus>;
  getPaymentStatuses(): Promise<PaymentStatus[]>;
  getPaymentStatusById(id: number): Promise<PaymentStatus | null>;
  updatePaymentStatus(id: number, data: Partial<InsertPaymentStatus>): Promise<PaymentStatus | null>;
  deletePaymentStatus(id: number): Promise<void>;

  createEstado(data: InsertEstado): Promise<Estado>;
  getEstados(): Promise<Estado[]>;
  getEstadoById(id: number): Promise<Estado | null>;
  updateEstado(id: number, data: Partial<InsertEstado>): Promise<Estado | null>;
  deleteEstado(id: number): Promise<void>;

  createCidade(data: InsertCidade): Promise<Cidade>;
  getCidades(): Promise<Cidade[]>;
  getCidadeById(id: number): Promise<Cidade | null>;
  getCidadesByEstado(estadoId: number): Promise<Cidade[]>;
  updateCidade(id: number, data: Partial<InsertCidade>): Promise<Cidade | null>;
  deleteCidade(id: number): Promise<void>;

  createCurrency(data: InsertCurrency): Promise<Currency>;
  getCurrencies(): Promise<Currency[]>;
  getCurrencyByCode(code: string): Promise<Currency | null>;
  updateCurrency(code: string, data: Partial<InsertCurrency>): Promise<Currency | null>;
  deleteCurrency(code: string): Promise<void>;

  createGeneralStatus(data: InsertGeneralStatus): Promise<GeneralStatus>;
  getGeneralStatuses(): Promise<GeneralStatus[]>;
  getGeneralStatusById(id: number): Promise<GeneralStatus | null>;
  updateGeneralStatus(id: number, data: Partial<InsertGeneralStatus>): Promise<GeneralStatus | null>;
  deleteGeneralStatus(id: number): Promise<void>;

  createCompany(data: InsertCompany): Promise<Company>;
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | null>;
  updateCompany(id: number, data: Partial<InsertCompany>): Promise<Company | null>;
  deleteCompany(id: number): Promise<void>;

  createSubsidiary(data: InsertSubsidiary): Promise<Subsidiary>;
  getSubsidiaries(): Promise<Subsidiary[]>;
  getSubsidiaryById(id: number): Promise<Subsidiary | null>;
  updateSubsidiary(id: number, data: Partial<InsertSubsidiary>): Promise<Subsidiary | null>;
  deleteSubsidiary(id: number): Promise<void>;

  createSysUnit(data: InsertSysUnit): Promise<SysUnit>;
  getSysUnits(): Promise<SysUnit[]>;
  getSysUnitById(id: number): Promise<SysUnit | null>;
  updateSysUnit(id: number, data: Partial<InsertSysUnit>): Promise<SysUnit | null>;
  deleteSysUnit(id: number): Promise<void>;

  createClasse(data: InsertCategory): Promise<Category>;
  getClasses(): Promise<Category[]>;
  getClasseById(id: number): Promise<Category | null>;
  updateClasse(id: number, data: Partial<InsertCategory>): Promise<Category | null>;
  deleteClasse(id: number): Promise<void>;

  createGroupBatch(data: InsertGroupBatch): Promise<GroupBatch>;
  getGroupBatches(): Promise<GroupBatch[]>;
  getGroupBatchById(id: number): Promise<GroupBatch | null>;
  updateGroupBatch(id: number, data: Partial<InsertGroupBatch>): Promise<GroupBatch | null>;
  deleteGroupBatch(id: number): Promise<void>;

  // Financial module
  getAccountTypes(): Promise<AccountType[]>;
  createAccountType(data: InsertAccountType): Promise<AccountType>;
  getAccountTypeById(id: number): Promise<AccountType | null>;
  updateAccountType(id: number, data: Partial<InsertAccountType>): Promise<AccountType | null>;
  deleteAccountType(id: number): Promise<void>;

  getAccounts(): Promise<Account[]>;
  createAccount(data: InsertAccount): Promise<Account>;
  getAccountById(id: number): Promise<Account | null>;
  updateAccount(id: number, data: Partial<InsertAccount>): Promise<Account | null>;
  deleteAccount(id: number): Promise<void>;

  getCostCenters(): Promise<CostCenter[]>;
  createCostCenter(data: InsertCostCenter): Promise<CostCenter>;
  getCostCenterById(id: number): Promise<CostCenter | null>;
  updateCostCenter(id: number, data: Partial<InsertCostCenter>): Promise<CostCenter | null>;
  deleteCostCenter(id: number): Promise<void>;

  getDepartments(): Promise<Department[]>;
  createDepartment(data: InsertDepartment): Promise<Department>;
  getDepartmentById(id: number): Promise<Department | null>;
  updateDepartment(id: number, data: Partial<InsertDepartment>): Promise<Department | null>;
  deleteDepartment(id: number): Promise<void>;

  getProjects(): Promise<Project[]>;
  createProject(data: InsertProject): Promise<Project>;
  getProjectById(id: number): Promise<Project | null>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | null>;
  deleteProject(id: number): Promise<void>;

  // Other missing methods from routes.ts
  getContractNumberRegistries(): Promise<any[]>;
  createContractNumberRegistry(data: any): Promise<any>;
  getContractNumberRegistryById(id: number): Promise<any | null>;
  getAvailableContractNumbers(groupBatchId: number): Promise<any[]>;
  getNextAvailableContractNumber(groupBatchId: number): Promise<string | null>;
  updateContractNumberRegistry(id: number, data: any): Promise<any | null>;
  deleteContractNumberRegistry(id: number): Promise<void>;
  initializeGroupContractNumbers(groupBatchId: number, start: number, end: number): Promise<void>;
  changeContractStatus(id: number, status: string, reason: string, desc?: string): Promise<void>;
  assignContractNumber(num: string, id: number): Promise<any>;
  releaseContractNumber(num: string): Promise<any>;
  getContractStatusHistories(): Promise<any[]>;
  createContractStatusHistory(data: any): Promise<any>;
  getContractStatusHistoryById(id: number): Promise<any | null>;
  getContractStatusHistoryByContract(id: number): Promise<any[]>;
  updateContractStatusHistory(id: number, data: any): Promise<any | null>;
  deleteContractStatusHistory(id: number): Promise<void>;
  getPaymentReceipts(): Promise<PaymentReceipt[]>;
  createPaymentReceipt(data: InsertPaymentReceipt): Promise<PaymentReceipt>;
  getPaymentReceiptById(id: number): Promise<PaymentReceipt | null>;
  updatePaymentReceipt(id: number, data: Partial<InsertPaymentReceipt>): Promise<PaymentReceipt | null>;
  deletePaymentReceipt(id: number): Promise<void>;
  getCarteirinhas(): Promise<any[]>;
  createCarteirinha(data: any): Promise<any>;
  getCarteirinhaById(id: number): Promise<any | null>;
  updateCarteirinha(id: number, data: any): Promise<any | null>;
  deleteCarteirinha(id: number): Promise<void>;
  getMedicalForwards(): Promise<MedicalForward[]>;
  createMedicalForward(data: InsertMedicalForward): Promise<MedicalForward>;
  getMedicalForwardById(id: number): Promise<MedicalForward | null>;
  updateMedicalForward(id: number, data: Partial<InsertMedicalForward>): Promise<MedicalForward | null>;
  deleteMedicalForward(id: number): Promise<void>;
}

export class MySQLStorage implements IStorage {
  // Utility for MySQL
  async getLastInsert(table: any, idCol: any, id: any): Promise<any> {
    const [res] = await db.select().from(table).where(eq(idCol, id));
    return res;
  }

  // System Users
  async createSysUser(data: InsertSysUser): Promise<SysUser> {
    const [result] = await db.insert(sysUsersTable).values(data);
    return await this.getLastInsert(sysUsersTable, sysUsersTable.sysUserId, result.insertId);
  }
  async getSysUsers(): Promise<SysUser[]> { return await db.select().from(sysUsersTable).where(isNull(sysUsersTable.deletedAt)); }
  async getSysUserById(id: number): Promise<SysUser | null> {
    const [user] = await db.select().from(sysUsersTable).where(eq(sysUsersTable.sysUserId, id));
    return user || null;
  }
  async updateSysUser(id: number, data: Partial<InsertSysUser>): Promise<SysUser | null> {
    await db.update(sysUsersTable).set({ ...data, updatedAt: new Date() }).where(eq(sysUsersTable.sysUserId, id));
    return await this.getSysUserById(id);
  }
  async deleteSysUser(id: number): Promise<void> { await db.update(sysUsersTable).set({ deletedAt: new Date() }).where(eq(sysUsersTable.sysUserId, id)); }

  // Address Types
  async createAddressType(data: InsertAddressType): Promise<AddressType> {
    const [result] = await db.insert(addressTypesTable).values(data);
    return await this.getLastInsert(addressTypesTable, addressTypesTable.addressTypeId, result.insertId);
  }
  async getAddressTypes(): Promise<AddressType[]> { return await db.select().from(addressTypesTable).where(isNull(addressTypesTable.deletedAt)); }
  async getAddressTypeById(id: number): Promise<AddressType | null> {
    const [res] = await db.select().from(addressTypesTable).where(eq(addressTypesTable.addressTypeId, id));
    return res || null;
  }
  async updateAddressType(id: number, data: Partial<InsertAddressType>): Promise<AddressType | null> {
    await db.update(addressTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(addressTypesTable.addressTypeId, id));
    return await this.getAddressTypeById(id);
  }
  async deleteAddressType(id: number): Promise<void> { await db.update(addressTypesTable).set({ deletedAt: new Date() }).where(eq(addressTypesTable.addressTypeId, id)); }

  // Addresses
  async createAddress(data: InsertAddress): Promise<Address> {
    const [result] = await db.insert(addressesTable).values(data);
    return await this.getLastInsert(addressesTable, addressesTable.addressId, result.insertId);
  }
  async getAddresses(): Promise<Address[]> { return await db.select().from(addressesTable).where(isNull(addressesTable.deletedAt)); }
  async getAddressById(id: number): Promise<Address | null> {
    const [res] = await db.select().from(addressesTable).where(eq(addressesTable.addressId, id));
    return res || null;
  }
  async updateAddress(id: number, data: Partial<InsertAddress>): Promise<Address | null> {
    await db.update(addressesTable).set({ ...data, updatedAt: new Date() }).where(eq(addressesTable.addressId, id));
    return await this.getAddressById(id);
  }
  async deleteAddress(id: number): Promise<void> { await db.update(addressesTable).set({ deletedAt: new Date() }).where(eq(addressesTable.addressId, id)); }

  // Entity Addresses
  async createEntityAddress(data: InsertEntityAddress): Promise<EntityAddress> {
    const [result] = await db.insert(entityAddressesTable).values(data);
    return await this.getLastInsert(entityAddressesTable, entityAddressesTable.entityAddressId, result.insertId);
  }
  async getEntityAddresses(): Promise<EntityAddress[]> { return await db.select().from(entityAddressesTable); }
  async getEntityAddressesByEntity(entityType: string, entityId: number): Promise<EntityAddress[]> {
    return await db.select().from(entityAddressesTable).where(and(eq(entityAddressesTable.entityType, entityType as any), eq(entityAddressesTable.entityId, entityId)));
  }
  async updateEntityAddress(id: number, data: Partial<InsertEntityAddress>): Promise<EntityAddress | null> {
    await db.update(entityAddressesTable).set(data).where(eq(entityAddressesTable.entityAddressId, id));
    const [res] = await db.select().from(entityAddressesTable).where(eq(entityAddressesTable.entityAddressId, id));
    return res || null;
  }
  async deleteEntityAddress(id: number): Promise<void> { await db.delete(entityAddressesTable).where(eq(entityAddressesTable.entityAddressId, id)); }

  // Partner Types
  async createPartnerType(data: InsertPartnerType): Promise<PartnerType> {
    const [result] = await db.insert(partnerTypesTable).values(data);
    return await this.getLastInsert(partnerTypesTable, partnerTypesTable.partnerTypeId, result.insertId);
  }
  async getPartnerTypes(): Promise<PartnerType[]> { return await db.select().from(partnerTypesTable); }
  async getPartnerTypeById(id: number): Promise<PartnerType | null> {
    const [res] = await db.select().from(partnerTypesTable).where(eq(partnerTypesTable.partnerTypeId, id));
    return res || null;
  }
  async updatePartnerType(id: number, data: Partial<InsertPartnerType>): Promise<PartnerType | null> {
    await db.update(partnerTypesTable).set(data).where(eq(partnerTypesTable.partnerTypeId, id));
    return await this.getPartnerTypeById(id);
  }
  async deletePartnerType(id: number): Promise<void> { await db.delete(partnerTypesTable).where(eq(partnerTypesTable.partnerTypeId, id)); }

  // Partners
  async createPartner(data: InsertPartner): Promise<Partner> {
    const [result] = await db.insert(partnersTable).values(data);
    return await this.getLastInsert(partnersTable, partnersTable.partnerId, result.insertId);
  }
  async getPartners(): Promise<Partner[]> { return await db.select().from(partnersTable).where(isNull(partnersTable.deletedAt)); }
  async getPartnerById(id: number): Promise<Partner | null> {
    const [partner] = await db.select().from(partnersTable).where(eq(partnersTable.partnerId, id));
    return partner || null;
  }
  async updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | null> {
    await db.update(partnersTable).set({ ...data, updatedAt: new Date() }).where(eq(partnersTable.partnerId, id));
    return await this.getPartnerById(id);
  }
  async deletePartner(id: number): Promise<void> { await db.update(partnersTable).set({ deletedAt: new Date() }).where(eq(partnersTable.partnerId, id)); }

  // Document Types
  async createDocumentType(data: InsertDocumentType): Promise<DocumentType> {
    const [result] = await db.insert(documentTypesTable).values(data);
    return await this.getLastInsert(documentTypesTable, documentTypesTable.documentTypeId, result.insertId);
  }
  async getDocumentTypes(): Promise<DocumentType[]> { return await db.select().from(documentTypesTable).where(isNull(documentTypesTable.deletedAt)); }
  async getDocumentTypeById(id: number): Promise<DocumentType | null> {
    const [res] = await db.select().from(documentTypesTable).where(eq(documentTypesTable.documentTypeId, id));
    return res || null;
  }
  async updateDocumentType(id: number, data: Partial<InsertDocumentType>): Promise<DocumentType | null> {
    await db.update(documentTypesTable).set({ ...data, updatedAt: new Date() }).where(eq(documentTypesTable.documentTypeId, id));
    return await this.getDocumentTypeById(id);
  }
  async deleteDocumentType(id: number): Promise<void> { await db.update(documentTypesTable).set({ deletedAt: new Date() }).where(eq(documentTypesTable.documentTypeId, id)); }

  // Documents
  async createDocument(data: InsertDocument): Promise<Document> {
    const [result] = await db.insert(documentsTable).values(data);
    return await this.getLastInsert(documentsTable, documentsTable.documentId, result.insertId);
  }
  async getDocuments(): Promise<Document[]> { return await db.select().from(documentsTable).where(isNull(documentsTable.deletedAt)); }
  async getDocumentById(id: number): Promise<Document | null> {
    const [res] = await db.select().from(documentsTable).where(eq(documentsTable.documentId, id));
    return res || null;
  }
  async updateDocument(id: number, data: Partial<InsertDocument>): Promise<Document | null> {
    await db.update(documentsTable).set({ ...data, updatedAt: new Date() }).where(eq(documentsTable.documentId, id));
    return await this.getDocumentById(id);
  }
  async deleteDocument(id: number): Promise<void> { await db.update(documentsTable).set({ deletedAt: new Date() }).where(eq(documentsTable.documentId, id)); }

  // Entity Documents
  async createEntityDocument(data: InsertEntityDocument): Promise<EntityDocument> {
    const [result] = await db.insert(entityDocumentsTable).values(data);
    return await this.getLastInsert(entityDocumentsTable, entityDocumentsTable.entityDocumentId, result.insertId);
  }
  async getEntityDocuments(): Promise<EntityDocument[]> { return await db.select().from(entityDocumentsTable); }
  async getEntityDocumentsByEntity(entityType: string, entityId: number): Promise<EntityDocument[]> {
    return await db.select().from(entityDocumentsTable).where(and(eq(entityDocumentsTable.entityType, entityType as any), eq(entityDocumentsTable.entityId, entityId)));
  }
  async updateEntityDocument(id: number, data: Partial<InsertEntityDocument>): Promise<EntityDocument | null> {
    await db.update(entityDocumentsTable).set(data).where(eq(entityDocumentsTable.entityDocumentId, id));
    const [res] = await db.select().from(entityDocumentsTable).where(eq(entityDocumentsTable.entityDocumentId, id));
    return res || null;
  }
  async deleteEntityDocument(id: number): Promise<void> { await db.delete(entityDocumentsTable).where(eq(entityDocumentsTable.entityDocumentId, id)); }

  // Clients (Mock)
  async createClient(data: any): Promise<any> { return data; }
  async getClients(): Promise<any[]> { return []; }
  async getClientById(id: number): Promise<any | null> { return null; }
  async updateClient(id: number, data: any): Promise<any | null> { return data; }
  async deleteClient(id: number): Promise<void> { }

  // Contracts & Versions
  async createContract(data: InsertContract): Promise<Contract> {
    const [result] = await db.insert(contractsTable).values(data);
    return await this.getLastInsert(contractsTable, contractsTable.contractId, result.insertId);
  }
  async getContracts(): Promise<Contract[]> { return await db.select().from(contractsTable).where(isNull(contractsTable.deletedAt)); }
  async getContractById(id: number): Promise<Contract | null> {
    const [contract] = await db.select().from(contractsTable).where(eq(contractsTable.contractId, id));
    return contract || null;
  }
  async updateContract(id: number, data: Partial<InsertContract>): Promise<Contract | null> {
    await db.update(contractsTable).set({ ...data, updatedAt: new Date() }).where(eq(contractsTable.contractId, id));
    return await this.getContractById(id);
  }
  async deleteContract(id: number): Promise<void> { await db.update(contractsTable).set({ deletedAt: new Date() }).where(eq(contractsTable.contractId, id)); }

  async createContractVersion(data: InsertContractVersion): Promise<ContractVersion> {
    const [result] = await db.insert(contractVersionTable).values(data);
    const version = await this.getLastInsert(contractVersionTable, contractVersionTable.contractVersionId, result.insertId);
    if (version.isCurrent) {
      await db.update(contractsTable).set({ currentVersionId: version.contractVersionId }).where(eq(contractsTable.contractId, version.contractId!));
    }
    return version;
  }
  async getCurrentContractVersion(contractId: number): Promise<ContractVersion | null> {
    const [version] = await db.select().from(contractVersionTable).where(and(eq(contractVersionTable.contractId, contractId), eq(contractVersionTable.isCurrent, true)));
    return version || null;
  }
  async createContractWithUser(contractData: InsertContract, userData?: any): Promise<{ contract: Contract; user?: SysUser }> {
    const contract = await this.createContract(contractData);
    return { contract };
  }

  // Beneficiaries
  async createBeneficiary(data: InsertBeneficiary): Promise<Beneficiary> {
    const [result] = await db.insert(beneficiariesTable).values(data);
    return await this.getLastInsert(beneficiariesTable, beneficiariesTable.beneficiaryId, result.insertId);
  }
  async getBeneficiaries(): Promise<Beneficiary[]> { return await db.select().from(beneficiariesTable).where(isNull(beneficiariesTable.deletedAt)); }
  async getBeneficiaryById(id: number): Promise<Beneficiary | null> {
    const [res] = await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.beneficiaryId, id));
    return res || null;
  }
  async getBeneficiariesByContract(contractId: number): Promise<Beneficiary[]> {
    const version = await this.getCurrentContractVersion(contractId);
    if (!version) return [];
    return await db.select().from(beneficiariesTable).where(eq(beneficiariesTable.contractVersionId, version.contractVersionId));
  }
  async updateBeneficiary(id: number, data: Partial<InsertBeneficiary>): Promise<Beneficiary | null> {
    await db.update(beneficiariesTable).set({ ...data, updatedAt: new Date() }).where(eq(beneficiariesTable.beneficiaryId, id));
    return await this.getBeneficiaryById(id);
  }
  async deleteBeneficiary(id: number): Promise<void> { await db.update(beneficiariesTable).set({ deletedAt: new Date() }).where(eq(beneficiariesTable.beneficiaryId, id)); }

  // Contract Charges
  async createContractCharge(data: InsertContractCharge): Promise<ContractCharge> {
    const [result] = await db.insert(contractChargeTable).values(data);
    return await this.getLastInsert(contractChargeTable, contractChargeTable.contractChargeId, result.insertId);
  }
  async getContractCharges(): Promise<ContractCharge[]> { return await db.select().from(contractChargeTable).where(isNull(contractChargeTable.deletedAt)); }
  async getContractChargeById(id: number): Promise<ContractCharge | null> {
    const [res] = await db.select().from(contractChargeTable).where(eq(contractChargeTable.contractChargeId, id));
    return res || null;
  }
  async getContractChargesByContract(contractId: number): Promise<ContractCharge[]> {
    const version = await this.getCurrentContractVersion(contractId);
    if (!version) return [];
    return await db.select().from(contractChargeTable).where(eq(contractChargeTable.contractVersionId, version.contractVersionId));
  }
  async updateContractCharge(id: number, data: Partial<InsertContractCharge>): Promise<ContractCharge | null> {
    await db.update(contractChargeTable).set({ ...data, updatedAt: new Date() }).where(eq(contractChargeTable.contractChargeId, id));
    return await this.getContractChargeById(id);
  }
  async deleteContractCharge(id: number): Promise<void> { await db.update(contractChargeTable).set({ deletedAt: new Date() }).where(eq(contractChargeTable.contractChargeId, id)); }

  // Legacy Charges
  async createCharge(data: InsertCharge): Promise<Charge> {
    const [result] = await db.insert(chargeTable).values(data);
    return await this.getLastInsert(chargeTable, chargeTable.chargeId, result.insertId);
  }
  async getCharges(): Promise<Charge[]> { return await db.select().from(chargeTable).where(isNull(chargeTable.deletedAt)); }
  async getChargeById(id: number): Promise<Charge | null> {
    const [res] = await db.select().from(chargeTable).where(eq(chargeTable.chargeId, id));
    return res || null;
  }
  async getChargesByContract(contractId: number): Promise<Charge[]> { return []; }
  async updateCharge(id: number, data: Partial<InsertCharge>): Promise<Charge | null> {
    await db.update(chargeTable).set({ ...data, updatedAt: new Date() }).where(eq(chargeTable.chargeId, id));
    return await this.getChargeById(id);
  }
  async deleteCharge(id: number): Promise<void> { await db.update(chargeTable).set({ deletedAt: new Date() }).where(eq(chargeTable.chargeId, id)); }

  // Addendums
  async createAddendum(data: InsertAddendum): Promise<Addendum> {
    const [result] = await db.insert(addendumTable).values(data);
    return await this.getLastInsert(addendumTable, addendumTable.addendumId, result.insertId);
  }
  async getAddendums(): Promise<Addendum[]> { return await db.select().from(addendumTable).where(isNull(addendumTable.deletedAt)); }
  async getAddendumById(id: number): Promise<Addendum | null> {
    const [res] = await db.select().from(addendumTable).where(eq(addendumTable.addendumId, id));
    return res || null;
  }
  async getAddendumsByContract(contractId: number): Promise<Addendum[]> { return []; }
  async updateAddendum(id: number, data: Partial<InsertAddendum>): Promise<Addendum | null> {
    await db.update(addendumTable).set({ ...data, updatedAt: new Date() }).where(eq(addendumTable.addendumId, id));
    return await this.getAddendumById(id);
  }
  async deleteAddendum(id: number): Promise<void> { await db.update(addendumTable).set({ deletedAt: new Date() }).where(eq(addendumTable.addendumId, id)); }

  // Batch CHK
  async createBatchChk(data: InsertBatchChk): Promise<BatchChk> {
    const [result] = await db.insert(batchChkTable).values(data);
    return await this.getLastInsert(batchChkTable, batchChkTable.batchChkId, result.insertId);
  }
  async getBatchChks(): Promise<BatchChk[]> { return await db.select().from(batchChkTable).where(isNull(batchChkTable.deletedAt)); }
  async getBatchChkById(id: number): Promise<BatchChk | null> {
    const [res] = await db.select().from(batchChkTable).where(eq(batchChkTable.batchChkId, id));
    return res || null;
  }
  async updateBatchChk(id: number, data: Partial<InsertBatchChk>): Promise<BatchChk | null> {
    await db.update(batchChkTable).set({ ...data, updatedAt: new Date() }).where(eq(batchChkTable.batchChkId, id));
    return await this.getBatchChkById(id);
  }
  async deleteBatchChk(id: number): Promise<void> { await db.update(batchChkTable).set({ deletedAt: new Date() }).where(eq(batchChkTable.batchChkId, id)); }

  // Batch Detail
  async createBatchDetail(data: InsertBatchDetail): Promise<BatchDetail> {
    const [result] = await db.insert(batchDetailTable).values(data);
    return await this.getLastInsert(batchDetailTable, batchDetailTable.batchDetailId, result.insertId);
  }
  async getBatchDetails(): Promise<BatchDetail[]> { return await db.select().from(batchDetailTable).where(isNull(batchDetailTable.deletedAt)); }
  async getBatchDetailById(id: number): Promise<BatchDetail | null> {
    const [res] = await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchDetailId, id));
    return res || null;
  }
  async getBatchDetailsByBatch(batchId: number): Promise<BatchDetail[]> { return await db.select().from(batchDetailTable).where(eq(batchDetailTable.batchChkId, batchId)); }
  async updateBatchDetail(id: number, data: Partial<InsertBatchDetail>): Promise<BatchDetail | null> {
    await db.update(batchDetailTable).set({ ...data, updatedAt: new Date() }).where(eq(batchDetailTable.batchDetailId, id));
    return await this.getBatchDetailById(id);
  }
  async deleteBatchDetail(id: number): Promise<void> { await db.update(batchDetailTable).set({ deletedAt: new Date() }).where(eq(batchDetailTable.batchDetailId, id)); }

  // Core System Tables
  async createGender(data: InsertGender): Promise<Gender> {
    const [result] = await db.insert(genderTable).values(data);
    return await this.getLastInsert(genderTable, genderTable.genderId, result.insertId);
  }
  async getGenders(): Promise<Gender[]> { return await db.select().from(genderTable); }
  async getGenderById(id: number): Promise<Gender | null> {
    const [res] = await db.select().from(genderTable).where(eq(genderTable.genderId, id));
    return res || null;
  }
  async updateGender(id: number, data: Partial<InsertGender>): Promise<Gender | null> {
    await db.update(genderTable).set(data).where(eq(genderTable.genderId, id));
    return await this.getGenderById(id);
  }
  async deleteGender(id: number): Promise<void> { await db.delete(genderTable).where(eq(genderTable.genderId, id)); }

  async createPaymentStatus(data: InsertPaymentStatus): Promise<PaymentStatus> {
    const [result] = await db.insert(paymentStatusTable).values(data);
    return await this.getLastInsert(paymentStatusTable, paymentStatusTable.paymentStatusId, result.insertId);
  }
  async getPaymentStatuses(): Promise<PaymentStatus[]> { return await db.select().from(paymentStatusTable); }
  async getPaymentStatusById(id: number): Promise<PaymentStatus | null> {
    const [res] = await db.select().from(paymentStatusTable).where(eq(paymentStatusTable.paymentStatusId, id));
    return res || null;
  }
  async updatePaymentStatus(id: number, data: Partial<InsertPaymentStatus>): Promise<PaymentStatus | null> {
    await db.update(paymentStatusTable).set(data).where(eq(paymentStatusTable.paymentStatusId, id));
    return await this.getPaymentStatusById(id);
  }
  async deletePaymentStatus(id: number): Promise<void> { await db.delete(paymentStatusTable).where(eq(paymentStatusTable.paymentStatusId, id)); }

  async createEstado(data: InsertEstado): Promise<Estado> {
    const [result] = await db.insert(estadoTable).values(data);
    return await this.getLastInsert(estadoTable, estadoTable.stateId, result.insertId);
  }
  async getEstados(): Promise<Estado[]> { return await db.select().from(estadoTable); }
  async getEstadoById(id: number): Promise<Estado | null> {
    const [res] = await db.select().from(estadoTable).where(eq(estadoTable.stateId, id));
    return res || null;
  }
  async updateEstado(id: number, data: Partial<InsertEstado>): Promise<Estado | null> {
    await db.update(estadoTable).set(data).where(eq(estadoTable.stateId, id));
    return await this.getEstadoById(id);
  }
  async deleteEstado(id: number): Promise<void> { await db.delete(estadoTable).where(eq(estadoTable.stateId, id)); }

  async createCidade(data: InsertCidade): Promise<Cidade> {
    const [result] = await db.insert(cidadeTable).values(data);
    return await this.getLastInsert(cidadeTable, cidadeTable.cityId, result.insertId);
  }
  async getCidades(): Promise<Cidade[]> { return await db.select().from(cidadeTable); }
  async getCidadeById(id: number): Promise<Cidade | null> {
    const [res] = await db.select().from(cidadeTable).where(eq(cidadeTable.cityId, id));
    return res || null;
  }
  async getCidadesByEstado(estadoId: number): Promise<Cidade[]> { return await db.select().from(cidadeTable).where(eq(cidadeTable.stateId, estadoId)); }
  async updateCidade(id: number, data: Partial<InsertCidade>): Promise<Cidade | null> {
    await db.update(cidadeTable).set(data).where(eq(cidadeTable.cityId, id));
    return await this.getCidadeById(id);
  }
  async deleteCidade(id: number): Promise<void> { await db.delete(cidadeTable).where(eq(cidadeTable.cityId, id)); }

  async createCurrency(data: InsertCurrency): Promise<Currency> {
    const [result] = await db.insert(currencyTable).values(data);
    return await this.getLastInsert(currencyTable, currencyTable.currencyId, result.insertId);
  }
  async getCurrencies(): Promise<Currency[]> { return await db.select().from(currencyTable); }
  async getCurrencyByCode(code: string): Promise<Currency | null> {
    const [res] = await db.select().from(currencyTable).where(eq(currencyTable.currencyCode, code));
    return res || null;
  }
  async updateCurrency(code: string, data: Partial<InsertCurrency>): Promise<Currency | null> {
    await db.update(currencyTable).set(data).where(eq(currencyTable.currencyCode, code));
    return await this.getCurrencyByCode(code);
  }
  async deleteCurrency(code: string): Promise<void> { await db.delete(currencyTable).where(eq(currencyTable.currencyCode, code)); }

  async createGeneralStatus(data: InsertGeneralStatus): Promise<GeneralStatus> {
    const [result] = await db.insert(generalStatusTable).values(data);
    return await this.getLastInsert(generalStatusTable, generalStatusTable.generalStatusId, result.insertId);
  }
  async getGeneralStatuses(): Promise<GeneralStatus[]> { return await db.select().from(generalStatusTable); }
  async getGeneralStatusById(id: number): Promise<GeneralStatus | null> {
    const [res] = await db.select().from(generalStatusTable).where(eq(generalStatusTable.generalStatusId, id));
    return res || null;
  }
  async updateGeneralStatus(id: number, data: Partial<InsertGeneralStatus>): Promise<GeneralStatus | null> {
    await db.update(generalStatusTable).set(data).where(eq(generalStatusTable.generalStatusId, id));
    return await this.getGeneralStatusById(id);
  }
  async deleteGeneralStatus(id: number): Promise<void> { await db.delete(generalStatusTable).where(eq(generalStatusTable.generalStatusId, id)); }

  async createCompany(data: InsertCompany): Promise<Company> {
    const [result] = await db.insert(companyTable).values(data);
    return await this.getLastInsert(companyTable, companyTable.companyId, result.insertId);
  }
  async getCompanies(): Promise<Company[]> { return await db.select().from(companyTable); }
  async getCompanyById(id: number): Promise<Company | null> {
    const [res] = await db.select().from(companyTable).where(eq(companyTable.companyId, id));
    return res || null;
  }
  async updateCompany(id: number, data: Partial<InsertCompany>): Promise<Company | null> {
    await db.update(companyTable).set(data).where(eq(companyTable.companyId, id));
    return await this.getCompanyById(id);
  }
  async deleteCompany(id: number): Promise<void> { await db.delete(companyTable).where(eq(companyTable.companyId, id)); }

  async createSubsidiary(data: InsertSubsidiary): Promise<Subsidiary> {
    const [result] = await db.insert(subsidiaryTable).values(data);
    return await this.getLastInsert(subsidiaryTable, subsidiaryTable.subsidiaryId, result.insertId);
  }
  async getSubsidiaries(): Promise<Subsidiary[]> { return await db.select().from(subsidiaryTable); }
  async getSubsidiaryById(id: number): Promise<Subsidiary | null> {
    const [res] = await db.select().from(subsidiaryTable).where(eq(subsidiaryTable.subsidiaryId, id));
    return res || null;
  }
  async updateSubsidiary(id: number, data: Partial<InsertSubsidiary>): Promise<Subsidiary | null> {
    await db.update(subsidiaryTable).set(data).where(eq(subsidiaryTable.subsidiaryId, id));
    return await this.getSubsidiaryById(id);
  }
  async deleteSubsidiary(id: number): Promise<void> { await db.delete(subsidiaryTable).where(eq(subsidiaryTable.subsidiaryId, id)); }

  async createSysUnit(data: InsertSysUnit): Promise<SysUnit> {
    const [result] = await db.insert(sysUnitTable).values(data);
    return await this.getLastInsert(sysUnitTable, sysUnitTable.sysUnitId, result.insertId);
  }
  async getSysUnits(): Promise<SysUnit[]> { return await db.select().from(sysUnitTable); }
  async getSysUnitById(id: number): Promise<SysUnit | null> {
    const [res] = await db.select().from(sysUnitTable).where(eq(sysUnitTable.sysUnitId, id));
    return res || null;
  }
  async updateSysUnit(id: number, data: Partial<InsertSysUnit>): Promise<SysUnit | null> {
    await db.update(sysUnitTable).set(data).where(eq(sysUnitTable.sysUnitId, id));
    return await this.getSysUnitById(id);
  }
  async deleteSysUnit(id: number): Promise<void> { await db.delete(sysUnitTable).where(eq(sysUnitTable.sysUnitId, id)); }

  async createClasse(data: InsertCategory): Promise<Category> {
    const [result] = await db.insert(categoryTable).values(data);
    return await this.getLastInsert(categoryTable, categoryTable.categoryId, result.insertId);
  }
  async getClasses(): Promise<Category[]> { return await db.select().from(categoryTable); }
  async getClasseById(id: number): Promise<Category | null> {
    const [res] = await db.select().from(categoryTable).where(eq(categoryTable.categoryId, id));
    return res || null;
  }
  async updateClasse(id: number, data: Partial<InsertCategory>): Promise<Category | null> {
    await db.update(categoryTable).set(data).where(eq(categoryTable.categoryId, id));
    return await this.getClasseById(id);
  }
  async deleteClasse(id: number): Promise<void> { await db.delete(categoryTable).where(eq(categoryTable.categoryId, id)); }

  async createGroupBatch(data: InsertGroupBatch): Promise<GroupBatch> {
    const [result] = await db.insert(groupBatchTable).values(data);
    return await this.getLastInsert(groupBatchTable, groupBatchTable.groupBatchId, result.insertId);
  }
  async getGroupBatches(): Promise<GroupBatch[]> { return await db.select().from(groupBatchTable); }
  async getGroupBatchById(id: number): Promise<GroupBatch | null> {
    const [res] = await db.select().from(groupBatchTable).where(eq(groupBatchTable.groupBatchId, id));
    return res || null;
  }
  async updateGroupBatch(id: number, data: Partial<InsertGroupBatch>): Promise<GroupBatch | null> {
    await db.update(groupBatchTable).set(data).where(eq(groupBatchTable.groupBatchId, id));
    return await this.getGroupBatchById(id);
  }
  async deleteGroupBatch(id: number): Promise<void> { await db.delete(groupBatchTable).where(eq(groupBatchTable.groupBatchId, id)); }

  // Financial module
  async getAccountTypes(): Promise<AccountType[]> { return await db.select().from(accountTypesTable); }
  async createAccountType(data: InsertAccountType): Promise<AccountType> {
    const [result] = await db.insert(accountTypesTable).values(data);
    return await this.getLastInsert(accountTypesTable, accountTypesTable.accountTypeId, result.insertId);
  }
  async getAccountTypeById(id: number): Promise<AccountType | null> {
    const [res] = await db.select().from(accountTypesTable).where(eq(accountTypesTable.accountTypeId, id));
    return res || null;
  }
  async updateAccountType(id: number, data: Partial<InsertAccountType>): Promise<AccountType | null> {
    await db.update(accountTypesTable).set(data).where(eq(accountTypesTable.accountTypeId, id));
    return await this.getAccountTypeById(id);
  }
  async deleteAccountType(id: number): Promise<void> { await db.delete(accountTypesTable).where(eq(accountTypesTable.accountTypeId, id)); }

  async getAccounts(): Promise<Account[]> { return await db.select().from(accountsTable); }
  async createAccount(data: InsertAccount): Promise<Account> {
    const [result] = await db.insert(accountsTable).values(data);
    return await this.getLastInsert(accountsTable, accountsTable.accountId, result.insertId);
  }
  async getAccountById(id: number): Promise<Account | null> {
    const [res] = await db.select().from(accountsTable).where(eq(accountsTable.accountId, id));
    return res || null;
  }
  async updateAccount(id: number, data: Partial<InsertAccount>): Promise<Account | null> {
    await db.update(accountsTable).set(data).where(eq(accountsTable.accountId, id));
    return await this.getAccountById(id);
  }
  async deleteAccount(id: number): Promise<void> { await db.delete(accountsTable).where(eq(accountsTable.accountId, id)); }

  async getCostCenters(): Promise<CostCenter[]> { return await db.select().from(costCentersTable); }
  async createCostCenter(data: InsertCostCenter): Promise<CostCenter> {
    const [result] = await db.insert(costCentersTable).values(data);
    return await this.getLastInsert(costCentersTable, costCentersTable.costCenterId, result.insertId);
  }
  async getCostCenterById(id: number): Promise<CostCenter | null> {
    const [res] = await db.select().from(costCentersTable).where(eq(costCentersTable.costCenterId, id));
    return res || null;
  }
  async updateCostCenter(id: number, data: Partial<InsertCostCenter>): Promise<CostCenter | null> {
    await db.update(costCentersTable).set(data).where(eq(costCentersTable.costCenterId, id));
    return await this.getCostCenterById(id);
  }
  async deleteCostCenter(id: number): Promise<void> { await db.delete(costCentersTable).where(eq(costCentersTable.costCenterId, id)); }

  async getDepartments(): Promise<Department[]> { return await db.select().from(departmentsTable); }
  async createDepartment(data: InsertDepartment): Promise<Department> {
    const [result] = await db.insert(departmentsTable).values(data);
    return await this.getLastInsert(departmentsTable, departmentsTable.departmentId, result.insertId);
  }
  async getDepartmentById(id: number): Promise<Department | null> {
    const [res] = await db.select().from(departmentsTable).where(eq(departmentsTable.departmentId, id));
    return res || null;
  }
  async updateDepartment(id: number, data: Partial<InsertDepartment>): Promise<Department | null> {
    await db.update(departmentsTable).set(data).where(eq(departmentsTable.departmentId, id));
    return await this.getDepartmentById(id);
  }
  async deleteDepartment(id: number): Promise<void> { await db.delete(departmentsTable).where(eq(departmentsTable.departmentId, id)); }

  async getProjects(): Promise<Project[]> { return await db.select().from(projectsTable); }
  async createProject(data: InsertProject): Promise<Project> {
    const [result] = await db.insert(projectsTable).values(data);
    return await this.getLastInsert(projectsTable, projectsTable.projectId, result.insertId);
  }
  async getProjectById(id: number): Promise<Project | null> {
    const [res] = await db.select().from(projectsTable).where(eq(projectsTable.projectId, id));
    return res || null;
  }
  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | null> {
    await db.update(projectsTable).set(data).where(eq(projectsTable.projectId, id));
    return await this.getProjectById(id);
  }
  async deleteProject(id: number): Promise<void> { await db.delete(projectsTable).where(eq(projectsTable.projectId, id)); }

  // Other missing methods
  async getContractNumberRegistries(): Promise<any[]> { return []; }
  async createContractNumberRegistry(data: any): Promise<any> { return data; }
  async getContractNumberRegistryById(id: number): Promise<any | null> { return null; }
  async getAvailableContractNumbers(groupBatchId: number): Promise<any[]> { return []; }
  async getNextAvailableContractNumber(groupBatchId: number): Promise<string | null> { return null; }
  async updateContractNumberRegistry(id: number, data: any): Promise<any | null> { return data; }
  async deleteContractNumberRegistry(id: number): Promise<void> { }
  async initializeGroupContractNumbers(groupBatchId: number, start: number, end: number): Promise<void> { }
  async changeContractStatus(id: number, status: string, reason: string, desc?: string): Promise<void> { }
  async assignContractNumber(num: string, id: number): Promise<any> { return {}; }
  async releaseContractNumber(num: string): Promise<any> { return {}; }
  async getContractStatusHistories(): Promise<any[]> { return []; }
  async createContractStatusHistory(data: any): Promise<any> { return data; }
  async getContractStatusHistoryById(id: number): Promise<any | null> { return null; }
  async getContractStatusHistoryByContract(id: number): Promise<any[]> { return []; }
  async updateContractStatusHistory(id: number, data: any): Promise<any | null> { return data; }
  async deleteContractStatusHistory(id: number): Promise<void> { }

  async getPaymentReceipts(): Promise<PaymentReceipt[]> { return await db.select().from(paymentReceiptTable); }
  async createPaymentReceipt(data: InsertPaymentReceipt): Promise<PaymentReceipt> {
    const [result] = await db.insert(paymentReceiptTable).values(data);
    return await this.getLastInsert(paymentReceiptTable, paymentReceiptTable.paymentReceiptId, result.insertId);
  }
  async getPaymentReceiptById(id: number): Promise<PaymentReceipt | null> {
    const [res] = await db.select().from(paymentReceiptTable).where(eq(paymentReceiptTable.paymentReceiptId, id));
    return res || null;
  }
  async updatePaymentReceipt(id: number, data: Partial<InsertPaymentReceipt>): Promise<PaymentReceipt | null> {
    await db.update(paymentReceiptTable).set(data).where(eq(paymentReceiptTable.paymentReceiptId, id));
    return await this.getPaymentReceiptById(id);
  }
  async deletePaymentReceipt(id: number): Promise<void> { await db.delete(paymentReceiptTable).where(eq(paymentReceiptTable.paymentReceiptId, id)); }

  async getCarteirinhas(): Promise<any[]> { return await db.select().from(membershipCardTable); }
  async createCarteirinha(data: any): Promise<any> {
    const [result] = await db.insert(membershipCardTable).values(data);
    return await this.getLastInsert(membershipCardTable, membershipCardTable.membershipCardId, result.insertId);
  }
  async getCarteirinhaById(id: number): Promise<any | null> {
    const [res] = await db.select().from(membershipCardTable).where(eq(membershipCardTable.membershipCardId, id));
    return res || null;
  }
  async updateCarteirinha(id: number, data: any): Promise<any | null> {
    await db.update(membershipCardTable).set(data).where(eq(membershipCardTable.membershipCardId, id));
    return await this.getCarteirinhaById(id);
  }
  async deleteCarteirinha(id: number): Promise<void> { await db.delete(membershipCardTable).where(eq(membershipCardTable.membershipCardId, id)); }

  async getMedicalForwards(): Promise<MedicalForward[]> { return await db.select().from(medicalForwardTable); }
  async createMedicalForward(data: InsertMedicalForward): Promise<MedicalForward> {
    const [result] = await db.insert(medicalForwardTable).values(data);
    return await this.getLastInsert(medicalForwardTable, medicalForwardTable.medicalForwardId, result.insertId);
  }
  async getMedicalForwardById(id: number): Promise<MedicalForward | null> {
    const [res] = await db.select().from(medicalForwardTable).where(eq(medicalForwardTable.medicalForwardId, id));
    return res || null;
  }
  async updateMedicalForward(id: number, data: Partial<InsertMedicalForward>): Promise<MedicalForward | null> {
    await db.update(medicalForwardTable).set(data).where(eq(medicalForwardTable.medicalForwardId, id));
    return await this.getMedicalForwardById(id);
  }
  async deleteMedicalForward(id: number): Promise<void> { await db.delete(medicalForwardTable).where(eq(medicalForwardTable.medicalForwardId, id)); }
}

export const storage = new MySQLStorage();
