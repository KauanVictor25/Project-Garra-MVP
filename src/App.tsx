import React, { useState } from 'react';
import { Screen, ServiceOrder, OSPriority, OSStatus, Technician, OSPhoto } from './types';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DetailsView } from './views/DetailsView';
import { ExecutionView } from './views/ExecutionView';
import { PredictiveView } from './views/PredictiveView';
import { SuccessView } from './views/SuccessView';
import { OSManagerView } from './views/OSManagerView';

const MOCK_TECHNICIAN: Technician = {
  name: "Roberto Almeida", 
  vanStatus: "OK - Abastecida"
};

const INITIAL_OS_LIST: ServiceOrder[] = [
  {
    id: "1234",
    schoolName: "Escola Municipal Recife A",
    description: "Vazamento constante na torneira do bebedouro próximo à biblioteca.",
    address: "Rua das Flores, 123 - Centro",
    contact: "Diretora Ana (81) 9999-0000",
    priority: OSPriority.HIGH,
    status: OSStatus.PENDING,
    
    // HISTÓRICO DO TÉCNICO ANTERIOR (JOÃO)
    lastVisitDate: "15/08/2023",
    lastVisitTechnician: "João Souza",
    
    // --- SUAS FOTOS LOCAIS (SIMPLIFICADAS) ---
    // Certifique-se que estão na pasta public com esses nomes:
    lastVisitPhotoUrl: "/a.jpg",        // Foto da Torneira Quebrada
    lastVisitSecondPhotoUrl: "/b.jpg",  // Foto da Torneira Consertada
    
    serviceName: "Hidráulica"
  },
  {
    id: "1235",
    schoolName: "CMEI Pequeno Príncipe",
    description: "Troca de disjuntor do ar-condicionado que está desarmando.",
    address: "Av. Brasil, 450 - Zona Norte",
    contact: "Sec. Paulo (81) 9888-1111",
    priority: OSPriority.MEDIUM,
    status: OSStatus.PENDING,
    lastVisitDate: "10/09/2023",
    lastVisitTechnician: "Pedro Santos",
    // Link seguro de imagem online (Quadro Elétrico)
    lastVisitPhotoUrl: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?q=80&w=600&auto=format&fit=crop",
    serviceName: "Manutenção Elétrica"
  },
  {
    id: "1236",
    schoolName: "Escola Técnica Estadual",
    description: "Reparo na iluminação do ginásio esportivo.",
    address: "Rua do Saber, 88 - Sul",
    contact: "Porteiro José",
    priority: OSPriority.LOW,
    status: OSStatus.PENDING,
    lastVisitDate: "01/05/2023",
    lastVisitTechnician: "Roberto Almeida",
    // Link seguro de imagem online (Ginásio)
    lastVisitPhotoUrl: "https://images.unsplash.com/photo-1519253460833-281b37d455d5?q=80&w=600&auto=format&fit=crop",
    serviceName: "Iluminação"
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
            technicianName: MOCK_TECHNICIAN.name,
            lastVisitDate: selectedOS.lastVisitDate,
            lastVisitTechnician: selectedOS.lastVisitTechnician,
            lastVisitPhotoUrl: selectedOS.lastVisitPhotoUrl,
            lastVisitSecondPhotoUrl: selectedOS.lastVisitSecondPhotoUrl
        };
        setOrders(prev => prev.map(o => o.id === completedOS.id ? completedOS : o));
        setSelectedOS(completedOS);
        setTempExecutionData(null);
        setCurrentScreen(Screen.SUCCESS);
    }
  };

  // Funções CRUD (Mantidas)
  const handleCreateOS = (newOS: ServiceOrder) => { setOrders([newOS, ...orders]); };
  const handleUpdateOS = (updatedOS: ServiceOrder) => { setOrders(orders.map(os => os.id === updatedOS.id ? updatedOS : os)); };
  const handleDeleteOS = (id: string) => { setOrders(orders.filter(os => os.id !== id)); if (selectedOS && selectedOS.id === id) setSelectedOS(null); };
  const handleEditOSDetails = (osId: string, updates: Partial<ServiceOrder>) => { 
      setOrders(prev => prev.map(o => o.id === osId ? { ...o, ...updates } : o));
      if (selectedOS && selectedOS.id === osId) setSelectedOS(prev => prev ? { ...prev, ...updates } : null);
  };
  const handleDeleteCard = (osId: string) => {
    setOrders(prev => prev.map(o => o.id !== osId ? o : { ...o, photos: [], solutionApplied: undefined, partsUsed: undefined, completionDate: undefined, technicianName: undefined, healthStatus: undefined }));
  };
  const handleDeletePhoto = (osId: string, photoUrl: string) => {}; 

  const handleBackToDashboard = () => { setSelectedOS(null); setCurrentScreen(Screen.DASHBOARD); };
  const handleBack = () => {
      if (currentScreen === Screen.DETAILS) setCurrentScreen(Screen.DASHBOARD);
      if (currentScreen === Screen.EXECUTION) setCurrentScreen(Screen.DETAILS);
      if (currentScreen === Screen.OS_MANAGER) setCurrentScreen(Screen.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-garra-text font-sans selection:bg-garra-accent selection:text-white flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-garra-bg shadow-2xl relative overflow-hidden border-x border-gray-800">
        
        {currentScreen === Screen.LOGIN && <LoginView onLogin={handleLogin} />}

        {currentScreen === Screen.DASHBOARD && (
          <DashboardView technician={MOCK_TECHNICIAN} orders={orders} onSelectOS={handleSelectOS} onCreate={handleCreateOS} onUpdate={handleUpdateOS} onDelete={handleDeleteOS} />
        )}

        {currentScreen === Screen.OS_MANAGER && (
          <OSManagerView orders={orders} onBack={handleBack} onCreate={handleCreateOS} onUpdate={handleUpdateOS} onDelete={handleDeleteOS} />
        )}

        {currentScreen === Screen.DETAILS && selectedOS && (
          <DetailsView os={selectedOS} allOrders={orders} onBack={handleBack} onStart={handleStartService} onDeletePhoto={handleDeletePhoto} onEditCardDetails={handleEditOSDetails} onDeleteCard={handleDeleteCard} />
        )}

        {currentScreen === Screen.EXECUTION && selectedOS && (
          <ExecutionView os={selectedOS} onBack={handleBack} onFinish={handleFinishExecution} />
        )}

        {currentScreen === Screen.PREDICTIVE && <PredictiveView onFinish={handleFinishPredictive} />}

        {currentScreen === Screen.SUCCESS && selectedOS && <SuccessView onHome={handleBackToDashboard} os={selectedOS} />}
      </div>
    </div>
  );
}