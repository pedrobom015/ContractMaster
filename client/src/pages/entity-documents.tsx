// @ts-nocheck
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Link2, FileText, Eye } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

const entityDocumentSchema = z.object({
  entityType: z.string().min(1, "Tipo de entidade é obrigatório"),
  entityId: z.number().min(1, "ID da entidade é obrigatório"),
  documentId: z.number().min(1, "Documento é obrigatório"),
  relationship: z.string().optional(),
  notes: z.string().optional(),
});

type EntityDocumentFormData = z.infer<typeof entityDocumentSchema>;

interface DocumentType {
  id: number;
  name: string;
}

interface Document {
  id: number;
  title: string;
  documentType: DocumentType;
  fileName: string;
}

interface EntityDocument {
  id: number;
  entityType: string;
  entityId: number;
  documentId: number;
  document: Document;
  relationship?: string;
  notes?: string;
  attachedBy?: number;
  attachedAt: string;
}

export default function EntityDocumentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntityDocument, setSelectedEntityDocument] = useState<EntityDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<EntityDocumentFormData>({
    resolver: zodResolver(entityDocumentSchema),
    defaultValues: {
      entityType: "",
      entityId: 0,
      documentId: 0,
      relationship: "",
      notes: "",
    },
  });

  // Documentos disponíveis
  const documents: Document[] = [
    {
      id: 1,
      title: "RG João Silva",
      documentType: { id: 1, name: "RG" },
      fileName: "rg_joao_silva.pdf",
    },
    {
      id: 2,
      title: "CPF Maria Santos",
      documentType: { id: 2, name: "CPF" },
      fileName: "cpf_maria_santos.pdf",
    },
    {
      id: 3,
      title: "Comprovante Residência - Pedro Costa",
      documentType: { id: 3, name: "Comprovante de Residência" },
      fileName: "comprov_residencia_pedro.jpg",
    },
  ];

  // Vínculos de documentos de exemplo
  const entityDocuments: EntityDocument[] = [
    {
      id: 1,
      entityType: "client",
      entityId: 1,
      documentId: 1,
      document: documents[0],
      relationship: "titular",
      notes: "Documento principal do cliente",
      attachedBy: 1,
      attachedAt: new Date().toISOString(),
    },
    {
      id: 2,
      entityType: "client",
      entityId: 1,
      documentId: 2,
      document: documents[1],
      relationship: "complementar",
      notes: "Documento de identificação fiscal",
      attachedBy: 1,
      attachedAt: new Date().toISOString(),
    },
    {
      id: 3,
      entityType: "contract",
      entityId: 1,
      documentId: 3,
      document: documents[2],
      relationship: "obrigatório",
      notes: "Comprovante necessário para contrato",
      attachedBy: 1,
      attachedAt: new Date().toISOString(),
    },
  ];

  const handleCreate = (data: EntityDocumentFormData) => {
    toast({
      title: "Sucesso",
      description: "Vínculo de documento criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (entityDocument: EntityDocument) => {
    setSelectedEntityDocument(entityDocument);
    form.reset({
      entityType: entityDocument.entityType,
      entityId: entityDocument.entityId,
      documentId: entityDocument.documentId,
      relationship: entityDocument.relationship || "",
      notes: entityDocument.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: EntityDocumentFormData) => {
    toast({
      title: "Sucesso",
      description: "Vínculo de documento atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedEntityDocument(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Vínculo de documento excluído com sucesso",
    });
  };

  const filteredEntityDocuments = entityDocuments.filter((entityDoc) => {
    return searchTerm === "" || 
      entityDoc.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entityDoc.document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entityDoc.document.documentType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entityDoc.relationship && entityDoc.relationship.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entityDoc.notes && entityDoc.notes.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getEntityTypeLabel = (entityType: string) => {
    const labels: { [key: string]: string } = {
      client: "Cliente",
      contract: "Contrato",
      partner: "Parceiro",
      beneficiary: "Beneficiário",
    };
    return labels[entityType] || entityType;
  };

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: EntityDocumentFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure o vínculo entre entidade e documento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Entidade *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="contract">Contrato</SelectItem>
                        <SelectItem value="partner">Parceiro</SelectItem>
                        <SelectItem value="beneficiary">Beneficiário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Entidade *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 1" 
                        className="neu-input" 
                        value={field.value || ""} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="documentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documents.map((document) => (
                        <SelectItem key={document.id} value={document.id.toString()}>
                          {document.title} ({document.documentType.name})
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
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relacionamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o relacionamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="titular">Titular</SelectItem>
                      <SelectItem value="complementar">Complementar</SelectItem>
                      <SelectItem value="obrigatório">Obrigatório</SelectItem>
                      <SelectItem value="opcional">Opcional</SelectItem>
                      <SelectItem value="backup">Backup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre o vínculo" 
                      className="neu-input resize-none" 
                      rows={3}
                      value={field.value || ""} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="neu-button-secondary"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="neu-button-primary"
              >
                {selectedEntityDocument ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="neu-icon-wrapper">
                  <Link2 className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Vínculos de Documento</h1>
                  <p className="text-slate-600 mt-1">Gerencie os vínculos entre entidades e documentos</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="neu-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Vínculo
              </Button>
            </div>

            <Card className="neu-card">
              <CardHeader className="border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Lista de Vínculos</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar vínculos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="neu-input pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-slate-700 font-semibold">Entidade</TableHead>
                      <TableHead className="text-slate-700 font-semibold">ID</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Documento</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Tipo</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Relacionamento</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Data</TableHead>
                      <TableHead className="text-slate-700 font-semibold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntityDocuments.map((entityDocument) => (
                      <TableRow key={entityDocument.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell>
                          <Badge variant="outline" className="neu-badge">
                            {getEntityTypeLabel(entityDocument.entityType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {entityDocument.entityId}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {entityDocument.document.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="neu-badge">
                            {entityDocument.document.documentType.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {entityDocument.relationship || "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(entityDocument.attachedAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="neu-button-secondary"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(entityDocument)}
                              className="neu-button-secondary"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="neu-button-danger"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="neu-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este vínculo de documento? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="neu-button-secondary">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(entityDocument.id)}
                                    className="neu-button-danger"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEntityDocuments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          Nenhum vínculo encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {renderFormDialog(
              isCreateDialogOpen, 
              setIsCreateDialogOpen, 
              "Criar Vínculo de Documento", 
              handleCreate
            )}

            {renderFormDialog(
              isEditDialogOpen, 
              setIsEditDialogOpen, 
              "Editar Vínculo de Documento", 
              handleUpdate
            )}
          </div>
        </main>
      </div>
    </div>
  );
}