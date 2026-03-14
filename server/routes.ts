import { Router } from "express";
import { storage } from "./storage";
import {
  insertSysUserSchema,
  insertAddressTypeSchema,
  insertAddressSchema,
  insertEntityAddressSchema,
  insertPartnerTypeSchema,
  insertPartnerSchema,
  insertDocumentTypeSchema,
  insertDocumentSchema,
  insertEntityDocumentSchema,
  insertClientSchema,
  insertContractSchema,
  insertBeneficiarySchema,
  insertChargeSchema,
  insertAddendumSchema,
  insertBatchChkSchema,
  insertBatchDetailSchema,
  insertContractChargeSchema,
  insertGenderSchema,
  insertPaymentStatusSchema,
  insertEstadoSchema,
  insertCidadeSchema,
  insertCurrencySchema,
  insertGeneralStatusSchema,
  insertCompanySchema,
  insertSubsidiarySchema,
  insertSysUnitSchema,
  insertClasseSchema,
  insertGroupBatchSchema,
  // Financial schemas
  insertAccountTypeSchema,
  insertAccountSchema,
  insertCostCenterSchema,
  insertDepartmentSchema,
  insertProjectSchema,
  insertFiscalYearSchema,
  insertFiscalPeriodSchema,
  insertContractNumberRegistrySchema,
  insertContractStatusHistorySchema,
  insertPaymentReceiptSchema,
  insertCarteirinhaSchema,
  insertMedicalForwardSchema,
} from "../shared/schema";

const router = Router();

// Utility function for error handling
const handleError = (res: any, error: any) => {
  console.error("API Error:", error);
  res.status(500).json({ error: "Internal server error" });
};

