import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { interviewService } from '../../services/interviewService';
import { ArrowLeft, Search, Filter, ClipboardList, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ScoreBadge from '../../components/common/ScoreBadge';

const ResultsHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user) {
          const res = await interviewService.getCandidateSessions(user.id);
          setSessions(res);
        }
      } catch (err) {
        console.error('Failed to load session history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  // Extract roles for filter dropdown
  const uniqueRoles = ['All', ...new Set(sessions.map(s => s.role))];

  // Filtering filter logic
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'All' || s.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-grow w-full text-left">
      
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

      {/* Header tags */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Session Diagnostic History
        </h1>
        <p className="text-xs text-brand-text-inactive">
          Browse, inspect, and filter through all your completed practice sessions and recruiter exams.
        </p>
      </div>

      {/* Filter and search bars */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        
        {/* Search */}
        <div className="relative flex items-center w-full sm:flex-grow">
          <Search className="absolute left-3 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or target role..."
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none placeholder-brand-muted"
            disabled={loading}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative flex items-center w-full sm:w-48">
          <Filter className="absolute left-3 w-4 h-4 text-brand-muted" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
            disabled={loading}
          >
            {uniqueRoles.map((r) => (
              <option key={r} value={r} className="bg-brand-surface text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Data display panel */}
      {loading ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 flex items-center justify-center">
          <Loader label="Opening transcripts log book..." />
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center space-y-4">
          <div className="inline-flex p-4 bg-brand-surface rounded-2xl border border-white/5 mb-2">
            <ClipboardList className="w-8 h-8 text-brand-muted" />
          </div>
          <h3 className="text-base font-bold text-white">No matching sessions</h3>
          <p className="text-xs text-brand-text-inactive max-w-sm mx-auto">
            Try adjusting your search criteria or topic dropdown filter.
          </p>
        </div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-brand-text-inactive">
              <thead className="text-xs font-bold uppercase tracking-wider text-white bg-brand-surface/60 border-b border-white/5">
                <tr>
                  <th scope="col" className="px-6 py-4">Assessment name</th>
                  <th scope="col" className="px-6 py-4">Role</th>
                  <th scope="col" className="px-6 py-4">Completed On</th>
                  <th scope="col" className="px-6 py-4">Score</th>
                  <th scope="col" className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{session.title}</div>
                      {session.templateId && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20 uppercase tracking-wide mt-1">
                          Recruiter Link
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">{session.role}</td>
                    <td className="px-6 py-4 text-xs">{formatDate(session.date)}</td>
                    <td className="px-6 py-4">
                      {session.status === 'Completed' ? (
                        <ScoreBadge score={session.score} size="sm" />
                      ) : (
                        <span className="text-xs font-medium text-brand-primary animate-pulse uppercase">
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
                        <Button variant="ghost" size="sm" className="text-brand-primary hover:bg-brand-primary/10">
                          {session.status === 'Completed' ? 'Inspect results' : 'Resume exam'}
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
  );
};

export default ResultsHistory;
