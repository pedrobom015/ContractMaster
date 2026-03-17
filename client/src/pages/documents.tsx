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
import { Plus, Edit, Trash2, Search, FileText, Download, Eye } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

const documentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255),
  documentTypeId: z.number().min(1, "Tipo de documento é obrigatório"),
  fileName: z.string().min(1, "Nome do arquivo é obrigatório"),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentType {
  id: number;
  name: string;
}

interface Document {
  id: number;
  title: string;
  documentTypeId: number;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  description?: string;
  version?: string;
  status?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy?: number;
  uploadedByUser?: { name: string };
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      documentTypeId: 0,
      fileName: "",
      description: "",
      version: "",
      status: "ativo",
    },
  });

  // Tipos de documento disponíveis
  const documentTypes: DocumentType[] = [
    { id: 1, name: "RG" },
    { id: 2, name: "CPF" },
    { id: 3, name: "Comprovante de Residência" },
    { id: 4, name: "Comprovante de Renda" },
    { id: 5, name: "Contrato Social" },
  ];

  // Documentos de exemplo
  const documents: Document[] = [
    {
      id: 1,
      title: "RG João Silva",
      documentTypeId: 1,
      documentType: { id: 1, name: "RG" },
      fileName: "rg_joao_silva.pdf",
      filePath: "/uploads/documents/rg_joao_silva.pdf",
      description: "Documento de identidade do cliente João Silva",
      version: "1.0",
      status: "ativo",
      fileSize: 1024000,
      mimeType: "application/pdf",
      uploadedBy: 1,
      uploadedByUser: { name: "Admin" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "CPF Maria Santos",
      documentTypeId: 2,
      documentType: { id: 2, name: "CPF" },
      fileName: "cpf_maria_santos.pdf",
      filePath: "/uploads/documents/cpf_maria_santos.pdf",
      description: "CPF da cliente Maria Santos",
      version: "1.0",
      status: "ativo",
      fileSize: 512000,
      mimeType: "application/pdf",
      uploadedBy: 1,
      uploadedByUser: { name: "Admin" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Comprovante Residência - Pedro Costa",
      documentTypeId: 3,
      documentType: { id: 3, name: "Comprovante de Residência" },
      fileName: "comprov_residencia_pedro.jpg",
      filePath: "/uploads/documents/comprov_residencia_pedro.jpg",
      description: "Conta de luz comprovando residência",
      version: "1.0",
      status: "ativo",
      fileSize: 2048000,
      mimeType: "image/jpeg",
      uploadedBy: 1,
      uploadedByUser: { name: "Admin" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const handleCreate = (data: DocumentFormData) => {
    toast({
      title: "Sucesso",
      description: "Documento criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    form.reset({
      title: document.title,
      documentTypeId: document.documentTypeId,
      fileName: document.fileName,
      description: document.description || "",
      version: document.version || "",
      status: document.status || "ativo",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: DocumentFormData) => {
    toast({
      title: "Sucesso",
      description: "Documento atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedDocument(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Documento excluído com sucesso",
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    return searchTerm === "" || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: DocumentFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os dados do documento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Documento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: RG João Silva" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
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
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Arquivo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: documento.pdf" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versão</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0" className="neu-input" value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "ativo"}>
                      <FormControl>
                        <SelectTrigger className="neu-input">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="arquivado">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição detalhada do documento" 
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
                {selectedDocument ? "Atualizar" : "Criar"}
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
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Documentos</h1>
                  <p className="text-slate-600 mt-1">Gerencie os documentos do sistema</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="neu-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </Button>
            </div>

            <Card className="neu-card">
              <CardHeader className="border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Lista de Documentos</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar documentos..."
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
                      <TableHead className="text-slate-700 font-semibold">Título</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Tipo</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Arquivo</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Tamanho</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Versão</TableHead>
                      <TableHead className="text-slate-700 font-semibold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-900">
                          {document.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="neu-badge">
                            {document.documentType.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {document.fileName}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {formatFileSize(document.fileSize)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={document.status === "ativo" ? "default" : "secondary"}
                            className={document.status === "ativo" ? "neu-badge-success" : "neu-badge-inactive"}
                          >
                            {document.status === "ativo" ? "Ativo" : document.status === "inativo" ? "Inativo" : "Arquivado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {document.version || "-"}
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
                              className="neu-button-secondary"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(document)}
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
                                    Tem certeza que deseja excluir o documento "{document.title}"? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="neu-button-secondary">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(document.id)}
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
                    {filteredDocuments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          Nenhum documento encontrado
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
              "Criar Documento", 
              handleCreate
            )}

            {renderFormDialog(
              isEditDialogOpen, 
              setIsEditDialogOpen, 
              "Editar Documento", 
              handleUpdate
            )}
          </div>
        </main>
      </div>
    </div>
  );
}