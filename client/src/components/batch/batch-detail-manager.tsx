import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Receipt, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BatchChk, BatchDetail } from "@shared/schema";
import { BatchDetailForm } from "./batch-detail-form";

interface BatchDetailManagerProps {
  batchId: number;
  showCreateButton?: boolean;
}

export function BatchDetailManager({ batchId, showCreateButton = false }: BatchDetailManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<BatchDetail | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: batchCheck } = useQuery({
    queryKey: ['/api/batch-checks', batchId],
  });

  const { data: batchDetails = [], isLoading } = useQuery({
    queryKey: ['/api/batch-checks', batchId, 'details'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/batch-details/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/batch-checks', batchId, 'details'] });
      toast({ title: "Detalhe excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir detalhe", variant: "destructive" });
    }
  });

  const handleEdit = (detail: BatchDetail) => {
    setEditingDetail(detail);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este detalhe?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'P': { label: 'Pendente', variant: 'secondary' as const },
      'R': { label: 'Processado', variant: 'default' as const },
      'E': { label: 'Erro', variant: 'destructive' as const },
      'C': { label: 'Cancelado', variant: 'outline' as const },
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateTotals = () => {
    return batchDetails.reduce((acc: any, detail: BatchDetail) => {
      acc.totalAmount += parseFloat(detail.amountReceived);
      acc.count += 1;
      return acc;
    }, { totalAmount: 0, count: 0 });
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <Card className="neu-card rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Detalhes das Cobranças</h3>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neu-button neu-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Cobrança ao Acerto</DialogTitle>
              </DialogHeader>
              <BatchDetailForm 
                batchChkId={batchId}
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['/api/batch-checks', batchId, 'details'] });
                  toast({ title: "Cobrança adicionada com sucesso" });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <Card className="neu-card rounded-2xl">
        <CardContent className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Itens</p>
                <p className="text-2xl font-bold">{totals.count}</p>
              </div>
            </div>
          </div>
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <Receipt className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.totalAmount.toString())}
                </p>
              </div>
            </div>
          </div>
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <Badge className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  {formatCurrency((totals.totalAmount / (totals.count || 1)).toString())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Seq.</TableHead>
                <TableHead>Número de Cobrança</TableHead>
                <TableHead>Número Completo</TableHead>
                <TableHead>Valor Recebido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum detalhe encontrado</p>
                    <p className="text-sm">Adicione detalhes ao lote para começar</p>
                  </TableCell>
                </TableRow>
              ) : (
                batchDetails.map((detail: BatchDetail) => (
                  <TableRow key={detail.batchDetailId} className="hover:bg-muted/50">
                    <TableCell className="font-mono">{detail.seqNumber}</TableCell>
                    <TableCell>{detail.billingNumber || "-"}</TableCell>
                    <TableCell className="font-mono">{detail.billingNumber}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(detail.amountReceived)}
                    </TableCell>
                    <TableCell>{getStatusBadge(detail.processStatus)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(detail)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(detail.batchDetailId)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setEditingDetail(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Detalhe do Lote</DialogTitle>
          </DialogHeader>
          {editingDetail && (
            <BatchDetailForm 
              batchChkId={batchId}
              initialData={editingDetail}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setEditingDetail(null);
                queryClient.invalidateQueries({ queryKey: ['/api/batch-checks', batchId, 'details'] });
                toast({ title: "Detalhe atualizado com sucesso" });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}