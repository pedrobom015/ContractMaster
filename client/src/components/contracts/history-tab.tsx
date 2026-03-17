// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Clock, User } from "lucide-react";
import type { ContractHistory } from "@shared/schema";

interface HistoryTabProps {
  contractId: number;
}

interface HistoryWithUser extends ContractHistory {
  user?: {
    id: number;
    name: string;
  };
}

export default function HistoryTab({ contractId }: HistoryTabProps) {
  const { data: history, isLoading } = useQuery<HistoryWithUser[]>({
    queryKey: [`/api/contracts/${contractId}/history`],
  });

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Criado';
      case 'updated':
        return 'Atualizado';
      case 'suspended':
        return 'Suspenso';
      case 'cancelled':
        return 'Cancelado';
      case 'reactivated':
        return 'Reativado';
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'updated':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'reactivated':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Histórico do Contrato
      </h3>

      {history && history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Badge className={getActionColor(item.action)}>
                    {getActionLabel(item.action)}
                  </Badge>
                  <span className="font-medium text-foreground">
                    {item.description}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(item.createdAt)}
                </div>
              </div>
              
              {item.user && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-1" />
                  <span>Por: {item.user.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhum histórico encontrado para este contrato.
          </p>
        </div>
      )}
    </div>
  );
}
