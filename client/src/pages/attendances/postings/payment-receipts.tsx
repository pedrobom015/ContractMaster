// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardDescription
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, Users, AlertTriangle, DollarSign, ReceiptIcon, Printer, FileSignature, ListFilter } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod"; // Already imported by insertPaymentReceiptSchema

import {
  ContractSql,
  ContractChargeSql,
  BeneficiarySql,
  ContractStatusSql,
  PaymentStatusSql,
  insertPaymentReceiptSchema,
  InsertPaymentReceiptSql,
  OrdpgrcSql,
  PaymentReceiptSql, // For the actual receipt data
} from "@/lib/contracts-schema";
import { SysUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


// Mock data (should eventually come from API calls or context)
const mockSysUsers: SysUser[] = [
  { id: 1, name: "Alice Wonderland", login: "alice", email: "alice@example.com", passwordHash: "", active: true, isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date() },
  { id: 2, name: "Bob The Builder", login: "bob", email: "bob@example.com", passwordHash: "", active: true, isAdmin: false, createdAt: new Date().toISOString(), updatedAt: new Date() },
];

const mockContractStatuses: ContractStatusSql[] = [
  { status_id: 1, name: "Ativo", code: "AT", generate_charge: true, allows_service: true, charge_after:null, kanban:true, color:"blue",kanban_order:1,is_final_state:false,is_initial_state:true,allow_edition:true,allow_deletion:true,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),deleted_at:null,created_by:null,updated_by:null,deleted_by:null,unit_id:1},
  { status_id: 2, name: "Suspenso", code: "SU", generate_charge: false, allows_service: false, charge_after:null, kanban:true, color:"orange",kanban_order:2,is_final_state:false,is_initial_state:false,allow_edition:true,allow_deletion:true,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),deleted_at:null,created_by:null,updated_by:null,deleted_by:null,unit_id:1 },
];

const mockPaymentStatuses: PaymentStatusSql[] = [
    { payment_status_id: 1, name: "Pago", code: "PG", kanban:true, color:"green",kanban_order:1,is_final_state:true,is_initial_state:false,allow_edition:false,allow_deletion:false,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),deleted_at:null,created_by:null,updated_by:null,deleted_by:null },
    { payment_status_id: 2, name: "Pendente", code: "PE", kanban:true, color:"yellow",kanban_order:2,is_final_state:false,is_initial_state:true,allow_edition:true,allow_deletion:true,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),deleted_at:null,created_by:null,updated_by:null,deleted_by:null },
    { payment_status_id: 3, name: "Vencido", code: "VE", kanban:true, color:"red",kanban_order:3,is_final_state:false,is_initial_state:false,allow_edition:true,allow_deletion:true,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),deleted_at:null,created_by:null,updated_by:null,deleted_by:null },
];


const initialMockContracts: any[] = [
  {
    contract_id: 1, sys_unit_id: 1, sys_user_id: 1, group_batch_id: 1, owner_id: 1,
    contract_name: "Plano Familiar Alpha", class_id: 1, status_id: 1, contract_number: "PF-001",
    contract_type: "Familiar", start_date: new Date('2023-01-15'), admission: new Date('2023-01-01'),
    month_initial_billing: "02", year_initial_billing: "2023", billing_frequenc: 1,
    created_at: new Date(), updatedAt: new Date(),
    end_date: null, final_grace: new Date('2023-03-01'), opt_payday: 10, collector_id: 2, seller_id: 1, region_id: 1, obs: "Obs", services_amount: 1, renew_at: null, first_charge: 1, last_charge: 1, charges_amount: 12, charges_paid: 10, alives: 3, deceaseds: 0, dependents: 2, service_option1: "Opt1", service_option2: "Opt2", indicated_by: null, grace_period_days: "30", late_fee_percentage: "0.02", is_partial_payments_allowed: true, default_plan_installments: "12", default_plan_frequency: "MONTHLY", industry: "Funeral", deleted_at: null, created_by: 1, updated_by: 1, deleted_by: null
  },
];

