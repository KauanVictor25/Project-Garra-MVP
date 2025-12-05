export enum Screen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  DETAILS = 'DETAILS',
  EXECUTION = 'EXECUTION',
  PREDICTIVE = 'PREDICTIVE',
  SUCCESS = 'SUCCESS',
  OS_MANAGER = 'OS_MANAGER'
}

export enum OSStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Finalizada'
}

export enum OSPriority {
  HIGH = 'Alta',
  MEDIUM = 'Média',
  LOW = 'Baixa'
}

export interface OSPhoto {
  url: string;
  type: 'BEFORE' | 'AFTER';
  timestamp: string;
}

export interface ServiceOrder {
  id: string;
  schoolName: string;
  description: string;
  address: string;
  contact?: string;
  priority: OSPriority;
  status: OSStatus;
  
  // Histórico
  lastVisitDate: string;
  lastVisitTechnician: string; // Quem foi
  lastVisitPhotoUrl: string;   // Foto do serviço
  serviceName: string;         // O que foi feito (Ex: Troca de Tubulação)

  // Execução Atual
  solutionApplied?: string;
  partsUsed?: string;
  healthStatus?: 'green' | 'yellow' | 'red';
  photos?: OSPhoto[];
  completionDate?: string;
  technicianName?: string;
}

export interface Technician {
  name: string;
  vanStatus: string;
}