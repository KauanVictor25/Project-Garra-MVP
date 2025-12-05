import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação Simples (Login Fictício)
    // Você pode mudar essa senha aqui se quiser
    if (email === 'tech@garra.gov.br' && password === '123456') {
      setError('');
      onLogin();
    } else {
      setError('Credenciais inválidas. Tente tech@garra.gov.br / 123456');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-garra-bg">
      <div className="w-full max-w-sm bg-garra-card p-8 rounded-lg shadow-2xl border border-gray-700">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-garra-accent mb-2 tracking-tighter">GARRA</h1>
          <p className="text-gray-400 text-sm">Gestão de Manutenção Escolar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo de Email */}
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Email Corporativo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-garra-accent focus:ring-1 focus:ring-garra-accent transition-colors"
                placeholder="tech@garra.gov.br"
                required
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-garra-accent focus:ring-1 focus:ring-garra-accent transition-colors"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Botão de Entrar */}
          <button
            type="submit"
            className="w-full bg-garra-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition duration-200 shadow-lg transform active:scale-95"
          >
            ACESSAR SISTEMA
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">Versão 1.0.0 • Governo do Estado</p>
        </div>
      </div>
    </div>
  );
};