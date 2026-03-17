// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Addendum } from "@shared/schema";

interface AddendumsTabProps {
  contractId: number;
}

export default function AddendumsTab({ contractId }: AddendumsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: addendums, isLoading } = useQuery<Addendum[]>({
    queryKey: [`/api/contracts/${contractId}/addendums`],
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'value_change':
        return 'Alteração de Valor';
      case 'plan_change':
        return 'Mudança de Plano';
      case 'term_extension':
        return 'Extensão de Prazo';
      case 'suspension':
        return 'Suspensão';
      case 'cancellation':
        return 'Cancelamento';
      default:
        return type;
    }
  };

  if (isLoading) {
    return <div>Carregando aditivos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Aditivos do Contrato
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Aditivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Aditivo</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Formulário de criação de aditivo será implementado aqui
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addendums && addendums.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Anterior</TableHead>
                <TableHead>Novo Valor</TableHead>
                <TableHead>Data de Vigência</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addendums.map((addendum) => (
                <TableRow key={addendum.id}>
                  <TableCell className="font-medium">
                    {getTypeLabel(addendum.type)}
                  </TableCell>
                  <TableCell>{addendum.description}</TableCell>
                  <TableCell>
                    {addendum.oldValue ? formatCurrency(addendum.oldValue) : '-'}
                  </TableCell>
                  <TableCell>
                    {addendum.newValue ? formatCurrency(addendum.newValue) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(addendum.effectiveDate)}</TableCell>
                  <TableCell>{formatDate(addendum.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhum aditivo encontrado. Crie o primeiro aditivo.
          </p>
        </div>
      )}
    </div>
  );
}
