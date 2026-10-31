import { useState, useRef, useCallback, useEffect } from 'react';
import { analyzeBloodReport, ApiError } from '../../../lib/api';
import { ReportAnalysisResult, SupportedLanguage } from '../types';
import { SAMPLE_REPORT } from '../../../lib/constants';

const COOLDOWN_SECONDS = 10;

export function useAnalyze() {
  const [result, setResult] = useState<ReportAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastAnalysisTimeRef = useRef<number>(0);

  // Manage cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const analyze = useCallback(
    async (
      imageDataUrl: string,
      language: SupportedLanguage = 'en',
      patientData?: { age?: string; gender?: string }
    ) => {
      // Check cooldown
      const now = Date.now();
      const elapsed = Math.floor((now - lastAnalysisTimeRef.current) / 1000);
      if (elapsed < COOLDOWN_SECONDS && lastAnalysisTimeRef.current > 0) {
        const remaining = COOLDOWN_SECONDS - elapsed;
        setCooldownRemaining(remaining);
        setError(`Please wait ${remaining} seconds before analyzing another report.`);
        return;
      }

      // Abort previous call if active
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const data = await analyzeBloodReport(
          imageDataUrl,
          language,
          abortControllerRef.current.signal,
          patientData
        );

        lastAnalysisTimeRef.current = Date.now();
        setCooldownRemaining(COOLDOWN_SECONDS);
        setResult(data);
      } catch (err: unknown) {
        if (err instanceof ApiError && err.code === 'ABORTED') {
          return;
        }
        if (err instanceof ApiError && err.code === 'RATE_LIMIT') {
          setCooldownRemaining(err.retryAfter || 25);
        }
        const message = err instanceof Error ? err.message : 'Failed to analyze report.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadSampleReport = useCallback(() => {
    setError(null);
    setResult(SAMPLE_REPORT);
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    analyze,
    loadSampleReport,
    reset,
    result,
    isLoading,
    error,
    cooldownRemaining,
  };
}

