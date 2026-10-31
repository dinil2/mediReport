import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Eye,
  Stethoscope,
  Apple,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AccordionItem } from '../components/ui/Accordion';
import { SAMPLE_REPORT, FAQ_ITEMS } from '../lib/constants';
import { ParameterCard } from '../features/analyzer/ParameterCard';

export const Home: React.FC = () => {

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1. Hero Section */}
      <section className="relative pt-6 md:pt-12 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-primary-light text-primary-900 border border-teal-200 shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Free • Zero Data Storage • Built for Everyday Patients</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-ink tracking-tight leading-[1.15]">
            Understand your blood test report{' '}
            <span className="text-primary underline decoration-teal-300 decoration-wavy decoration-2">
              in 60 seconds
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed font-normal">
            Take a photo of your laboratory report. Our calm, medical-trained AI explains every number in simple, friendly words, with practical dietary and lifestyle tips.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/analyze" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Analyze My Report Now
              </Button>
            </Link>

            <Link to="/analyze?demo=true" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base"
                leftIcon={<Eye className="w-5 h-5 text-primary" />}
              >
                Try Sample Report
              </Button>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs md:text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              English, සිංහල & தமிழ்
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary" />
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              100% Private & Ephemeral
            </span>
          </div>
        </div>

        {/* Hero Interactive Sample Preview */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card padding="none" className="border-2 border-teal-200/80 shadow-soft-xl overflow-hidden bg-surface">
            {/* Mock Header Bar */}
            <div className="bg-slate-100/80 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs font-mono text-ink-muted ml-2">Live Demo: Full Blood Count Analysis</span>
              </div>
              <Badge status="attention" label="Mild Anemia Detected" size="sm" />
            </div>

            {/* Content Preview */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-lg md:text-xl text-ink">
                  Executive AI Summary Preview:
                </h3>
                <p className="text-sm md:text-base text-ink leading-relaxed">
                  "Your Hemoglobin is slightly below the reference range (11.2 vs 12.0 g/dL), indicating mild anemia which may explain occasional tiredness. Your blood sugar is also slightly elevated. Your kidney, liver, and platelet counts look completely healthy."
                </p>
              </div>

              {/* Sample Parameter Card */}
              <div className="border border-border/80 rounded-2xl p-1 bg-slate-50/50">
                <ParameterCard parameter={SAMPLE_REPORT.parameters[0]} defaultExpanded={true} />
              </div>

              <div className="text-center pt-2">
                <Link to="/analyze">
                  <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Upload Your Own Report to Get Plain Explanations
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. Three-Step "How It Works" Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple & Gentle</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">
            How MediReport AI Works
          </h2>
          <p className="text-ink-muted text-base max-w-xl mx-auto">
            From confusing lab papers to crystal-clear understanding in 3 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card padding="lg" className="border border-border relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary flex items-center justify-center font-bold text-xl font-heading shadow-soft-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-xl text-ink">Take a Photo</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Snap a picture of your blood test result using your phone's camera, or upload a photo or single-page PDF.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/70 text-xs text-ink-muted flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Camera & file picker ready</span>
            </div>
          </Card>

          {/* Step 2 */}
          <Card padding="lg" className="border border-border relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary flex items-center justify-center font-bold text-xl font-heading shadow-soft-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-xl text-ink">AI Reads the Report</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Our vision AI securely parses only the values printed on your report and compares them directly with your laboratory's normal range.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/70 text-xs text-ink-muted flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>Takes under 30 seconds</span>
            </div>
          </Card>

          {/* Step 3 */}
          <Card padding="lg" className="border border-border relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary flex items-center justify-center font-bold text-xl font-heading shadow-soft-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-ink">You Understand Everything</h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                Get a calm summary, diet & lifestyle tips to improve abnormal numbers, and insightful questions to ask your doctor.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/70 text-xs text-ink-muted flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span>Doctor-ready summary</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Core Benefits Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Patient-First Design</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">
            Designed for Peace of Mind
          </h2>
          <p className="text-ink-muted text-base max-w-xl mx-auto">
            Traditional medical lab sheets create anxiety. We turn clinical jargon into understandable, actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card padding="md" className="border border-border bg-surface">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-ink mb-1">
              Plain 12-Year-Old English
            </h4>
            <p className="text-ink-muted text-xs leading-relaxed">
              No confusing Latin terms or scary abbreviations. Everything is defined simply and clearly.
            </p>
          </Card>

          <Card padding="md" className="border border-border bg-surface">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <Apple className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-ink mb-1">
              Diet & Lifestyle Steps
            </h4>
            <p className="text-ink-muted text-xs leading-relaxed">
              Get practical food and daily habit adjustments (sunlight, hydration, sleep, exercise) to help your numbers.
            </p>
          </Card>

          <Card padding="md" className="border border-border bg-surface">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-ink mb-1">
              Questions for Your Doctor
            </h4>
            <p className="text-ink-muted text-xs leading-relaxed">
              Copy smart questions in one click to bring to your next physician visit so you feel confident and prepared.
            </p>
          </Card>

          <Card padding="md" className="border border-border bg-surface">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-ink mb-1">
              Zero Data Storage
            </h4>
            <p className="text-ink-muted text-xs leading-relaxed">
              Your photo is never saved to a database or shared. Once your summary is generated, the image disappears.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Privacy & Trust Guarantee */}
      <section className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-14 relative overflow-hidden shadow-soft-xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Uncompromising Privacy Architecture</span>
            </div>

            <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
              We never save your medical report. Period.
            </h3>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Health records are deeply personal. That's why MediReport AI is engineered without user databases, without image storage, and without user tracking cookies. Your document is processed entirely in memory and immediately discarded.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Zero medical image persistence</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>No account or credit card required</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Client-side compression for speed</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Strict non-diagnostic ethical prompt</span>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/privacy">
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Read Our Full Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Preview Section */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">
            Frequently Asked Questions
          </h2>
          <p className="text-ink-muted text-base">
            Everything you need to know about understanding your lab results safely.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.slice(0, 4).map((faq, index) => (
            <AccordionItem key={index} title={faq.question} defaultOpen={index === 0}>
              {faq.answer}
            </AccordionItem>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link to="/faq">
            <Button variant="ghost" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Frequently Asked Questions
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. Final Call to Action Banner */}
      <section className="max-w-5xl mx-auto">
        <Card padding="lg" className="border-2 border-primary bg-primary-50/50 text-center p-10 md:p-14 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white mx-auto flex items-center justify-center shadow-soft">
            <Activity className="w-7 h-7" />
          </div>

          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">
            Ready to understand what your blood test says?
          </h2>

          <p className="text-ink-muted text-base md:text-lg max-w-xl mx-auto">
            Get instant clarity on your health numbers in under a minute. Free, private, and always simple.
          </p>

          <div className="pt-2">
            <Link to="/analyze">
              <Button size="lg" className="text-base px-8 py-3.5 shadow-soft-lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Upload Your Blood Report Now
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};
