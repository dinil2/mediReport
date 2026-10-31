import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Globe,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-6 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Our Story & Purpose
        </span>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-ink tracking-tight">
          Democratizing Healthcare Understanding
        </h1>
        <p className="text-ink-muted text-base md:text-lg leading-relaxed">
          Millions of patients walk out of clinics clutching blood test reports they cannot read. We are on a mission to replace confusion with calm clarity.
        </p>
      </div>

      {/* Main Narrative */}
      <Card padding="lg" className="border border-border bg-surface shadow-soft space-y-6 leading-relaxed text-ink text-base md:text-lg">
        <h2 className="font-heading font-bold text-2xl text-ink">
          The Healthcare Communication Gap
        </h2>
        <p className="text-ink-muted">
          When you receive a blood test, you are usually greeted with a dense matrix of numbers, asterisks, and abbreviations: <strong className="text-ink">SGOT, MCV, ESR, HbA1c, Bilirubin</strong>. Even for educated individuals, interpreting what these numbers mean is intimidating.
        </p>
        <p className="text-ink-muted">
          In Sri Lanka and many parts of the developing world, doctor appointments are often brief due to crowded clinical schedules. Patients frequently go home feeling anxious, turning to scary internet search results that suggest worst-case scenarios.
        </p>
        <p className="text-ink-muted">
          <strong className="text-ink font-semibold">MediReport AI</strong> was created to bridge this gap. We believe understanding your own biological metrics is a fundamental human right. Our tool never replaces your physician—it prepares you for your conversation with them.
        </p>
      </Card>

      {/* Core Principles */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-heading font-bold text-2xl text-ink">
            Our Guiding Design Principles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md" className="border border-border bg-surface space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-primary flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-lg text-ink">Calm, Low-Anxiety</h4>
            <p className="text-ink-muted text-xs md:text-sm leading-relaxed">
              We never use alarming red emergency screens or scare tactics. We explain findings with empathy, practical context, and reassurance.
            </p>
          </Card>

          <Card padding="md" className="border border-border bg-surface space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-lg text-ink">Multilingual & Lightweight</h4>
            <p className="text-ink-muted text-xs md:text-sm leading-relaxed">
              Built with native Sinhala, Tamil, and English support. Engineered to load smoothly even on older smartphones and low-bandwidth connections.
            </p>
          </Card>

          <Card padding="md" className="border border-border bg-surface space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-lg text-ink">Zero-Retention Privacy</h4>
            <p className="text-ink-muted text-xs md:text-sm leading-relaxed">
              Your medical photos are personal property. We do not store, archive, or monetize your healthcare diagnostic records.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link to="/analyze">
          <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Try MediReport AI Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
