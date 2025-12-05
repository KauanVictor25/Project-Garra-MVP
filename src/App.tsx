import React, { useState } from 'react';
import { Screen, ServiceOrder, OSPriority, OSStatus, Technician, OSPhoto } from './types';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DetailsView } from './views/DetailsView';
import { ExecutionView } from './views/ExecutionView';
import { PredictiveView } from './views/PredictiveView';
import { SuccessView } from './views/SuccessView';
import { OSManagerView } from './views/OSManagerView';

// --- TÉCNICO LOGADO (CARLOS) ---
const MOCK_TECHNICIAN: Technician = {
  name: "Carlos Silva",
  vanStatus: "OK - Abastecida"
};

// --- LISTA DE CHAMADOS (DADOS) ---
const INITIAL_OS_LIST: ServiceOrder[] = [
  {
    id: "1234",
    schoolName: "Escola Municipal Recife A",
    description: "Vazamento grave no banheiro dos professores",
    address: "Rua das Flores, 123 - Centro",
    contact: "Diretora Ana (81) 9999-0000",
    priority: OSPriority.HIGH,
    status: OSStatus.PENDING,
    
    // --- HISTÓRICO DA MARIA AQUI ---
    lastVisitDate: "10/11/2023",
    lastVisitTechnician: "Maria Oliveira", // <--- AQUI
    serviceName: "Troca de Tubulação",     // <--- AQUI
    lastVisitPhotoUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop",
    // -------------------------------
  },
  {
    id: "1235",
    schoolName: "CMEI Pequeno Príncipe",
    description: "Vazamento na pia do refeitório",
    address: "Av. Brasil, 450 - Zona Norte",
    contact: "Sec. Paulo (81) 9888-1111",
    priority: OSPriority.MEDIUM,
    status: OSStatus.PENDING,
    lastVisitDate: "10/09/2023",
    lastVisitTechnician: "Pedro Santos",
    serviceName: "Hidráulica Básica",
    lastVisitPhotoUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "1236",
    schoolName: "Escola Técnica Estadual",
    description: "Reparo na iluminação do ginásio",
    address: "Rua do Saber, 88 - Sul",
    contact: "Porteiro José",
    priority: OSPriority.LOW,
    status: OSStatus.PENDING,
    lastVisitDate: "01/05/2023",
    lastVisitTechnician: "Carlos Silva",
    serviceName: "Iluminação",
    lastVisitPhotoUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=600&auto=format&fit=crop"
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [selectedOS, setSelectedOS] = useState<ServiceOrder | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_OS_LIST);
  const [tempExecutionData, setTempExecutionData] = useState<{
    solution: string;
    parts: string;
    photos: OSPhoto[];
  } | null>(null);

  const handleLogin = () => setCurrentScreen(Screen.DASHBOARD);

  const handleSelectOS = (os: ServiceOrder) => {
    setSelectedOS(os);
    setCurrentScreen(Screen.DETAILS);
  };

  const handleStartService = (confirmedServiceName: string) => {
    if (selectedOS) {
      const updatedOS = { ...selectedOS, serviceName: confirmedServiceName, status: OSStatus.IN_PROGRESS };
      setSelectedOS(updatedOS);
      setOrders(prev => prev.map(o => o.id === updatedOS.id ? updatedOS : o));
    }
    setCurrentScreen(Screen.EXECUTION);
  };
  
  const handleFinishExecution = (data: { solution: string; parts: string; photos: OSPhoto[] }) => {
    setTempExecutionData(data);
    setCurrentScreen(Screen.PREDICTIVE);
  };

  const handleFinishPredictive = (healthStatus: 'green' | 'yellow' | 'red') => {
    if (selectedOS && tempExecutionData) {
        const completedOS: ServiceOrder = {
            ...selectedOS,
            status: OSStatus.COMPLETED,
            solutionApplied: tempExecutionData.solution,
            partsUsed: tempExecutionData.parts,
            photos: tempExecutionData.photos,
            healthStatus: healthStatus,
            completionDate: new Date().toLocaleDateString('pt-BR'),
            technicianName: MOCK_TECHNICIAN.name
        };

        setOrders(prev => prev.map(o => o.id === completedOS.id ? completedOS : o));
        setSelectedOS(completedOS);
        setTempExecutionData(null); 
        setCurrentScreen(Screen.SUCCESS);
    }
  };

  const handleDeletePhoto = (osId: string, photoUrl: string) => {
    const updateOrderPhotos = (order: ServiceOrder) => {
        if (order.id !== osId) return order;
        const updatedPhotos = order.photos ? order.photos.filter(p => p.url !== photoUrl) : [];
        const updatedLegacyUrl = order.lastVisitPhotoUrl === photoUrl ? '' : order.lastVisitPhotoUrl;
        return { ...order, photos: updatedPhotos, lastVisitPhotoUrl: updatedLegacyUrl };
    };
    setOrders(prevOrders => prevOrders.map(updateOrderPhotos));
    if (selectedOS && selectedOS.id === osId) {
        setSelectedOS(updateOrderPhotos(selectedOS));
    }
  };

  const handleBackToDashboard = () => {
    setSelectedOS(null);
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleBack = () => {
     if (currentScreen === Screen.DETAILS) setCurrentScreen(Screen.DASHBOARD);
     if (currentScreen === Screen.EXECUTION) setCurrentScreen(Screen.DETAILS);
     if (currentScreen === Screen.OS_MANAGER) setCurrentScreen(Screen.DASHBOARD);
  };

  const handleGoToManager = () => setCurrentScreen(Screen.OS_MANAGER);
  const handleCreateOS = (newOS: ServiceOrder) => setOrders([newOS, ...orders]);
  const handleUpdateOS = (updatedOS: ServiceOrder) => setOrders(orders.map(os => os.id === updatedOS.id ? updatedOS : os));
  const handleDeleteOS = (id: string) => setOrders(orders.filter(os => os.id !== id));

  return (
    <div className="min-h-screen bg-garra-bg text-garra-text font-sans selection:bg-garra-accent selection:text-white">
      <div className="max-w-md mx-auto min-h-screen bg-garra-bg shadow-2xl relative overflow-hidden border-x border-gray-800">
        {currentScreen === Screen.LOGIN && <LoginView onLogin={handleLogin} />}
        {currentScreen === Screen.DASHBOARD && (
          <DashboardView 
            technician={MOCK_TECHNICIAN} 
            orders={orders} 
            onSelectOS={handleSelectOS}
            onManageOS={handleGoToManager}
          />
        )}
        {currentScreen === Screen.OS_MANAGER && (
          <OSManagerView 
            orders={orders}
            onBack={handleBack}
            onCreate={handleCreateOS}
            onUpdate={handleUpdateOS}
            onDelete={handleDeleteOS}
          />
        )}
        {currentScreen === Screen.DETAILS && selectedOS && (
          <DetailsView 
            os={selectedOS} 
            allOrders={orders}
            onBack={handleBack} 
            onStart={handleStartService}
            onDeletePhoto={handleDeletePhoto}
          />
        )}
        {currentScreen === Screen.EXECUTION && selectedOS && (
          <ExecutionView 
            os={selectedOS} 
            onBack={handleBack}
            onFinish={handleFinishExecution} 
          />
        )}
        {currentScreen === Screen.PREDICTIVE && <PredictiveView onFinish={handleFinishPredictive} />}
        {currentScreen === Screen.SUCCESS && selectedOS && <SuccessView onHome={handleBackToDashboard} os={selectedOS} />}
      </div>
    </div>
  );
}