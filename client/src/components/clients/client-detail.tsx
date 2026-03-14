import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Printer, MapPin, Phone, Mail, Calendar, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCPF, formatCNPJ, formatDate } from "@/lib/utils";
import ClientForm from "./client-form";
import type { Client } from "@shared/schema";

interface ClientDetailProps {
  clientId: number;
}

export default function ClientDetail({ clientId }: ClientDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
  });

  const deleteClientMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/clients/${clientId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover cliente. Verifique se não há contratos vinculados.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="neu-card rounded-3xl p-6">
        <div className="skeleton h-8 w-48 mb-4 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="neu-card rounded-3xl p-12 text-center">
        <div className="neu-pressed rounded-3xl p-8">
          <p className="text-muted-foreground">Cliente não encontrado</p>
        </div>
      </div>
    );
  }

  const formatDocument = (document: string) => {
    return document.length === 14 ? formatCPF(document.replace(/\D/g, '')) : formatCNPJ(document.replace(/\D/g, ''));
  };

  const getDocumentType = (document: string) => {
    return document.length === 14 ? "CPF" : "CNPJ";
  };

  const isCompany = client.document.length === 18;

  if (isEditing) {
    return (
      <div className="neu-card rounded-3xl p-6">
        <ClientForm 
          client={client}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="neu-card rounded-3xl p-6">
      {/* Header */}
      <div className="neu-pressed rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="neu-button rounded-2xl w-16 h-16 flex items-center justify-center">
              {isCompany ? (
                <Building2 className="w-8 h-8 text-primary" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {client.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {getDocumentType(client.document)}: {formatDocument(client.document)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="neu-button rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer">
              <Printer className="w-5 h-5 text-primary" />
            </div>
            <div 
              className="neu-button rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Basic Information */}
        <div className="neu-flat rounded-2xl p-4">
          <div className="neu-pressed rounded-xl p-3 mb-4">
            <h4 className="font-medium text-foreground">Informações Básicas</h4>
          </div>
          
          <div className="space-y-3">
            <div className="neu-flat rounded-lg p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Nome:</span>
              <span className="font-medium text-foreground">{client.name}</span>
            </div>
            
            <div className="neu-flat rounded-lg p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Documento:</span>
              <span className="font-mono text-primary">{formatDocument(client.document)}</span>
            </div>
            
            <div className="neu-flat rounded-lg p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Tipo:</span>
              <div className="neu-button rounded-lg px-3 py-1">
                <span className="text-xs font-medium text-foreground">
                  {isCompany ? "Pessoa Jurídica" : "Pessoa Física"}
                </span>
              </div>
            </div>
            
            <div className="neu-flat rounded-lg p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Cadastrado em:</span>
              <span className="text-muted-foreground text-sm">{client.createdAt ? formatDate(client.createdAt) : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="neu-flat rounded-2xl p-4">
          <div className="neu-pressed rounded-xl p-3 mb-4">
            <h4 className="font-medium text-foreground">Informações de Contato</h4>
          </div>
          
          <div className="space-y-3">
            {client.email ? (
              <div className="neu-flat rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="neu-button rounded-lg w-8 h-8 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm font-medium text-foreground">{client.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="neu-pressed rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-sm">E-mail não informado</p>
              </div>
            )}
            
            {client.phone ? (
              <div className="neu-flat rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="neu-button rounded-lg w-8 h-8 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm font-medium text-foreground">{client.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="neu-pressed rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-sm">Telefone não informado</p>
              </div>
            )}
            
            {client.contact ? (
              <div className="neu-flat rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="neu-button rounded-lg w-8 h-8 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contato</p>
                    <p className="text-sm font-medium text-foreground">{client.contact}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="neu-pressed rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-sm">Contato não informado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      {client.address && (
        <div className="neu-flat rounded-2xl p-4 mb-6">
          <div className="neu-pressed rounded-xl p-3 mb-4">
            <h4 className="font-medium text-foreground">Endereço</h4>
          </div>
          
          <div className="neu-flat rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="neu-button rounded-lg w-8 h-8 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-foreground">{client.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="neu-flat rounded-2xl p-4">
        <div className="neu-pressed rounded-xl p-3 mb-4">
          <h4 className="font-medium text-foreground">Ações Rápidas</h4>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="neu-button rounded-xl px-6 py-3 cursor-pointer">
            <span className="text-primary font-medium">Ver Contratos</span>
          </div>
          <div className="neu-button rounded-xl px-6 py-3 cursor-pointer">
            <span className="text-secondary font-medium">Novo Contrato</span>
          </div>
          <div className="neu-button rounded-xl px-6 py-3 cursor-pointer">
            <span className="text-accent font-medium">Histórico</span>
          </div>
          <div 
            className="neu-button rounded-xl px-6 py-3 cursor-pointer"
            onClick={() => {
              if (confirm("Tem certeza que deseja remover este cliente?")) {
                deleteClientMutation.mutate();
              }
            }}
          >
            <span className="text-destructive font-medium">Remover Cliente</span>
          </div>
        </div>
      </div>
    </div>
  );
}