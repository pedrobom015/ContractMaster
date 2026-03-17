// @ts-nocheck
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Account Schema
const accountSchema = z.object({
  accountCode: z.string().min(1, "Código da conta é obrigatório").max(20),
  accountName: z.string().min(1, "Nome da conta é obrigatório").max(100),
  accountTypeId: z.number().min(1, "Tipo de conta é obrigatório"),
  description: z.string().optional(),
  level: z.number().min(1).max(10).default(1),
  currency: z.string().default("BRL"),
  openingBalance: z.string().default("0"),
  currentBalance: z.string().default("0"),
  isBankAccount: z.boolean().default(false),
  isControlAccount: z.boolean().default(false),
  isTaxRelevant: z.boolean().default(false),
  active: z.boolean().default(true),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface Account {
  id: number;
  companyId: number;
  accountTypeId: number;
  parentAccountId?: number;
  accountCode: string;
  accountName: string;
  description?: string;
  level: number;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  isBankAccount: boolean;
  isControlAccount: boolean;
  isTaxRelevant: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  accountType?: {
    id: number;
    typeName: string;
  };
}

interface AccountType {
  id: number;
  companyId: number;
  typeName: string;
  description?: string;
  nature: string;
  active: boolean;
}

export default function ChartOfAccountsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['/api/financial/accounts'],
  });

  const { data: accountTypes = [] } = useQuery<AccountType[]>({
    queryKey: ['/api/financial/account-types'],
  });

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountCode: "",
      accountName: "",
      accountTypeId: 0,
      description: "",
      level: 1,
      currency: "BRL",
      openingBalance: "0",
      currentBalance: "0",
      isBankAccount: false,
      isControlAccount: false,
      isTaxRelevant: false,
      active: true,
    },
  });

  const filteredAccounts = accounts.filter((account: Account) =>
    account.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.description && account.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createMutation = useMutation({
    mutationFn: (data: AccountFormData) =>
      apiRequest("/api/financial/accounts", {
        method: "POST",
        body: JSON.stringify({ ...data, companyId: 1 }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/accounts"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({ title: "Sucesso", description: "Conta criada com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao criar conta", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AccountFormData & { id: number }) =>
      apiRequest(`/api/financial/accounts/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/accounts"] });
      setIsEditDialogOpen(false);
      setSelectedAccount(null);
      form.reset();
      toast({ title: "Sucesso", description: "Conta atualizada com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao atualizar conta", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/financial/accounts/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/accounts"] });
      toast({ title: "Sucesso", description: "Conta excluída com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao excluir conta", variant: "destructive" });
    },
  });

  const handleCreateAccount = (data: AccountFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateAccount = (data: AccountFormData) => {
    if (!selectedAccount) return;
    updateMutation.mutate({ ...data, id: selectedAccount.id });
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    form.reset({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountTypeId: account.accountTypeId,
      description: account.description || "",
      level: account.level,
      currency: account.currency,
      openingBalance: account.openingBalance.toString(),
      currentBalance: account.currentBalance.toString(),
      isBankAccount: account.isBankAccount,
      isControlAccount: account.isControlAccount,
      isTaxRelevant: account.isTaxRelevant,
      active: account.active,
    });
    setIsEditDialogOpen(true);
  };

  const getAccountTypeName = (accountTypeId: number) => {
    const accountType = accountTypes.find(type => type.id === accountTypeId);
    return accountType?.typeName || "—";
  };

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, isEdit: boolean = false) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações da conta" : "Preencha os dados da nova conta"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? handleUpdateAccount : handleCreateAccount)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código da Conta *</FormLabel>
                    <FormControl>
                      <Input placeholder="1.1.001" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Nível {i + 1}
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
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Conta *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da conta" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conta *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o tipo de conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BRL">Real (BRL)</SelectItem>
                        <SelectItem value="USD">Dólar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="openingBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Inicial</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Atual</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição da conta" className="neu-input" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Boolean Controls */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isBankAccount"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 neu-flat rounded-lg">
                      <div>
                        <FormLabel>Conta Bancária</FormLabel>
                        <div className="text-sm text-muted-foreground">Esta é uma conta bancária</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isControlAccount"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 neu-flat rounded-lg">
                      <div>
                        <FormLabel>Conta de Controle</FormLabel>
                        <div className="text-sm text-muted-foreground">Conta utilizada para controle</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isTaxRelevant"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 neu-flat rounded-lg">
                      <div>
                        <FormLabel>Relevante para Impostos</FormLabel>
                        <div className="text-sm text-muted-foreground">Conta relevante para cálculo de impostos</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 neu-flat rounded-lg">
                      <div>
                        <FormLabel>Conta Ativa</FormLabel>
                        <div className="text-sm text-muted-foreground">Conta disponível para uso</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                className="neu-button"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="neu-button"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (isEdit ? "Atualizar" : "Criar")}
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
                  Plano de Contas
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie o plano de contas contábil da empresa
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredAccounts.length} contas
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10 w-96"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </div>

          {/* Accounts Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Plano de Contas</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredAccounts.length} encontradas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Código</TableHead>
                      <TableHead>Nome da Conta</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Saldo Atual</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Propriedades</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Carregando contas...
                        </TableCell>
                      </TableRow>
                    ) : filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-gray-500">Nenhuma conta encontrada</p>
                          <p className="text-sm text-gray-400 mt-2">Crie a primeira conta para começar o plano de contas.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account: Account) => (
                        <TableRow key={account.id} className="border-gray-200">
                          <TableCell className="font-mono font-medium">{account.accountCode}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div style={{ marginLeft: `${(account.level - 1) * 20}px` }}>
                                {account.level > 1 && <ChevronRight className="h-4 w-4 inline mr-1 text-gray-400" />}
                                <div>
                                  <div className="font-medium">{account.accountName}</div>
                                  {account.description && (
                                    <div className="text-sm text-gray-500">{account.description}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="neu-flat">
                              {getAccountTypeName(account.accountTypeId)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">
                            <span className={account.currentBalance >= 0 ? "text-green-600" : "text-red-600"}>
                              {account.currency} {account.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="neu-flat">
                              Nível {account.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {account.isBankAccount && (
                                <Badge variant="outline" className="text-xs neu-flat">Bancária</Badge>
                              )}
                              {account.isControlAccount && (
                                <Badge variant="outline" className="text-xs neu-flat">Controle</Badge>
                              )}
                              {account.isTaxRelevant && (
                                <Badge variant="outline" className="text-xs neu-flat">Fiscal</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={account.active ? "default" : "destructive"} className="neu-flat">
                              {account.active ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAccount(account)}
                                className="neu-button"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="neu-button">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="neu-card">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(account.id)}
                                      className="neu-button"
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

          {/* Create Dialog */}
          {renderFormDialog(isCreateDialogOpen, setIsCreateDialogOpen, "Criar Conta")}

          {/* Edit Dialog */}
          {renderFormDialog(isEditDialogOpen, setIsEditDialogOpen, "Editar Conta", true)}
        </main>
      </div>
    </div>
  );
}