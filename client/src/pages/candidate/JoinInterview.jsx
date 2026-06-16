import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { KeyRound, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const JoinInterview = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formattedCode = code.toUpperCase().trim();
    if (!formattedCode) {
      setError('Please input a valid assessment code');
      return;
    }

    setLoading(true);
    try {
      const isValid = await interviewService.validateJoinCode(formattedCode);
      if (!isValid) {
        throw new Error('Interview room code is invalid. Check for typos.');
      }
      
      // Setup template-based interview session
      const session = await interviewService.startTemplateSession(formattedCode);
      navigate(`/interview/${session.id}`);
    } catch (err) {
      setError(err.message || 'Verification failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 flex-grow w-full text-left">
      
      {/* Back button */}
      <div>
        <Link 
          to="/candidate/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-text-inactive hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white font-display">
          Enter Invitation Code
        </h1>
        <p className="text-xs text-brand-text-inactive">
          Type the 6-character code provided in your email to join the recruiter assessment.
        </p>
      </div>

      <Card hoverable={false} className="shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
        {error && (
          <div className="mb-4 flex items-start gap-2 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Recruitment Code Key
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ALGO-FE99"
                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none tracking-widest font-mono uppercase"
                disabled={loading}
                maxLength={12}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            loading={loading}
            icon={KeyRound}
          >
            Join Room
          </Button>
        </form>

        {/* Informative advice */}
        <div className="mt-6 border-t border-white/5 pt-4 flex gap-2 text-[10px] text-brand-muted leading-relaxed">
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-brand-primary" />
          <div>
            <span className="font-semibold text-white">Hint for testers:</span> Enter <span className="font-mono text-white">ALGO-FE99</span> (Senior Frontend) or <span className="font-mono text-white">ALGO-BE40</span> (Backend Developer) to run seeded templates immediately.
          </div>
        </div>

      </Card>

    </div>
  );
};

export default JoinInterview;
