import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Building, Phone, Mail, Globe, Users, MapPin, CreditCard, Truck, FileText, Upload, Eye, Download } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Partner Schema
const partnerSchema = z.object({
  partnerCode: z.string().min(1, "Código do parceiro é obrigatório").max(30),
  partnerName: z.string().min(1, "Nome do parceiro é obrigatório").max(100),
  legalName: z.string().max(150).optional(),
  taxId: z.string().max(30).optional(),
  partnerTypeId: z.number().min(1, "Tipo de parceiro é obrigatório"),
  isCustomer: z.boolean(),
  isVendor: z.boolean(),
  isCollector: z.boolean(),
  isEmployee: z.boolean(),
  isAccredited: z.boolean(),
  phone: z.string().max(30).optional(),
  email: z.string().email("Email inválido").max(100).optional(),
  website: z.string().max(100).optional(),
  primaryPartnerPerson: z.string().max(100).optional(),
  notes: z.string().optional(),
  active: z.boolean(),
});

// Address Schema for billing and shipping
const addressSchema = z.object({
  street: z.string().min(1, "Logradouro é obrigatório").max(255),
  number: z.string().min(1, "Número é obrigatório").max(20),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório").max(100),
  city: z.string().min(1, "Cidade é obrigatória").max(100),
  state: z.string().min(2, "Estado deve ter 2 caracteres").max(2),
  zipCode: z.string().min(1, "CEP é obrigatório").max(10),
  country: z.string().default("Brasil"),
  active: z.boolean(),
});

// Document Schema for partner documents
const documentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255),
  documentTypeId: z.number().min(1, "Tipo de documento é obrigatório"),
  fileName: z.string().min(1, "Nome do arquivo é obrigatório"),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.string().default("ativo"),
});

type PartnerFormData = z.infer<typeof partnerSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type DocumentFormData = z.infer<typeof documentSchema>;

interface Partner {
  id: number;
  partnerCode: string;
  partnerName: string;
  legalName?: string;
  taxId?: string;
  partnerTypeId: number;
  isCustomer: boolean;
  isVendor: boolean;
  isCollector: boolean;
  isEmployee: boolean;
  isAccredited: boolean;
  phone?: string;
  email?: string;
  website?: string;
  primaryPartnerPerson?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Address relationships
  billingAddress?: Address;
  shippingAddress?: Address;
}

interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressType {
  id: number;
  typeName: string;
  description?: string;
  active: boolean;
}

