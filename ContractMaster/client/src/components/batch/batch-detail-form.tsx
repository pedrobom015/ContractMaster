import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Hash, Save } from "lucide-react";
import type { BatchDetail } from "@shared/schema";

const batchDetailSchema = z.object({
  batchNumber: z.string().min(1, "Número do lote é obrigatório"),
  contractId: z.number().optional(),
  status: z.string().default("pending"),
});

type BatchDetailFormData = z.infer<typeof batchDetailSchema>;

interface BatchDetailFormProps {
  batchId?: number;
  batchNumber: string;
}

export default function BatchDetailForm({ batchId, batchNumber }: BatchDetailFormProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BatchDetail | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BatchDetailFormData>({
    resolver: zodResolver(batchDetailSchema),
    defaultValues: {
      batchNumber: batchNumber,
      contractId: undefined,
      status: "pending",
    },
  });

  // Fetch batch details
  const { data: batchDetails = [], isLoading } = useQuery<BatchDetail[]>({
    queryKey: ['/api/batch-details'],
    enabled: !!batchNumber,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: BatchDetailFormData) =>
      apiRequest('/api/batch-details', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-details'] });
      setIsCreateDialogOpen(false);
      form.reset({ batchNumber, contractId: undefined, status: "pending" });
      toast({
        title: "Sucesso",
        description: "Detalhe do lote criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar detalhe do lote.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BatchDetailFormData }) =>
      apiRequest(`/api/batch-details/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-details'] });
      setIsEditDialogOpen(false);
      form.reset({ batchNumber, contractId: undefined, status: "pending" });
      toast({
        title: "Sucesso",
        description: "Detalhe do lote atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar detalhe do lote.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/batch-details/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-details'] });
      toast({
        title: "Sucesso",
        description: "Detalhe do lote excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir detalhe do lote.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    form.reset({ batchNumber, contractId: undefined, status: "pending" });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (detail: BatchDetail) => {
    setSelectedDetail(detail);
    form.reset({
      batchNumber: detail.batchNumber,
      contractId: detail.contractId || undefined,
      status: detail.status || "pending",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (data: BatchDetailFormData) => {
    if (selectedDetail) {
      updateMutation.mutate({ id: selectedDetail.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter details for this batch
  const filteredDetails = batchDetails.filter(detail => detail.batchNumber === batchNumber);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Detalhes do Lote</h3>
          <p className="text-sm text-muted-foreground">Gerencie os detalhes do lote {batchNumber}</p>
        </div>
        <div className="neu-button rounded-xl px-4 py-2 cursor-pointer hover:shadow-lg transition-all" onClick={handleCreate}>
          <div className="flex items-center">
            <div className="neu-pressed rounded-lg w-6 h-6 flex items-center justify-center mr-2">
              <Plus className="w-3 h-3 text-secondary" />
            </div>
            <span className="text-secondary font-medium text-sm">Novo Detalhe</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="neu-flat rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2 text-sm">Carregando detalhes...</p>
          </div>
        ) : filteredDetails.length === 0 ? (
          <div className="text-center py-8">
            <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="text-sm font-medium text-foreground mb-1">Nenhum detalhe encontrado</h4>
            <p className="text-xs text-muted-foreground">Adicione um novo detalhe para este lote.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="font-semibold text-muted-foreground text-xs">ID</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-xs">Contrato</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-xs">Status</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetails.map((detail) => (
                <TableRow key={detail.id} className="border-border/40 hover:bg-muted/20">
                  <TableCell className="text-sm">{detail.id}</TableCell>
                  <TableCell className="text-sm">{detail.contractId || "-"}</TableCell>
                  <TableCell className="text-sm">{detail.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(detail)}
                        className="neu-button rounded-lg w-6 h-6 p-0"
                      >
                        <Edit className="w-3 h-3 text-primary" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="neu-button rounded-lg w-6 h-6 p-0"
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este detalhe? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button rounded-xl">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(detail.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedDetail(null);
        }
      }}>
        <DialogContent className="neu-card rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="neu-pressed rounded-lg w-6 h-6 flex items-center justify-center mr-2">
                {selectedDetail ? <Edit className="w-3 h-3 text-primary" /> : <Plus className="w-3 h-3 text-primary" />}
              </div>
              {selectedDetail ? "Editar Detalhe" : "Novo Detalhe"}
            </DialogTitle>
            <DialogDescription>
              {selectedDetail 
                ? "Atualize as informações do detalhe do lote." 
                : "Adicione um novo detalhe ao lote."
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Número do Lote *</FormLabel>
                    <FormControl>
                      <div className="neu-input rounded-xl">
                        <Input {...field} disabled className="text-sm" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">ID do Contrato</FormLabel>
                    <FormControl>
                      <div className="neu-input rounded-xl">
                        <Input 
                          type="number" 
                          placeholder="ID do contrato"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="text-sm"
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
                    <FormLabel className="text-sm">Status</FormLabel>
                    <FormControl>
                      <div className="neu-input rounded-xl">
                        <Input placeholder="pending" {...field} className="text-sm" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setSelectedDetail(null);
                  }}
                  className="neu-button rounded-xl text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="neu-button rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                >
                  <Save className="w-3 h-3 mr-2" />
                  {createMutation.isPending || updateMutation.isPending 
                    ? (selectedDetail ? "Atualizando..." : "Criando...") 
                    : (selectedDetail ? "Atualizar" : "Criar")
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}