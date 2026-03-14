import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, Search, Users, User, Building, Mail, Phone, MapPin, 
  FileText, Settings, Shield, Key, Globe, Calendar, Hash, CreditCard
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Schemas for form validation
const sysUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50),
  login: z.string().min(1, "Login é obrigatório").max(200),
  email: z.string().email("Email inválido").max(100),
  passwordHash: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  isAdmin: z.boolean().default(false),
  active: z.boolean().default(true),
  twoFactorEnabled: z.boolean().default(false)
});

const partnerSchema = z.object({
  partnerCode: z.string().min(1, "Código é obrigatório").max(30),
  partnerName: z.string().min(1, "Nome é obrigatório").max(100),
  legalName: z.string().max(150).optional(),
  taxId: z.string().max(30).optional(),
  partnerTypeId: z.number().min(1, "Tipo de parceiro é obrigatório"),
  isCustomer: z.boolean().default(false),
  isVendor: z.boolean().default(false),
  isCollector: z.boolean().default(false),
  isEmployee: z.boolean().default(false),
  isAccredited: z.boolean().default(false),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(100).optional(),
  website: z.string().max(100).optional(),
  primaryPartnerPerson: z.string().max(100).optional(),
  notes: z.string().optional(),
  active: z.boolean().default(true)
});

type SysUserFormData = z.infer<typeof sysUserSchema>;
type PartnerFormData = z.infer<typeof partnerSchema>;

interface SysUser {
  id: number;
  name: string;
  login: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  active: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface PartnerType {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

interface Partner {
  id: number;
  partnerCode: string;
  partnerName: string;
  legalName?: string;
  taxId?: string;
  partnerTypeId: number;
  isCustomer: boolean;
  isVendor: boolean;
  isCollector: boolean;
  isEmployee: boolean;
  isAccredited: boolean;
  phone?: string;
  email?: string;
  website?: string;
  primaryPartnerPerson?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  partnerType: PartnerType;
  sysUser?: SysUser;
}

export default function PartnersPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("list");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFormTab, setCurrentFormTab] = useState("sysuser");

  // Sample data
  const mockPartnerTypes: PartnerType[] = [
    { id: 1, name: "Cliente", description: "Pessoa física ou jurídica que contrata serviços", active: true },
    { id: 2, name: "Fornecedor", description: "Empresa que fornece produtos ou serviços", active: true },
    { id: 3, name: "Parceiro Comercial", description: "Empresa parceira em negócios", active: true },
    { id: 4, name: "Prestador de Serviços", description: "Profissional autônomo ou empresa prestadora", active: true }
  ];

  const mockPartners: Partner[] = [
    {
      id: 1,
      partnerCode: "P001",
      partnerName: "João Silva",
      legalName: "João Silva ME",
      taxId: "123.456.789-00",
      partnerTypeId: 1,
      isCustomer: true,
      isVendor: false,
      isCollector: false,
      isEmployee: false,
      isAccredited: true,
      phone: "(11) 99999-9999",
      email: "joao.silva@email.com",
      website: "www.joaosilva.com.br",
      primaryPartnerPerson: "João Silva",
      notes: "Cliente VIP com histórico excelente",
      active: true,
      createdAt: new Date().toISOString(),
      partnerType: mockPartnerTypes[0],
      sysUser: {
        id: 1,
        name: "joao.silva",
        login: "joao.silva",
        email: "joao.silva@email.com",
        firstName: "João",
        lastName: "Silva",
        isAdmin: false,
        active: true,
        twoFactorEnabled: false,
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date().toISOString()
      }
    },
    {
      id: 2,
      partnerCode: "P002",
      partnerName: "Tech Solutions Ltda",
      legalName: "Tech Solutions Tecnologia Ltda",
      taxId: "12.345.678/0001-90",
      partnerTypeId: 2,
      isCustomer: false,
      isVendor: true,
      isCollector: false,
      isEmployee: false,
      isAccredited: true,
      phone: "(11) 3333-4444",
      email: "contato@techsolutions.com.br",
      website: "www.techsolutions.com.br",
      primaryPartnerPerson: "Maria Santos",
      notes: "Fornecedor principal de tecnologia",
      active: true,
      createdAt: new Date().toISOString(),
      partnerType: mockPartnerTypes[1],
      sysUser: {
        id: 2,
        name: "tech.solutions",
        login: "tech.solutions",
        email: "contato@techsolutions.com.br",
        firstName: "Tech",
        lastName: "Solutions",
        isAdmin: false,
        active: true,
        twoFactorEnabled: true,
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date().toISOString()
      }
    }
  ];

