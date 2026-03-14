import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Globe, Building, MapPin as City, Flag, User, DollarSign, Briefcase, CreditCard } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Schemas for each table
const companySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  legalName: z.string().max(255).optional(),
  taxId: z.string().max(30).optional(),
  email: z.string().email("Email inválido").max(100).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().max(100).optional(),
  active: z.boolean(),
});

const subsidiarySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  companyId: z.number().min(1, "Empresa é obrigatória"),
  code: z.string().min(1, "Código é obrigatório").max(30),
  email: z.string().email("Email inválido").max(100).optional(),
  phone: z.string().max(30).optional(),
  active: z.boolean(),
});

const citySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  stateId: z.number().min(1, "Estado é obrigatório"),
  ibgeCode: z.string().max(10).optional(),
  active: z.boolean(),
});

const stateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  abbreviation: z.string().min(2, "Sigla deve ter 2 caracteres").max(2),
  ibgeCode: z.string().max(10).optional(),
  active: z.boolean(),
});

const genderSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50),
  abbreviation: z.string().max(5).optional(),
  active: z.boolean(),
});

const currencySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  code: z.string().min(3, "Código deve ter 3 caracteres").max(3),
  symbol: z.string().max(5).optional(),
  active: z.boolean(),
});

const specialitySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  active: z.boolean(),
});

const paymentBoxSchema = z.object({
  sysUserName: z.string().min(1, "Nome do usuário é obrigatório").max(100),
  orderNumber: z.string().min(1, "Número do pedido é obrigatório").max(50),
  orderDate: z.string().min(1, "Data do pedido é obrigatória"),
  totalAmount: z.number().min(0, "Valor total deve ser positivo"),
  numberReceipt: z.string().max(50).optional(),
  closingDate: z.string().optional(),
  status: z.enum(["ABERTO", "FECHADO"]).default("ABERTO"),
});

type CompanyFormData = z.infer<typeof companySchema>;
type SubsidiaryFormData = z.infer<typeof subsidiarySchema>;
type CityFormData = z.infer<typeof citySchema>;
type StateFormData = z.infer<typeof stateSchema>;
type GenderFormData = z.infer<typeof genderSchema>;
type CurrencyFormData = z.infer<typeof currencySchema>;
type SpecialityFormData = z.infer<typeof specialitySchema>;
type PaymentBoxFormData = z.infer<typeof paymentBoxSchema>;

// Interfaces
interface Company {
  id: number;
  name: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  active: boolean;
  createdAt: string;
}

