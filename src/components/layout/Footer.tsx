import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';
import { MANDATORY_DISCLAIMER } from '../../lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-ink tracking-tight">
                MediReport<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-ink-muted text-sm md:text-base leading-relaxed max-w-md">
              Demystifying blood work and laboratory diagnostics for everyday people. We translate complex clinical terminology into warm, plain language with practical lifestyle insights.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-ink-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Zero Health Data Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-primary" />
                <span>Free Healthcare Literacy</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-ink uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-ink-muted hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-ink-muted hover:text-primary transition-colors">
                  Analyze Report
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-ink-muted hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-muted hover:text-primary transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ink-muted hover:text-primary transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-ink uppercase tracking-wider">
              Safety & Ethics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/disclaimer" className="text-ink-muted hover:text-primary transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-ink-muted hover:text-primary transition-colors">
                  Privacy Policy & Retention
                </Link>
              </li>
              <li>
                <span className="text-ink-light text-xs block pt-2">
                  Built for everyday people in Sri Lanka and worldwide with low-bandwidth, accessible mobile optimization.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-border/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-ink-muted leading-relaxed">
              <strong className="text-ink font-semibold">Important Medical Notice: </strong>
              {MANDATORY_DISCLAIMER}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-ink-light pt-2 gap-2">
            <p>© {new Date().getFullYear()} MediReport AI. All rights reserved.</p>
            <p>Empowering patient understanding, one report at a time.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

