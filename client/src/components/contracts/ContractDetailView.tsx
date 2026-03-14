import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { Plus, Edit, Trash2, Users, FileText, MapPin, Paperclip, History, DollarSign } from "lucide-react";

import {
  ContractSql,
  BeneficiarySql,
  ContractChargeSql,
  ContractAddendumSql,
  ContractStatusHistorySql,
  // Assuming these types exist or are defined in contracts-schema for status mapping
  ContractStatusSql,
  PaymentStatusSql,
} from "@/lib/contracts-schema";
import { Document, Address } from "../../../../shared/schema";

// Mock data for status mapping (replace with actual data or props)
const mockContractStatuses: ContractStatusSql[] = [
  { status_id: 1, name: "Ativo", code: "AT", generate_charge: true, allows_service: true },
  { status_id: 2, name: "Suspenso", code: "SU", generate_charge: false, allows_service: false },
  { status_id: 3, name: "Cancelado", code: "CA", generate_charge: false, allows_service: false },
];

const mockPaymentStatuses: PaymentStatusSql[] = [
  { payment_status_id: 1, name: "Pago", code: "PG" },
  { payment_status_id: 2, name: "Pendente", code: "PE" },
  { payment_status_id: 3, name: "Vencido", code: "VE" },
  { payment_status_id: 4, name: "Cancelado", code: "CA" },
];


// MOCK DATA (Remove when integrating real data)
const mockBeneficiaries: BeneficiarySql[] = [
  { beneficiary_id: 1, sys_unit_id: 1, contract_id: 1, relationship: "Titular", is_primary: true, name: "João Titular Silva", birth_at: "1980-01-15", document_id: 1, is_alive: true, created_at: new Date().toISOString(),is_forbidden:false,gender_id:1,grace_at:null, created_by:null, updated_by:null, deleted_by:null, deleted_at:null,updated_at:new Date().toISOString() },
  { beneficiary_id: 2, sys_unit_id: 1, contract_id: 1, relationship: "Cônjuge", is_primary: false, name: "Maria Esposa Silva", birth_at: "1982-05-20", document_id: 2, is_alive: true, created_at: new Date().toISOString(),is_forbidden:false,gender_id:2,grace_at:null, created_by:null, updated_by:null, deleted_by:null, deleted_at:null,updated_at:new Date().toISOString() },
];
const mockCharges: ContractChargeSql[] = [
  { contract_charge_id: 1, contract_id: 1, sys_unit_id: 1, payment_status_id: 1, charge_code: "MENSAL-01-2024", due_date: "2024-01-10", amount: "150.00", payment_date: "2024-01-08", amount_pago: "150.00", created_at: new Date().toISOString(), convenio:null, due_month:null, due_year:null,payd_month:null,payd_year:null, created_by:null,updated_by:null,deleted_by:null,deleted_at:null,updated_at:new Date().toISOString() },
  { contract_charge_id: 2, contract_id: 1, sys_unit_id: 1, payment_status_id: 2, charge_code: "MENSAL-02-2024", due_date: "2024-02-10", amount: "150.00", created_at: new Date().toISOString(), payment_date:null, amount_pago:null,convenio:null, due_month:null, due_year:null,payd_month:null,payd_year:null, created_by:null,updated_by:null,deleted_by:null,deleted_at:null,updated_at:new Date().toISOString() },
];
const mockDocuments: Document[] = [
  { id: 1, documentTypeId: 1, title: "Contrato Assinado", fileName: "contrato_assinado.pdf", filePath: "/docs/contrato_assinado.pdf", createdAt: new Date().toISOString(), description: "Contrato principal assinado", mimeType:"application/pdf", fileSize: 1024, status:"active", tags:"", uploadedBy:1, version:"1.0", updatedAt: new Date().toISOString() },
];
const mockAddresses: Address[] = [
  { id: 1, street: "Rua Principal", number: "123", city: "Cidade Exemplo", state: "EX", zipCode: "12345-678", createdAt: new Date().toISOString(), active:true, neighborhood: "Centro", complement:null, country:"Brasil",updatedAt:new Date().toISOString() },
];
const mockAddendums: ContractAddendumSql[] = [
  { caddendum_id: 1, contract_id: 1, addendum_id: 1, name: "Serviço VIP Translado", product_code: "VIPTRANS", created_at: new Date().toISOString(), sys_unit_id:1,created_by:null,updated_by:null,deleted_by:null,deleted_at:null,updated_at:new Date().toISOString() },
];
const mockStatusHistory: ContractStatusHistorySql[] = [
  { c_status_history_id: 1, status_possible_id: 1, status_reason_id: 1, contract_id: 1, contract_number: "C001", detail_status: "Contrato Ativado", changed_at: new Date().toISOString(), created_at: new Date().toISOString(), created_by:null,updated_by:null,deleted_by:null,deleted_at:null,updated_at:new Date().toISOString() },
  { c_status_history_id: 2, status_possible_id: 2, status_reason_id: 2, contract_id: 1, contract_number: "C001", detail_status: "Suspenso por falta de pagamento", changed_at: new Date().toISOString(), created_at: new Date().toISOString(), created_by:null,updated_by:null,deleted_by:null,deleted_at:null,updated_at:new Date().toISOString() },
];


