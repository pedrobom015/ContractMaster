import { Calculator, Calendar, Hash, DollarSign } from "lucide-react";
import type { BatchChk } from "@shared/schema";

interface BatchChkFormProps {
  batch: BatchChk | null;
}

export default function BatchChkForm({ batch }: BatchChkFormProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "R$ 0,00";
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Totais do Lote</h3>
        <p className="text-sm text-muted-foreground">Informações consolidadas do lote de cobrança (somente leitura)</p>
      </div>

      {/* Content */}
      <div className="neu-flat rounded-2xl p-6">
        {batch ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Number */}
            <div className="neu-input rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">Número do Lote</label>
              </div>
              <p className="text-lg font-semibold text-foreground ml-11">{batch.batchNumber}</p>
            </div>

            {/* Status */}
            <div className="neu-input rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <Calculator className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">Status</label>
              </div>
              <p className="text-lg font-semibold text-foreground ml-11 capitalize">{batch.status || "Pendente"}</p>
            </div>

            {/* Process Date */}
            <div className="neu-input rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">Data de Processamento</label>
              </div>
              <p className="text-lg font-semibold text-foreground ml-11">{formatDate(batch.processDate?.toString() || null)}</p>
            </div>

            {/* Total Amount */}
            <div className="neu-input rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">Valor Total</label>
              </div>
              <p className="text-lg font-semibold text-green-600 ml-11">{formatCurrency(batch.totalAmount)}</p>
            </div>

            {/* Record Count */}
            <div className="neu-input rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <Hash className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">Quantidade de Registros</label>
              </div>
              <p className="text-lg font-semibold text-foreground ml-11">{batch.recordCount || 0}</p>
            </div>

            {/* Created Date */}
            <div className="neu-input rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="neu-pressed rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <label className="text-sm font-medium text-foreground">Data de Criação</label>
              </div>
              <p className="text-lg font-semibold text-foreground ml-11">{formatDate(batch.createdAt?.toString() || null)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Nenhum lote selecionado</h4>
            <p className="text-muted-foreground">Selecione ou crie um lote para visualizar os totais.</p>
          </div>
        )}
      </div>
    </div>
  );
}