import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, Users, AlertTriangle, DollarSign, ReceiptIcon, Printer } from "lucide-react";
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

import {
  insertPaymentReceiptSchema,
  SysUser,
  Contract,
  ContractCharge,
  Beneficiary,
  PaymentStatus,
  PaymentReceipt
} from "@shared/schema";
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

const paymentMethods = ["Dinheiro", "Cartão Débito", "Cartão Crédito", "PIX", "Boleto Bancário"];

export default function PaymentReceiptsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [contractCharges, setContractCharges] = useState<ContractCharge[]>([]);
  const [contractBeneficiaries, setContractBeneficiaries] = useState<Beneficiary[]>([]);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [defaultBillingNumber, setDefaultBillingNumber] = useState<string | null>(null);
  const [defaultPaymentAmount, setDefaultPaymentAmount] = useState<number>(0);

  const [isPrintReceiptDialogOpen, setIsPrintReceiptDialogOpen] = useState(false);
  const [receiptDataForPrint, setReceiptDataForPrint] = useState<PaymentReceipt | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const paymentReceiptForm = useForm<any>({
    resolver: zodResolver(insertPaymentReceiptSchema),
    defaultValues: {
      billingNumber: "",
      valPayment: 0,
      valAux: null,
      dueDate: new Date().toISOString().split('T')[0],
      methodPay: undefined,
      obsPay: "",
    },
  });

  const handleSearch = () => {
    toast({ title: "Atenção", description: "Busca não implementada nesta versão.", variant: "default" });
  };

  const handleSelectContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowResults(false);
    setSearchTerm("");
  };

  const handleReceiptSubmit = (data: any) => {
    toast({
      title: "Recebimento Registrado",
      description: `Pagamento de R$ ${data.valPayment} registrado com sucesso.`,
      variant: "success",
    });
  };

  const valPayment = paymentReceiptForm.watch("valPayment");
  const valAux = paymentReceiptForm.watch("valAux");

  const changeAmount = useMemo(() => {
    const paid = typeof valPayment === 'number' ? valPayment : 0;
    const given = typeof valAux === 'number' ? valAux : 0;
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
              Lançamento de Recebimentos
            </h1>
          </div>

          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle>Registrar Novo Recebimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <p>Selecione um contrato e preencha os dados do pagamento.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
