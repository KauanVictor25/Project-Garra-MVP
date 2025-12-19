import React, { useState } from 'react';
import { ServiceOrder, Technician, OSPriority, OSStatus } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  Truck, AlertTriangle, CheckCircle, Clock, Settings, 
  Award, TrendingUp, Users, Search, X, ArrowLeft, Lock, 
  MapPin, Wrench, Signal, Trophy, Medal, Zap, Star,
  Plus, Edit2, Trash2, ListChecks, ExternalLink, Save,
  Package, CheckSquare, Square, Box
} from 'lucide-react';

interface DashboardViewProps {
  technician: Technician;
  orders: ServiceOrder[];
  onSelectOS: (os: ServiceOrder) => void;
  onCreate: (os: ServiceOrder) => void;
  onUpdate: (os: ServiceOrder) => void;
  onDelete: (id: string) => void;
  onManageOS?: () => void;
}

const EMPTY_OS: ServiceOrder = {
  id: '',
  schoolName: '',
  description: '',
  address: '',
  contact: '',
  priority: OSPriority.MEDIUM,
  status: OSStatus.PENDING,
  lastVisitDate: '', 
  lastVisitTechnician: '', 
  lastVisitPhotoUrl: '', 
  lastVisitSecondPhotoUrl: '',
  serviceName: ''
};

const PARTS_DATABASE = [
  "Cabo Flexível 2.5mm (Vermelho)", "Cabo Flexível 2.5mm (Azul)", "Cabo Flexível 6.0mm (Preto)",
  "Disjuntor DIN 16A", "Disjuntor DIN 20A", "Disjuntor DIN 40A", "Fita Isolante 3M",
  "Cano PVC 20mm", "Cano PVC 25mm", "Luva de Correr 25mm", "Joelho 90 graus",
  "Torneira de Metal 1/2", "Sifão Universal", "Lâmpada LED 9W", "Reator Eletrônico", "Tomada 10A"
];

