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
  ContractSql,
  SysUnitSql,
  ContractStatusSql,
} from "@/lib/contracts-schema";
import { SysUser } from "../../../../shared/schema";
import { NewUserDialog } from "@/components/users/NewUserDialog";

// Mock data for dropdowns - replace with actual data fetching
const initialMockSysUnits: SysUnitSql[] = [
  { sys_unit_id: 1, name: "Unidade Principal", connection_name: "main", code: "U001" },
  { sys_unit_id: 2, name: "Filial Sul", connection_name: "south", code: "U002" },
];

const initialMockSysUsers: SysUser[] = [
  { id: 1, name: "Alice Wonderland", login: "alice", email: "alice@example.com", passwordHash: "", active: true, isAdmin: false },
  { id: 2, name: "Bob The Builder", login: "bob", email: "bob@example.com", passwordHash: "", active: true, isAdmin: false },
  { id: 3, name: "Charlie Brown", login: "charlie", email: "charlie@example.com", passwordHash: "", active: true, isAdmin: false },
];

const mockGroupBatches = [ // Replace with actual GroupBatch type if different
  { id: 1, name: "Lote A", groupCode: "A" },
  { id: 2, name: "Lote B", groupCode: "B" },
];

const mockClasses = [ // Replace with actual Classe type if different
  { id: 1, name: "Classe Padrão" },
  { id: 2, name: "Classe VIP" },
];

const mockContractStatuses: ContractStatusSql[] = [
  { status_id: 1, name: "Ativo", code: "AT", generate_charge: true, allows_service: true }, // Added missing boolean properties
  { status_id: 2, name: "Suspenso", code: "SU", generate_charge: false, allows_service: false },
  { status_id: 3, name: "Cancelado", code: "CA", generate_charge: false, allows_service: false },
];

type ContractFormData = z.infer<typeof insertContractSchema>;

