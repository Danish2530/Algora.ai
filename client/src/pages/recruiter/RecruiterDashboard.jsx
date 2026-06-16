import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { templateService } from '../../services/templateService';
import { interviewService } from '../../services/interviewService';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Layers, 
  Users, 
  BarChart3, 
  ExternalLink,
  ClipboardList,
  Sparkles,
  Search,
  Code
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const tList = await templateService.getTemplates();
        const sList = await interviewService.getAllSessions();
        setTemplates(tList);
        setSessions(sList);
      } catch (err) {
        console.error('Failed to load recruiter data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute metrics based on templates and sessions
  const recruiterTemplates = templates; // Show all for mockup simplicity
  const totalTemplates = recruiterTemplates.length;
  
  // Completed candidates matching recruiter's template list
  const activeTemplateIds = recruiterTemplates.map(t => t.id);
  const matchedSessions = sessions.filter(s => activeTemplateIds.includes(s.templateId) && s.status === 'Completed');
  const totalCandidates = matchedSessions.length;

  const averageScore = totalCandidates > 0
    ? Math.round(matchedSessions.reduce((sum, s) => sum + s.score, 0) / totalCandidates)
    : 0;

  // Search filter
  const filteredTemplates = recruiterTemplates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow w-full text-left">
      
      {/* Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Recruiter Administrator Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Talent Hub &bull; {user?.company || 'Organization'}
          </h1>
          <p className="text-xs text-brand-text-inactive">
            Logged in as Lead: <span className="text-white font-bold">{user?.name}</span>
          </p>
        </div>

        <Link to="/recruiter/create-template">
          <Button variant="primary" icon={Plus}>
            Create Interview Template
          </Button>
        </Link>
      </div>

      {/* KPI Stats widgets grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel h-28 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <Card hoverable={false} className="flex items-center gap-4 py-6 border-white/5">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary border border-brand-primary/20">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Templates Designed</span>
              <span className="text-2xl font-black text-white">{totalTemplates}</span>
            </div>
          </Card>

          {/* Stat 2 */}
          <Card hoverable={false} className="flex items-center gap-4 py-6 border-white/5">
            <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary border border-brand-secondary/20">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Candidates Evaluated</span>
              <span className="text-2xl font-black text-white">{totalCandidates}</span>
            </div>
          </Card>

          {/* Stat 3 */}
          <Card hoverable={false} className="flex items-center gap-4 py-6 border-white/5">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Average Evaluation Score</span>
              <span className="text-2xl font-black text-white">{averageScore}%</span>
            </div>
          </Card>
        </div>
      )}

      {/* Templates listing panel */}
      <div className="space-y-4">
        
        {/* Controls and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-secondary" />
            Assessment Templates
          </h2>

          {/* Search bar */}
          <div className="relative flex items-center w-full sm:w-64">
            <Search className="absolute left-3 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or role..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs text-white focus:outline-none placeholder-brand-muted"
            />
          </div>
        </div>

        {loading ? (
          <div className="glass-panel border border-white/5 rounded-2xl p-12 flex items-center justify-center">
            <Loader label="Opening templates vault..." />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="glass-panel border border-white/5 rounded-2xl p-12 text-center space-y-4">
            <h3 className="text-base font-bold text-white">No templates found</h3>
            <p className="text-xs text-brand-text-inactive max-w-sm mx-auto">
              You haven't generated any recruitment assessments. Click create above to build your first template and invite applicants.
            </p>
            <Link to="/recruiter/create-template">
              <Button variant="primary" size="sm" icon={Plus}>Create Template</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <Card 
                key={tpl.id}
                title={tpl.title}
                headerActions={
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-md font-mono">
                    <Code className="w-3 h-3" />
                    {tpl.code}
                  </span>
                }
                footer={
                  <>
                    <span>Created: {formatDate(tpl.createdAt)}</span>
                    <span className="font-bold text-brand-secondary">
                      {tpl.questions.length} questions
                    </span>
                  </>
                }
                className="flex flex-col h-full"
              >
                <div className="flex-grow space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5 text-xs text-brand-text-inactive mt-2">
                    <p>Target Role: <strong className="text-white">{tpl.role}</strong></p>
                    <p>Time Limit: <strong className="text-white">{tpl.timeLimit}s per question</strong></p>
                    <p>Candidates Screened: <strong className="text-white">{tpl.candidateCount} attempts</strong></p>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <Link to={`/recruiter/template/${tpl.id}`} className="w-full">
                      <Button variant="secondary" size="sm" className="w-full justify-center" icon={ExternalLink}>
                        Inspect Candidate List
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default RecruiterDashboard;
