import React from 'react';
import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-brand-bg/80 backdrop-blur-md mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footers grids */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          
          {/* Logo + Mission statement */}
          <div className="flex flex-col space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Algora<span className="text-brand-primary">.ai</span>
              </span>
            </Link>
            <p className="text-xs text-brand-text-inactive leading-relaxed max-w-xs">
              Algora.ai elevates recruitment using autonomous evaluation tools, custom practice templates, and immediate diagnostic breakdowns for engineers and recruiters.
            </p>
            <div className="flex items-center gap-3 text-brand-muted">
              {/* Twitter X SVG */}
              <a href="#" className="hover:text-brand-primary transition-colors duration-200" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a href="#" className="hover:text-brand-primary transition-colors duration-200" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              {/* GitHub SVG */}
              <a href="#" className="hover:text-brand-primary transition-colors duration-200" aria-label="GitHub">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Recruiters</h4>
            <ul className="space-y-2 text-xs text-brand-text-inactive font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Candidate Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Built-in Question Bank</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plagiarism Detection</a></li>
            </ul>
          </div>

          {/* Candidate links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Candidates</h4>
            <ul className="space-y-2 text-xs text-brand-text-inactive font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Practice Room</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Detailed Diagnostics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Role Focus DSA/HR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preparation Guides</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-brand-text-inactive font-medium">
              <li><a href="#" className="hover:text-white transition-colors">API References</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status Dashboard</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom footer credit */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <span>
            &copy; {new Date().getFullYear()} Algora.ai. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-text-inactive">System Status</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-brand-text-inactive">Security Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
