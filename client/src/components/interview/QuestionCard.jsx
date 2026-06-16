import React from 'react';
import { HelpCircle, Star } from 'lucide-react';

const QuestionCard = ({
  questionText,
  currentIndex,
  totalQuestions,
  category = 'Interview Question',
  className = ''
}) => {
  return (
    <div className={`glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden text-left ${className}`}>
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-2xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4">
        {/* Step Indicator */}
        <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        
        {/* Category Label */}
        <span className="flex items-center gap-1.5 text-xs text-brand-text-inactive font-medium">
          <Star className="w-3.5 h-3.5 text-brand-secondary" />
          {category}
        </span>
      </div>

      {/* Main Question Display */}
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 bg-brand-surface rounded-xl border border-white/5 flex-shrink-0">
          <HelpCircle className="w-5 h-5 text-brand-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
            {questionText}
          </h2>
          <p className="text-xs text-brand-muted">
            Provide a complete explanation. Consider runtime constraints, architectural decisions, and edge scenarios where appropriate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