const MOCK_VANS = [
  { id: 'v1', name: 'Van 01 - Alpha', driver: 'Simone', status: 'Em Campo', items: ['Escada 7 Degraus', 'Maleta de Ferramentas', 'Cabo 2.5mm (50m)'] },
  { id: 'v2', name: 'Van 02 - Beta', driver: 'Felipe', status: 'Em Campo', items: ['Furadeira Impacto', 'Cano PVC 20mm (10un)', 'Sifão Universal (2un)'] },
  { id: 'v3', name: 'Van 03 - Charlie', driver: 'Roberto (Você)', status: 'Na Sede', items: ['Kit Chaves Fenda', 'Fita Isolante (5un)', 'Disjuntor 20A (3un)'] },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  technician, orders, onSelectOS, onCreate, onUpdate, onDelete, onManageOS 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de Gestão OS
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [isOSModalOpen, setIsOSModalOpen] = useState(false);
  const [editingOS, setEditingOS] = useState<ServiceOrder | null>(null);
  const [formData, setFormData] = useState<ServiceOrder>(EMPTY_OS);

  // Estados da Gamificação e Modais
  const [showPlanModal, setShowPlanModal] = useState(false); 
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showVanModal, setShowVanModal] = useState(false); 
  const [modalView, setModalView] = useState<'stats' | 'levels'>('stats');

  // Estado do Mapa
  const [mapAddress, setMapAddress] = useState<string | null>(null);
  // NOVO: Estado para controlar o carregamento do mapa
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Estados do Inventário da Van
  const [selectedVan, setSelectedVan] = useState<any>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [partsQuery, setPartsQuery] = useState('');
  const [newItemsText, setNewItemsText] = useState('');
  const [showPartsList, setShowPartsList] = useState(false);

  // Filtros Avançados
  const filteredOrders = orders.filter(os => {
    const matchesSearch = os.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) || os.id.includes(searchTerm);
    const matchesTab = activeTab === 'pending' ? os.status !== OSStatus.COMPLETED : os.status === OSStatus.COMPLETED;
    return matchesSearch && matchesTab;
  });
  
  const getPriorityStyles = (priority: OSPriority) => {
    switch (priority) {
      case OSPriority.HIGH: return { dot: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-900/20 border-red-900' };
      case OSPriority.MEDIUM: return { dot: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-900/20 border-yellow-900' };
      case OSPriority.LOW: return { dot: 'bg-green-500', text: 'text-green-400', badge: 'bg-green-900/20 border-green-900' };
      default: return { dot: 'bg-gray-500', text: 'text-gray-400', badge: 'bg-gray-800 border-gray-700' };
    }
  };

  const filteredParts = PARTS_DATABASE.filter(p => p.toLowerCase().includes(partsQuery.toLowerCase()));

  const togglePart = (partName: string) => {
    setNewItemsText(prev => {
      if (prev.includes(partName)) {
        return prev.replace(partName + ', ', '').replace(partName, '').trim();
      }
      const separator = prev.length > 0 && !prev.endsWith(', ') ? ', ' : '';
      return prev + separator + partName;
    });
  };

  const saveVanItems = () => {
    if (selectedVan && newItemsText.trim()) {
        const itemsArray = newItemsText.split(',').map(i => i.trim()).filter(i => i);
        selectedVan.items = [...selectedVan.items, ...itemsArray];
        setNewItemsText('');
        setPartsQuery('');
        setIsAddingItem(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingOS(null);
    setFormData({ 
      ...EMPTY_OS, 
      id: Math.floor(1000 + Math.random() * 9000).toString(),
    });
    setIsOSModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, os: ServiceOrder) => {
    e.stopPropagation(); setEditingOS(os); setFormData({ ...os }); setIsOSModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); if (window.confirm("Tem certeza que deseja excluir esta OS?")) onDelete(id);
  };

  const handleSaveOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOS) onUpdate(formData); else onCreate(formData);
    if (formData.status === OSStatus.COMPLETED) setActiveTab('completed');
    setIsOSModalOpen(false);
  };

  const handleCloseModal = () => {
    setShowPlanModal(false); setShowTeamModal(false); setShowRankingModal(false); setShowVanModal(false);
    setTimeout(() => { setModalView('stats'); setSelectedVan(null); setIsAddingItem(false); }, 300);
  };

  const openMap = (address: string) => {
      setMapAddress(address);
      setIsMapLoaded(false); // Reseta o loading ao abrir
  };

  return (
    <div className="flex flex-col h-full bg-garra-bg relative">
      {/* Header Fixo */}
      <header className="sticky top-0 z-10 bg-garra-bg/95 backdrop-blur-sm border-b border-gray-800 p-5 shadow-lg space-y-4">
        
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Bem-vindo,</p>
            <h2 className="text-2xl font-black text-white">{technician.name}</h2>
          </div>
          
          <div className="flex gap-2">
            {onManageOS && (
                <button onClick={onManageOS} className="bg-gray-800 p-2 rounded-full border border-gray-600 hover:bg-garra-accent hover:border-garra-accent hover:text-white text-gray-400 transition-colors shadow-lg">
                <Settings size={20} />
                </button>
            )}
            
            <div className="flex items-center gap-2 bg-garra-card px-3 py-1 rounded-full border border-gray-700 h-10 opacity-70">
                <Truck size={14} className="text-garra-accent" />
                <span className="text-xs font-bold text-gray-300">{technician.vanStatus}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowPlanModal(true)} className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-garra-accent hover:bg-gray-750 transition-all active:scale-95 group shadow-lg">
            <div className="bg-yellow-500/10 p-2 rounded-full group-hover:bg-yellow-500/20"><Award className="text-yellow-500" size={20} /></div>
            <span className="text-xs font-bold text-gray-300 uppercase">Meu Plano</span>
          </button>
          
          <button onClick={() => setShowRankingModal(true)} className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-400 transition-all active:scale-95 group shadow-lg">
            <div className="bg-blue-500/10 p-2 rounded-full group-hover:bg-blue-500/20"><TrendingUp className="text-blue-400" size={20} /></div>
            <span className="text-xs font-bold text-gray-300 uppercase">Ranking</span>
          </button>

          <button onClick={() => setShowTeamModal(true)} className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-green-400 transition-all active:scale-95 group shadow-lg">
            <div className="bg-green-500/10 p-2 rounded-full group-hover:bg-green-500/20"><Users className="text-green-400" size={20} /></div>
            <span className="text-xs font-bold text-gray-300 uppercase">Equipe</span>
          </button>

          <button onClick={() => setShowVanModal(true)} className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-orange-500 transition-all active:scale-95 group shadow-lg">
            <div className="bg-orange-500/10 p-2 rounded-full group-hover:bg-orange-500/20"><Truck className="text-orange-500" size={20} /></div>
            <span className="text-xs font-bold text-gray-300 uppercase">Estoque</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-500" /></div>
          <input type="text" placeholder="Buscar escola ou ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-garra-accent focus:ring-1 focus:ring-garra-accent placeholder-gray-600 shadow-inner" />
        </div>
      </header>

      {/* ÁREA DE LISTA COM GESTÃO */}
      <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-2 p-4 pb-0">
             <div className="flex-1 flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button onClick={() => setActiveTab('pending')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'pending' ? 'bg-garra-card text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}><Clock size={12} /> Pendentes</button>
                <button onClick={() => setActiveTab('completed')} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'completed' ? 'bg-green-900/40 text-green-400 shadow' : 'text-gray-500 hover:text-gray-300'}`}><ListChecks size={12} /> Concluídas</button>
             </div>
             <button onClick={handleOpenCreate} className="bg-garra-accent hover:bg-orange-600 text-white p-3 rounded-lg shadow-lg transition-colors border border-orange-600" title="Nova OS"><Plus size={20} /></button>
          </div>

          <main className="flex-1 p-4 space-y-4 overflow-y-auto">
            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <CheckCircle size={48} className="mb-4 opacity-20" /><p>Nenhuma ordem de serviço encontrada.</p>
                </div>
            ) : (
                filteredOrders.map((os) => {
                const pStyle = getPriorityStyles(os.priority);
                const isCompleted = os.status === OSStatus.COMPLETED;
                return (
                    <div key={os.id} onClick={() => onSelectOS(os)} className={`bg-garra-card border rounded-lg p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden cursor-pointer group hover:border-garra-accent transition-colors ${isCompleted ? 'border-green-900/50 bg-green-900/5' : 'border-gray-700'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1.5 flex-1 mr-2">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-mono text-garra-accent bg-gray-800 px-2 py-0.5 rounded border border-gray-700">#{os.id}</span>
                                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${pStyle.badge} ${pStyle.text}`}><span className={`w-2 h-2 rounded-full ${pStyle.dot}`}></span>{os.priority}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isCompleted && (<div className="bg-green-500/20 p-1 rounded-full shrink-0"><CheckCircle className="text-garra-success" size={16} strokeWidth={3} /></div>)}
                                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-garra-accent transition-colors">{os.schoolName}</h3>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0 z-10">
                                <button onClick={(e) => handleOpenEdit(e, os)} className="p-2 bg-gray-700 hover:bg-blue-600 text-white rounded transition-colors border border-gray-600"><Edit2 size={16} /></button>
                                <button onClick={(e) => handleDeleteClick(e, os.id)} className="p-2 bg-gray-700 hover:bg-red-600 text-white rounded transition-colors border border-gray-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{os.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 border-t border-gray-700 pt-3">
                            <div className="font-bold text-gray-400 flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-garra-success' : 'bg-gray-600'}`}></span>{os.serviceName || 'Serviço N/D'}</div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                openMap(os.address);
                              }}
                              className="flex items-center gap-1 text-xs text-blue-400 hover:text-white hover:bg-blue-600 transition-colors z-10 bg-gray-800/50 px-2 py-1 rounded border border-gray-700"
                            >
                              <MapPin size={12} />
                              <span className="truncate max-w-[120px]">{os.address}</span>
                              <ExternalLink size={10} />
                            </button>
                        </div>
                    </div>
                );
                })
            )}
          </main>
      </div>

      {/* --- MODAL DO GOOGLE MAPS (CORRIGIDO: REMOVE CARREGANDO QUANDO PRONTO) --- */}
      {mapAddress && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-garra-bg w-full max-w-2xl h-[80vh] rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative flex flex-col">
            
            <div className="flex justify-between items-center p-4 bg-garra-card border-b border-gray-700">
               <div className="flex items-center gap-2 text-white font-bold">
                 <MapPin className="text-garra-accent" />
                 Localização da Escola
               </div>
               <button onClick={() => setMapAddress(null)} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 bg-gray-200 relative">
               <iframe 
                 width="100%" 
                 height="100%" 
                 frameBorder="0" 
                 scrolling="no" 
                 marginHeight={0} 
                 marginWidth={0} 
                 src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
                 title="Mapa"
                 onLoad={() => setIsMapLoaded(true)} // MÁGICA AQUI: Avisa quando carregou
               ></iframe>
               
               {/* SÓ MOSTRA SE NÃO TIVER CARREGADO AINDA */}
               {!isMapLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                    <div className="bg-white/80 px-4 py-2 rounded-full text-xs font-bold shadow text-black animate-pulse">Carregando mapa...</div>
                 </div>
               )}
            </div>

            <div className="p-4 bg-garra-card border-t border-gray-700 text-center">
               <p className="text-gray-400 text-xs mb-2">{mapAddress}</p>
               <a 
                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-wider"
               >
                 <ExternalLink size={12} /> Abrir no App Externo
               </a>
            </div>
          </div>
        </div>
      )}

      {/* --- OUTROS MODAIS --- */}
      {showVanModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-garra-bg w-full max-w-md rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button>
            <div className="bg-gradient-to-r from-orange-900 to-orange-800 p-6 text-center border-b border-orange-700 shrink-0">
              <div className="inline-block bg-white/10 p-3 rounded-full mb-3 shadow-inner"><Truck size={32} className="text-white" /></div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">{selectedVan ? selectedVan.name : 'Frota & Estoque'}</h2>
              <p className="text-orange-200 text-xs font-mono">{selectedVan ? `Condutor: ${selectedVan.driver}` : 'Gestão de Ativos Móveis'}</p>
            </div>
            <div className="flex-1 overflow-y-auto bg-garra-bg p-4 space-y-3">
              {!selectedVan ? (
                MOCK_VANS.map((van) => (
                  <div key={van.id} onClick={() => setSelectedVan(van)} className="bg-garra-card p-4 rounded-xl border border-gray-700 hover:border-garra-accent hover:bg-gray-750 transition-all cursor-pointer flex items-center justify-between group">
                    <div className="flex items-center gap-4"><div className="bg-gray-800 p-3 rounded-full group-hover:bg-garra-accent group-hover:text-white transition-colors text-gray-400"><Truck size={20} /></div><div><h3 className="font-bold text-white">{van.name}</h3><p className="text-xs text-gray-400">{van.driver} • {van.items.length} itens</p></div></div>
                    <div className="text-xs font-bold px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800">{van.status}</div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <button onClick={() => {setSelectedVan(null); setIsAddingItem(false);}} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm mb-2"><ArrowLeft size={16} /> Voltar para lista</button>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2"><Box size={16} /> Inventário Atual</h3><button onClick={() => setIsAddingItem(!isAddingItem)} className={`p-2 rounded-full transition-colors ${isAddingItem ? 'bg-red-500/20 text-red-400' : 'bg-garra-accent text-white shadow-lg'}`}>{isAddingItem ? <X size={16} /> : <Plus size={16} />}</button></div>
                    {isAddingItem && (<div className="mb-6 p-3 bg-gray-900 rounded-lg border border-gray-600 animate-fade-in"><label className="text-xs font-bold text-garra-accent uppercase mb-2 block">Adicionar Peças ao Estoque</label><div className="relative mb-2"><div className="flex items-center bg-garra-card border border-gray-600 rounded overflow-hidden"><div className="pl-2 text-gray-500"><Search size={14} /></div><input type="text" value={partsQuery} onFocus={() => setShowPartsList(true)} onChange={(e) => { setPartsQuery(e.target.value); setShowPartsList(true); }} placeholder="Buscar peça..." className="w-full p-2 bg-transparent text-white text-xs outline-none" /></div>{showPartsList && partsQuery.length > 0 && (<div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded shadow-xl z-20 max-h-32 overflow-y-auto mt-1">{filteredParts.map((part) => {const isSelected = newItemsText.includes(part);return (<button key={part} onClick={() => togglePart(part)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 text-left border-b border-gray-700/50">{isSelected ? <CheckSquare size={12} className="text-garra-accent" /> : <Square size={12} />}{part}</button>);})}</div>)}</div><textarea value={newItemsText} onChange={(e) => setNewItemsText(e.target.value)} className="w-full p-2 bg-garra-card text-white border border-gray-600 rounded text-xs h-16 resize-none mb-2 font-mono" placeholder="Itens selecionados..." /><Button fullWidth onClick={saveVanItems} icon={<Save size={16} />} style={{height: '40px', fontSize: '12px'}}>Confirmar Entrada</Button></div>)}
                    <div className="space-y-2">{selectedVan.items.length === 0 ? (<p className="text-center text-gray-500 text-xs py-4">Estoque vazio.</p>) : (selectedVan.items.map((item: string, idx: number) => (<div key={idx} className="flex items-center gap-3 p-2 bg-gray-700/30 rounded border border-gray-700/50"><Package size={16} className="text-gray-500" /><span className="text-sm text-gray-300">{item}</span></div>)))}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isOSModalOpen && (<div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"><div className="bg-garra-bg w-full h-[90%] sm:h-auto sm:max-h-[85vh] sm:max-w-md rounded-t-2xl sm:rounded-xl flex flex-col border border-gray-600 shadow-2xl"><div className="p-4 border-b border-gray-700 flex justify-between items-center bg-garra-card rounded-t-xl shrink-0"><h3 className="font-bold text-white text-lg">{editingOS ? 'Editar OS' : 'Nova OS'}</h3><button onClick={() => setIsOSModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button></div><form onSubmit={handleSaveOS} className="flex-1 overflow-y-auto p-6 space-y-4"><Input label="Nome da Escola" value={formData.schoolName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, schoolName: e.target.value})} required /><div className="flex gap-4"><div className="w-1/2 mb-4"><label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">Prioridade</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value as OSPriority})} className="w-full h-12 px-4 bg-garra-card text-white border-2 border-gray-700 rounded focus:border-garra-accent text-sm font-bold"><option value={OSPriority.HIGH}>Alta</option><option value={OSPriority.MEDIUM}>Média</option><option value={OSPriority.LOW}>Baixa</option></select></div><div className="w-1/2 mb-4"><label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as OSStatus})} className="w-full h-12 px-4 bg-garra-card text-white border-2 border-gray-700 rounded focus:border-garra-accent text-sm font-bold"><option value={OSStatus.PENDING}>Pendente</option><option value={OSStatus.IN_PROGRESS}>Em Andamento</option><option value={OSStatus.COMPLETED}>Finalizada</option></select></div></div><Input label="Serviço" value={formData.serviceName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, serviceName: e.target.value})} required /><div className="w-full mb-4"><label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">Descrição</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full p-4 bg-garra-card text-white border-2 border-gray-700 rounded focus:border-garra-accent resize-none" required /></div><Input label="Endereço" value={formData.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, address: e.target.value})} icon={<MapPin size={16}/>} required /><Input label="Contato" value={formData.contact || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, contact: e.target.value})} /></form><div className="p-4 border-t border-gray-700 bg-garra-card shrink-0"><Button fullWidth onClick={handleSaveOS} icon={<Save size={20}/>}>{editingOS ? 'Atualizar' : 'Criar'}</Button></div></div></div>)}
      {showPlanModal && (<div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"><div className="bg-garra-bg w-full max-w-sm rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"><button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button>{modalView === 'stats' ? (<div className="p-6 pt-12 text-center"><div className="inline-block bg-yellow-500/10 p-4 rounded-full mb-4 ring-1 ring-yellow-500/50"><Award size={48} className="text-yellow-500" /></div><h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">Técnico Pleno</h2><p className="text-gray-400 text-sm mb-8">Nível de Acesso 2</p><div className="text-left space-y-2 mb-8 bg-gray-800 p-4 rounded-xl border border-gray-700"><div className="flex justify-between text-xs font-bold text-gray-300 mb-1"><span>XP Atual</span><span className="text-garra-accent">750 / 1000</span></div><div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700"><div className="h-full bg-yellow-500 w-[75%] relative"><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div></div><p className="text-[10px] text-gray-500 text-right mt-1">Faltam 250 pontos para Sênior</p></div><button onClick={() => setModalView('levels')} className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-white font-bold transition-colors border border-gray-600">Ver Trajetória Completa</button></div>) : (<div className="flex flex-col h-full"><div className="p-4 border-b border-gray-700 flex items-center gap-2 bg-garra-card"><button onClick={() => setModalView('stats')} className="p-1 hover:bg-gray-700 rounded"><ArrowLeft className="text-gray-400" size={20} /></button><h2 className="text-lg font-bold text-white">Carreira</h2></div><div className="p-4 space-y-3 overflow-y-auto"><div className="p-4 bg-gray-800/50 rounded-xl flex items-center gap-4 opacity-50 border border-gray-700"><CheckCircle size={20} className="text-green-500"/> <div><h3 className="font-bold text-gray-300">Júnior</h3><p className="text-xs text-gray-500">Concluído</p></div></div><div className="p-4 bg-gray-800 border border-yellow-500/50 rounded-xl flex items-center gap-4 shadow-lg shadow-yellow-900/10"><Award size={24} className="text-yellow-500"/> <div><h3 className="font-bold text-white">Pleno (Atual)</h3><p className="text-xs text-yellow-500">Em progresso</p></div></div><div className="p-4 bg-gray-800 rounded-xl flex items-center gap-4 opacity-40 border border-gray-700"><Lock size={20} className="text-gray-400"/> <div><h3 className="font-bold text-gray-400">Sênior</h3><p className="text-xs text-gray-500">Bloqueado</p></div></div></div></div>)}</div></div>)}
      {showRankingModal && (<div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"><div className="bg-garra-bg w-full max-w-sm rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative"><button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button><div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 text-center border-b border-blue-700"><div className="inline-block bg-white/10 p-3 rounded-full mb-3 shadow-inner"><Trophy size={32} className="text-yellow-400 drop-shadow-md" /></div><h2 className="text-xl font-black text-white uppercase tracking-wider">Liga de Excelência</h2><p className="text-blue-200 text-xs">Ranking Mensal - Região Norte</p></div><div className="p-4 bg-garra-bg max-h-[60vh] overflow-y-auto space-y-2"><div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-3 rounded-lg border border-yellow-500/30 flex items-center gap-3 relative"><div className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl shadow">LÍDER</div><div className="text-yellow-500 font-black text-xl italic w-6">1º</div><div className="bg-gray-700 p-2 rounded-full border border-yellow-500/50"><Medal size={20} className="text-yellow-500" /></div><div className="flex-1"><h3 className="text-white font-bold text-sm">Simone Alves</h3><div className="flex items-center gap-1 text-xs text-gray-400"><Star size={10} className="text-yellow-500 fill-current" /> 5.0 <span className="text-gray-600">|</span> 142 OS</div></div></div><div className="bg-garra-card p-3 rounded-lg border border-gray-600 flex items-center gap-3"><div className="text-gray-400 font-black text-xl italic w-6">2º</div><div className="bg-gray-700 p-2 rounded-full"><Medal size={20} className="text-gray-300" /></div><div className="flex-1"><h3 className="text-gray-200 font-bold text-sm">Roberto Jr.</h3><div className="flex items-center gap-1 text-xs text-gray-500"><Star size={10} className="text-yellow-500 fill-current" /> 4.9 <span className="text-gray-600">|</span> 138 OS</div></div></div><div className="bg-garra-card p-3 rounded-lg border border-gray-600 flex items-center gap-3"><div className="text-orange-700 font-black text-xl italic w-6">3º</div><div className="bg-gray-700 p-2 rounded-full"><Medal size={20} className="text-orange-700" /></div><div className="flex-1"><h3 className="text-gray-200 font-bold text-sm">João Souza</h3><div className="flex items-center gap-1 text-xs text-gray-500"><Star size={10} className="text-yellow-500 fill-current" /> 4.9 <span className="text-gray-600">|</span> 130 OS</div></div></div><hr className="border-gray-700 my-2 opacity-50" /><div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/50 flex items-center gap-3 transform scale-105 shadow-lg relative overflow-hidden"><div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div><div className="text-blue-400 font-black text-xl italic w-6 z-10">4º</div><div className="bg-blue-900 p-2 rounded-full border border-blue-500 z-10"><Zap size={20} className="text-white" /></div><div className="flex-1 z-10"><h3 className="text-white font-bold text-sm">Você (Roberto)</h3><p className="text-[10px] text-blue-300">Faltam 2 OS para o pódio!</p></div><div className="text-right z-10"><div className="font-bold text-white text-sm">4.9</div><div className="text-[10px] text-gray-400">128 OS</div></div></div></div></div></div>)}
      {showTeamModal && (<div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"><div className="bg-garra-bg w-full max-w-sm rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative"><button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button><div className="bg-gradient-to-r from-green-900 to-green-800 p-6 text-center border-b border-green-700"><div className="inline-block bg-white/10 p-3 rounded-full mb-3"><Users size={32} className="text-white" /></div><h2 className="text-xl font-black text-white uppercase tracking-wider">Equipes em Campo</h2><p className="text-green-200 text-xs font-mono">LIVE TRACKING • ON</p></div><div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto bg-garra-bg"><div className="bg-garra-card p-4 rounded-xl border border-green-500/30 shadow-lg relative overflow-hidden group"><div className="absolute right-0 top-0 bg-green-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl flex items-center gap-1"><Signal size={8} /> ONLINE</div><div className="flex items-start gap-3"><div className="bg-gray-700 p-2 rounded-full"><Users size={20} className="text-green-400" /></div><div><h3 className="font-bold text-white text-sm">Equipe Alpha (Simone)</h3><div className="flex items-center gap-1 text-xs text-gray-400 mt-1"><MapPin size={10} className="text-garra-accent" /><span>CMEI Girassol (0.5km)</span></div><div className="flex items-center gap-1 text-xs text-gray-300 mt-2 bg-gray-800/50 p-1.5 rounded"><Wrench size={10} className="text-yellow-500" /><span>Pintura de Fachada</span></div></div></div></div><div className="bg-garra-card p-4 rounded-xl border border-gray-700 opacity-60"><div className="flex items-start gap-3"><div className="bg-gray-700 p-2 rounded-full"><Users size={20} className="text-blue-400" /></div><div><h3 className="font-bold text-gray-300 text-sm">Equipe Beta (Roberto)</h3><div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><CheckCircle size={10} /><span>Finalizando serviço...</span></div></div></div></div></div></div></div>)}

    </div>
  );
};