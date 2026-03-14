import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Cost Center Schema
const costCenterSchema = z.object({
  costCenterCode: z.string().min(1, "Código do centro de custo é obrigatório").max(30),
  costCenterName: z.string().min(1, "Nome do centro de custo é obrigatório").max(100),
  description: z.string().optional(),
  managerName: z.string().max(100).optional(),
  budget: z.string().optional(),
  level: z.number().min(1).max(10).default(1),
  active: z.boolean(),
});

type CostCenterFormData = z.infer<typeof costCenterSchema>;

interface CostCenter {
  id: number;
  companyId: number;
  parentCostCenterId?: number;
  costCenterCode: string;
  costCenterName: string;
  description?: string;
  managerName?: string;
  budget?: number;
  level: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CostCentersPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: costCenters = [], isLoading } = useQuery({
    queryKey: ['/api/financial/cost-centers'],
  });

  const form = useForm<CostCenterFormData>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: {
      costCenterCode: "",
      costCenterName: "",
      description: "",
      managerName: "",
      budget: "",
      level: 1,
      active: true,
    },
  });

  const filteredCostCenters = costCenters.filter((costCenter: CostCenter) =>
    costCenter.costCenterCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    costCenter.costCenterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (costCenter.description && costCenter.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createMutation = useMutation({
    mutationFn: (data: CostCenterFormData) =>
      apiRequest("/api/financial/cost-centers", {
        method: "POST",
        body: JSON.stringify({ ...data, companyId: 1 }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/cost-centers"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({ title: "Sucesso", description: "Centro de custo criado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao criar centro de custo", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CostCenterFormData & { id: number }) =>
      apiRequest(`/api/financial/cost-centers/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/cost-centers"] });
      setIsEditDialogOpen(false);
      setSelectedCostCenter(null);
      form.reset();
      toast({ title: "Sucesso", description: "Centro de custo atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao atualizar centro de custo", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/financial/cost-centers/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/cost-centers"] });
      toast({ title: "Sucesso", description: "Centro de custo excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao excluir centro de custo", variant: "destructive" });
    },
  });

  const handleCreateCostCenter = (data: CostCenterFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateCostCenter = (data: CostCenterFormData) => {
    if (!selectedCostCenter) return;
    updateMutation.mutate({ ...data, id: selectedCostCenter.id });
  };

  const handleEditCostCenter = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    form.reset({
      costCenterCode: costCenter.costCenterCode,
      costCenterName: costCenter.costCenterName,
      description: costCenter.description || "",
      managerName: costCenter.managerName || "",
      budget: costCenter.budget?.toString() || "",
      level: costCenter.level,
      active: costCenter.active,
    });
    setIsEditDialogOpen(true);
  };

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, isEdit: boolean = false) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações do centro de custo" : "Preencha os dados do novo centro de custo"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? handleUpdateCostCenter : handleCreateCostCenter)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costCenterCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código *</FormLabel>
                    <FormControl>
                      <Input placeholder="CC001" className="neu-input" {...field} />
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
              name="costCenterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Centro de Custo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do centro de custo" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" className="neu-input" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Descrição do centro de custo" className="neu-input" rows={3} {...field} />
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
                  Centros de Custo
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie centros de custo para controle de custos e orçamentos
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredCostCenters.length} centros
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
              Novo Centro
            </Button>
          </div>

          {/* Cost Centers Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Centros de Custo</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredCostCenters.length} encontrados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Carregando centros de custo...
                        </TableCell>
                      </TableRow>
                    ) : filteredCostCenters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-gray-500">Nenhum centro de custo encontrado</p>
                          <p className="text-sm text-gray-400 mt-2">Crie o primeiro centro para começar o controle de custos.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCostCenters.map((costCenter: CostCenter) => (
                        <TableRow key={costCenter.id} className="border-gray-200">
                          <TableCell className="font-medium">{costCenter.costCenterCode}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{costCenter.costCenterName}</div>
                              {costCenter.description && (
                                <div className="text-sm text-gray-500">{costCenter.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{costCenter.managerName || "—"}</TableCell>
                          <TableCell>
                            {costCenter.budget ? `R$ ${costCenter.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="neu-flat">
                              Nível {costCenter.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={costCenter.active ? "default" : "destructive"} className="neu-flat">
                              {costCenter.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCostCenter(costCenter)}
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
                                      Tem certeza que deseja excluir este centro de custo? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(costCenter.id)}
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
          {renderFormDialog(isCreateDialogOpen, setIsCreateDialogOpen, "Criar Centro de Custo")}

          {/* Edit Dialog */}
          {renderFormDialog(isEditDialogOpen, setIsEditDialogOpen, "Editar Centro de Custo", true)}
        </main>
      </div>
    </div>
  );
}