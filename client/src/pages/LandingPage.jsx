import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Layers, 
  CheckCircle, 
  Gamepad, 
  Terminal,
  Cpu
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col radial-mesh overflow-hidden pb-12">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center space-y-8 flex-grow">
        
        {/* Glow Tagline banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold tracking-wider text-brand-primary animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Empowered by Next-Gen Generative AI
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
          Assess Talent and Practice Skills with{' '}
          <span className="bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-secondary bg-clip-text text-transparent glow-text-blue">
            AI-Powered Interviews
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-lg text-brand-text-inactive max-w-2xl mx-auto leading-relaxed">
          Algora.ai automates software engineering evaluation. Recruiters design custom technical tests, and candidates receive deep, keyword-aware diagnostics to focus their preparation.
        </p>

        {/* Hero CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/signup?role=recruiter" className="w-full sm:w-auto">
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto border-brand-secondary/50 text-white hover:bg-brand-secondary/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              icon={Layers}
            >
              I'm a Recruiter
            </Button>
          </Link>
          
          <Link to="/signup?role=candidate" className="w-full sm:w-auto">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full sm:w-auto shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              icon={ArrowRight}
            >
              I'm a Candidate
            </Button>
          </Link>
        </div>

      </section>

      {/* Features Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5 bg-brand-surface/20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Designed for Both Recruiters and Candidates
          </h2>
          <p className="text-sm text-brand-text-inactive mt-2">
            Accelerate the hiring funnel or train for your dream role with our modular platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <Card 
            title="AI-Driven Evaluation"
            className="flex flex-col h-full"
            headerActions={<Bot className="w-5 h-5 text-brand-primary" />}
          >
            <p className="text-xs leading-relaxed">
              Provides real-time dynamic scoring and granular suggestions. Instantly analyzes technical depth, code paradigms, and communication styles.
            </p>
          </Card>

          {/* Card 2 */}
          <Card 
            title="Custom Question Sets"
            className="flex flex-col h-full"
            headerActions={<Terminal className="w-5 h-5 text-brand-secondary" />}
          >
            <p className="text-xs leading-relaxed">
              Recruiters can combine custom design prompts with items selected from our comprehensive question bank to create customized assessment portals.
            </p>
          </Card>

          {/* Card 3 */}
          <Card 
            title="Instant Diagnostic Feedback"
            className="flex flex-col h-full"
            headerActions={<Cpu className="w-5 h-5 text-brand-accent" />}
          >
            <p className="text-xs leading-relaxed">
              Offers candidates interactive scorecard breakdowns immediately upon submission. Highlights strong areas and suggests concrete improvements.
            </p>
          </Card>

          {/* Card 4 */}
          <Card 
            title="Topic Practice Mode"
            className="flex flex-col h-full"
            headerActions={<Gamepad className="w-5 h-5 text-brand-primary" />}
          >
            <p className="text-xs leading-relaxed">
              Allows job seekers to configure sandbox practice templates by role (Frontend, Backend, etc.) and category focus (DSA, System Design, behavioral).
            </p>
          </Card>

        </div>
      </section>

      {/* Trust Quote Banner */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center mt-6">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="text-lg font-bold text-white">Ready to begin your evaluation?</h3>
            <p className="text-xs text-brand-text-inactive">Join thousands of software engineers already using Algora for interview preparation.</p>
          </div>
          <Link to="/login">
            <Button variant="primary" size="md">
              Sign In Now
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
