import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const chargeSchema = z.object({
  chargeName: z.string().min(1, "Nome da cobrança é obrigatório").max(100),
  description: z.string().optional(),
  amount: z.number().min(0, "Valor deve ser positivo"),
  chargeType: z.string().min(1, "Tipo de cobrança é obrigatório"),
  active: z.boolean(),
});

type ChargeFormData = z.infer<typeof chargeSchema>;

interface ContractCharge {
  id: number;
  chargeName: string;
  description?: string;
  amount: number;
  chargeType: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChargeManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<ContractCharge | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ChargeFormData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: {
      chargeName: "",
      description: "",
      amount: 0,
      chargeType: "",
      active: true,
    },
  });

  // Mock data for charge types
  const mockChargeTypes = [
    { id: "monthly", name: "Cobrança Mensal" },
    { id: "annual", name: "Cobrança Anual" },
    { id: "one_time", name: "Cobrança Única" },
    { id: "service", name: "Taxa de Serviço" }
  ];

  // Mock data for charges
  const mockCharges: ContractCharge[] = [
    {
      id: 1,
      chargeName: "Taxa de Administração",
      description: "Taxa administrativa mensal",
      amount: 15.50,
      chargeType: "monthly",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      chargeName: "Taxa de Adesão",
      description: "Taxa única de adesão ao plano",
      amount: 50.00,
      chargeType: "one_time",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      chargeName: "Taxa de Manutenção",
      description: "Taxa anual de manutenção",
      amount: 120.00,
      chargeType: "annual",
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleCreate = (data: ChargeFormData) => {
    toast({
      title: "Sucesso",
      description: "Cobrança criada com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (charge: ContractCharge) => {
    setSelectedCharge(charge);
    form.reset({
      chargeName: charge.chargeName,
      description: charge.description || "",
      amount: charge.amount,
      chargeType: charge.chargeType,
      active: charge.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: ChargeFormData) => {
    toast({
      title: "Sucesso",
      description: "Cobrança atualizada com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedCharge(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Cobrança excluída com sucesso",
    });
  };

  const getChargeTypeName = (typeId: string) => {
    const type = mockChargeTypes.find(t => t.id === typeId);
    return type?.name || "Desconhecido";
  };

  const filteredCharges = mockCharges.filter((charge) => {
    return searchTerm === "" || 
      charge.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (charge.description && charge.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: ChargeFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os dados da cobrança
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="chargeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Cobrança *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Taxa de Administração" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chargeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cobrança *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockChargeTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="neu-input"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a cobrança..."
                      className="neu-input"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="neu-flat"
                    />
                  </FormControl>
                  <FormLabel>Cobrança Ativa</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="neu-button"
              >
                {t("action.cancel")}
              </Button>
              <Button type="submit" className="neu-button">
                {t("action.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input pl-10 w-64"
          />
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cobrança
        </Button>
      </div>

      <Card className="neu-card rounded-2xl">
        <CardHeader>
          <CardTitle>Cobranças Contratuais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="neu-flat rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead>Nome da Cobrança</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t("message.no_data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCharges.map((charge) => (
                    <TableRow key={charge.id} className="border-gray-200">
                      <TableCell className="font-medium">{charge.chargeName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="neu-flat">
                          {getChargeTypeName(charge.chargeType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">R$ {charge.amount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {charge.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={charge.active ? "default" : "destructive"} className="neu-flat">
                          {charge.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(charge.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(charge)}
                            className="neu-button h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="neu-button h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="neu-card">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a cobrança "{charge.chargeName}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(charge.id)}
                                  className="neu-button bg-red-600 hover:bg-red-700"
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
        </CardContent>
      </Card>

      {renderFormDialog(
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        "Criar Nova Cobrança",
        handleCreate
      )}

      {renderFormDialog(
        isEditDialogOpen,
        (open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedCharge(null);
        },
        "Editar Cobrança",
        handleUpdate
      )}
    </div>
  );
}