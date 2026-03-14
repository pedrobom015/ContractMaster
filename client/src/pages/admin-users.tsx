import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Shield, User, Clock, CheckCircle } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  insertSysUserSchema, 
  type SysUser, 
  type InsertSysUser 
} from "@shared/schema";

type SysUserFormData = z.infer<typeof insertSysUserSchema>;

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SysUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<SysUserFormData>({
    resolver: zodResolver(insertSysUserSchema),
    defaultValues: {
      name: "",
      login: "",
      email: "",
      isActive: true,
      emailVerified: false,
    },
  });

  // API Queries
  const { data: sysUsers = [], isLoading } = useQuery<SysUser[]>({
    queryKey: ['/api/sys-users'],
  });

  // Mutations
  const createSysUserMutation = useMutation({
    mutationFn: (data: InsertSysUser) =>
      apiRequest('/api/sys-users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Usuário criado com sucesso" });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/sys-users'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao criar usuário", variant: "destructive" });
    },
  });

  const updateSysUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertSysUser> }) =>
      apiRequest(`/api/sys-users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Usuário atualizado com sucesso" });
      setIsEditDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/sys-users'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao atualizar usuário", variant: "destructive" });
    },
  });

  const deleteSysUserMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/sys-users/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Usuário excluído com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['/api/sys-users'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao excluir usuário", variant: "destructive" });
    },
  });

  // Mock data for system users
  const mockSysUsers: SysUser[] = [
    {
      id: 1,
      name: "admin",
      login: "admin",
      email: "admin@contractmaster.com",
      firstName: "Sistema",
      lastName: "Administrador",
      active: true,
      isAdmin: true,
      twoFactorEnabled: true,
      acceptedTermPolicy: true,
      acceptedTermPolicyAt: "2024-01-15T10:00:00Z",
      lastLogin: "2024-01-20T14:30:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "joao.silva",
      login: "joao.silva",
      email: "joao.silva@contractmaster.com",
      firstName: "João",
      lastName: "Silva",
      active: true,
      isAdmin: false,
      twoFactorEnabled: false,
      acceptedTermPolicy: true,
      acceptedTermPolicyAt: "2024-01-10T09:15:00Z",
      lastLogin: "2024-01-19T16:45:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "maria.santos",
      login: "maria.santos",
      email: "maria.santos@contractmaster.com",
      firstName: "Maria",
      lastName: "Santos",
      active: false,
      isAdmin: false,
      twoFactorEnabled: false,
      acceptedTermPolicy: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleCreateUser = (data: SysUserFormData) => {
    toast({
      title: "Sucesso",
      description: "Usuário criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditUser = (user: SysUser) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      login: user.login,
      email: user.email,
      passwordHash: "******", // Don't show actual password
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      active: user.active,
      isAdmin: user.isAdmin,
      twoFactorEnabled: user.twoFactorEnabled,
      acceptedTermPolicy: user.acceptedTermPolicy || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (data: SysUserFormData) => {
    toast({
      title: "Sucesso",
      description: "Usuário atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    form.reset();
  };

  const handleDeleteUser = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Usuário excluído com sucesso",
    });
  };

  const getUserStatusBadge = (user: SysUser) => {
    if (!user.active) {
      return <Badge variant="destructive" className="neu-flat">Inativo</Badge>;
    }
    return <Badge variant="default" className="neu-flat">Ativo</Badge>;
  };

  const getUserRoleBadge = (user: SysUser) => {
    if (user.isAdmin) {
      return <Badge variant="secondary" className="neu-flat">Administrador</Badge>;
    }
    return <Badge variant="outline" className="neu-flat">Usuário</Badge>;
  };

  const filteredUsers = sysUsers.filter((user) => {
    return searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: SysUserFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário *</FormLabel>
                    <FormControl>
                      <Input placeholder="nome.usuario" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login *</FormLabel>
                    <FormControl>
                      <Input placeholder="login.usuario" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="usuario@empresa.com" 
                      type="email"
                      className="neu-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite a senha" 
                      type="password"
                      className="neu-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primeiro Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="João" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Silva" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="neu-flat rounded-xl p-4">
              <h4 className="font-semibold mb-3">Configurações de Acesso</h4>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="neu-flat"
                        />
                      </FormControl>
                      <FormLabel>Usuário Ativo</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="neu-flat"
                        />
                      </FormControl>
                      <FormLabel>Administrador do Sistema</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="neu-flat"
                        />
                      </FormControl>
                      <FormLabel>Autenticação de Dois Fatores</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptedTermPolicy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="neu-flat"
                        />
                      </FormControl>
                      <FormLabel>Termos de Política Aceitos</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="neu-button"
              >
                {t("action.cancel")}
              </Button>
              <Button type="submit" className="neu-button">
                {t("action.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
                  Gerenciamento de Usuários
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie usuários do sistema e suas permissões
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredUsers.length} usuários
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, login ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10 w-96"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          {/* Users Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Usuários do Sistema</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredUsers.length} encontrados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Usuário</TableHead>
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Segurança</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {t("message.no_data")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-gray-200">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.login}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.firstName && user.lastName ? 
                              `${user.firstName} ${user.lastName}` : 
                              "-"
                            }
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getUserRoleBadge(user)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {user.twoFactorEnabled && (
                                <Badge variant="secondary" className="neu-flat text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  2FA
                                </Badge>
                              )}
                              {user.acceptedTermPolicy && (
                                <Badge variant="outline" className="neu-flat text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Termos
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? (
                              <div className="flex items-center text-sm">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-gray-400">Nunca</span>
                            )}
                          </TableCell>
                          <TableCell>{getUserStatusBadge(user)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                                className="neu-button h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="neu-button h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    disabled={user.isAdmin && user.name === "admin"}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="neu-card">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="neu-button bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {renderFormDialog(
            isCreateDialogOpen,
            setIsCreateDialogOpen,
            "Criar Novo Usuário",
            handleCreateUser
          )}

          {renderFormDialog(
            isEditDialogOpen,
            (open: boolean) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedUser(null);
            },
            "Editar Usuário",
            handleUpdateUser
          )}
        </main>
      </div>
    </div>
  );
}