import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Edit, Trash2, Search, FileType } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { apiRequest } from "@/lib/queryClient";
import { insertDocumentTypeSchema, type DocumentType, type InsertDocumentType } from "@shared/schema";

type DocumentTypeFormData = z.infer<typeof insertDocumentTypeSchema>;

export default function DocumentTypesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<DocumentTypeFormData>({
    resolver: zodResolver(insertDocumentTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });

  const { data: documentTypes = [], isLoading } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  const createDocumentTypeMutation = useMutation({
    mutationFn: (data: InsertDocumentType) => 
      apiRequest('/api/document-types', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Tipo de documento criado com sucesso",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar tipo de documento",
        variant: "destructive",
      });
    },
  });

  const updateDocumentTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertDocumentType> }) =>
      apiRequest(`/api/document-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Tipo de documento atualizado com sucesso",
      });
      setIsEditDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar tipo de documento",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentTypeMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/document-types/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Tipo de documento excluído com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir tipo de documento",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (data: DocumentTypeFormData) => {
    createDocumentTypeMutation.mutate(data);
  };

  const handleEdit = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    form.reset({
      name: documentType.name,
      description: documentType.description || "",
      active: documentType.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: DocumentTypeFormData) => {
    if (selectedDocumentType) {
      updateDocumentTypeMutation.mutate({ 
        id: selectedDocumentType.id, 
        data 
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteDocumentTypeMutation.mutate(id);
  };

  const filteredDocumentTypes = documentTypes?.filter(dt =>
    dt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dt.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: DocumentTypeFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os dados do tipo de documento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Tipo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: RG, CPF, Contrato" className="neu-input" {...field} />
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
                    <Textarea placeholder="Descrição do tipo de documento" className="neu-input" {...field} />
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
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createDocumentTypeMutation.isPending || updateDocumentTypeMutation.isPending}>
                {createDocumentTypeMutation.isPending || updateDocumentTypeMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="neu-card rounded-3xl p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Carregando tipos de documento...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileType className="h-5 w-5" />
                  Tipos de Documento
                </CardTitle>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="neu-button"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Tipo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar tipos de documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neu-input pl-10"
                  />
                </div>
              </div>

              <div className="neu-pressed rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0">
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocumentTypes.map((docType) => (
                      <TableRow key={docType.id} className="border-b-0">
                        <TableCell className="font-medium">{docType.name}</TableCell>
                        <TableCell>{docType.description || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={docType.active ? "default" : "secondary"}>
                            {docType.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(docType.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(docType)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="neu-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o tipo de documento "{docType.name}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(docType.id)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredDocumentTypes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "Nenhum tipo de documento encontrado" : "Nenhum tipo de documento cadastrado"}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {renderFormDialog(isCreateDialogOpen, setIsCreateDialogOpen, "Novo Tipo de Documento", handleCreate)}
      {renderFormDialog(isEditDialogOpen, setIsEditDialogOpen, "Editar Tipo de Documento", handleUpdate)}
    </div>
  );
}