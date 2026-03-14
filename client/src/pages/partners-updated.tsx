import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Edit, Trash2, Search, Users, User, Building, MapPin,
  FileText, Settings, Shield, Key, Eye
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { Partner, PartnerType } from "@shared/schema";

// Schemas for form validation
const sysUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50),
  login: z.string().min(1, "Login é obrigatório").max(200),
  email: z.string().email("Email inválido").max(100),
  passwordHash: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  role: z.enum(['admin', 'employee', 'customer', 'vendor', 'collector']).default('customer'),
  isAdmin: z.boolean().default(false),
  active: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  requiresPasswordReset: z.boolean().default(true),
  emailVerified: z.boolean().default(false)
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

// Utility functions for smart username generation and role assignment
const generateUsername = (partnerName: string, existingUsernames: string[] = []): string => {
  const cleanName = partnerName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim();

  let username: string;
  
  // For individuals (contains spaces, likely first/last name)
  if (cleanName.includes(' ')) {
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    if (parts.length >= 2) {
      username = `${parts[0]}.${parts[parts.length - 1]}`;
    } else {
      username = parts[0];
    }
  } else {
    // For companies or single names
    username = cleanName.replace(/\s+/g, '.');
  }
  
  // Handle duplicates by adding sequential numbers
  let finalUsername = username;
  let counter = 2;
  while (existingUsernames.includes(finalUsername)) {
    finalUsername = `${username}.${counter}`;
    counter++;
  }
  
  return finalUsername;
};

const determineRoleFromPartnerType = (partner: PartnerFormData): 'admin' | 'employee' | 'customer' | 'vendor' | 'collector' => {
  if (partner.isEmployee) return 'employee';
  if (partner.isVendor) return 'vendor';
  if (partner.isCollector) return 'collector';
  if (partner.isCustomer) return 'customer';
  return 'customer'; // Default fallback
};

const shouldEnableTwoFactor = (partner: PartnerFormData): boolean => {
  return partner.isEmployee || (partner.isVendor && partner.isAccredited);
};

