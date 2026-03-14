import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Link2 } from "lucide-react";

const entityAddressSchema = z.object({
  entityType: z.string().min(1, "Tipo de entidade é obrigatório"),
  entityId: z.number().min(1, "ID da entidade é obrigatório"),
  addressId: z.number().min(1, "Endereço é obrigatório"),
  addressTypeId: z.number().min(1, "Tipo de endereço é obrigatório"),
  isPrimary: z.boolean(),
  active: z.boolean(),
});

type EntityAddressFormData = z.infer<typeof entityAddressSchema>;

interface EntityAddress {
  id: number;
  entityType: string;
  entityId: number;
  addressId: number;
  addressTypeId: number;
  isPrimary: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Join data for display
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  addressType?: {
    typeName: string;
  };
}

export default function EntityAddressManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEntityAddress, setSelectedEntityAddress] = useState<EntityAddress | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<EntityAddressFormData>({
    resolver: zodResolver(entityAddressSchema),
    defaultValues: {
      entityType: "",
      entityId: 0,
      addressId: 0,
      addressTypeId: 0,
      isPrimary: false,
      active: true,
    },
  });

  // Mock data for entity types
  const entityTypes = [
    { id: "partner", name: "Parceiro" },
    { id: "contract", name: "Contrato" },
    { id: "user", name: "Usuário" },
    { id: "service", name: "Serviço" },
    { id: "client", name: "Cliente" }
  ];

  // Mock data for address types
  const addressTypes = [
    { id: 1, typeName: "Residencial" },
    { id: 2, typeName: "Comercial" },
    { id: 3, typeName: "Cobrança" },
    { id: 4, typeName: "Entrega" }
  ];

  // Mock data for addresses
  const addresses = [
    { id: 1, street: "Rua das Flores", number: "123", neighborhood: "Centro", city: "São Paulo", state: "SP" },
    { id: 2, street: "Avenida Paulista", number: "1000", neighborhood: "Bela Vista", city: "São Paulo", state: "SP" }
  ];

  // Sample entity addresses with relationships
  const entityAddresses: EntityAddress[] = [
    {
      id: 1,
      entityType: "partner",
      entityId: 1,
      addressId: 1,
      addressTypeId: 1,
      isPrimary: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      address: addresses[0],
      addressType: addressTypes[0],
    },
    {
      id: 2,
      entityType: "partner",
      entityId: 1,
      addressId: 2,
      addressTypeId: 3,
      isPrimary: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      address: addresses[1],
      addressType: addressTypes[2],
    }
  ];

  const handleCreate = (data: EntityAddressFormData) => {
    toast({
      title: "Sucesso",
      description: "Vínculo de endereço criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (entityAddress: EntityAddress) => {
    setSelectedEntityAddress(entityAddress);
    form.reset({
      entityType: entityAddress.entityType,
      entityId: entityAddress.entityId,
      addressId: entityAddress.addressId,
      addressTypeId: entityAddress.addressTypeId,
      isPrimary: entityAddress.isPrimary,
      active: entityAddress.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: EntityAddressFormData) => {
    toast({
      title: "Sucesso",
      description: "Vínculo de endereço atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedEntityAddress(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Vínculo de endereço excluído com sucesso",
    });
  };

  const getEntityTypeName = (type: string) => {
    const entityType = entityTypes.find(et => et.id === type);
    return entityType?.name || type;
  };

  const formatAddress = (address: any) => {
    if (!address) return "Endereço não encontrado";
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
  };

  const filteredEntityAddresses = entityAddresses.filter((entityAddress) => {
    return searchTerm === "" || 
      entityAddress.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entityAddress.entityId.toString().includes(searchTerm) ||
      (entityAddress.address && formatAddress(entityAddress.address).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: EntityAddressFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure o vínculo entre entidade e endereço
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entidade *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
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
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Entidade *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="neu-input"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o endereço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id.toString()}>
                          {formatAddress(address)}
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
              name="addressTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Endereço *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {addressTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.typeName}
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
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="neu-flat"
                    />
                  </FormControl>
                  <FormLabel>Endereço Principal</FormLabel>
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
                  <FormLabel>Vínculo Ativo</FormLabel>
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
            placeholder="Buscar por entidade, ID ou endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input pl-10 w-80"
          />
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
          <Plus className="h-4 w-4 mr-2" />
          Novo Vínculo
        </Button>
      </div>

      <Card className="neu-card rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Vínculos Entidade-Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="neu-flat rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead>Entidade</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntityAddresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t("message.no_data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntityAddresses.map((entityAddress) => (
                    <TableRow key={entityAddress.id} className="border-gray-200">
                      <TableCell>
                        <Badge variant="outline" className="neu-flat">
                          {getEntityTypeName(entityAddress.entityType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{entityAddress.entityId}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {formatAddress(entityAddress.address)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="neu-flat">
                          {entityAddress.addressType?.typeName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entityAddress.isPrimary ? (
                          <Badge variant="default" className="neu-flat">Principal</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entityAddress.active ? "default" : "destructive"} className="neu-flat">
                          {entityAddress.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(entityAddress)}
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
                                  Tem certeza que deseja excluir este vínculo? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(entityAddress.id)}
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
        "Criar Vínculo Entidade-Endereço",
        handleCreate
      )}

      {renderFormDialog(
        isEditDialogOpen,
        (open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedEntityAddress(null);
        },
        "Editar Vínculo Entidade-Endereço",
        handleUpdate
      )}
    </div>
  );
}