const mockContractCharges: ContractChargeSql[] = [
    { contract_charge_id: 1, contract_id: 1, sys_unit_id: 1, payment_status_id: 1, charge_code: "202310-PF-001", due_date: new Date('2023-10-10'), amount: "150.00", payment_date: new Date('2023-10-08'), amount_pago: "150.00", created_at: new Date(2023,9,1).toISOString(),updated_at:new Date(2023,9,8).toISOString(), convenio:null,due_month:"10",due_year:"2023",payd_month:"10",payd_year:"2023",created_by:1,updated_by:1,deleted_at:null,deleted_by:null },
    { contract_charge_id: 4, contract_id: 1, sys_unit_id: 1, payment_status_id: 2, charge_code: "202401-PF-001", due_date: new Date('2024-01-10'), amount: "160.00", payment_date: null, amount_pago: null, created_at: new Date(2024,0,1).toISOString(),updated_at:new Date(2024,0,1).toISOString(), convenio:null,due_month:"01",due_year:"2024",payd_month:null,payd_year:null,created_by:1,updated_by:1,deleted_at:null,deleted_by:null },
    { contract_charge_id: 5, contract_id: 1, sys_unit_id: 1, payment_status_id: 2, charge_code: "202402-PF-001", due_date: new Date('2024-02-10'), amount: "160.00", payment_date: null, amount_pago: null, created_at: new Date(2024,1,1).toISOString(),updated_at:new Date(2024,1,1).toISOString(), convenio:null,due_month:"02",due_year:"2024",payd_month:null,payd_year:null,created_by:1,updated_by:1,deleted_at:null,deleted_by:null },
];

const mockBeneficiaries: BeneficiarySql[] = [
    { beneficiary_id: 1, contract_id: 1, sys_unit_id:1, name: "João Titular Silva", relationship: "Titular", is_primary: true, birth_at: new Date('1980-01-15'), document_id:1, is_alive:true, is_forbidden: false, gender_id:1, grace_at:null,created_at:new Date().toISOString(), updated_at:new Date().toISOString(),created_by:1,updated_by:1,deleted_at:null,deleted_by:null},
    { beneficiary_id: 2, contract_id: 1, sys_unit_id:1, name: "Maria Esposa Silva", relationship: "Cônjuge", is_primary: false, birth_at: new Date('1982-05-20'), document_id:2,is_alive:true, is_forbidden: false, gender_id:2, grace_at:null,created_at:new Date().toISOString(), updated_at:new Date().toISOString(),created_by:1,updated_by:1,deleted_at:null,deleted_by:null},
];

const paymentMethods = ["Dinheiro", "Cartão Débito", "Cartão Crédito", "PIX", "Boleto Bancário"];


