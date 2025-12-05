import React from 'react';
import { ServiceOrder } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Clock, 
  History, 
  Image as IconImage, 
  AlertCircle,
  Wrench
} from 'lucide-react';

interface Props {
  os: ServiceOrder;
  allOrders: ServiceOrder[];
  onBack: () => void;
  onStart: (serviceName: string) => void;
  onDeletePhoto: (id: string, url: string) => void;
}

export const DetailsView = ({ os, onBack, onStart }: Props) => {
  
  const formatContact = (contact?: string) => {
    if (!contact) return "Sem contato cadastrado";
    return contact;
  };

  if (!os) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col h-full bg-garra-bg overflow-y-auto">
      
      {/* Barra de Navegação */}
      <div className="bg-garra-card p-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-700 shadow-md">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-300"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-lg font-bold leading-tight">Detalhes da OS</h2>
          <span className="text-xs text-garra-accent font-mono">#{os.id}</span>
        </div>
      </div>

      <div className="p-5 space-y-6 pb-24">
        
        {/* Cabeçalho da Escola */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{os.schoolName}</h1>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-garra-accent mt-1 shrink-0" />
              <span>{os.address}</span>
            </div>
          </div>
        </div>

        {/* Descrição do Problema Atual */}
        <div className="bg-garra-card border border-gray-700 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-yellow-500 font-bold uppercase text-xs tracking-wide">
            <AlertCircle size={14} />
            Solicitação Atual
          </div>
          <p className="text-gray-200 leading-relaxed text-lg">
            {os.description}
          </p>
        </div>

        <hr className="border-gray-800" />

        {/* --- HISTÓRICO EM DESTAQUE --- */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History size={16} />
            Histórico da Última Visita
          </h3>
          
          <div className="bg-gray-900/80 rounded-xl border border-garra-card overflow-hidden">
            
            {/* Lista de Informações (Grade) */}
            <div className="p-4 grid grid-cols-1 gap-4 border-b border-gray-800">
              
              {/* Quem foi? */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-900/30 p-2 rounded-lg border border-blue-900/50">
                  <User size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Responsável Anterior</p>
                  <p className="text-lg font-bold text-white">{os.lastVisitTechnician}</p>
                </div>
              </div>

              {/* O que fez? */}
              <div className="flex items-center gap-3">
                <div className="bg-purple-900/30 p-2 rounded-lg border border-purple-900/50">
                  <Wrench size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Serviço Realizado</p>
                  <p className="text-base font-semibold text-gray-200">{os.serviceName}</p>
                </div>
              </div>

              {/* Quando? */}
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Data</p>
                  <p className="text-sm text-gray-300">{os.lastVisitDate}</p>
                </div>
              </div>

            </div>

            {/* Foto do Serviço Anterior */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <IconImage size={12} /> Evidência fotográfica:
              </p>
              
              {os.lastVisitPhotoUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                  <img 
                    src={os.lastVisitPhotoUrl} 
                    alt="Serviço anterior" 
                    className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              ) : (
                <div className="h-20 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-sm">
                  Sem foto registrada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-garra-bg border-t border-gray-800 max-w-md mx-auto">
        <button 
          onClick={() => onStart(os.serviceName)} 
          className="w-full bg-garra-accent hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 text-lg active:scale-95 transition-all"
        >
          <Clock size={20} />
          INICIAR SERVIÇO
        </button>
      </div>
    </div>
  );
};