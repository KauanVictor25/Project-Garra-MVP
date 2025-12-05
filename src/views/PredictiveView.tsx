import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Activity } from 'lucide-react';

export const PredictiveView = ({ onFinish }: { onFinish: (status: 'green' | 'yellow' | 'red') => void }) => {
  const [selectedStatus, setSelectedStatus] = useState<'green' | 'yellow' | 'red' | null>(null);

  const handleSelect = (status: 'green' | 'yellow' | 'red') => {
    setSelectedStatus(status);
  };

  return (
    <div className="flex flex-col h-full bg-garra-bg px-6 py-8">
      
      {/* Cabeçalho Impactante */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-gray-800 rounded-full mb-4 border border-gray-700 shadow-xl">
          <Activity size={32} className="text-garra-accent" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Análise Técnica</h1>
        <p className="text-gray-400 text-sm">
          Para finalizar, qual é a <span className="text-garra-accent font-bold">saúde geral</span> do equipamento/local atendido?
        </p>
      </div>

      {/* Opções do Semáforo */}
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        
        {/* Opção VERDE */}
        <button
          onClick={() => handleSelect('green')}
          className={`relative group w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
            selectedStatus === 'green' 
              ? 'bg-green-900/40 border-green-500 shadow-[0_0_20px_rgba(72,187,120,0.3)] scale-105' 
              : 'bg-garra-card border-transparent hover:border-gray-600 opacity-60 hover:opacity-100'
          }`}
        >
          <div className={`p-3 rounded-full transition-colors ${selectedStatus === 'green' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
            <CheckCircle size={24} />
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-lg ${selectedStatus === 'green' ? 'text-white' : 'text-gray-300'}`}>Saudável</h3>
            <p className="text-xs text-gray-500">Equipamento em perfeito estado. Sem risco de falha em breve.</p>
          </div>
          {selectedStatus === 'green' && <div className="absolute right-4 w-3 h-3 bg-green-500 rounded-full animate-ping" />}
        </button>

        {/* Opção AMARELA */}
        <button
          onClick={() => handleSelect('yellow')}
          className={`relative group w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
            selectedStatus === 'yellow' 
              ? 'bg-yellow-900/40 border-yellow-500 shadow-[0_0_20px_rgba(236,201,75,0.3)] scale-105' 
              : 'bg-garra-card border-transparent hover:border-gray-600 opacity-60 hover:opacity-100'
          }`}
        >
          <div className={`p-3 rounded-full transition-colors ${selectedStatus === 'yellow' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
            <AlertTriangle size={24} />
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-lg ${selectedStatus === 'yellow' ? 'text-white' : 'text-gray-300'}`}>Atenção</h3>
            <p className="text-xs text-gray-500">Funcional, mas apresenta desgaste. Requer monitoramento.</p>
          </div>
          {selectedStatus === 'yellow' && <div className="absolute right-4 w-3 h-3 bg-yellow-500 rounded-full animate-ping" />}
        </button>

        {/* Opção VERMELHA */}
        <button
          onClick={() => handleSelect('red')}
          className={`relative group w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
            selectedStatus === 'red' 
              ? 'bg-red-900/40 border-red-500 shadow-[0_0_20px_rgba(245,101,101,0.3)] scale-105' 
              : 'bg-garra-card border-transparent hover:border-gray-600 opacity-60 hover:opacity-100'
          }`}
        >
          <div className={`p-3 rounded-full transition-colors ${selectedStatus === 'red' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
            <XCircle size={24} />
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-lg ${selectedStatus === 'red' ? 'text-white' : 'text-gray-300'}`}>Crítico</h3>
            <p className="text-xs text-gray-500">Risco iminente de quebra. Recomendada substituição imediata.</p>
          </div>
          {selectedStatus === 'red' && <div className="absolute right-4 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
        </button>

      </div>

      {/* Botão de Confirmação */}
      <div className="mt-8">
        <button
          onClick={() => selectedStatus && onFinish(selectedStatus)}
          disabled={!selectedStatus}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            selectedStatus 
              ? 'bg-white text-garra-bg hover:bg-gray-200 translate-y-0 opacity-100' 
              : 'bg-gray-800 text-gray-500 translate-y-4 opacity-0 cursor-not-allowed'
          }`}
        >
          CONFIRMAR E ENCERRAR
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};