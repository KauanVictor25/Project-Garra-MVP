import React from 'react';
import { ServiceOrder } from '../types';

export const SuccessView = ({ onHome, os }: { onHome: () => void; os: ServiceOrder }) => (
  <div className="text-center h-full flex flex-col justify-center items-center">
    <h1 className="text-3xl font-bold text-garra-success mb-4">Sucesso!</h1>
    <p className="mb-8">OS {os.id} finalizada.</p>
    <button onClick={onHome} className="bg-gray-700 px-6 py-2 rounded">Voltar ao Início</button>
  </div>
);