interface ContractDetailViewProps {
  contract: ContractSql;
  beneficiaries?: BeneficiarySql[];
  charges?: ContractChargeSql[];
  documents?: Document[];
  addresses?: Address[];
  addendums?: ContractAddendumSql[];
  statusHistory?: ContractStatusHistorySql[];
}

export function ContractDetailView({
  contract,
  beneficiaries = mockBeneficiaries,
  charges = mockCharges,
  documents = mockDocuments,
  addresses = mockAddresses,
  addendums = mockAddendums,
  statusHistory = mockStatusHistory,
}: ContractDetailViewProps) {

  const getStatusName = (statusId: number, type: "contract" | "payment") => {
    if (type === "contract") {
      return mockContractStatuses.find(s => s.status_id === statusId)?.name || `ID ${statusId}`;
    }
    return mockPaymentStatuses.find(s => s.payment_status_id === statusId)?.name || `ID ${statusId}`;
  };

  const handleAddBeneficiary = () => alert("Adicionar Beneficiário (TODO)");
  const handleEditBeneficiary = (id: number) => alert(`Editar Beneficiário ${id} (TODO)`);
  const handleDeleteBeneficiary = (id: number) => alert(`Excluir Beneficiário ${id} (TODO)`);

  const handleAddDocument = () => alert("Adicionar Documento (TODO)");
  const handleEditDocument = (id: number) => alert(`Editar Documento ${id} (TODO)`);
  const handleDeleteDocument = (id: number) => alert(`Excluir Documento ${id} (TODO)`);

  const handleAddAddress = () => alert("Adicionar Endereço (TODO)");
  const handleEditAddress = (id: number) => alert(`Editar Endereço ${id} (TODO)`);
  const handleDeleteAddress = (id: number) => alert(`Excluir Endereço ${id} (TODO)`);

  const handleAddAddendum = () => alert("Adicionar Aditivo (TODO)");
  const handleEditAddendum = (id: number) => alert(`Editar Aditivo ${id} (TODO)`);
  const handleDeleteAddendum = (id: number) => alert(`Excluir Aditivo ${id} (TODO)`);


  return (
    <div className="neu-flat rounded-xl p-4 md:p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">
          Detalhes do Contrato: {contract.contract_number} - {contract.contract_name}
        </h3>
      </div>

      <Tabs defaultValue="beneficiaries" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 neu-flat rounded-xl p-1 mb-4">
          <TabsTrigger value="beneficiaries" className="neu-button data-[state=active]:neu-pressed rounded-lg">
            <Users className="h-4 w-4 mr-2" /> Beneficiários
          </TabsTrigger>
          <TabsTrigger value="charges" className="neu-button data-[state=active]:neu-pressed rounded-lg">
            <DollarSign className="h-4 w-4 mr-2" /> Cobranças
          </TabsTrigger>
          <TabsTrigger value="documents" className="neu-button data-[state=active]:neu-pressed rounded-lg">
            <FileText className="h-4 w-4 mr-2" /> Documentos
          </TabsTrigger>
          <TabsTrigger value="addresses" className="neu-button data-[state=active]:neu-pressed rounded-lg">
            <MapPin className="h-4 w-4 mr-2" /> Endereços
          </TabsTrigger>
          <TabsTrigger value="addendums" className="neu-button data-[state=active]:neu-pressed rounded-lg">
            <Paperclip className="h-4 w-4 mr-2" /> Aditivos
          </TabsTrigger>
          <TabsTrigger value="history" className="neu-button data-[state=active]:neu-pressed rounded-lg">
            <History className="h-4 w-4 mr-2" /> Histórico Status
          </TabsTrigger>
        </TabsList>

        {/* Beneficiaries Tab */}
        <TabsContent value="beneficiaries">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Beneficiários</span>
                <Button size="sm" onClick={handleAddBeneficiary} className="neu-button neu-button-primary">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar
                </Button>
              </CardTitle>
              <CardDescription>Lista de todos os beneficiários associados a este contrato.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto neu-flat rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Parentesco</TableHead>
                      <TableHead>Data Nasc.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries.map((ben) => (
                      <TableRow key={ben.beneficiary_id}>
                        <TableCell>{ben.name} {ben.is_primary && <Badge variant="outline" className="ml-2 neu-flat">Titular</Badge>}</TableCell>
                        <TableCell>{ben.relationship}</TableCell>
                        <TableCell>{ben.birth_at ? new Date(ben.birth_at).toLocaleDateString() : '-'}</TableCell>
                        <TableCell><Badge className="neu-flat" variant={ben.is_alive ? "default" : "destructive"}>{ben.is_alive ? "Vivo" : "Falecido"}</Badge></TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" className="neu-button h-8 w-8 p-0" onClick={() => handleEditBeneficiary(ben.beneficiary_id)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" className="neu-button text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => handleDeleteBeneficiary(ben.beneficiary_id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charges Tab */}
        <TabsContent value="charges">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle>Cobranças do Contrato</CardTitle>
              <CardDescription>Histórico de cobranças geradas para este contrato.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto neu-flat rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cód. Cobrança</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status Pagto.</TableHead>
                      <TableHead>Data Pagto.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {charges.map((charge) => (
                      <TableRow key={charge.contract_charge_id}>
                        <TableCell>{charge.charge_code}</TableCell>
                        <TableCell>{new Date(charge.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>R$ {charge.amount}</TableCell>
                        <TableCell><Badge className="neu-flat" variant={charge.payment_status_id === 1 ? "default" : "secondary"}>{getStatusName(charge.payment_status_id, "payment")}</Badge>{charge.amount_pago ? ` (Pago: R$ ${charge.amount_pago})`:""}</TableCell>
                        <TableCell>{charge.payment_date ? new Date(charge.payment_date).toLocaleDateString() : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documentos Anexados</span>
                 <Button size="sm" onClick={handleAddDocument} className="neu-button neu-button-primary">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Documento
                </Button>
              </CardTitle>
              <CardDescription>Documentos relacionados a este contrato.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto neu-flat rounded-lg">
                <Table>
                  <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Arquivo</TableHead><TableHead>Data Upload</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {documents.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" className="neu-button h-8 w-8 p-0" onClick={() => handleEditDocument(doc.id)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" className="neu-button text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => handleDeleteDocument(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Endereços do Contrato</span>
                <Button size="sm" onClick={handleAddAddress} className="neu-button neu-button-primary">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Endereço
                </Button>
              </CardTitle>
              <CardDescription>Endereços associados a este contrato.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto neu-flat rounded-lg">
                <Table>
                  <TableHeader><TableRow><TableHead>Logradouro</TableHead><TableHead>Número</TableHead><TableHead>Cidade/UF</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {addresses.map(addr => (
                      <TableRow key={addr.id}>
                        <TableCell>{addr.street}</TableCell>
                        <TableCell>{addr.number}</TableCell>
                        <TableCell>{addr.city}/{addr.state}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" className="neu-button h-8 w-8 p-0" onClick={() => handleEditAddress(addr.id)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" className="neu-button text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => handleDeleteAddress(addr.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addendums Tab */}
        <TabsContent value="addendums">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Aditivos Contratuais</span>
                <Button size="sm" onClick={handleAddAddendum} className="neu-button neu-button-primary">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Aditivo
                </Button>
              </CardTitle>
              <CardDescription>Serviços adicionais e modificações contratuais.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto neu-flat rounded-lg">
                <Table>
                  <TableHeader><TableRow><TableHead>Nome Aditivo</TableHead><TableHead>Código Produto</TableHead><TableHead>Data Criação</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {addendums.map(add => (
                      <TableRow key={add.caddendum_id}>
                        <TableCell>{add.name}</TableCell>
                        <TableCell>{add.product_code}</TableCell>
                        <TableCell>{add.created_at ? new Date(add.created_at).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" className="neu-button h-8 w-8 p-0" onClick={() => handleEditAddendum(add.caddendum_id)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" className="neu-button text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => handleDeleteAddendum(add.caddendum_id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status History Tab */}
        <TabsContent value="history">
          <Card className="neu-card">
            <CardHeader>
              <CardTitle>Histórico de Status do Contrato</CardTitle>
              <CardDescription>Log de todas as alterações de status do contrato.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto neu-flat rounded-lg">
                <Table>
                  <TableHeader><TableRow><TableHead>Data Alteração</TableHead><TableHead>Status</TableHead><TableHead>Motivo (ID)</TableHead><TableHead>Detalhe</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {statusHistory.map(hist => (
                      <TableRow key={hist.c_status_history_id}>
                        <TableCell>{hist.changed_at ? new Date(hist.changed_at).toLocaleString() : '-'}</TableCell>
                        <TableCell><Badge className="neu-flat">{getStatusName(hist.status_possible_id, "contract")}</Badge></TableCell>
                        <TableCell>{hist.status_reason_id}</TableCell>
                        <TableCell>{hist.detail_status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
