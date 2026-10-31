import React, { useState } from 'react';
import { ChevronDown, Apple, HelpCircle, Stethoscope, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RangeBar } from '../../components/ui/RangeBar';
import { ParameterData } from './types';

interface ParameterCardProps {
  parameter: ParameterData;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({
  parameter,
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onToggle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const isNormal = parameter.status === 'normal';
  const isCritical = parameter.status === 'critical';

  return (
    <Card
      padding="none"
      className={`border overflow-hidden transition-all duration-200 print-page-break-avoid ${
        isCritical
          ? 'border-red-200 bg-surface shadow-soft-sm'
          : !isNormal
          ? 'border-amber-200 bg-surface shadow-soft-sm'
          : 'border-border bg-surface'
      }`}
    >
      {/* Card Header (Always Visible) */}
      <div
        onClick={handleToggle}
        className="p-5 md:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle();
          }
        }}
        aria-expanded={isExpanded}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="font-heading font-bold text-lg md:text-xl text-ink">
                {parameter.name}
              </h3>
              <Badge status={parameter.status} size="sm" />
            </div>
            <p className="text-xs md:text-sm text-ink-muted leading-relaxed font-normal">
              {parameter.plainName}
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6">
            {/* Quick Numbers Display */}
            <div className="text-right">
              <div className="text-xl md:text-2xl font-mono font-bold text-ink">
                {parameter.value} <span className="text-xs font-sans text-ink-muted">{parameter.unit}</span>
              </div>
              <div className="text-xs text-ink-muted">
                Normal: <span className="font-medium text-ink">{parameter.normalRange}</span>
              </div>
            </div>

            {/* Expand / Collapse Icon */}
            <div
              className={`p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-slate-100 transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-primary' : ''
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Visual Horizontal Range Bar */}
        <RangeBar
          value={parameter.value}
          normalRange={parameter.normalRange}
          status={parameter.status}
          unit={parameter.unit}
        />

        {/* Difference callout */}
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="font-semibold text-ink">Status comparison:</span>
          <span
            className={`font-medium ${
              isCritical
                ? 'text-red-700'
                : !isNormal
                ? 'text-amber-700'
                : 'text-green-700'
            }`}
          >
            {parameter.difference}
          </span>
        </div>
      </div>

      {/* Expandable Body */}
      {(isExpanded || false) && (
        <div className="px-5 pb-6 md:px-6 md:pb-6 pt-2 border-t border-border/60 bg-slate-50/50 space-y-5 print-expand">
          {/* What It Means */}
          <div className="space-y-1.5">
            <h4 className="font-heading font-semibold text-sm text-ink flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary shrink-0" />
              <span>What this means in plain language:</span>
            </h4>
            <p className="text-sm text-ink-muted leading-relaxed pl-6">
              {parameter.whatItMeans}
            </p>
          </div>

          {/* Possible Causes (if abnormal) */}
          {parameter.possibleCauses && parameter.possibleCauses.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="font-heading font-semibold text-sm text-ink flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Common possible causes:</span>
              </h4>
              <ul className="list-disc list-inside text-sm text-ink-muted space-y-1 pl-6">
                {parameter.possibleCauses.map((cause, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Lifestyle & Diet Improvements */}
          {parameter.howToImprove && parameter.howToImprove.length > 0 && (
            <div className="space-y-1.5 bg-surface border border-border/80 rounded-xl p-4">
              <h4 className="font-heading font-semibold text-sm text-ink flex items-center gap-2">
                <Apple className="w-4 h-4 text-green-600 shrink-0" />
                <span>Practical diet & lifestyle steps to support this level:</span>
              </h4>
              <ul className="list-disc list-inside text-sm text-ink space-y-1.5 pl-6 pt-1">
                {parameter.howToImprove.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed text-ink-muted">
                    <span className="text-ink font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Questions to Ask Doctor */}
          {parameter.askYourDoctor && parameter.askYourDoctor.length > 0 && (
            <div className="space-y-1.5 bg-primary-50/50 border border-teal-200/70 rounded-xl p-4">
              <h4 className="font-heading font-semibold text-sm text-primary-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary shrink-0" />
                <span>Good questions to ask your doctor about this value:</span>
              </h4>
              <ul className="list-disc list-inside text-xs md:text-sm text-ink-muted space-y-1 pl-6 pt-1">
                {parameter.askYourDoctor.map((q, idx) => (
                  <li key={idx} className="leading-relaxed text-primary-950 font-medium">
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
