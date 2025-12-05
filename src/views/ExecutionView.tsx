import React, { useState, ChangeEvent } from 'react';
import { ServiceOrder, OSPhoto } from '../types';
import { ArrowLeft, Camera, XCircle, CheckCircle, UploadCloud, Wrench, Package } from 'lucide-react';

interface Props {
  os: ServiceOrder;
  onBack: () => void;
  onFinish: (data: { solution: string; parts: string; photos: OSPhoto[] }) => void;
}

export const ExecutionView = ({ os, onBack, onFinish }: Props) => {
  // Estados para guardar os dados do serviço
  const [solution, setSolution] = useState('');
  const [parts, setParts] = useState('');
  // Estado principal que guarda todas as fotos (antes e depois)
  const [photos, setPhotos] = useState<OSPhoto[]>([]);

  // Função mágica que lida com o arquivo selecionado no computador/celular
  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>, type: 'BEFORE' | 'AFTER') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Cria uma URL temporária para mostrar a imagem no navegador instantaneamente
    const tempUrl = URL.createObjectURL(file);
    const timestamp = new Date().toLocaleString('pt-BR');

    const newPhoto: OSPhoto = {
      url: tempUrl,
      type: type,
      timestamp: timestamp
    };

    // Adiciona a nova foto à lista existente
    setPhotos(prev => [...prev, newPhoto]);
  };

  // Função para remover uma foto da lista se o técnico errar
  const handleRemovePhoto = (photoUrlToRemove: string) => {
    setPhotos(prev => prev.filter(p => p.url !== photoUrlToRemove));
    // Importante: liberar a memória da URL temporária
    URL.revokeObjectURL(photoUrlToRemove);
  };

  const handleSubmit = () => {
    // Validação simples: não deixa finalizar sem solução
    if (!solution.trim()) {
      alert("Por favor, descreva a solução aplicada.");
      return;
    }
    onFinish({ solution, parts, photos });
  };

  // Filtra as fotos para mostrar nas seções corretas
  const beforePhotos = photos.filter(p => p.type === 'BEFORE');
  const afterPhotos = photos.filter(p => p.type === 'AFTER');

  // Componente visual para o botão de upload (para não repetir código)
  const UploadButton = ({ type, label }: { type: 'BEFORE' | 'AFTER', label: string }) => (
    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-garra-accent hover:bg-garra-accent/10 transition-all group">
      <div className="bg-gray-800 p-3 rounded-full mb-2 group-hover:bg-garra-accent group-hover:text-white transition-colors">
        <Camera size={24} className="text-garra-accent group-hover:text-white" />
      </div>
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      {/* O input real fica escondido, mas é ele que abre a janela de arquivos */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => handlePhotoUpload(e, type)}
      />
    </label>
  );

  // Componente visual para a miniatura da foto
  const PhotoPreview = ({ photo }: { photo: OSPhoto }) => (
    <div className="relative group rounded-xl overflow-hidden shadow-lg aspect-square border border-gray-700">
      <img src={photo.url} alt="Evidência" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
        <button 
          onClick={() => handleRemovePhoto(photo.url)}
          className="text-red-400 hover:text-red-500 bg-black/50 rounded-full p-1"
        >
          <XCircle size={24} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-[10px] text-gray-300 text-center truncate">
        {photo.timestamp}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-garra-bg overflow-y-auto pb-24">
      
      {/* Barra Superior */}
      <div className="bg-garra-card p-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-700 shadow-md">
        <button onClick={onBack} className="text-gray-300 hover:text-white"><ArrowLeft /></button>
        <div>
          <h2 className="text-lg font-bold">Execução do Serviço</h2>
          <p className="text-xs text-garra-accent">{os.serviceName}</p>
        </div>
      </div>

      <div className="p-5 space-y-8">
        
        {/* --- SEÇÃO 1: FOTOS DO ANTES --- */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UploadCloud size={18} className="text-red-400" />
            Registro Inicial (Antes)
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Botão de Upload */}
            <UploadButton type="BEFORE" label="Adicionar foto do ANTES" />
            
            {/* Previews das fotos de ANTES */}
            {beforePhotos.map((photo, index) => (
              <PhotoPreview key={index} photo={photo} />
            ))}
          </div>
        </div>

        <hr className="border-gray-800" />

        {/* --- SEÇÃO 2: FOTOS DO DEPOIS --- */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            Registro Final (Depois)
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Botão de Upload */}
            <UploadButton type="AFTER" label="Adicionar foto do DEPOIS" />

             {/* Previews das fotos de DEPOIS */}
             {afterPhotos.map((photo, index) => (
              <PhotoPreview key={index} photo={photo} />
            ))}
          </div>
        </div>

        <hr className="border-gray-800" />

        {/* --- SEÇÃO 3: RELATÓRIO TÉCNICO --- */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wrench size={18} />
            Relatório Técnico
          </h3>

          <div>
            <label className="text-sm text-gray-400 font-bold mb-2 block">Solução Aplicada *</label>
            <textarea 
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Descreva o que foi feito..."
              className="w-full bg-gray-900 text-white p-3 rounded-xl border border-gray-700 focus:border-garra-accent outline-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 font-bold mb-2 block">
              <Package size={16} /> Peças Utilizadas (Opcional)
            </label>
            <input 
              type="text"
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              placeholder="Ex: 2m de cano PVC, 1 joelho..."
              className="w-full bg-gray-900 text-white p-3 rounded-xl border border-gray-700 focus:border-garra-accent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Botão Fixo de Finalizar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-garra-bg border-t border-gray-800 max-w-md mx-auto">
        <button 
          onClick={handleSubmit} 
          className={`w-full font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 text-lg transition-all ${
            solution.trim() 
              ? 'bg-garra-success hover:bg-green-600 text-white active:scale-95' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!solution.trim()}
        >
          <CheckCircle size={20} />
          FINALIZAR EXECUÇÃO
        </button>
      </div>
    </div>
  );
};