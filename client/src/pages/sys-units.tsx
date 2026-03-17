// @ts-nocheck
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Building, Server, Home } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// SysUnit Schema
const sysUnitSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  connectionName: z.string().max(100).optional(),
  code: z.string().min(1, "Código é obrigatório").max(50),
});

type SysUnitFormData = z.infer<typeof sysUnitSchema>;

interface SysUnit {
  id: number;
  name: string;
  connectionName?: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SysUnitsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<SysUnit | null>(null);

  // Initialize form with default values
  const form = useForm<SysUnitFormData>({
    resolver: zodResolver(sysUnitSchema),
    defaultValues: {
      name: "",
      connectionName: "",
      code: "",
    },
  });

  // Query to fetch sys units
  const { data: sysUnits = [], isLoading, error } = useQuery<SysUnit[]>({
    queryKey: ['/api/sys-units'],
    enabled: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: SysUnitFormData) => apiRequest('/api/sys-units', {
      method: 'POST',
      body: data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sys-units'] });
      toast({
        title: "Sucesso",
        description: "Unidade do sistema criada com sucesso!",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.message || "Erro ao criar unidade do sistema",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SysUnitFormData }) => 
      apiRequest(`/api/sys-units/${id}`, {
        method: 'PUT',
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sys-units'] });
      toast({
        title: "Sucesso",
        description: "Unidade do sistema atualizada com sucesso!",
      });
      setIsDialogOpen(false);
      setEditingUnit(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.message || "Erro ao atualizar unidade do sistema",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/sys-units/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sys-units'] });
      toast({
        title: "Sucesso",
        description: "Unidade do sistema excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.message || "Erro ao excluir unidade do sistema",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: SysUnitFormData) => {
    if (editingUnit) {
      updateMutation.mutate({ id: editingUnit.sysUnitId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (unit: SysUnit) => {
    setEditingUnit(unit);
    form.reset({
      name: unit.name,
      connectionName: unit.connectionName || "",
      code: unit.code,
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Handle new unit
  const handleNew = () => {
    setEditingUnit(null);
    form.reset({
      name: "",
      connectionName: "",
      code: "",
    });
    setIsDialogOpen(true);
  };

  // Filter units based on search term
  const filteredUnits = sysUnits.filter((unit: SysUnit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.connectionName && unit.connectionName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Render form dialog
  const renderFormDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? "Editar Unidade do Sistema" : "Nova Unidade do Sistema"}
          </DialogTitle>
          <DialogDescription>
            {editingUnit ? "Altere as informações da unidade do sistema" : "Preencha as informações da nova unidade do sistema"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da unidade" 
                      className="neu-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Código da unidade" 
                      className="neu-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Conexão</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da conexão (opcional)" 
                      className="neu-input" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 neu-flat"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 neu-button"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#C3CFE2]">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">
              <div className="neu-card rounded-2xl p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Carregando unidades do sistema...</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#C3CFE2]">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">
              <div className="neu-card rounded-2xl p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-500">Erro ao carregar unidades do sistema</div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#C3CFE2]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          
          <main className="p-6">
            <Card className="neu-card rounded-2xl">
              <CardHeader className="border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="neu-flat rounded-xl p-3">
                      <Building className="h-6 w-6 text-[#344E41]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#344E41]">Unidades do Sistema</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Gerencie as unidades do sistema organizacional
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline" 
                    size="sm"
                    className="neu-flat gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Início
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, código ou conexão..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 neu-input"
                    />
                  </div>
                  <Button 
                    onClick={handleNew}
                    className="neu-button gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nova Unidade
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gray-200/50">
                        <TableHead className="font-semibold text-[#344E41] text-center w-20">ID</TableHead>
                        <TableHead className="font-semibold text-[#344E41]">Nome</TableHead>
                        <TableHead className="font-semibold text-[#344E41]">Código</TableHead>
                        <TableHead className="font-semibold text-[#344E41]">Nome da Conexão</TableHead>
                        <TableHead className="font-semibold text-[#344E41] text-center w-32">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUnits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            {searchTerm ? "Nenhuma unidade encontrada" : "Nenhuma unidade cadastrada"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUnits.map((unit: SysUnit) => (
                          <TableRow key={((unit as any).sysUnitId)} className="hover:bg-gray-50/50 border-gray-200/50">
                            <TableCell className="text-center font-medium">#{((unit as any).sysUnitId)}</TableCell>
                            <TableCell className="font-medium">{unit.name}</TableCell>
                            <TableCell>{unit.code}</TableCell>
                            <TableCell className="text-gray-600">{unit.connectionName || "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(unit)}
                                  className="neu-flat h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="neu-flat h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir a unidade "{unit.name}"? 
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(((unit as any).sysUnitId))}
                                        className="bg-red-600 hover:bg-red-700"
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
          </main>
        </div>
      </div>

      {renderFormDialog()}
    </div>
  );
}