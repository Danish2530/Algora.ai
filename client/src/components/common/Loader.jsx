import React from 'react';

const Loader = ({ size = 'medium', label }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-20 h-20 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Ambient background glow */}
        <div 
          className={`absolute rounded-full bg-brand-primary/20 blur-xl animate-pulse
            ${size === 'small' ? 'w-8 h-8' : size === 'medium' ? 'w-16 h-16' : 'w-28 h-28'}`}
        />
        
        {/* Spinner Ring */}
        <div
          className={`animate-spin rounded-full border-brand-border border-t-brand-primary border-r-brand-secondary 
            ${sizeClasses[size]}`}
        />
      </div>
      
      {label && (
        <p className="text-sm font-medium text-brand-text-inactive tracking-wider animate-pulse text-center">
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;