interface ContractFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contract?: ContractSql | null;
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

  const [sysUsersForSelect, setSysUsersForSelect] = useState<SysUser[]>(initialMockSysUsers);
  const [sysUnitsForSelect, setSysUnitsForSelect] = useState<SysUnitSql[]>(initialMockSysUnits);

  const form = useForm<ContractFormData>({
    resolver: zodResolver(insertContractSchema),
    defaultValues: {
      sys_unit_id: undefined,
      sys_user_id: undefined,
      group_batch_id: undefined,
      owner_id: undefined,
      contract_name: "",
      class_id: undefined,
      status_id: undefined,
      contract_number: "",
      contract_type: "",
      start_date: "",
      end_date: null,
      billing_frequenc: 1,
      admission: "",
      final_grace: null,
      month_initial_billing: "",
      year_initial_billing: "",
      opt_payday: null,
      collector_id: null,
      seller_id: null,
      region_id: null,
      obs: null,
      services_amount: null,
      renew_at: null,
      first_charge: null,
      last_charge: null,
      charges_amount: null,
      charges_paid: null,
      alives: null,
      deceaseds: null,
      dependents: null,
      service_option1: null,
      service_option2: null,
      indicated_by: null,
      grace_period_days: null,
      late_fee_percentage: null,
      is_partial_payments_allowed: false, // Default to false for boolean
      default_plan_installments: null,
      default_plan_frequency: "MONTHLY",
      industry: "FUNERAL",
    },
  });

  useEffect(() => {
    if (contract) {
      const transformedContract = {
        ...contract,
        start_date: contract.start_date ? new Date(contract.start_date).toISOString().split('T')[0] : "",
        end_date: contract.end_date ? new Date(contract.end_date).toISOString().split('T')[0] : null,
        admission: contract.admission ? new Date(contract.admission).toISOString().split('T')[0] : "",
        final_grace: contract.final_grace ? new Date(contract.final_grace).toISOString().split('T')[0] : null,
        renew_at: contract.renew_at ? new Date(contract.renew_at).toISOString().split('T')[0] : null,
        late_fee_percentage: contract.late_fee_percentage ? String(contract.late_fee_percentage) : null,
        is_partial_payments_allowed: contract.is_partial_payments_allowed ?? false,
      };
      form.reset(transformedContract);
    } else {
      form.reset({
        sys_unit_id: undefined,
        sys_user_id: undefined,
        group_batch_id: undefined,
        owner_id: undefined,
        contract_name: "",
        class_id: undefined,
        status_id: undefined,
        contract_number: "",
        contract_type: "",
        start_date: "",
        end_date: null,
        billing_frequenc: 1,
        admission: "",
        final_grace: null,
        month_initial_billing: "",
        year_initial_billing: "",
        opt_payday: null,
        collector_id: null,
        seller_id: null,
        region_id: null,
        obs: null,
        services_amount: null,
        renew_at: null,
        first_charge: null,
        last_charge: null,
        charges_amount: null,
        charges_paid: null,
        alives: null,
        deceaseds: null,
        dependents: null,
        service_option1: null,
        service_option2: null,
        indicated_by: null,
        grace_period_days: null,
        late_fee_percentage: null,
        is_partial_payments_allowed: false,
        default_plan_installments: null,
        default_plan_frequency: "MONTHLY",
        industry: "FUNERAL",
      });
    }
  }, [contract, form]);

  const handleFormSubmit = (data: ContractFormData) => {
    console.log("Contract form data:", data);
    const numericFields: (keyof ContractFormData)[] = ['late_fee_percentage'];
    numericFields.forEach(field => {
      const value = data[field];
      if (value && typeof value === 'string') {
        // @ts-ignore
        data[field] = parseFloat(value);
      } else if (value === null && field === 'late_fee_percentage') {
         // @ts-ignore
        data[field] = null; // Keep it null if it was null
      }
    });

    onSubmit(data);
    toast({ title: "Sucesso", description: `Contrato ${contract ? "atualizado" : "criado"} com sucesso.` });
  };

  const handleSelectNumberChange = (field: any, value: string) => {
    const numValue = parseInt(value, 10);
    field.onChange(isNaN(numValue) ? undefined : numValue);
  };

  const handleNewUserCreated = (newUser: SysUser) => {
    setSysUsersForSelect(prevUsers => [...prevUsers, newUser]);
    form.setValue("owner_id", newUser.id, { shouldValidate: true });
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
                <TabsTrigger value="billing" className="neu-button data-[state=active]:neu-pressed rounded-lg">Cobrança & Serviços</TabsTrigger>
                <TabsTrigger value="dates" className="neu-button data-[state=active]:neu-pressed rounded-lg">Datas & Prazos</TabsTrigger>
                <TabsTrigger value="financial" className="neu-button data-[state=active]:neu-pressed rounded-lg">Financeiro</TabsTrigger>
                <TabsTrigger value="ids" className="neu-button data-[state=active]:neu-pressed rounded-lg">IDs & Legado</TabsTrigger>
                <TabsTrigger value="notes" className="neu-button data-[state=active]:neu-pressed rounded-lg">Notas & Outros</TabsTrigger>
              </TabsList>

              {/* Tab 1: Core Information */}
              <TabsContent value="core" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contract_name"
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
                    name="contract_number"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="owner_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titular (Owner) *</FormLabel>
                        <Select
                          onValueChange={(value) => handleSelectNumberChange(field, value)}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="neu-input">
                              <SelectValue placeholder="Selecione o titular" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="neu-flat">
                            <Button variant="ghost" className="w-full justify-start neu-button text-sm py-1.5 px-2 mb-1 h-auto" onClick={() => setIsNewUserDialogOpen(true)}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Criar Novo Titular
                            </Button>
                            {sysUsersForSelect.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name} (ID: {user.id})
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
                    name="contract_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Contrato *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Familiar, Individual, Empresarial" className="neu-input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="class_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classe *</FormLabel>
                        <Select
                          onValueChange={(value) => handleSelectNumberChange(field, value)}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="neu-input">
                              <SelectValue placeholder="Selecione a classe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="neu-flat">
                            {mockClasses.map((c) => (
                              <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name}
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
                    name="status_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status do Contrato *</FormLabel>
                        <Select
                          onValueChange={(value) => handleSelectNumberChange(field, value)}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="neu-input">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="neu-flat">
                            {mockContractStatuses.map((status) => (
                              <SelectItem key={status.status_id} value={status.status_id.toString()}>
                                {status.name}
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
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indústria</FormLabel>
                        <FormControl>
                          <Input className="neu-input" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Tab 2: Billing & Services */}
              <TabsContent value="billing" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="billing_frequenc"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Frequência de Cobrança (meses) *</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="1" className="neu-input"
                                {...field}
                                value={field.value ?? ""}
                                onChange={e => field.onChange(parseInt(e.target.value,10) || null)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="month_initial_billing"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mês Início Cobrança (MM) *</FormLabel>
                            <FormControl>
                            <Input placeholder="01" className="neu-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year_initial_billing"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ano Início Cobrança (AAAA) *</FormLabel>
                            <FormControl>
                            <Input placeholder="2024" className="neu-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="opt_payday"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dia Preferencial Pagto.</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="10" className="neu-input"
                                {...field}
                                value={field.value ?? ""}
                                onChange={e => field.onChange(parseInt(e.target.value,10) || null)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="collector_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cobrador</FormLabel>
                            <Select
                              onValueChange={(value) => handleSelectNumberChange(field, value)}
                              value={field.value?.toString()}
                            >
                            <FormControl>
                                <SelectTrigger className="neu-input">
                                <SelectValue placeholder="Selecione o cobrador" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="neu-flat">
                                {sysUsersForSelect.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="seller_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendedor</FormLabel>
                             <Select
                                onValueChange={(value) => handleSelectNumberChange(field, value)}
                                value={field.value?.toString()}
                             >
                            <FormControl>
                                <SelectTrigger className="neu-input">
                                <SelectValue placeholder="Selecione o vendedor" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="neu-flat">
                                {sysUsersForSelect.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="services_amount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Qtd. Funerais/Serviços</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="1" className="neu-input"
                                {...field}
                                value={field.value ?? ""}
                                onChange={e => field.onChange(parseInt(e.target.value,10) || null)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="service_option1"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Opção de Atendimento 1</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Cremação Padrão" className="neu-input" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="service_option2"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Opção de Atendimento 2</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Urna Luxo" className="neu-input" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              </TabsContent>

              {/* Tab 3: Dates & Grace Periods */}
              <TabsContent value="dates" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Início *</FormLabel>
                            <FormControl>
                            <Input type="date" className="neu-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Fim</FormLabel>
                            <FormControl>
                            <Input type="date" className="neu-input" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="admission"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Admissão *</FormLabel>
                            <FormControl>
                            <Input type="date" className="neu-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="final_grace"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Final Carência</FormLabel>
                            <FormControl>
                            <Input type="date" className="neu-input" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="renew_at"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Renovação</FormLabel>
                            <FormControl>
                            <Input type="date" className="neu-input" {...field} value={field.value ?? ""}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="grace_period_days"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dias de Carência</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: 30" className="neu-input" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              </TabsContent>

              {/* Tab 4: Financial Details */}
              <TabsContent value="financial" className="mt-6 space-y-4">
                <FormField
                    control={form.control}
                    name="late_fee_percentage"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Percentual Multa Atraso</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.00001" placeholder="Ex: 0.02000 (para 2%)" className="neu-input"
                            {...field}
                            value={field.value ?? ""}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="is_partial_payments_allowed"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 neu-flat">
                        <FormControl>
                        <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                            className="neu-checkbox"
                        />
                        </FormControl>
                        <FormLabel>Permite Pagamentos Parciais?</FormLabel>
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="default_plan_installments"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parcelas Plano Padrão</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: 12" className="neu-input" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="default_plan_frequency"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Frequência Plano Padrão</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? "MONTHLY"}>
                                <FormControl>
                                    <SelectTrigger className="neu-input">
                                    <SelectValue placeholder="Selecione a frequência" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="neu-flat">
                                    <SelectItem value="MONTHLY">Mensal</SelectItem>
                                    <SelectItem value="ANNUALLY">Anual</SelectItem>
                                    <SelectItem value="CUSTOM">Outra</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              </TabsContent>

              {/* Tab 5: Identifiers & Legacy */}
              <TabsContent value="ids" className="mt-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="sys_unit_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unidade do Sistema (SysUnit) *</FormLabel>
                            <Select
                                onValueChange={(value) => handleSelectNumberChange(field, value)}
                                value={field.value?.toString()}
                            >
                            <FormControl>
                                <SelectTrigger className="neu-input">
                                <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="neu-flat">
                                {sysUnitsForSelect.map((unit) => (
                                <SelectItem key={unit.sys_unit_id} value={unit.sys_unit_id.toString()}>
                                    {unit.name}
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
                        name="group_batch_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lote de Grupo (Group Batch) *</FormLabel>
                             <Select
                                onValueChange={(value) => handleSelectNumberChange(field, value)}
                                value={field.value?.toString()}
                             >
                            <FormControl>
                                <SelectTrigger className="neu-input">
                                <SelectValue placeholder="Selecione o lote" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="neu-flat">
                                {mockGroupBatches.map((batch) => (
                                <SelectItem key={batch.id} value={batch.id.toString()}>
                                    {batch.name}
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
                        name="sys_user_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Usuário do Sistema (Criador) *</FormLabel>
                            <Select
                                onValueChange={(value) => handleSelectNumberChange(field, value)}
                                value={field.value?.toString()}
                                disabled={!!contract} // Disable if editing, usually set by backend
                            >
                            <FormControl>
                                <SelectTrigger className="neu-input">
                                <SelectValue placeholder="Selecione o usuário criador" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="neu-flat">
                                {sysUsersForSelect.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
                 <p className="text-sm text-muted-foreground neu-inset p-3 rounded-md">
                    Campos legados (somente leitura ou preenchidos pelo sistema):
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 neu-inset rounded-md">
                    <FormField control={form.control} name="first_charge" render={({ field }) => (<FormItem><FormLabel>Primeira Cobrança</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="last_charge" render={({ field }) => (<FormItem><FormLabel>Última Cobrança</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="charges_amount" render={({ field }) => (<FormItem><FormLabel>Qtd. Cobranças</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="charges_paid" render={({ field }) => (<FormItem><FormLabel>Qtd. Cobranças Pagas</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="alives" render={({ field }) => (<FormItem><FormLabel>Nº Vivos</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="deceaseds" render={({ field }) => (<FormItem><FormLabel>Nº Falecidos</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="dependents" render={({ field }) => (<FormItem><FormLabel>Nº Dependentes</FormLabel><FormControl><Input className="neu-input" {...field} value={field.value ?? ""} readOnly /></FormControl></FormItem>)} />
                 </div>
              </TabsContent>

              {/* Tab 6: Notes & Other */}
              <TabsContent value="notes" className="mt-6 space-y-4">
                <FormField
                    control={form.control}
                    name="obs"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Detalhes adicionais sobre o contrato..." className="neu-input min-h-[100px]" {...field} value={field.value ?? ""}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="indicated_by"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Indicado Por</FormLabel>
                            <Select
                                onValueChange={(value) => handleSelectNumberChange(field, value)}
                                value={field.value?.toString()}
                            >
                            <FormControl>
                                <SelectTrigger className="neu-input">
                                <SelectValue placeholder="Selecione quem indicou" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="neu-flat">
                                {sysUsersForSelect.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="region_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Região ID</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="ID da Região" className="neu-input"
                                {...field}
                                value={field.value ?? ""}
                                onChange={e => field.onChange(parseInt(e.target.value,10) || null)} />
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
>>>>>>> REPLACE
