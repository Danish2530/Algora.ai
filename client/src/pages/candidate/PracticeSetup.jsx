import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { Play, ArrowLeft, Cpu, Terminal, Compass, Briefcase } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const PracticeSetup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Frontend Developer');
  const [topic, setTopic] = useState('DSA');
  const [loading, setLoading] = useState(false);

  const rolesList = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Data Analyst',
    'DevOps Engineer',
    'Product Manager'
  ];

  const topicsList = [
    { id: 'DSA', label: 'Algorithms & DSA', desc: 'Big-O scales, hash structures, binary trees, recursion limits.', icon: Terminal },
    { id: 'System Design', label: 'System Design', desc: 'Load balancing, server caching, database replicas, messaging queues.', icon: Cpu },
    { id: 'Behavioral', label: 'Behavioral Star', desc: 'Conflict resolution, milestone slippages, peers peer arguments.', icon: Compass },
    { id: 'HR', label: 'HR Culture Fit', desc: 'Work preferences, organizational alignments, personal values.', icon: Briefcase }
  ];

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await interviewService.startPracticeSession(role, topic);
      navigate(`/interview/${session.id}`);
    } catch (err) {
      console.error('Failed to create practice session', err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 flex-grow w-full text-left">
      
      {/* Back button link */}
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
          Configure Practice Interview
        </h1>
        <p className="text-xs text-brand-text-inactive">
          Fine-tune your sandbox environment parameters to launch the assessment simulation.
        </p>
      </div>

      <form onSubmit={handleStart}>
        <Card hoverable={false} className="space-y-6">
          
          {/* Target Role selection dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Target Role Profile
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
              disabled={loading}
            >
              {rolesList.map((r) => (
                <option key={r} value={r} className="bg-brand-surface text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Focus selections */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Assessment Focus Area
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topicsList.map((t) => {
                const IconComp = t.icon;
                const isSelected = topic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopic(t.id)}
                    disabled={loading}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer
                      ${isSelected 
                        ? 'border-brand-primary bg-brand-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                        : 'border-white/5 bg-brand-surface/40 text-brand-text-inactive hover:border-white/10 hover:text-white'
                      }`}
                  >
                    <div className={`p-2 rounded-lg border flex-shrink-0 mt-0.5
                      ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'bg-brand-bg border-white/5 text-brand-muted'}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">{t.label}</span>
                      <p className="text-[10px] text-brand-text-inactive leading-relaxed">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="border-t border-white/5 pt-6 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Format</span>
              <span className="text-xs font-semibold text-white">3 AI questions &bull; Dynamic Timer</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Play}
            >
              Start Simulation
            </Button>
          </div>

        </Card>
      </form>

    </div>
  );
};

export default PracticeSetup;
