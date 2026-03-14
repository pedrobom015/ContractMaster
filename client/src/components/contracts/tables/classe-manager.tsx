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
import { Plus, Edit, Trash2, Search } from "lucide-react";

const classeSchema = z.object({
  className: z.string().min(1, "Nome da classe é obrigatório").max(100),
  description: z.string().optional(),
  monthlyFee: z.number().min(0, "Taxa mensal deve ser positiva"),
  active: z.boolean(),
});

type ClasseFormData = z.infer<typeof classeSchema>;

interface Classe {
  id: number;
  className: string;
  description?: string;
  monthlyFee: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ClasseManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ClasseFormData>({
    resolver: zodResolver(classeSchema),
    defaultValues: {
      className: "",
      description: "",
      monthlyFee: 0,
      active: true,
    },
  });

  // Mock data for classes
  const mockClasses: Classe[] = [
    {
      id: 1,
      className: "Classe Básica",
      description: "Classe básica de contratos",
      monthlyFee: 99.90,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      className: "Classe Premium",
      description: "Classe premium com benefícios adicionais",
      monthlyFee: 199.90,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      className: "Classe VIP",
      description: "Classe VIP com todos os benefícios",
      monthlyFee: 299.90,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleCreate = (data: ClasseFormData) => {
    toast({
      title: "Sucesso",
      description: "Classe criada com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (classe: Classe) => {
    setSelectedClasse(classe);
    form.reset({
      className: classe.className,
      description: classe.description || "",
      monthlyFee: classe.monthlyFee,
      active: classe.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: ClasseFormData) => {
    toast({
      title: "Sucesso",
      description: "Classe atualizada com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedClasse(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Classe excluída com sucesso",
    });
  };

  const filteredClasses = mockClasses.filter((classe) => {
    return searchTerm === "" || 
      classe.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              name="className"
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

            <FormField
              control={form.control}
              name="monthlyFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa Mensal *</FormLabel>
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
                  <TableHead>Taxa Mensal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t("message.no_data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((classe) => (
                    <TableRow key={classe.id} className="border-gray-200">
                      <TableCell className="font-medium">{classe.className}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {classe.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="neu-flat">
                          R$ {classe.monthlyFee.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={classe.active ? "default" : "destructive"} className="neu-flat">
                          {classe.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(classe.updatedAt).toLocaleDateString()}
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
                                  Tem certeza que deseja excluir a classe "{classe.className}"? Esta ação não pode ser desfeita.
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