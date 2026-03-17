// @ts-nocheck
import { cn, formatCPF, formatCNPJ } from "@/lib/utils";
import type { Client } from "@shared/schema";

interface ClientListProps {
  clients: Client[];
  selectedClientId: number | null;
  onSelectClient: (id: number) => void;
}

export default function ClientList({ clients, selectedClientId, onSelectClient }: ClientListProps) {
  const formatDocument = (document: string) => {
    return document.length === 14 ? formatCPF(document.replace(/\D/g, '')) : formatCNPJ(document.replace(/\D/g, ''));
  };

  const getDocumentType = (document: string) => {
    return document.length === 14 ? "CPF" : "CNPJ";
  };

  const getClientTypeIcon = (document: string) => {
    return document.length === 14 ? "👤" : "🏢";
  };

  return (
    <div className="neu-card rounded-3xl p-6">
      <div className="neu-pressed rounded-2xl p-4 mb-6">
        <h3 className="font-semibold text-foreground">Lista de Clientes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Encontrados {clients.length} clientes
        </p>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {clients.map((client) => (
          <div
            key={client.id}
            className={cn(
              "neu-flat rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg",
              selectedClientId === client.id && "contract-item active"
            )}
            onClick={() => onSelectClient(client.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="neu-button rounded-xl px-3 py-1 flex items-center space-x-2">
                <span className="text-lg">{getClientTypeIcon(client.document)}</span>
                <span className="font-medium text-foreground text-sm">
                  {getDocumentType(client.document)}
                </span>
              </div>
              <div className="neu-flat rounded-lg px-3 py-1">
                <span className="text-xs text-muted-foreground font-mono">
                  #{client.id.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
            
            <div className="neu-pressed rounded-xl p-3 mb-3">
              <p className="text-sm text-foreground font-medium">
                {client.name}
              </p>
            </div>
            
            <div className="neu-flat rounded-lg px-3 py-2 mb-2">
              <p className="text-xs text-primary font-mono text-center">
                {formatDocument(client.document)}
              </p>
            </div>
            
            {client.email && (
              <div className="neu-flat rounded-lg px-3 py-1 mb-1">
                <p className="text-xs text-muted-foreground text-center">
                  📧 {client.email}
                </p>
              </div>
            )}
            
            {client.phone && (
              <div className="neu-flat rounded-lg px-3 py-1">
                <p className="text-xs text-muted-foreground text-center">
                  📞 {client.phone}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {clients.length === 0 && (
          <div className="neu-pressed rounded-2xl p-8 text-center">
            <div className="neu-flat rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-muted-foreground">
              Nenhum cliente encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}