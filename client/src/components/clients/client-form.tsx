import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertClientSchema } from "@shared/schema";
import type { Client } from "@shared/schema";
import { z } from "zod";

interface ClientFormProps {
  client?: Client;
  onCancel: () => void;
  onSuccess: () => void;
}

const formSchema = insertClientSchema.extend({
  document: z.string().refine((doc) => {
    const cleaned = doc.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 14;
  }, "Document must be a valid CPF (11 digits) or CNPJ (14 digits)")
});

export default function ClientForm({ client, onCancel, onSuccess }: ClientFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      document: client?.document || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
      contact: client?.contact || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      apiRequest("POST", "/api/clients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<z.infer<typeof formSchema>>) =>
      apiRequest("PUT", `/api/clients/${client?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${client?.id}`] });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (client) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const formatDocumentInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="neu-pressed rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-foreground">
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Nome/Razão Social</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Nome completo ou razão social"
                      className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">CPF/CNPJ</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      onChange={(e) => {
                        const formatted = formatDocumentInput(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground font-mono"
                    />
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
                  <FormLabel className="text-muted-foreground">E-mail</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      {...field}
                      value={field.value || ""}
                      placeholder="cliente@email.com"
                      className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Telefone</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      value={field.value || ""}
                      placeholder="(11) 99999-9999"
                      className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Pessoa de Contato</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      value={field.value || ""}
                      placeholder="Nome do responsável"
                      className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Endereço Completo</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  value={field.value || ""}
                  rows={3}
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                  className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <div 
            className="neu-button rounded-xl px-6 py-3 cursor-pointer"
            onClick={onCancel}
          >
            <span className="text-muted-foreground font-medium">Cancelar</span>
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="neu-button rounded-xl px-6 py-3 cursor-pointer disabled:opacity-50"
          >
            <span className="text-primary font-medium">
              {createMutation.isPending || updateMutation.isPending
                ? "Salvando..."
                : client
                ? "Salvar Alterações"
                : "Criar Cliente"}
            </span>
          </button>
        </div>
      </form>
    </Form>
  );
}