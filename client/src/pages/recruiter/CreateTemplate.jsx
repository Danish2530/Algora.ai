import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { templateService } from '../../services/templateService';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  PlusCircle, 
  Compass, 
  Database, 
  Search,
  Code
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CreateTemplate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [role, setRole] = useState('Frontend Developer');
  const [timeLimit, setTimeLimit] = useState(120);
  
  // Array of questions in the template
  const [questions, setQuestions] = useState(['']);
  
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('All');

  const questionBank = templateService.getQuestionBank();
  
  const rolesList = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Data Analyst',
    'DevOps Engineer',
    'Product Manager'
  ];

  const categories = ['All', 'DSA', 'System Design', 'Frontend', 'Backend', 'Behavioral'];

  // Handle adding custom empty question row
  const handleAddQuestionRow = () => {
    setQuestions([...questions, '']);
  };

  // Handle editing question string
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  // Handle removing question row
  const handleRemoveQuestionRow = (index) => {
    const updated = questions.filter((_, idx) => idx !== index);
    setQuestions(updated.length === 0 ? [''] : updated);
  };

  // Import question from bank
  const handleImportQuestion = (text) => {
    // If the only row is empty, replace it, otherwise append
    if (questions.length === 1 && questions[0] === '') {
      setQuestions([text]);
    } else {
      setQuestions([...questions, text]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanQuestions = questions.filter(q => q.trim().length > 0);
    if (cleanQuestions.length === 0) {
      alert('Please add at least one valid question.');
      setLoading(false);
      return;
    }

    try {
      const templateData = {
        title,
        role,
        questions: cleanQuestions,
        timeLimit: parseInt(timeLimit)
      };

      const result = await templateService.createTemplate(templateData);
      setSuccessData(result);
    } catch (err) {
      console.error('Failed to create template', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!successData) return;
    const shareableUrl = `${window.location.origin}/candidate/join?code=${successData.code}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Catalog search filtering
  const filteredCatalog = questionBank.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          q.category.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCategory = catalogFilter === 'All' || q.category === catalogFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-grow w-full text-left">
      
      {/* Back link */}
      <div>
        <Link 
          to="/recruiter/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-text-inactive hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Recruiter Console
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Create Assessment Template
        </h1>
        <p className="text-xs text-brand-text-inactive">
          Assemble technical questions, set timelines, and generate secure invite links for applicants.
        </p>
      </div>

      {successData ? (
        /* SUCCESS DIALOG PANEL */
        <div className="max-w-2xl mx-auto py-8">
          <Card hoverable={false} glow={true} className="border-brand-primary/30 p-8 text-center space-y-6">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
              <Check className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Assessment Created Successfully!</h2>
              <p className="text-xs text-brand-text-inactive max-w-md mx-auto">
                Share the code or invitation URL with candidates. They can join immediately and take the evaluation.
              </p>
            </div>

            {/* Generated Room Code Info block */}
            <div className="p-6 bg-brand-surface rounded-2xl border border-white/5 space-y-4 max-w-md mx-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Generated Room Code</span>
                <span className="text-3xl font-mono font-black text-white tracking-widest uppercase">{successData.code}</span>
              </div>

              {/* URL sharing */}
              <div className="flex items-center gap-2 border border-white/5 bg-brand-bg rounded-xl p-2 pl-3">
                <span className="text-xs text-brand-text-inactive truncate flex-grow text-left font-mono">
                  {`${window.location.origin}/candidate/join?code=${successData.code}`}
                </span>
                
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-brand-surface border border-white/5 rounded-lg text-brand-primary hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Link to="/recruiter/dashboard">
                <Button variant="secondary">Go to Console</Button>
              </Link>
              <Button variant="primary" onClick={() => setSuccessData(null)}>
                Create Another
              </Button>
            </div>

          </Card>
        </div>
      ) : (
        /* DUAL CONFIG WIZARD LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT WIZARD: MAIN CONFIG */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <Card hoverable={false} className="space-y-6">
              
              {/* Form title */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase tracking-wider block">
                  1. Basic Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mid-Level Node.js Architect"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Target Role Profile
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
                    disabled={loading}
                  >
                    {rolesList.map((r) => (
                      <option key={r} value={r} className="bg-brand-surface text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timer Limit */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Time Limit per Question
                  </label>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
                    disabled={loading}
                  >
                    <option value={60} className="bg-brand-surface">60 seconds (Quick Assessment)</option>
                    <option value={120} className="bg-brand-surface">120 seconds (Standard Assessment)</option>
                    <option value={180} className="bg-brand-surface">180 seconds (Detailed Discussion)</option>
                    <option value={240} className="bg-brand-surface">240 seconds (Architectural Review)</option>
                  </select>
                </div>

              </div>

              {/* Question list area */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider block">
                    2. Exam Questions
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAddQuestionRow}
                    icon={Plus}
                    className="text-brand-primary"
                    disabled={loading}
                  >
                    Add Question Row
                  </Button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex gap-3 items-start relative group">
                      
                      {/* Row count */}
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-surface border border-white/5 text-xs font-bold text-brand-primary flex items-center justify-center mt-1">
                        {idx + 1}
                      </span>
                      
                      {/* Question Text Area */}
                      <textarea
                        value={q}
                        onChange={(e) => handleQuestionChange(idx, e.target.value)}
                        placeholder="Write custom technical/behavioral prompt. e.g. How does Redis PubSub scale?"
                        className="glass-input w-full min-h-[70px] p-3 rounded-xl text-xs text-white focus:outline-none placeholder-brand-muted leading-relaxed"
                        disabled={loading}
                        required
                      />

                      {/* Remove row button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestionRow(idx)}
                        disabled={loading}
                        className="p-3 bg-brand-surface border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-brand-muted hover:text-red-400 rounded-xl transition-all duration-200 cursor-pointer mt-1 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Trigger actions */}
              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <span className="text-[10px] text-brand-muted uppercase tracking-wider">
                  Total Questions: {questions.filter(q => q.trim().length > 0).length} valid
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Sparkles}
                >
                  Generate Invite Code
                </Button>
              </div>

            </Card>
          </form>

          {/* RIGHT PANELS: QUESTION BANK SELECTOR */}
          <div className="lg:col-span-1 space-y-4">
            <Card hoverable={false} className="h-[580px] flex flex-col p-5">
              
              {/* Header Title */}
              <div className="border-b border-white/5 pb-3.5 mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-brand-primary" />
                  Question Bank
                </span>
                <span className="text-[10px] font-mono text-brand-muted bg-brand-surface border border-white/5 px-2 py-0.5 rounded">
                  {filteredCatalog.length} loaded
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCatalogFilter(c)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap cursor-pointer transition-all duration-200 border
                      ${catalogFilter === c 
                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                        : 'bg-transparent border-transparent text-brand-text-inactive hover:text-white'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Search filter catalog */}
              <div className="relative flex items-center my-3">
                <Search className="absolute left-3 w-3.5 h-3.5 text-brand-muted" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Quick search questions..."
                  className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-[11px] text-white focus:outline-none placeholder-brand-muted"
                />
              </div>

              {/* Scrolling list items */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {filteredCatalog.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-brand-surface/40 hover:bg-brand-surface border border-white/5 hover:border-brand-primary/20 rounded-xl transition-all duration-200 text-left relative group flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-brand-secondary px-1.5 py-0.5 rounded bg-brand-secondary/10 border border-brand-secondary/15">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleImportQuestion(item.text)}
                        className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-brand-primary hover:text-white cursor-pointer p-0.5"
                        title="Import Question"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed pr-1 select-none">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

            </Card>
          </div>

        </div>
      )}

    </div>
  );
};

export default CreateTemplate;