interface Subsidiary {
  id: number;
  name: string;
  companyId: number;
  company: Company;
  code: string;
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

interface State {
  id: number;
  name: string;
  abbreviation: string;
  ibgeCode?: string;
  active: boolean;
  createdAt: string;
}

interface City {
  id: number;
  name: string;
  stateId: number;
  state: State;
  ibgeCode?: string;
  active: boolean;
  createdAt: string;
}

interface Gender {
  id: number;
  name: string;
  abbreviation?: string;
  active: boolean;
  createdAt: string;
}

interface Currency {
  id: number;
  name: string;
  code: string;
  symbol?: string;
  active: boolean;
  createdAt: string;
}

interface Speciality {
  id: number;
  name: string;
  description?: string;
  code?: string;
  active: boolean;
  createdAt: string;
}

interface PaymentBox {
  id: number;
  sysUserId: number;
  sysUserName: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  numberReceipt?: string;
  closingDate?: string;
  status: "ABERTO" | "FECHADO";
  createdAt: string;
}

export default function GeneralTablesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("companies");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Forms
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", legalName: "", taxId: "", email: "", phone: "", website: "", active: true },
  });

  const subsidiaryForm = useForm<SubsidiaryFormData>({
    resolver: zodResolver(subsidiarySchema),
    defaultValues: { name: "", companyId: 0, code: "", email: "", phone: "", active: true },
  });

  const cityForm = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: { name: "", stateId: 0, ibgeCode: "", active: true },
  });

  const stateForm = useForm<StateFormData>({
    resolver: zodResolver(stateSchema),
    defaultValues: { name: "", abbreviation: "", ibgeCode: "", active: true },
  });

  const genderForm = useForm<GenderFormData>({
    resolver: zodResolver(genderSchema),
    defaultValues: { name: "", abbreviation: "", active: true },
  });

  const currencyForm = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: { name: "", code: "", symbol: "", active: true },
  });

  const specialityForm = useForm<SpecialityFormData>({
    resolver: zodResolver(specialitySchema),
    defaultValues: { name: "", description: "", code: "", active: true },
  });

  const paymentBoxForm = useForm<PaymentBoxFormData>({
    resolver: zodResolver(paymentBoxSchema),
    defaultValues: { 
      sysUserName: "", 
      orderNumber: "", 
      orderDate: new Date().toISOString().split('T')[0], 
      totalAmount: 0, 
      numberReceipt: "", 
      closingDate: "", 
      status: "ABERTO" 
    },
  });

  // Sample data
  const mockStates: State[] = [
    { id: 1, name: "São Paulo", abbreviation: "SP", ibgeCode: "35", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Rio de Janeiro", abbreviation: "RJ", ibgeCode: "33", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Minas Gerais", abbreviation: "MG", ibgeCode: "31", active: true, createdAt: new Date().toISOString() },
  ];

  const mockCompanies: Company[] = [
    {
      id: 1,
      name: "ContractMaster Ltda",
      legalName: "ContractMaster Soluções Empresariais Ltda",
      taxId: "12.345.678/0001-99",
      email: "contato@contractmaster.com.br",
      phone: "(11) 3456-7890",
      website: "www.contractmaster.com.br",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "TechSolutions S.A.",
      legalName: "TechSolutions Tecnologia e Inovação S.A.",
      taxId: "98.765.432/0001-11",
      email: "info@techsolutions.com.br",
      phone: "(11) 2345-6789",
      website: "www.techsolutions.com.br",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockSubsidiaries: Subsidiary[] = [
    {
      id: 1,
      name: "Filial São Paulo",
      companyId: 1,
      company: mockCompanies[0],
      code: "SP01",
      email: "saopaulo@contractmaster.com.br",
      phone: "(11) 3456-7891",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Filial Rio de Janeiro",
      companyId: 1,
      company: mockCompanies[0],
      code: "RJ01",
      email: "rio@contractmaster.com.br",
      phone: "(21) 3456-7892",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockCities: City[] = [
    { id: 1, name: "São Paulo", stateId: 1, state: mockStates[0], ibgeCode: "3550308", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Campinas", stateId: 1, state: mockStates[0], ibgeCode: "3509502", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Rio de Janeiro", stateId: 2, state: mockStates[1], ibgeCode: "3304557", active: true, createdAt: new Date().toISOString() },
  ];

  const mockGenders: Gender[] = [
    { id: 1, name: "Masculino", abbreviation: "M", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Feminino", abbreviation: "F", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Não Binário", abbreviation: "NB", active: true, createdAt: new Date().toISOString() },
  ];

  const mockCurrencies: Currency[] = [
    { id: 1, name: "Real Brasileiro", code: "BRL", symbol: "R$", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Dólar Americano", code: "USD", symbol: "$", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Euro", code: "EUR", symbol: "€", active: true, createdAt: new Date().toISOString() },
  ];

  const mockSpecialities: Speciality[] = [
    { id: 1, name: "Cardiologia", description: "Especialidade médica cardiovascular", code: "CARD", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Dermatologia", description: "Especialidade médica dermatológica", code: "DERM", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Pediatria", description: "Especialidade médica pediátrica", code: "PEDI", active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Ortopedia", description: "Especialidade médica ortopédica", code: "ORTO", active: true, createdAt: new Date().toISOString() },
  ];

  const mockPaymentBoxes: PaymentBox[] = [
    {
      id: 1,
      sysUserId: 1,
      sysUserName: "João Silva",
      orderNumber: "ORD-2024-001",
      orderDate: "2024-01-15",
      totalAmount: 1500.00,
      numberReceipt: "REC-001",
      closingDate: undefined,
      status: "ABERTO",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      sysUserId: 2,
      sysUserName: "Maria Santos",
      orderNumber: "ORD-2024-002",
      orderDate: "2024-01-16",
      totalAmount: 2350.75,
      numberReceipt: "REC-002", 
      closingDate: "2024-01-17",
      status: "FECHADO",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      sysUserId: 1,
      sysUserName: "João Silva",
      orderNumber: "ORD-2024-003",
      orderDate: "2024-01-18",
      totalAmount: 850.30,
      numberReceipt: "REC-003",
      closingDate: undefined,
      status: "ABERTO",
      createdAt: new Date().toISOString(),
    },
  ];

  // Handlers
  const handleCreate = (tab: string) => {
    setActiveTab(tab);
    setSelectedEntity(null);
    resetForm(tab);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (entity: any, tab: string) => {
    setActiveTab(tab);
    setSelectedEntity(entity);
    populateForm(entity, tab);
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: selectedEntity ? "Registro atualizado com sucesso" : "Registro criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedEntity(null);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Registro excluído com sucesso",
    });
  };

  const resetForm = (tab: string) => {
    switch (tab) {
      case "companies": companyForm.reset(); break;
      case "subsidiaries": subsidiaryForm.reset(); break;
      case "cities": cityForm.reset(); break;
      case "states": stateForm.reset(); break;
      case "genders": genderForm.reset(); break;
      case "currencies": currencyForm.reset(); break;
      case "specialities": specialityForm.reset(); break;
      case "paymentboxes": paymentBoxForm.reset(); break;
    }
  };

  const populateForm = (entity: any, tab: string) => {
    switch (tab) {
      case "companies": companyForm.reset(entity); break;
      case "subsidiaries": subsidiaryForm.reset(entity); break;
      case "cities": cityForm.reset(entity); break;
      case "states": stateForm.reset(entity); break;
      case "genders": genderForm.reset(entity); break;
      case "currencies": currencyForm.reset(entity); break;
      case "specialities": specialityForm.reset(entity); break;
      case "paymentboxes": paymentBoxForm.reset(entity); break;
    }
  };

  const getFilteredData = (data: any[], searchFields: string[]) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderCompaniesTab = () => {
    const filteredCompanies = getFilteredData(mockCompanies, ['name', 'legalName', 'taxId']);
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Empresas
            </CardTitle>
            <Button onClick={() => handleCreate("companies")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.legalName || "-"}</TableCell>
                  <TableCell>{company.taxId || "-"}</TableCell>
                  <TableCell>{company.email || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={company.active ? "default" : "secondary"}>
                      {company.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(company, "companies")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a empresa "{company.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(company.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderStatesTab = () => {
    const filteredStates = getFilteredData(mockStates, ['name', 'abbreviation']);
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Estados
            </CardTitle>
            <Button onClick={() => handleCreate("states")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Estado
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead>Código IBGE</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStates.map((state) => (
                <TableRow key={state.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{state.name}</TableCell>
                  <TableCell>{state.abbreviation}</TableCell>
                  <TableCell>{state.ibgeCode || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={state.active ? "default" : "secondary"}>
                      {state.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(state, "states")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o estado "{state.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(state.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderSubsidiariesTab = () => {
    const filteredSubsidiaries = getFilteredData(mockSubsidiaries, ['name', 'code']);
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Filiais
            </CardTitle>
            <Button onClick={() => handleCreate("subsidiaries")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Filial
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubsidiaries.map((subsidiary) => (
                <TableRow key={subsidiary.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{subsidiary.name}</TableCell>
                  <TableCell>{subsidiary.company.name}</TableCell>
                  <TableCell>{subsidiary.code}</TableCell>
                  <TableCell>{subsidiary.email || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={subsidiary.active ? "default" : "secondary"}>
                      {subsidiary.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(subsidiary, "subsidiaries")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a filial "{subsidiary.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(subsidiary.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderCitiesTab = () => {
    const filteredCities = getFilteredData(mockCities, ['name']);
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <City className="h-5 w-5" />
              Cidades
            </CardTitle>
            <Button onClick={() => handleCreate("cities")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Cidade
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Código IBGE</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCities.map((city) => (
                <TableRow key={city.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{city.name}</TableCell>
                  <TableCell>{city.state.name} ({city.state.abbreviation})</TableCell>
                  <TableCell>{city.ibgeCode || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={city.active ? "default" : "secondary"}>
                      {city.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(city, "cities")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a cidade "{city.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(city.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderGendersTab = () => {
    const filteredGenders = getFilteredData(mockGenders, ['name']);
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Gêneros
            </CardTitle>
            <Button onClick={() => handleCreate("genders")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Gênero
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Abreviação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGenders.map((gender) => (
                <TableRow key={gender.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{gender.name}</TableCell>
                  <TableCell>{gender.abbreviation || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={gender.active ? "default" : "secondary"}>
                      {gender.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(gender, "genders")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o gênero "{gender.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(gender.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderCurrenciesTab = () => {
    const filteredCurrencies = getFilteredData(mockCurrencies, ['name', 'code']);
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Moedas
            </CardTitle>
            <Button onClick={() => handleCreate("currencies")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Moeda
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Símbolo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCurrencies.map((currency) => (
                <TableRow key={currency.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{currency.name}</TableCell>
                  <TableCell>{currency.code}</TableCell>
                  <TableCell>{currency.symbol || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={currency.active ? "default" : "secondary"}>
                      {currency.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(currency, "currencies")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a moeda "{currency.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(currency.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderSpecialitiesTab = () => {
    const filteredSpecialities = getFilteredData(mockSpecialities, ['name', 'description', 'code']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Especialidades</CardTitle>
            <Button
              onClick={() => handleCreate('specialities')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Especialidade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpecialities.map((speciality: Speciality) => (
                <TableRow key={speciality.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{speciality.name}</TableCell>
                  <TableCell>{speciality.code || "-"}</TableCell>
                  <TableCell>{speciality.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={speciality.active ? "default" : "secondary"}>
                      {speciality.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(speciality, "specialities")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a especialidade "{speciality.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(speciality.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderPaymentBoxesTab = () => {
    const filteredPaymentBoxes = getFilteredData(mockPaymentBoxes, ['sysUserName', 'orderNumber', 'numberReceipt']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Caixas - Movimentação Financeira</CardTitle>
            <Button
              onClick={() => handleCreate('paymentboxes')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Movimentação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Usuário</TableHead>
                <TableHead>Nº Pedido</TableHead>
                <TableHead>Data Pedido</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Nº Recibo</TableHead>
                <TableHead>Data Fechamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaymentBoxes.map((paymentBox: PaymentBox) => (
                <TableRow key={paymentBox.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{paymentBox.sysUserName}</TableCell>
                  <TableCell>{paymentBox.orderNumber}</TableCell>
                  <TableCell>{new Date(paymentBox.orderDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>R$ {paymentBox.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{paymentBox.numberReceipt || "-"}</TableCell>
                  <TableCell>
                    {paymentBox.closingDate ? new Date(paymentBox.closingDate).toLocaleDateString('pt-BR') : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={paymentBox.status === "ABERTO" ? "default" : "secondary"}>
                      {paymentBox.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(paymentBox, "paymentboxes")}
                        className="neu-button neu-button-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a movimentação "{paymentBox.orderNumber}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(paymentBox.id)} className="neu-button neu-button-danger">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="neu-card rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Tabelas Gerais
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie as tabelas fundamentais do sistema
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar registros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neu-flat pl-10 w-64"
                  />
                </div>
                <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                  Configuração
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="neu-card rounded-3xl">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Tabelas Gerais</span>
                <Badge variant="outline" className="neu-flat">
                  8 tabelas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-8 neu-flat rounded-xl p-1">
                  <TabsTrigger
                    value="companies"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">Empresas</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="subsidiaries"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">Filiais</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="states"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Flag className="w-4 h-4" />
                      <span className="font-medium">Estados</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="cities"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <City className="w-4 h-4" />
                      <span className="font-medium">Cidades</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="genders"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Gêneros</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="currencies"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Moedas</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="specialities"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-medium">Especialidade</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="paymentboxes"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">Caixas</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="companies">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Building className="text-2xl" />
                          <span>Empresas</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as empresas do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderCompaniesTab()}
                </TabsContent>

                <TabsContent value="subsidiaries">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Building className="text-2xl" />
                          <span>Filiais</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as filiais das empresas</p>
                      </div>
                    </div>
                  </div>
                  {renderSubsidiariesTab()}
                </TabsContent>

                <TabsContent value="states">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Flag className="text-2xl" />
                          <span>Estados</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os estados do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderStatesTab()}
                </TabsContent>

                <TabsContent value="cities">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <City className="text-2xl" />
                          <span>Cidades</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as cidades do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderCitiesTab()}
                </TabsContent>

                <TabsContent value="genders">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <User className="text-2xl" />
                          <span>Gêneros</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os tipos de gênero</p>
                      </div>
                    </div>
                  </div>
                  {renderGendersTab()}
                </TabsContent>

                <TabsContent value="currencies">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <DollarSign className="text-2xl" />
                          <span>Moedas</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as moedas do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderCurrenciesTab()}
                </TabsContent>

                <TabsContent value="specialities">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Briefcase className="text-2xl" />
                          <span>Especialidade</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as especialidades do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderSpecialitiesTab()}
                </TabsContent>

                <TabsContent value="paymentboxes">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <CreditCard className="text-2xl" />
                          <span>Caixas</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as caixas de pagamento do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderPaymentBoxesTab()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="neu-card max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Registro</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar um novo registro
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeTab === "companies" && (
                  <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={companyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="legalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Razão Social</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "states" && (
                  <Form {...stateForm}>
                    <form onSubmit={stateForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={stateForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={stateForm.control}
                        name="abbreviation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sigla</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={stateForm.control}
                        name="ibgeCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código IBGE</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "subsidiaries" && (
                  <Form {...subsidiaryForm}>
                    <form onSubmit={subsidiaryForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={subsidiaryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subsidiaryForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subsidiaryForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "cities" && (
                  <Form {...cityForm}>
                    <form onSubmit={cityForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={cityForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cityForm.control}
                        name="ibgeCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código IBGE</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "genders" && (
                  <Form {...genderForm}>
                    <form onSubmit={genderForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={genderForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={genderForm.control}
                        name="abbreviation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sigla</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={3} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "currencies" && (
                  <Form {...currencyForm}>
                    <form onSubmit={currencyForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={currencyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={currencyForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={3} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={currencyForm.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Símbolo</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "specialities" && (
                  <Form {...specialityForm}>
                    <form onSubmit={specialityForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={specialityForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={specialityForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={specialityForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "paymentboxes" && (
                  <Form {...paymentBoxForm}>
                    <form onSubmit={paymentBoxForm.handleSubmit(handleSave)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentBoxForm.control}
                          name="sysUserName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Usuário</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentBoxForm.control}
                          name="orderNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do Pedido</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentBoxForm.control}
                          name="orderDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data do Pedido</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentBoxForm.control}
                          name="totalAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Total (R$)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  step="0.01" 
                                  min="0"
                                  className="neu-input"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentBoxForm.control}
                          name="numberReceipt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do Recibo</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentBoxForm.control}
                          name="closingDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Fechamento</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={paymentBoxForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <select 
                                {...field} 
                                className="neu-input w-full p-2 border rounded-lg"
                              >
                                <option value="ABERTO">ABERTO</option>
                                <option value="FECHADO">FECHADO</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="neu-card max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Registro</DialogTitle>
                <DialogDescription>
                  Modifique os campos abaixo para atualizar o registro
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeTab === "companies" && (
                  <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={companyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="legalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Razão Social</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "states" && (
                  <Form {...stateForm}>
                    <form onSubmit={stateForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={stateForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={stateForm.control}
                        name="abbreviation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sigla</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={stateForm.control}
                        name="ibgeCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código IBGE</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "subsidiaries" && (
                  <Form {...subsidiaryForm}>
                    <form onSubmit={subsidiaryForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={subsidiaryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subsidiaryForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subsidiaryForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "cities" && (
                  <Form {...cityForm}>
                    <form onSubmit={cityForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={cityForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cityForm.control}
                        name="ibgeCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código IBGE</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "genders" && (
                  <Form {...genderForm}>
                    <form onSubmit={genderForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={genderForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={genderForm.control}
                        name="abbreviation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sigla</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={3} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "currencies" && (
                  <Form {...currencyForm}>
                    <form onSubmit={currencyForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={currencyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={currencyForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={3} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={currencyForm.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Símbolo</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "specialities" && (
                  <Form {...specialityForm}>
                    <form onSubmit={specialityForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={specialityForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={specialityForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={specialityForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "paymentboxes" && (
                  <Form {...paymentBoxForm}>
                    <form onSubmit={paymentBoxForm.handleSubmit(handleSave)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentBoxForm.control}
                          name="sysUserName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Usuário</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentBoxForm.control}
                          name="orderNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do Pedido</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentBoxForm.control}
                          name="orderDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data do Pedido</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentBoxForm.control}
                          name="totalAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Total (R$)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  step="0.01" 
                                  min="0"
                                  className="neu-input"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentBoxForm.control}
                          name="numberReceipt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do Recibo</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentBoxForm.control}
                          name="closingDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Fechamento</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={paymentBoxForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <select 
                                {...field} 
                                className="neu-input w-full p-2 border rounded-lg"
                              >
                                <option value="ABERTO">ABERTO</option>
                                <option value="FECHADO">FECHADO</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}