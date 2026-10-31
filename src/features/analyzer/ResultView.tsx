import React, { useState } from 'react';
import {
  Printer,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  Stethoscope,
  ListOrdered,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReportSuccess } from './types';
import { SummaryHeader } from './SummaryHeader';
import { ParameterCard } from './ParameterCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MANDATORY_DISCLAIMER } from '../../lib/constants';

interface ResultViewProps {
  report: ReportSuccess;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ report, onReset }) => {
  const [copiedDoctorQuestions, setCopiedDoctorQuestions] = useState(false);
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [filterTab, setFilterTab] = useState<'all' | 'abnormal' | 'normal'>('all');

  const handleToggleCard = (key: string, currentDefault: boolean) => {
    setExpandedMap((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : !currentDefault,
    }));
  };

  const handleSetAllExpanded = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    report.parameters.forEach((_, idx) => {
      updated[`abnormal-${idx}`] = expand;
      updated[`normal-${idx}`] = expand;
    });
    setExpandedMap(updated);
  };

  // Trigger subtle celebration if report is in good health
  React.useEffect(() => {
    if (report.overallStatus === 'good') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0D9488', '#16A34A', '#CCFBF1'],
      });
    }
  }, [report.overallStatus]);

  // Separate abnormal and normal parameters
  const abnormalParameters = report.parameters.filter((p) => p.status !== 'normal');
  const normalParameters = report.parameters.filter((p) => p.status === 'normal');
  const hasCriticalValues = report.parameters.some((p) => p.status === 'critical');

  // Collect all doctor questions across parameters
  const allDoctorQuestions = Array.from(
    new Set([
      ...report.parameters.flatMap((p) => p.askYourDoctor || []),
      ...(report.topPriorities.map((item) => `What should we do regarding: ${item}`) || []),
    ])
  ).slice(0, 6);

  const handleCopyQuestions = () => {
    if (allDoctorQuestions.length === 0) return;
    const textToCopy = `Questions for My Doctor from MediReport AI:\n\n${allDoctorQuestions
      .map((q, idx) => `${idx + 1}. ${q}`)
      .join('\n')}\n\nDisclaimer: ${MANDATORY_DISCLAIMER}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedDoctorQuestions(true);
    setTimeout(() => setCopiedDoctorQuestions(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in print-container">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Badge status={report.overallStatus} size="md" />
          <span className="text-xs text-ink-muted">
            {report.parameters.length} test parameter{report.parameters.length !== 1 ? 's' : ''} parsed
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-ink-muted" />}
          >
            Print / Save as PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Analyze Another Report
          </Button>
        </div>
      </div>

      {/* Patient Profile & Age Context Banner */}
      {report.patientContext && (report.patientContext.age || report.patientContext.gender) && (
        <div className="bg-primary-light/40 border border-teal-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-primary-950 shadow-soft-sm">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              👤
            </span>
            <div>
              <div className="font-bold text-ink text-sm flex items-center gap-2">
                <span>Patient Profile: {report.patientContext.age ? `Age ${report.patientContext.age}` : 'Age detected'}</span>
                {report.patientContext.gender && <span>• {report.patientContext.gender}</span>}
              </div>
              <p className="text-ink-muted text-xs mt-0.5">
                Evaluated against age and sex-specific clinical reference intervals printed on your laboratory report.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-teal-300 font-semibold text-primary text-xs self-start sm:self-auto shadow-soft-sm">
            <Check className="w-3.5 h-3.5 text-primary" />
            Age-Calibrated Analysis
          </span>
        </div>
      )}

      {/* (1) & (2) Overall Summary & Emergency Alert */}
      <SummaryHeader
        overallStatus={report.overallStatus}
        overallSummary={report.overallSummary}
        hasCriticalValues={hasCriticalValues}
      />

      {/* Educational Safety Bridge: Why a Doctor Visit is Essential */}
      <Card padding="md" className="border border-amber-300/80 bg-amber-50/50 print-page-break-avoid">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs text-amber-950">
            <h4 className="font-bold text-sm text-amber-900">
              A Crucial Reminder: Always Review These Results With Your Doctor
            </h4>
            <p className="leading-relaxed text-amber-900/90 text-xs">
              Blood numbers are only one part of clinical care. A doctor performs physical examinations (listening to heart and lungs, measuring blood pressure, checking abdomen) and considers your personal and family medical history. Use this plain-language explanation to <strong>prepare questions for your doctor</strong>, never to self-diagnose or skip seeing your physician.
            </p>
          </div>
        </div>
      </Card>

      {/* (3) Top 3 Things to Focus On */}
      {report.topPriorities && report.topPriorities.length > 0 && (
        <Card padding="lg" className="border border-border bg-surface">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg md:text-xl text-ink">
                Top Priorities to Focus On
              </h3>
              <p className="text-xs text-ink-muted">The most impactful insights from your results</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.topPriorities.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-border/80 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-primary-900 uppercase tracking-wider">
                    Key Action
                  </span>
                </div>
                <p className="text-sm text-ink leading-relaxed font-normal">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* (4) Quick-Glance Table of All Values */}
      <Card padding="lg" className="border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-ink">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg md:text-xl text-ink">
                Quick-Glance Summary Table
              </h3>
              <p className="text-xs text-ink-muted">At-a-glance overview of measured laboratory biomarkers</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-ink-muted bg-slate-50/50">
                <th className="py-3 px-4 font-semibold">Test Parameter</th>
                <th className="py-3 px-4 font-semibold">Your Value</th>
                <th className="py-3 px-4 font-semibold">Normal Range</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {report.parameters.map((param, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-ink">
                    <div>{param.name}</div>
                    <div className="text-xs text-ink-muted truncate max-w-xs font-normal">
                      {param.plainName.split('=')[0]?.trim()}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-ink">
                    {param.value} <span className="text-xs font-sans text-ink-muted">{param.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-ink-muted font-mono">{param.normalRange}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge status={param.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* (5) Detailed Parameter Breakdown Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/80">
          <div>
            <h3 className="font-heading font-bold text-xl md:text-2xl text-ink">
              Detailed Parameter Explanations
            </h3>
            <p className="text-xs text-ink-muted">
              Showing {report.parameters.length} total laboratory tests ({abnormalParameters.length} attention, {normalParameters.length} normal)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'all'
                    ? 'bg-surface text-ink shadow-soft-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                All ({report.parameters.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('abnormal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'abnormal'
                    ? 'bg-surface text-amber-900 shadow-soft-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Attention ({abnormalParameters.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('normal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'normal'
                    ? 'bg-surface text-green-900 shadow-soft-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Healthy ({normalParameters.length})
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSetAllExpanded(true)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-slate-50 text-ink-muted hover:text-ink transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => handleSetAllExpanded(false)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-slate-50 text-ink-muted hover:text-ink transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Priority 1: Abnormal Values (Expanded by default) */}
        {(filterTab === 'all' || filterTab === 'abnormal') && abnormalParameters.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Requires Attention or Follow-up ({abnormalParameters.length})</span>
            </div>
            {abnormalParameters.map((param, index) => {
              const cardKey = `abnormal-${index}`;
              const isCardExpanded = expandedMap[cardKey] !== undefined ? expandedMap[cardKey] : true;
              return (
                <ParameterCard
                  key={cardKey}
                  parameter={param}
                  isExpanded={isCardExpanded}
                  onToggle={() => handleToggleCard(cardKey, true)}
                />
              );
            })}
          </div>
        )}

        {/* Priority 2: Normal Values (Available to expand or inspect) */}
        {(filterTab === 'all' || filterTab === 'normal') && normalParameters.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-green-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Within Healthy Reference Limits ({normalParameters.length})</span>
              </div>
              <span className="text-[11px] text-ink-muted font-normal lowercase">Click to expand any normal test</span>
            </div>
            {normalParameters.map((param, index) => {
              const cardKey = `normal-${index}`;
              const isCardExpanded = expandedMap[cardKey] !== undefined ? expandedMap[cardKey] : false;
              return (
                <ParameterCard
                  key={cardKey}
                  parameter={param}
                  isExpanded={isCardExpanded}
                  onToggle={() => handleToggleCard(cardKey, false)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* (6) "See a doctor urgently if..." box */}
      {report.whenToSeeDoctorUrgently && report.whenToSeeDoctorUrgently.length > 0 && (
        <Card padding="lg" className="border-2 border-red-200 bg-red-50/50 print-page-break-avoid">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-red-200">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-red-950">
                When to Seek Urgent Medical Care
              </h4>
              <p className="text-xs text-red-800">
                Contact your nearest clinic or emergency services if experiencing:
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.whenToSeeDoctorUrgently.map((warning, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-red-200/70 text-sm text-red-950"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 mt-2 shrink-0" />
                <span className="leading-relaxed">{warning}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* (7) "Questions to Ask Your Doctor" with 1-Click Copy */}
      {allDoctorQuestions.length > 0 && (
        <Card padding="lg" className="border border-teal-200 bg-teal-50/30 print-page-break-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-teal-200/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-primary-950">
                  Questions to Ask Your Doctor
                </h4>
                <p className="text-xs text-primary-800">
                  Take these insightful questions with you to your appointment
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyQuestions}
              className="no-print inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-teal-300 text-primary-900 hover:bg-teal-100 transition-all shadow-soft-sm"
              aria-label="Copy doctor questions"
            >
              {copiedDoctorQuestions ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-primary" />
                  <span>Copy Questions (1-Click)</span>
                </>
              )}
            </button>
          </div>

          <ol className="space-y-2.5">
            {allDoctorQuestions.map((q, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-teal-100 text-sm text-ink font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-primary-light text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">"{q}"</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* (8) Medical Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-slate-100/90 border border-border text-xs text-ink-muted leading-relaxed print-page-break-avoid">
        <p className="font-semibold text-ink mb-1">Standard Medical Disclaimer:</p>
        <p>{report.disclaimer || MANDATORY_DISCLAIMER}</p>
      </div>

      {/* (9) Bottom Action Buttons */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-12 action-buttons">
        <Button
          size="lg"
          onClick={onReset}
          variant="primary"
          leftIcon={<RotateCcw className="w-5 h-5" />}
        >
          Analyze Another Blood Report
        </Button>
        <Button
          size="lg"
          onClick={handlePrint}
          variant="outline"
          leftIcon={<Printer className="w-5 h-5 text-ink-muted" />}
        >
          Print / Save Summary as PDF
        </Button>
      </div>
    </div>
  );
};
