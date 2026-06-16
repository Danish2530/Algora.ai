import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ duration = 120, onTimeout, resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Sync timeLeft when resetKey or duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeout) {
        onTimeout();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeout]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCritical = timeLeft <= 15;
  const progressPercent = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col w-full max-w-[150px]">
      <div className={`flex items-center justify-between text-sm font-bold uppercase tracking-wider mb-1.5 transition-all duration-300
        ${isCritical ? 'text-red-400 animate-pulse scale-102' : 'text-brand-text-inactive'}`}
      >
        <span className="flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${isCritical ? 'text-red-400' : 'text-brand-primary'}`} />
          Time Left
        </span>
        <span className="font-mono text-base">{formatTime(timeLeft)}</span>
      </div>
      
      {/* Horizontal progress slider */}
      <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full
            ${isCritical 
              ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
              : 'bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_10px_rgba(59,130,246,0.3)]'
            }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
