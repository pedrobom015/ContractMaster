import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Project Schema
const projectSchema = z.object({
  projectCode: z.string().min(1, "Código do projeto é obrigatório").max(30),
  projectName: z.string().min(1, "Nome do projeto é obrigatório").max(100),
  description: z.string().optional(),
  managerName: z.string().max(100).optional(),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().default("PLANNED"),
  active: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Project {
  projectId: number;
  companyId: number;
  costCenterId?: number;
  departmentId?: number;
  projectCode: string;
  projectName: string;
  description?: string;
  managerName?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  status: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "PLANNED", label: "Planejado", color: "bg-gray-500" },
  { value: "ACTIVE", label: "Ativo", color: "bg-green-500" },
  { value: "ON_HOLD", label: "Em Espera", color: "bg-yellow-500" },
  { value: "COMPLETED", label: "Concluído", color: "bg-blue-500" },
  { value: "CANCELLED", label: "Cancelado", color: "bg-red-500" }
];

export default function ProjectsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/financial/projects'],
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectCode: "",
      projectName: "",
      description: "",
      managerName: "",
      budget: "",
      startDate: "",
      endDate: "",
      status: "PLANNED",
      active: true,
    },
  });

  const filteredProjects = projects.filter((project: Project) =>
    project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      apiRequest("/api/financial/projects", {
        method: "POST",
        body: JSON.stringify({ ...data, companyId: 1 }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/projects"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({ title: "Sucesso", description: "Projeto criado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao criar projeto", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormData & { id: number }) =>
      apiRequest(`/api/financial/projects/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/projects"] });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      form.reset();
      toast({ title: "Sucesso", description: "Projeto atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao atualizar projeto", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/financial/projects/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financial/projects"] });
      toast({ title: "Sucesso", description: "Projeto excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Erro ao excluir projeto", variant: "destructive" });
    },
  });

  const handleCreateProject = (data: ProjectFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateProject = (data: ProjectFormData) => {
    if (!selectedProject) return;
    updateMutation.mutate({ ...data, id: selectedProject.projectId });
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    form.reset({
      projectCode: project.projectCode,
      projectName: project.projectName,
      description: project.description || "",
      managerName: project.managerName || "",
      budget: project.budget?.toString() || "",
      startDate: project.startDate ? project.startDate.split('T')[0] : "",
      endDate: project.endDate ? project.endDate.split('T')[0] : "",
      status: project.status,
      active: project.active,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <Badge className={`${statusConfig.color} text-white neu-flat`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const renderFormDialog = (open: boolean, onOpenChange: (open: boolean) => void, title: string, isEdit: boolean = false) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações do projeto" : "Preencha os dados do novo projeto"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isEdit ? handleUpdateProject : handleCreateProject)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código *</FormLabel>
                    <FormControl>
                      <Input placeholder="PROJ001" className="neu-input" {...field} />
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
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do projeto" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" className="neu-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input type="date" className="neu-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" className="neu-input" {...field} />
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
                    <Textarea placeholder="Descrição do projeto" className="neu-input" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                className="neu-button"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="neu-button"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "Salvando..." : (isEdit ? "Atualizar" : "Criar")}
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
                  Projetos
                </h1>
                <p className="text-muted-foreground text-lg">
                  Gerencie projetos para controle de atividades e recursos
                </p>
              </div>
              <Badge variant="outline" className="neu-flat text-lg px-4 py-2">
                {filteredProjects.length} projetos
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input pl-10 w-96"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="neu-button">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          {/* Projects Table */}
          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Projetos</span>
                <Badge variant="outline" className="neu-flat">
                  {filteredProjects.length} encontrados
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
                      <TableHead>Responsável</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Carregando projetos...
                        </TableCell>
                      </TableRow>
                    ) : filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-gray-500">Nenhum projeto encontrado</p>
                          <p className="text-sm text-gray-400 mt-2">Crie o primeiro projeto para controle de atividades.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((project: Project) => (
                        <TableRow key={project.projectId} className="border-gray-200">
                          <TableCell className="font-medium">{project.projectCode}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{project.projectName}</div>
                              {project.description && (
                                <div className="text-sm text-gray-500">{project.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{project.managerName || "—"}</TableCell>
                          <TableCell>
                            {project.budget ? `R$ ${project.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {project.startDate && (
                                <div>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</div>
                              )}
                              {project.endDate && (
                                <div>Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}</div>
                              )}
                              {!project.startDate && !project.endDate && "—"}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                                className="neu-button"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="neu-button">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="neu-card">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(project.projectId)}
                                      className="neu-button"
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

          {/* Create Dialog */}
          {renderFormDialog(isCreateDialogOpen, setIsCreateDialogOpen, "Criar Projeto")}

          {/* Edit Dialog */}
          {renderFormDialog(isEditDialogOpen, setIsEditDialogOpen, "Editar Projeto", true)}
        </main>
      </div>
    </div>
  );
}