// System Users Routes
router.get("/api/sys-users", async (req, res) => {
  try {
    const users = await storage.getSysUsers();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/sys-users/:id", async (req, res) => {
  try {
    const user = await storage.getSysUserById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/sys-users", async (req, res) => {
  try {
    const data = insertSysUserSchema.parse(req.body);
    const user = await storage.createSysUser(data);
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/sys-users/:id", async (req, res) => {
  try {
    const data = insertSysUserSchema.partial().parse(req.body);
    const user = await storage.updateSysUser(parseInt(req.params.id), data);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/sys-users/:id", async (req, res) => {
  try {
    await storage.deleteSysUser(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Address Types Routes
router.get("/api/address-types", async (req, res) => {
  try {
    const addressTypes = await storage.getAddressTypes();
    res.json(addressTypes);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/address-types/:id", async (req, res) => {
  try {
    const addressType = await storage.getAddressTypeById(parseInt(req.params.id));
    if (!addressType) {
      return res.status(404).json({ error: "Address type not found" });
    }
    res.json(addressType);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/address-types", async (req, res) => {
  try {
    const data = insertAddressTypeSchema.parse(req.body);
    const addressType = await storage.createAddressType(data);
    res.status(201).json(addressType);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/address-types/:id", async (req, res) => {
  try {
    const data = insertAddressTypeSchema.partial().parse(req.body);
    const addressType = await storage.updateAddressType(parseInt(req.params.id), data);
    if (!addressType) {
      return res.status(404).json({ error: "Address type not found" });
    }
    res.json(addressType);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/address-types/:id", async (req, res) => {
  try {
    await storage.deleteAddressType(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Partner Types Routes
router.get("/api/partner-types", async (req, res) => {
  try {
    const partnerTypes = await storage.getPartnerTypes();
    res.json(partnerTypes);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/partner-types/:id", async (req, res) => {
  try {
    const partnerType = await storage.getPartnerTypeById(parseInt(req.params.id));
    if (!partnerType) {
      return res.status(404).json({ error: "Partner type not found" });
    }
    res.json(partnerType);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/partner-types", async (req, res) => {
  try {
    const data = insertPartnerTypeSchema.parse(req.body);
    const partnerType = await storage.createPartnerType(data);
    res.status(201).json(partnerType);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/partner-types/:id", async (req, res) => {
  try {
    const data = insertPartnerTypeSchema.partial().parse(req.body);
    const partnerType = await storage.updatePartnerType(parseInt(req.params.id), data);
    if (!partnerType) {
      return res.status(404).json({ error: "Partner type not found" });
    }
    res.json(partnerType);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/partner-types/:id", async (req, res) => {
  try {
    await storage.deletePartnerType(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Partners Routes
router.get("/api/partners", async (req, res) => {
  try {
    const partners = await storage.getPartners();
    res.json(partners);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/partners/:id", async (req, res) => {
  try {
    const partner = await storage.getPartnerById(parseInt(req.params.id));
    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }
    res.json(partner);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/partners", async (req, res) => {
  try {
    const data = insertPartnerSchema.parse(req.body);
    const partner = await storage.createPartner(data);
    res.status(201).json(partner);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/partners/:id", async (req, res) => {
  try {
    const data = insertPartnerSchema.partial().parse(req.body);
    const partner = await storage.updatePartner(parseInt(req.params.id), data);
    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }
    res.json(partner);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/partners/:id", async (req, res) => {
  try {
    await storage.deletePartner(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Document Types Routes
router.get("/api/document-types", async (req, res) => {
  try {
    const documentTypes = await storage.getDocumentTypes();
    res.json(documentTypes);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/document-types/:id", async (req, res) => {
  try {
    const documentType = await storage.getDocumentTypeById(parseInt(req.params.id));
    if (!documentType) {
      return res.status(404).json({ error: "Document type not found" });
    }
    res.json(documentType);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/document-types", async (req, res) => {
  try {
    const data = insertDocumentTypeSchema.parse(req.body);
    const documentType = await storage.createDocumentType(data);
    res.status(201).json(documentType);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/document-types/:id", async (req, res) => {
  try {
    const data = insertDocumentTypeSchema.partial().parse(req.body);
    const documentType = await storage.updateDocumentType(parseInt(req.params.id), data);
    if (!documentType) {
      return res.status(404).json({ error: "Document type not found" });
    }
    res.json(documentType);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/document-types/:id", async (req, res) => {
  try {
    await storage.deleteDocumentType(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Clients Routes
router.get("/api/clients", async (req, res) => {
  try {
    const clients = await storage.getClients();
    res.json(clients);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/clients/:id", async (req, res) => {
  try {
    const client = await storage.getClientById(parseInt(req.params.id));
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/clients", async (req, res) => {
  try {
    const data = insertClientSchema.parse(req.body);
    const client = await storage.createClient(data);
    res.status(201).json(client);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/clients/:id", async (req, res) => {
  try {
    const data = insertClientSchema.partial().parse(req.body);
    const client = await storage.updateClient(parseInt(req.params.id), data);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/clients/:id", async (req, res) => {
  try {
    await storage.deleteClient(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Batch CHK Routes
router.get("/api/batch-chks", async (req, res) => {
  try {
    const batchChks = await storage.getBatchChks();
    res.json(batchChks);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/batch-chks/:id", async (req, res) => {
  try {
    const batchChk = await storage.getBatchChkById(parseInt(req.params.id));
    if (!batchChk) {
      return res.status(404).json({ error: "Batch CHK not found" });
    }
    res.json(batchChk);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/batch-chks", async (req, res) => {
  try {
    const data = insertBatchChkSchema.parse(req.body);
    const batchChk = await storage.createBatchChk(data);
    res.status(201).json(batchChk);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/batch-chks/:id", async (req, res) => {
  try {
    const data = insertBatchChkSchema.partial().parse(req.body);
    const batchChk = await storage.updateBatchChk(parseInt(req.params.id), data);
    if (!batchChk) {
      return res.status(404).json({ error: "Batch CHK not found" });
    }
    res.json(batchChk);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/batch-chks/:id", async (req, res) => {
  try {
    await storage.deleteBatchChk(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Batch Details Routes
router.get("/api/batch-details", async (req, res) => {
  try {
    const batchDetails = await storage.getBatchDetails();
    res.json(batchDetails);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/batch-details/:id", async (req, res) => {
  try {
    const batchDetail = await storage.getBatchDetailById(parseInt(req.params.id));
    if (!batchDetail) {
      return res.status(404).json({ error: "Batch detail not found" });
    }
    res.json(batchDetail);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/batch-details/batch/:batchId", async (req, res) => {
  try {
    const batchDetails = await storage.getBatchDetailsByBatch(parseInt(req.params.batchId));
    res.json(batchDetails);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/batch-details", async (req, res) => {
  try {
    const data = insertBatchDetailSchema.parse(req.body);
    const batchDetail = await storage.createBatchDetail(data);
    res.status(201).json(batchDetail);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/batch-details/:id", async (req, res) => {
  try {
    const data = insertBatchDetailSchema.partial().parse(req.body);
    const batchDetail = await storage.updateBatchDetail(parseInt(req.params.id), data);
    if (!batchDetail) {
      return res.status(404).json({ error: "Batch detail not found" });
    }
    res.json(batchDetail);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/batch-details/:id", async (req, res) => {
  try {
    await storage.deleteBatchDetail(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Contract Charges Routes
router.get("/api/contract-charges", async (req, res) => {
  try {
    const contractCharges = await storage.getContractCharges();
    res.json(contractCharges);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contract-charges/:id", async (req, res) => {
  try {
    const contractCharge = await storage.getContractChargeById(parseInt(req.params.id));
    if (!contractCharge) {
      return res.status(404).json({ error: "Contract charge not found" });
    }
    res.json(contractCharge);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contract-charges", async (req, res) => {
  try {
    const data = insertContractChargeSchema.parse(req.body);
    const contractCharge = await storage.createContractCharge(data);
    res.status(201).json(contractCharge);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/contract-charges/:id", async (req, res) => {
  try {
    const data = insertContractChargeSchema.partial().parse(req.body);
    const contractCharge = await storage.updateContractCharge(parseInt(req.params.id), data);
    if (!contractCharge) {
      return res.status(404).json({ error: "Contract charge not found" });
    }
    res.json(contractCharge);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/contract-charges/:id", async (req, res) => {
  try {
    await storage.deleteContractCharge(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Core System Tables Routes

// Genders Routes
router.get("/api/genders", async (req, res) => {
  try {
    const genders = await storage.getGenders();
    res.json(genders);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/genders", async (req, res) => {
  try {
    const data = insertGenderSchema.parse(req.body);
    const gender = await storage.createGender(data);
    res.status(201).json(gender);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/genders/:id", async (req, res) => {
  try {
    const data = insertGenderSchema.partial().parse(req.body);
    const gender = await storage.updateGender(parseInt(req.params.id), data);
    if (!gender) {
      return res.status(404).json({ error: "Gender not found" });
    }
    res.json(gender);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/genders/:id", async (req, res) => {
  try {
    await storage.deleteGender(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Payment Status Routes
router.get("/api/payment-statuses", async (req, res) => {
  try {
    const paymentStatuses = await storage.getPaymentStatuses();
    res.json(paymentStatuses);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/payment-statuses", async (req, res) => {
  try {
    const data = insertPaymentStatusSchema.parse(req.body);
    const paymentStatus = await storage.createPaymentStatus(data);
    res.status(201).json(paymentStatus);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/payment-statuses/:id", async (req, res) => {
  try {
    const data = insertPaymentStatusSchema.partial().parse(req.body);
    const paymentStatus = await storage.updatePaymentStatus(parseInt(req.params.id), data);
    if (!paymentStatus) {
      return res.status(404).json({ error: "Payment status not found" });
    }
    res.json(paymentStatus);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/payment-statuses/:id", async (req, res) => {
  try {
    await storage.deletePaymentStatus(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Estados Routes
router.get("/api/estados", async (req, res) => {
  try {
    const estados = await storage.getEstados();
    res.json(estados);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/estados", async (req, res) => {
  try {
    const data = insertEstadoSchema.parse(req.body);
    const estado = await storage.createEstado(data);
    res.status(201).json(estado);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/estados/:id", async (req, res) => {
  try {
    const data = insertEstadoSchema.partial().parse(req.body);
    const estado = await storage.updateEstado(parseInt(req.params.id), data);
    if (!estado) {
      return res.status(404).json({ error: "Estado not found" });
    }
    res.json(estado);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/estados/:id", async (req, res) => {
  try {
    await storage.deleteEstado(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Cidades Routes
router.get("/api/cidades", async (req, res) => {
  try {
    const cidades = await storage.getCidades();
    res.json(cidades);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/cidades/estado/:estadoId", async (req, res) => {
  try {
    const cidades = await storage.getCidadesByEstado(parseInt(req.params.estadoId));
    res.json(cidades);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/cidades", async (req, res) => {
  try {
    const data = insertCidadeSchema.parse(req.body);
    const cidade = await storage.createCidade(data);
    res.status(201).json(cidade);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/cidades/:id", async (req, res) => {
  try {
    const data = insertCidadeSchema.partial().parse(req.body);
    const cidade = await storage.updateCidade(parseInt(req.params.id), data);
    if (!cidade) {
      return res.status(404).json({ error: "Cidade not found" });
    }
    res.json(cidade);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/cidades/:id", async (req, res) => {
  try {
    await storage.deleteCidade(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Currencies Routes
router.get("/api/currencies", async (req, res) => {
  try {
    const currencies = await storage.getCurrencies();
    res.json(currencies);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/currencies", async (req, res) => {
  try {
    const data = insertCurrencySchema.parse(req.body);
    const currency = await storage.createCurrency(data);
    res.status(201).json(currency);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/currencies/:code", async (req, res) => {
  try {
    const data = insertCurrencySchema.partial().parse(req.body);
    const currency = await storage.updateCurrency(req.params.code, data);
    if (!currency) {
      return res.status(404).json({ error: "Currency not found" });
    }
    res.json(currency);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/currencies/:code", async (req, res) => {
  try {
    await storage.deleteCurrency(req.params.code);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// General Status Routes
router.get("/api/general-statuses", async (req, res) => {
  try {
    const generalStatuses = await storage.getGeneralStatuses();
    res.json(generalStatuses);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/general-statuses", async (req, res) => {
  try {
    const data = insertGeneralStatusSchema.parse(req.body);
    const generalStatus = await storage.createGeneralStatus(data);
    res.status(201).json(generalStatus);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/general-statuses/:id", async (req, res) => {
  try {
    const data = insertGeneralStatusSchema.partial().parse(req.body);
    const generalStatus = await storage.updateGeneralStatus(parseInt(req.params.id), data);
    if (!generalStatus) {
      return res.status(404).json({ error: "General status not found" });
    }
    res.json(generalStatus);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/general-statuses/:id", async (req, res) => {
  try {
    await storage.deleteGeneralStatus(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Companies Routes
router.get("/api/companies", async (req, res) => {
  try {
    const companies = await storage.getCompanies();
    res.json(companies);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/companies", async (req, res) => {
  try {
    const data = insertCompanySchema.parse(req.body);
    const company = await storage.createCompany(data);
    res.status(201).json(company);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/companies/:id", async (req, res) => {
  try {
    const data = insertCompanySchema.partial().parse(req.body);
    const company = await storage.updateCompany(parseInt(req.params.id), data);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/companies/:id", async (req, res) => {
  try {
    await storage.deleteCompany(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Subsidiaries Routes
router.get("/api/subsidiaries", async (req, res) => {
  try {
    const subsidiaries = await storage.getSubsidiaries();
    res.json(subsidiaries);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/subsidiaries", async (req, res) => {
  try {
    const data = insertSubsidiarySchema.parse(req.body);
    const subsidiary = await storage.createSubsidiary(data);
    res.status(201).json(subsidiary);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/subsidiaries/:id", async (req, res) => {
  try {
    const data = insertSubsidiarySchema.partial().parse(req.body);
    const subsidiary = await storage.updateSubsidiary(parseInt(req.params.id), data);
    if (!subsidiary) {
      return res.status(404).json({ error: "Subsidiary not found" });
    }
    res.json(subsidiary);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/subsidiaries/:id", async (req, res) => {
  try {
    await storage.deleteSubsidiary(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// System Units Routes
router.get("/api/sys-units", async (req, res) => {
  try {
    const sysUnits = await storage.getSysUnits();
    res.json(sysUnits);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/sys-units", async (req, res) => {
  try {
    const data = insertSysUnitSchema.parse(req.body);
    const sysUnit = await storage.createSysUnit(data);
    res.status(201).json(sysUnit);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/sys-units/:id", async (req, res) => {
  try {
    const data = insertSysUnitSchema.partial().parse(req.body);
    const sysUnit = await storage.updateSysUnit(parseInt(req.params.id), data);
    if (!sysUnit) {
      return res.status(404).json({ error: "System unit not found" });
    }
    res.json(sysUnit);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/sys-units/:id", async (req, res) => {
  try {
    await storage.deleteSysUnit(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Classes Routes
router.get("/api/classes", async (req, res) => {
  try {
    const classes = await storage.getClasses();
    res.json(classes);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/classes", async (req, res) => {
  try {
    const data = insertClasseSchema.parse(req.body);
    const classe = await storage.createClasse(data);
    res.status(201).json(classe);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/classes/:id", async (req, res) => {
  try {
    const data = insertClasseSchema.partial().parse(req.body);
    const classe = await storage.updateClasse(parseInt(req.params.id), data);
    if (!classe) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classe);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/classes/:id", async (req, res) => {
  try {
    await storage.deleteClasse(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Group Batches Routes
router.get("/api/group-batches", async (req, res) => {
  try {
    const groupBatches = await storage.getGroupBatches();
    res.json(groupBatches);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/group-batches", async (req, res) => {
  try {
    const data = insertGroupBatchSchema.parse(req.body);
    const groupBatch = await storage.createGroupBatch(data);
    res.status(201).json(groupBatch);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/group-batches/:id", async (req, res) => {
  try {
    const data = insertGroupBatchSchema.partial().parse(req.body);
    const groupBatch = await storage.updateGroupBatch(parseInt(req.params.id), data);
    if (!groupBatch) {
      return res.status(404).json({ error: "Group batch not found" });
    }
    res.json(groupBatch);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/group-batches/:id", async (req, res) => {
  try {
    await storage.deleteGroupBatch(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Contract-related Routes
router.get("/api/contracts", async (req, res) => {
  try {
    const contracts = await storage.getContracts();
    res.json(contracts);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contracts/:id", async (req, res) => {
  try {
    const contract = await storage.getContractById(parseInt(req.params.id));
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.json(contract);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contracts", async (req, res) => {
  try {
    const { createUserAccount, ownerEmail, ownerPassword, contractName, ...contractData } = req.body;
    const data = insertContractSchema.parse(contractData);
    
    // If user account creation is requested, use createContractWithUser
    if (createUserAccount && ownerEmail && ownerPassword && contractName) {
      const userData = {
        email: ownerEmail,
        password: ownerPassword,
        name: contractName
      };
      const result = await storage.createContractWithUser(data, userData);
      res.status(201).json({
        contract: result.contract,
        user: result.user,
        message: result.user ? "Contract and user created successfully" : "Contract created, but user creation failed"
      });
    } else {
      // Standard contract creation without user
      const contract = await storage.createContract(data);
      res.status(201).json({ contract });
    }
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/contracts/:id", async (req, res) => {
  try {
    const data = insertContractSchema.partial().parse(req.body);
    const contract = await storage.updateContract(parseInt(req.params.id), data);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.json(contract);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/contracts/:id", async (req, res) => {
  try {
    await storage.deleteContract(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Beneficiaries Routes
router.get("/api/beneficiaries", async (req, res) => {
  try {
    const beneficiaries = await storage.getBeneficiaries();
    res.json(beneficiaries);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contracts/:id/beneficiaries", async (req, res) => {
  try {
    const beneficiaries = await storage.getBeneficiariesByContract(parseInt(req.params.id));
    res.json(beneficiaries);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contracts/:id/charges", async (req, res) => {
  try {
    const charges = await storage.getContractChargesByContract(parseInt(req.params.id));
    res.json(charges);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contracts/:id/addendums", async (req, res) => {
  try {
    const addendums = await storage.getAddendumsByContract(parseInt(req.params.id));
    res.json(addendums);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/beneficiaries/contract/:contractId", async (req, res) => {
  try {
    const beneficiaries = await storage.getBeneficiariesByContract(parseInt(req.params.contractId));
    res.json(beneficiaries);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/beneficiaries", async (req, res) => {
  try {
    const data = insertBeneficiarySchema.parse(req.body);
    const beneficiary = await storage.createBeneficiary(data);
    res.status(201).json(beneficiary);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/beneficiaries/:id", async (req, res) => {
  try {
    const data = insertBeneficiarySchema.partial().parse(req.body);
    const beneficiary = await storage.updateBeneficiary(parseInt(req.params.id), data);
    if (!beneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }
    res.json(beneficiary);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/beneficiaries/:id", async (req, res) => {
  try {
    await storage.deleteBeneficiary(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Charges Routes
router.get("/api/charges", async (req, res) => {
  try {
    const charges = await storage.getCharges();
    res.json(charges);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/charges/contract/:contractId", async (req, res) => {
  try {
    const charges = await storage.getChargesByContract(parseInt(req.params.contractId));
    res.json(charges);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/charges", async (req, res) => {
  try {
    const data = insertChargeSchema.parse(req.body);
    const charge = await storage.createCharge(data);
    res.status(201).json(charge);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/charges/:id", async (req, res) => {
  try {
    const data = insertChargeSchema.partial().parse(req.body);
    const charge = await storage.updateCharge(parseInt(req.params.id), data);
    if (!charge) {
      return res.status(404).json({ error: "Charge not found" });
    }
    res.json(charge);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/charges/:id", async (req, res) => {
  try {
    await storage.deleteCharge(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Addendums Routes
router.get("/api/addendums", async (req, res) => {
  try {
    const addendums = await storage.getAddendums();
    res.json(addendums);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/addendums/contract/:contractId", async (req, res) => {
  try {
    const addendums = await storage.getAddendumsByContract(parseInt(req.params.contractId));
    res.json(addendums);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/addendums", async (req, res) => {
  try {
    const data = insertAddendumSchema.parse(req.body);
    const addendum = await storage.createAddendum(data);
    res.status(201).json(addendum);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/addendums/:id", async (req, res) => {
  try {
    const data = insertAddendumSchema.partial().parse(req.body);
    const addendum = await storage.updateAddendum(parseInt(req.params.id), data);
    if (!addendum) {
      return res.status(404).json({ error: "Addendum not found" });
    }
    res.json(addendum);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/addendums/:id", async (req, res) => {
  try {
    await storage.deleteAddendum(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Addresses Routes
router.get("/api/addresses", async (req, res) => {
  try {
    const addresses = await storage.getAddresses();
    res.json(addresses);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/addresses", async (req, res) => {
  try {
    const data = insertAddressSchema.parse(req.body);
    const address = await storage.createAddress(data);
    res.status(201).json(address);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/addresses/:id", async (req, res) => {
  try {
    const data = insertAddressSchema.partial().parse(req.body);
    const address = await storage.updateAddress(parseInt(req.params.id), data);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/addresses/:id", async (req, res) => {
  try {
    await storage.deleteAddress(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Entity Addresses Routes
router.get("/api/entity-addresses", async (req, res) => {
  try {
    const entityAddresses = await storage.getEntityAddresses();
    res.json(entityAddresses);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/entity-addresses/:entityType/:entityId", async (req, res) => {
  try {
    const entityAddresses = await storage.getEntityAddressesByEntity(req.params.entityType, parseInt(req.params.entityId));
    res.json(entityAddresses);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/entity-addresses", async (req, res) => {
  try {
    const data = insertEntityAddressSchema.parse(req.body);
    const entityAddress = await storage.createEntityAddress(data);
    res.status(201).json(entityAddress);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/entity-addresses/:id", async (req, res) => {
  try {
    const data = insertEntityAddressSchema.partial().parse(req.body);
    const entityAddress = await storage.updateEntityAddress(parseInt(req.params.id), data);
    if (!entityAddress) {
      return res.status(404).json({ error: "Entity address not found" });
    }
    res.json(entityAddress);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/entity-addresses/:id", async (req, res) => {
  try {
    await storage.deleteEntityAddress(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Documents Routes
router.get("/api/documents", async (req, res) => {
  try {
    const documents = await storage.getDocuments();
    res.json(documents);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/documents", async (req, res) => {
  try {
    const data = insertDocumentSchema.parse(req.body);
    const document = await storage.createDocument(data);
    res.status(201).json(document);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/documents/:id", async (req, res) => {
  try {
    const data = insertDocumentSchema.partial().parse(req.body);
    const document = await storage.updateDocument(parseInt(req.params.id), data);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(document);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/documents/:id", async (req, res) => {
  try {
    await storage.deleteDocument(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Entity Documents Routes
router.get("/api/entity-documents", async (req, res) => {
  try {
    const entityDocuments = await storage.getEntityDocuments();
    res.json(entityDocuments);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/entity-documents/:entityType/:entityId", async (req, res) => {
  try {
    const entityDocuments = await storage.getEntityDocumentsByEntity(req.params.entityType, parseInt(req.params.entityId));
    res.json(entityDocuments);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/entity-documents", async (req, res) => {
  try {
    const data = insertEntityDocumentSchema.parse(req.body);
    const entityDocument = await storage.createEntityDocument(data);
    res.status(201).json(entityDocument);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/entity-documents/:id", async (req, res) => {
  try {
    const data = insertEntityDocumentSchema.partial().parse(req.body);
    const entityDocument = await storage.updateEntityDocument(parseInt(req.params.id), data);
    if (!entityDocument) {
      return res.status(404).json({ error: "Entity document not found" });
    }
    res.json(entityDocument);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/entity-documents/:id", async (req, res) => {
  try {
    await storage.deleteEntityDocument(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// =======================================================================================
// FINANCIAL MODULE ROUTES
// =======================================================================================

// Account Types Routes
router.get("/api/financial/account-types", async (req, res) => {
  try {
    const accountTypes = await storage.getAccountTypes();
    res.json(accountTypes);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/financial/account-types", async (req, res) => {
  try {
    const data = insertAccountTypeSchema.parse(req.body);
    const accountType = await storage.createAccountType(data);
    res.status(201).json(accountType);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/financial/account-types/:id", async (req, res) => {
  try {
    const accountType = await storage.getAccountTypeById(parseInt(req.params.id));
    if (!accountType) {
      return res.status(404).json({ error: "Account type not found" });
    }
    res.json(accountType);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/financial/account-types/:id", async (req, res) => {
  try {
    const data = insertAccountTypeSchema.partial().parse(req.body);
    const accountType = await storage.updateAccountType(parseInt(req.params.id), data);
    if (!accountType) {
      return res.status(404).json({ error: "Account type not found" });
    }
    res.json(accountType);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/financial/account-types/:id", async (req, res) => {
  try {
    await storage.deleteAccountType(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Accounts Routes (Chart of Accounts)
router.get("/api/financial/accounts", async (req, res) => {
  try {
    const accounts = await storage.getAccounts();
    res.json(accounts);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/financial/accounts", async (req, res) => {
  try {
    const data = insertAccountSchema.parse(req.body);
    const account = await storage.createAccount(data);
    res.status(201).json(account);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/financial/accounts/:id", async (req, res) => {
  try {
    const account = await storage.getAccountById(parseInt(req.params.id));
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(account);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/financial/accounts/:id", async (req, res) => {
  try {
    const data = insertAccountSchema.partial().parse(req.body);
    const account = await storage.updateAccount(parseInt(req.params.id), data);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(account);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/financial/accounts/:id", async (req, res) => {
  try {
    await storage.deleteAccount(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Cost Centers Routes
router.get("/api/financial/cost-centers", async (req, res) => {
  try {
    const costCenters = await storage.getCostCenters();
    res.json(costCenters);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/financial/cost-centers", async (req, res) => {
  try {
    const data = insertCostCenterSchema.parse(req.body);
    const costCenter = await storage.createCostCenter(data);
    res.status(201).json(costCenter);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/financial/cost-centers/:id", async (req, res) => {
  try {
    const costCenter = await storage.getCostCenterById(parseInt(req.params.id));
    if (!costCenter) {
      return res.status(404).json({ error: "Cost center not found" });
    }
    res.json(costCenter);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/financial/cost-centers/:id", async (req, res) => {
  try {
    const data = insertCostCenterSchema.partial().parse(req.body);
    const costCenter = await storage.updateCostCenter(parseInt(req.params.id), data);
    if (!costCenter) {
      return res.status(404).json({ error: "Cost center not found" });
    }
    res.json(costCenter);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/financial/cost-centers/:id", async (req, res) => {
  try {
    await storage.deleteCostCenter(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Departments Routes
router.get("/api/financial/departments", async (req, res) => {
  try {
    const departments = await storage.getDepartments();
    res.json(departments);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/financial/departments", async (req, res) => {
  try {
    const data = insertDepartmentSchema.parse(req.body);
    const department = await storage.createDepartment(data);
    res.status(201).json(department);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/financial/departments/:id", async (req, res) => {
  try {
    const department = await storage.getDepartmentById(parseInt(req.params.id));
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/financial/departments/:id", async (req, res) => {
  try {
    const data = insertDepartmentSchema.partial().parse(req.body);
    const department = await storage.updateDepartment(parseInt(req.params.id), data);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/financial/departments/:id", async (req, res) => {
  try {
    await storage.deleteDepartment(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Projects routes
router.get("/api/financial/projects", async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.json(projects);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/financial/projects", async (req, res) => {
  try {
    const data = insertProjectSchema.parse(req.body);
    const project = await storage.createProject(data);
    res.status(201).json(project);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/financial/projects/:id", async (req, res) => {
  try {
    const project = await storage.getProjectById(parseInt(req.params.id));
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/api/financial/projects/:id", async (req, res) => {
  try {
    const data = insertProjectSchema.partial().parse(req.body);
    const project = await storage.updateProject(parseInt(req.params.id), data);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/financial/projects/:id", async (req, res) => {
  try {
    await storage.deleteProject(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Contract Number Registry Routes - Enhanced contract numbering system
router.get("/api/contract-number-registry", async (req, res) => {
  try {
    const registries = await storage.getContractNumberRegistries();
    res.json(registries);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contract-number-registry", async (req, res) => {
  try {
    const data = insertContractNumberRegistrySchema.parse(req.body);
    const registry = await storage.createContractNumberRegistry(data);
    res.status(201).json(registry);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contract-number-registry/:id", async (req, res) => {
  try {
    const registry = await storage.getContractNumberRegistryById(parseInt(req.params.id));
    if (!registry) {
      return res.status(404).json({ error: "Contract number registry not found" });
    }
    res.json(registry);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contract-number-registry/group/:groupBatchId/available", async (req, res) => {
  try {
    const availableNumbers = await storage.getAvailableContractNumbers(parseInt(req.params.groupBatchId));
    res.json(availableNumbers);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contract-number-registry/group/:groupBatchId/next", async (req, res) => {
  try {
    const nextNumber = await storage.getNextAvailableContractNumber(parseInt(req.params.groupBatchId));
    res.json({ contractNumber: nextNumber });
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/contract-number-registry/:id", async (req, res) => {
  try {
    const data = insertContractNumberRegistrySchema.partial().parse(req.body);
    const registry = await storage.updateContractNumberRegistry(parseInt(req.params.id), data);
    if (!registry) {
      return res.status(404).json({ error: "Contract number registry not found" });
    }
    res.json(registry);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/contract-number-registry/:id", async (req, res) => {
  try {
    await storage.deleteContractNumberRegistry(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Contract Status History Routes
router.get("/api/contract-status-history", async (req, res) => {
  try {
    const histories = await storage.getContractStatusHistories();
    res.json(histories);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contract-status-history", async (req, res) => {
  try {
    const data = insertContractStatusHistorySchema.parse(req.body);
    const history = await storage.createContractStatusHistory(data);
    res.status(201).json(history);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contract-status-history/:id", async (req, res) => {
  try {
    const history = await storage.getContractStatusHistoryById(parseInt(req.params.id));
    if (!history) {
      return res.status(404).json({ error: "Contract status history not found" });
    }
    res.json(history);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/contract-status-history/contract/:contractId", async (req, res) => {
  try {
    const histories = await storage.getContractStatusHistoryByContract(parseInt(req.params.contractId));
    res.json(histories);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/contract-status-history/:id", async (req, res) => {
  try {
    const data = insertContractStatusHistorySchema.partial().parse(req.body);
    const history = await storage.updateContractStatusHistory(parseInt(req.params.id), data);
    if (!history) {
      return res.status(404).json({ error: "Contract status history not found" });
    }
    res.json(history);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/contract-status-history/:id", async (req, res) => {
  try {
    await storage.deleteContractStatusHistory(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Contract numbering business logic endpoints
router.post("/api/contract-number-registry/group/:groupBatchId/initialize", async (req, res) => {
  try {
    const { startNumber, endNumber } = req.body;
    await storage.initializeGroupContractNumbers(
      parseInt(req.params.groupBatchId), 
      startNumber || 1, 
      endNumber || 500
    );
    res.status(201).json({ message: "Contract numbers initialized successfully" });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contracts/:contractId/change-status", async (req, res) => {
  try {
    const { newStatus, reason, reasonDescription } = req.body;
    await storage.changeContractStatus(
      parseInt(req.params.contractId), 
      newStatus, 
      reason, 
      reasonDescription
    );
    res.status(200).json({ message: "Contract status changed successfully" });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contract-number-registry/assign", async (req, res) => {
  try {
    const { contractNumber, contractId } = req.body;
    const registry = await storage.assignContractNumber(contractNumber, contractId);
    if (!registry) {
      return res.status(404).json({ error: "Contract number not found or not available" });
    }
    res.json(registry);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/contract-number-registry/release", async (req, res) => {
  try {
    const { contractNumber } = req.body;
    const registry = await storage.releaseContractNumber(contractNumber);
    if (!registry) {
      return res.status(404).json({ error: "Contract number not found" });
    }
    res.json(registry);
  } catch (error) {
    handleError(res, error);
  }
});

// ============================================================================
// ATTENDANCE/SERVICE MANAGEMENT API ROUTES
// ============================================================================

// Payment Receipt Routes
router.get("/api/payment-receipts", async (req, res) => {
  try {
    const paymentReceipts = await storage.getPaymentReceipts();
    res.json(paymentReceipts);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/payment-receipts", async (req, res) => {
  try {
    const data = insertPaymentReceiptSchema.parse(req.body);
    const paymentReceipt = await storage.createPaymentReceipt(data);
    res.status(201).json(paymentReceipt);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/payment-receipts/:id", async (req, res) => {
  try {
    const paymentReceipt = await storage.getPaymentReceiptById(parseInt(req.params.id));
    if (!paymentReceipt) {
      return res.status(404).json({ error: "Payment receipt not found" });
    }
    res.json(paymentReceipt);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/payment-receipts/:id", async (req, res) => {
  try {
    const data = insertPaymentReceiptSchema.partial().parse(req.body);
    const paymentReceipt = await storage.updatePaymentReceipt(parseInt(req.params.id), data);
    if (!paymentReceipt) {
      return res.status(404).json({ error: "Payment receipt not found" });
    }
    res.json(paymentReceipt);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/payment-receipts/:id", async (req, res) => {
  try {
    await storage.deletePaymentReceipt(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Carteirinha (Member Card) Routes
router.get("/api/carteirinhas", async (req, res) => {
  try {
    const carteirinhas = await storage.getCarteirinhas();
    res.json(carteirinhas);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/carteirinhas", async (req, res) => {
  try {
    const data = insertCarteirinhaSchema.parse(req.body);
    const carteirinha = await storage.createCarteirinha(data);
    res.status(201).json(carteirinha);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/carteirinhas/:id", async (req, res) => {
  try {
    const carteirinha = await storage.getCarteirinhaById(parseInt(req.params.id));
    if (!carteirinha) {
      return res.status(404).json({ error: "Carteirinha not found" });
    }
    res.json(carteirinha);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/carteirinhas/:id", async (req, res) => {
  try {
    const data = insertCarteirinhaSchema.partial().parse(req.body);
    const carteirinha = await storage.updateCarteirinha(parseInt(req.params.id), data);
    if (!carteirinha) {
      return res.status(404).json({ error: "Carteirinha not found" });
    }
    res.json(carteirinha);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/carteirinhas/:id", async (req, res) => {
  try {
    await storage.deleteCarteirinha(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// Medical Forward Routes
router.get("/api/medical-forwards", async (req, res) => {
  try {
    const medicalForwards = await storage.getMedicalForwards();
    res.json(medicalForwards);
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/api/medical-forwards", async (req, res) => {
  try {
    const data = insertMedicalForwardSchema.parse(req.body);
    const medicalForward = await storage.createMedicalForward(data);
    res.status(201).json(medicalForward);
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/api/medical-forwards/:id", async (req, res) => {
  try {
    const medicalForward = await storage.getMedicalForwardById(parseInt(req.params.id));
    if (!medicalForward) {
      return res.status(404).json({ error: "Medical forward not found" });
    }
    res.json(medicalForward);
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/api/medical-forwards/:id", async (req, res) => {
  try {
    const data = insertMedicalForwardSchema.partial().parse(req.body);
    const medicalForward = await storage.updateMedicalForward(parseInt(req.params.id), data);
    if (!medicalForward) {
      return res.status(404).json({ error: "Medical forward not found" });
    }
    res.json(medicalForward);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/api/medical-forwards/:id", async (req, res) => {
  try {
    await storage.deleteMedicalForward(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

import { Server } from "http";
import { createServer } from "http";

export function registerRoutes(app: any): Server {
  app.use(router);
  return createServer(app);
}