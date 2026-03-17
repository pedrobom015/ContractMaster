// @ts-nocheck
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
import { Database, Building, MapPin, FileType, Network, Link2, Plus, Edit, Trash2, Search } from "lucide-react";
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
  type NewPartnerType,
  type NewDocumentType,
  type NewAddressType
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
  const partnerTypeForm = useForm<any>({
    resolver: zodResolver(insertPartnerTypeSchema),
    defaultValues: {  typeName: "", description: "", active: true },
  });

  const documentTypeForm = useForm<any>({
    resolver: zodResolver(insertDocumentTypeSchema),
    defaultValues: {  typeName: "", description: "", active: true },
  });

  const addressTypeForm = useForm<any>({
    resolver: zodResolver(insertAddressTypeSchema),
    defaultValues: { typeName: "", description: "", active: true },
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
    mutationFn: (data: NewPartnerType) =>
      apiRequest('POST', '/api/partner-types', data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<NewPartnerType> }) =>
      apiRequest('PUT', `/api/partner-types/${id}`, data),
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
      apiRequest('DELETE', `/api/partner-types/${id}`),
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
    mutationFn: (data: NewDocumentType) =>
      apiRequest('POST', '/api/document-types', data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<NewDocumentType> }) =>
      apiRequest('PUT', `/api/document-types/${id}`, data),
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
      apiRequest('DELETE', `/api/document-types/${id}`),
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
    mutationFn: (data: NewAddressType) =>
      apiRequest('POST', '/api/address-types', data),
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
    mutationFn: ({ id, data }: { id: number; data: Partial<NewAddressType> }) =>
      apiRequest('PUT', `/api/address-types/${id}`, data),
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
      apiRequest('DELETE', `/api/address-types/${id}`),
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
        updatePartnerTypeMutation.mutate({ id: (selectedEntity.partnerTypeId || selectedEntity.documentTypeId || selectedEntity.addressTypeId), data });
      } else {
        createPartnerTypeMutation.mutate(data);
      }
    } else if (activeTab === "document-types") {
      if (selectedEntity) {
        updateDocumentTypeMutation.mutate({ id: (selectedEntity.partnerTypeId || selectedEntity.documentTypeId || selectedEntity.addressTypeId), data });
      } else {
        createDocumentTypeMutation.mutate(data);
      }
    } else if (activeTab === "address-types") {
      if (selectedEntity) {
        updateAddressTypeMutation.mutate({ id: (selectedEntity.partnerTypeId || selectedEntity.documentTypeId || selectedEntity.addressTypeId), data });
      } else {
        createAddressTypeMutation.mutate(data);
      }
    }
  };

  const handleDelete = (id: number, type: string) => {
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
      case "partner-types": partnerTypeForm.reset(entity); break;
      case "document-types": documentTypeForm.reset(entity); break;
      case "address-types": addressTypeForm.reset(entity); break;
    }
  };

  // Filter functions
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

  const getFilteredData = (data: any[], searchFields: string[]) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const tabsConfig = [
    {
      id: "partner-types",
      label: t("section.partner_types"),
      description: "Gerencie os tipos de parceiros do sistema",
      icon: Building
    },
    {
      id: "address-types", 
      label: t("section.address_types"),
      description: "Configure os tipos de endereço disponíveis",
      icon: MapPin
    },
    {
      id: "document-types",
      label: t("section.document_types"),
      description: "Defina os tipos de documentos aceitos",
      icon: FileType
    },
    {
      id: "entity-addresses",
      label: t("section.entity_addresses"),
      description: "Gerencie vínculos entre entidades e endereços",
      icon: Network
    },
    {
      id: "entity-documents",
      label: t("section.entity_documents"),
      description: "Gerencie vínculos entre entidades e documentos",
      icon: Link2
    }
  ];

  const renderPartnerTypesTab = () => {
    const filteredData = getFilteredPartnerTypes();
    
    if (isLoadingPartnerTypes) {
      return (
        <Card className="neu-card">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando tipos de parceiros...</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
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
                <TableRow key={(item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{(item as any).typeName || (item as any).name}</TableCell>
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
                              Tem certeza que deseja excluir o tipo "{(item as any).name || (item as any).typeName || (item as any).description}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(((item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId), "Tipo de Parceiro")} className="neu-button neu-button-danger">
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
    
    if (isLoadingDocumentTypes) {
      return (
        <Card className="neu-card">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando tipos de documentos...</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
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
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Obrigatório</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={(item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell>{item.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Não</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Ativo</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="neu-button neu-button-secondary">
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
                              Tem certeza que deseja excluir o tipo "{(item as any).name || (item as any).typeName || (item as any).description}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(((item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId), "Tipo de Documento")} className="neu-button neu-button-danger">
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
    
    if (isLoadingAddressTypes) {
      return (
        <Card className="neu-card">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando tipos de endereço...</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
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
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={(item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{(item as any).typeName || (item as any).name}</TableCell>
                  <TableCell>{((item as any).description || "Sem descrição")}</TableCell>
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
                        onClick={() => handleEdit(item, "address-types")}
                        className="neu-button neu-button-secondary"
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
                              Tem certeza que deseja excluir o tipo "{(item as any).typeName || (item as any).name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(((item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId), "Tipo de Endereço")} className="neu-button neu-button-danger">
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
    const filteredData: any[] = [];
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Vínculos de Endereço
            </CardTitle>
            <Button className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Vínculo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Entidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tipo de Endereço</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={(item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{item.entityName}</TableCell>
                  <TableCell>{item.entityType}</TableCell>
                  <TableCell>{item.addressType}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="neu-button neu-button-secondary">
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
                              Tem certeza que deseja excluir este vínculo?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(((item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId), "Vínculo de Endereço")} className="neu-button neu-button-danger">
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

  const renderEntityDocumentsTab = () => {
    const filteredData: any[] = [];
    
    return (
      <Card className="neu-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Vínculos de Documento
            </CardTitle>
            <Button className="neu-button neu-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Vínculo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Entidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tipo de Documento</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={(item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{item.entityName}</TableCell>
                  <TableCell>{item.entityType}</TableCell>
                  <TableCell>{item.documentType}</TableCell>
                  <TableCell>{item.fileName}</TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="neu-button neu-button-secondary">
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
                              Tem certeza que deseja excluir este vínculo?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neu-button neu-button-secondary">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(((item as any).partnerTypeId || (item as any).documentTypeId || (item as any).addressTypeId), "Vínculo de Documento")} className="neu-button neu-button-danger">
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
                  Tabelas Auxiliares
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie as tabelas de apoio e configuração do sistema
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar registros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neu-flat pl-10 w-64"
                  />
                </div>
                <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                  Configuração
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="neu-card rounded-3xl">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Tabelas Auxiliares</span>
                <Badge variant="outline" className="neu-flat">
                  {tabsConfig.length} tabelas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 neu-flat rounded-xl p-1">
                  {tabsConfig.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="neu-button data-[state=active]:neu-pressed rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <tab.icon className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="partner-types">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Building className="text-2xl" />
                          <span>Tipos de Parceiros</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie os tipos de parceiros do sistema</p>
                      </div>
                    </div>
                  </div>
                  {renderPartnerTypesTab()}
                </TabsContent>

                <TabsContent value="address-types">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <MapPin className="text-2xl" />
                          <span>Tipos de Endereço</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Configure os tipos de endereço disponíveis</p>
                      </div>
                    </div>
                  </div>
                  {renderAddressTypesTab()}
                </TabsContent>

                <TabsContent value="document-types">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <FileType className="text-2xl" />
                          <span>Tipos de Documento</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Defina os tipos de documentos aceitos</p>
                      </div>
                    </div>
                  </div>
                  {renderDocumentTypesTab()}
                </TabsContent>

                <TabsContent value="entity-addresses">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Network className="text-2xl" />
                          <span>Vínculos de Endereço</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie vínculos entre entidades e endereços</p>
                      </div>
                    </div>
                  </div>
                  {renderEntityAddressesTab()}
                </TabsContent>

                <TabsContent value="entity-documents">
                  <div className="neu-flat rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center space-x-3">
                          <Link2 className="text-2xl" />
                          <span>Vínculos de Documento</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">Gerencie vínculos entre entidades e documentos</p>
                      </div>
                    </div>
                  </div>
                  {renderEntityDocumentsTab()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="neu-card max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Registro</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar um novo registro
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeTab === "partner-types" && (
                  <Form {...(partnerTypeForm as any)}>
                    <form onSubmit={partnerTypeForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={partnerTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={partnerTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "address-types" && (
                  <Form {...(addressTypeForm as any)}>
                    <form onSubmit={addressTypeForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={addressTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "document-types" && (
                  <Form {...(documentTypeForm as any)}>
                    <form onSubmit={documentTypeForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={documentTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={documentTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="neu-card max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Registro</DialogTitle>
                <DialogDescription>
                  Modifique os campos abaixo para atualizar o registro
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeTab === "partner-types" && (
                  <Form {...(partnerTypeForm as any)}>
                    <form onSubmit={partnerTypeForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={partnerTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={partnerTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "address-types" && (
                  <Form {...(addressTypeForm as any)}>
                    <form onSubmit={addressTypeForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={addressTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
                {activeTab === "document-types" && (
                  <Form {...(documentTypeForm as any)}>
                    <form onSubmit={documentTypeForm.handleSubmit(handleSave)} className="space-y-4">
                      <FormField
                        control={documentTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={documentTypeForm.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Input {...field} className="neu-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="neu-button neu-button-secondary">
                          Cancelar
                        </Button>
                        <Button type="submit" className="neu-button neu-button-primary">
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}