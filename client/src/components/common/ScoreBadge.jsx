import React from 'react';

const ScoreBadge = ({ score, size = 'md' }) => {
  const finalScore = Math.max(0, Math.min(100, score));
  
  // Set colors based on performance ranges
  const getColorScheme = (val) => {
    if (val >= 85) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        ring: 'stroke-emerald-400',
        track: 'stroke-emerald-950',
        label: 'Excellent'
      };
    }
    if (val >= 70) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
        ring: 'stroke-amber-400',
        track: 'stroke-amber-950',
        label: 'Competent'
      };
    }
    return {
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
      ring: 'stroke-red-400',
      track: 'stroke-red-950',
      label: 'Needs Work'
    };
  };

  const scheme = getColorScheme(finalScore);

  // SVG Ring values
  const radius = 16;
  const circumference = 2 * Math.PI * radius; // ~100.53
  const strokeDashoffset = circumference - (circumference * finalScore) / 100;

  const sizeClasses = {
    sm: 'p-1.5 text-xs px-2.5 gap-1.5',
    md: 'p-2.5 text-sm px-4 gap-2.5',
    lg: 'p-4 text-lg px-6 gap-4'
  };

  return (
    <div className={`inline-flex items-center rounded-2xl border ${scheme.bg} ${scheme.border} ${sizeClasses[size]}`}>
      {/* SVG Radial Progress Ring */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg 
          className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'} -rotate-90`}
          viewBox="0 0 36 36"
        >
          {/* Background circle */}
          <circle
            className={scheme.track}
            cx="18"
            cy="18"
            r={radius}
            strokeWidth="3.5"
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${scheme.ring}`}
            cx="18"
            cy="18"
            r={radius}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={`absolute text-[10px] font-bold ${scheme.text} 
          ${size === 'lg' ? 'text-xs' : size === 'sm' ? 'text-[8px]' : ''}`}>
          {finalScore}
        </span>
      </div>

      <div className="flex flex-col text-left">
        <span className={`font-bold tracking-wide text-white leading-none ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {finalScore}%
        </span>
        <span className={`text-[10px] font-medium uppercase tracking-wider ${scheme.text}`}>
          {scheme.label}
        </span>
      </div>
    </div>
  );
};

export default ScoreBadge;
