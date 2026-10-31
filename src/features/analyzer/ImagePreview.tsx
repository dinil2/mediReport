import React from 'react';
import { Trash2, ArrowRight, ShieldCheck, AlertCircle, Globe2, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProcessedImage } from './hooks/useImageCompress';
import { SupportedLanguage } from './types';
import { LANGUAGES } from '../../lib/constants';

interface ImagePreviewProps {
  image: ProcessedImage;
  onClear: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  patientAge?: string;
  onPatientAgeChange?: (age: string) => void;
  patientGender?: string;
  onPatientGenderChange?: (gender: string) => void;
  cooldownRemaining?: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onClear,
  onAnalyze,
  isLoading,
  selectedLanguage,
  onLanguageChange,
  patientAge = '',
  onPatientAgeChange,
  patientGender = '',
  onPatientGenderChange,
  cooldownRemaining = 0,
}) => {
  return (
    <div className="w-full bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-soft">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Thumbnail & Image Details */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-[3/4] max-h-[420px] rounded-2xl overflow-hidden border border-border bg-slate-100 shadow-soft-sm group">
            <img
              src={image.dataUrl}
              alt="Uploaded blood report preview"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
          </div>

          <div className="w-full mt-3 flex items-center justify-between text-xs text-ink-muted px-1">
            <span>{image.file.name}</span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-ink">
              {image.compressedSizeFormatted}
            </span>
          </div>
        </div>

        {/* Configuration & Action Area */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary-900 border border-teal-200">
                Ready for AI Translation
              </span>

              {/* Remove / Change Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClear}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                  aria-label="Remove uploaded report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            <h3 className="font-heading font-bold text-2xl text-ink mb-2">
              Ready to understand your report
            </h3>
            <p className="text-ink-muted text-sm leading-relaxed mb-6">
              Our vision AI will read all printed parameters, identify values outside your lab's reference range, and translate complex terms into friendly, plain-language guidance.
            </p>

            {/* Language Selector */}
            <div className="bg-slate-50 border border-border/80 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-ink flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-primary" />
                  <span>Select Explanation Language:</span>
                </label>
                <span className="text-[11px] text-ink-muted">AI quality varies by language</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onLanguageChange(lang.code)}
                      disabled={isLoading}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white shadow-soft font-semibold'
                          : 'border-border bg-surface text-ink hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm font-bold">{lang.nativeLabel}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-ink-muted'}`}>
                        {lang.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Patient Demographic Context */}
            <div className="bg-slate-50 border border-border/80 rounded-2xl p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-ink flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" />
                  <span>Patient Profile (Optional):</span>
                </label>
                <span className="text-[11px] text-ink-muted">Age-specific evaluation</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Laboratories calibrate normal ranges based on age and sex. You can enter yours below or let our AI automatically detect it from your report header.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="patient-age-input" className="block text-xs font-medium text-ink-muted mb-1">
                    Age (in years)
                  </label>
                  <input
                    id="patient-age-input"
                    type="number"
                    min="0"
                    max="125"
                    placeholder="e.g. 20 (or auto)"
                    value={patientAge}
                    onChange={(e) => onPatientAgeChange?.(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-ink"
                  />
                </div>
                <div>
                  <label htmlFor="patient-gender-select" className="block text-xs font-medium text-ink-muted mb-1">
                    Biological Sex
                  </label>
                  <select
                    id="patient-gender-select"
                    value={patientGender}
                    onChange={(e) => onPatientGenderChange?.(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-ink"
                  >
                    <option value="">Auto-detect from report</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clarity Check Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Check before continuing:</strong> Make sure the test names and reference ranges are clearly legible in the preview. Blurry photos may lead to missed readings.
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-border space-y-3">
            <Button
              size="lg"
              className="w-full text-base font-bold shadow-soft-lg"
              onClick={onAnalyze}
              isLoading={isLoading}
              disabled={cooldownRemaining > 0}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {cooldownRemaining > 0
                ? `Please wait ${cooldownRemaining}s (Cooldown)`
                : 'Explain My Blood Test in Plain Words'}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-ink-muted">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Strict privacy: Your report is processed ephemerally and never saved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
