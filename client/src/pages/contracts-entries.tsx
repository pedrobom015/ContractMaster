import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Edit, Trash2, Search, FileText, Users, CreditCard, MapPin, 
  Eye, Calendar, Settings, UserCheck, History, Save, Building, Home,
  User, DollarSign, Link2
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ChargesTab from "@/components/contracts/charges-tab";
import type { Contract } from "@shared/schema";

// Contract Schema with sys_user creation functionality
const contractSchema = z.object({
  // Basic Info Tab
  contractNumber: z.string().min(1, "Número do contrato é obrigatório"),
  contractName: z.string().min(1, "Nome do contrato é obrigatório"),
  contractType: z.string().min(1, "Tipo do contrato é obrigatório"),
  groupBatchId: z.number().optional(),
  classId: z.number().optional(),
  statusId: z.number().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  admission: z.string().min(1, "Data de admissão é obrigatória"),
  obs: z.string().optional(),
  
  // Billing Config Tab  
  billingFrequency: z.number().default(1),
  monthInitialBilling: z.string().min(1, "Mês inicial é obrigatório"),
  yearInitialBilling: z.string().min(1, "Ano inicial é obrigatório"),
  optPayday: z.number().optional(),
  finalGrace: z.string().optional(),
  servicesAmount: z.number().optional(),
  firstCharge: z.number().optional(),
  lastCharge: z.number().optional(),
  chargesAmount: z.number().optional(),
  chargesPaid: z.number().optional(),
  renewAt: z.string().optional(),
  
  // Links & People Tab
  ownerId: z.number().optional(),
  collectorId: z.number().optional(),
  sellerId: z.number().optional(),
  indicatedBy: z.number().optional(),
  regionId: z.number().optional(),
  
  // Services Tab
  serviceOption1: z.string().optional(),
  serviceOption2: z.string().optional(),
  
  // User Creation Fields (for sys_user creation)
  ownerEmail: z.string().email("Email inválido").optional(),
  ownerPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  createUserAccount: z.boolean().default(true),
  
  // Stats (read-only, will be calculated)
  alives: z.number().optional(),
  deceaseds: z.number().optional(),
  dependents: z.number().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function ContractsEntries() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Form setup
  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      contractNumber: "",
      contractName: "",
      contractType: "",
      groupBatchId: undefined,
      classId: undefined,
      statusId: undefined,
      startDate: "",
      endDate: "",
      admission: "",
      obs: "",
      billingFrequency: 1,
      monthInitialBilling: "",
      yearInitialBilling: "",
      optPayday: undefined,
      finalGrace: "",
      servicesAmount: undefined,
      firstCharge: undefined,
      lastCharge: undefined,
      chargesAmount: undefined,
      chargesPaid: undefined,
      renewAt: "",
      ownerId: undefined,
      collectorId: undefined,
      sellerId: undefined,
      indicatedBy: undefined,
      regionId: undefined,
      serviceOption1: "",
      serviceOption2: "",
      ownerEmail: "",
      ownerPassword: "",
      createUserAccount: true,
      alives: undefined,
      deceaseds: undefined,
      dependents: undefined,
    },
  });

  // Fetch contracts
  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ['/api/contracts'],
  });

  // Create mutation with sys_user creation
  const createMutation = useMutation({
    mutationFn: (data: ContractFormData) =>
      apiRequest('/api/contracts', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso. Usuário do sistema também foi criado.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar contrato.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContractFormData }) =>
      apiRequest(`/api/contracts/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      setIsEditDialogOpen(false);
      form.reset();
      setSelectedContract(null);
      toast({
        title: "Sucesso",
        description: "Contrato atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar contrato.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/contracts/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      toast({
        title: "Sucesso",
        description: "Contrato excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir contrato.",
        variant: "destructive",
      });
    },
  });

  const filteredContracts = contracts.filter(contract =>
    contract.contractName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    form.reset();
    setSelectedContract(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    // Format dates for form inputs and handle null values
    form.reset({
      contractNumber: contract.contractNumber || "",
      contractName: contract.contractName || "",
      contractType: (contract as any).contractType || "",
      groupBatchId: contract.groupBatchId || undefined,
      classId: contract.classId || undefined,
      statusId: contract.statusId || undefined,
      startDate: (contract as any).startDate ? new Date((contract as any).startDate).toISOString().split('T')[0] : "",
      endDate: (contract as any).endDate ? new Date((contract as any).endDate).toISOString().split('T')[0] : "",
      admission: (contract as any).admission ? new Date((contract as any).admission).toISOString().split('T')[0] : "",
      obs: contract.obs || "",
      billingFrequency: (contract as any).billingFrequency || 1,
      monthInitialBilling: (contract as any).monthInitialBilling || "",
      yearInitialBilling: (contract as any).yearInitialBilling || "",
      optPayday: (contract as any).optPayday || undefined,
      finalGrace: (contract as any).finalGrace ? new Date((contract as any).finalGrace).toISOString().split('T')[0] : "",
      servicesAmount: contract.servicesAmount || undefined,
      firstCharge: (contract as any).firstCharge || undefined,
      lastCharge: (contract as any).lastCharge || undefined,
      chargesAmount: (contract as any).chargesAmount || undefined,
      chargesPaid: (contract as any).chargesPaid || undefined,
      renewAt: (contract as any).renewAt ? new Date((contract as any).renewAt).toISOString().split('T')[0] : "",
      ownerId: contract.ownerId || undefined,
      collectorId: contract.collectorId || undefined,
      sellerId: contract.sellerId || undefined,
      indicatedBy: contract.indicatedBy || undefined,
      regionId: contract.regionId || undefined,
      serviceOption1: (contract as any).serviceOption1 || "",
      serviceOption2: (contract as any).serviceOption2 || "",
      ownerEmail: "",
      ownerPassword: "",
      createUserAccount: true,
      alives: (contract as any).alives || undefined,
      deceaseds: (contract as any).deceaseds || undefined,
      dependents: (contract as any).dependents || undefined,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (data: ContractFormData) => {
    if (selectedContract) {
      updateMutation.mutate({ id: selectedContract.contractId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8">
          <Header />

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Contratos - Lançamentos</h1>
            <p className="text-muted-foreground">Gerencie contratos de serviço com criação automática de usuários</p>
          </div>

          {/* Content Card */}
          <div className="neu-card rounded-3xl p-8">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="neu-input rounded-2xl w-80">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome ou número do contrato..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 border-0 focus:ring-0 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="neu-button rounded-xl px-6 py-3 cursor-pointer hover:shadow-lg transition-all" onClick={handleCreate}>
                <div className="flex items-center">
                  <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                    <Plus className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-secondary font-medium">Novo Contrato</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="neu-flat rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Carregando contratos...</p>
                </div>
              ) : filteredContracts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum contrato encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Tente ajustar sua busca ou adicione um novo contrato." : "Comece adicionando seu primeiro contrato."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40">
                      <TableHead className="font-semibold text-muted-foreground">Número</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Nome do Contrato</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Tipo</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Data Início</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-muted-foreground text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow key={contract.contractId} className="border-border/40 hover:bg-muted/20">
                        <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                        <TableCell>{contract.contractName}</TableCell>
                        <TableCell>{(contract as any).contractType}</TableCell>
                        <TableCell>
                          {(contract as any).startDate ? new Date((contract as any).startDate).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(contract)}
                              className="neu-button rounded-lg w-8 h-8 p-0"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="neu-button rounded-lg w-8 h-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="neu-card rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o contrato "{contract.contractName}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="neu-button rounded-xl">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(contract.contractId)}
                                    className="neu-button rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
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
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create/Edit Dialog with Tabs */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedContract(null);
        }
      }}>
        <DialogContent className="neu-card rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                {selectedContract ? <Edit className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
              </div>
              {selectedContract ? "Editar Contrato" : "Novo Contrato"}
            </DialogTitle>
            <DialogDescription>
              {selectedContract 
                ? "Atualize as informações do contrato." 
                : "Crie um novo contrato. Um usuário do sistema será criado automaticamente."
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic-info" className="w-full">
            {/* First Row of Tabs */}
            <TabsList className="grid w-full grid-cols-4 neu-flat rounded-xl mb-2">
              <TabsTrigger value="basic-info" className="flex items-center neu-button rounded-lg">
                <FileText className="w-4 h-4 mr-2" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="billing-config" className="flex items-center neu-button rounded-lg">
                <DollarSign className="w-4 h-4 mr-2" />
                Cobrança
              </TabsTrigger>
              <TabsTrigger value="links-people" className="flex items-center neu-button rounded-lg">
                <Link2 className="w-4 h-4 mr-2" />
                Vínculos
              </TabsTrigger>
              <TabsTrigger value="user-creation" className="flex items-center neu-button rounded-lg">
                <User className="w-4 h-4 mr-2" />
                Usuário
              </TabsTrigger>
            </TabsList>
            
            {/* Second Row of Tabs */}
            <TabsList className="grid w-full grid-cols-5 neu-flat rounded-xl">
              <TabsTrigger value="beneficiaries" className="flex items-center neu-button rounded-lg">
                <Users className="w-4 h-4 mr-2" />
                Beneficiários
              </TabsTrigger>
              <TabsTrigger value="charges" className="flex items-center neu-button rounded-lg">
                <DollarSign className="w-4 h-4 mr-2" />
                Cobranças
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center neu-button rounded-lg">
                <MapPin className="w-4 h-4 mr-2" />
                Endereços
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center neu-button rounded-lg">
                <FileText className="w-4 h-4 mr-2" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center neu-button rounded-lg">
                <Settings className="w-4 h-4 mr-2" />
                Serviços
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                
                {/* Basic Info Tab */}
                <TabsContent value="basic-info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contractNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Contrato *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="Ex: CTR-2025-001" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contractName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Contrato *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="Nome do proprietário" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contractType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo do Contrato *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="Ex: Plano Familiar" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="groupBatchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grupo</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="ID do grupo"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Fim</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Admissão *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="obs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <div className="neu-input rounded-xl">
                            <Textarea placeholder="Observações sobre o contrato..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* User Creation Tab */}
                <TabsContent value="user-creation" className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">Criação de Usuário do Sistema</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Um usuário será criado automaticamente para que o proprietário do contrato possa acessar o sistema.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="createUserAccount"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input 
                              type="checkbox" 
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel>Criar conta de usuário automaticamente</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ownerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email do Proprietário</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="email" 
                                placeholder="email@exemplo.com" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha do Proprietário</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="password" 
                                placeholder="Senha (mín. 6 caracteres)" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Billing Config Tab */}
                <TabsContent value="billing-config" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billingFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequência de Cobrança</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="1 = Mensal, 12 = Anual"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 1)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthInitialBilling"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mês Inicial *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o mês" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="01">Janeiro</SelectItem>
                                  <SelectItem value="02">Fevereiro</SelectItem>
                                  <SelectItem value="03">Março</SelectItem>
                                  <SelectItem value="04">Abril</SelectItem>
                                  <SelectItem value="05">Maio</SelectItem>
                                  <SelectItem value="06">Junho</SelectItem>
                                  <SelectItem value="07">Julho</SelectItem>
                                  <SelectItem value="08">Agosto</SelectItem>
                                  <SelectItem value="09">Setembro</SelectItem>
                                  <SelectItem value="10">Outubro</SelectItem>
                                  <SelectItem value="11">Novembro</SelectItem>
                                  <SelectItem value="12">Dezembro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearInitialBilling"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano Inicial *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="2025"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="servicesAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor dos Serviços</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Links & People Tab */}
                <TabsContent value="links-people" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ownerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proprietário</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="ID do proprietário"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sellerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendedor</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="ID do vendedor"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="collectorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cobrador</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="ID do cobrador"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="regionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Região</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="ID da região"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Beneficiaries Tab */}
                <TabsContent value="beneficiaries" className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">Gerenciar Beneficiários</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione e gerencie os beneficiários deste contrato.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="neu-button rounded-xl"
                      onClick={() => {
                        // TODO: Implement beneficiary management
                        toast({
                          title: "Em desenvolvimento",
                          description: "Funcionalidade de beneficiários será implementada em breve.",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Beneficiário
                    </Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum beneficiário cadastrado ainda.</p>
                    <p className="text-sm">Use o botão acima para adicionar beneficiários.</p>
                  </div>
                </TabsContent>

                {/* Charges Tab */}
                <TabsContent value="charges" className="space-y-6">
                  {selectedContract?.contractId ? (
                    <ChargesTab contractId={selectedContract.contractId} />
                  ) : (
                    <div className="bg-muted/20 p-4 rounded-xl">
                      <h3 className="text-lg font-medium mb-2">Cobranças do Contrato</h3>
                      <p className="text-sm text-muted-foreground">
                        Salve o contrato primeiro para gerenciar as cobranças.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses" className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">Gerenciar Endereços</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione endereços de cobrança, correspondência e outros relacionados ao contrato.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="neu-button rounded-xl"
                      onClick={() => {
                        // TODO: Implement address management
                        toast({
                          title: "Em desenvolvimento",
                          description: "Funcionalidade de endereços será implementada em breve.",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Endereço
                    </Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum endereço cadastrado ainda.</p>
                    <p className="text-sm">Use o botão acima para adicionar endereços.</p>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">Gerenciar Documentos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Anexe documentos importantes relacionados ao contrato.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="neu-button rounded-xl"
                      onClick={() => {
                        // TODO: Implement document management
                        toast({
                          title: "Em desenvolvimento",
                          description: "Funcionalidade de documentos será implementada em breve.",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Anexar Documento
                    </Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum documento anexado ainda.</p>
                    <p className="text-sm">Use o botão acima para anexar documentos.</p>
                  </div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="serviceOption1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opção de Serviço 1</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="Descrição do serviço" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceOption2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opção de Serviço 2</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="Descrição do serviço" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setIsEditDialogOpen(false);
                      setSelectedContract(null);
                    }}
                    className="neu-button rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="neu-button rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createMutation.isPending || updateMutation.isPending 
                      ? (selectedContract ? "Atualizando..." : "Criando...") 
                      : (selectedContract ? "Atualizar Contrato" : "Criar Contrato")
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
