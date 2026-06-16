import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { templateService } from '../../services/templateService';
import { interviewService } from '../../services/interviewService';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Sparkles, 
  HelpCircle,
  FileText,
  X,
  Bot
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ScoreBadge from '../../components/common/ScoreBadge';

const TemplateCandidates = () => {
  const { templateId } = useParams();
  
  const [template, setTemplate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track selected candidate for detailed transcript modal/drawer
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const tpl = await templateService.getTemplateById(templateId);
        if (tpl) {
          setTemplate(tpl);
          const sessions = await interviewService.getTemplateSessions(templateId);
          setCandidates(sessions);
        }
      } catch (err) {
        console.error('Failed to load template candidate data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplateData();
  }, [templateId]);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg text-white">
        <Loader size="large" label="Retrieving assessment details..." />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Template Not Found</h2>
        <p className="text-xs text-brand-text-inactive">
          The requested recruitment assessment template does not exist.
        </p>
        <Link to="/recruiter/dashboard">
          <Button variant="primary">Return to Console</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-grow w-full text-left">
      
      {/* Back button */}
      <div>
        <Link 
          to="/recruiter/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-text-inactive hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Recruiter Console
        </Link>
      </div>

      {/* Header assessment info */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full blur-2xl -z-10" />
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Template Code: {template.code}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {template.title}
          </h1>
          <p className="text-xs text-brand-text-inactive">
            Target Role: <span className="text-white font-bold">{template.role}</span> &bull; {template.questions.length} Questions &bull; {template.timeLimit}s timer
          </p>
        </div>
      </div>

      {/* Dual Column Layout: Left candidate list, Right Active candidate detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Candidates attempts table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider block">
            Applicant Submissions ({candidates.length})
          </h2>

          {candidates.length === 0 ? (
            <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center space-y-3">
              <User className="w-8 h-8 text-brand-muted mx-auto" />
              <h3 className="text-sm font-bold text-white">No attempts submitted yet</h3>
              <p className="text-xs text-brand-text-inactive max-w-xs mx-auto">
                Candidates who join using this assessment's invite code will appear here upon finishing.
              </p>
            </div>
          ) : (
            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-inactive">
                  <thead className="text-xs font-bold uppercase tracking-wider text-white bg-brand-surface/60 border-b border-white/5">
                    <tr>
                      <th scope="col" className="px-6 py-4">Candidate Name</th>
                      <th scope="col" className="px-6 py-4">Completed On</th>
                      <th scope="col" className="px-6 py-4">Score</th>
                      <th scope="col" className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {candidates.map((cand) => (
                      <tr 
                        key={cand.id} 
                        className={`hover:bg-white/2 transition-colors cursor-pointer 
                          ${activeSession?.id === cand.id ? 'bg-brand-primary/5 hover:bg-brand-primary/5' : ''}`}
                        onClick={() => setActiveSession(cand)}
                      >
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                          <User className="w-4 h-4 text-brand-secondary" />
                          {cand.candidateName}
                        </td>
                        <td className="px-6 py-4 text-xs">{formatDate(cand.date)}</td>
                        <td className="px-6 py-4">
                          <ScoreBadge score={cand.score} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-brand-primary hover:bg-brand-primary/10"
                            onClick={() => setActiveSession(cand)}
                          >
                            View transcript
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Candidate Detailed Transcript panel */}
        <div className="lg:col-span-1">
          {activeSession ? (
            <Card hoverable={false} className="flex flex-col max-h-[600px] p-5 relative">
              
              {/* Close button */}
              <button
                onClick={() => setActiveSession(null)}
                className="absolute top-4 right-4 p-1.5 bg-brand-surface border border-white/5 rounded-lg text-brand-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Title & Metadata */}
              <div className="border-b border-white/5 pb-4 mb-4 text-left">
                <span className="text-[10px] uppercase font-bold text-brand-secondary tracking-widest block mb-1">
                  Applicant Profile
                </span>
                <h3 className="text-base font-bold text-white truncate pr-6">
                  {activeSession.candidateName}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-brand-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-primary" />
                    {new Date(activeSession.date).toLocaleDateString()}
                  </span>
                  <span>&bull;</span>
                  <span className="font-bold text-white">Score: {activeSession.score}%</span>
                </div>
              </div>

              {/* Scrolling answers list */}
              <div className="flex-grow overflow-y-auto space-y-4 pr-1 text-left">
                {activeSession.answers.map((ans, idx) => (
                  <div key={idx} className="p-3 bg-brand-surface/50 border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-brand-primary" />
                        Question {idx + 1}
                      </span>
                      <span className="text-[10px] font-black text-brand-secondary">{ans.score}%</span>
                    </div>

                    <h4 className="text-[10px] font-bold text-slate-200 leading-normal">
                      {ans.question}
                    </h4>

                    {/* Answer snippet */}
                    <div className="bg-brand-bg/65 p-2.5 rounded-lg border border-white/5 text-[10px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
                      {ans.answer || <span className="italic text-brand-muted">No response submitted.</span>}
                    </div>

                    {/* Evaluation review */}
                    <div className="bg-brand-primary/5 border border-brand-primary/10 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-brand-primary uppercase tracking-wider">
                        <Bot className="w-3.5 h-3.5" />
                        AI Diagnostic
                      </div>
                      <p className="text-[9px] text-brand-text-inactive leading-relaxed">
                        {ans.feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </Card>
          ) : (
            <div className="glass-panel border border-white/5 rounded-2xl p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-brand-muted mx-auto" />
              <h3 className="text-sm font-bold text-white">No transcript selected</h3>
              <p className="text-xs text-brand-text-inactive leading-relaxed">
                Click "View transcript" on any candidate from the list to display their detailed solutions and AI feedback comments here.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default TemplateCandidates;
