import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-primary mx-auto flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-ink tracking-tight">
          Privacy Policy & Data Processing
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          MediReport AI is designed around a single unbreakable principle: <strong className="text-ink">Zero Health Data Retention</strong>.
        </p>
      </div>

      {/* Main Privacy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="border border-border bg-surface space-y-3">
          <EyeOff className="w-6 h-6 text-primary" />
          <h3 className="font-heading font-bold text-lg text-ink">No Image Storage</h3>
          <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
            Uploaded images are processed directly in volatile server memory. They are never written to disk, databases, or cloud object buckets.
          </p>
        </Card>

        <Card padding="md" className="border border-border bg-surface space-y-3">
          <Lock className="w-6 h-6 text-primary" />
          <h3 className="font-heading font-bold text-lg text-ink">No Account or Cookies</h3>
          <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
            You do not need to log in, provide an email, or connect social profiles. We do not use third-party behavioral advertising cookies.
          </p>
        </Card>

        <Card padding="md" className="border border-border bg-surface space-y-3">
          <Trash2 className="w-6 h-6 text-primary" />
          <h3 className="font-heading font-bold text-lg text-ink">Instant Disposal</h3>
          <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
            The instant your report explanation is sent back to your browser, all memory buffers holding the image are immediately freed and purged.
          </p>
        </Card>
      </div>

      {/* Detailed Technical Explanation */}
      <Card padding="lg" className="border border-border bg-surface space-y-6 text-sm md:text-base text-ink leading-relaxed">
        <h2 className="font-heading font-bold text-2xl text-ink">
          How Your Blood Report Is Processed Technical Flow
        </h2>

        <div className="space-y-4 text-ink-muted">
          <p>
            When you use MediReport AI, your report goes through the following isolated sequence:
          </p>

          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>
              <strong className="text-ink">In-Browser Preparation:</strong> Your browser reads the image file locally and compresses it using client-side canvas APIs to minimize network transmission size.
            </li>
            <li>
              <strong className="text-ink">Encrypted Transmission (HTTPS/TLS):</strong> The base64 payload is sent over a secure TLS 1.3 encrypted connection to our Netlify Serverless Function proxy.
            </li>
            <li>
              <strong className="text-ink">Ephemeral AI Vision Inspection:</strong> The serverless function calls Groq Cloud's vision API using server-side credentials. Groq extracts the printed text and normal ranges.
            </li>
            <li>
              <strong className="text-ink">Delivery and Purge:</strong> The generated plain-language JSON summary is returned to your browser. The serverless container shuts down, leaving zero files or databases behind.
            </li>
          </ol>

          <h3 className="font-heading font-bold text-lg text-ink pt-4">
            Patient Identifiable Information (PII)
          </h3>
          <p>
            We recommend covering or folding away your name, address, or national ID number printed at the top of your lab report before taking a photo. While our AI only looks at the test names and numeric tables, protecting your personal details is always a healthy digital habit.
          </p>
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-slate-100 text-xs text-ink-muted text-center">
        Last updated: October 2026. For questions regarding data processing, contact our open-source healthcare literacy team.
      </div>
    </div>
  );
};
