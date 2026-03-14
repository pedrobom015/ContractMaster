import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ContractList from "@/components/contracts/contract-list";
import ContractDetail from "@/components/contracts/contract-detail";

export default function Dashboard() {
  const [selectedContractId, setSelectedContractId] = useState<number | null>(1);

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
                <h3 className="font-medium text-foreground">Filtros</h3>
              </div>
              <div className="neu-button rounded-xl px-4 py-2 cursor-pointer">
                <span className="text-primary text-sm font-medium">Limpar Filtros</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Número do contrato, cliente..."
                  className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Status
                </label>
                <select className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground">
                  <option value="">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="suspended">Suspenso</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Plano
                </label>
                <select className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground">
                  <option value="">Todos</option>
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Período
                </label>
                <input
                  type="date"
                  className="neu-input w-full px-4 py-3 rounded-2xl focus:outline-none text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ContractList
                selectedContractId={selectedContractId}
                onSelectContract={setSelectedContractId}
              />
            </div>
            
            <div className="lg:col-span-2">
              {selectedContractId ? (
                <ContractDetail contractId={selectedContractId} />
              ) : (
                <div className="neu-card rounded-3xl p-12 text-center">
                  <div className="neu-pressed rounded-3xl p-8 mx-auto max-w-md">
                    <div className="neu-flat rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full neu-button"></div>
                    </div>
                    <p className="text-muted-foreground text-lg">
                      Selecione um contrato para ver os detalhes
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
