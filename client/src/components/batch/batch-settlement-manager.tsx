import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Receipt, Calculator, HandCoins, DollarSign, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BatchChk, BatchDetail } from "@shared/schema";
import { BatchChkForm } from "./batch-chk-form";
import { BatchDetailManager } from "./batch-detail-manager";

interface BatchSettlementManagerProps {
  batchId: number;
}

export function BatchSettlementManager({ batchId }: BatchSettlementManagerProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: batchCheck } = useQuery({
    queryKey: ['/api/batch-checks', batchId],
  });

  const { data: batchDetails = [] } = useQuery({
    queryKey: ['/api/batch-checks', batchId, 'details'],
  });

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPercent = (value: string) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  const calculateSummary = () => {
    if (!batchCheck) return { totalItems: 0, totalValue: 0, commission: 0 };
    
    const totalItems = batchDetails.length;
    const totalValue = batchDetails.reduce((acc: number, detail: BatchDetail) => 
      acc + parseFloat(detail.amountReceived), 0);
    
    const commission = parseFloat(batchCheck.paymentValue);
    
    return { totalItems, totalValue, commission };
  };

  const summary = calculateSummary();

  if (!batchCheck) {
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
    <Card className="neu-card rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HandCoins className="w-5 h-5" />
              Acerto #{batchCheck.batchNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {batchCheck.detail}
            </p>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="neu-button">
                <Edit className="w-4 h-4 mr-2" />
                Editar Acerto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Acerto #{batchCheck.batchNumber}</DialogTitle>
              </DialogHeader>
              <BatchChkForm 
                initialData={batchCheck}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['/api/batch-checks', batchId] });
                  toast({ title: "Acerto atualizado com sucesso" });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recebimentos</p>
                <p className="text-2xl font-bold">{summary.totalItems}</p>
              </div>
            </div>
          </div>
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(summary.totalValue.toString())}
                </p>
              </div>
            </div>
          </div>
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <Calculator className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comissão</p>
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(batchCheck.paymentValue)}
                </p>
              </div>
            </div>
          </div>
          <div className="neu-flat rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="neu-button rounded-lg p-3">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Liquidação</p>
                <p className="text-lg font-bold">{formatDate(batchCheck.dischargeDate)}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Detalhes das Cobranças
            </TabsTrigger>
            <TabsTrigger value="settlement" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Dados do Acerto
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Comissões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <BatchDetailManager batchId={batchId} showCreateButton={true} />
          </TabsContent>

          <TabsContent value="settlement" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número do Lote:</span>
                    <span className="font-medium">{batchCheck.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Liquidação:</span>
                    <span className="font-medium">{formatDate(batchCheck.dischargeDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Despesas:</span>
                    <span className="font-medium">{formatCurrency(batchCheck.expenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número do Caixa:</span>
                    <span className="font-medium">{batchCheck.cashierNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registro Comissão:</span>
                    <span className="font-medium">{batchCheck.nrcctopay}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Resumo de Valores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxas ({formatPercent(batchCheck.qtdBill)}):</span>
                      <span className="font-medium">{formatCurrency(batchCheck.vlBill)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vendas ({formatPercent(batchCheck.qtdSel)}):</span>
                      <span className="font-medium">{formatCurrency(batchCheck.vlSel)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trocas ({formatPercent(batchCheck.qtdSwap)}):</span>
                      <span className="font-medium">{formatCurrency(batchCheck.vlSwap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outros ({formatPercent(batchCheck.qtdOther)}):</span>
                      <span className="font-medium">{formatCurrency(batchCheck.vlOther)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total a Pagar:</span>
                      <span className="text-green-600">{formatCurrency(batchCheck.paymentValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commission" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Percentuais de Comissão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sobre Taxas:</span>
                    <Badge variant="outline">{formatPercent(batchCheck.commissBill)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sobre Vendas:</span>
                    <Badge variant="outline">{formatPercent(batchCheck.commissSel)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sobre Trocas:</span>
                    <Badge variant="outline">{formatPercent(batchCheck.commissSwap)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sobre Outros:</span>
                    <Badge variant="outline">{formatPercent(batchCheck.commissOther)}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cálculo das Comissões</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Taxas: {formatCurrency(batchCheck.vlBill)} × {formatPercent(batchCheck.commissBill)}</span>
                      <span className="font-medium">
                        {formatCurrency((parseFloat(batchCheck.vlBill) * parseFloat(batchCheck.commissBill) / 100).toString())}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vendas: {formatCurrency(batchCheck.vlSel)} × {formatPercent(batchCheck.commissSel)}</span>
                      <span className="font-medium">
                        {formatCurrency((parseFloat(batchCheck.vlSel) * parseFloat(batchCheck.commissSel) / 100).toString())}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trocas: {formatCurrency(batchCheck.vlSwap)} × {formatPercent(batchCheck.commissSwap)}</span>
                      <span className="font-medium">
                        {formatCurrency((parseFloat(batchCheck.vlSwap) * parseFloat(batchCheck.commissSwap) / 100).toString())}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Outros: {formatCurrency(batchCheck.vlOther)} × {formatPercent(batchCheck.commissOther)}</span>
                      <span className="font-medium">
                        {formatCurrency((parseFloat(batchCheck.vlOther) * parseFloat(batchCheck.commissOther) / 100).toString())}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total de Comissões:</span>
                      <span className="text-green-600">{formatCurrency(batchCheck.paymentValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}