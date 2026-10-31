import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Analyze', path: '/analyze' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'FAQ', path: '/faq' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border shadow-soft-sm'
          : 'bg-transparent border-b border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-primary rounded-lg py-1 px-1"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft group-hover:bg-primary-hover transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg md:text-xl text-ink tracking-tight flex items-center gap-1">
                MediReport<span className="text-primary">AI</span>
              </span>
              <span className="text-[10px] text-ink-muted -mt-1 font-medium tracking-wide">
                Calm Blood Test Explainer
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-primary bg-primary-light/60 font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-ink-muted bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-border/60">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Zero-Storage Privacy</span>
            </div>
            <Link to="/analyze">
              <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Analyze My Report
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-surface shadow-soft-xl animate-fade-in">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light font-semibold'
                      : 'text-ink hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border mt-3 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-ink-muted py-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Your medical photo is never saved or stored</span>
              </div>
              <Link to="/analyze" className="block w-full">
                <Button size="lg" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Analyze My Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

