import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { interviewService } from '../../services/interviewService';
import { 
  PlayCircle, 
  KeyRound, 
  History, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ScoreBadge from '../../components/common/ScoreBadge';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user) {
          const res = await interviewService.getCandidateSessions(user.id);
          setSessions(res);
        }
      } catch (err) {
        console.error('Failed to load sessions history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  // Format date nicely
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow w-full text-left">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Candidate Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Developer'}
          </h1>
          <p className="text-xs text-brand-text-inactive">
            Target Role: <span className="text-white font-bold">{user?.title || 'Software Engineer'}</span>
          </p>
        </div>
      </div>

      {/* Main Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Practice Interview Action */}
        <Card 
          title="Sandbox Practice Interview"
          className="flex flex-col h-full"
          headerActions={<PlayCircle className="w-6 h-6 text-brand-primary animate-pulse" />}
        >
          <div className="flex-grow space-y-4">
            <p className="text-xs leading-relaxed">
              Launch an adaptive, self-guided practice session. Choose your target engineering focus (DSA, System Design, or behavioral) to simulate real-world AI questions.
            </p>
            <div className="pt-2">
              <Link to="/candidate/practice">
                <Button variant="primary" icon={PlayCircle}>
                  Start Practice Setup
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Join Assessment Action */}
        <Card 
          title="Join Recruiter Assessment"
          className="flex flex-col h-full"
          headerActions={<KeyRound className="w-6 h-6 text-brand-secondary" />}
        >
          <div className="flex-grow space-y-4">
            <p className="text-xs leading-relaxed">
              Did a recruiter share an invite code with you? Enter the 6-character room code (e.g. ALGO-ABCD) to join and start their custom assessment.
            </p>
            <div className="pt-2">
              <Link to="/candidate/join">
                <Button variant="secondary" className="border-brand-secondary/50 text-white hover:bg-brand-secondary/10" icon={KeyRound}>
                  Join Interview Room
                </Button>
              </Link>
            </div>
          </div>
        </Card>

      </div>

      {/* Recent Sessions list table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-brand-primary" />
            Recent Interview Transcripts
          </h2>
          {sessions.length > 0 && (
            <Link to="/candidate/history" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
              View All History
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="glass-panel border border-white/5 rounded-2xl p-12 flex items-center justify-center">
            <Loader label="Retrieving test history..." />
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-panel border border-white/5 rounded-2xl p-12 text-center space-y-4">
            <div className="inline-flex p-4 bg-brand-surface rounded-2xl border border-white/5 mb-2">
              <ClipboardList className="w-8 h-8 text-brand-muted" />
            </div>
            <h3 className="text-base font-bold text-white">No interviews found</h3>
            <p className="text-xs text-brand-text-inactive max-w-sm mx-auto">
              You haven't attempted any sessions yet. Click the sandbox practice link above to kick off your first simulation.
            </p>
          </div>
        ) : (
          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-brand-text-inactive">
                <thead className="text-xs font-bold uppercase tracking-wider text-white bg-brand-surface/60 border-b border-white/5">
                  <tr>
                    <th scope="col" className="px-6 py-4">Assessment Name</th>
                    <th scope="col" className="px-6 py-4">Target Role</th>
                    <th scope="col" className="px-6 py-4">Date Completed</th>
                    <th scope="col" className="px-6 py-4">Score</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.slice(0, 5).map((session) => (
                    <tr key={session.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        {session.title}
                        {session.templateId && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20 uppercase tracking-wide">
                            Recruiter Exam
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{session.role}</td>
                      <td className="px-6 py-4">{formatDate(session.date)}</td>
                      <td className="px-6 py-4">
                        {session.status === 'Completed' ? (
                          <ScoreBadge score={session.score} size="sm" />
                        ) : (
                          <span className="text-xs font-medium text-brand-primary animate-pulse uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={session.status === 'Completed' 
                            ? `/candidate/results/${session.id}` 
                            : `/interview/${session.id}`}
                        >
                          <Button variant="ghost" size="sm" className="text-brand-primary font-bold hover:bg-brand-primary/10">
                            {session.status === 'Completed' ? 'Inspect Results' : 'Resume Test'}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CandidateDashboard;
