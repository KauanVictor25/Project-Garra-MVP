import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                {icon}
            </div>
        )}
        <input 
            className={`w-full h-12 ${icon ? 'pl-10' : 'px-4'} bg-garra-card text-white border-2 border-gray-700 rounded focus:outline-none focus:border-garra-accent focus:bg-gray-800 transition-colors text-sm font-bold placeholder-gray-600 ${className}`}
            {...props}
        />
      </div>
    </div>
  );
};