import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const classeSchema = z.object({
  name: z.string().min(1, "Nome da classe é obrigatório").max(100),
  description: z.string().min(1, "Descrição é obrigatória").max(200),
  sysUnitId: z.number().optional(),
  sysUserId: z.number().optional(),
  amountContracts: z.number().default(0),
  active: z.boolean().default(true),
  isPeriodic: z.boolean().default(true),
  purchaseValue: z.number().min(0, "Valor de compra deve ser positivo"),
  numberOfParcels: z.number().min(1, "Número de parcelas deve ser maior que zero"),
  generatedParcels: z.number().default(0),
  monthValue: z.number().min(0, "Valor mensal deve ser positivo"),
  dependValue: z.number().optional(),
  numberOfMonthValid: z.number().optional(),
  isRenewable: z.boolean().default(false),
  isRenewableUsed: z.boolean().default(false),
  totalValue: z.number().optional(),
  message1: z.string().max(30).optional(),
  message2: z.string().max(30).optional(),
});

type ClasseFormData = z.infer<typeof classeSchema>;

interface Classe {
  id: number;
  name: string;
  description: string;
  sysUnitId?: number;
  sysUserId?: number;
  amountContracts?: number;
  active: boolean;
  isPeriodic: boolean;
  purchaseValue: string;
  numberOfParcels: number;
  generatedParcels: number;
  monthValue: string;
  dependValue?: string;
  numberOfMonthValid?: number;
  isRenewable: boolean;
  isRenewableUsed: boolean;
  totalValue?: string;
  message1?: string;
  message2?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  deletedBy?: number;
}

export default function ClasseManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  
  const { data: classes = [], isLoading } = useQuery<Classe[]>({
    queryKey: ["/api/classes"],
    queryFn: async () => {
      const response = await apiRequest("/api/classes");
      return response as Classe[];
    },
  });
  
  const createMutation = useMutation({
    mutationFn: (data: ClasseFormData) => apiRequest("/api/classes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({ title: "Sucesso", description: "Classe criada com sucesso" });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Erro", description: "Erro ao criar classe", variant: "destructive" });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClasseFormData> }) =>
      apiRequest(`/api/classes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({ title: "Sucesso", description: "Classe atualizada com sucesso" });
      setIsEditDialogOpen(false);
      setSelectedClasse(null);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Erro", description: "Erro ao atualizar classe", variant: "destructive" });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/classes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({ title: "Sucesso", description: "Classe excluída com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: "Erro ao excluir classe", variant: "destructive" });
    },
  });

  const form = useForm<ClasseFormData>({
    resolver: zodResolver(classeSchema),
    defaultValues: {
      name: "",
      description: "",
      amountContracts: 0,
      active: true,
      isPeriodic: true,
      purchaseValue: 0,
      numberOfParcels: 1,
      generatedParcels: 0,
      monthValue: 0,
      isRenewable: false,
      isRenewableUsed: false,
      message1: "",
      message2: "",
    },
  });


  const handleCreate = (data: ClasseFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (classe: Classe) => {
    setSelectedClasse(classe);
    form.reset({
      name: classe.name,
      description: classe.description || "",
      amountContracts: classe.amountContracts || 0,
      active: classe.active,
      isPeriodic: classe.isPeriodic,
      purchaseValue: parseFloat(classe.purchaseValue || "0"),
      numberOfParcels: classe.numberOfParcels,
      generatedParcels: classe.generatedParcels,
      monthValue: parseFloat(classe.monthValue || "0"),
      dependValue: classe.dependValue ? parseFloat(classe.dependValue) : undefined,
      numberOfMonthValid: classe.numberOfMonthValid,
      isRenewable: classe.isRenewable,
      isRenewableUsed: classe.isRenewableUsed,
      totalValue: classe.totalValue ? parseFloat(classe.totalValue) : undefined,
      message1: classe.message1 || "",
      message2: classe.message2 || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: ClasseFormData) => {
    if (selectedClasse) {
      updateMutation.mutate({ id: selectedClasse.id, data });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredClasses = (classes || []).filter((classe: Classe) => {
    return searchTerm === "" || 
      classe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classe.description && classe.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: ClasseFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os dados da classe
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Classe *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Classe Básica" className="neu-input" {...field} />
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
                      placeholder="Descreva a classe..."
                      className="neu-input"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de Compra *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="0.00"
                        className="neu-input"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="monthValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mensal *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numberOfParcels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Parcelas *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        className="neu-input"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dependValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Dependente</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="0.00"
                        className="neu-input"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="isPeriodic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="neu-flat"
                      />
                    </FormControl>
                    <FormLabel>É Periódico</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isRenewable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="neu-flat"
                      />
                    </FormControl>
                    <FormLabel>Renovável</FormLabel>
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
                    <FormLabel>Classe Ativa</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="message1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mensagem personalizada..."
                        maxLength={30}
                        className="neu-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Segunda mensagem..."
                        maxLength={30}
                        className="neu-input"
                        {...field}
                      />
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
          Nova Classe
        </Button>
      </div>

      <Card className="neu-card rounded-2xl">
        <CardHeader>
          <CardTitle>Classes de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="neu-flat rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead>Nome da Classe</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Valor Compra</TableHead>
                  <TableHead>Parcelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t("message.no_data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((classe: Classe) => (
                    <TableRow key={classe.id} className="border-gray-200">
                      <TableCell className="font-medium">{classe.name}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {classe.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="neu-flat">
                          R$ {parseFloat(classe.monthValue || "0").toFixed(4)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="neu-flat">
                          R$ {parseFloat(classe.purchaseValue || "0").toFixed(4)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {classe.generatedParcels}/{classe.numberOfParcels}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={classe.active ? "default" : "destructive"} className="neu-flat">
                          {classe.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(classe)}
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
                                  Tem certeza que deseja excluir a classe "{classe.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(classe.id)}
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
        "Criar Nova Classe",
        handleCreate
      )}

      {renderFormDialog(
        isEditDialogOpen,
        (open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedClasse(null);
        },
        "Editar Classe",
        handleUpdate
      )}
    </div>
  );
}