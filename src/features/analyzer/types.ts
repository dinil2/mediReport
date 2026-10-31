import { z } from 'zod';

export type StatusLevel = 'low' | 'normal' | 'high' | 'critical';
export type OverallStatus = 'good' | 'attention' | 'urgent';
export type SupportedLanguage = 'en' | 'si' | 'ta';

export interface ParameterData {
  name: string;
  plainName: string;
  value: string;
  unit: string;
  normalRange: string;
  status: StatusLevel;
  difference: string;
  whatItMeans: string;
  possibleCauses: string[];
  howToImprove: string[];
  askYourDoctor: string[];
}

export interface PatientContext {
  age?: string;
  gender?: string;
  isAgeCalibrated?: boolean;
}

export interface ReportSuccess {
  isReport: true;
  overallSummary: string;
  overallStatus: OverallStatus;
  parameters: ParameterData[];
  topPriorities: string[];
  whenToSeeDoctorUrgently: string[];
  disclaimer: string;
  patientContext?: PatientContext;
}

export interface ReportRejected {
  isReport: false;
  reason: string;
}

export type ReportAnalysisResult = ReportSuccess | ReportRejected;

export const ParameterDataSchema = z.object({
  name: z.string(),
  plainName: z.string().default('Laboratory Biomarker'),
  value: z.string(),
  unit: z.string().default(''),
  normalRange: z.string().default('Range not shown on report'),
  status: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  difference: z.string().default('Within normal limits'),
  whatItMeans: z.string().default('Biomarker measured in blood sample.'),
  possibleCauses: z.array(z.string()).default([]),
  howToImprove: z.array(z.string()).default([]),
  askYourDoctor: z.array(z.string()).default([]),
});

export const PatientContextSchema = z.object({
  age: z.string().optional(),
  gender: z.string().optional(),
  isAgeCalibrated: z.boolean().optional().default(true),
});

export const ReportAnalysisResultSchema = z.discriminatedUnion('isReport', [
  z.object({
    isReport: z.literal(false),
    reason: z.string().default('Could not recognize as a blood test report.'),
  }),
  z.object({
    isReport: z.literal(true),
    overallSummary: z.string().default('Summary of blood test report.'),
    overallStatus: z.enum(['good', 'attention', 'urgent']).default('attention'),
    parameters: z.array(ParameterDataSchema),
    topPriorities: z.array(z.string()).default([]),
    whenToSeeDoctorUrgently: z.array(z.string()).default([]),
    disclaimer: z.string().optional().default('Educational AI explanation only. Always consult your doctor.'),
    patientContext: PatientContextSchema.optional(),
  }),
]);

