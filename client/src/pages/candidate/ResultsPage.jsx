import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  TrendingUp, 
  MessageSquare,
  Bot
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ScoreBadge from '../../components/common/ScoreBadge';

const ResultsPage = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await interviewService.getSessionResults(sessionId);
        setSession(res);
      } catch (err) {
        console.error('Failed to retrieve session results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg text-white">
        <Loader size="large" label="Retrieving grading aggregates..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Results Sheet Not Found</h2>
        <p className="text-xs text-brand-text-inactive">
          We could not load the evaluation sheet for this session.
        </p>
        <Link to="/candidate/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 flex-grow w-full text-left">
      
      {/* Go Back button */}
      <div>
        <Link 
          to="/candidate/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-text-inactive hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Interview Diagnostic Sheet
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Assessment Results
          </h1>
          <p className="text-xs text-brand-text-inactive">
            Title: <span className="text-white font-bold">{session.title}</span> &bull; Taken {formatDate(session.date)}
          </p>
        </div>

        {/* Global score indicator */}
        <ScoreBadge score={session.score} size="lg" />
      </div>

      {/* Strengths & Improvements split grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <Card 
          title="Key Technical Strengths" 
          hoverable={false}
          headerActions={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          className="border-emerald-500/10"
        >
          <ul className="space-y-3.5 text-xs">
            {session.strengths?.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <span>{str}</span>
              </li>
            )) || <li>No analysis generated</li>}
          </ul>
        </Card>

        {/* Improvements Card */}
        <Card 
          title="Areas for Improvement" 
          hoverable={false}
          headerActions={<TrendingUp className="w-5 h-5 text-brand-secondary" />}
          className="border-brand-secondary/10"
        >
          <ul className="space-y-3.5 text-xs">
            {session.improvements?.map((imp, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 flex-shrink-0" />
                <span>{imp}</span>
              </li>
            )) || <li>No analysis generated</li>}
          </ul>
        </Card>

      </div>

      {/* Per-Question Breakdown header */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          Per-Question Transcript & AI Feedback
        </h2>

        <div className="space-y-6">
          {session.answers.map((ans, idx) => (
            <div 
              key={idx} 
              className="glass-panel border border-white/5 rounded-2xl p-6 space-y-5 relative overflow-hidden"
            >
              {/* Question metadata row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-brand-primary" />
                  Question {idx + 1} Transcript
                </span>
                
                {/* Specific answer score badge */}
                <ScoreBadge score={ans.score} size="sm" />
              </div>

              {/* Question text */}
              <h3 className="text-sm font-bold text-white leading-relaxed">
                {ans.question}
              </h3>

              {/* Submitted answer text */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                  Your Answer Submission
                </span>
                <div className="bg-brand-bg/50 border border-white/5 p-4 rounded-xl text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {ans.answer || <span className="italic text-brand-muted">No response submitted for this question.</span>}
                </div>
              </div>

              {/* AI evaluation block */}
              <div className="bg-brand-primary/5 border border-brand-primary/15 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wide">
                  <Bot className="w-4 h-4 text-brand-primary" />
                  AI Evaluation Feedback
                </div>
                <p className="text-xs text-brand-text-inactive leading-relaxed">
                  {ans.feedback}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ResultsPage;
