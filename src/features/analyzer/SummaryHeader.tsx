import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { OverallStatus } from './types';

interface SummaryHeaderProps {
  overallStatus: OverallStatus;
  overallSummary: string;
  hasCriticalValues?: boolean;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  overallStatus,
  overallSummary,
  hasCriticalValues = false,
}) => {
  const isUrgent = overallStatus === 'urgent' || hasCriticalValues;
  const isAttention = overallStatus === 'attention';

  return (
    <div className="space-y-4">
      {/* Emergency Detection Alert Banner (if critical) */}
      {isUrgent && (
        <div className="p-4 md:p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 shadow-soft flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-base md:text-lg text-red-900">
              Please Consult a Doctor Soon
            </h4>
            <p className="text-sm text-red-800 leading-relaxed">
              One or more parameters on your report are significantly outside typical reference levels. Do not panic—laboratory values must always be interpreted alongside your personal medical history, but we advise contacting your doctor promptly for an in-person assessment.
            </p>
          </div>
        </div>
      )}

      {/* Main Overall Summary Card */}
      <Card
        padding="lg"
        className={`border-2 transition-all ${
          isUrgent
            ? 'border-red-200 bg-surface'
            : isAttention
            ? 'border-amber-200/90 bg-surface'
            : 'border-green-200 bg-surface'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isUrgent
                  ? 'bg-red-100 text-red-600'
                  : isAttention
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {isUrgent ? (
                <AlertCircle className="w-5 h-5" />
              ) : isAttention ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-ink">
                Executive Health Summary
              </h2>
              <p className="text-xs text-ink-muted">AI Clinical Report Overview</p>
            </div>
          </div>

          <Badge status={overallStatus} size="md" />
        </div>

        {/* 3 to 5 empathetic sentences */}
        <div className="pt-4 space-y-3">
          <p className="text-ink text-base md:text-lg leading-relaxed font-normal">
            {overallSummary}
          </p>
        </div>
      </Card>
    </div>
  );
};
