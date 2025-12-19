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
  
  // Histórico (Visita Anterior)
  lastVisitDate: string;
  lastVisitTechnician: string;
  lastVisitPhotoUrl: string;       // Foto 1 (Principal)
  lastVisitSecondPhotoUrl?: string; // Foto 2 (Secundária) - NOVO CAMPO
  serviceName: string;

  // Execução Atual
  solutionApplied?: string;
  partsUsed?: string;
  healthStatus?: 'green' | 'yellow' | 'red';
  photos?: OSPhoto[];
  technicianName?: string;
  completionDate?: string;
}

export interface Technician {
  name: string;
  vanStatus: string;
}