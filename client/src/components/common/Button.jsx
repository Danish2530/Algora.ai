import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold tracking-wide rounded-xl transition-all duration-300 transform active:scale-97 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary/45';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.45)] hover:brightness-110 border border-brand-primary/30',
    secondary: 'border border-brand-border bg-brand-surface/40 text-brand-text-active hover:bg-brand-surface hover:border-brand-primary/50 hover:text-white',
    ghost: 'text-brand-text-inactive hover:text-white hover:bg-brand-surface/60',
    danger: 'bg-red-600/90 hover:bg-red-500 text-white shadow-[0_4px_15px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.4)] border border-red-500/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        <>
          {Icon && <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
