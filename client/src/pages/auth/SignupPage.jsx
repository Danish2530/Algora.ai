import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Briefcase, Mail, KeyRound, Check, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const SignupPage = () => {
  const { signup, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = user.role === 'recruiter' 
        ? '/recruiter/dashboard' 
        : '/candidate/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set initial role from query parameter if available
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'recruiter' || roleParam === 'candidate') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password) {
      setFormError('Name, email, and password are required');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name,
        email,
        password,
        role,
        company: role === 'recruiter' ? company : null,
        title: role === 'candidate' ? title : null
      };

      const newUser = await signup(userData);
      const dest = newUser.role === 'recruiter' 
        ? '/recruiter/dashboard' 
        : '/candidate/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center radial-mesh px-4 py-16 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white font-display">
            Create your Algora account
          </h1>
          <p className="text-xs text-brand-text-inactive">
            Get started with AI-driven technical evaluations in minutes.
          </p>
        </div>

        {/* Card Form container */}
        <Card hoverable={false} className="shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {formError && (
            <div className="mb-4 flex items-start gap-2 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Role selector buttons */}
          <div className="mb-6 space-y-1.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              I am signing up as a:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2 cursor-pointer
                  ${role === 'candidate' 
                    ? 'border-brand-primary bg-brand-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                    : 'border-white/5 bg-brand-surface/40 text-brand-text-inactive hover:border-white/10 hover:text-white'
                  }`}
              >
                {role === 'candidate' && (
                  <div className="absolute top-2 right-2 p-0.5 bg-brand-primary text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <User className={`w-6 h-6 ${role === 'candidate' ? 'text-brand-primary' : 'text-brand-muted'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2 cursor-pointer
                  ${role === 'recruiter' 
                    ? 'border-brand-secondary bg-brand-secondary/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                    : 'border-white/5 bg-brand-surface/40 text-brand-text-inactive hover:border-white/10 hover:text-white'
                  }`}
              >
                {role === 'recruiter' && (
                  <div className="absolute top-2 right-2 p-0.5 bg-brand-secondary text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <Briefcase className={`w-6 h-6 ${role === 'recruiter' ? 'text-brand-secondary' : 'text-brand-muted'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">Recruiter</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                disabled={loading}
                required
              />
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-brand-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-brand-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Conditional fields based on selected role */}
            {role === 'recruiter' ? (
              <div className="space-y-1 animate-slideDown">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="TechCorp Inc."
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            ) : (
              <div className="space-y-1 animate-slideDown">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Frontend Developer"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            )}

            {/* Register button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-4"
              loading={loading}
            >
              Register Account
            </Button>

          </form>

        </Card>

        {/* Foot links */}
        <p className="text-center text-xs text-brand-text-inactive">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary hover:underline font-bold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;