  const sysUserForm = useForm<SysUserFormData>({
    resolver: zodResolver(sysUserSchema),
    defaultValues: {
      name: "",
      login: "",
      email: "",
      passwordHash: "",
      firstName: "",
      lastName: "",
      isAdmin: false,
      active: true,
      twoFactorEnabled: false
    }
  });

  const partnerForm = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      partnerCode: "",
      partnerName: "",
      legalName: "",
      taxId: "",
      partnerTypeId: 1,
      isCustomer: false,
      isVendor: false,
      isCollector: false,
      isEmployee: false,
      isAccredited: false,
      phone: "",
      email: "",
      website: "",
      primaryPartnerPerson: "",
      notes: "",
      active: true
    }
  });

  const handleCreate = () => {
    const sysUserData = sysUserForm.getValues();
    const partnerData = partnerForm.getValues();
    
    console.log("Creating partner with sys_user:", { sysUserData, partnerData });
    
    toast({
      title: "Sucesso",
      description: "Parceiro criado com sucesso",
    });
    
    setIsCreateDialogOpen(false);
    sysUserForm.reset();
    partnerForm.reset();
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    
    if (partner.sysUser) {
      sysUserForm.reset({
        name: partner.sysUser.name,
        login: partner.sysUser.login,
        email: partner.sysUser.email,
        firstName: partner.sysUser.firstName,
        lastName: partner.sysUser.lastName,
        isAdmin: partner.sysUser.isAdmin,
        active: partner.sysUser.active,
        twoFactorEnabled: partner.sysUser.twoFactorEnabled,
        passwordHash: ""
      });
    }
    
    partnerForm.reset({
      partnerCode: partner.partnerCode,
      partnerName: partner.partnerName,
      legalName: partner.legalName,
      taxId: partner.taxId,
      partnerTypeId: partner.partnerTypeId,
      isCustomer: partner.isCustomer,
      isVendor: partner.isVendor,
      isCollector: partner.isCollector,
      isEmployee: partner.isEmployee,
      isAccredited: partner.isAccredited,
      phone: partner.phone,
      email: partner.email,
      website: partner.website,
      primaryPartnerPerson: partner.primaryPartnerPerson,
      notes: partner.notes,
      active: partner.active
    });
    
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    const sysUserData = sysUserForm.getValues();
    const partnerData = partnerForm.getValues();
    
    console.log("Updating partner with sys_user:", { sysUserData, partnerData });
    
    toast({
      title: "Sucesso",
      description: "Parceiro atualizado com sucesso",
    });
    
    setIsEditDialogOpen(false);
    setSelectedPartner(null);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Parceiro excluído com sucesso",
    });
  };

  const filteredPartners = mockPartners.filter(partner =>
    partner.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partnerType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPartnerTypesBadges = (partner: Partner) => {
    const types = [];
    if (partner.isCustomer) types.push("Cliente");
    if (partner.isVendor) types.push("Fornecedor");
    if (partner.isCollector) types.push("Cobrador");
    if (partner.isEmployee) types.push("Funcionário");
    if (partner.isAccredited) types.push("Credenciado");
    return types;
  };

  const renderSysUserForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={sysUserForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Usuário</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="usuario.nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={sysUserForm.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="login.usuario" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={sysUserForm.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" className="neu-flat" placeholder="usuario@email.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={sysUserForm.control}
        name="passwordHash"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input {...field} type="password" className="neu-flat" placeholder="Digite a senha" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={sysUserForm.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primeiro Nome</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="João" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={sysUserForm.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="Silva" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={sysUserForm.control}
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

        <FormField
          control={sysUserForm.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Administrador</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={sysUserForm.control}
          name="twoFactorEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>2FA Habilitado</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderPartnerForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={partnerForm.control}
          name="partnerCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código do Parceiro</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="P001" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={partnerForm.control}
          name="partnerTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Parceiro</FormLabel>
              <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                <FormControl>
                  <SelectTrigger className="neu-flat">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockPartnerTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={partnerForm.control}
        name="partnerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Parceiro</FormLabel>
            <FormControl>
              <Input {...field} className="neu-flat" placeholder="Nome completo do parceiro" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={partnerForm.control}
          name="legalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="Razão social completa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={partnerForm.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="000.000.000-00" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={partnerForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="(11) 99999-9999" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={partnerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="neu-flat" placeholder="email@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={partnerForm.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} className="neu-flat" placeholder="www.exemplo.com.br" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={partnerForm.control}
        name="primaryPartnerPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pessoa de Contato Principal</FormLabel>
            <FormControl>
              <Input {...field} className="neu-flat" placeholder="Nome da pessoa responsável" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-5 gap-4">
        <FormField
          control={partnerForm.control}
          name="isCustomer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Cliente</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={partnerForm.control}
          name="isVendor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Fornecedor</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={partnerForm.control}
          name="isCollector"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Cobrador</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={partnerForm.control}
          name="isEmployee"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Funcionário</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={partnerForm.control}
          name="isAccredited"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Credenciado</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={partnerForm.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea {...field} className="neu-flat" placeholder="Observações adicionais sobre o parceiro" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={partnerForm.control}
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
    </div>
  );

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
                  Gestão de Parceiros
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie parceiros e suas informações de usuário do sistema
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar parceiros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neu-flat pl-10 w-64"
                  />
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="neu-button neu-button-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Parceiro
                </Button>
              </div>
            </div>
          </div>

          {/* Partners Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span className="flex items-center space-x-3">
                  <Users className="text-2xl" />
                  <span>Parceiros Cadastrados</span>
                </span>
                <Badge variant="outline" className="neu-flat">
                  {filteredPartners.length} parceiros
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categorias</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium">{partner.partnerCode}</TableCell>
                      <TableCell>{partner.partnerName}</TableCell>
                      <TableCell>{partner.partnerType.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getPartnerTypesBadges(partner).map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{partner.email || "-"}</TableCell>
                      <TableCell>{partner.phone || "-"}</TableCell>
                      <TableCell>
                        {partner.sysUser ? (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{partner.sysUser.name}</span>
                            {partner.sysUser.isAdmin && <Shield className="w-3 h-3 text-orange-500" />}
                            {partner.sysUser.twoFactorEnabled && <Key className="w-3 h-3 text-green-500" />}
                          </div>
                        ) : (
                          <Badge variant="secondary">Sem usuário</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={partner.active ? "default" : "secondary"}>
                          {partner.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(partner)}
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
                                  Tem certeza que deseja excluir o parceiro "{partner.partnerName}"? Esta ação também excluirá o usuário do sistema associado.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(partner.id)} className="neu-button neu-button-danger">
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

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="neu-card max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Novo Parceiro</DialogTitle>
                <DialogDescription>
                  Crie um novo parceiro e usuário do sistema automaticamente
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={currentFormTab} onValueChange={setCurrentFormTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 neu-flat rounded-xl p-1">
                  <TabsTrigger
                    value="sysuser"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Usuário do Sistema</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="partner"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Dados do Parceiro</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sysuser">
                  <Form {...sysUserForm}>
                    {renderSysUserForm()}
                  </Form>
                </TabsContent>

                <TabsContent value="partner">
                  <Form {...partnerForm}>
                    {renderPartnerForm()}
                  </Form>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="neu-button neu-button-secondary"
                >
                  Cancelar
                </Button>
                <div className="flex space-x-2">
                  {currentFormTab === "sysuser" && (
                    <Button
                      type="button"
                      onClick={() => setCurrentFormTab("partner")}
                      className="neu-button neu-button-secondary"
                    >
                      Próximo: Dados do Parceiro
                    </Button>
                  )}
                  {currentFormTab === "partner" && (
                    <>
                      <Button
                        type="button"
                        onClick={() => setCurrentFormTab("sysuser")}
                        variant="outline"
                        className="neu-button neu-button-secondary"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCreate}
                        className="neu-button neu-button-primary"
                      >
                        Criar Parceiro
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="neu-card max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Editar Parceiro</DialogTitle>
                <DialogDescription>
                  Edite as informações do parceiro e usuário do sistema
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={currentFormTab} onValueChange={setCurrentFormTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 neu-flat rounded-xl p-1">
                  <TabsTrigger
                    value="sysuser"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Usuário do Sistema</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="partner"
                    className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Dados do Parceiro</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sysuser">
                  <Form {...sysUserForm}>
                    {renderSysUserForm()}
                  </Form>
                </TabsContent>

                <TabsContent value="partner">
                  <Form {...partnerForm}>
                    {renderPartnerForm()}
                  </Form>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="neu-button neu-button-secondary"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdate}
                  className="neu-button neu-button-primary"
                >
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}