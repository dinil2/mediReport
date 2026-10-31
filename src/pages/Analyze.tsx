import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, RotateCcw, Sparkles, FileQuestion } from 'lucide-react';
import { UploadZone } from '../features/analyzer/UploadZone';
import { ImagePreview } from '../features/analyzer/ImagePreview';
import { LoadingState } from '../features/analyzer/LoadingState';
import { ResultView } from '../features/analyzer/ResultView';
import { useImageCompress } from '../features/analyzer/hooks/useImageCompress';
import { useAnalyze } from '../features/analyzer/hooks/useAnalyze';
import { SupportedLanguage } from '../features/analyzer/types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Analyze: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('');

  const {
    processFile,
    clearImage,
    processedImage,
    isProcessing: isCompressing,
    error: compressError,
  } = useImageCompress();

  const {
    analyze,
    loadSampleReport,
    reset,
    result,
    isLoading: isAnalyzing,
    error: analyzeError,
    cooldownRemaining,
  } = useAnalyze();

  // If ?demo=true is in URL, auto-load sample report
  useEffect(() => {
    if (searchParams.get('demo') === 'true' && !result && !processedImage) {
      loadSampleReport();
    }
  }, [searchParams, result, processedImage, loadSampleReport]);

  const handleFileSelect = (file: File) => {
    processFile(file);
  };

  const handleStartAnalysis = () => {
    if (!processedImage) return;
    analyze(processedImage.dataUrl, language, {
      age: patientAge.trim() || undefined,
      gender: patientGender || undefined,
    });
  };

  const handleFullReset = () => {
    clearImage();
    reset();
  };

  const isWorking = isCompressing || isAnalyzing;
  const activeError = compressError || analyzeError;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 md:py-8">
      {/* Page Title & Instructions Header (hidden during print or if result shown) */}
      {!result && (
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">
            Analyze Your Blood Test Report
          </h1>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed">
            Upload a clear photo or single-page PDF of your laboratory report. We will translate all numbers and clinical abbreviations into plain, easy-to-understand insights.
          </p>
        </div>
      )}

      {/* Global Error Banner */}
      {activeError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3 shadow-soft animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">Notice:</h4>
            <p className="mt-0.5">{activeError}</p>
          </div>
          <button
            type="button"
            onClick={() => handleFullReset()}
            className="text-xs font-semibold text-red-700 underline hover:text-red-900"
          >
            Clear
          </button>
        </div>
      )}

      {/* VIEW STATE 1: Loading State */}
      {isAnalyzing && <LoadingState />}

      {/* VIEW STATE 2: Completed Success Result */}
      {!isAnalyzing && result && result.isReport && (
        <ResultView report={result} onReset={handleFullReset} />
      )}

      {/* VIEW STATE 3: Document Rejected (Not a recognized blood report) */}
      {!isAnalyzing && result && !result.isReport && (
        <Card padding="lg" className="border-2 border-amber-200 bg-amber-50/40 text-center max-w-xl mx-auto p-8 space-y-5 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-amber-950">
            Could Not Verify Blood Test Report
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            {result.reason ||
              'The uploaded image does not appear to be a readable medical laboratory report or blood test document. Please make sure the document is well-lit, sharp, and clearly displays test names and normal reference ranges.'}
          </p>
          <div className="pt-2">
            <Button
              size="md"
              variant="primary"
              onClick={handleFullReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Try Uploading Another Clear Photo
            </Button>
          </div>
        </Card>
      )}

      {/* VIEW STATE 4: Uploading & Staging */}
      {!isAnalyzing && !result && (
        <div className="space-y-6">
          {!processedImage ? (
            <div className="space-y-6">
              <UploadZone onFileSelect={handleFileSelect} isProcessing={isCompressing} />

              {/* Quick Sample Demo Button */}
              <div className="text-center pt-2">
                <span className="text-xs text-ink-muted block mb-2">Don't have a report photo on hand right now?</span>
                <button
                  type="button"
                  onClick={loadSampleReport}
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-primary hover:text-primary-hover px-4 py-2 rounded-xl bg-primary-light/50 border border-teal-200/80 transition-all hover:shadow-soft-sm"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Try With A Sample Blood Test Report</span>
                </button>
              </div>
            </div>
          ) : (
            <ImagePreview
              image={processedImage}
              onClear={clearImage}
              onAnalyze={handleStartAnalysis}
              isLoading={isWorking}
              selectedLanguage={language}
              onLanguageChange={setLanguage}
              patientAge={patientAge}
              onPatientAgeChange={setPatientAge}
              patientGender={patientGender}
              onPatientGenderChange={setPatientGender}
              cooldownRemaining={cooldownRemaining}
            />
          )}
        </div>
      )}
    </div>
  );
};
