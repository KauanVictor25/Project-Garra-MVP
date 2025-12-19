import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Clock, AlertTriangle, CheckCircle2, Calendar, User, PenTool, X, Camera, Trash2, Edit, FileText, Layers, BookOpen, ChevronDown, ChevronUp, Image as ImageIcon, History, ExternalLink } from 'lucide-react';
import { ServiceOrder, OSPriority, OSStatus } from '../types';
import { Button } from '../components/Button';

interface DetailsViewProps {
  os: ServiceOrder;
  allOrders: ServiceOrder[];
  onBack: () => void;
  onStart: (serviceName: string) => void;
  onDeletePhoto?: (osId: string, photoUrl: string) => void;
  onEditCardDetails?: (osId: string, updates: Partial<ServiceOrder>) => void;
  onDeleteCard?: (osId: string) => void;
}

const MOCK_SIMILAR_CASES = [
  {
    id: 101,
    school: "Escola Estadual Zona Sul",
    technician: "Pedro Alcantara",
    problem: "Curto intermitente no quadro bifásico",
    solution: "Identificado barramento de neutro oxidado. Limpeza e troca dos terminais.",
    likes: 12
  },
  {
    id: 102,
    school: "CMEI Raio de Sol",
    technician: "João Souza",
    problem: "Disjuntor desarmando (Sobrecarga Ar-Condicionado)",
    solution: "Substituição por disjuntor curva C 32A e balanceamento de fase.",
    likes: 8
  }
];

