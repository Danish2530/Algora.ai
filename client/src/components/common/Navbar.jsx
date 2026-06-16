import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bot, 
  LogOut, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  History, 
  Play, 
  Link2,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const activeLinkClass = ({ isActive }) => 
    `flex items-center gap-1.5 px-3 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-300
     ${isActive 
       ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/25 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
       : 'text-brand-text-inactive hover:text-white hover:bg-brand-surface/40 border border-transparent'}`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Algora<span className="text-brand-primary">.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              user.role === 'candidate' ? (
                <>
                  <NavLink to="/candidate/dashboard" className={activeLinkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/candidate/practice" className={activeLinkClass}>
                    <Play className="w-4 h-4" />
                    Practice
                  </NavLink>
                  <NavLink to="/candidate/join" className={activeLinkClass}>
                    <Link2 className="w-4 h-4" />
                    Join Interview
                  </NavLink>
                  <NavLink to="/candidate/history" className={activeLinkClass}>
                    <History className="w-4 h-4" />
                    History
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/recruiter/dashboard" className={activeLinkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    Recruiter Console
                  </NavLink>
                  <NavLink to="/recruiter/create-template" className={activeLinkClass}>
                    <PlusCircle className="w-4 h-4" />
                    Create Template
                  </NavLink>
                </>
              )
            ) : (
              <span className="text-xs font-semibold tracking-widest text-brand-muted uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                AI Interview Suite
              </span>
            )}
          </div>

          {/* User Options / Register Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-white/5 pl-4">
                {/* User avatar badge */}
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-brand-surface rounded-lg border border-white/5">
                    <User className="w-4 h-4 text-brand-secondary" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white max-w-[120px] truncate">{user.name}</span>
                    <span className="text-[10px] font-medium text-brand-primary uppercase tracking-wider">{user.role}</span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  icon={LogOut}
                  className="!rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu (Mobile Toggle) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface border border-transparent focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1.5 sm:px-3">
            {isAuthenticated ? (
              user.role === 'candidate' ? (
                <>
                  <Link 
                    to="/candidate/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface/50 text-base"
                  >
                    <LayoutDashboard className="w-5 h-5 text-brand-primary" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/candidate/practice" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface/50 text-base"
                  >
                    <Play className="w-5 h-5 text-brand-primary" />
                    Practice
                  </Link>
                  <Link 
                    to="/candidate/join" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface/50 text-base"
                  >
                    <Link2 className="w-5 h-5 text-brand-primary" />
                    Join Interview
                  </Link>
                  <Link 
                    to="/candidate/history" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface/50 text-base"
                  >
                    <History className="w-5 h-5 text-brand-primary" />
                    History
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/recruiter/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface/50 text-base"
                  >
                    <LayoutDashboard className="w-5 h-5 text-brand-secondary" />
                    Recruiter Console
                  </Link>
                  <Link 
                    to="/recruiter/create-template" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-text-inactive hover:text-white hover:bg-brand-surface/50 text-base"
                  >
                    <PlusCircle className="w-5 h-5 text-brand-secondary" />
                    Create Template
                  </Link>
                </>
              )
            ) : null}

            {/* Mobile Auth options */}
            <div className="border-t border-white/5 pt-4 mt-2">
              {isAuthenticated ? (
                <div className="px-3 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5 text-brand-secondary" />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white">{user.name}</span>
                      <span className="text-xs text-brand-muted">{user.email}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }} 
                    icon={LogOut}
                    className="w-full justify-start text-red-400 hover:bg-red-500/10"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
