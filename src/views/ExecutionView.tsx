import React, { useState, useRef } from 'react';
import { ServiceOrder, OSPhoto } from '../types';
import { Button } from '../components/Button';
import { ChevronLeft, Camera, Trash2, Wrench, Package, Search, CheckSquare, Square } from 'lucide-react';

interface ExecutionViewProps {
  os: ServiceOrder;
  onBack: () => void;
  onFinish: (data: { solution: string; parts: string; photos: OSPhoto[] }) => void;
}

// --- DADOS MOCKADOS PARA SUGESTÕES ---
const ELECTRICAL_SUGGESTIONS = [
  "Troca de Disjuntor",
  "Reaperto de Conexões",
  "Troca de Reator/Lâmpada",
  "Isolamento de Fiação",
  "Substituição de Tomada",
  "Balanceamento de Fases"
];

const PLUMBING_SUGGESTIONS = [
  "Troca de Reparo de Torneira",
  "Desentupimento de Sifão",
  "Substituição de Flexível",
  "Vedação com Silicone",
  "Troca de Boia da Caixa"
];

// --- BANCO DE PEÇAS (MOCK) ---
const PARTS_DATABASE = [
  "Cabo Flexível 2.5mm (Vermelho)",
  "Cabo Flexível 2.5mm (Azul)",
  "Cabo Flexível 6.0mm (Preto)",
  "Disjuntor DIN 16A",
  "Disjuntor DIN 20A",
  "Disjuntor DIN 40A",
  "Fita Isolante 3M",
  "Cano PVC 20mm (Soldável)",
  "Cano PVC 25mm (Soldável)",
  "Cano PVC 40mm (Esgoto)",
  "Luva de Correr 25mm",
  "Joelho 90 graus 25mm",
  "Torneira de Metal 1/2",
  "Sifão Universal Branco",
  "Lâmpada LED 9W",
  "Reator Eletrônico 2x20W",
  "Tomada 10A c/ Espelho"
];

