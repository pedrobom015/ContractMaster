import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Building, MapPin, FileType, Network, Link2, Plus, Edit, Trash2, Search } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { apiRequest } from "@/lib/queryClient";
import { 
  insertPartnerTypeSchema, 
  insertDocumentTypeSchema, 
  insertAddressTypeSchema,
  type PartnerType, 
  type DocumentType, 
  type AddressType,
  type InsertPartnerType, 
  type InsertDocumentType,
  type InsertAddressType
} from "@shared/schema";

type PartnerTypeFormData = z.infer<typeof insertPartnerTypeSchema>;
type DocumentTypeFormData = z.infer<typeof insertDocumentTypeSchema>;
type AddressTypeFormData = z.infer<typeof insertAddressTypeSchema>;

export default function AuxiliaryTables() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("partner-types");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Forms
  const partnerTypeForm = useForm<PartnerTypeFormData>({
    resolver: zodResolver(insertPartnerTypeSchema),
    defaultValues: { typeName: "", description: "", active: true },
  });

  const documentTypeForm = useForm<DocumentTypeFormData>({
    resolver: zodResolver(insertDocumentTypeSchema),
    defaultValues: { description: "" },
  });

  const addressTypeForm = useForm<AddressTypeFormData>({
    resolver: zodResolver(insertAddressTypeSchema),
    defaultValues: { name: "" },
  });

  // API Queries
  const { data: partnerTypes = [], isLoading: isLoadingPartnerTypes } = useQuery<PartnerType[]>({
    queryKey: ['/api/partner-types'],
  });

  const { data: documentTypes = [], isLoading: isLoadingDocumentTypes } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  const { data: addressTypes = [], isLoading: isLoadingAddressTypes } = useQuery<AddressType[]>({
    queryKey: ['/api/address-types'],
  });

  // Mutations for Partner Types
  const createPartnerTypeMutation = useMutation({
    mutationFn: (data: InsertPartnerType) =>
      apiRequest('/api/partner-types', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de parceiro criado com sucesso" });
      setIsCreateDialogOpen(false);
      partnerTypeForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/partner-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao criar tipo de parceiro", variant: "destructive" });
    },
  });

  const updatePartnerTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertPartnerType> }) =>
      apiRequest(`/api/partner-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de parceiro atualizado com sucesso" });
      setIsEditDialogOpen(false);
      partnerTypeForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/partner-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao atualizar tipo de parceiro", variant: "destructive" });
    },
  });

  const deletePartnerTypeMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/partner-types/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de parceiro excluído com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['/api/partner-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao excluir tipo de parceiro", variant: "destructive" });
    },
  });

  // Mutations for Document Types  
  const createDocumentTypeMutation = useMutation({
    mutationFn: (data: InsertDocumentType) =>
      apiRequest('/api/document-types', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de documento criado com sucesso" });
      setIsCreateDialogOpen(false);
      documentTypeForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao criar tipo de documento", variant: "destructive" });
    },
  });

  const updateDocumentTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertDocumentType> }) =>
      apiRequest(`/api/document-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de documento atualizado com sucesso" });
      setIsEditDialogOpen(false);
      documentTypeForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao atualizar tipo de documento", variant: "destructive" });
    },
  });

  const deleteDocumentTypeMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/document-types/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de documento excluído com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao excluir tipo de documento", variant: "destructive" });
    },
  });

  // Mutations for Address Types
  const createAddressTypeMutation = useMutation({
    mutationFn: (data: InsertAddressType) =>
      apiRequest('/api/address-types', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de endereço criado com sucesso" });
      setIsCreateDialogOpen(false);
      addressTypeForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/address-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao criar tipo de endereço", variant: "destructive" });
    },
  });

  const updateAddressTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertAddressType> }) =>
      apiRequest(`/api/address-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de endereço atualizado com sucesso" });
      setIsEditDialogOpen(false);
      addressTypeForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/address-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao atualizar tipo de endereço", variant: "destructive" });
    },
  });

  const deleteAddressTypeMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/address-types/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tipo de endereço excluído com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['/api/address-types'] });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao excluir tipo de endereço", variant: "destructive" });
    },
  });

  // Handlers
  const handleCreate = (tab: string) => {
    setActiveTab(tab);
    setSelectedEntity(null);
    resetForm(tab);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (entity: any, tab: string) => {
    setActiveTab(tab);
    setSelectedEntity(entity);
    populateForm(entity, tab);
    setIsEditDialogOpen(true);
  };

  const handleSave = (data: any) => {
    if (activeTab === "partner-types") {
      if (selectedEntity) {
        updatePartnerTypeMutation.mutate({ id: selectedEntity.partnerTypeId, data });
      } else {
        createPartnerTypeMutation.mutate(data);
      }
    } else if (activeTab === "document-types") {
      if (selectedEntity) {
        updateDocumentTypeMutation.mutate({ id: selectedEntity.documentTypeId, data });
      } else {
        createDocumentTypeMutation.mutate(data);
      }
    } else if (activeTab === "address-types") {
      if (selectedEntity) {
        updateAddressTypeMutation.mutate({ id: selectedEntity.addressTypeId, data });
      } else {
        createAddressTypeMutation.mutate(data);
      }
    }
  };

  const handleDelete = (id: number) => {
    if (activeTab === "partner-types") {
      deletePartnerTypeMutation.mutate(id);
    } else if (activeTab === "document-types") {
      deleteDocumentTypeMutation.mutate(id);
    } else if (activeTab === "address-types") {
      deleteAddressTypeMutation.mutate(id);
    }
  };

  const resetForm = (tab: string) => {
    switch (tab) {
      case "partner-types": partnerTypeForm.reset(); break;
      case "document-types": documentTypeForm.reset(); break;
      case "address-types": addressTypeForm.reset(); break;
    }
  };

  const populateForm = (entity: any, tab: string) => {
    switch (tab) {
      case "partner-types":
        partnerTypeForm.reset({
          typeName: entity.typeName,
          description: entity.description || "",
          active: entity.active
        });
        break;
      case "document-types":
        documentTypeForm.reset({
          description: entity.description
        });
        break;
      case "address-types":
        addressTypeForm.reset({
          name: entity.name
        });
        break;
    }
  };

  const getFilteredPartnerTypes = () => {
    if (!searchTerm) return partnerTypes;
    return partnerTypes.filter(pt => 
      pt.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredDocumentTypes = () => {
    if (!searchTerm) return documentTypes;
    return documentTypes.filter(dt => 
      dt.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFilteredAddressTypes = () => {
    if (!searchTerm) return addressTypes;
    return addressTypes.filter(at => 
      at.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const tabsConfig = [
    {
      id: "partner-types",
      label: t("section.partner_types"),
      icon: Building
    },
    {
      id: "address-types", 
      label: t("section.address_types"),
      icon: MapPin
    },
    {
      id: "document-types",
      label: t("section.document_types"),
      icon: FileType
    },
    {
      id: "entity-addresses",
      label: t("section.entity_addresses"),
      icon: Network
    },
    {
      id: "entity-documents",
      label: t("section.entity_documents"),
      icon: Link2
    }
  ];

  const renderPartnerTypesTab = () => {
    const filteredData = getFilteredPartnerTypes();
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Tipos de Parceiros
            </CardTitle>
            <Button onClick={() => handleCreate("partner-types")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Tipo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.partnerTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{item.typeName}</TableCell>
                  <TableCell>{item.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="neu-button neu-button-secondary"
                        onClick={() => handleEdit(item, "partner-types")}
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
                              Tem certeza que deseja excluir o tipo "{item.typeName}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.partnerTypeId)} className="neu-button neu-button-danger">
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
        </CardContent>
      </Card>
    );
  };

  const renderDocumentTypesTab = () => {
    const filteredData = getFilteredDocumentTypes();
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileType className="h-5 w-5" />
              Tipos de Documento
            </CardTitle>
            <Button onClick={() => handleCreate("document-types")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Tipo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Descrição</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.documentTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="neu-button neu-button-secondary" onClick={() => handleEdit(item, "document-types")}>
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
                              Tem certeza que deseja excluir o tipo "{item.description}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.documentTypeId)} className="neu-button neu-button-danger">
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
        </CardContent>
      </Card>
    );
  };

  const renderAddressTypesTab = () => {
    const filteredData = getFilteredAddressTypes();
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Tipos de Endereço
            </CardTitle>
            <Button onClick={() => handleCreate("address-types")} className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Tipo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Nome</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.addressTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item, "address-types")} className="neu-button neu-button-secondary">
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
                              Tem certeza que deseja excluir o tipo "{item.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.addressTypeId)} className="neu-button neu-button-danger">
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
        </CardContent>
      </Card>
    );
  };

  const renderEntityAddressesTab = () => {
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Vínculos de Endereço
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Funcionalidade em desenvolvimento.</p>
        </CardContent>
      </Card>
    );
  };

  const renderEntityDocumentsTab = () => {
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Vínculos de Documento
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Funcionalidade em desenvolvimento.</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle>Tabelas Auxiliares</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 neu-flat rounded-xl p-1">
                  {tabsConfig.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="neu-button">
                      <div className="flex items-center space-x-2">
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="partner-types">{renderPartnerTypesTab()}</TabsContent>
                <TabsContent value="address-types">{renderAddressTypesTab()}</TabsContent>
                <TabsContent value="document-types">{renderDocumentTypesTab()}</TabsContent>
                <TabsContent value="entity-addresses">{renderEntityAddressesTab()}</TabsContent>
                <TabsContent value="entity-documents">{renderEntityDocumentsTab()}</TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="neu-card max-w-md">
              <DialogHeader><DialogTitle>Criar Novo Registro</DialogTitle></DialogHeader>
              {activeTab === "partner-types" && (
                <Form {...partnerTypeForm}>
                  <form onSubmit={partnerTypeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField control={partnerTypeForm.control} name="typeName" render={({ field }) => (
                      <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={partnerTypeForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Criar</Button>
                  </form>
                </Form>
              )}
              {activeTab === "address-types" && (
                <Form {...addressTypeForm}>
                  <form onSubmit={addressTypeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField control={addressTypeForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Criar</Button>
                  </form>
                </Form>
              )}
              {activeTab === "document-types" && (
                <Form {...documentTypeForm}>
                  <form onSubmit={documentTypeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField control={documentTypeForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Criar</Button>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="neu-card max-w-md">
              <DialogHeader><DialogTitle>Editar Registro</DialogTitle></DialogHeader>
              {activeTab === "partner-types" && (
                <Form {...partnerTypeForm}>
                  <form onSubmit={partnerTypeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField control={partnerTypeForm.control} name="typeName" render={({ field }) => (
                      <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={partnerTypeForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Salvar</Button>
                  </form>
                </Form>
              )}
              {activeTab === "address-types" && (
                <Form {...addressTypeForm}>
                  <form onSubmit={addressTypeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField control={addressTypeForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Salvar</Button>
                  </form>
                </Form>
              )}
              {activeTab === "document-types" && (
                <Form {...documentTypeForm}>
                  <form onSubmit={documentTypeForm.handleSubmit(handleSave)} className="space-y-4">
                    <FormField control={documentTypeForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="neu-input" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit">Salvar</Button>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
