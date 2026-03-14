export interface AccountType {
  id: number;
  companyId: number;
  accountTypeName: string;
  description?: string;
  nature: "DEBIT" | "CREDIT";
  parentAccountTypeId?: number;
  level: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface Account {
  id: number;
  companyId: number;
  accountTypeId: number;
  accountCode: string;
  accountName: string;
  description?: string;
  nature: "DEBIT" | "CREDIT";
  parentAccountId?: number;
  level: number;
  isDetailAccount: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CostCenter {
  id: number;
  companyId: number;
  parentCostCenterId?: number;
  centerCode: string;
  centerName: string;
  description?: string;
  managerName?: string;
  budget?: string;
  level: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface Department {
  id: number;
  companyId: number;
  parentDepartmentId?: number;
  departmentCode: string;
  departmentName: string;
  description?: string;
  managerName?: string;
  costCenterId?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface Project {
  id: number;
  companyId: number;
  projectCode: string;
  projectName: string;
  description?: string;
  managerName?: string;
  costCenterId?: number;
  departmentId?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  budget?: string;
  status: "PLANNED" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  completionPercentage?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface FiscalYear {
  id: number;
  companyId: number;
  yearName: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface FiscalPeriod {
  id: number;
  fiscalYearId: number;
  periodName: string;
  periodNumber: number;
  startDate: string;
  endDate: string;
  isAdjustment: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}