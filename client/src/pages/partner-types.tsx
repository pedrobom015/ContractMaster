// @ts-nocheck
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Tag, Users } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Partner Type Schema
const partnerTypeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().optional(),
  active: z.boolean(),
});

type PartnerTypeFormData = z.infer<typeof partnerTypeSchema>;

interface PartnerType {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PartnerTypesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<PartnerTypeFormData>({
    resolver: zodResolver(partnerTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });

  // Mock data for partner types
  const mockPartnerTypes: PartnerType[] = [
    {
      id: 1,
      name: "Funerária",
      description: "Empresas do setor funerário",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Plano de Saúde",
      description: "Operadoras de plano de saúde",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Seguradora",
      description: "Companhias de seguro",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Prestador de Serviços",
      description: "Empresas prestadoras de serviços diversos",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Fornecedor",
      description: "Fornecedores de produtos e materiais",
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleCreatePartnerType = (data: PartnerTypeFormData) => {
    toast({
      title: "Sucesso",
      description: "Tipo de parceiro criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditPartnerType = (partnerType: PartnerType) => {
    setSelectedPartnerType(partnerType);
    form.reset({
      name: partnerType.name,
      description: partnerType.description || "",
      active: partnerType.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePartnerType = (data: PartnerTypeFormData) => {
    toast({
      title: "Sucesso",
      description: "Tipo de parceiro atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedPartnerType(null);
    form.reset();
  };

  const handleDeletePartnerType = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Tipo de parceiro excluído com sucesso",
    });
  };

  const getPartnerTypeStatusBadge = (partnerType: PartnerType) => {
    if (!partnerType.active) {
      return <Badge variant="destructive" className="neu-flat">Inativo</Badge>;
    }
    return <Badge variant="default" className="neu-flat">Ativo</Badge>;
  };

  const filteredPartnerTypes = mockPartnerTypes.filter((partnerType) => {
    return searchTerm === "" || 
      partnerType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partnerType.description && partnerType.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: PartnerTypeFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os detalhes do tipo de parceiro
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tipo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Funerária" className="neu-input" {...field} />
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
                      placeholder="Descreva o tipo de parceiro..."
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
                  Tipos de Parceiros
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie os tipos de parceiros do sistema
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredPartnerTypes.length} tipos
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

          {/* Partner Types Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Tipos de Parceiros</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredPartnerTypes.length} encontrados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartnerTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {t("message.no_data")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPartnerTypes.map((partnerType) => (
                        <TableRow key={partnerType.id} className="border-gray-200">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-gray-500" />
                              <span>{partnerType.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {partnerType.description || "-"}
                            </div>
                          </TableCell>
                          <TableCell>{getPartnerTypeStatusBadge(partnerType)}</TableCell>
                          <TableCell>
                            {new Date(partnerType.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditPartnerType(partnerType)}
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
                                      Tem certeza que deseja excluir o tipo "{partnerType.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeletePartnerType(partnerType.id)}
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
            "Criar Novo Tipo de Parceiro",
            handleCreatePartnerType
          )}

          {renderFormDialog(
            isEditDialogOpen,
            (open) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedPartnerType(null);
            },
            "Editar Tipo de Parceiro",
            handleUpdatePartnerType
          )}
        </main>
      </div>
    </div>
  );
}