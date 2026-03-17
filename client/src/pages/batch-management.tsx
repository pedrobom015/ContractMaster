// @ts-nocheck
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Edit, Trash2, Search, Calculator, Calendar, Hash, Save, Building, Home, List, FileText
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import BatchDetailForm from "@/components/batch/batch-detail-form";
import BatchChkForm from "@/components/batch/batch-chk-form";
import type { BatchChk } from "@shared/schema";

// Schema for form validation
const batchChkSchema = z.object({
  batchNumber: z.string().min(1, "Número do lote é obrigatório").max(50),
  processDate: z.string().optional(),
  status: z.string().default("pending"),
  totalAmount: z.string().optional(),
  recordCount: z.number().optional(),
});

type BatchChkFormData = z.infer<typeof batchChkSchema>;

export default function BatchManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchChk | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BatchChkFormData>({
    resolver: zodResolver(batchChkSchema),
    defaultValues: {
      batchNumber: "",
      processDate: "",
      status: "pending",
      totalAmount: "",
      recordCount: undefined,
    },
  });

  // Fetch batch checks - Fixed API endpoint
  const { data: batchChecks = [], isLoading } = useQuery<BatchChk[]>({
    queryKey: ['/api/batch-chks'],
  });

  // Create batch check mutation - Fixed API endpoint
  const createMutation = useMutation({
    mutationFn: (data: BatchChkFormData) =>
      apiRequest('/api/batch-chks', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-chks'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Lote de cobrança criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar lote de cobrança.",
        variant: "destructive",
      });
    },
  });

  // Update batch check mutation - Fixed API endpoint
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BatchChkFormData }) =>
      apiRequest(`/api/batch-chks/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-chks'] });
      setIsEditDialogOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Lote de cobrança atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar lote de cobrança.",
        variant: "destructive",
      });
    },
  });

  // Delete batch check mutation - Fixed API endpoint
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/batch-chks/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-chks'] });
      toast({
        title: "Sucesso",
        description: "Lote de cobrança excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir lote de cobrança.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (batch: BatchChk) => {
    setSelectedBatch(batch);
    form.reset({
      batchNumber: batch.batchChkId.toString(),
      processDate: batch.dtBatch ? new Date(batch.dtBatch).toISOString().split('T')[0] : "",
      status: 'processed' || "pending",
      totalAmount: batch.valBatch ? batch.valBatch.toString() : "",
      recordCount: batch.amountBatch || undefined,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (data: BatchChkFormData) => {
    if (selectedBatch) {
      updateMutation.mutate({ id: selectedBatch.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter batch checks based on search
  const filteredBatchChecks = batchChecks.filter((batch) =>
    batch.batchChkId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    ('processed' && 'processed'.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Concluído</Badge>;
      case "processing":
        return <Badge variant="secondary">Processando</Badge>;
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="flex h-screen neu-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Lançamentos de Cobrança</h1>
                  <p className="text-muted-foreground">Gerencie os lotes de cobrança e lançamentos financeiros</p>
                </div>
                <div className="neu-button rounded-2xl p-3 cursor-pointer hover:shadow-lg transition-all" onClick={handleCreate}>
                  <div className="flex items-center">
                    <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-2">
                      <Plus className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-secondary font-medium">Novo Lote</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="neu-flat rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <div className="neu-input rounded-xl flex items-center px-4 py-2">
                      <Search className="w-5 h-5 text-muted-foreground mr-3" />
                      <Input
                        placeholder="Buscar por número do lote ou status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                  <div className="neu-button rounded-xl px-6 py-3 cursor-pointer">
                    <span className="text-primary font-medium">Filtros</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="neu-card rounded-3xl p-6">
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Carregando lotes de cobrança...</p>
                  </div>
                ) : filteredBatchChecks.length === 0 ? (
                  <div className="text-center py-8">
                    <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum lote encontrado</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Nenhum lote corresponde aos critérios de busca." : "Comece criando um novo lote de cobrança."}
                    </p>
                  </div>
                ) : (
                  <div className="neu-flat rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/40">
                          <TableHead className="font-semibold text-muted-foreground">ID</TableHead>
                          <TableHead className="font-semibold text-muted-foreground">Número do Lote</TableHead>
                          <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                          <TableHead className="font-semibold text-muted-foreground">Data de Criação</TableHead>
                          <TableHead className="font-semibold text-muted-foreground text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBatchChecks.map((batch) => (
                          <TableRow key={batch.batchChkId} className="border-border/40 hover:bg-muted/20">
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                                  <Hash className="w-4 h-4 text-primary" />
                                </div>
                                {batch.batchChkId}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{batch.batchChkId.toString()}</span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge('processed')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(batch.createdAt?.toString() || null)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(batch)}
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
                                        Tem certeza que deseja excluir o lote "{batch.batchChkId.toString()}"? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="neu-button rounded-xl">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(batch.batchChkId)}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create/Edit Dialog with Tabs */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedBatch(null);
        }
      }}>
        <DialogContent className="neu-card rounded-2xl max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                {selectedBatch ? <Edit className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
              </div>
              {selectedBatch ? "Editar Lote de Cobrança" : "Novo Lote de Cobrança"}
            </DialogTitle>
            <DialogDescription>
              {selectedBatch 
                ? "Atualize as informações do lote de cobrança e gerencie seus detalhes." 
                : "Crie um novo lote de cobrança e gerencie seus detalhes."
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="batch-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 neu-flat rounded-xl">
              <TabsTrigger value="batch-info" className="flex items-center neu-button rounded-lg">
                <FileText className="w-4 h-4 mr-2" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="batch-details" className="flex items-center neu-button rounded-lg">
                <List className="w-4 h-4 mr-2" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="batch-totals" className="flex items-center neu-button rounded-lg">
                <Calculator className="w-4 h-4 mr-2" />
                Totais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="batch-info" className="space-y-6 mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="batchNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número do Lote *</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="Ex: LT-2025-001" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="processDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Processamento</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="date" 
                                placeholder="Data de processamento"
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
                      name="totalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Total</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                placeholder="0.00" 
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
                      name="recordCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade de Registros</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input 
                                type="number" 
                                placeholder="0" 
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <div className="neu-input rounded-xl">
                              <Input placeholder="pending" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setIsEditDialogOpen(false);
                        setSelectedBatch(null);
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
                        ? (selectedBatch ? "Atualizando..." : "Criando...") 
                        : (selectedBatch ? "Atualizar Lote" : "Criar Lote")
                      }
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="batch-details" className="space-y-6 mt-6">
              {selectedBatch ? (
                <BatchDetailForm 
                  batchId={selectedBatch.id} 
                  batchNumber={selectedBatch.batchNumber} 
                />
              ) : (
                <div className="text-center py-8">
                  <List className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Salve o lote primeiro</h3>
                  <p className="text-muted-foreground">
                    Para gerenciar os detalhes, você precisa primeiro salvar as informações básicas do lote.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="batch-totals" className="space-y-6 mt-6">
              <BatchChkForm batch={selectedBatch} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}