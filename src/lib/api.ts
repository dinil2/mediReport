import { ReportAnalysisResult, ReportAnalysisResultSchema, SupportedLanguage } from '../features/analyzer/types';

export class ApiError extends Error {
  code?: string;
  retryAfter?: number;
  constructor(message: string, code?: string, retryAfter?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export async function analyzeBloodReport(
  imageDataUrl: string,
  language: SupportedLanguage = 'en',
  signal?: AbortSignal,
  patientData?: { age?: string; gender?: string }
): Promise<ReportAnalysisResult> {
  const endpoint = '/.netlify/functions/analyze';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({
        image: imageDataUrl,
        language,
        age: patientData?.age,
        gender: patientData?.gender,
      }),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        responseData?.error ||
        (response.status === 429
          ? 'Our free AI is currently busy. Please wait a moment and try again.'
          : 'Failed to analyze report. Please try again.');
      throw new ApiError(errorMessage, responseData?.code, responseData?.retryAfter);
    }

    if (!responseData) {
      throw new ApiError('Empty response received from analysis server.');
    }

    // Validate structure with Zod
    const parsed = ReportAnalysisResultSchema.safeParse(responseData);
    if (!parsed.success) {
      console.warn('API returned unexpected schema:', parsed.error);
      // If server returned a partial or custom format, make sure we don't crash
      if (typeof responseData === 'object' && responseData !== null && 'isReport' in responseData) {
        return responseData as ReportAnalysisResult;
      }
      throw new ApiError('The response received could not be parsed into a valid report.');
    }

    return parsed.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new ApiError('Analysis request was cancelled.', 'ABORTED');
      }
      throw new ApiError(err.message);
    }
    throw new ApiError('An unexpected network error occurred.');
  }
}