export const DetailsView: React.FC<DetailsViewProps> = ({ 
    os, 
    onBack, 
    onStart, 
    onDeletePhoto,
    onEditCardDetails,
    onDeleteCard
}) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'similar'>('history');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(os.description);
  const [editedAddress, setEditedAddress] = useState(os.address);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const priorityColors = {
    [OSPriority.LOW]: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    [OSPriority.MEDIUM]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    [OSPriority.HIGH]: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const statusIcons = {
    [OSStatus.PENDING]: <Clock className="w-5 h-5 text-yellow-400" />,
    [OSStatus.IN_PROGRESS]: <PenTool className="w-5 h-5 text-blue-400 animate-pulse" />,
    [OSStatus.COMPLETED]: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  };

  const handleSaveEdit = () => {
      if (onEditCardDetails) {
          onEditCardDetails(os.id, {
              description: editedDescription,
              address: editedAddress
          });
      }
      setIsEditing(false);
  };

  const handleDeleteThisCard = () => {
      if (window.confirm("Tem certeza que deseja excluir esta OS?")) {
          if (onDeleteCard) {
              onDeleteCard(os.id);
              onBack(); 
          }
      }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "https://placehold.co/600x400/8B0000/FFF?text=ERRO:+FOTO+NAO+ENCONTRADA";
  };

  return (
    <div className="flex flex-col h-full bg-garra-bg relative">
      {/* HEADER */}
      <div className="bg-gradient-to-b from-garra-bg-dark to-garra-bg p-4 pb-6 rounded-b-3xl shadow-lg border-b border-garra-border/30 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10 mb-2">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="text-white" />
          </button>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${priorityColors[os.priority]}`}>
            Prioridade {os.priority === OSPriority.HIGH ? 'Alta' : os.priority === OSPriority.MEDIUM ? 'Média' : 'Baixa'}
          </div>
        </div>
        <h1 className="text-xl font-bold text-white relative z-10 leading-tight px-2">{os.schoolName}</h1>
        <div className="flex items-center gap-2 text-garra-text-muted text-sm mt-1 px-2 relative z-10">
            {statusIcons[os.status]}
            <span className="uppercase tracking-wide font-medium text-xs">Status: {os.status === OSStatus.PENDING ? 'Pendente' : os.status === OSStatus.IN_PROGRESS ? 'Em Andamento' : 'Concluída'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        
        {/* CARD PRINCIPAL */}
        <div className="bg-garra-bg-dark p-5 rounded-2xl border border-garra-border/50 shadow-sm relative group">
            {!isEditing && os.status === OSStatus.COMPLETED && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditing(true)} className="p-2 bg-garra-bg hover:bg-garra-primary/20 rounded-full text-garra-text-muted hover:text-white transition-colors"><Edit size={16}/></button>
                    <button onClick={handleDeleteThisCard} className="p-2 bg-garra-bg hover:bg-red-500/20 rounded-full text-garra-text-muted hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                </div>
            )}

            {isEditing ? (
              <div className="space-y-4">
                  <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="w-full bg-garra-bg border border-garra-border rounded-lg p-2 text-white" rows={3}/>
                  <input value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} className="w-full bg-garra-bg border border-garra-border rounded-lg p-2 text-white"/>
                  <div className="flex gap-2 justify-end mt-2">
                      <Button variant="secondary" className="h-10 px-4 text-xs" onClick={() => setIsEditing(false)}>Cancelar</Button>
                      <Button className="h-10 px-4 text-xs" onClick={handleSaveEdit}>Salvar</Button>
                  </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-4">
                    <div className="bg-garra-primary/10 p-2 rounded-xl">
                        <AlertTriangle className="text-garra-primary" size={24} />
                    </div>
                    <div>
                    <h2 className="text-lg font-bold text-white leading-tight">{os.serviceName}</h2>
                    <p className="text-garra-text-muted text-sm mt-2 leading-relaxed border-l-2 border-garra-border/50 pl-3">
                        {os.description}
                    </p>
                    </div>
                </div>

                <button 
                  onClick={() => setIsMapOpen(true)}
                  className="flex items-center gap-2 text-garra-text-muted text-sm bg-garra-bg p-3 rounded-xl w-full text-left hover:bg-gray-800 transition-colors group"
                >
                    <MapPin className="w-4 h-4 text-garra-primary shrink-0" />
                    <span className="truncate flex-1">{os.address}</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400"/>
                </button>
                
                <div className="mt-4 flex items-center gap-3 text-garra-text-muted bg-garra-bg p-3 rounded-xl">
                    <Phone className="w-4 h-4 text-garra-primary" />
                    <span className="font-medium text-xs">{os.contact}</span>
                </div>
              </>
            )}
        </div>

        {/* --- BOTÃO BIBLIOTECA VISUAL --- */}
        <div className="space-y-2">
            <button 
                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                className="w-full bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between text-white hover:bg-blue-900/40 transition-all shadow-lg"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                        <BookOpen size={20} className="text-blue-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-sm">Biblioteca Visual</h3>
                        <p className="text-blue-200/50 text-[10px] uppercase tracking-wider">
                           Histórico & Comparação
                        </p>
                    </div>
                </div>
                {isLibraryOpen ? <ChevronUp size={20} className="text-blue-400"/> : <ChevronDown size={20} className="text-blue-400"/>}
            </button>

            {isLibraryOpen && (
                <div className="bg-garra-bg-dark border border-garra-border/50 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {/* ABAS */}
                    <div className="flex border-b border-garra-border/30">
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-garra-primary/10 text-garra-primary border-b-2 border-garra-primary' : 'text-garra-text-muted hover:bg-white/5'}`}
                        >
                            <FileText size={14} /> Linha do Tempo
                        </button>
                        <button 
                            onClick={() => setActiveTab('similar')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 ${activeTab === 'similar' ? 'bg-garra-primary/10 text-garra-primary border-b-2 border-garra-primary' : 'text-garra-text-muted hover:bg-white/5'}`}
                        >
                            <Layers size={14} /> Casos Similares
                        </button>
                    </div>

                    <div className="p-4">
                        {/* ABA: LINHA DO TEMPO */}
                        {activeTab === 'history' && (
                            <div className="space-y-6">
                                
                                {/* ==== SEÇÃO 1: PASSADO (JOÃO) ==== */}
                                {os.lastVisitPhotoUrl && (
                                    <div className="bg-gray-800/40 border border-gray-600/30 rounded-xl p-3 relative">
                                        <div className="absolute top-0 right-0 bg-gray-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                            ANTERIOR (15/08)
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="bg-gray-700 p-1.5 rounded-full">
                                                <History size={14} className="text-gray-400"/>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-300 text-xs font-bold uppercase">Téc. {os.lastVisitTechnician}</h4>
                                                <p className="text-gray-500 text-[10px]">Manutenção Anterior</p>
                                            </div>
                                        </div>

                                        {/* FOTOS DO JOÃO */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="rounded-lg overflow-hidden border border-gray-600/30">
                                                <img 
                                                    src={os.lastVisitPhotoUrl} 
                                                    alt="Foto 1" 
                                                    className="w-full h-24 object-contain bg-black/30"
                                                    onError={handleImageError}
                                                />
                                                <div className="bg-red-500/20 text-red-300 text-[9px] text-center py-1 font-bold">QUEBRADA (a.jpg)</div>
                                            </div>
                                            
                                            <div className="rounded-lg overflow-hidden border border-gray-600/30">
                                                {os.lastVisitSecondPhotoUrl ? (
                                                    <img 
                                                        src={os.lastVisitSecondPhotoUrl} 
                                                        alt="Foto 2" 
                                                        className="w-full h-24 object-contain bg-black/30"
                                                        onError={handleImageError}
                                                    />
                                                ) : (
                                                    <div className="w-full h-24 bg-black/20 flex items-center justify-center text-[10px] text-gray-500">Sem Foto 2</div>
                                                )}
                                                <div className="bg-green-500/20 text-green-300 text-[9px] text-center py-1 font-bold">CONSERTADA (b.jpg)</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ==== SEÇÃO 2: PRESENTE (ROBERTO) ==== */}
                                {os.status === OSStatus.COMPLETED ? (
                                    <div className="bg-green-900/10 border border-green-500/30 rounded-xl p-3 relative animate-in slide-in-from-bottom-2">
                                        <div className="absolute top-0 right-0 bg-green-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                            HOJE (FINALIZADO)
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="bg-green-900 p-1.5 rounded-full">
                                                <CheckCircle2 size={14} className="text-green-400"/>
                                            </div>
                                            <div>
                                                <h4 className="text-green-400 text-xs font-bold uppercase">Téc. {os.technicianName || "Roberto Almeida"}</h4>
                                                <p className="text-green-200/50 text-[10px]">Solução: {os.solutionApplied}</p>
                                            </div>
                                        </div>

                                        {os.photos && os.photos.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {os.photos.map((p, i) => (
                                                    <div key={i} className="rounded-lg overflow-hidden border border-green-500/20 shadow-lg">
                                                        <img src={p.url} className="w-full h-24 object-contain bg-black/30" alt={`Execução ${i+1}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic text-center py-2">Sem fotos registradas hoje.</p>
                                        )}

                                        {os.partsUsed && (
                                            <div className="mt-3 pt-3 border-t border-green-500/10">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Peças:</p>
                                                <p className="text-xs text-gray-300">{os.partsUsed}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-500">O serviço atual aparecerá aqui após a finalização.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'similar' && (
                             <div className="space-y-3">
                                {MOCK_SIMILAR_CASES.map((caso) => (
                                <div key={caso.id} className="bg-black/20 p-3 rounded-lg border border-white/5">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-white font-bold text-xs">{caso.school}</h4>
                                    </div>
                                    <p className="text-red-300 text-[10px] mb-2 font-medium">Prob: {caso.problem}</p>
                                    <div className="bg-garra-bg p-2 rounded border border-white/5">
                                        <p className="text-gray-300 text-[10px]"><span className="text-garra-primary font-bold">Solução:</span> {caso.solution}</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

      </div>

      {os.status === OSStatus.PENDING && (
        <div className="p-4 bg-garra-bg-dark border-t border-garra-border/30 z-20">
          <Button onClick={() => onStart(os.serviceName)} className="w-full py-4 text-lg shadow-xl shadow-garra-primary/20">
            INICIAR SERVIÇO
          </Button>
        </div>
       )}

       {/* --- MODAL DO MAPA --- */}
       {isMapOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-garra-bg w-full max-w-2xl h-[80vh] rounded-2xl border border-gray-600 shadow-2xl overflow-hidden relative flex flex-col">
            
            <div className="flex justify-between items-center p-4 bg-garra-card border-b border-gray-700">
               <div className="flex items-center gap-2 text-white font-bold">
                 <MapPin className="text-garra-accent" />
                 Localização da Escola
               </div>
               <button onClick={() => setIsMapOpen(false)} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors">
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
                 // CORREÇÃO AQUI TAMBÉM:
                 src={`https://maps.google.com/maps?q=${encodeURIComponent(os.address)}&output=embed`}
                 title="Mapa"
               ></iframe>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                  <div className="bg-white/80 px-4 py-2 rounded-full text-xs font-bold shadow text-black">Carregando mapa...</div>
               </div>
            </div>

            <div className="p-4 bg-garra-card border-t border-gray-700 text-center">
               <p className="text-gray-400 text-xs mb-2">{os.address}</p>
               <a 
                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(os.address)}`} 
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
    </div>
  );
};