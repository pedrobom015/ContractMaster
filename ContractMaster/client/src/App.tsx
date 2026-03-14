import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/useLanguage";
import Dashboard from "@/pages/dashboard";
// ClientsPage removed - migrated to use Partners instead
import ContractTables from "@/pages/contracts-tables";
import BatchManagement from "@/pages/batch-management";


import ContractEntriesPage from "@/pages/contracts-entries";
import PartnersPage from "@/pages/partners-updated";
import PartnerTypesPage from "@/pages/partner-types";
import AdminUsersPage from "@/pages/admin-users";
import AdminCompaniesPage from "@/pages/admin-companies";
import AddressTypesPage from "@/pages/address-types";
import AddressesPage from "@/pages/addresses";
import EntityAddressesPage from "@/pages/entity-addresses";
import DocumentTypesPage from "@/pages/document-types";
import DocumentsPage from "@/pages/documents";
import EntityDocumentsPage from "@/pages/entity-documents";
import GeneralTablesPage from "@/pages/general-tables";
import AuxiliaryTablesPage from "@/pages/auxiliary-tables";
import ChartOfAccountsPage from "@/pages/chart-of-accounts";
import AccountTypesPage from "@/pages/account-types";
import CostCentersPage from "@/pages/cost-centers";
import DepartmentsPage from "@/pages/departments";
import ProjectsPage from "@/pages/projects";
import AttendanceEntriesPage from "@/pages/attendance-entries";
import SysUnitsPage from "@/pages/sys-units";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      {/* /clients route removed - use /tables/partners instead */}
      <Route path="/contracts" component={ContractEntriesPage} />
      <Route path="/contracts/tables" component={ContractTables} />
      <Route path="/tables/general" component={GeneralTablesPage} />
      <Route path="/tables/partners" component={PartnersPage} />
      <Route path="/tables/addresses" component={AddressesPage} />
      <Route path="/tables/documents" component={DocumentsPage} />
      <Route path="/tables/auxiliary" component={AuxiliaryTablesPage} />
      <Route path="/tables/partner-types" component={PartnerTypesPage} />
      <Route path="/tables/address-types" component={AddressTypesPage} />
      <Route path="/tables/entity-addresses" component={EntityAddressesPage} />
      <Route path="/tables/document-types" component={DocumentTypesPage} />
      <Route path="/tables/entity-documents" component={EntityDocumentsPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/companies" component={AdminCompaniesPage} />
      <Route path="/admin/units" component={SysUnitsPage} />
      <Route path="/billing/batch-management" component={BatchManagement} />
      <Route path="/attendance/entries" component={AttendanceEntriesPage} />
      <Route path="/financial/setup/chart-of-accounts" component={ChartOfAccountsPage} />
      <Route path="/financial/setup/account-types" component={AccountTypesPage} />
      <Route path="/financial/setup/cost-centers" component={CostCentersPage} />
      <Route path="/financial/setup/departments" component={DepartmentsPage} />
      <Route path="/financial/setup/projects" component={ProjectsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider defaultLanguage="pt-BR">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
