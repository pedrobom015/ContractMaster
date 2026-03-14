import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Settings, Users, CreditCard, ChevronDown, ChevronRight, Eye, FolderOpen, FileText } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Schemas for each table
const performedServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  active: z.boolean(),
});

const groupBatchSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  batchSize: z.number().min(1, "Tamanho do lote deve ser maior que 0").optional(),
  active: z.boolean(),
});

const chargeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  amount: z.string().optional(),
  type: z.string().max(50).optional(),
  active: z.boolean(),
});

const classeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  amountContracts: z.number().min(0).optional(),
  active: z.boolean(),
});

const addendumSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório").max(50),
  description: z.string().min(1, "Descrição é obrigatória").max(500),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  effectiveDate: z.string().min(1, "Data de vigência é obrigatória"),
  active: z.boolean(),
});

const contractStatusSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  color: z.string().max(7).optional(),
  isDefault: z.boolean().default(false),
  active: z.boolean(),
});

const paymentStatusSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  color: z.string().max(7).optional(),
  isDefault: z.boolean().default(false),
  active: z.boolean(),
});

const contractActiveSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(255).optional(),
  code: z.string().max(20).optional(),
  isDefault: z.boolean().default(false),
  active: z.boolean(),
});

type PerformedServiceFormData = z.infer<typeof performedServiceSchema>;
type GroupBatchFormData = z.infer<typeof groupBatchSchema>;
type ChargeFormData = z.infer<typeof chargeSchema>;
type ClasseFormData = z.infer<typeof classeSchema>;
type AddendumFormData = z.infer<typeof addendumSchema>;
type ContractStatusFormData = z.infer<typeof contractStatusSchema>;
type PaymentStatusFormData = z.infer<typeof paymentStatusSchema>;
type ContractActiveFormData = z.infer<typeof contractActiveSchema>;

// Interfaces
interface PerformedService {
  id: number;
  name: string;
  description?: string;
  code?: string;
  active: boolean;
  createdAt: string;
}

interface GroupBatch {
  id: number;
  name: string;
  description?: string;
  code?: string;
  batchSize?: number;
  active: boolean;
  createdAt: string;
}

interface Charge {
  id: number;
  name: string;
  description?: string;
  code?: string;
  amount?: string;
  type?: string;
  active: boolean;
  createdAt: string;
}

interface ProratedService {
  id: number;
  chargeId: number;
  serviceDescription: string;
  quantity: number;
  unitValue: string;
  totalValue: string;
  serviceDate: string;
  isProrated: boolean;
  proratedFactor: number;
  status: string;
  createdAt: string;
}

interface Classe {
  id: number;
  name: string;
  description?: string;
  amountContracts?: number;
  active: boolean;
  createdAt: string;
}

interface Addendum {
  id: number;
  type: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  effectiveDate: string;
  active: boolean;
  createdAt: string;
}

interface ContractStatus {
  id: number;
  name: string;
  description?: string;
  code?: string;
  color?: string;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
}

interface PaymentStatus {
  id: number;
  name: string;
  description?: string;
  code?: string;
  color?: string;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
}

interface ContractActive {
  id: number;
  name: string;
  description?: string;
  code?: string;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
}

