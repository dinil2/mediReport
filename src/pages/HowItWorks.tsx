import React from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Cpu,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Client-Side Image Optimization',
      subtitle: 'Fast, secure preparation in your browser',
      icon: <UploadCloud className="w-6 h-6 text-primary" />,
      description:
        'When you select an image or PDF from your mobile camera or gallery, your browser immediately optimizes it. We scale the image to a standardized resolution (max ~1400px) and apply JPEG compression. This reduces cellular data usage and ensures fast processing even on standard 3G/4G connections in Sri Lanka and worldwide.',
      highlights: [
        'Client-side execution before upload',
        'Single-page PDF rendering via HTML5 Canvas',
        'Reduces payload to under 1 MB',
      ],
    },
    {
      number: '02',
      title: 'Vision Optical Character Recognition (OCR)',
      subtitle: 'Reading printed numbers and reference intervals',
      icon: <Eye className="w-6 h-6 text-primary" />,
      description:
        'The optimized document is inspected by a state-of-the-art vision model via our secure Netlify serverless proxy. The AI checks if the document is genuinely a laboratory report. It then extracts only the exact values and normal reference ranges printed on the paper. It is strictly forbidden from hallucinating or inventing numbers.',
      highlights: [
        'Document verification guardrail',
        'Extracts lab-specific reference ranges',
        'Panic-flag and critical value detection',
      ],
    },
    {
      number: '03',
      title: 'Contextual Plain-Language Translation',
      subtitle: 'Breaking down clinical jargon into everyday words',
      icon: <Cpu className="w-6 h-6 text-primary" />,
      description:
        'Medical abbreviations like "MCV", "SGPT", or "eGFR" are translated into simple everyday English (or Sinhala / Tamil if selected). The AI explains what the organ does, why the test was ordered, and whether your result sits comfortably in the middle or borders high/low.',
      highlights: [
        '7th-grade (12-year-old) reading level simplicity',
        'Support for English, Sinhala (සිංහල), and Tamil (தமிழ்)',
        'Zero medical disease diagnosis or drug prescription',
      ],
    },
    {
      number: '04',
      title: 'Lifestyle Advice & Doctor Preparation',
      subtitle: 'Practical empowerment for your next consultation',
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      description:
        'Instead of causing anxiety, MediReport AI gives you constructive action items: whole foods to incorporate, daily habit modifications (hydration, sleep, gentle movement), and specific questions you can ask your doctor during your next visit.',
      highlights: [
        'Practical dietary tips (iron-rich foods, low glycemic carbs)',
        'One-click copy for doctor questions',
        'Print / Save as PDF summary stylesheet',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-6 md:py-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Behind the Technology
        </span>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-ink tracking-tight">
          How MediReport AI Translates Your Health Data
        </h1>
        <p className="text-ink-muted text-base md:text-lg leading-relaxed">
          Understanding laboratory results should not require a medical degree. Here is how our calm, ethical AI platform turns numbers into peace of mind.
        </p>
      </div>

      {/* Process Flow Cards */}
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <Card key={idx} padding="lg" className="border border-border bg-surface shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-1">
                <span className="text-2xl md:text-3xl font-heading font-black text-primary/30">
                  {step.number}
                </span>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-ink">{step.title}</h3>
                    <p className="text-xs text-ink-muted">{step.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="md:col-span-4 bg-slate-50 border border-border/80 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Key Guarantees</h4>
                <ul className="space-y-2 text-xs text-ink-muted">
                  {step.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Safety & Guardrails Callout */}
      <Card padding="lg" className="border-2 border-teal-200 bg-teal-50/40 p-8 md:p-10 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h3 className="font-heading font-bold text-2xl text-ink">
            Our Strict Ethical Guardrails
          </h3>
        </div>
        <p className="text-ink-muted text-sm md:text-base leading-relaxed">
          MediReport AI operates under strict clinical safeguards. Our AI is explicitly instructed never to diagnose illnesses, never to prescribe drug dosages, and never to override your doctor's authority. If a result is dangerously abnormal, we highlight it clearly and urge prompt consultation with your healthcare provider.
        </p>
      </Card>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Link to="/analyze">
          <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Try It Now With Your Report
          </Button>
        </Link>
      </div>
    </div>
  );
};
