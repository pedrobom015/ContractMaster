// @ts-nocheck
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  User,
  Search
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Schema definitions
const companySchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório").max(255),
  legalName: z.string().max(255).optional(),
  taxId: z.string().max(20).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().max(500).optional(),
  active: z.boolean().default(true),
});

const addressSchema = z.object({
  street: z.string().min(1, "Logradouro é obrigatório").max(255),
  number: z.string().max(20).optional(),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório").max(100),
  city: z.string().min(1, "Cidade é obrigatória").max(100),
  state: z.string().min(2, "Estado é obrigatório").max(2),
  zipCode: z.string().min(8, "CEP é obrigatório").max(9),
  country: z.string().max(100).default("Brasil"),
  isPrimary: z.boolean().default(false),
  active: z.boolean().default(true),
});

type CompanyFormData = z.infer<typeof companySchema>;
type AddressFormData = z.infer<typeof addressSchema>;

// Interfaces
interface Company {
  id: number;
  name: string;
  legalName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  addresses?: Address[];
}

interface Address {
  id: number;
  entityType: string;
  entityId: number;
  street: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
  active: boolean;
  createdAt: string;
}

export default function AdminCompaniesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // States
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  
  // Dialog states
  const [isCreateCompanyDialogOpen, setIsCreateCompanyDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [isCreateAddressDialogOpen, setIsCreateAddressDialogOpen] = useState(false);
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);

  // Forms
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", legalName: "", taxId: "", email: "", phone: "", website: "", description: "", active: true },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { 
      street: "", number: "", complement: "", neighborhood: "", city: "", state: "", 
      zipCode: "", country: "Brasil", isPrimary: false, active: true 
    },
  });

  // Mock data
  const mockCompanies: Company[] = [
    {
      id: 1,
      name: "ContractMaster Ltda",
      legalName: "ContractMaster Soluções Empresariais Ltda",
      taxId: "12.345.678/0001-99",
      email: "contato@contractmaster.com.br",
      phone: "(11) 3456-7890",
      website: "https://www.contractmaster.com.br",
      description: "Empresa especializada em gestão de contratos",
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
      website: "https://www.techsolutions.com.br",
      description: "Soluções tecnológicas avançadas",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockAddresses: Address[] = [
    {
      id: 1,
      entityType: "company",
      entityId: 1,
      street: "Av. Paulista",
      number: "1000",
      complement: "Sala 1501",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      country: "Brasil",
      isPrimary: true,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      entityType: "company",
      entityId: 2,
      street: "Rua das Flores",
      number: "500",
      complement: "Andar 3",
      neighborhood: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "20040-020",
      country: "Brasil",
      isPrimary: true,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    setCompanies(mockCompanies);
  }, []);

  // Handlers
  const handleCreateCompany = () => {
    setSelectedCompany(null);
    companyForm.reset({ name: "", legalName: "", taxId: "", email: "", phone: "", website: "", description: "", active: true });
    setIsCreateCompanyDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    const companyAddresses = mockAddresses.filter(addr => addr.entityId === company.subsidiaryId && addr.entityType === "company");
    setAddresses(companyAddresses);
    companyForm.reset(company);
    setActiveTab("edit");
  };

  const handleSaveCompany = (data: CompanyFormData) => {
    if (selectedCompany) {
      // Update existing company
      const updatedCompany = { ...selectedCompany, ...data };
      setCompanies(prev => prev.map(c => c.subsidiaryId === selectedCompany.subsidiaryId ? updatedCompany : c));
      setActiveTab("list");
      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram atualizados com sucesso.",
      });
    } else {
      // Create new company
      const newCompany: Company = {
        id: Math.max(...companies.map(c => c.subsidiaryId), 0) + 1,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setCompanies(prev => [...prev, newCompany]);
      setIsCreateCompanyDialogOpen(false);
      toast({
        title: "Empresa criada",
        description: "A empresa foi criada com sucesso.",
      });
    }
    companyForm.reset();
  };

  const handleDeleteCompany = (id: number) => {
    setCompanies(prev => prev.filter(c => c.subsidiaryId !== id));
    toast({
      title: "Empresa excluída",
      description: "A empresa foi excluída com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setSelectedCompany(null);
    setAddresses([]);
    setActiveTab("list");
    companyForm.reset();
  };

  const handleCreateAddress = () => {
    setSelectedAddress(null);
    addressForm.reset({ 
      street: "", number: "", complement: "", neighborhood: "", city: "", state: "", 
      zipCode: "", country: "Brasil", isPrimary: false, active: true 
    });
    setIsCreateAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    addressForm.reset(address);
    setIsEditAddressDialogOpen(true);
  };

  const handleSaveAddress = (data: AddressFormData) => {
    if (!selectedCompany) return;

    if (selectedAddress) {
      // Update existing address
      const updatedAddress = { ...selectedAddress, ...data };
      setAddresses(prev => prev.map(addr => addr.subsidiaryId === selectedAddress.subsidiaryId ? updatedAddress : addr));
      setIsEditAddressDialogOpen(false);
      toast({
        title: "Endereço atualizado",
        description: "O endereço foi atualizado com sucesso.",
      });
    } else {
      // Create new address
      const newAddress: Address = {
        id: Math.max(...addresses.map(addr => addr.subsidiaryId), 0) + 1,
        entityType: "company",
        entityId: selectedCompany.subsidiaryId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setAddresses(prev => [...prev, newAddress]);
      setIsCreateAddressDialogOpen(false);
      toast({
        title: "Endereço criado",
        description: "O endereço foi criado com sucesso.",
      });
    }
    addressForm.reset();
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.subsidiaryId !== id));
    toast({
      title: "Endereço excluído",
      description: "O endereço foi excluído com sucesso.",
    });
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.legalName && company.legalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.taxId && company.taxId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Lista de Empresas</TabsTrigger>
                <TabsTrigger value="edit" disabled={!selectedCompany}>
                  {selectedCompany ? `Editar: ${selectedCompany.name}` : "Editar Empresa"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-primary" />
                      Empresas
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Gerencie empresas e seus endereços
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateCompany}
                    className="neu-button neu-button-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Empresa
                  </Button>
                </div>

                {/* Search */}
                <Card className="neu-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Pesquisar empresas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 neu-input"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Companies Table */}
                <Card className="neu-card rounded-2xl shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold">Lista de Empresas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>Nome</TableHead>
                          <TableHead>Razão Social</TableHead>
                          <TableHead>CNPJ</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCompanies.map((company) => (
                          <TableRow key={company.subsidiaryId} className="border-border hover:bg-muted/50">
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.legalName || "-"}</TableCell>
                            <TableCell>{company.taxId || "-"}</TableCell>
                            <TableCell>{company.email || "-"}</TableCell>
                            <TableCell>{company.phone || "-"}</TableCell>
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
                                  onClick={() => handleEditCompany(company)}
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
                                      <AlertDialogAction onClick={() => handleDeleteCompany(company.subsidiaryId)} className="neu-button neu-button-danger">
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
              </TabsContent>

              <TabsContent value="edit" className="space-y-6">
                {selectedCompany && (
                  <Card className="neu-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Editar Empresa: {selectedCompany.name}
                        </CardTitle>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="neu-button neu-button-secondary"
                        >
                          Voltar à Lista
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="company" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
                          <TabsTrigger value="addresses">Endereços</TabsTrigger>
                          <TabsTrigger value="documents">Documentos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="company" className="space-y-4 mt-6">
                          <Form {...companyForm}>
                            <form onSubmit={companyForm.handleSubmit(handleSaveCompany)} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={companyForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nome da Empresa *</FormLabel>
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
                              </div>
                              <div className="grid grid-cols-2 gap-4">
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
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={companyForm.control}
                                  name="phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Telefone</FormLabel>
                                      <FormControl>
                                        <Input {...field} className="neu-input" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={companyForm.control}
                                  name="website"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Website</FormLabel>
                                      <FormControl>
                                        <Input {...field} className="neu-input" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={companyForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} className="neu-input" rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={handleCancelEdit} 
                                  className="neu-button neu-button-secondary"
                                >
                                  Cancelar
                                </Button>
                                <Button type="submit" className="neu-button neu-button-primary">
                                  Salvar Alterações
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </TabsContent>

                        <TabsContent value="addresses" className="space-y-4 mt-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Endereços da Empresa</h3>
                            <Button
                              onClick={handleCreateAddress}
                              className="neu-button neu-button-primary"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Novo Endereço
                            </Button>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border">
                                <TableHead>Logradouro</TableHead>
                                <TableHead>Número</TableHead>
                                <TableHead>Bairro</TableHead>
                                <TableHead>Cidade</TableHead>
                                <TableHead>UF</TableHead>
                                <TableHead>CEP</TableHead>
                                <TableHead>Principal</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {addresses.map((address) => (
                                <TableRow key={address.subsidiaryId} className="border-border hover:bg-muted/50">
                                  <TableCell className="font-medium">{address.street}</TableCell>
                                  <TableCell>{address.number || "-"}</TableCell>
                                  <TableCell>{address.neighborhood}</TableCell>
                                  <TableCell>{address.city}</TableCell>
                                  <TableCell>{address.state}</TableCell>
                                  <TableCell>{address.zipCode}</TableCell>
                                  <TableCell>
                                    <Badge variant={address.isPrimary ? "default" : "secondary"}>
                                      {address.isPrimary ? "Sim" : "Não"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditAddress(address)}
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
                                              Tem certeza que deseja excluir este endereço?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteAddress(address.subsidiaryId)} className="neu-button neu-button-danger">
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
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4 mt-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Documentos da Empresa</h3>
                            <Button className="neu-button neu-button-primary">
                              <Plus className="w-4 h-4 mr-2" />
                              Novo Documento
                            </Button>
                          </div>
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>Nenhum documento cadastrado</p>
                            <p className="text-sm">Clique em "Novo Documento" para adicionar</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Create Company Dialog */}
            <Dialog open={isCreateCompanyDialogOpen} onOpenChange={setIsCreateCompanyDialogOpen}>
              <DialogContent className="neu-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Empresa</DialogTitle>
                </DialogHeader>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(handleSaveCompany)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Empresa *</FormLabel>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={companyForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-input" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateCompanyDialogOpen(false)} 
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Criar Empresa
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>





            {/* Create Address Dialog */}
            <Dialog open={isCreateAddressDialogOpen} onOpenChange={setIsCreateAddressDialogOpen}>
              <DialogContent className="neu-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Novo Endereço</DialogTitle>
                </DialogHeader>
                <Form {...addressForm}>
                  <form onSubmit={addressForm.handleSubmit(handleSaveAddress)} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={addressForm.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logradouro *</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={addressForm.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
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
                        control={addressForm.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade *</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UF *</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP *</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={addressForm.control}
                        name="isPrimary"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Endereço Principal</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateAddressDialogOpen(false)} 
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Criar Endereço
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Edit Address Dialog */}
            <Dialog open={isEditAddressDialogOpen} onOpenChange={setIsEditAddressDialogOpen}>
              <DialogContent className="neu-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Endereço</DialogTitle>
                </DialogHeader>
                <Form {...addressForm}>
                  <form onSubmit={addressForm.handleSubmit(handleSaveAddress)} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={addressForm.control}
                          name="street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logradouro *</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={addressForm.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
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
                        control={addressForm.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade *</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UF *</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP *</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={addressForm.control}
                        name="isPrimary"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Endereço Principal</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditAddressDialogOpen(false)} 
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}