export default function ContractsTablesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("processes");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [expandedCharges, setExpandedCharges] = useState<Set<number>>(new Set());

  // Forms
  const performedServiceForm = useForm<PerformedServiceFormData>({
    resolver: zodResolver(performedServiceSchema),
    defaultValues: { name: "", description: "", code: "", active: true },
  });

  const groupBatchForm = useForm<GroupBatchFormData>({
    resolver: zodResolver(groupBatchSchema),
    defaultValues: { name: "", description: "", code: "", batchSize: 1, active: true },
  });

  const chargeForm = useForm<ChargeFormData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: { name: "", description: "", code: "", amount: "", type: "", active: true },
  });

  const classeForm = useForm<ClasseFormData>({
    resolver: zodResolver(classeSchema),
    defaultValues: { name: "", description: "", amountContracts: 0, active: true },
  });

  const addendumForm = useForm<AddendumFormData>({
    resolver: zodResolver(addendumSchema),
    defaultValues: { type: "", description: "", oldValue: "", newValue: "", effectiveDate: "", active: true },
  });

  const contractStatusForm = useForm<ContractStatusFormData>({
    resolver: zodResolver(contractStatusSchema),
    defaultValues: { name: "", description: "", code: "", color: "", isDefault: false, active: true },
  });

  const paymentStatusForm = useForm<PaymentStatusFormData>({
    resolver: zodResolver(paymentStatusSchema),
    defaultValues: { name: "", description: "", code: "", color: "", isDefault: false, active: true },
  });

  const contractActiveForm = useForm<ContractActiveFormData>({
    resolver: zodResolver(contractActiveSchema),
    defaultValues: { name: "", description: "", code: "", isDefault: false, active: true },
  });

  // State for new tables
  const [contractStatuses, setContractStatuses] = useState<ContractStatus[]>([
    { id: 1, name: "Ativo", description: "Contrato em vigência", code: "ATIVO", color: "#22c55e", isDefault: true, active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Suspenso", description: "Contrato temporariamente suspenso", code: "SUSPENSO", color: "#f59e0b", isDefault: false, active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Cancelado", description: "Contrato cancelado", code: "CANCELADO", color: "#ef4444", isDefault: false, active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Renovado", description: "Contrato renovado", code: "RENOVADO", color: "#3b82f6", isDefault: false, active: true, createdAt: new Date().toISOString() },
  ]);

  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([
    { id: 1, name: "Em Dia", description: "Pagamentos em dia", code: "EM_DIA", color: "#22c55e", isDefault: true, active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Atraso", description: "Pagamento em atraso", code: "ATRASO", color: "#f59e0b", isDefault: false, active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Inadimplente", description: "Cliente inadimplente", code: "INADIMPLENTE", color: "#ef4444", isDefault: false, active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Quitado", description: "Totalmente quitado", code: "QUITADO", color: "#10b981", isDefault: false, active: true, createdAt: new Date().toISOString() },
  ]);

  const [contractActives, setContractActives] = useState<ContractActive[]>([
    { id: 1, name: "Ativo", description: "Contrato ativo no sistema", code: "ATIVO", isDefault: true, active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Inativo", description: "Contrato inativo no sistema", code: "INATIVO", isDefault: false, active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Bloqueado", description: "Contrato temporariamente bloqueado", code: "BLOQUEADO", isDefault: false, active: true, createdAt: new Date().toISOString() },
  ]);

  // Sample data
  const mockPerformedServices: PerformedService[] = [
    { id: 1, name: "Consulta Médica", description: "Consulta médica geral", code: "CONS001", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Exame Laboratorial", description: "Exames de laboratório", code: "EXAM001", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Cirurgia Eletiva", description: "Procedimentos cirúrgicos eletivos", code: "CIR001", active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Fisioterapia", description: "Sessões de fisioterapia", code: "FISIO001", active: true, createdAt: new Date().toISOString() },
  ];

  const mockGroupBatches: GroupBatch[] = [
    { id: 1, name: "Grupo A", description: "Grupo principal de processamento", code: "GPA", batchSize: 100, active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Grupo B", description: "Grupo secundário de processamento", code: "GPB", batchSize: 50, active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Grupo C", description: "Grupo especializado", code: "GPC", batchSize: 25, active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Grupo Emergência", description: "Grupo para casos urgentes", code: "GPE", batchSize: 10, active: true, createdAt: new Date().toISOString() },
  ];

  const mockCharges: Charge[] = [
    { id: 1, name: "Taxa de Adesão", description: "Taxa inicial de adesão ao plano", code: "TAXA001", amount: "R$ 50,00", type: "Única", active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Mensalidade Básica", description: "Mensalidade do plano básico", code: "MENS001", amount: "R$ 120,00", type: "Mensal", active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Coparticipação", description: "Taxa de coparticipação por consulta", code: "COPART001", amount: "R$ 25,00", type: "Por uso", active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Taxa Administrativa", description: "Taxa administrativa mensal", code: "ADM001", amount: "R$ 15,00", type: "Mensal", active: true, createdAt: new Date().toISOString() },
  ];

  const mockProratedServices: ProratedService[] = [
    { id: 1, chargeId: 2, serviceDescription: "Consulta Cardiológica", quantity: 1, unitValue: "R$ 150,00", totalValue: "R$ 150,00", serviceDate: "2024-01-15", isProrated: true, proratedFactor: 1.0, status: "ativo", createdAt: new Date().toISOString() },
    { id: 2, chargeId: 2, serviceDescription: "Exame de Sangue", quantity: 2, unitValue: "R$ 45,00", totalValue: "R$ 90,00", serviceDate: "2024-01-20", isProrated: false, proratedFactor: 1.0, status: "ativo", createdAt: new Date().toISOString() },
    { id: 3, chargeId: 3, serviceDescription: "Fisioterapia", quantity: 10, unitValue: "R$ 80,00", totalValue: "R$ 800,00", serviceDate: "2024-01-10", isProrated: true, proratedFactor: 0.8, status: "ativo", createdAt: new Date().toISOString() },
    { id: 4, chargeId: 3, serviceDescription: "Raio-X Tórax", quantity: 1, unitValue: "R$ 120,00", totalValue: "R$ 120,00", serviceDate: "2024-01-25", isProrated: false, proratedFactor: 1.0, status: "ativo", createdAt: new Date().toISOString() },
    { id: 5, chargeId: 4, serviceDescription: "Processamento Administrativo", quantity: 1, unitValue: "R$ 15,00", totalValue: "R$ 15,00", serviceDate: "2024-01-01", isProrated: false, proratedFactor: 1.0, status: "ativo", createdAt: new Date().toISOString() },
  ];

  const mockClasses: Classe[] = [
    { id: 1, name: "Categoria Premium", description: "Categoria premium com todos os benefícios", amountContracts: 150, active: true, createdAt: new Date().toISOString() },
    { id: 2, name: "Categoria Básica", description: "Categoria básica com benefícios essenciais", amountContracts: 320, active: true, createdAt: new Date().toISOString() },
    { id: 3, name: "Categoria Familiar", description: "Categoria para planos familiares", amountContracts: 85, active: true, createdAt: new Date().toISOString() },
    { id: 4, name: "Categoria Executiva", description: "Categoria para executivos com cobertura ampliada", amountContracts: 45, active: true, createdAt: new Date().toISOString() },
  ];

  const mockAddendums: Addendum[] = [
    { id: 1, type: "value_change", description: "Alteração de valor mensal do plano", oldValue: "R$ 120,00", newValue: "R$ 135,00", effectiveDate: "2024-02-01", active: true, createdAt: new Date().toISOString() },
    { id: 2, type: "plan_change", description: "Mudança de plano básico para premium", oldValue: "Plano Básico", newValue: "Plano Premium", effectiveDate: "2024-01-15", active: true, createdAt: new Date().toISOString() },
    { id: 3, type: "suspension", description: "Suspensão temporária do contrato", oldValue: "Ativo", newValue: "Suspenso", effectiveDate: "2024-03-01", active: true, createdAt: new Date().toISOString() },
    { id: 4, type: "term_extension", description: "Extensão do prazo do contrato", oldValue: "12 meses", newValue: "24 meses", effectiveDate: "2024-01-01", active: true, createdAt: new Date().toISOString() },
  ];

  // Utility functions
  const getFilteredData = (data: any[], searchFields: string[]) => {
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getProratedServicesByCharge = (chargeId: number): ProratedService[] => {
    return mockProratedServices.filter(service => service.chargeId === chargeId);
  };

  const toggleChargeExpansion = (chargeId: number) => {
    const newExpanded = new Set(expandedCharges);
    if (newExpanded.has(chargeId)) {
      newExpanded.delete(chargeId);
    } else {
      newExpanded.add(chargeId);
    }
    setExpandedCharges(newExpanded);
  };

  const resetForm = (tab: string) => {
    switch (tab) {
      case "processes":
        performedServiceForm.reset();
        break;
      case "groups":
        groupBatchForm.reset();
        break;
      case "charges":
        chargeForm.reset();
        break;
      case "categories":
        classeForm.reset();
        break;
      case "addendums":
        addendumForm.reset();
        break;
      case "contract_status":
        contractStatusForm.reset();
        break;
      case "payment_status":
        paymentStatusForm.reset();
        break;
      case "contract_active":
        contractActiveForm.reset();
        break;
    }
  };

  const populateForm = (entity: any, tab: string) => {
    switch (tab) {
      case "processes":
        performedServiceForm.reset(entity);
        break;
      case "groups":
        groupBatchForm.reset(entity);
        break;
      case "charges":
        chargeForm.reset(entity);
        break;
      case "categories":
        classeForm.reset(entity);
        break;
      case "addendums":
        addendumForm.reset(entity);
        break;
      case "contract_status":
        contractStatusForm.reset(entity);
        break;
      case "payment_status":
        paymentStatusForm.reset(entity);
        break;
      case "contract_active":
        contractActiveForm.reset(entity);
        break;
    }
  };

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

  // Render functions for each table
  const renderProcessesTab = () => {
    const filteredServices = getFilteredData(mockPerformedServices, ['name', 'description', 'code']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Processos Realizados</CardTitle>
            <Button
              onClick={() => handleCreate('processes')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Processo
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
              {filteredServices.map((service: PerformedService) => (
                <TableRow key={service.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.code || "-"}</TableCell>
                  <TableCell>{service.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service, "processes")}
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
                              Tem certeza que deseja excluir o processo "{service.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(service.id)} className="neu-button neu-button-danger">
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

  const renderGroupsTab = () => {
    const filteredGroups = getFilteredData(mockGroupBatches, ['name', 'description', 'code']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Grupos de Lote</CardTitle>
            <Button
              onClick={() => handleCreate('groups')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Grupo
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
                <TableHead>Tamanho do Lote</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group: GroupBatch) => (
                <TableRow key={group.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.code || "-"}</TableCell>
                  <TableCell>{group.description || "-"}</TableCell>
                  <TableCell>{group.batchSize || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={group.active ? "default" : "secondary"}>
                      {group.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(group, "groups")}
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
                              Tem certeza que deseja excluir o grupo "{group.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(group.id)} className="neu-button neu-button-danger">
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

  const renderChargesTab = () => {
    const filteredCharges = getFilteredData(mockCharges, ['name', 'description', 'code', 'type']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Circulares de Cobrança</CardTitle>
            <Button
              onClick={() => handleCreate('charges')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Circular
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-12"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCharges.map((charge: Charge) => {
                const proratedServices = getProratedServicesByCharge(charge.id);
                const isExpanded = expandedCharges.has(charge.id);
                
                return (
                  <React.Fragment key={`charge-${charge.id}`}>
                    <TableRow className="border-border hover:bg-muted/50">
                      <TableCell>
                        {proratedServices.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleChargeExpansion(charge.id)}
                            className="p-1 h-8 w-8"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{charge.name}</TableCell>
                      <TableCell>{charge.code || "-"}</TableCell>
                      <TableCell>{charge.description || "-"}</TableCell>
                      <TableCell>{charge.amount || "-"}</TableCell>
                      <TableCell>{charge.type || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={charge.active ? "default" : "secondary"}>
                          {charge.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {proratedServices.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleChargeExpansion(charge.id)}
                              className="neu-flat text-xs px-2 py-1 h-6"
                            >
                              {proratedServices.length} serviços
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(charge, "charges")}
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
                                  Tem certeza que deseja excluir a circular "{charge.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(charge.id)} className="neu-button neu-button-danger">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Prorated Services Detail Rows */}
                    {isExpanded && proratedServices.length > 0 && (
                      <TableRow key={`details-${charge.id}`} className="bg-muted/20">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4 border-l-4 border-primary/20">
                            <div className="mb-3">
                              <h4 className="font-semibold text-sm text-muted-foreground">
                                Serviços Rateados - {charge.name}
                              </h4>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow className="border-border">
                                  <TableHead className="text-xs">Descrição do Serviço</TableHead>
                                  <TableHead className="text-xs">Qtd</TableHead>
                                  <TableHead className="text-xs">Valor Unit.</TableHead>
                                  <TableHead className="text-xs">Valor Total</TableHead>
                                  <TableHead className="text-xs">Data Serviço</TableHead>
                                  <TableHead className="text-xs">Rateado</TableHead>
                                  <TableHead className="text-xs">Fator</TableHead>
                                  <TableHead className="text-xs">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {proratedServices.map((service: ProratedService) => (
                                  <TableRow key={service.id} className="border-border">
                                    <TableCell className="text-sm">{service.serviceDescription}</TableCell>
                                    <TableCell className="text-sm">{service.quantity}</TableCell>
                                    <TableCell className="text-sm">{service.unitValue}</TableCell>
                                    <TableCell className="text-sm font-medium">{service.totalValue}</TableCell>
                                    <TableCell className="text-sm">{new Date(service.serviceDate).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-sm">
                                      <Badge variant={service.isProrated ? "default" : "secondary"} className="text-xs">
                                        {service.isProrated ? "Sim" : "Não"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{service.proratedFactor.toFixed(2)}</TableCell>
                                    <TableCell className="text-sm">
                                      <Badge variant="outline" className="text-xs">
                                        {service.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderCategoriesTab = () => {
    const filteredCategories = getFilteredData(mockClasses, ['name', 'description']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Categorias de Contratos</CardTitle>
            <Button
              onClick={() => handleCreate('categories')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Qtd. Contratos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category: Classe) => (
                <TableRow key={category.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>{category.amountContracts || 0}</TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category, "categories")}
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
                              Tem certeza que deseja excluir a categoria "{category.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)} className="neu-button neu-button-danger">
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

  const renderAddendumsTab = () => {
    const filteredAddendums = getFilteredData(mockAddendums, ['type', 'description', 'oldValue', 'newValue']);
    
    return (
      <Card className="neu-card rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Adendos Contratuais</CardTitle>
            <Button
              onClick={() => handleCreate('addendums')}
              className="neu-button neu-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Adendo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Anterior</TableHead>
                <TableHead>Valor Novo</TableHead>
                <TableHead>Data Vigência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddendums.map((addendum: Addendum) => (
                <TableRow key={addendum.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="neu-flat">
                      {addendum.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{addendum.description}</TableCell>
                  <TableCell>{addendum.oldValue || "-"}</TableCell>
                  <TableCell className="font-medium">{addendum.newValue || "-"}</TableCell>
                  <TableCell>{new Date(addendum.effectiveDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={addendum.active ? "default" : "secondary"}>
                      {addendum.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(addendum, "addendums")}
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
                              Tem certeza que deseja excluir o adendo "{addendum.type}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(addendum.id)} className="neu-button neu-button-danger">
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

  // Render functions for new tabs
  const renderContractStatusTab = () => {
    const filteredData = getFilteredData(contractStatuses, ["name", "code", "description"]);
    
    return (
      <Card className="neu-flat rounded-2xl mt-6">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((status: ContractStatus) => (
                <TableRow key={status.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{status.name}</TableCell>
                  <TableCell>{status.code || "-"}</TableCell>
                  <TableCell>{status.description || "-"}</TableCell>
                  <TableCell>
                    {status.color && (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-xs">{status.color}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.isDefault ? "default" : "secondary"}>
                      {status.isDefault ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.active ? "default" : "secondary"}>
                      {status.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(status, "contract_status")}
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
                              Tem certeza que deseja excluir o status "{status.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(status.id)} className="neu-button neu-button-danger">
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

  const renderPaymentStatusTab = () => {
    const filteredData = getFilteredData(paymentStatuses, ["name", "code", "description"]);
    
    return (
      <Card className="neu-flat rounded-2xl mt-6">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((status: PaymentStatus) => (
                <TableRow key={status.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{status.name}</TableCell>
                  <TableCell>{status.code || "-"}</TableCell>
                  <TableCell>{status.description || "-"}</TableCell>
                  <TableCell>
                    {status.color && (
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-xs">{status.color}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.isDefault ? "default" : "secondary"}>
                      {status.isDefault ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.active ? "default" : "secondary"}>
                      {status.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(status, "payment_status")}
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
                              Tem certeza que deseja excluir o status "{status.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(status.id)} className="neu-button neu-button-danger">
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

  const renderContractActiveTab = () => {
    const filteredData = getFilteredData(contractActives, ["name", "code", "description"]);
    
    return (
      <Card className="neu-flat rounded-2xl mt-6">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((active: ContractActive) => (
                <TableRow key={active.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{active.name}</TableCell>
                  <TableCell>{active.code || "-"}</TableCell>
                  <TableCell>{active.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={active.isDefault ? "default" : "secondary"}>
                      {active.isDefault ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={active.active ? "default" : "secondary"}>
                      {active.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(active, "contract_active")}
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
                              Tem certeza que deseja excluir o tipo "{active.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(active.id)} className="neu-button neu-button-danger">
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
                  Contratos - Tabelas
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie as tabelas específicas do módulo de contratos
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
                  Contratos
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="neu-card rounded-3xl">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Tabelas de Contratos</span>
                <Badge variant="outline" className="neu-flat">
                  3 tabelas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="processes" className="neu-flat">Processos Executados</TabsTrigger>
                    <TabsTrigger value="groups" className="neu-flat">Grupos de Lote</TabsTrigger>
                    <TabsTrigger value="charges" className="neu-flat">Circulares</TabsTrigger>
                    <TabsTrigger value="categories" className="neu-flat">Classes</TabsTrigger>
                    <TabsTrigger value="addendums" className="neu-flat">Aditivos</TabsTrigger>
                  </TabsList>
                  
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="contract_status" className="neu-flat">Status do Contrato</TabsTrigger>
                    <TabsTrigger value="payment_status" className="neu-flat">Status da Cobrança</TabsTrigger>
                    <TabsTrigger value="contract_active" className="neu-flat">Ativos</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="processes">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Settings className="text-2xl" />
                          <span>Processos</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os serviços realizados</p>
                      </div>
                    </div>
                  </div>
                  {renderProcessesTab()}
                </TabsContent>

                <TabsContent value="groups">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Users className="text-2xl" />
                          <span>Grupos</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os grupos de lote</p>
                      </div>
                    </div>
                  </div>
                  {renderGroupsTab()}
                </TabsContent>

                <TabsContent value="charges">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <CreditCard className="text-2xl" />
                          <span>Circulares</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as circulares de cobrança</p>
                      </div>
                    </div>
                  </div>
                  {renderChargesTab()}
                </TabsContent>

                <TabsContent value="categories">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <FolderOpen className="text-2xl" />
                          <span>Classes</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie as classes de contratos</p>
                      </div>
                      <Button 
                        onClick={() => handleCreate("categories")}
                        className="neu-button neu-button-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Classe
                      </Button>
                    </div>
                  </div>
                  {renderCategoriesTab()}
                </TabsContent>

                <TabsContent value="addendums">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <FileText className="text-2xl" />
                          <span>Aditivos</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os aditivos contratuais</p>
                      </div>
                      <Button 
                        onClick={() => handleCreate("addendums")}
                        className="neu-button neu-button-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Aditivo
                      </Button>
                    </div>
                  </div>
                  {renderAddendumsTab()}
                </TabsContent>

                <TabsContent value="contract_status">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Settings className="text-2xl" />
                          <span>Status do Contrato</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os status dos contratos</p>
                      </div>
                      <Button 
                        onClick={() => handleCreate("contract_status")}
                        className="neu-button neu-button-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Status
                      </Button>
                    </div>
                  </div>
                  {renderContractStatusTab()}
                </TabsContent>

                <TabsContent value="payment_status">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <CreditCard className="text-2xl" />
                          <span>Status da Cobrança</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os status de cobrança</p>
                      </div>
                      <Button 
                        onClick={() => handleCreate("payment_status")}
                        className="neu-button neu-button-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Status
                      </Button>
                    </div>
                  </div>
                  {renderPaymentStatusTab()}
                </TabsContent>

                <TabsContent value="contract_active">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Eye className="text-2xl" />
                          <span>Ativos</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os tipos de ativo de contrato</p>
                      </div>
                      <Button 
                        onClick={() => handleCreate("contract_active")}
                        className="neu-button neu-button-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Tipo
                      </Button>
                    </div>
                  </div>
                  {renderContractActiveTab()}
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="neu-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {activeTab === "processes" && "Novo Processo"}
                  {activeTab === "groups" && "Novo Grupo"}
                  {activeTab === "charges" && "Nova Circular"}
                  {activeTab === "categories" && "Nova Classe"}
                  {activeTab === "addendums" && "Novo Aditivo"}
                  {activeTab === "contract_status" && "Novo Status do Contrato"}
                  {activeTab === "payment_status" && "Novo Status da Cobrança"}
                  {activeTab === "contract_active" && "Novo Tipo de Ativo"}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações para criar um novo registro
                </DialogDescription>
              </DialogHeader>
              
              {activeTab === "processes" && (
                <Form {...performedServiceForm}>
                  <form onSubmit={performedServiceForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={performedServiceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do processo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={performedServiceForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do processo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={performedServiceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do processo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={performedServiceForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "groups" && (
                <Form {...groupBatchForm}>
                  <form onSubmit={groupBatchForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={groupBatchForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do grupo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do grupo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do grupo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="batchSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho do Lote</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="neu-flat" 
                              placeholder="Tamanho do lote" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "charges" && (
                <Tabs defaultValue="dados" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 neu-flat rounded-xl p-1 mb-4">
                    <TabsTrigger
                      value="dados"
                      className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                    >
                      Dados da Circular
                    </TabsTrigger>
                    <TabsTrigger
                      value="servicos"
                      className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                    >
                      Serviços Rateados
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados">
                    <Form {...chargeForm}>
                      <form onSubmit={chargeForm.handleSubmit(handleSave)} className="space-y-4">
                        <FormField
                          control={chargeForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Nome da circular" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Código da circular" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="neu-flat" placeholder="Descrição da circular" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Valor da cobrança" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Tipo de cobrança" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Ativo</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            className="neu-button neu-button-secondary"
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" className="neu-button neu-button-primary">
                            Salvar
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="servicos">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Serviços Rateados</h3>
                        <Button size="sm" className="neu-button neu-button-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Serviço
                        </Button>
                      </div>
                      
                      <div className="neu-flat rounded-xl p-4">
                        <div className="text-center text-muted-foreground py-8">
                          <div className="mb-4">
                            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/50" />
                          </div>
                          <p className="text-sm">
                            Primeiro salve a circular para poder adicionar serviços rateados.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {activeTab === "categories" && (
                <Form {...classeForm}>
                  <form onSubmit={classeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={classeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome da classe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={classeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição da classe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={classeForm.control}
                      name="amountContracts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade de Contratos</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="neu-flat" 
                              placeholder="Quantidade de contratos" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={classeForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "addendums" && (
                <Form {...addendumForm}>
                  <form onSubmit={addendumForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={addendumForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Tipo do aditivo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do aditivo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="oldValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Anterior</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Valor anterior" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="newValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Novo</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Valor novo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Vigência</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="neu-flat" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "contract_status" && (
                <Form {...contractStatusForm}>
                  <form onSubmit={contractStatusForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={contractStatusForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="#22c55e" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Padrão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "payment_status" && (
                <Form {...paymentStatusForm}>
                  <form onSubmit={paymentStatusForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={paymentStatusForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="#22c55e" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Padrão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "contract_active" && (
                <Form {...contractActiveForm}>
                  <form onSubmit={contractActiveForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={contractActiveForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do tipo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do tipo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do tipo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Padrão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="neu-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {activeTab === "processes" && "Editar Processo"}
                  {activeTab === "groups" && "Editar Grupo"}
                  {activeTab === "charges" && "Editar Circular"}
                  {activeTab === "categories" && "Editar Classe"}
                  {activeTab === "addendums" && "Editar Aditivo"}
                  {activeTab === "contract_status" && "Editar Status do Contrato"}
                  {activeTab === "payment_status" && "Editar Status da Cobrança"}
                  {activeTab === "contract_active" && "Editar Tipo de Ativo"}
                </DialogTitle>
                <DialogDescription>
                  Edite as informações do registro
                </DialogDescription>
              </DialogHeader>
              
              {activeTab === "processes" && (
                <Form {...performedServiceForm}>
                  <form onSubmit={performedServiceForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={performedServiceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do processo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={performedServiceForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do processo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={performedServiceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do processo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={performedServiceForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "groups" && (
                <Form {...groupBatchForm}>
                  <form onSubmit={groupBatchForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={groupBatchForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do grupo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do grupo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do grupo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="batchSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho do Lote</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="neu-flat" 
                              placeholder="Tamanho do lote" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupBatchForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "charges" && (
                <Tabs defaultValue="dados" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 neu-flat rounded-xl p-1 mb-4">
                    <TabsTrigger
                      value="dados"
                      className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                    >
                      Dados da Circular
                    </TabsTrigger>
                    <TabsTrigger
                      value="servicos"
                      className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                    >
                      Serviços Rateados
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados">
                    <Form {...chargeForm}>
                      <form onSubmit={chargeForm.handleSubmit(handleSave)} className="space-y-4">
                        <FormField
                          control={chargeForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Nome da circular" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Código da circular" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="neu-flat" placeholder="Descrição da circular" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Valor da cobrança" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <FormControl>
                                <Input {...field} className="neu-flat" placeholder="Tipo de cobrança" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={chargeForm.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Ativo</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="neu-button neu-button-secondary"
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" className="neu-button neu-button-primary">
                            Salvar
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="servicos">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Serviços Rateados</h3>
                        <Button size="sm" className="neu-button neu-button-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Serviço
                        </Button>
                      </div>
                      
                      {selectedEntity && (
                        <div className="neu-flat rounded-xl p-4">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border">
                                <TableHead className="text-sm">Descrição do Serviço</TableHead>
                                <TableHead className="text-sm">Qtd</TableHead>
                                <TableHead className="text-sm">Valor Unit.</TableHead>
                                <TableHead className="text-sm">Valor Total</TableHead>
                                <TableHead className="text-sm">Data</TableHead>
                                <TableHead className="text-sm">Rateado</TableHead>
                                <TableHead className="text-sm">Status</TableHead>
                                <TableHead className="text-sm text-right">Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getProratedServicesByCharge(selectedEntity.id).map((service: ProratedService) => (
                                <TableRow key={service.id} className="border-border">
                                  <TableCell className="text-sm">{service.serviceDescription}</TableCell>
                                  <TableCell className="text-sm">{service.quantity}</TableCell>
                                  <TableCell className="text-sm">{service.unitValue}</TableCell>
                                  <TableCell className="text-sm font-medium">{service.totalValue}</TableCell>
                                  <TableCell className="text-sm">{new Date(service.serviceDate).toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell className="text-sm">
                                    <Badge variant={service.isProrated ? "default" : "secondary"} className="text-xs">
                                      {service.isProrated ? "Sim" : "Não"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    <Badge variant="outline" className="text-xs">
                                      {service.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end space-x-1">
                                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-destructive">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {getProratedServicesByCharge(selectedEntity?.id || 0).length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                    Nenhum serviço rateado encontrado para esta circular.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {activeTab === "categories" && (
                <Form {...classeForm}>
                  <form onSubmit={classeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={classeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome da classe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={classeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição da classe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={classeForm.control}
                      name="amountContracts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade de Contratos</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="neu-flat" 
                              placeholder="Quantidade de contratos" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={classeForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "addendums" && (
                <Form {...addendumForm}>
                  <form onSubmit={addendumForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={addendumForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Tipo do aditivo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do aditivo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="oldValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Anterior</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Valor anterior" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="newValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Novo</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Valor novo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Vigência</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="neu-flat" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addendumForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "contract_status" && (
                <Form {...contractStatusForm}>
                  <form onSubmit={contractStatusForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={contractStatusForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="#22c55e" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Padrão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractStatusForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "payment_status" && (
                <Form {...paymentStatusForm}>
                  <form onSubmit={paymentStatusForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={paymentStatusForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do status" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="#22c55e" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Padrão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentStatusForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {activeTab === "contract_active" && (
                <Form {...contractActiveForm}>
                  <form onSubmit={contractActiveForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField
                      control={contractActiveForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Nome do tipo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código</FormLabel>
                          <FormControl>
                            <Input {...field} className="neu-flat" placeholder="Código do tipo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="neu-flat" placeholder="Descrição do tipo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Padrão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contractActiveForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ativo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        className="neu-button neu-button-secondary"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="neu-button neu-button-primary">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}