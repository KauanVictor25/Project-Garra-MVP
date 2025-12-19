import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  icon,
  disabled,
  ...props 
}) => {
  
  const baseStyles = "h-14 font-bold text-sm uppercase tracking-wider rounded transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
  
  const variants = {
    primary: "bg-garra-accent text-white hover:bg-orange-600 shadow-orange-900/20",
    secondary: "bg-garra-card text-white border border-gray-600 hover:bg-gray-600",
    danger: "bg-garra-danger text-white hover:bg-red-600",
    success: "bg-garra-success text-white hover:bg-green-600",
    warning: "bg-garra-warning text-gray-900 hover:bg-yellow-500",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};