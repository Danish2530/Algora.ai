import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Mail, Sparkles, User, Briefcase, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = user.role === 'recruiter' 
        ? '/recruiter/dashboard' 
        : '/candidate/dashboard';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve redirect path or default to dashboard based on role
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      // Success redirect
      if (from) {
        navigate(from, { replace: true });
      } else {
        const dest = loggedUser.role === 'recruiter' 
          ? '/recruiter/dashboard' 
          : '/candidate/dashboard';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper
  const handleQuickFill = (roleType) => {
    if (roleType === 'candidate') {
      setEmail('candidate@algora.ai');
      setPassword('password123');
    } else {
      setEmail('recruiter@algora.ai');
      setPassword('password123');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center radial-mesh px-4 py-16 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white font-display">
            Welcome back to Algora
          </h1>
          <p className="text-xs text-brand-text-inactive">
            Enter your credentials or select a mock tester profile below.
          </p>
        </div>

        {/* Card Form */}
        <Card hoverable={false} className="shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {formError && (
            <div className="mb-4 flex items-start gap-2 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  placeholder="name@company.com"
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3 w-4 h-4 text-brand-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Sign in Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2"
              loading={loading}
            >
              Sign In
            </Button>

          </form>

          {/* Quick-fill testing panel */}
          <div className="border-t border-white/5 pt-4 mt-6">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-2 text-center">
              Quick Test Accounts (Click to Autofill)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('candidate')}
                className="flex items-center justify-center gap-1.5 p-2 bg-brand-surface hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 rounded-xl transition-all duration-200 text-xs font-semibold text-white"
              >
                <User className="w-3.5 h-3.5 text-brand-primary" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('recruiter')}
                className="flex items-center justify-center gap-1.5 p-2 bg-brand-surface hover:bg-brand-secondary/10 border border-white/5 hover:border-brand-secondary/30 rounded-xl transition-all duration-200 text-xs font-semibold text-white"
              >
                <Briefcase className="w-3.5 h-3.5 text-brand-secondary" />
                Recruiter
              </button>
            </div>
          </div>

        </Card>

        {/* Foot links */}
        <p className="text-center text-xs text-brand-text-inactive">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-primary hover:underline font-bold">
            Sign up now
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
