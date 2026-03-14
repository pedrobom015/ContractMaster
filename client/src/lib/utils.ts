import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'ativo':
    case 'paid':
    case 'pago':
      return 'status-active';
    case 'suspended':
    case 'suspenso':
    case 'pending':
    case 'pendente':
      return 'status-suspended';
    case 'cancelled':
    case 'cancelado':
    case 'overdue':
    case 'vencido':
      return 'status-cancelled';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'suspended':
      return 'Suspenso';
    case 'cancelled':
      return 'Cancelado';
    case 'pending':
      return 'Pendente';
    case 'paid':
      return 'Pago';
    case 'overdue':
      return 'Vencido';
    default:
      return status;
  }
}
