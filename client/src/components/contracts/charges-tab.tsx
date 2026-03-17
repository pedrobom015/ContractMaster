// @ts-nocheck
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, DollarSign, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import type { ContractCharge } from "@shared/schema";

interface ChargesTabProps {
  contractId: number;
}

// Contract Charge Schema
const contractChargeSchema = z.object({
  contractId: z.number(),
  sysUnitId: z.number().optional(),
  paymentStatusId: z.number().optional(),
  chargeCode: z.string().min(1, "Código da cobrança é obrigatório"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  paymentDate: z.string().optional(),
  amountPaid: z.number().optional(),
  convenio: z.string().optional(),
  dueMonth: z.string().optional(),
  dueYear: z.string().optional(),
  paidMonth: z.string().optional(),
  paidYear: z.string().optional(),
});

type ContractChargeFormData = z.infer<typeof contractChargeSchema>;

export default function ChargesTab({ contractId }: ChargesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<ContractCharge | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContractChargeFormData>({
    resolver: zodResolver(contractChargeSchema),
    defaultValues: {
      contractId,
      sysUnitId: 1,
      paymentStatusId: 1,
      chargeCode: "",
      dueDate: "",
      amount: 0,
      paymentDate: "",
      amountPaid: 0,
      convenio: "",
    },
  });

  // Fetch contract charges
  const { data: charges = [], isLoading } = useQuery({
    queryKey: ["/api/contracts", contractId, "charges"],
    queryFn: () => apiRequest(`/api/contracts/${contractId}/charges`),
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: ContractChargeFormData) => {
      if (editingCharge) {
        return apiRequest(`/api/contract-charges/${editingCharge.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest("/api/contract-charges", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", contractId, "charges"] });
      setIsDialogOpen(false);
      setEditingCharge(null);
      form.reset();
      toast({
        title: "Sucesso",
        description: editingCharge ? "Cobrança atualizada com sucesso!" : "Cobrança criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar cobrança. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/contract-charges/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts", contractId, "charges"] });
      toast({
        title: "Sucesso",
        description: "Cobrança excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir cobrança. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    setEditingCharge(null);
    form.reset({
      contractId,
      sysUnitId: 1,
      paymentStatusId: 1,
      chargeCode: "",
      dueDate: "",
      amount: 0,
      paymentDate: "",
      amountPaid: 0,
      convenio: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (charge: ContractCharge) => {
    setEditingCharge(charge);
    form.reset({
      contractId: charge.contractId,
      sysUnitId: charge.sysUnitId || 1,
      paymentStatusId: charge.paymentStatusId || 1,
      chargeCode: charge.chargeCode,
      dueDate: charge.dueDate ? new Date(charge.dueDate).toISOString().split('T')[0] : "",
      amount: parseFloat(charge.amount || "0"),
      paymentDate: charge.paymentDate ? new Date(charge.paymentDate).toISOString().split('T')[0] : "",
      amountPaid: parseFloat(charge.amountPaid || "0"),
      convenio: charge.convenio || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const onSubmit = (data: ContractChargeFormData) => {
    // Auto-generate month/year fields from dates
    const dueDate = new Date(data.dueDate);
    const paymentDate = data.paymentDate ? new Date(data.paymentDate) : null;
    
    const submitData = {
      ...data,
      dueMonth: String(dueDate.getMonth() + 1).padStart(2, '0'),
      dueYear: String(dueDate.getFullYear()),
      paidMonth: paymentDate ? String(paymentDate.getMonth() + 1).padStart(2, '0') : undefined,
      paidYear: paymentDate ? String(paymentDate.getFullYear()) : undefined,
    };

    mutation.mutate(submitData);
  };

  const getPaymentStatusBadge = (charge: ContractCharge) => {
    if (charge.paymentDate && charge.amountPaid) {
      const paid = parseFloat(charge.amountPaid);
      const total = parseFloat(charge.amount);
      if (paid >= total) {
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Pago</Badge>;
      } else {
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Parcial</Badge>;
      }
    }
    
    const dueDate = new Date(charge.dueDate);
    const today = new Date();
    if (dueDate < today) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Vencido</Badge>;
    }
    
    return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando cobranças...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Cobranças do Contrato</h3>
        </div>
        <Button onClick={handleCreate} className="neu-button neu-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Cobrança
        </Button>
      </div>

      <div className="neu-card rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Código</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Valor Pago</TableHead>
              <TableHead>Convênio</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhuma cobrança encontrada. Clique em "Nova Cobrança" para adicionar a primeira.
                </TableCell>
              </TableRow>
            ) : (
              charges.map((charge: ContractCharge) => (
                <TableRow key={charge.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{charge.chargeCode}</TableCell>
                  <TableCell>{formatDate(charge.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(charge.amount)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(charge)}</TableCell>
                  <TableCell>
                    {charge.paymentDate ? formatDate(charge.paymentDate) : "-"}
                  </TableCell>
                  <TableCell>
                    {charge.amountPaid ? formatCurrency(charge.amountPaid) : "-"}
                  </TableCell>
                  <TableCell>{charge.convenio || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="neu-button neu-button-secondary"
                        onClick={() => handleEdit(charge)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neu-button neu-button-danger">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neu-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a cobrança "{charge.chargeCode}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(charge.id)} 
                              className="neu-button neu-button-danger"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl neu-card">
          <DialogHeader>
            <DialogTitle>
              {editingCharge ? "Editar Cobrança" : "Nova Cobrança"}
            </DialogTitle>
            <DialogDescription>
              {editingCharge ? "Edite os dados da cobrança" : "Adicione uma nova cobrança ao contrato"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="chargeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código da Cobrança *</FormLabel>
                      <FormControl>
                        <div className="neu-input rounded-xl">
                          <Input placeholder="Ex: CB-2025-001" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <div className="neu-input rounded-xl">
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Vencimento *</FormLabel>
                      <FormControl>
                        <div className="neu-input rounded-xl">
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Pagamento</FormLabel>
                      <FormControl>
                        <div className="neu-input rounded-xl">
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Pago</FormLabel>
                      <FormControl>
                        <div className="neu-input rounded-xl">
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convenio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Convênio Bancário</FormLabel>
                      <FormControl>
                        <div className="neu-input rounded-xl">
                          <Input placeholder="Ex: 001234" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="neu-button neu-button-secondary"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="neu-button neu-button-primary"
                >
                  {mutation.isPending ? "Salvando..." : editingCharge ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}