export default function PaymentReceiptsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ContractSql[]>([]);
  const [selectedContract, setSelectedContract] = useState<ContractSql | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [contractCharges, setContractCharges] = useState<ContractChargeSql[]>([]);
  const [contractBeneficiaries, setContractBeneficiaries] = useState<BeneficiarySql[]>([]);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [defaultBillingNumber, setDefaultBillingNumber] = useState<string | null>(null);
  const [defaultPaymentAmount, setDefaultPaymentAmount] = useState<number>(0);

  const [isPrintReceiptDialogOpen, setIsPrintReceiptDialogOpen] = useState(false);
  const [receiptDataForPrint, setReceiptDataForPrint] = useState<PaymentReceiptSql & { contractHolderName?: string, receivedBy?: string, companyName?: string, unitName?: string } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);


  // Mock state for ordpgrc records
  const [mockOrdpgrcRecords, setMockOrdpgrcRecords] = useState<OrdpgrcSql[]>([]);
  // Mock current user (replace with actual context/auth data)
  const currentMockUser: SysUser = mockSysUsers[0]; // Assuming Alice is logged in
  const currentMockSysUnitId = 1; // Assuming Unit 1

  const paymentReceiptForm = useForm<InsertPaymentReceiptSql>({
    resolver: zodResolver(insertPaymentReceiptSchema),
    defaultValues: {
      billing_number: "",
      val_payment: 0,
      val_aux: null,
      due_date: new Date().toISOString().split('T')[0],
      method_pay: undefined,
      obs_pay: "",
      // contract_id, sys_unit_id etc. will be set before submission
    },
  });

  useEffect(() => {
    if (selectedContract && defaultBillingNumber) {
      paymentReceiptForm.reset({
        billing_number: defaultBillingNumber,
        val_payment: defaultPaymentAmount,
        val_aux: null,
        due_date: new Date().toISOString().split('T')[0],
        method_pay: paymentReceiptForm.getValues("method_pay") || undefined, // keep if already set
        obs_pay: paymentReceiptForm.getValues("obs_pay") || "",
        contract_id: selectedContract.contract_id,
        // Other fields can be set here or during submission logic
      });
    } else if (!selectedContract) {
        paymentReceiptForm.reset({
            billing_number: "", val_payment: 0, val_aux: null,
            due_date: new Date().toISOString().split('T')[0],
            method_pay: undefined, obs_pay: ""
        });
    }
  }, [selectedContract, defaultBillingNumber, defaultPaymentAmount, paymentReceiptForm]);


  const getOwnerName = (ownerId: number | null): string => {
    if (ownerId === null) return "N/A";
    return mockSysUsers.find(u => u.id === ownerId)?.name || `ID: ${ownerId}`;
  };

  const getStatusName = (statusId: number | null, type: "contract" | "payment"): string => {
    if (statusId === null) return "N/A";
    const list = type === "contract" ? mockContractStatuses : mockPaymentStatuses;
    // @ts-ignore
    return list.find(s => (type === "contract" ? s.status_id : s.payment_status_id) === statusId)?.name || `ID ${statusId}`;
  };


  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      toast({ title: "Atenção", description: "Por favor, insira um termo para busca.", variant: "default" });
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = initialMockContracts.filter(contract =>
      contract.contract_name.toLowerCase().includes(lowerSearchTerm) ||
      contract.contract_number.toLowerCase().includes(lowerSearchTerm) ||
      (contract.owner_id && getOwnerName(contract.owner_id).toLowerCase().includes(lowerSearchTerm))
    );
    setSearchResults(results);
    setShowResults(true);
    if (results.length === 0) {
        toast({ title: "Sem resultados", description: "Nenhum contrato encontrado para o termo buscado.", variant: "default" });
    }
  };

  const handleSelectContract = (contract: ContractSql) => {
    setSelectedContract(contract);
    const charges = mockContractCharges.filter(c => c.contract_id === contract.contract_id);
    setContractCharges(charges);
    const beneficiaries = mockBeneficiaries.filter(b => b.contract_id === contract.contract_id);
    setContractBeneficiaries(beneficiaries);

    const firstUnpaid = charges.filter(c => c.payment_status_id !== 1)
                               .sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
    setDefaultBillingNumber(firstUnpaid ? firstUnpaid.charge_code : "");
    setDefaultPaymentAmount(firstUnpaid ? parseFloat(firstUnpaid.amount) : 0);


    setShowResults(false);
    setSearchTerm("");
    toast({ title: "Contrato Selecionado", description: `${contract.contract_number} - ${contract.contract_name}`, variant: "success" });
  };

  const handleReceiptSubmit = (data: InsertPaymentReceiptSql) => {
    if (!selectedContract) {
      toast({ title: "Erro", description: "Nenhum contrato selecionado.", variant: "destructive" });
      return;
    }

    let ordpgrcIdToUse: number;
    let updatedOrdpgrcRecord: OrdpgrcSql | undefined;

    // Simulate ordpgrc logic
    const openOrdpgrc = mockOrdpgrcRecords.find(
      (record) =>
        record.sys_user_id === currentMockUser.id &&
        record.sys_unit_id === currentMockSysUnitId &&
        record.closing_date === null
    );

    if (openOrdpgrc) {
      ordpgrcIdToUse = openOrdpgrc.ordpgrc_id;
      updatedOrdpgrcRecord = {
        ...openOrdpgrc,
        total_amount: String(parseFloat(openOrdpgrc.total_amount) + (data.val_payment || 0)),
        number_receipt: (openOrdpgrc.number_receipt || 0) + 1,
        updated_at: new Date().toISOString(),
      };
      setMockOrdpgrcRecords(prev => prev.map(r => r.ordpgrc_id === ordpgrcIdToUse ? updatedOrdpgrcRecord! : r));
      console.log("Updated existing ordpgrc:", updatedOrdpgrcRecord);
    } else {
      const newOrdpgrcId = Math.max(0, ...mockOrdpgrcRecords.map(r => r.ordpgrc_id)) + 1;
      ordpgrcIdToUse = newOrdpgrcId;
      const newOrdpgrc: any = {
        ordpgrc_id: newOrdpgrcId,
        sys_unit_id: currentMockSysUnitId,
        sys_user_id: currentMockUser.sysUserId,
        sys_user_name: currentMockUser.login, // Using login as per requirement
        order_number: `ORD-${newOrdpgrcId}-${new Date().getFullYear()}`,
        order_date: new Date().toISOString(),
        total_amount: String(data.val_payment || 0),
        number_receipt: 1,
        closing_date: null,
        status: "ABERTO",
        created_at: new Date(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        created_by: currentMockUser.id,
        updated_by: currentMockUser.id,
        deleted_by: null,
      };
      setMockOrdpgrcRecords(prev => [...prev, newOrdpgrc]);
      updatedOrdpgrcRecord = newOrdpgrc;
      console.log("Created new ordpgrc:", newOrdpgrc);
    }

    const finalPaymentReceiptData = {
      ...data,
      contract_id: selectedContract.contract_id,
      sys_unit_id: currentMockSysUnitId,
      sys_user_id: currentMockUser.sysUserId,
      subsidiary_id: 1, // Mock, assuming a default subsidiary for the unit
      payment_status_id: 2, // Mock: Default to 'Pendente' or an initial processing status
      ordpgrc_id: ordpgrcIdToUse,
      cashier_number: updatedOrdpgrcRecord?.order_number.slice(-8) || `CX${ordpgrcIdToUse}`, // Example
      status: 'PR', // Mock 'Processado' or similar initial status for receipt
    };

    console.log("Final Payment Receipt Data for Submission:", finalPaymentReceiptData);
    // Here you would typically make an API call to save finalPaymentReceiptData
    // and potentially the updated/new ordpgrc record if not handled by backend triggers.

    // Prepare data for printing
    const receiptToPrint: PaymentReceiptSql & { contractHolderName?: string, receivedBy?: string, companyName?: string, unitName?: string } = {
        ...finalPaymentReceiptData, // This is the full payment receipt object
        payment_receipt_id: Math.floor(Math.random() * 100000), // Mock ID for receipt
        contractHolderName: getOwnerName(selectedContract.owner_id),
        receivedBy: currentMockUser.login,
        companyName: "Presserv", // Mock company name
        unitName: "Unidade Central", // Mock unit name
        // Ensure all fields from PaymentReceiptSql are present
        created_at: new Date(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        created_by: currentMockUser.id,
        updated_by: currentMockUser.id,
        deleted_by: null,

    };
    setReceiptDataForPrint(receiptToPrint);
    setIsPrintReceiptDialogOpen(true);

    toast({
      title: "Recebimento Registrado (Mock)",
      description: `Pagamento de R$ ${data.val_payment} para ${data.billing_number} associado ao caixa ${updatedOrdpgrcRecord?.order_number}.`,
      variant: "success",
    });
    // Reset form, clear selected contract, etc.
    paymentReceiptForm.reset({
        billing_number: "", val_payment: 0, val_aux: null,
        due_date: new Date().toISOString().split('T')[0],
        method_pay: undefined, obs_pay: ""
    });
    setSelectedContract(null);
    setDefaultBillingNumber(null);
    setDefaultPaymentAmount(0);
  };

  const getPaymentStatusBadgeVariant = (statusId: number | null) => {
    const status = mockPaymentStatuses.find(s => s.payment_status_id === statusId);
    if (status?.code === 'PG') return 'default';
    if (status?.code === 'VE') return 'destructive';
    if (status?.code === 'PE') return 'outline';
    return 'secondary';
  };

  const valPayment = paymentReceiptForm.watch("val_payment");
  const valAux = paymentReceiptForm.watch("val_aux");

  const changeAmount = useMemo(() => {
    const paid = typeof valPayment === 'number' ? valPayment : parseFloat(String(valPayment) || "0"); // Handle string from form
    const given = typeof valAux === 'number' ? valAux : parseFloat(String(valAux) || "0"); // Handle string from form
    if (given > 0 && given >= paid) {
      return (given - paid).toFixed(2);
    }
    return null;
  }, [valPayment, valAux]);


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="neu-card rounded-3xl p-6 md:p-8 mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
              Lançamento de Recebimentos (Atendimento)
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              Registre pagamentos recebidos para contratos.
            </p>
          </div>

          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle>Registrar Novo Recebimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 neu-flat rounded-xl space-y-4">
                <h2 className="text-lg font-semibold mb-3">1. Localizar Contrato</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por Nº Contrato, Nome do Titular, Nome do Contrato..."
                      className="neu-input pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} className="neu-button neu-button-primary">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                {showResults && searchResults.length > 0 && (
                  <div className="mt-4 neu-inset p-4 rounded-lg max-h-60 overflow-y-auto">
                    <h3 className="text-md font-semibold mb-2">Resultados da Busca:</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nº Contrato</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Titular</TableHead>
                          <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map(contract => (
                          <TableRow key={contract.contract_id} className="hover:bg-muted/20">
                            <TableCell>{contract.contract_number}</TableCell>
                            <TableCell>{contract.contract_name}</TableCell>
                            <TableCell>{getOwnerName(contract.owner_id)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => handleSelectContract(contract)}
                                className="neu-button neu-button-success h-8"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Selecionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                 {showResults && searchResults.length === 0 && searchTerm.trim() !== "" && (
                    <p className="mt-4 text-sm text-muted-foreground neu-inset p-3 rounded-lg">
                        Nenhum contrato encontrado para "{searchTerm}".
                    </p>
                )}
              </div>

              <div className="p-4 neu-flat rounded-xl">
                <h2 className="text-lg font-semibold mb-3">2. Informações do Contrato</h2>
                {selectedContract ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Nº Contrato:</strong> {selectedContract.contract_number}</div>
                        <div><strong>Nome:</strong> {selectedContract.contract_name}</div>
                        <div><strong>Titular:</strong> {getOwnerName(selectedContract.owner_id)}</div>
                        <div><strong>Status:</strong> <Badge className="neu-flat" variant={selectedContract.status_id === 1 ? "default" : "secondary"}>{getStatusName(selectedContract.status_id, "contract")}</Badge></div>
                        <div><strong>Início:</strong> {new Date(selectedContract.start_date).toLocaleDateString()}</div>
                        <div><strong>Fim:</strong> {selectedContract.end_date ? new Date(selectedContract.end_date).toLocaleDateString() : "Indeterminado"}</div>
                    </div>

                    <Button onClick={() => setIsBeneficiaryModalOpen(true)} variant="outline" className="neu-button text-sm mt-2">
                        <Users className="w-4 h-4 mr-2"/> Ver Beneficiários ({contractBeneficiaries.length})
                    </Button>

                    <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-green-500"/>Últimas Cobranças Pagas (Máx. 3)</h4>
                        {contractCharges.filter(c => c.payment_status_id === 1).slice(-3).length > 0 ? (
                             <div className="overflow-x-auto neu-inset rounded-lg p-2">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Cód.</TableHead><TableHead>Venc.</TableHead><TableHead>Valor</TableHead><TableHead>Pagto.</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                    {contractCharges.filter(c => c.payment_status_id === 1).slice(-3).map(charge => (
                                        <TableRow key={charge.contract_charge_id}>
                                            <TableCell>{charge.charge_code}</TableCell>
                                            <TableCell>{new Date(charge.due_date).toLocaleDateString()}</TableCell>
                                            <TableCell>R$ {charge.amount}</TableCell>
                                            <TableCell>{charge.payment_date ? new Date(charge.payment_date).toLocaleDateString() : '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : <p className="text-xs text-muted-foreground">Nenhuma cobrança paga recentemente.</p>}
                    </div>
                     <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-orange-500"/>Próximas Cobranças / Em Aberto (Máx. 3)</h4>
                        {contractCharges.filter(c => c.payment_status_id !== 1).slice(0,3).length > 0 ? (
                            <div className="overflow-x-auto neu-inset rounded-lg p-2">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Cód.</TableHead><TableHead>Venc.</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                    {contractCharges.filter(c => c.payment_status_id !== 1).sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).slice(0,3).map((charge, idx) => (
                                        <TableRow key={charge.contract_charge_id} className={idx === 0 && defaultBillingNumber === charge.charge_code ? "bg-blue-100 dark:bg-blue-900/30" : ""}>
                                            <TableCell>{charge.charge_code} {idx === 0 && defaultBillingNumber === charge.charge_code && <Badge className="ml-2 neu-flat" variant="outline">Pagar esta</Badge>}</TableCell>
                                            <TableCell>{new Date(charge.due_date).toLocaleDateString()}</TableCell>
                                            <TableCell>R$ {charge.amount}</TableCell>
                                            <TableCell><Badge className="neu-flat" variant={getPaymentStatusBadgeVariant(charge.payment_status_id)}>{getStatusName(charge.payment_status_id, "payment")}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : <p className="text-xs text-muted-foreground">Nenhuma cobrança em aberto.</p>}
                    </div>

                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum contrato selecionado.</p>
                )}
              </div>

              <div className="p-4 neu-flat rounded-xl">
                <h2 className="text-lg font-semibold mb-3">3. Detalhes do Recebimento</h2>
                {selectedContract ? (
                  <Form {...paymentReceiptForm}>
                    <form onSubmit={paymentReceiptForm.handleSubmit(handleReceiptSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={paymentReceiptForm.control}
                          name="billing_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Identificação da Cobrança*</FormLabel>
                              <FormControl>
                                <Input className="neu-input" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentReceiptForm.control}
                          name="due_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data do Pagamento*</FormLabel>
                              <FormControl>
                                <Input type="date" className="neu-input" {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={paymentReceiptForm.control}
                          name="val_payment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Pago R$*</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" className="neu-input"
                                  {...field}
                                  value={field.value === null || field.value === undefined ? "" : field.value}
                                  onChange={e => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentReceiptForm.control}
                          name="val_aux"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Entregue R$ (p/ Troco)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" className="neu-input"
                                 {...field}
                                 value={field.value === null || field.value === undefined ? "" : field.value}
                                 onChange={e => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                                />
                              </FormControl>
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
                        control={paymentReceiptForm.control}
                        name="method_pay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Método de Pagamento*</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input">
                                  <SelectValue placeholder="Selecione o método" />
                                </SelectTrigger>
                              </FormControl>
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
                        control={paymentReceiptForm.control}
                        name="obs_pay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações do Recebimento</FormLabel>
                            <FormControl>
                              <Textarea className="neu-input" placeholder="Detalhes adicionais sobre o pagamento..." {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="flex justify-end pt-4">
                          <Button type="submit" className="neu-button neu-button-primary w-full md:w-auto" disabled={!selectedContract}>
                            <ReceiptIcon className="w-4 h-4 mr-2" />
                            Confirmar Recebimento
                          </Button>
                        </div>
                    </form>
                  </Form>
                ) : (
                  <p className="text-sm text-muted-foreground">Selecione um contrato para registrar um recebimento.</p>
                )}
              </div>
            </CardContent>
          </Card>

           {/* Beneficiaries Modal */}
            <Dialog open={isBeneficiaryModalOpen} onOpenChange={setIsBeneficiaryModalOpen}>
                <DialogContent className="neu-card max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center"><Users className="w-5 h-5 mr-2"/>Beneficiários do Contrato: {selectedContract?.contract_number}</DialogTitle>
                        <DialogDescription>Lista de beneficiários associados ao contrato selecionado.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto neu-inset p-2 rounded-lg">
                        <Table>
                            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Parentesco</TableHead><TableHead>Nascimento</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {contractBeneficiaries.length > 0 ? contractBeneficiaries.map(ben => (
                                    <TableRow key={ben.beneficiary_id} className="hover:bg-muted/20">
                                        <TableCell>{ben.name} {ben.is_primary && <Badge variant="outline" className="ml-1 neu-flat text-xs">Titular</Badge>}</TableCell>
                                        <TableCell>{ben.relationship}</TableCell>
                                        <TableCell>{ben.birth_at ? new Date(ben.birth_at).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell><Badge className="neu-flat" variant={ben.is_alive ? "default" : "destructive"}>{ben.is_alive ? "Vivo" : "Falecido"}</Badge></TableCell>
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4">Nenhum beneficiário encontrado.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                     <DialogFooter className="pt-4">
                        <Button onClick={() => setIsBeneficiaryModalOpen(false)} className="neu-button">Fechar</Button>
                     </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Print Receipt Dialog */}
            {receiptDataForPrint && (
            <Dialog open={isPrintReceiptDialogOpen} onOpenChange={setIsPrintReceiptDialogOpen}>
                <DialogContent className="neu-card sm:max-w-md print:shadow-none print:border-none">
                    <DialogHeader>
                        <DialogTitle className="flex items-center print:hidden"><ReceiptIcon className="w-5 h-5 mr-2"/>Recibo de Pagamento</DialogTitle>
                        <DialogDescription className="print:hidden">Confira os dados e imprima o recibo.</DialogDescription>
                    </DialogHeader>
                    <div ref={printRef} className="py-2 px-1 text-sm printable-area bg-white text-black">
                        <style type="text/css" media="print">{"@page { size: auto;  margin: 0.5cm; } body { -webkit-print-color-adjust: exact; }"} </style>
                        <div className="text-center mb-3">
                            <h3 className="font-bold text-base">{receiptDataForPrint.companyName || "Nome da Empresa"}</h3>
                            <p className="text-xs">{receiptDataForPrint.unitName || "Endereço da Unidade"}</p>
                        </div>
                        <h4 className="font-semibold text-center mb-3 text-base">RECIBO DE PAGAMENTO #{receiptDataForPrint.payment_receipt_id}</h4>
                        <div className="space-y-0.5 mb-2 text-xs">
                            <p><strong>Data/Hora:</strong> {new Date(receiptDataForPrint.due_date).toLocaleString('pt-BR')}</p>
                            <p><strong>Contrato:</strong> {selectedContract?.contract_number} - {receiptDataForPrint.contractHolderName}</p>
                            <p><strong>Referência Paga:</strong> {receiptDataForPrint.billing_number}</p>
                        </div>
                        <div className="space-y-0.5 mb-2 border-t border-b py-1 border-dashed border-gray-400 text-xs">
                            <p><strong>Valor Pago:</strong> R$ {Number(receiptDataForPrint.val_payment).toFixed(2)}</p>
                            <p><strong>Método:</strong> {receiptDataForPrint.method_pay}</p>
                        </div>
                        <div className="space-y-0.5 text-xs">
                            <p><strong>Recebido por:</strong> {receiptDataForPrint.receivedBy}</p>
                            {receiptDataForPrint.obs_pay && <p><strong>Observações:</strong> {receiptDataForPrint.obs_pay}</p>}
                        </div>
                        <div className="mt-6 text-center text-xs">
                            <p className="mb-1">_________________________________________</p>
                            <p>Assinatura do Responsável</p>
                        </div>
                         <div className="mt-4 text-center text-xs border-t border-dashed border-gray-400 pt-2">
                            <p>Obrigado pela preferência!</p>
                        </div>
                    </div>
                    <DialogFooter className="pt-4 print:hidden">
                        <Button variant="outline" onClick={() => setIsPrintReceiptDialogOpen(false)} className="neu-button">Fechar</Button>
                        <Button
                            onClick={() => {
                                const printContents = printRef.current?.innerHTML;
                                const originalContents = document.body.innerHTML;
                                if (printContents && printRef.current) {
                                    const printableStylesheet = Array.from(document.styleSheets).reduce((acc, sheet) => {
                                      try { // Adding try-catch for potential CORS issues with external stylesheets
                                        if (sheet.cssRules) { // Check if cssRules is accessible
                                          acc += Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                                        }
                                      } catch (e) {
                                        console.warn("Could not access CSS rules from stylesheet:", sheet.href, e);
                                      }
                                      return acc;
                                    }, '');

                                    const printWindow = window.open('', '', 'height=600,width=800');
                                    if(printWindow){
                                        printWindow.document.write('<html><head><title>Recibo</title>');
                                        printWindow.document.write('<style>');
                                        printWindow.document.write(printableStylesheet); // basic tailwind/browser styles
                                        printWindow.document.write(`
                                          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                                          .printable-area { width: 100%; }
                                          strong { font-weight: bold; }
                                          .text-center { text-align: center; }
                                          .mb-1 { margin-bottom: 0.25rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-3 { margin-bottom: 0.75rem; } .mb-4 { margin-bottom: 1rem; }
                                          .mt-4 { margin-top: 1rem; } .mt-6 { margin-top: 1.5rem; } .mt-8 { margin-top: 2rem; }
                                          .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; } .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                                          .pt-2 { padding-top: 0.5rem; }
                                          .text-xs { font-size: 0.75rem; line-height: 1rem; }
                                          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                                          .text-base { font-size: 1rem; line-height: 1.5rem; }
                                          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                                          .font-bold { font-weight: 700; } .font-semibold { font-weight: 600; }
                                          .border-t { border-top-width: 1px; } .border-b { border-bottom-width: 1px; }
                                          .border-dashed { border-style: dashed; } .border-gray-400 { border-color: #9ca3af; }
                                          .space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.125rem; margin-bottom: 0.125rem; }
                                          .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
                                        `); // Minimal inline styles
                                        printWindow.document.write('</style></head><body>');
                                        printWindow.document.write(printContents);
                                        printWindow.document.write('</body></html>');
                                        printWindow.document.close();
                                        printWindow.focus();
                                        printWindow.print();
                                        // printWindow.close(); // Can be closed by user or automatically after timeout
                                    }
                                }
                            }}
                            className="neu-button neu-button-primary"
                        >
                            <Printer className="w-4 h-4 mr-2"/> Imprimir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            )}

        </main>
      </div>
    </div>
  );
}


