import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Beneficiary } from "@shared/schema";

interface BeneficiariesTabProps {
  contractId: number;
}

export default function BeneficiariesTab({ contractId }: BeneficiariesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: beneficiaries, isLoading } = useQuery<Beneficiary[]>({
    queryKey: [`/api/contracts/${contractId}/beneficiaries`],
  });

  const deleteMutation = useMutation({
    mutationFn: (beneficiaryId: number) =>
      apiRequest("DELETE", `/api/beneficiaries/${beneficiaryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/contracts/${contractId}/beneficiaries`] });
      toast({
        title: "Sucesso",
        description: "Beneficiário removido com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover beneficiário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (beneficiaryId: number) => {
    if (confirm("Tem certeza que deseja remover este beneficiário?")) {
      deleteMutation.mutate(beneficiaryId);
    }
  };

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case 'titular':
        return 'Titular';
      case 'spouse':
        return 'Cônjuge';
      case 'child':
        return 'Filho(a)';
      case 'dependent':
        return 'Dependente';
      default:
        return relationship;
    }
  };

  if (isLoading) {
    return <div>Carregando beneficiários...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Beneficiários do Contrato
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Beneficiário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Beneficiário</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Formulário de adição de beneficiário será implementado aqui
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {beneficiaries && beneficiaries.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Parentesco</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beneficiaries.map((beneficiary) => (
                <TableRow key={beneficiary.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium mr-3">
                        {beneficiary.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{beneficiary.name}</div>
                        {beneficiary.email && (
                          <div className="text-sm text-muted-foreground">
                            {beneficiary.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{beneficiary.cpf}</TableCell>
                  <TableCell>{formatDate(beneficiary.birthDate)}</TableCell>
                  <TableCell>
                    {getRelationshipLabel(beneficiary.relationship)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(beneficiary.status)}>
                      {getStatusLabel(beneficiary.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(beneficiary.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <UserPlus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhum beneficiário encontrado. Adicione o primeiro beneficiário.
          </p>
        </div>
      )}
    </div>
  );
}
