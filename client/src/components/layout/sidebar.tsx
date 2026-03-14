import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  FileText, BarChart3, Settings, Building, Users, ChevronDown, ChevronRight,
  CreditCard, Headphones, Database, Monitor, FileSearch, Upload, Home,
  UserPlus, FolderOpen, Activity, TrendingUp, Table, MapPin, Network,
  FileType, Link2, Globe, MapPin as City, Flag, User, DollarSign, Building2,
  Calculator, Wallet, Receipt, PieChart, TrendingDown, BadgePercent, 
  Banknote, FileBarChart, Target, Calendar, Users2, Briefcase, PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/layout/language-selector";

interface SidebarItem {
  id: string;
  translationKey: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: SidebarItem[];
}

interface SidebarSection {
  id: string;
  translationKey: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    id: "contracts",
    translationKey: "nav.contracts",
    icon: FileText,
    items: [
      {
        id: "contracts-dashboard",
        translationKey: "section.dashboard",
        icon: BarChart3,
        path: "/contracts/dashboard"
      },
      {
        id: "contracts-entries",
        translationKey: "section.entries",
        icon: FileText,
        path: "/contracts"
      },
      {
        id: "contracts-processing",
        translationKey: "section.processing",
        icon: Activity,
        children: [
          {
            id: "contracts-processing-batch",
            translationKey: "section.batch_processing",
            icon: Activity,
            path: "/contracts/processing/batch"
          },
          {
            id: "contracts-processing-validation",
            translationKey: "section.validation",
            icon: FileSearch,
            path: "/contracts/processing/validation"
          },
          {
            id: "contracts-processing-approval",
            translationKey: "section.approval",
            icon: User,
            path: "/contracts/processing/approval"
          }
        ]
      },
      {
        id: "contracts-reports",
        translationKey: "section.reports",
        icon: TrendingUp,
        children: [
          {
            id: "contracts-reports-financial",
            translationKey: "section.financial_reports",
            icon: DollarSign,
            path: "/contracts/reports/financial"
          },
          {
            id: "contracts-reports-operational",
            translationKey: "section.operational_reports",
            icon: BarChart3,
            path: "/contracts/reports/operational"
          },
          {
            id: "contracts-reports-analytics",
            translationKey: "section.analytics",
            icon: TrendingUp,
            path: "/contracts/reports/analytics"
          }
        ]
      },
      {
        id: "contracts-tables",
        translationKey: "section.tables",
        icon: Database,
        path: "/contracts/tables"
      },

    ]
  },
  {
    id: "billing",
    translationKey: "nav.billing",
    icon: CreditCard,
    items: [
      {
        id: "billing-dashboard",
        translationKey: "section.dashboard",
        icon: BarChart3,
        path: "/billing/dashboard"
      },
      {
        id: "billing-batch-management",
        translationKey: "section.batch_management",
        icon: DollarSign,
        path: "/billing/batch-management"
      },
      {
        id: "billing-processing",
        translationKey: "section.processing",
        icon: Activity,
        path: "/billing/processing"
      },
      {
        id: "billing-reports",
        translationKey: "section.reports",
        icon: TrendingUp,
        path: "/billing/reports"
      },
      {
        id: "billing-tables",
        translationKey: "section.tables",
        icon: Table,
        path: "/billing/tables"
      }
    ]
  },
  {
    id: "customer-service",
    translationKey: "nav.customer_service",
    icon: Headphones,
    items: [
      {
        id: "service-dashboard",
        translationKey: "section.dashboard",
        icon: BarChart3,
        path: "/service/dashboard"
      },
      {
        id: "attendance-entries",
        translationKey: "section.attendance_entries",
        icon: Headphones,
        path: "/attendance/entries"
      },
      {
        id: "service-processing",
        translationKey: "section.processing",
        icon: Activity,
        path: "/service/processing"
      },
      {
        id: "service-reports",
        translationKey: "section.reports",
        icon: TrendingUp,
        path: "/service/reports"
      },
      {
        id: "service-tables",
        translationKey: "section.tables",
        icon: Table,
        path: "/service/tables"
      }
    ]
  },
  {
    id: "financial",
    translationKey: "nav.financial",
    icon: Calculator,
    items: [
      {
        id: "financial-dashboard",
        translationKey: "section.dashboard",
        icon: BarChart3,
        path: "/financial/dashboard"
      },
      {
        id: "financial-setup",
        translationKey: "section.setup",
        icon: Settings,
        children: [
          {
            id: "financial-chart-accounts",
            translationKey: "section.chart_of_accounts",
            icon: FileBarChart,
            path: "/financial/setup/chart-of-accounts"
          },
          {
            id: "financial-account-types",
            translationKey: "section.account_types",
            icon: Network,
            path: "/financial/setup/account-types"
          },
          {
            id: "financial-cost-centers",
            translationKey: "section.cost_centers",
            icon: Target,
            path: "/financial/setup/cost-centers"
          },
          {
            id: "financial-departments",
            translationKey: "section.departments",
            icon: Building2,
            path: "/financial/setup/departments"
          },
          {
            id: "financial-projects",
            translationKey: "section.projects",
            icon: Briefcase,
            path: "/financial/setup/projects"
          }
        ]
      },
      {
        id: "financial-transactions",
        translationKey: "section.transactions",
        icon: Receipt,
        children: [
          {
            id: "financial-journal-entries",
            translationKey: "section.journal_entries",
            icon: FileText,
            path: "/financial/transactions/journal-entries"
          },
          {
            id: "financial-payments",
            translationKey: "section.payments",
            icon: CreditCard,
            path: "/financial/transactions/payments"
          },
          {
            id: "financial-receipts",
            translationKey: "section.receipts",
            icon: Wallet,
            path: "/financial/transactions/receipts"
          },
          {
            id: "financial-transfers",
            translationKey: "section.transfers",
            icon: PlusCircle,
            path: "/financial/transactions/transfers"
          }
        ]
      },
      {
        id: "financial-accounts",
        translationKey: "section.accounts",
        icon: Banknote,
        children: [
          {
            id: "financial-accounts-receivable",
            translationKey: "section.accounts_receivable",
            icon: TrendingUp,
            path: "/financial/accounts/receivable"
          },
          {
            id: "financial-accounts-payable",
            translationKey: "section.accounts_payable",
            icon: TrendingDown,
            path: "/financial/accounts/payable"
          },
          {
            id: "financial-bank-accounts",
            translationKey: "section.bank_accounts",
            icon: Banknote,
            path: "/financial/accounts/bank-accounts"
          },
          {
            id: "financial-bank-reconciliation",
            translationKey: "section.bank_reconciliation",
            icon: FileSearch,
            path: "/financial/accounts/bank-reconciliation"
          }
        ]
      },
      {
        id: "financial-budgets",
        translationKey: "section.budgets",
        icon: Target,
        children: [
          {
            id: "financial-budget-setup",
            translationKey: "section.budget_setup",
            icon: Settings,
            path: "/financial/budgets/setup"
          },
          {
            id: "financial-budget-vs-actual",
            translationKey: "section.budget_vs_actual",
            icon: PieChart,
            path: "/financial/budgets/vs-actual"
          },
          {
            id: "financial-budget-analysis",
            translationKey: "section.budget_analysis",
            icon: TrendingUp,
            path: "/financial/budgets/analysis"
          }
        ]
      },
      {
        id: "financial-contacts",
        translationKey: "section.contacts",
        icon: Users,
        children: [
          {
            id: "financial-vendors",
            translationKey: "section.vendors",
            icon: Building,
            path: "/financial/contacts/vendors"
          },
          {
            id: "financial-customers",
            translationKey: "section.customers",
            icon: User,
            path: "/financial/contacts/customers"
          },
          {
            id: "financial-contact-types",
            translationKey: "section.contact_types",
            icon: Network,
            path: "/financial/contacts/types"
          }
        ]
      },
      {
        id: "financial-periods",
        translationKey: "section.periods",
        icon: Calendar,
        children: [
          {
            id: "financial-fiscal-years",
            translationKey: "section.fiscal_years",
            icon: Calendar,
            path: "/financial/periods/fiscal-years"
          },
          {
            id: "financial-fiscal-periods",
            translationKey: "section.fiscal_periods",
            icon: Calendar,
            path: "/financial/periods/fiscal-periods"
          },
          {
            id: "financial-period-closing",
            translationKey: "section.period_closing",
            icon: FileBarChart,
            path: "/financial/periods/closing"
          }
        ]
      },
      {
        id: "financial-reports",
        translationKey: "section.reports",
        icon: FileBarChart,
        children: [
          {
            id: "financial-balance-sheet",
            translationKey: "section.balance_sheet",
            icon: BarChart3,
            path: "/financial/reports/balance-sheet"
          },
          {
            id: "financial-income-statement",
            translationKey: "section.income_statement",
            icon: TrendingUp,
            path: "/financial/reports/income-statement"
          },
          {
            id: "financial-cash-flow",
            translationKey: "section.cash_flow",
            icon: Wallet,
            path: "/financial/reports/cash-flow"
          },
          {
            id: "financial-trial-balance",
            translationKey: "section.trial_balance",
            icon: PieChart,
            path: "/financial/reports/trial-balance"
          },
          {
            id: "financial-general-ledger",
            translationKey: "section.general_ledger",
            icon: FileText,
            path: "/financial/reports/general-ledger"
          }
        ]
      },
      {
        id: "financial-taxes",
        translationKey: "section.taxes",
        icon: BadgePercent,
        children: [
          {
            id: "financial-tax-codes",
            translationKey: "section.tax_codes",
            icon: BadgePercent,
            path: "/financial/taxes/codes"
          },
          {
            id: "financial-tax-reports",
            translationKey: "section.tax_reports",
            icon: FileBarChart,
            path: "/financial/taxes/reports"
          }
        ]
      }
    ]
  },
  {
    id: "tables",
    translationKey: "nav.tables",
    icon: Table,
    items: [
      {
        id: "tables-general",
        translationKey: "section.general",
        icon: Globe,
        path: "/tables/general"
      },
      {
        id: "tables-partners",
        translationKey: "section.partners",
        icon: Building,
        children: [
          {
            id: "tables-partners-list",
            translationKey: "section.partners_list",
            icon: Building,
            path: "/tables/partners"
          },
          {
            id: "tables-partners-types",
            translationKey: "section.partner_types",
            icon: Network,
            path: "/tables/partner-types"
          },
          {
            id: "tables-partners-relationships",
            translationKey: "section.relationships",
            icon: Link2,
            path: "/tables/partners/relationships"
          }
        ]
      },
      {
        id: "tables-addresses",
        translationKey: "section.addresses",
        icon: MapPin,
        children: [
          {
            id: "tables-addresses-list",
            translationKey: "section.addresses_list",
            icon: MapPin,
            path: "/tables/addresses"
          },
          {
            id: "tables-addresses-types",
            translationKey: "section.address_types",
            icon: City,
            path: "/tables/address-types"
          },
          {
            id: "tables-addresses-entities",
            translationKey: "section.entity_addresses",
            icon: Building,
            path: "/tables/entity-addresses"
          }
        ]
      },
      {
        id: "tables-documents",
        translationKey: "section.documents",
        icon: FileText,
        children: [
          {
            id: "tables-documents-list",
            translationKey: "section.documents_list",
            icon: FileText,
            path: "/tables/documents"
          },
          {
            id: "tables-documents-types",
            translationKey: "section.document_types",
            icon: FileType,
            path: "/tables/document-types"
          },
          {
            id: "tables-documents-entities",
            translationKey: "section.entity_documents",
            icon: Link2,
            path: "/tables/entity-documents"
          }
        ]
      },
      {
        id: "tables-auxiliary",
        translationKey: "section.auxiliary",
        icon: Database,
        path: "/tables/auxiliary"
      }
    ]
  },
  {
    id: "administration",
    translationKey: "nav.administration",
    icon: Building,
    items: [
      {
        id: "admin-dashboard",
        translationKey: "section.dashboard",
        icon: BarChart3,
        path: "/admin/dashboard"
      },
      {
        id: "admin-organization",
        translationKey: "section.organization",
        icon: Building2,
        children: [
          {
            id: "admin-companies",
            translationKey: "section.companies",
            icon: Building2,
            path: "/admin/companies"
          },
          {
            id: "admin-units",
            translationKey: "section.units",
            icon: Building,
            path: "/admin/units"
          },
          {
            id: "admin-programs",
            translationKey: "section.programs",
            icon: FolderOpen,
            path: "/admin/programs"
          }
        ]
      },
      {
        id: "admin-user-management",
        translationKey: "section.user_management",
        icon: Users,
        children: [
          {
            id: "admin-users",
            translationKey: "section.users",
            icon: UserPlus,
            path: "/admin/users"
          },
          {
            id: "admin-groups",
            translationKey: "section.groups",
            icon: Users,
            path: "/admin/groups"
          },
          {
            id: "admin-user-monitoring",
            translationKey: "section.user_monitoring",
            icon: Monitor,
            path: "/admin/user-monitoring"
          }
        ]
      },
      {
        id: "admin-data-tools",
        translationKey: "section.data_tools",
        icon: Database,
        children: [
          {
            id: "admin-data-import",
            translationKey: "section.data_import",
            icon: Upload,
            path: "/admin/data-import"
          },
          {
            id: "admin-database-explorer",
            translationKey: "section.database_explorer",
            icon: Database,
            path: "/admin/database-explorer"
          },
          {
            id: "admin-sql-panel",
            translationKey: "section.sql_panel",
            icon: FileSearch,
            path: "/admin/sql-panel"
          }
        ]
      },
      {
        id: "admin-preferences",
        translationKey: "section.preferences",
        icon: Settings,
        path: "/admin/preferences"
      }
    ]
  }
];

