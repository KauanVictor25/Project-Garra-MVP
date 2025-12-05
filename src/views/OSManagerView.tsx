import React from 'react';
import { ServiceOrder } from '../types';

interface Props {
  orders: ServiceOrder[];
  onBack: () => void;
  onCreate: (os: ServiceOrder) => void;
  onUpdate: (os: ServiceOrder) => void;
  onDelete: (id: string) => void;
}

export const OSManagerView = ({ onBack }: Props) => (
  <div>
    <button onClick={onBack} className="mb-4 text-gray-400">← Voltar</button>
    <h1 className="text-xl font-bold">Gerenciador de OS</h1>
    <p className="text-gray-500 mt-4">Funcionalidade simplificada para demonstração.</p>
  </div>
);