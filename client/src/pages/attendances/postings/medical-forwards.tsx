import React, { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, FileText, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MedicalForwardFormDialog } from "@/components/attendances/MedicalForwardFormDialog";
import {
  MedicalFowardSql,
  InsertMedicalFowardSql,
  PerformedServiceSql,
  OrdpgrcSql, // Added for ordpgrc logic
} from "@/lib/contracts-schema";
import { Partner, SysUser } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


// Mock data for related entities (Partners, PerformedServices)
const mockPartners: Partner[] = [
  { id: 1, partnerName: "Clínica Saúde Total", partnerCode: "P001", companyId:1, sysUnitId:1, sysUserId:1, partnerTypeId:1, specialtyId:1, billingAddressId:1, shippingAddressId:1, active:true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
  { id: 2, partnerName: "Laboratório Vida & Imagem", partnerCode: "P002", companyId:1, sysUnitId:1, sysUserId:1, partnerTypeId:1, specialtyId:1, billingAddressId:1, shippingAddressId:1, active:true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockPerformedServices: PerformedServiceSql[] = [
  { performed_service_id: 1, service_type_id: 1 /*, name: "Consulta Clínica Geral"*/ },
  { performed_service_id: 2, service_type_id: 2 /*, name: "Exame de Sangue Completo"*/ },
];

const initialMockMedicalForwards: MedicalFowardSql[] = [
  {
    medical_foward_id: 1, sys_unit_id: 1, sys_user_id: 1, partner_id: 1, performed_service_id: 1,
    observation: "Paciente com dor de cabeça persistente. Encaminhado para avaliação.",
    val_payment: null, val_aux: null, due_date: "2024-05-10", cashier_number: null, method_pay: null, obs_pay: null,
    ordpgrc_id: 101, // Mock ordpgrc_id
    created_at: new Date().toISOString(), updatedAt: new Date().toISOString(), deleted_at: null, created_by:1, updated_by:1, deleted_by: null,
  },
  {
    medical_foward_id: 2, sys_unit_id: 1, sys_user_id: 1, partner_id: 2, performed_service_id: 2,
    observation: "Solicitação de hemograma completo para check-up anual.",
    val_payment: "50.00", val_aux: "50.00", due_date: "2024-05-15", cashier_number: "CX001", method_pay: "Dinheiro", obs_pay: "Pago no ato.",
    ordpgrc_id: 102, // Mock ordpgrc_id
    created_at: new Date().toISOString(), updatedAt: new Date().toISOString(), deleted_at: null, created_by:1, updated_by:1, deleted_by: null,
  },
];

export default function MedicalForwardsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [medicalForwards, setMedicalForwards] = useState<MedicalFowardSql[]>(initialMockMedicalForwards);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingMedicalForward, setEditingMedicalForward] = useState<MedicalFowardSql | null>(null);

  // Mock state for ordpgrc records, similar to payment-receipts.tsx
  const [mockOrdpgrcRecords, setMockOrdpgrcRecords] = useState<OrdpgrcSql[]>([]);
  // Mock current user (replace with actual context/auth data if available)
  const currentMockUser: SysUser = mockSysUsers[0] || { id: 1, name: "Default User", login: "user", email:"user@example.com", passwordHash:"", active:true, isAdmin:false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; // Added fallback
  const currentMockSysUnitId = 1; // Assuming Unit 1


  const handleCreateNew = () => {
    setEditingMedicalForward(null);
    setIsFormDialogOpen(true);
  };

  const handleEdit = (mf: MedicalFowardSql) => {
    setEditingMedicalForward(mf);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setMedicalForwards(prev => prev.filter(mf => mf.medical_foward_id !== id));
    toast({ title: "Sucesso", description: "Guia médica excluída com sucesso." });
  };

  const handleFormSubmit = (data: InsertMedicalFowardSql) => {
    let ordpgrcIdToUse: number;
    let finalCashierNumber: string | null = data.cashier_number || null;
    let finalOrdpgrcRecordDetails = "N/A (sem pagamento)";

    if (data.val_payment && data.val_payment > 0) {
      const openOrdpgrc = mockOrdpgrcRecords.find(
        (record) =>
          record.sys_user_id === currentMockUser.id &&
          record.sys_unit_id === currentMockSysUnitId &&
          record.closing_date === null
      );

      if (openOrdpgrc) {
        ordpgrcIdToUse = openOrdpgrc.ordpgrc_id;
        const updatedRecord = {
          ...openOrdpgrc,
          total_amount: String(parseFloat(openOrdpgrc.total_amount) + (data.val_payment || 0)),
          number_receipt: (openOrdpgrc.number_receipt || 0) + 1,
          updated_at: new Date().toISOString(),
        };
        setMockOrdpgrcRecords(prev => prev.map(r => r.ordpgrc_id === ordpgrcIdToUse ? updatedRecord : r));
        finalCashierNumber = updatedRecord.order_number.slice(-8);
        finalOrdpgrcRecordDetails = `Caixa ${updatedRecord.order_number} atualizado.`;
        console.log("Updated existing ordpgrc:", updatedRecord);
      } else {
        const newOrdpgrcId = Math.max(0, ...mockOrdpgrcRecords.map(r => r.ordpgrc_id)) + 1;
        ordpgrcIdToUse = newOrdpgrcId;
        const newOrdpgrc: OrdpgrcSql = {
          ordpgrc_id: newOrdpgrcId,
          sys_unit_id: currentMockSysUnitId,
          sys_user_id: currentMockUser.id,
          sys_user_name: currentMockUser.login,
          order_number: `ORD-GUIA-${newOrdpgrcId}-${new Date().getFullYear()}`,
          order_date: new Date().toISOString(),
          total_amount: String(data.val_payment || 0),
          number_receipt: 1,
          closing_date: null,
          status: "ABERTO",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          created_by: currentMockUser.id,
          updated_by: currentMockUser.id,
          deleted_by: null,
        };
        setMockOrdpgrcRecords(prev => [...prev, newOrdpgrc]);
        finalCashierNumber = newOrdpgrc.order_number.slice(-8);
        finalOrdpgrcRecordDetails = `Novo caixa ${newOrdpgrc.order_number} aberto.`;
        console.log("Created new ordpgrc:", newOrdpgrc);
      }
    } else {
      // If no payment, ordpgrc_id might need to be a dummy/system one or nullable
      // For now, let's assume it must exist due to NOT NULL constraint.
      // This might mean a "session" ordpgrc or a specific one for non-paid items.
      // For this mock, we'll assign a placeholder if no payment.
      // This needs clarification based on business rules for `medical_foward.ordpgrc_id NOT NULL`.
      // If all medical_foward must have an ordpgrc, we might need to create a "0-value" one or link to a generic one.
      // For simplicity here, if no payment, we'll use a placeholder.
      // A real system might require a specific handling for this.
      const placeholderOrdpgrcId = -1; // Indicates no specific financial transaction ordpgrc
      ordpgrcIdToUse = data.ordpgrc_id || placeholderOrdpgrcId; // Keep if provided, else placeholder
      if (!data.ordpgrc_id) { // Only if not already set (e.g. during edit)
          console.warn("No payment made for medical forward, using placeholder ordpgrc_id. Review business logic for NOT NULL constraint.");
      }
    }

    const submissionData: InsertMedicalFowardSql = {
        ...data,
        ordpgrc_id: ordpgrcIdToUse,
        cashier_number: finalCashierNumber,
        sys_unit_id: data.sys_unit_id || currentMockSysUnitId,
        sys_user_id: data.sys_user_id || currentMockUser.id,
    };

    console.log("Medical Forward Data for Submission:", submissionData);

    if (editingMedicalForward) {
      setMedicalForwards(prev => prev.map(mf => mf.medical_foward_id === editingMedicalForward.medical_foward_id
        ? { ...editingMedicalForward, ...submissionData, updated_at: new Date().toISOString() } as MedicalFowardSql
        : mf
      ));
      toast({ title: "Sucesso", description: "Guia médica atualizada com sucesso." });
    } else {
      const newMedicalForward: MedicalFowardSql = {
        ...initialMockMedicalForwards[0], // Base with all fields from MedicalFowardSql for type safety
        ...submissionData,
        medical_foward_id: Math.max(0, ...medicalForwards.map(mf => mf.medical_foward_id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMedicalForwards(prev => [newMedicalForward, ...prev]);
      toast({ title: "Sucesso", description: `Nova guia médica emitida. ${data.val_payment && data.val_payment > 0 ? finalOrdpgrcRecordDetails : ''}` });
    }
    setIsFormDialogOpen(false);
    setEditingMedicalForward(null);
  };

  const getPartnerName = (partnerId: number) => mockPartners.find(p => p.id === partnerId)?.partnerName || `ID ${partnerId}`;
  const getServiceName = (serviceId: number) => {
    const service = mockPerformedServices.find(s => s.performed_service_id === serviceId);
    return service ? `Serviço ID ${service.performed_service_id} (Tipo ${service.service_type_id})` : `ID ${serviceId}`;
  };

  const filteredMedicalForwards = medicalForwards.filter(mf =>
    mf.observation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPartnerName(mf.partner_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(mf.medical_foward_id).includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="neu-card rounded-3xl p-6 md:p-8 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2 flex items-center">
                        <FileText className="w-7 h-7 mr-3 text-primary" />
                        Emissão de Guias Médicas
                    </h1>
                    <p className="text-sm md:text-lg text-muted-foreground">
                        Gerencie e emita guias de encaminhamento médico.
                    </p>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                        placeholder="Buscar por ID, parceiro, observação..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="neu-input pl-10 w-full md:w-72"
                        // onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Search on type for now
                        />
                    </div>
                    <Button onClick={handleCreateNew} className="neu-button neu-button-primary whitespace-nowrap">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Guia
                    </Button>
                </div>
            </div>
          </div>

          <Card className="neu-card rounded-3xl">
            <CardHeader>
              <CardTitle>Guias Emitidas</CardTitle>
              <CardDescription>Lista de todas as guias médicas emitidas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto neu-flat rounded-xl">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Guia</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Parceiro</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Valor Pago</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicalForwards.length > 0 ? (
                      filteredMedicalForwards.map(mf => (
                        <TableRow key={mf.medical_foward_id} className="hover:bg-muted/20">
                          <TableCell>{mf.medical_foward_id}</TableCell>
                          <TableCell>{mf.due_date ? new Date(mf.due_date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>{getPartnerName(mf.partner_id)}</TableCell>
                          <TableCell>{getServiceName(mf.performed_service_id)}</TableCell>
                          <TableCell>{mf.val_payment ? `R$ ${parseFloat(mf.val_payment).toFixed(2)}` : "-"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="icon" className="neu-button neu-button-secondary h-8 w-8" onClick={() => handleEdit(mf)}><Edit className="w-4 h-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="neu-button neu-button-danger h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="neu-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>Tem certeza que deseja excluir a guia ID {mf.medical_foward_id}?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="neu-button">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction className="neu-button neu-button-danger" onClick={() => handleDelete(mf.medical_foward_id)}>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">Nenhuma guia emitida encontrada.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {isFormDialogOpen && (
            <MedicalForwardFormDialog
                isOpen={isFormDialogOpen}
                onOpenChange={setIsFormDialogOpen}
                medicalForward={editingMedicalForward}
                onSubmit={handleFormSubmit}
            />
            )}
        </main>
      </div>
    </div>
  );
}
