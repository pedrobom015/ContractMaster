import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  insertContractSchema,
  SysUser,
  Contract,
} from "@shared/schema";
import { NewUserDialog } from "@/components/users/NewUserDialog";

type ContractFormData = z.infer<typeof insertContractSchema>;

interface ContractFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contract?: Contract | null;
  onSubmit: (data: ContractFormData) => void;
}

export function ContractFormDialog({
  isOpen,
  onOpenChange,
  contract,
  onSubmit,
}: ContractFormDialogProps) {
  const { toast } = useToast();
  const [currentFormTab, setCurrentFormTab] = useState("core");
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);

  const form = useForm<ContractFormData>({
    resolver: zodResolver(insertContractSchema),
    defaultValues: {
      sysUnitId: undefined,
      sysUserId: undefined,
      groupBatchId: undefined,
      ownerId: undefined,
      contractName: "",
      classId: undefined,
      statusId: undefined,
      contractNumber: "",
      startDate: new Date(), admission: new Date(),
      endDate: null,
      obs: null,
      servicesAmount: null,
      indicatedBy: null,
    },
  });

  useEffect(() => {
    if (contract) {
      form.reset(contract as any);
    } else {
      form.reset({
        sysUnitId: undefined,
        sysUserId: undefined,
        groupBatchId: undefined,
        ownerId: undefined,
        contractName: "",
        classId: undefined,
        statusId: undefined,
        contractNumber: "",
        startDate: new Date(), admission: new Date(),
        endDate: null,
        obs: null,
        servicesAmount: null,
        indicatedBy: null,
      } as any);
    }
  }, [contract, form]);

  const handleFormSubmit = (data: ContractFormData) => {
    onSubmit(data);
    toast({ title: "Sucesso", description: `Contrato ${contract ? "atualizado" : "criado"} com sucesso.` });
  };

  const handleSelectNumberChange = (field: any, value: string) => {
    const numValue = parseInt(value, 10);
    field.onChange(isNaN(numValue) ? undefined : numValue);
  };

  const handleNewUserCreated = (newUser: SysUser) => {
    form.setValue("ownerId", newUser.sysUserId, { shouldValidate: true });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="neu-card max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {contract ? "Editar Contrato" : "Novo Contrato"}
          </DialogTitle>
          <DialogDescription>
            {contract
              ? "Edite as informações do contrato."
              : "Preencha os dados para criar um novo contrato."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <Tabs value={currentFormTab} onValueChange={setCurrentFormTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 neu-flat rounded-xl p-1">
                <TabsTrigger value="core" className="neu-button data-[state=active]:neu-pressed rounded-lg">Info Principal</TabsTrigger>
                <TabsTrigger value="dates" className="neu-button data-[state=active]:neu-pressed rounded-lg">Datas & Prazos</TabsTrigger>
                <TabsTrigger value="notes" className="neu-button data-[state=active]:neu-pressed rounded-lg">Notas & Outros</TabsTrigger>
              </TabsList>

              <TabsContent value="core" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contractName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contrato *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Plano Familiar Padrão" className="neu-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contractNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Contrato *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: C000123" className="neu-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="neu-button"
              >
                Cancelar
              </Button>
              <Button type="submit" className="neu-button neu-button-primary">
                {contract ? "Salvar Alterações" : "Criar Contrato"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        </DialogContent>
      </Dialog>
    {isNewUserDialogOpen && (
      <NewUserDialog
        isOpen={isNewUserDialogOpen}
        onOpenChange={setIsNewUserDialogOpen}
        onUserCreated={handleNewUserCreated}
      />
    )}
    </>
  );
}