// Recursive component for rendering nested menu items
interface MenuItemProps {
  item: SidebarItem;
  level: number;
  location: string;
  expandedItems: string[];
  onToggle: (itemId: string) => void;
  t: (key: string) => string;
}

function MenuItem({ item, level, location, expandedItems, onToggle, t }: MenuItemProps) {
  const ItemIcon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const isActive = location === item.path;

  // Calculate indentation based on level
  const marginLeft = level * 16; // 16px per level
  const iconSize = level === 0 ? 'w-8 h-8' : 'w-6 h-6';
  const iconPadding = level === 0 ? 'mr-2' : 'mr-1';

  return (
    <div>
      {hasChildren ? (
        <div
          className={cn(
            "sidebar-item rounded-xl p-2 cursor-pointer",
            isActive && "neu-pressed"
          )}
          style={{ marginLeft }}
          onClick={() => onToggle(item.id)}
        >
          <div className="flex items-center">
            <div className={cn("neu-flat rounded-lg flex items-center justify-center", iconSize, iconPadding)}>
              <ItemIcon className={cn("text-primary", level === 0 ? "w-4 h-4" : "w-3 h-3")} />
            </div>
            <span className={cn("flex-1 font-medium", level === 0 ? "text-sm" : "text-xs")}>
              {t(item.translationKey)}
            </span>
            <div className="neu-button rounded-lg w-6 h-6 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-primary tree-transition" />
              ) : (
                <ChevronRight className="w-3 h-3 text-primary tree-transition" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <Link href={item.path || '#'}>
          <div
            className={cn(
              "sidebar-item rounded-xl p-2 cursor-pointer",
              isActive && "neu-pressed"
            )}
            style={{ marginLeft }}
          >
            <div className="flex items-center">
              <div className={cn("neu-flat rounded-lg flex items-center justify-center", iconSize, iconPadding)}>
                <ItemIcon className={cn("text-primary", level === 0 ? "w-4 h-4" : "w-3 h-3")} />
              </div>
              <span className={cn("font-medium", level === 0 ? "text-sm" : "text-xs")}>
                {t(item.translationKey)}
              </span>
            </div>
          </div>
        </Link>
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1 tree-transition">
          {item.children!.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              location={location}
              expandedItems={expandedItems}
              onToggle={onToggle}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Reset sidebar to collapsed state when navigating to home/dashboard
  const handleHomeNavigation = () => {
    setExpandedSections([]);
    setExpandedItems([]);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <div className="w-80 neu-sidebar text-sidebar-foreground flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6">
        <div className="neu-flat rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="neu-button rounded-full w-12 h-12 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">ContractMaster</h1>
                <p className="text-sidebar-foreground/70 text-sm">Sistema de Gestão</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4">
        <div className="neu-flat rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="neu-pressed w-12 h-12 rounded-full flex items-center justify-center text-primary text-sm font-medium">
              JS
            </div>
            <div>
              <p className="font-medium text-sm">João Silva</p>
              <p className="text-sidebar-foreground/70 text-xs">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-3">
        {/* Dashboard */}
        <div className="mb-6">
          <Link href="/dashboard">
            <div 
              className={cn(
                "sidebar-item rounded-2xl p-3 cursor-pointer",
                (location === "/dashboard" || location === "/") && "neu-pressed"
              )}
              onClick={handleHomeNavigation}
            >
              <div className="flex items-center">
                <div className="neu-button rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{t('section.dashboard')}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        {sidebarSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const SectionIcon = section.icon;

          return (
            <div key={section.id} className="mb-6">
              <div
                className="sidebar-item rounded-2xl p-3 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center">
                  <div className="neu-button rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                    <SectionIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="flex-1 font-medium">{t(section.translationKey)}</span>
                  <div className="neu-button rounded-lg w-8 h-8 flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-primary tree-transition" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-primary tree-transition" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="ml-4 mt-3 space-y-2 tree-transition">
                  {section.items.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      level={0}
                      location={location}
                      expandedItems={expandedItems}
                      onToggle={toggleItem}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}