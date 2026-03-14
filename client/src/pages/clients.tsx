import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ClientList from "@/components/clients/client-list";
import ClientDetail from "@/components/clients/client-detail";
import ClientForm from "@/components/clients/client-form";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { Client } from "@shared/schema";

export default function ClientsPage() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<"all" | "cpf" | "cnpj">("all");
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const filteredClients = clients?.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.document.includes(searchTerm);
    const matchesDocType = documentTypeFilter === "all" ||
                          (documentTypeFilter === "cpf" && client.document.length === 14) ||
                          (documentTypeFilter === "cnpj" && client.document.length === 18);
    return matchesSearch && matchesDocType;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Filters Section */}
          <div className="neu-card rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="neu-pressed rounded-2xl px-4 py-2">
                <h3 className="font-medium text-foreground">Gestão de Clientes</h3>
              </div>
              <div 
                className="neu-button rounded-xl px-4 py-2 cursor-pointer"
                onClick={() => setShowNewClientForm(true)}
              >
                <span className="text-primary text-sm font-medium">Novo Cliente</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Buscar Cliente
                </label>
                <input
                  type="text"
                  placeholder="Nome ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Tipo de Documento
                </label>
                <select 
                  value={documentTypeFilter}
                  onChange={(e) => setDocumentTypeFilter(e.target.value as any)}
                  className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground"
                >
                  <option value="all">Todos</option>
                  <option value="cpf">Pessoa Física (CPF)</option>
                  <option value="cnpj">Pessoa Jurídica (CNPJ)</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <div className="neu-button rounded-xl px-6 py-3 cursor-pointer w-full text-center">
                  <span className="text-primary font-medium">Limpar Filtros</span>
                </div>
              </div>
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ClientList
                clients={filteredClients || []}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
              />
            </div>
            
            <div className="lg:col-span-2">
              {showNewClientForm ? (
                <div className="neu-card rounded-3xl p-6">
                  <ClientForm 
                    onCancel={() => setShowNewClientForm(false)}
                    onSuccess={() => {
                      setShowNewClientForm(false);
                      setSelectedClientId(null);
                    }}
                  />
                </div>
              ) : selectedClientId ? (
                <ClientDetail clientId={selectedClientId} />
              ) : (
                <div className="neu-card rounded-3xl p-12 text-center">
                  <div className="neu-pressed rounded-3xl p-8 mx-auto max-w-md">
                    <div className="neu-flat rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full neu-button"></div>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      Selecione um cliente para ver os detalhes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}