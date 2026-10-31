import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { Card } from '../../components/ui/Card';

const STEPS = [
  { id: 1, label: 'Reading your report and scanning document...' },
  { id: 2, label: 'Checking laboratory values against normal ranges...' },
  { id: 3, label: 'Translating complex medical terms into plain language...' },
  { id: 4, label: 'Writing your empathetic summary & diet tips...' },
];

export const LoadingState: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const intervals = [2500, 3500, 4000, 6000];
    let timeout: NodeJS.Timeout;

    const advance = (idx: number) => {
      if (idx < STEPS.length - 1) {
        timeout = setTimeout(() => {
          setCurrentStepIndex(idx + 1);
          advance(idx + 1);
        }, intervals[idx]);
      }
    };

    advance(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Active Loading Header Card */}
      <Card className="bg-surface border-2 border-teal-200/80 shadow-soft-lg text-center p-8 md:p-10">
        <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary mx-auto flex items-center justify-center mb-5 relative">
          <Loader2 className="w-8 h-8 animate-spin" />
          <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
        </div>

        <h3 className="text-xl md:text-2xl font-heading font-extrabold text-ink mb-2">
          Analyzing Your Medical Report
        </h3>
        <p className="text-ink-muted text-sm max-w-md mx-auto mb-8">
          Please keep this tab open while our vision AI carefully examines your laboratory results.
        </p>

        {/* Step Indicator Progress */}
        <div className="max-w-lg mx-auto space-y-3 text-left">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary-50/50 text-ink shadow-soft-sm'
                    : isCompleted
                    ? 'border-green-200 bg-green-50/40 text-green-900'
                    : 'border-transparent text-ink-light opacity-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0 flex items-center justify-center text-[10px] text-slate-400">
                    {idx + 1}
                  </div>
                )}
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Skeletons Previewing the Upcoming Results */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>

        <Card padding="md" className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="md" className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </Card>
          <Card padding="md" className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </Card>
        </div>
      </div>
    </div>
  );
};
