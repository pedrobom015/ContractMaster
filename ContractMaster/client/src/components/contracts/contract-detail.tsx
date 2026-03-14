import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Printer } from "lucide-react";
import ContractForm from "./contract-form";
import BeneficiariesTab from "./beneficiaries-tab";
import ChargesTab from "./charges-tab";
import AddendumsTab from "./addendums-tab";
import HistoryTab from "./history-tab";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { ContractWithDetails } from "@shared/schema";

interface ContractDetailProps {
  contractId: number;
}

export default function ContractDetail({ contractId }: ContractDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { data: contract, isLoading } = useQuery<ContractWithDetails>({
    queryKey: [`/api/contracts/${contractId}`],
  });

  const { data: beneficiaries } = useQuery<any[]>({
    queryKey: [`/api/contracts/${contractId}/beneficiaries`],
  });

  const { data: charges } = useQuery<any[]>({
    queryKey: [`/api/contracts/${contractId}/charges`],
  });

  const { data: addendums } = useQuery<any[]>({
    queryKey: [`/api/contracts/${contractId}/addendums`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contract) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Contrato não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {contract.contractNumber}
            </h3>
            <p className="text-muted-foreground mt-1">
              {contract.contractName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={contract.currentStatus ? getStatusColor(contract.currentStatus) : "bg-gray-100"}>
              {contract.currentStatus ? getStatusLabel(contract.currentStatus) : "N/A"}
            </Badge>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Detalhes do Contrato</TabsTrigger>
            <TabsTrigger value="beneficiaries">
              Beneficiários ({beneficiaries?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="charges">
              Cobranças ({charges?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="addendums">
              Aditivos ({addendums?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            {isEditing ? (
              <ContractForm 
                contract={contract as any} 
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
            ) : (
              <div className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-4">
                      Informações Básicas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Número:</span>
                        <span className="font-medium">{contract.contractNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={contract.currentStatus ? getStatusColor(contract.currentStatus) : "bg-gray-100"}>
                          {contract.currentStatus ? getStatusLabel(contract.currentStatus) : "N/A"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data de Início:</span>
                        <span className="font-medium">
                          {contract.startDate ? formatDate(contract.startDate) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data de Fim:</span>
                        <span className="font-medium">
                          {contract.endDate ? formatDate(contract.endDate) : 'Indeterminado'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo de Contrato:</span>
                        <span className="font-medium text-primary">
                          {contract.contractType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Indústria:</span>
                        <span className="font-medium">
                          {contract.industry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequência de Cobrança:</span>
                        <span className="font-medium">
                          {contract.billingFrequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-4">
                      Informações de Cobrança
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mês Inicial:</span>
                        <span className="font-medium">{contract.monthInitialBilling}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ano Inicial:</span>
                        <span className="font-medium">{contract.yearInitialBilling}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dia de Pagamento:</span>
                        <span className="font-medium">{contract.optPayday || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequência Padrão:</span>
                        <span className="font-medium">{contract.defaultPlanFrequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parcelamento Padrão:</span>
                        <span className="font-medium">{contract.defaultPlanInstallments || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contract Stats */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-4">
                      Estatísticas do Contrato
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vivos:</span>
                        <span className="font-medium">{contract.alives || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Falecidos:</span>
                        <span className="font-medium">{contract.deceaseds || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dependentes:</span>
                        <span className="font-medium">{contract.dependents || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cobranças Pagas:</span>
                        <span className="font-medium">{contract.chargesPaid || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contract Status */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-4">
                      Status do Contrato
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última Atualização:</span>
                        <span className="font-medium">
                          {contract.updatedAt ? formatDate(contract.updatedAt) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beneficiários Ativos:</span>
                        <span className="font-medium text-secondary">
                          {beneficiaries?.filter(b => b.status === 'active').length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de Cobranças:</span>
                        <span className="font-medium">
                          {charges?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium text-foreground mb-4">Ações Rápidas</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-primary hover:bg-primary/90">
                      Gerar Cobrança
                    </Button>
                    <Button className="bg-secondary hover:bg-secondary/90">
                      Adicionar Beneficiário
                    </Button>
                    <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                      Suspender
                    </Button>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/5">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="beneficiaries" className="mt-6">
            <BeneficiariesTab contractId={contractId} />
          </TabsContent>

          <TabsContent value="charges" className="mt-6">
            <ChargesTab contractId={contractId} />
          </TabsContent>

          <TabsContent value="addendums" className="mt-6">
            <AddendumsTab contractId={contractId} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryTab contractId={contractId} />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
