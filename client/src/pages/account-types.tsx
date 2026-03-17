// @ts-nocheck
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { AccountType } from "@/types/financial";

// Account Type Schema
const accountTypeSchema = z.object({
  typeName: z.string().min(1, "Nome do tipo é obrigatório").max(100),
  description: z.string().optional(),
  nature: z.string().min(1, "Natureza é obrigatória"),
  active: z.boolean(),
});

type AccountTypeFormData = z.infer<typeof accountTypeSchema>;

export default function AccountTypesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accountTypes = [], isLoading } = useQuery({
    queryKey: ["/api/financial/account-types"],
  });

  const form = useForm<AccountTypeFormData>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
      nature: "",
      active: true,
    },
  });

  const filteredAccountTypes = accountTypes.filter((accountType: AccountType) =>
    accountType.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (accountType.description && accountType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createMutation = useMutation({
    mutationFn: (data: AccountTypeFormData) =>
      apiRequest("/api/financial/account-types", {
        method: "POST",
        body: JSON.stringify({ ...data, companyId: 1 }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/account-types"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({ title: "Sucesso", description: "Tipo de conta criado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao criar tipo de conta", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AccountTypeFormData & { id: number }) =>
      apiRequest(`/api/financial/account-types/${data.accountTypeId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/account-types"] });
      setIsEditDialogOpen(false);
      setSelectedAccountType(null);
      form.reset();
      toast({ title: "Sucesso", description: "Tipo de conta atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao atualizar tipo de conta", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/financial/account-types/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/account-types"] });
      toast({ title: "Sucesso", description: "Tipo de conta excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao excluir tipo de conta", variant: "destructive" });
    },
  });

  const handleCreateAccountType = (data: AccountTypeFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateAccountType = (data: AccountTypeFormData) => {
    if (!selectedAccountType) return;
    updateMutation.mutate({ ...data, id: selectedAccountType.accountTypeId });
  };

  const handleEditAccountType = (accountType: AccountType) => {
    setSelectedAccountType(accountType);
    form.reset({
      typeName: accountType.typeName,
      description: accountType.description || "",
      nature: accountType.nature,
      active: accountType.active,
    });
    setIsEditDialogOpen(true);
  };

  const natureOptions = [
    { value: "ASSET", label: "Ativo" },
    { value: "LIABILITY", label: "Passivo" },
    { value: "EQUITY", label: "Patrimônio Líquido" },
    { value: "REVENUE", label: "Receita" },
    { value: "EXPENSE", label: "Despesa" },
  ];

  const getNatureBadge = (nature: string) => {
    const config = {
      ASSET: { color: "bg-blue-500", label: "Ativo" },
      LIABILITY: { color: "bg-red-500", label: "Passivo" },
      EQUITY: { color: "bg-green-500", label: "Patrimônio Líquido" },
      REVENUE: { color: "bg-purple-500", label: "Receita" },
      EXPENSE: { color: "bg-orange-500", label: "Despesa" },
    }[nature] || { color: "bg-gray-500", label: nature };

    return (
      <Badge className={`${config.color} text-white neu-flat`}>
        {config.label}
      </Badge>
    );
  };

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, isEdit: boolean = false) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações do tipo de conta" : "Preencha os dados do novo tipo de conta"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? handleUpdateAccountType : handleCreateAccountType)} className="space-y-4">
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tipo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ativo Circulante" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Natureza *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione a natureza" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {natureOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição do tipo de conta" className="neu-input" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  Tipos de Conta
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie tipos de conta para classificação do plano de contas
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredAccountTypes.length} tipos
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10 w-96"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </div>

          {/* Account Types Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Tipos de Conta</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredAccountTypes.length} encontrados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Nome do Tipo</TableHead>
                      <TableHead>Natureza</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Carregando tipos de conta...
                        </TableCell>
                      </TableRow>
                    ) : filteredAccountTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-gray-500">Nenhum tipo de conta encontrado</p>
                          <p className="text-sm text-gray-400 mt-2">Crie o primeiro tipo para começar a organizar contas.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccountTypes.map((accountType: AccountType) => (
                        <TableRow key={accountType.accountTypeId} className="border-gray-200">
                          <TableCell className="font-medium">{accountType.typeName}</TableCell>
                          <TableCell>{getNatureBadge(accountType.nature)}</TableCell>
                          <TableCell>{accountType.description || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={accountType.active ? "default" : "destructive"} className="neu-flat">
                              {accountType.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAccountType(accountType)}
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
                                      Tem certeza que deseja excluir este tipo de conta? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(accountType.accountTypeId)}
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
          {renderFormDialog(isCreateDialogOpen, setIsCreateDialogOpen, "Criar Tipo de Conta")}

          {/* Edit Dialog */}
          {renderFormDialog(isEditDialogOpen, setIsEditDialogOpen, "Editar Tipo de Conta", true)}
        </main>
      </div>
    </div>
  );
}