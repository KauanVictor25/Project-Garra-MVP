import React, { useState } from 'react';
import { ServiceOrder, OSPriority, OSStatus } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ChevronLeft, Plus, Edit2, Trash2, X, Save, MapPin, CheckCircle, Clock, ListChecks } from 'lucide-react';

interface OSManagerViewProps {
  orders: ServiceOrder[];
  onBack: () => void;
  onCreate: (os: ServiceOrder) => void;
  onUpdate: (os: ServiceOrder) => void;
  onDelete: (id: string) => void;
}

const EMPTY_OS: ServiceOrder = {
  id: '',
  schoolName: '',
  description: '',
  address: '',
  contact: '',
  priority: OSPriority.MEDIUM,
  status: OSStatus.PENDING,
  lastVisitDate: new Date().toLocaleDateString('pt-BR'),
  lastVisitTechnician: 'N/A',
  lastVisitPhotoUrl: 'https://picsum.photos/400/300?grayscale',
  serviceName: ''
};

export const OSManagerView: React.FC<OSManagerViewProps> = ({ orders, onBack, onCreate, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOS, setEditingOS] = useState<ServiceOrder | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<ServiceOrder>(EMPTY_OS);

  // Filtros
  const pendingOrders = orders.filter(o => o.status !== OSStatus.COMPLETED);
  const completedOrders = orders.filter(o => o.status === OSStatus.COMPLETED);

  const displayOrders = activeTab === 'pending' ? pendingOrders : completedOrders;

  const handleOpenCreate = () => {
    setEditingOS(null);
    setFormData({
      ...EMPTY_OS,
      id: Math.floor(1000 + Math.random() * 9000).toString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (os: ServiceOrder) => {
    setEditingOS(os);
    setFormData({ ...os });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOS) {
      onUpdate(formData);
    } else {
      onCreate(formData);
    }
    
    // Se marcou como completa, muda para a aba de completas para o usuário ver
    if (formData.status === OSStatus.COMPLETED) {
        setActiveTab('completed');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta OS?")) {
      onDelete(id);
    }
  };

  const getPriorityStyles = (priority: OSPriority) => {
    switch (priority) {
      case OSPriority.HIGH:
        return { dot: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-900/20 border-red-900' };
      case OSPriority.MEDIUM:
        return { dot: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-900/20 border-yellow-900' };
      case OSPriority.LOW:
        return { dot: 'bg-green-500', text: 'text-green-400', badge: 'bg-green-900/20 border-green-900' };
      default:
        return { dot: 'bg-gray-500', text: 'text-gray-400', badge: 'bg-gray-800 border-gray-700' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-garra-bg relative">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800 bg-garra-bg sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <span className="font-bold text-lg text-white">Gestão de OS</span>
        </div>
        <button 
            onClick={handleOpenCreate}
            className="bg-garra-accent hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
        >
            <Plus size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'text-white bg-garra-card' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Clock size={16} />
          Ordens de Serviço ({pendingOrders.length})
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-garra-accent"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'completed' ? 'text-white bg-garra-card' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <ListChecks size={16} />
          OS Concluídas ({completedOrders.length})
          {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayOrders.map((os) => {
          const pStyle = getPriorityStyles(os.priority);
          const isCompleted = os.status === OSStatus.COMPLETED;

          return (
            <div key={os.id} className={`bg-garra-card border rounded-lg p-4 shadow-sm flex flex-col gap-3 ${isCompleted ? 'border-green-900/50 bg-green-900/5' : 'border-gray-700'}`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5 flex-1 mr-2">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-garra-accent bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                      #{os.id}
                    </span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${pStyle.badge} ${pStyle.text}`}>
                       <span className={`w-2 h-2 rounded-full ${pStyle.dot}`}></span>
                       {os.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <div className="bg-green-500/20 p-1 rounded-full shrink-0">
                         <CheckCircle className="text-garra-success" size={16} strokeWidth={3} />
                      </div>
                    )}
                    <h3 className="font-bold text-white text-lg leading-tight">
                        {os.schoolName}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleOpenEdit(os)}
                    className="p-2 bg-gray-700 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(os.id)}
                    className="p-2 bg-gray-700 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm">{os.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-2 border-t border-gray-700 pt-3">
                <div className="font-bold text-gray-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-garra-success' : 'bg-gray-600'}`}></span>
                    {os.serviceName || 'Serviço N/D'}
                </div>
                <div className="flex items-center gap-1 truncate max-w-[50%]">
                   <MapPin size={12} /> {os.address}
                </div>
              </div>
            </div>
          );
        })}
        
        {displayOrders.length === 0 && (
            <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                {activeTab === 'pending' ? <Clock size={48} className="opacity-20 mb-2" /> : <ListChecks size={48} className="opacity-20 mb-2" />}
                <p>Nenhuma {activeTab === 'pending' ? 'ordem de serviço pendente' : 'OS concluída'}.</p>
                {activeTab === 'pending' && <p className="text-xs">Clique no + para adicionar.</p>}
            </div>
        )}
      </div>

      {/* Modal Criar/Editar */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-garra-bg w-full h-[90%] sm:h-auto sm:max-h-[85vh] sm:max-w-md rounded-t-2xl sm:rounded-xl flex flex-col border border-gray-600 shadow-2xl">
            
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-garra-card rounded-t-xl shrink-0">
              <h3 className="font-bold text-white text-lg">
                {editingOS ? 'Editar OS' : 'Nova OS'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <Input 
                label="Nome da Escola" 
                value={formData.schoolName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, schoolName: e.target.value})}
                required
              />

              <div className="flex gap-4">
                <div className="w-1/2 mb-4">
                    <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">Prioridade</label>
                    <select 
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as OSPriority})}
                        className="w-full h-12 px-4 bg-garra-card text-white border-2 border-gray-700 rounded focus:outline-none focus:border-garra-accent focus:bg-gray-800 transition-colors text-sm font-bold"
                    >
                        <option value={OSPriority.HIGH}>Alta</option>
                        <option value={OSPriority.MEDIUM}>Média</option>
                        <option value={OSPriority.LOW}>Baixa</option>
                    </select>
                </div>
                
                <div className="w-1/2 mb-4">
                    <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">Status</label>
                    <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as OSStatus})}
                        className={`w-full h-12 px-4 bg-garra-card text-white border-2 border-gray-700 rounded focus:outline-none focus:border-garra-accent focus:bg-gray-800 transition-colors text-sm font-bold ${formData.status === OSStatus.COMPLETED ? 'text-green-400 border-green-900' : ''}`}
                    >
                        <option value={OSStatus.PENDING}>Pendente</option>
                        <option value={OSStatus.IN_PROGRESS}>Em Andamento</option>
                        <option value={OSStatus.COMPLETED}>Finalizada</option>
                    </select>
                </div>
              </div>

              <Input 
                label="Nome do Serviço (Categoria)" 
                value={formData.serviceName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, serviceName: e.target.value})}
                placeholder="Ex: Elétrica, Hidráulica"
                required
              />

              <div className="w-full mb-4">
                 <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">Descrição do Problema</label>
                 <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full p-4 bg-garra-card text-white border-2 border-gray-700 rounded focus:outline-none focus:border-garra-accent focus:bg-gray-800 transition-colors text-lg resize-none"
                    required
                 />
              </div>

              <Input 
                label="Endereço" 
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, address: e.target.value})}
                icon={<MapPin size={16}/>}
                required
              />

              <Input 
                label="Contato (Nome/Tel)" 
                value={formData.contact || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, contact: e.target.value})}
                placeholder="Diretora Maria (XX) XXXXX..."
              />

            </form>

            <div className="p-4 border-t border-gray-700 bg-garra-card shrink-0">
               <Button fullWidth onClick={handleSave} icon={<Save size={20}/>}>
                 {editingOS ? 'Atualizar OS' : 'Criar OS'}
               </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};