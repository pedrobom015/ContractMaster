import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { insertPaymentReceiptSchema, insertCarteirinhaSchema, insertMedicalForwardSchema } from "@shared/schema";
import type { PaymentReceipt, Carteirinha, MedicalForward } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Link } from "wouter";

const attendanceFormSchema = {
  paymentReceipt: insertPaymentReceiptSchema.extend({
    valPayment: z.string().optional(),
    valAux: z.string().optional(),
  }),
  carteirinha: insertCarteirinhaSchema.extend({
    valor: z.string().optional(),
  }),
  medicalForward: insertMedicalForwardSchema.extend({
    valPayment: z.string().optional(),
    valAux: z.string().optional(),
  }),
};

interface AttendanceFormProps {
  type: 'paymentReceipt' | 'carteirinha' | 'medicalForward';
  data?: PaymentReceipt | Carteirinha | MedicalForward;
  onSuccess: () => void;
}

function AttendanceForm({ type, data, onSuccess }: AttendanceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = !!data;
  const schema = attendanceFormSchema[type];
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(data || {}),
      valPayment: data && 'valPayment' in data ? data.valPayment?.toString() || "" : "",
      valAux: data && 'valAux' in data ? data.valAux?.toString() || "" : "",
      valor: data && 'valor' in data ? data.valor?.toString() || "" : "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const processedData = {
        ...formData,
        valPayment: formData.valPayment ? parseFloat(formData.valPayment) : null,
        valAux: formData.valAux ? parseFloat(formData.valAux) : null,
        valor: formData.valor ? parseFloat(formData.valor) : null,
      };

      const endpoints = {
        paymentReceipt: "/api/payment-receipts",
        carteirinha: "/api/carteirinhas", 
        medicalForward: "/api/medical-forwards",
      };

      if (isEditing) {
        const response = await apiRequest(`${endpoints[type]}/${data.id}`, {
          method: "PATCH",
          body: processedData,
        });
        return await response.json();
      } else {
        const response = await apiRequest(endpoints[type], {
          method: "POST",
          body: processedData,
        });
        return await response.json();
      }
    },
    onSuccess: () => {
      const queryKeys = {
        paymentReceipt: ["/api/payment-receipts"],
        carteirinha: ["/api/carteirinhas"],
        medicalForward: ["/api/medical-forwards"],
      };
      
      queryClient.invalidateQueries({ queryKey: queryKeys[type] });
      toast({
        title: "Sucesso",
        description: `${isEditing ? "Atualizado" : "Criado"} com sucesso!`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar solicitação",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: any) => {
    mutation.mutate(formData);
  };

  const renderFields = () => {
    switch (type) {
      case 'paymentReceipt':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Cobrança</FormLabel>
                    <FormControl>
                      <Input className="neu-input" {...field} value={field.value || ""} />
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
                    <FormControl>
                      <Input className="neu-input" maxLength={2} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Pagamento</FormLabel>
                    <FormControl>
                      <Input className="neu-input" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valAux"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Auxiliar</FormLabel>
                    <FormControl>
                      <Input className="neu-input" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cashierNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Caixa</FormLabel>
                    <FormControl>
                      <Input className="neu-input" maxLength={8} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="methodPay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <FormControl>
                      <Input className="neu-input" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="obsPay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea className="neu-input" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 'carteirinha':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cardCod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do Cartão</FormLabel>
                    <FormControl>
                      <Input className="neu-input" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimento</FormLabel>
                    <FormControl>
                      <Input className="neu-input" placeholder="VAL 06/2025 A 05/2026" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input className="neu-input" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Operação</FormLabel>
                    <FormControl>
                      <Input className="neu-input" maxLength={10} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea className="neu-input" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 'medicalForward':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Pagamento</FormLabel>
                    <FormControl>
                      <Input className="neu-input" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valAux"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Auxiliar</FormLabel>
                    <FormControl>
                      <Input className="neu-input" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cashierNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Caixa</FormLabel>
                    <FormControl>
                      <Input className="neu-input" maxLength={8} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="methodPay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <FormControl>
                      <Input className="neu-input" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea className="neu-input" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="obsPay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações do Pagamento</FormLabel>
                  <FormControl>
                    <Textarea className="neu-input" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderFields()}
        <div className="flex justify-end gap-2">
          <Button type="submit" className="neu-button neu-button-primary" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface AttendanceTableProps {
  type: 'paymentReceipt' | 'carteirinha' | 'medicalForward';
  data: any[];
  isLoading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

function AttendanceTable({ type, data, isLoading, onEdit, onDelete }: AttendanceTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-8 text-muted-foreground">Nenhum registro encontrado</div>;
  }

  const renderTableHeaders = () => {
    switch (type) {
      case 'paymentReceipt':
        return (
          <tr className="border-b">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Número Cobrança</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Valor Pagamento</th>
            <th className="text-left p-4">Método</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        );
      case 'carteirinha':
        return (
          <tr className="border-b">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Código Cartão</th>
            <th className="text-left p-4">Vencimento</th>
            <th className="text-left p-4">Valor</th>
            <th className="text-left p-4">Num. Op.</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        );
      case 'medicalForward':
        return (
          <tr className="border-b">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Valor Pagamento</th>
            <th className="text-left p-4">Método</th>
            <th className="text-left p-4">Observação</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item: any, index: number) => {
    switch (type) {
      case 'paymentReceipt':
        return (
          <tr key={item.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
            <td className="p-4">{item.id}</td>
            <td className="p-4">{item.billingNumber || "-"}</td>
            <td className="p-4">{item.status || "-"}</td>
            <td className="p-4">{item.valPayment ? `R$ ${parseFloat(item.valPayment).toFixed(2)}` : "-"}</td>
            <td className="p-4">{item.methodPay || "-"}</td>
            <td className="p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );
      case 'carteirinha':
        return (
          <tr key={item.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
            <td className="p-4">{item.id}</td>
            <td className="p-4">{item.cardCod || "-"}</td>
            <td className="p-4">{item.vencimento || "-"}</td>
            <td className="p-4">{item.valor ? `R$ ${parseFloat(item.valor).toFixed(2)}` : "-"}</td>
            <td className="p-4">{item.numop || "-"}</td>
            <td className="p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );
      case 'medicalForward':
        return (
          <tr key={item.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
            <td className="p-4">{item.id}</td>
            <td className="p-4">{item.valPayment ? `R$ ${parseFloat(item.valPayment).toFixed(2)}` : "-"}</td>
            <td className="p-4">{item.methodPay || "-"}</td>
            <td className="p-4">{item.observation || "-"}</td>
            <td className="p-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {renderTableHeaders()}
        </thead>
        <tbody>
          {data.map((item, index) => renderTableRow(item, index))}
        </tbody>
      </table>
    </div>
  );
}

export default function AttendanceEntries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("paymentReceipt");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries for each tab
  const paymentReceiptsQuery = useQuery({
    queryKey: ["/api/payment-receipts"],
    queryFn: async () => {
      const response = await apiRequest("/api/payment-receipts");
      return await response.json();
    },
  });

  const carteirinhasQuery = useQuery({
    queryKey: ["/api/carteirinhas"],
    queryFn: async () => {
      const response = await apiRequest("/api/carteirinhas");
      return await response.json();
    },
  });

  const medicalForwardsQuery = useQuery({
    queryKey: ["/api/medical-forwards"],
    queryFn: async () => {
      const response = await apiRequest("/api/medical-forwards");
      return await response.json();
    },
  });

  // Delete mutations
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: string }) => {
      const endpoints = {
        paymentReceipt: "/api/payment-receipts",
        carteirinha: "/api/carteirinhas",
        medicalForward: "/api/medical-forwards",
      };
      const response = await apiRequest(`${endpoints[type]}/${id}`, { method: "DELETE" });
      return await response.json();
    },
    onSuccess: (_, { type }) => {
      const queryKeys = {
        paymentReceipt: ["/api/payment-receipts"],
        carteirinha: ["/api/carteirinhas"],
        medicalForward: ["/api/medical-forwards"],
      };
      queryClient.invalidateQueries({ queryKey: queryKeys[type] });
      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir registro",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
      deleteMutation.mutate({ id, type: activeTab });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const getTabData = (tab: string) => {
    switch (tab) {
      case 'paymentReceipt':
        return { data: paymentReceiptsQuery.data || [], isLoading: paymentReceiptsQuery.isLoading };
      case 'carteirinha':
        return { data: carteirinhasQuery.data || [], isLoading: carteirinhasQuery.isLoading };
      case 'medicalForward':
        return { data: medicalForwardsQuery.data || [], isLoading: medicalForwardsQuery.isLoading };
      default:
        return { data: [], isLoading: false };
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'paymentReceipt':
        return 'Recibo de Pagamento';
      case 'carteirinha':
        return 'Carteirinha';
      case 'medicalForward':
        return 'Encaminhamento Médico';
      default:
        return '';
    }
  };

  const { data, isLoading } = getTabData(activeTab);
  const filteredData = Array.isArray(data) ? data.filter((item: any) =>
    Object.values(item).some((value: any) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="neu-button">
              <Home className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Atendimentos - Lançamentos</h1>
              <p className="text-muted-foreground">
                Gerenciar recibos de pagamento, carteirinhas e encaminhamentos médicos
              </p>
            </div>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="paymentReceipt">Recibo de Pagamento</TabsTrigger>
          <TabsTrigger value="carteirinha">Carteirinha</TabsTrigger>
          <TabsTrigger value="medicalForward">Encaminhamento Médico</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-input"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neu-button neu-button-primary" onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo {getTabTitle(activeTab)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar" : "Novo"} {getTabTitle(activeTab)}
                </DialogTitle>
              </DialogHeader>
              <AttendanceForm
                type={activeTab as any}
                data={editingItem}
                onSuccess={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="paymentReceipt">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle>Recibos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTable
                type="paymentReceipt"
                data={filteredData}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carteirinha">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle>Carteirinhas</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTable
                type="carteirinha"
                data={filteredData}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalForward">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle>Encaminhamentos Médicos</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTable
                type="medicalForward"
                data={filteredData}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </main>
      </div>
    </div>
  );
}