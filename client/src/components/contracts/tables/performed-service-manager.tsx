import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const performedServiceSchema = z.object({
  sysUnitId: z.number().optional(),
  contractId: z.number().optional(),
  beneficiaryId: z.number().optional(),
  serviceTypeId: z.number().min(1, "Tipo de serviço é obrigatório"),
});

type PerformedServiceFormData = z.infer<typeof performedServiceSchema>;

interface PerformedService {
  id: number;
  sysUnitId?: number;
  contractId?: number;
  beneficiaryId?: number;
  serviceTypeId: number;
  createdAt: string;
  updatedAt: string;
}

export default function PerformedServiceManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<PerformedService | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<PerformedServiceFormData>({
    resolver: zodResolver(performedServiceSchema),
    defaultValues: {
      sysUnitId: undefined,
      contractId: undefined,
      beneficiaryId: undefined,
      serviceTypeId: 1,
    },
  });

  // Mock data for service types
  const mockServiceTypes = [
    { id: 1, name: "Assistência Funerária" },
    { id: 2, name: "Assistência Médica" },
    { id: 3, name: "Assistência Hospitalar" },
    { id: 4, name: "Assistência Familiar" }
  ];

  // Mock data for services
  const mockServices: PerformedService[] = [
    {
      id: 1,
      sysUnitId: 1,
      contractId: 1,
      beneficiaryId: 1,
      serviceTypeId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      sysUnitId: 1,
      contractId: 2,
      beneficiaryId: 2,
      serviceTypeId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleCreate = (data: PerformedServiceFormData) => {
    toast({
      title: "Sucesso",
      description: "Serviço executado criado com sucesso",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (service: PerformedService) => {
    setSelectedService(service);
    form.reset({
      sysUnitId: service.sysUnitId,
      contractId: service.contractId,
      beneficiaryId: service.beneficiaryId,
      serviceTypeId: service.serviceTypeId,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: PerformedServiceFormData) => {
    toast({
      title: "Sucesso",
      description: "Serviço executado atualizado com sucesso",
    });
    setIsEditDialogOpen(false);
    setSelectedService(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Sucesso",
      description: "Serviço executado excluído com sucesso",
    });
  };

  const getServiceTypeName = (typeId: number) => {
    const type = mockServiceTypes.find(t => t.id === typeId);
    return type?.name || "Desconhecido";
  };

  const filteredServices = mockServices.filter((service) => {
    return searchTerm === "" || 
      service.id.toString().includes(searchTerm) ||
      getServiceTypeName(service.serviceTypeId).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, onSubmit: (data: PerformedServiceFormData) => void) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure os dados do serviço executado
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="neu-input">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockServiceTypes.map((type) => (
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
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Contrato</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ID do contrato"
                      className="neu-input"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beneficiaryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Beneficiário</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ID do beneficiário"
                      className="neu-input"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
            placeholder="Buscar por ID ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input pl-10 w-64"
          />
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <Card className="neu-card rounded-2xl">
        <CardHeader>
          <CardTitle>Serviços Executados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="neu-flat rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-300">
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t("message.no_data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id} className="border-gray-200">
                      <TableCell className="font-medium">{service.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="neu-flat">
                          {getServiceTypeName(service.serviceTypeId)}
                        </Badge>
                      </TableCell>
                      <TableCell>{service.contractId || "-"}</TableCell>
                      <TableCell>{service.beneficiaryId || "-"}</TableCell>
                      <TableCell>
                        {new Date(service.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(service)}
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
                                  Tem certeza que deseja excluir este serviço executado? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(service.id)}
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
        "Criar Serviço Executado",
        handleCreate
      )}

      {renderFormDialog(
        isEditDialogOpen,
        (open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedService(null);
        },
        "Editar Serviço Executado",
        handleUpdate
      )}
    </div>
  );
}