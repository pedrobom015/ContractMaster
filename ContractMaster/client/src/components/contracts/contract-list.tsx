import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { ContractWithDetails } from "@shared/schema";

interface ContractListProps {
  selectedContractId: number | null;
  onSelectContract: (id: number) => void;
}

export default function ContractList({ selectedContractId, onSelectContract }: ContractListProps) {
  const { data: contracts, isLoading } = useQuery<ContractWithDetails[]>({
    queryKey: ["/api/contracts"],
  });

  if (isLoading) {
    return (
      <div className="neu-card rounded-3xl p-6">
        <div className="neu-pressed rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-foreground">Lista de Contratos</h3>
          <p className="text-sm text-muted-foreground mt-1">Carregando...</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="neu-flat rounded-2xl p-4">
              <div className="skeleton h-4 w-24 mb-2 rounded-xl" />
              <div className="skeleton h-4 w-32 mb-1 rounded-xl" />
              <div className="skeleton h-3 w-28 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="neu-card rounded-3xl p-6">
      <div className="neu-pressed rounded-2xl p-4 mb-6">
        <h3 className="font-semibold text-foreground">Lista de Contratos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Encontrados {contracts?.length || 0} contratos
        </p>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {contracts?.map((contract) => (
          <div
            key={contract.id}
            className={cn(
              "neu-flat rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg",
              selectedContractId === contract.id && "contract-item active"
            )}
            onClick={() => onSelectContract(contract.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="neu-button rounded-xl px-3 py-1">
                <span className="font-medium text-foreground text-sm">
                  {contract.contractNumber}
                </span>
              </div>
              <div className={cn("rounded-xl px-3 py-1", contract.currentStatus ? getStatusColor(contract.currentStatus) : "bg-gray-100")}>
                <span className="text-xs font-medium">{contract.currentStatus ? getStatusLabel(contract.currentStatus) : "N/A"}</span>
              </div>
            </div>
            
            <div className="neu-pressed rounded-xl p-3 mb-3">
              <p className="text-sm text-foreground font-medium">
                {contract.contractName}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="neu-flat rounded-lg px-3 py-1">
                <p className="text-xs text-muted-foreground">
                  {contract.contractType}
                </p>
              </div>
              <div className="neu-flat rounded-lg px-3 py-1">
                <p className="text-xs text-primary font-medium">
                  {contract.industry}
                </p>
              </div>
            </div>
            
            <div className="neu-flat rounded-lg px-3 py-1 mt-2">
              <p className="text-xs text-muted-foreground text-center">
                Início: {contract.startDate ? formatDate(contract.startDate) : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
