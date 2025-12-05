import React, { useState } from 'react';
import { Technician, ServiceOrder, OSPriority } from '../types';
import { 
  MapPin, Calendar, Search, AlertTriangle, Clock, ChevronRight, ExternalLink,
  Award, TrendingUp, Users, Star, X, CheckCircle, Lock, ArrowLeft,
  Wrench, Truck, Signal, Trophy, Medal, Zap
} from 'lucide-react';

interface Props {
  technician: Technician;
  orders: ServiceOrder[];
  onSelectOS: (os: ServiceOrder) => void;
  onManageOS: () => void;
}

export const DashboardView = ({ technician, orders, onSelectOS, onManageOS }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Controles dos Modais
  const [showPlanModal, setShowPlanModal] = useState(false); 
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false); // NOVO: Controle do Ranking
  
  const [modalView, setModalView] = useState<'stats' | 'levels'>('stats');

  const filteredOrders = orders.filter(os => 
    os.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.id.includes(searchTerm)
  );

  const getPriorityColor = (priority: OSPriority) => {
    switch (priority) {
      case OSPriority.HIGH: return 'text-red-400 bg-red-400/10 border-red-400/20';
      case OSPriority.MEDIUM: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case OSPriority.LOW: return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400';
    }
  };

  const handleCloseModal = () => {
    setShowPlanModal(false);
    setShowTeamModal(false);
    setShowRankingModal(false);
    setTimeout(() => setModalView('stats'), 300);
  };

  return (
    <div className="flex flex-col h-full bg-garra-bg relative">
      
      {/* Cabeçalho Fixo */}
      <div className="bg-garra-card border-b border-gray-700 p-5 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Técnico Responsável</p>
            <h1 className="text-2xl font-bold text-white">{technician.name}</h1>
          </div>
          <button onClick={onManageOS} className="text-xs font-bold text-garra-accent border border-garra-accent px-3 py-1 rounded-full hover:bg-garra-accent hover:text-white transition-colors">
            ADMIN
          </button>
        </div>

        {/* BARRA DE ATALHOS (TODOS FUNCIONANDO AGORA) */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button onClick={() => setShowPlanModal(true)} className="flex flex-col items-center justify-center bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-garra-accent hover:bg-gray-750 transition-all active:scale-95 group">
            <Award className="text-yellow-500 mb-1 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[10px] font-bold text-gray-300 uppercase">Meu Plano</span>
          </button>
          
          {/* Botão Ranking AGORA ATIVO */}
          <button onClick={() => setShowRankingModal(true)} className="flex flex-col items-center justify-center bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-400 transition-all active:scale-95 group">
            <TrendingUp className="text-blue-400 mb-1 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[10px] font-bold text-gray-300 uppercase">Ranking</span>
          </button>

          <button onClick={() => setShowTeamModal(true)} className="flex flex-col items-center justify-center bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-green-400 transition-all active:scale-95 group">
            <Users className="text-green-400 mb-1 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[10px] font-bold text-gray-300 uppercase">Equipe</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar escola ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-garra-accent focus:ring-1 focus:ring-garra-accent placeholder-gray-600"
          />
        </div>
      </div>

      {/* Lista de Chamados */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-gray-500 text-sm font-medium px-1">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'chamado encontrado' : 'chamados encontrados'}
        </p>
        {filteredOrders.map(os => (
          <div key={os.id} onClick={() => onSelectOS(os)} className="group bg-garra-card rounded-xl p-5 border border-gray-700 shadow-md active:scale-[0.98] transition-all cursor-pointer hover:border-gray-500 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${os.priority === OSPriority.HIGH ? 'bg-red-500' : os.priority === OSPriority.MEDIUM ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <div className="flex justify-between items-start mb-3 pl-2">
              <span className="text-xs font-mono text-gray-500">#{os.id}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${getPriorityColor(os.priority)} flex items-center gap-1`}>
                {os.priority === OSPriority.HIGH && <AlertTriangle size={12} />}
                {os.priority}
              </span>
            </div>
            <div className="pl-2 pr-6">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-garra-accent transition-colors">{os.schoolName}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{os.description}</p>
              <div className="space-y-3">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(os.address)}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center text-gray-400 text-xs hover:text-garra-accent transition-colors group/map w-fit p-1 -ml-1 rounded hover:bg-gray-800">
                  <MapPin size={14} className="mr-2 text-garra-accent" />
                  <span className="truncate underline decoration-dotted decoration-gray-600 group-hover/map:decoration-garra-accent group-hover/map:text-white">{os.address}</span>
                  <ExternalLink size={10} className="ml-2 opacity-0 group-hover/map:opacity-100 transition-opacity" />
                </a>
                <div className="flex items-center text-gray-400 text-xs">
                  <Calendar size={14} className="mr-2 text-garra-accent" />
                  <span>Última visita: {os.lastVisitDate}</span>
                </div>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-garra-accent"><ChevronRight size={24} /></div>
            <div className="mt-4 pl-2 pt-3 border-t border-gray-700 flex justify-between items-center">
               <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-900/30 px-2 py-1 rounded"><Clock size={12} />{os.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL 1: PLANO DE CARREIRA --- */}
      {showPlanModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-garra-card w-full max-w-sm rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button>
            {modalView === 'stats' ? (
               <div className="p-6 pt-12 text-center">
                  <Award size={40} className="text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-6">Técnico Pleno</h2>
                  <div className="text-left space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progresso</span><span>75%</span></div>
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[75%]"></div></div>
                    </div>
                  </div>
                  <button onClick={() => setModalView('levels')} className="w-full bg-gray-700 py-3 rounded text-white font-bold">Ver Trajetória</button>
               </div>
            ) : (
               <div className="p-6 pt-12">
                  <div className="flex items-center gap-2 mb-4"><button onClick={() => setModalView('stats')}><ArrowLeft className="text-gray-400" /></button><h2 className="text-xl font-bold text-white">Carreira</h2></div>
                  <div className="space-y-3">
                     <div className="p-3 bg-gray-700/50 rounded flex items-center gap-3 opacity-50"><CheckCircle size={16} className="text-green-500"/> Júnior</div>
                     <div className="p-3 bg-gray-700 border border-yellow-500 rounded flex items-center gap-3"><Award size={16} className="text-yellow-500"/> Pleno (Atual)</div>
                     <div className="p-3 bg-gray-800 rounded flex items-center gap-3 opacity-50"><Lock size={16} /> Sênior</div>
                  </div>
               </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 2: MONITORAMENTO DE EQUIPE --- */}
      {showTeamModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-garra-card w-full max-w-sm rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button>
            <div className="bg-gradient-to-r from-green-800 to-green-600 p-6 text-center">
              <div className="inline-block bg-white/20 p-3 rounded-full mb-3 shadow-inner"><Users size={32} className="text-white" /></div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Equipes em Campo</h2>
              <p className="text-green-100 text-xs">Atualizado há 2 min</p>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto bg-garra-bg">
              <div className="bg-garra-card p-4 rounded-xl border border-green-500/30 shadow-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 bg-green-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl flex items-center gap-1"><Signal size={8} /> ONLINE</div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-700 p-2 rounded-full"><Users size={20} className="text-green-400" /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Equipe Alpha (Simone)</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1"><MapPin size={10} className="text-garra-accent" /><span>CMEI Girassol</span></div>
                    <div className="flex items-center gap-1 text-xs text-gray-300 mt-2 bg-gray-800/50 p-1.5 rounded"><Wrench size={10} className="text-yellow-500" /><span>Pintura de Fachada</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: RANKING (NOVO) --- */}
      {showRankingModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-garra-card w-full max-w-sm rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative">
            
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-white bg-black/20 hover:bg-red-500/80 p-1 rounded-full z-20"><X size={20} /></button>

            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-center">
              <div className="inline-block bg-white/20 p-3 rounded-full mb-3 shadow-inner">
                <Trophy size={32} className="text-yellow-400 drop-shadow-md" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Liga de Excelência</h2>
              <p className="text-blue-100 text-xs">Ranking Mensal - Região Norte</p>
            </div>

            {/* Lista do Pódio */}
            <div className="p-4 bg-garra-bg max-h-[60vh] overflow-y-auto space-y-2">
              
              {/* Top 1 - Simone */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-transparent p-3 rounded-lg border border-yellow-500/50 flex items-center gap-3 relative">
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl shadow">LÍDER</div>
                <div className="text-yellow-500 font-black text-xl italic w-6">1º</div>
                <div className="bg-gray-700 p-2 rounded-full border border-yellow-500"><Award size={20} className="text-yellow-500" /></div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">Simone Alves</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star size={10} className="text-yellow-500 fill-current" /> 5.0 <span className="text-gray-600">|</span> 142 OS
                  </div>
                </div>
              </div>

              {/* Top 2 - Roberto */}
              <div className="bg-garra-card p-3 rounded-lg border border-gray-600 flex items-center gap-3">
                <div className="text-gray-400 font-black text-xl italic w-6">2º</div>
                <div className="bg-gray-700 p-2 rounded-full"><Medal size={20} className="text-gray-300" /></div>
                <div className="flex-1">
                  <h3 className="text-gray-200 font-bold text-sm">Roberto Jr.</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={10} className="text-yellow-500 fill-current" /> 4.9 <span className="text-gray-600">|</span> 138 OS
                  </div>
                </div>
              </div>

              {/* Top 3 - João */}
              <div className="bg-garra-card p-3 rounded-lg border border-gray-600 flex items-center gap-3">
                <div className="text-orange-700 font-black text-xl italic w-6">3º</div>
                <div className="bg-gray-700 p-2 rounded-full"><Medal size={20} className="text-orange-700" /></div>
                <div className="flex-1">
                  <h3 className="text-gray-200 font-bold text-sm">João Souza</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={10} className="text-yellow-500 fill-current" /> 4.9 <span className="text-gray-600">|</span> 130 OS
                  </div>
                </div>
              </div>

              <hr className="border-gray-700 my-2 opacity-50" />

              {/* VOCÊ (Carlos) - Destaque Pessoal */}
              <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/50 flex items-center gap-3 transform scale-105 shadow-lg">
                <div className="text-blue-400 font-black text-xl italic w-6">4º</div>
                <div className="bg-blue-900 p-2 rounded-full border border-blue-500"><Zap size={20} className="text-white" /></div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">Você (Carlos)</h3>
                  <p className="text-[10px] text-blue-300">Faltam 2 OS para o pódio!</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">4.9</div>
                  <div className="text-[10px] text-gray-400">128 OS</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};