export const ExecutionView: React.FC<ExecutionViewProps> = ({ os, onBack, onFinish }) => {
  // Photo State
  const [photoBefore, setPhotoBefore] = useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = useState<string | null>(null);
  
  // Fields State
  const [solution, setSolution] = useState('');
  const [parts, setParts] = useState('');

  // Parts Search State
  const [partsQuery, setPartsQuery] = useState('');
  const [showPartsList, setShowPartsList] = useState(false);

  const fileInputBeforeRef = useRef<HTMLInputElement>(null);
  const fileInputAfterRef = useRef<HTMLInputElement>(null);

  // Detectar Tipo de Serviço para Sugestões
  const isElectrical = os.serviceName.toLowerCase().includes('elét') || os.serviceName.toLowerCase().includes('ilumina') || os.serviceName.toLowerCase().includes('disjuntor');
  const isPlumbing = os.serviceName.toLowerCase().includes('hidráuli') || os.serviceName.toLowerCase().includes('vazamento') || os.serviceName.toLowerCase().includes('pia');

  const activeSuggestions = isElectrical ? ELECTRICAL_SUGGESTIONS : (isPlumbing ? PLUMBING_SUGGESTIONS : []);

  // --- LÓGICA DE FOTOS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (type === 'before') setPhotoBefore(url);
      else setPhotoAfter(url);
    }
  };

  const triggerUpload = (type: 'before' | 'after') => {
    if (type === 'before') fileInputBeforeRef.current?.click();
    else fileInputAfterRef.current?.click();
  };

  // --- LÓGICA DE SUGESTÕES (SOLUÇÃO) ---
  const toggleSuggestion = (text: string) => {
    setSolution(prev => {
      // Se já tem o texto, remove
      if (prev.includes(text)) {
        return prev.replace(text + '; ', '').replace(text, '').trim();
      }
      // Se não tem, adiciona
      const separator = prev.length > 0 && !prev.endsWith('; ') ? '; ' : '';
      return prev + separator + text;
    });
  };

  // --- LÓGICA DE PEÇAS (BUSCA E SELEÇÃO) ---
  const filteredParts = PARTS_DATABASE.filter(p => 
    p.toLowerCase().includes(partsQuery.toLowerCase())
  );

  const togglePart = (partName: string) => {
    setParts(prev => {
      if (prev.includes(partName)) {
        return prev.replace(partName + ', ', '').replace(partName, '').trim();
      }
      const separator = prev.length > 0 && !prev.endsWith(', ') ? ', ' : '';
      return prev + separator + partName;
    });
  };

  // Validação Final
  const canFinish = photoBefore !== null && photoAfter !== null && solution.trim().length > 0 && parts.trim().length > 0;

  const handleSubmit = () => {
    if (!canFinish) return;

    const photos: OSPhoto[] = [];
    if (photoBefore) {
        photos.push({ url: photoBefore, type: 'BEFORE', timestamp: new Date().toISOString() });
    }
    if (photoAfter) {
        photos.push({ url: photoAfter, type: 'AFTER', timestamp: new Date().toISOString() });
    }

    onFinish({ solution, parts, photos });
  };

  return (
    <div className="flex flex-col h-full bg-garra-bg">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-800">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div>
           <span className="font-bold text-lg block leading-none text-white">Execução</span>
           <span className="text-xs text-garra-accent font-mono">OS #{os.id} - {os.serviceName.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* --- SEÇÃO 1: FOTOS --- */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <h3 className="font-bold text-white text-xs uppercase mb-1">1. Antes <span className="text-garra-danger">*</span></h3>
                <div className={`border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center transition-all overflow-hidden relative ${photoBefore ? 'border-garra-success' : 'border-gray-600 bg-gray-800/30'}`}>
                    {photoBefore ? (
                    <>
                        {/* AQUI ESTÁ A CORREÇÃO: object-contain */}
                        <img src={photoBefore} alt="Antes" className="w-full h-full object-contain bg-black/30" />
                        <button onClick={() => setPhotoBefore(null)} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white shadow-lg"><Trash2 size={12} /></button>
                    </>
                    ) : (
                    <button onClick={() => triggerUpload('before')} className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-800 transition-colors">
                        <Camera size={24} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-400 font-bold uppercase">Foto</span>
                    </button>
                    )}
                    <input type="file" ref={fileInputBeforeRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'before')} />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-white text-xs uppercase mb-1">2. Depois <span className="text-garra-danger">*</span></h3>
                <div className={`border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center transition-all overflow-hidden relative ${photoAfter ? 'border-garra-success' : 'border-gray-600 bg-gray-800/30'}`}>
                    {photoAfter ? (
                    <>
                        {/* AQUI ESTÁ A CORREÇÃO: object-contain */}
                        <img src={photoAfter} alt="Depois" className="w-full h-full object-contain bg-black/30" />
                        <button onClick={() => setPhotoAfter(null)} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white shadow-lg"><Trash2 size={12} /></button>
                    </>
                    ) : (
                    <button onClick={() => triggerUpload('after')} className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-800 transition-colors">
                        <Camera size={24} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-400 font-bold uppercase">Foto</span>
                    </button>
                    )}
                    <input type="file" ref={fileInputAfterRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'after')} />
                </div>
            </div>
        </div>

        <hr className="border-gray-800" />

        {/* --- SEÇÃO 2: RELATÓRIO TÉCNICO INTELIGENTE --- */}
        <div className="space-y-6">
            
            {/* SOLUÇÃO APLICADA */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-garra-accent uppercase">
                    <Wrench size={16} /> Solução Aplicada <span className="text-garra-danger">*</span>
                </label>
                
                {/* Sugestões Rápidas (Checkboxes) */}
                {activeSuggestions.length > 0 && (
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 mb-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Sugestões Rápidas:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeSuggestions.map((sug) => {
                        const isSelected = solution.includes(sug);
                        return (
                          <button
                            key={sug}
                            onClick={() => toggleSuggestion(sug)}
                            className={`flex items-center gap-2 text-xs px-3 py-2 rounded border transition-all text-left ${isSelected ? 'bg-garra-accent/20 border-garra-accent text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'}`}
                          >
                            {isSelected ? <CheckSquare size={14} className="text-garra-accent shrink-0" /> : <Square size={14} className="shrink-0" />}
                            {sug}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <textarea 
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Descreva detalhes adicionais..."
                    className="w-full p-3 bg-garra-card text-white border border-gray-600 rounded-lg focus:outline-none focus:border-garra-accent h-24 resize-none"
                />
            </div>

            {/* PEÇAS UTILIZADAS (AUTOCOMPLETE) */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-garra-accent uppercase">
                    <Package size={16} /> Peças Utilizadas <span className="text-garra-danger">*</span>
                </label>
                
                {/* Campo de Busca de Peças */}
                <div className="relative">
                  <div className="flex items-center bg-garra-card border border-gray-600 rounded-lg overflow-hidden focus-within:border-garra-accent mb-2">
                    <div className="pl-3 text-gray-500"><Search size={16} /></div>
                    <input 
                      type="text"
                      value={partsQuery}
                      onFocus={() => setShowPartsList(true)}
                      onChange={(e) => {
                        setPartsQuery(e.target.value);
                        setShowPartsList(true);
                      }}
                      placeholder="Pesquisar peça (ex: cano, fio)..."
                      className="w-full p-3 bg-transparent text-white outline-none placeholder-gray-600 text-sm"
                    />
                  </div>

                  {/* Lista de Sugestões de Peças */}
                  {showPartsList && partsQuery.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto mt-1">
                      {filteredParts.length > 0 ? (
                        filteredParts.map((part) => {
                          const isSelected = parts.includes(part);
                          return (
                            <button
                              key={part}
                              onClick={() => togglePart(part)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 border-b border-gray-700/50 last:border-0 text-left"
                            >
                              {isSelected ? <CheckSquare size={16} className="text-garra-accent" /> : <Square size={16} />}
                              {part}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-xs text-gray-500 text-center">Nenhuma peça encontrada. <br/> Digite no campo abaixo se for nova.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Área de Texto Final (Editável) */}
                <textarea 
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                    placeholder="Itens selecionados aparecerão aqui..."
                    className="w-full p-3 bg-garra-card text-white border border-gray-600 rounded-lg focus:outline-none focus:border-garra-accent h-20 resize-none font-mono text-sm"
                />
            </div>
        </div>

      </div>

      <div className="p-6 border-t border-gray-800 bg-garra-bg">
        <Button 
          fullWidth 
          onClick={handleSubmit} 
          disabled={!canFinish}
          variant={canFinish ? 'primary' : 'secondary'}
        >
          {canFinish ? 'AVANÇAR PARA VISTORIA' : 'PREENCHA TUDO'}
        </Button>
      </div>
    </div>
  );
};