const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function PartnersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("list");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFormTab, setCurrentFormTab] = useState("sysuser");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [selectedPartnerForManagement, setSelectedPartnerForManagement] = useState<Partner | null>(null);

  // Fetch partners from API
  const { data: partners = [] } = useQuery<any[]>({
    queryKey: ["/api/partners"],
  });

  // Fetch partner types from API
  const { data: partnerTypes = [] } = useQuery<any[]>({
    queryKey: ["/api/partner-types"],
  });

  // Mutations
  const createPartnerMutation = useMutation({
    mutationFn: async (data: { sysUserData: SysUserFormData; partnerData: PartnerFormData }) => {
      return await apiRequest("/api/partners-with-user", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({
        title: "Parceiro criado com sucesso",
        description: "O parceiro foi criado e o usuário foi configurado.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar parceiro",
        description: "Não foi possível criar o parceiro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async (data: { id: number; partnerData: Partial<PartnerFormData> }) => {
      return await apiRequest(`/api/partners/${data.id}`, {
        method: "PUT",
        body: data.partnerData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({
        title: "Parceiro atualizado com sucesso",
        description: "As alterações foram salvas.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar parceiro",
        description: "Não foi possível atualizar o parceiro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deletePartnerMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/partners/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({
        title: "Parceiro removido com sucesso",
        description: "O parceiro foi removido do sistema.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover parceiro",
        description: "Não foi possível remover o parceiro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const sysUserForm = useForm<SysUserFormData>({
    resolver: zodResolver(sysUserSchema),
    defaultValues: {
      name: "",
      login: "",
      email: "",
      passwordHash: "",
      firstName: "",
      lastName: "",
      role: "customer",
      isAdmin: false,
      active: false,
      twoFactorEnabled: false,
      requiresPasswordReset: true,
      emailVerified: false
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

  const handleCreate = async () => {
    const partnerData = partnerForm.getValues();
    const existingUsernames = partners
      .filter(p => p.sysUser)
      .map(p => p.sysUser!.login);
    
    const genUsername = generateUsername(partnerData.partnerName, existingUsernames);
    const autoRole = determineRoleFromPartnerType(partnerData);
    const auto2FA = shouldEnableTwoFactor(partnerData);
    const tempPassword = generateTemporaryPassword();
    const synchronizedEmail = partnerData.email || "";
    
    const enhancedSysUserData = {
      ...sysUserForm.getValues(),
      name: genUsername,
      login: genUsername,
      email: synchronizedEmail,
      role: autoRole,
      passwordHash: tempPassword,
      firstName: partnerData.partnerName.split(' ')[0] || "",
      lastName: partnerData.partnerName.split(' ').slice(1).join(' ') || "",
      active: false,
      twoFactorEnabled: auto2FA,
      requiresPasswordReset: true,
      emailVerified: false
    };
    
    try {
      await createPartnerMutation.mutateAsync({
        sysUserData: enhancedSysUserData,
        partnerData: partnerData
      });
      
      if (tempPassword) {
        setTimeout(() => {
          toast({
            title: "Senha Temporária Gerada",
            description: `Senha: ${tempPassword} (será resetada no primeiro login)`,
          });
        }, 2000);
      }
      
      setIsCreateDialogOpen(false);
      sysUserForm.reset();
      partnerForm.reset();
    } catch (error) {
      console.error("Error creating partner:", error);
    }
  };

  const handleEdit = (partner: any) => {
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

  const handleUpdate = async () => {
    if (!selectedPartner) return;
    const partnerData = partnerForm.getValues();
    
    try {
      await updatePartnerMutation.mutateAsync({
        id: selectedPartner.partnerId,
        partnerData: partnerData
      });
      
      setIsEditDialogOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      console.error("Error updating partner:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePartnerMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPartnerTypesBadges = (partner: any) => {
    const types = [];
    if (partner.isCustomer) types.push("Cliente");
    if (partner.isVendor) types.push("Fornecedor");
    if (partner.isCollector) types.push("Cobrador");
    if (partner.isEmployee) types.push("Funcionário");
    if (partner.isAccredited) types.push("Credenciado");
    return types;
  };

  const renderSysUserForm = () => {
    const partnerData = partnerForm.getValues();
    const previewUsername = partnerData.partnerName ? generateUsername(partnerData.partnerName) : "";
    const previewRole = partnerData.partnerName ? determineRoleFromPartnerType(partnerData) : "customer";
    const previewEmail = partnerData.email || "";
    
    return (
      <div className="space-y-6">
        <div className="neu-flat rounded-xl p-4 border border-primary/20">
          <h4 className="font-semibold mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Geração Automática de Usuário
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Username:</span>
              <span className="ml-2 font-mono bg-muted px-2 py-1 rounded">
                {previewUsername || "aguardando nome do parceiro..."}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Função:</span>
              <span className="ml-2 capitalize bg-muted px-2 py-1 rounded">
                {previewRole}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-mono bg-muted px-2 py-1 rounded">
                {previewEmail || "aguardando email do parceiro..."}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={sysUserForm.control}
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Nome de Usuário (Auto-gerado)</FormLabel>
                <FormControl>
                  <Input 
                    className="neu-flat bg-muted/50" 
                    placeholder={previewUsername || "usuario.nome"}
                    disabled
                    value={previewUsername}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={sysUserForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função no Sistema</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="neu-flat">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Cliente</SelectItem>
                    <SelectItem value="vendor">Fornecedor</SelectItem>
                    <SelectItem value="employee">Funcionário</SelectItem>
                    <SelectItem value="collector">Cobrador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
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
};

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
                  {partnerTypes.map((type) => (
                    <SelectItem key={type.partnerTypeId} value={type.partnerTypeId.toString()}>
                      {type.typeName}
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
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="neu-card rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Gestão de Parceiros
                </h1>
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

          <Card className="neu-card rounded-3xl">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="border-b border-border p-6">
                  <TabsList className="grid w-full grid-cols-1 neu-flat rounded-xl p-1 max-w-xs">
                    <TabsTrigger
                      value="list"
                      className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Lista de Parceiros</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="list" className="p-6">
                  <div className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>Código</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categorias</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPartners.map((partner) => (
                          <TableRow key={partner.partnerId} className="border-border hover:bg-muted/50">
                            <TableCell className="font-medium">{partner.partnerCode}</TableCell>
                            <TableCell>{partner.partnerName}</TableCell>
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
                            <TableCell>
                              {partner.sysUser ? (
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4" />
                                  <span>{partner.sysUser.name}</span>
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
                                  onClick={() => {
                                    setSelectedPartnerForManagement(partner);
                                    setIsAddressDialogOpen(true);
                                  }}
                                  className="neu-button neu-button-info"
                                >
                                  <MapPin className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedPartnerForManagement(partner);
                                    setIsDocumentDialogOpen(true);
                                  }}
                                  className="neu-button neu-button-info"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
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
                                        Tem certeza que deseja excluir o parceiro "{partner.partnerName}"?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(partner.partnerId)} className="neu-button neu-button-danger">
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
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="neu-card max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Novo Parceiro</DialogTitle>
              </DialogHeader>
              
              <Tabs value={currentFormTab} onValueChange={setCurrentFormTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 neu-flat rounded-xl p-1">
                  <TabsTrigger value="sysuser" className="neu-button">Usuário</TabsTrigger>
                  <TabsTrigger value="partner" className="neu-button">Parceiro</TabsTrigger>
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

              <div className="flex justify-end pt-6 border-t space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button">
                  Cancelar
                </Button>
                <Button onClick={handleCreate} className="neu-button neu-button-primary">
                  Criar Parceiro
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="neu-card max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Editar Parceiro</DialogTitle>
              </DialogHeader>
              
              <Form {...partnerForm}>
                {renderPartnerForm()}
              </Form>

              <div className="flex justify-end pt-6 border-t space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button">
                  Cancelar
                </Button>
                <Button onClick={handleUpdate} className="neu-button neu-button-primary">
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
            <DialogContent className="neu-card max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Endereços - {selectedPartnerForManagement?.partnerName}</DialogTitle>
              </DialogHeader>
              <div className="p-6 text-center">Endereços (Mock)</div>
              <div className="flex justify-end pt-6 border-t">
                <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)} className="neu-button">
                  Fechar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
            <DialogContent className="neu-card max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Documentos - {selectedPartnerForManagement?.partnerName}</DialogTitle>
              </DialogHeader>
              <div className="p-6 text-center">Documentos (Mock)</div>
              <div className="flex justify-end pt-6 border-t">
                <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)} className="neu-button">
                  Fechar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
