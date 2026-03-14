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
  insertMedicalFowardSchema,
  MedicalFowardSql,
  SysUnitSql,
  PerformedServiceSql, // Assuming this is the select type for PerformedService
} from "@/lib/contracts-schema";
import { SysUser, Partner } from "../../../../shared/schema"; // Using existing SysUser and Partner types

// Mock data for dropdowns - replace with actual data fetching
const mockSysUnits: SysUnitSql[] = [
  { sys_unit_id: 1, name: "Unidade Principal", connection_name: "main", code: "U001" },
  { sys_unit_id: 2, name: "Filial Sul", connection_name: "south", code: "U002" },
];

const mockSysUsers: SysUser[] = [
  { id: 1, name: "Dr. Alice Atendente", login: "alice.atend", email: "alice.atend@example.com", passwordHash: "", active: true, isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: "Enf. Bob Cuidador", login: "bob.cuid", email: "bob.cuid@example.com", passwordHash: "", active: true, isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockPartners: Partner[] = [
  { id: 1, partnerName: "Clínica Saúde Total", partnerCode: "P001", companyId:1, sysUnitId:1, sysUserId:1, partnerTypeId:1, specialtyId:1, billingAddressId:1, shippingAddressId:1, active:true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
  { id: 2, partnerName: "Laboratório Vida & Imagem", partnerCode: "P002", companyId:1, sysUnitId:1, sysUserId:1, partnerTypeId:1, specialtyId:1, billingAddressId:1, shippingAddressId:1, active:true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockPerformedServices: PerformedServiceSql[] = [ // This needs to align with actual service catalog
  { performed_service_id: 1, service_type_id: 1 /*, name: "Consulta Clínica Geral"*/ },
  { performed_service_id: 2, service_type_id: 2 /*, name: "Exame de Sangue Completo"*/ },
  { performed_service_id: 3, service_type_id: 3 /*, name: "Raio-X Tórax"*/ },
];

const paymentMethods = ["Dinheiro", "Cartão Débito", "Cartão Crédito", "PIX", "Gratuito/Cortesia"];


type MedicalFowardFormData = z.infer<typeof insertMedicalFowardSchema>;

interface MedicalForwardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  medicalForward?: MedicalFowardSql | null; // For editing
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
      sys_unit_id: 1, // Default or from context
      sys_user_id: 1, // Default or from logged-in user context
      partner_id: undefined,
      performed_service_id: undefined,
      observation: "",
      val_payment: null, // Explicitly null for optional number
      val_aux: null,
      due_date: today,
      cashier_number: null,
      method_pay: null,
      obs_pay: null,
      ordpgrc_id: 0, // This will be set by backend or higher logic
    },
  });

  useEffect(() => {
    if (medicalForward) {
      form.reset({
        ...medicalForward,
        due_date: medicalForward.due_date ? new Date(medicalForward.due_date).toISOString().split('T')[0] : today,
        val_payment: medicalForward.val_payment ? parseFloat(medicalForward.val_payment) : null,
        val_aux: medicalForward.val_aux ? parseFloat(medicalForward.val_aux) : null,
      });
    } else {
      form.reset({
        sys_unit_id: 1, sys_user_id: 1, partner_id: undefined, performed_service_id: undefined,
        observation: "", val_payment: null, val_aux: null, due_date: today,
        cashier_number: null, method_pay: null, obs_pay: null, ordpgrc_id: 0,
      });
    }
  }, [medicalForward, form, today]);

  const handleFormSubmit = (data: MedicalFowardFormData) => {
    console.log("Medical Forward form data:", data);
    onSubmit(data);
    toast({ title: "Sucesso", description: `Guia ${medicalForward ? "atualizada" : "criada"} com sucesso.` });
  };

  const handleSelectNumberChange = (field: any, value: string) => {
    const numValue = parseInt(value, 10);
    field.onChange(isNaN(numValue) ? undefined : numValue);
  };

  const valPayment = form.watch("val_payment");
  const valAux = form.watch("val_aux");

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
            {/* Core Guide Information */}
            <FormField
              control={form.control}
              name="partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credenciado/Médico *</FormLabel>
                  <Select onValueChange={(value) => handleSelectNumberChange(field, value)} value={field.value?.toString()}>
                    <FormControl><SelectTrigger className="neu-input"><SelectValue placeholder="Selecione o credenciado" /></SelectTrigger></FormControl>
                    <SelectContent className="neu-flat">
                      {mockPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id.toString()}>{partner.partnerName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="performed_service_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço Realizado *</FormLabel>
                  <Select onValueChange={(value) => handleSelectNumberChange(field, value)} value={field.value?.toString()}>
                    <FormControl><SelectTrigger className="neu-input"><SelectValue placeholder="Selecione o serviço" /></SelectTrigger></FormControl>
                    <SelectContent className="neu-flat">
                      {mockPerformedServices.map((service) => (
                        <SelectItem key={service.performed_service_id} value={service.performed_service_id.toString()}>
                          {/* Ideally, service would have a name property */}
                          Serviço ID: {service.performed_service_id} (Tipo: {service.service_type_id})
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
                name="due_date" // This is the guide's date, or payment date if applicable
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Data da Guia/Pagamento *</FormLabel>
                        <FormControl><Input type="date" className="neu-input" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Payment Section (Conditional or always visible if guides can have associated fees) */}
            <div className="pt-4 mt-4 border-t neu-inset p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-3">Detalhes do Pagamento (se aplicável)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="val_payment"
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
                  name="val_aux"
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
                name="method_pay"
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
                name="obs_pay"
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
    </>
  );
}