interface DocumentType {
  id: number;
  name: string;
  description?: string;
  active: boolean;
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
  status: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy?: number;
  uploadedByUser?: { name: string };
  createdAt: string;
  updatedAt: string;
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

export default function PartnersPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Address management states
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressType, setAddressType] = useState<'billing' | 'shipping'>('billing');
  const [selectedPartnerForAddress, setSelectedPartnerForAddress] = useState<Partner | null>(null);
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);

  // Document management states
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [selectedPartnerForDocument, setSelectedPartnerForDocument] = useState<Partner | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditingDocument, setIsEditingDocument] = useState(false);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      partnerCode: "",
      partnerName: "",
      legalName: "",
      taxId: "",
      partnerTypeId: 1,
      isCustomer: false,
      isVendor: false,
      isCollector: false,
      isEmployee: false,
      isAccredited: false,
      phone: "",
      email: "",
      website: "",
      primaryPartnerPerson: "",
      notes: "",
      active: true,
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Brasil",
      active: true,
    },
  });

  const documentForm = useForm<DocumentFormData>({
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

  // Mock data for partner types
  const mockPartnerTypes = [
    { id: 1, name: "Funerária" },
    { id: 2, name: "Plano de Saúde" },
    { id: 3, name: "Seguradora" },
    { id: 4, name: "Prestador de Serviços" },
    { id: 5, name: "Fornecedor" }
  ];

  // Mock data for document types
  const mockDocumentTypes: DocumentType[] = [
    { id: 1, name: "CNPJ", description: "Cadastro Nacional de Pessoa Jurídica", active: true },
    { id: 2, name: "Inscrição Estadual", description: "Documento de inscrição estadual", active: true },
    { id: 3, name: "Contrato Social", description: "Contrato social da empresa", active: true },
    { id: 4, name: "Alvará de Funcionamento", description: "Licença para funcionamento", active: true },
    { id: 5, name: "Certificado Digital", description: "Certificado digital da empresa", active: true },
    { id: 6, name: "Comprovante de Endereço", description: "Comprovante de endereço da empresa", active: true },
  ];

  // Sample addresses for demonstration
  const sampleAddresses: Address[] = [
    {
      id: 1,
      street: "Rua das Flores",
      number: "123",
      complement: "Sala 101",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      street: "Avenida Paulista",
      number: "1000",
      complement: "",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      country: "Brasil",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      street: "Rua Augusta",
      number: "500",
      complement: "Andar 5",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
      country: "Brasil",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Sample documents for demonstration
  const sampleDocuments: Document[] = [
    {
      id: 1,
      title: "CNPJ Funerária Silva",
      documentTypeId: 1,
      documentType: mockDocumentTypes[0],
      fileName: "cnpj_funeraria_silva.pdf",
      filePath: "/uploads/documents/cnpj_funeraria_silva.pdf",
      description: "Cadastro Nacional de Pessoa Jurídica da Funerária Silva",
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
      title: "Contrato Social Saúde Total",
      documentTypeId: 3,
      documentType: mockDocumentTypes[2],
      fileName: "contrato_social_saude_total.pdf",
      filePath: "/uploads/documents/contrato_social_saude_total.pdf",
      description: "Contrato social da empresa Saúde Total",
      version: "2.1",
      status: "ativo",
      fileSize: 2048000,
      mimeType: "application/pdf",
      uploadedBy: 1,
      uploadedByUser: { name: "Admin" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Sample entity documents (linking partners to documents)
  const sampleEntityDocuments: EntityDocument[] = [
    {
      id: 1,
      entityType: "partner",
      entityId: 1,
      documentId: 1,
      document: sampleDocuments[0],
      relationship: "obrigatório",
      notes: "Documento principal da empresa",
      attachedBy: 1,
      attachedAt: new Date().toISOString(),
    },
    {
      id: 2,
      entityType: "partner",
      entityId: 2,
      documentId: 2,
      document: sampleDocuments[1],
      relationship: "obrigatório",
      notes: "Contrato social atualizado",
      attachedBy: 1,
      attachedAt: new Date().toISOString(),
    },
  ];

  // Mock data for partners
  const mockPartners: Partner[] = [
    {
      id: 1,
      partnerCode: "PARC001",
      partnerName: "Funerária Silva",
      legalName: "Silva Serviços Funerários Ltda",
      taxId: "12.345.678/0001-99",
      partnerTypeId: 1,
      isCustomer: false,
      isVendor: true,
      isCollector: false,
      isEmployee: false,
      isAccredited: true,
      phone: "(11) 98765-4321",
      email: "contato@funerariasilva.com.br",
      website: "www.funerariasilva.com.br",
      primaryPartnerPerson: "João Silva",
      notes: "Parceiro credenciado desde 2020",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      billingAddress: sampleAddresses[0],
      shippingAddress: sampleAddresses[1],
    },
    {
      id: 2,
      partnerCode: "PARC002",
      partnerName: "Saúde Total",
      legalName: "Saúde Total Planos de Saúde S.A.",
      taxId: "98.765.432/0001-11",
      partnerTypeId: 2,
      isCustomer: true,
      isVendor: false,
      isCollector: false,
      isEmployee: false,
      isAccredited: true,
      phone: "(11) 3456-7890",
      email: "contato@saudetotal.com.br",
      website: "www.saudetotal.com.br",
      primaryPartnerPerson: "Maria Santos",
      notes: "Plano de saúde parceiro",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      billingAddress: sampleAddresses[2],
    }
  ];

  const handleCreatePartner = (data: PartnerFormData) => {
    toast({
      title: "Sucesso",
      description: "Parceiro criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    form.reset({
      partnerCode: partner.partnerCode,
      partnerName: partner.partnerName,
      legalName: partner.legalName || "",
      taxId: partner.taxId || "",
      partnerTypeId: partner.partnerTypeId,
      isCustomer: partner.isCustomer,
      isVendor: partner.isVendor,
      isCollector: partner.isCollector,
      isEmployee: partner.isEmployee,
      isAccredited: partner.isAccredited,
      phone: partner.phone || "",
      email: partner.email || "",
      website: partner.website || "",
      primaryPartnerPerson: partner.primaryPartnerPerson || "",
      notes: partner.notes || "",
      active: partner.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePartner = (data: PartnerFormData) => {
    toast({
      title: "Sucesso",
      description: "Parceiro atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedPartner(null);
    form.reset();
  };

  const handleDeletePartner = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Parceiro excluído com sucesso",
    });
  };

  // Address management handlers
  const handleOpenAddressDialog = (partner: Partner, type: 'billing' | 'shipping') => {
    setSelectedPartnerForAddress(partner);
    setAddressType(type);
    
    // Pre-fill form if address exists
    const existingAddress = type === 'billing' ? partner.billingAddress : partner.shippingAddress;
    if (existingAddress) {
      addressForm.reset({
        street: existingAddress.street,
        number: existingAddress.number,
        complement: existingAddress.complement || "",
        neighborhood: existingAddress.neighborhood,
        city: existingAddress.city,
        state: existingAddress.state,
        zipCode: existingAddress.zipCode,
        country: existingAddress.country,
        active: existingAddress.active,
      });
    } else {
      addressForm.reset({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Brasil",
        active: true,
      });
    }
    
    setIsAddressDialogOpen(true);
  };

  const handleSaveAddress = (data: AddressFormData) => {
    const addressTypeLabel = addressType === 'billing' ? 'cobrança' : 'entrega';
    toast({
      title: "Sucesso",
      description: `Endereço de ${addressTypeLabel} salvo com sucesso`,
    });
    setIsAddressDialogOpen(false);
    setSelectedPartnerForAddress(null);
    addressForm.reset();
  };

  const handleRemoveAddress = (partner: Partner, type: 'billing' | 'shipping') => {
    const addressTypeLabel = type === 'billing' ? 'cobrança' : 'entrega';
    toast({
      title: "Sucesso",
      description: `Endereço de ${addressTypeLabel} removido com sucesso`,
    });
  };

  // Document management handlers
  const handleCreateDocument = (partner: Partner) => {
    setSelectedPartnerForDocument(partner);
    setSelectedDocument(null);
    setIsEditingDocument(false);
    documentForm.reset();
    setIsDocumentDialogOpen(true);
  };

  const handleEditDocument = (document: Document, partner: Partner) => {
    setSelectedPartnerForDocument(partner);
    setSelectedDocument(document);
    setIsEditingDocument(true);
    documentForm.reset({
      title: document.title,
      documentTypeId: document.documentTypeId,
      fileName: document.fileName,
      description: document.description || "",
      version: document.version || "",
      status: document.status,
    });
    setIsDocumentDialogOpen(true);
  };

  const handleSaveDocument = (data: DocumentFormData) => {
    if (isEditingDocument) {
      toast({
        title: "Sucesso",
        description: "Documento atualizado com sucesso",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Documento criado e vinculado ao parceiro com sucesso",
      });
    }
    setIsDocumentDialogOpen(false);
    setSelectedPartnerForDocument(null);
    setSelectedDocument(null);
    setIsEditingDocument(false);
    documentForm.reset();
  };

  const handleDeleteDocument = (documentId: number) => {
    toast({
      title: "Sucesso",
      description: "Documento excluído com sucesso",
    });
  };

  // Get documents for a specific partner
  const getPartnerDocuments = (partnerId: number): EntityDocument[] => {
    return sampleEntityDocuments.filter(ed => ed.entityType === "partner" && ed.entityId === partnerId);
  };

  const formatAddress = (address: Address) => {
    const complement = address.complement ? `, ${address.complement}` : "";
    return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city}/${address.state}`;
  };

  const getPartnerTypeBadge = (typeId: number) => {
    const type = mockPartnerTypes.find(t => t.id === typeId);
    return <Badge variant="outline" className="neu-flat">{type?.name || "Desconhecido"}</Badge>;
  };

  const getPartnerRolesBadges = (partner: Partner) => {
    const roles = [];
    if (partner.isCustomer) roles.push("Cliente");
    if (partner.isVendor) roles.push("Fornecedor");
    if (partner.isCollector) roles.push("Cobrador");
    if (partner.isEmployee) roles.push("Funcionário");
    if (partner.isAccredited) roles.push("Credenciado");
    
    return roles.map((role, index) => (
      <Badge key={index} variant="secondary" className="neu-flat mr-1 mb-1">
        {role}
      </Badge>
    ));
  };

  const filteredPartners = mockPartners.filter((partner) => {
    return searchTerm === "" || 
      partner.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.legalName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: PartnerFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os dados do parceiro
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="partnerCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código *</FormLabel>
                        <FormControl>
                          <Input placeholder="PARC001" className="neu-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partnerTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger className="neu-input">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockPartnerTypes.map((type) => (
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
                </div>

                <FormField
                  control={form.control}
                  name="partnerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Parceiro *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do parceiro" className="neu-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Razão social completa" className="neu-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ/CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000/0000-00" className="neu-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" className="neu-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="contato@empresa.com" type="email" className="neu-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="www.empresa.com" className="neu-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryPartnerPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pessoa de Contato Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" className="neu-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="neu-flat rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Tipos de Relacionamento</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="isCustomer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="neu-flat"
                            />
                          </FormControl>
                          <FormLabel>Cliente</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isVendor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="neu-flat"
                            />
                          </FormControl>
                          <FormLabel>Fornecedor</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isCollector"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="neu-flat"
                            />
                          </FormControl>
                          <FormLabel>Cobrador</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isEmployee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="neu-flat"
                            />
                          </FormControl>
                          <FormLabel>Funcionário</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isAccredited"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="neu-flat"
                            />
                          </FormControl>
                          <FormLabel>Credenciado</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Informações adicionais sobre o parceiro..."
                          className="neu-input"
                          rows={4}
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
                      <FormLabel>Parceiro Ativo</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
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

  // Document Form Dialog Component
  const renderDocumentDialog = () => (
    <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
      <DialogContent className="neu-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditingDocument ? 'Editar Documento' : 'Novo Documento'}
          </DialogTitle>
          <DialogDescription>
            {isEditingDocument 
              ? `Edite os dados do documento para ${selectedPartnerForDocument?.partnerName}`
              : `Adicione um novo documento para ${selectedPartnerForDocument?.partnerName}`
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...documentForm}>
          <form onSubmit={documentForm.handleSubmit(handleSaveDocument)} className="space-y-4">
            <FormField
              control={documentForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Documento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: CNPJ da Empresa" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={documentForm.control}
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
                      {mockDocumentTypes.map((type) => (
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
              control={documentForm.control}
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
                control={documentForm.control}
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
                control={documentForm.control}
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
              control={documentForm.control}
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDocumentDialogOpen(false)}
                className="neu-button"
              >
                Cancelar
              </Button>
              <Button type="submit" className="neu-button">
                {isEditingDocument ? 'Atualizar' : 'Criar'} Documento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  // Address Form Dialog Component
  const renderAddressDialog = () => (
    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
      <DialogContent className="neu-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {addressType === 'billing' ? <CreditCard className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
            {addressType === 'billing' ? 'Endereço de Cobrança' : 'Endereço de Entrega'}
          </DialogTitle>
          <DialogDescription>
            Configure o endereço de {addressType === 'billing' ? 'cobrança' : 'entrega'} do parceiro {selectedPartnerForAddress?.partnerName}
          </DialogDescription>
        </DialogHeader>
        <Form {...addressForm}>
          <form onSubmit={addressForm.handleSubmit(handleSaveAddress)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={addressForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Logradouro *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rua das Flores" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número *</FormLabel>
                    <FormControl>
                      <Input placeholder="123" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Apto, Bloco, etc." className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro *</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade *</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" maxLength={2} className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP *</FormLabel>
                    <FormControl>
                      <Input placeholder="12345-678" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addressForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Brasil" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={addressForm.control}
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
                  <FormLabel>Endereço Ativo</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddressDialogOpen(false)}
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
                  Gerenciamento de Parceiros
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie parceiros, fornecedores e prestadores de serviços
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredPartners.length} parceiros
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nome ou razão social..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10 w-96"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Novo Parceiro
            </Button>
          </div>

          {/* Partners Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Parceiros</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredPartners.length} encontrados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="neu-flat rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300">
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Relacionamentos</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {t("message.no_data")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {filteredPartners.map((partner) => (
                          <React.Fragment key={partner.id}>
                            <TableRow className="border-gray-200">
                              <TableCell className="font-medium">{partner.partnerCode}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{partner.partnerName}</div>
                                  {partner.legalName && (
                                    <div className="text-sm text-gray-500">{partner.legalName}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{getPartnerTypeBadge(partner.partnerTypeId)}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap">
                                  {getPartnerRolesBadges(partner)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {partner.phone && (
                                    <div className="flex items-center text-sm">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {partner.phone}
                                    </div>
                                  )}
                                  {partner.email && (
                                    <div className="flex items-center text-sm">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {partner.email}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={partner.active ? "default" : "destructive"} className="neu-flat">
                                  {partner.active ? "Ativo" : "Inativo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                                    className="neu-button h-8 w-8 p-0"
                                    title="Gerenciar Endereços"
                                  >
                                    <MapPin className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditPartner(partner)}
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
                                          Tem certeza que deseja excluir o parceiro "{partner.partnerName}"? Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeletePartner(partner.id)}
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

                            {/* Expandable Address Management Row */}
                            {expandedPartner === partner.id && (
                              <TableRow className="border-gray-100">
                                <TableCell colSpan={7} className="bg-gray-50 p-6">
                                  <div className="neu-flat rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                      <MapPin className="h-5 w-5 text-gray-600" />
                                      <h4 className="text-lg font-semibold">Gerenciamento de Endereços - {partner.partnerName}</h4>
                                    </div>
                                    
                                    <Tabs defaultValue="billing" className="w-full">
                                      <TabsList className="grid w-full grid-cols-3 neu-flat">
                                        <TabsTrigger value="billing" className="neu-button data-[state=active]:neu-pressed">
                                          <CreditCard className="h-4 w-4 mr-2" />
                                          Endereço de Cobrança
                                        </TabsTrigger>
                                        <TabsTrigger value="shipping" className="neu-button data-[state=active]:neu-pressed">
                                          <Truck className="h-4 w-4 mr-2" />
                                          Endereço de Entrega
                                        </TabsTrigger>
                                        <TabsTrigger value="documents" className="neu-button data-[state=active]:neu-pressed">
                                          <FileText className="h-4 w-4 mr-2" />
                                          Documentos
                                        </TabsTrigger>
                                      </TabsList>

                                      <TabsContent value="billing" className="mt-4">
                                        <Card className="neu-card">
                                          <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                              <span className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                Endereço de Cobrança
                                              </span>
                                              <Button
                                                size="sm"
                                                onClick={() => handleOpenAddressDialog(partner, 'billing')}
                                                className="neu-button"
                                              >
                                                {partner.billingAddress ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                                {partner.billingAddress ? 'Editar' : 'Adicionar'}
                                              </Button>
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            {partner.billingAddress ? (
                                              <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                  <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                                                  <div>
                                                    <div className="font-medium">{formatAddress(partner.billingAddress)}</div>
                                                    <div className="text-sm text-gray-500">CEP: {partner.billingAddress.zipCode}</div>
                                                  </div>
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRemoveAddress(partner, 'billing')}
                                                    className="neu-button text-red-600 hover:text-red-700"
                                                  >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remover
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="text-center py-8 text-gray-500">
                                                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                <p>Nenhum endereço de cobrança cadastrado</p>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </TabsContent>

                                      <TabsContent value="shipping" className="mt-4">
                                        <Card className="neu-card">
                                          <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                              <span className="flex items-center gap-2">
                                                <Truck className="h-5 w-5" />
                                                Endereço de Entrega
                                              </span>
                                              <Button
                                                size="sm"
                                                onClick={() => handleOpenAddressDialog(partner, 'shipping')}
                                                className="neu-button"
                                              >
                                                {partner.shippingAddress ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                                {partner.shippingAddress ? 'Editar' : 'Adicionar'}
                                              </Button>
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            {partner.shippingAddress ? (
                                              <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                  <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                                                  <div>
                                                    <div className="font-medium">{formatAddress(partner.shippingAddress)}</div>
                                                    <div className="text-sm text-gray-500">CEP: {partner.shippingAddress.zipCode}</div>
                                                  </div>
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRemoveAddress(partner, 'shipping')}
                                                    className="neu-button text-red-600 hover:text-red-700"
                                                  >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remover
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="text-center py-8 text-gray-500">
                                                <Truck className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                <p>Nenhum endereço de entrega cadastrado</p>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </TabsContent>

                                      <TabsContent value="documents" className="mt-4">
                                        <Card className="neu-card">
                                          <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                              <span className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Documentos do Parceiro
                                              </span>
                                              <Button
                                                size="sm"
                                                onClick={() => handleCreateDocument(partner)}
                                                className="neu-button"
                                              >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Adicionar Documento
                                              </Button>
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            {getPartnerDocuments(partner.id).length > 0 ? (
                                              <div className="space-y-4">
                                                {getPartnerDocuments(partner.id).map((entityDoc) => (
                                                  <div key={entityDoc.id} className="p-4 border border-gray-200 rounded-lg neu-flat">
                                                    <div className="flex items-start justify-between">
                                                      <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                          <FileText className="h-4 w-4 text-gray-500" />
                                                          <h5 className="font-medium">{entityDoc.document.title}</h5>
                                                          <Badge variant="outline" className="neu-flat text-xs">
                                                            {entityDoc.document.documentType.name}
                                                          </Badge>
                                                        </div>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                          <div>Arquivo: {entityDoc.document.fileName}</div>
                                                          {entityDoc.document.version && (
                                                            <div>Versão: {entityDoc.document.version}</div>
                                                          )}
                                                          {entityDoc.relationship && (
                                                            <div>Relacionamento: {entityDoc.relationship}</div>
                                                          )}
                                                          {entityDoc.notes && (
                                                            <div>Observações: {entityDoc.notes}</div>
                                                          )}
                                                          <div>Anexado em: {new Date(entityDoc.attachedAt).toLocaleDateString('pt-BR')}</div>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          className="neu-button h-8 w-8 p-0"
                                                          title="Visualizar"
                                                        >
                                                          <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          className="neu-button h-8 w-8 p-0"
                                                          title="Download"
                                                        >
                                                          <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                          size="sm"
                                                          variant="outline"
                                                          onClick={() => handleEditDocument(entityDoc.document, partner)}
                                                          className="neu-button h-8 w-8 p-0"
                                                          title="Editar"
                                                        >
                                                          <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                          <AlertDialogTrigger asChild>
                                                            <Button
                                                              size="sm"
                                                              variant="outline"
                                                              className="neu-button h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                              title="Excluir"
                                                            >
                                                              <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                          </AlertDialogTrigger>
                                                          <AlertDialogContent className="neu-card">
                                                            <AlertDialogHeader>
                                                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                              <AlertDialogDescription>
                                                                Tem certeza que deseja excluir o documento "{entityDoc.document.title}"?
                                                                Esta ação não pode ser desfeita.
                                                              </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                              <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                                              <AlertDialogAction
                                                                onClick={() => handleDeleteDocument(entityDoc.document.id)}
                                                                className="neu-button bg-red-600 hover:bg-red-700"
                                                              >
                                                                Excluir
                                                              </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                          </AlertDialogContent>
                                                        </AlertDialog>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <div className="text-center py-8 text-gray-500">
                                                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                <p>Nenhum documento cadastrado</p>
                                                <p className="text-sm mt-1">Clique em "Adicionar Documento" para começar</p>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </TabsContent>
                                    </Tabs>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {renderFormDialog(
            isCreateDialogOpen,
            setIsCreateDialogOpen,
            "Criar Novo Parceiro",
            handleCreatePartner
          )}

          {renderFormDialog(
            isEditDialogOpen,
            (open) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedPartner(null);
            },
            "Editar Parceiro",
            handleUpdatePartner
          )}

          {/* Address Management Dialog */}
          {renderAddressDialog()}

          {/* Document Management Dialog */}
          {renderDocumentDialog()}
        </main>
      </div>
    </div>
  );
}