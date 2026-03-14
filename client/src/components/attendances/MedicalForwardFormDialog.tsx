import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  insertMedicalForwardSchema as insertMedicalFowardSchema,
} from "@shared/schema";
import { SysUser, Partner, MedicalForward, SysUnit, PerformedService } from "@shared/schema";

const paymentMethods = ["Dinheiro", "Cartão Débito", "Cartão Crédito", "PIX", "Gratuito/Cortesia"];

type MedicalFowardFormData = z.infer<typeof insertMedicalFowardSchema>;

interface MedicalForwardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  medicalForward?: MedicalForward | null; // For editing
  onSubmit: (data: MedicalFowardFormData) => void;
}

export function MedicalForwardFormDialog({
  isOpen,
  onOpenChange,
  medicalForward,
  onSubmit,
}: MedicalForwardFormDialogProps) {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<MedicalFowardFormData>({
    resolver: zodResolver(insertMedicalFowardSchema),
    defaultValues: {
      sysUnitId: 1,
      sysUserId: 1,
      partnerId: undefined,
      performedServiceId: undefined,
      observation: "",
      valPayment: null,
      valAux: null,
      dueDate: new Date(today),
      cashierNumber: null,
      methodPay: null,
      obsPay: null,
      ordpgrcId: 0,
    },
  });

  useEffect(() => {
    if (medicalForward) {
      form.reset({
        ...medicalForward,
        dueDate: medicalForward.dueDate ? new Date(medicalForward.dueDate) : new Date(today),
        valPayment: medicalForward.valPayment ? parseFloat(medicalForward.valPayment) : null,
        valAux: medicalForward.valAux ? parseFloat(medicalForward.valAux) : null,
      } as any);
    } else {
      form.reset({
        sysUnitId: 1, sysUserId: 1, partnerId: undefined, performedServiceId: undefined,
        observation: "", valPayment: null, valAux: null, dueDate: new Date(today),
        cashierNumber: null, methodPay: null, obsPay: null, ordpgrcId: 0,
      } as any);
    }
  }, [medicalForward, form, today]);

  const handleFormSubmit = (data: MedicalFowardFormData) => {
    onSubmit(data);
    toast({ title: "Sucesso", description: `Guia ${medicalForward ? "atualizada" : "criada"} com sucesso.` });
  };

  const handleSelectNumberChange = (field: any, value: string) => {
    const numValue = parseInt(value, 10);
    field.onChange(isNaN(numValue) ? undefined : numValue);
  };

  const valPayment = form.watch("valPayment");
  const valAux = form.watch("valAux");

  const changeAmount = useMemo(() => {
    const paid = typeof valPayment === 'number' ? valPayment : 0;
    const given = typeof valAux === 'number' ? valAux : 0;
    if (given > 0 && given >= paid) {
      return (given - paid).toFixed(2);
    }
    return null;
  }, [valPayment, valAux]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="neu-card max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {medicalForward ? "Editar Guia Médica" : "Nova Guia Médica"}
          </DialogTitle>
          <DialogDescription>
            {medicalForward
              ? "Edite as informações da guia de encaminhamento."
              : "Preencha os dados para emitir uma nova guia."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="partnerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credenciado/Médico *</FormLabel>
                  <Select onValueChange={(value) => handleSelectNumberChange(field, value)} value={field.value?.toString()}>
                    <FormControl><SelectTrigger className="neu-input"><SelectValue placeholder="Selecione o credenciado" /></SelectTrigger></FormControl>
                    <SelectContent className="neu-flat">
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="performedServiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço Realizado *</FormLabel>
                  <Select onValueChange={(value) => handleSelectNumberChange(field, value)} value={field.value?.toString()}>
                    <FormControl><SelectTrigger className="neu-input"><SelectValue placeholder="Selecione o serviço" /></SelectTrigger></FormControl>
                    <SelectContent className="neu-flat">
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação da Guia</FormLabel>
                  <FormControl><Textarea placeholder="Detalhes, justificativa, recomendações..." className="neu-input min-h-[80px]" {...field} value={field.value ?? ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Data da Guia/Pagamento *</FormLabel>
                        <FormControl><Input type="date" className="neu-input" {...field} value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : (field.value ?? "")} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="pt-4 mt-4 border-t neu-inset p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-3">Detalhes do Pagamento (se aplicável)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="valPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Pago R$</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="0.00" className="neu-input" {...field} onChange={e => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valAux"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Entregue R$</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="0.00" className="neu-input" {...field} onChange={e => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                    <FormLabel>Troco R$</FormLabel>
                    <Input className="neu-input bg-muted/50" value={changeAmount !== null ? changeAmount : "---"} readOnly />
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="methodPay"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl><SelectTrigger className="neu-input"><SelectValue placeholder="Selecione se houve pagamento" /></SelectTrigger></FormControl>
                      <SelectContent className="neu-flat">
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="obsPay"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Observações do Pagamento</FormLabel>
                    <FormControl><Textarea placeholder="Detalhes sobre o pagamento..." className="neu-input" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="neu-button">
                Cancelar
              </Button>
              <Button type="submit" className="neu-button neu-button-primary">
                {medicalForward ? "Salvar Alterações" : "Emitir Guia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
