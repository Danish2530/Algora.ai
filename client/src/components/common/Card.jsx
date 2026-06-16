import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = true,
  glow = false,
  title,
  headerActions,
  footer,
  onClick,
}) => {
  const isClickable = typeof onClick === 'function';
  const glowStyle = 'shadow-[0_0_25px_rgba(59,130,246,0.15)] border-brand-primary/30';
  
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl overflow-hidden border border-white/5 p-6 text-left transition-all duration-300
        ${hoverable ? 'glass-panel-hover' : ''}
        ${glow ? glowStyle : ''}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}`}
    >
      {/* Card Header */}
      {(title || headerActions) && (
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          {title && (
            <h3 className="text-lg font-bold text-white tracking-wide">
              {title}
            </h3>
          )}
          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="text-brand-text-inactive leading-relaxed text-sm">
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between text-xs text-brand-muted">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
