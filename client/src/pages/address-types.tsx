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
import { Plus, Edit, Trash2, Search, Database } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

const addressTypeSchema = z.object({
  typeName: z.string().min(1, "Nome do tipo é obrigatório").max(50),
  description: z.string().optional(),
  active: z.boolean(),
});

type AddressTypeFormData = z.infer<typeof addressTypeSchema>;

interface AddressType {
  id: number;
  typeName: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AddressTypesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<AddressType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<AddressTypeFormData>({
    resolver: zodResolver(addressTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
      active: true,
    },
  });

  // Default address types that will be created in the database
  const addressTypes: AddressType[] = [
    {
      id: 1,
      typeName: "Residencial",
      description: "Endereço residencial do cliente",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      typeName: "Comercial",
      description: "Endereço comercial para correspondência",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      typeName: "Cobrança",
      description: "Endereço específico para cobrança",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      typeName: "Entrega",
      description: "Endereço para entrega de produtos",
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleCreate = (data: AddressTypeFormData) => {
    toast({
      title: "Sucesso",
      description: "Tipo de endereço criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (type: AddressType) => {
    setSelectedType(type);
    form.reset({
      typeName: type.typeName,
      description: type.description || "",
      active: type.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: AddressTypeFormData) => {
    toast({
      title: "Sucesso",
      description: "Tipo de endereço atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedType(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Tipo de endereço excluído com sucesso",
    });
  };

  const filteredTypes = addressTypes.filter((type) => {
    return searchTerm === "" || 
      type.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: AddressTypeFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os dados do tipo de endereço
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tipo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Residencial" className="neu-input" {...field} />
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
                      placeholder="Descreva o tipo de endereço..."
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
                  <FormLabel>Tipo Ativo</FormLabel>
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
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="neu-card rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Tipos de Endereço
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie os tipos de endereços do sistema
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredTypes.length} tipos
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10 w-96"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          </div>

          {/* Address Types Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Tipos de Endereço</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredTypes.length} encontrados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Nome do Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {t("message.no_data")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTypes.map((type) => (
                        <TableRow key={type.id} className="border-gray-200">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Database className="h-4 w-4 text-gray-500" />
                              <span>{type.typeName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {type.description || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={type.active ? "default" : "destructive"} className="neu-flat">
                              {type.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(type.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(type)}
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
                                      Tem certeza que deseja excluir o tipo "{type.typeName}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(type.id)}
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
            "Criar Tipo de Endereço",
            handleCreate
          )}

          {renderFormDialog(
            isEditDialogOpen,
            (open: boolean) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedType(null);
            },
            "Editar Tipo de Endereço",
            handleUpdate
          )}
        </main>
      </div>
    </div>
  );
}