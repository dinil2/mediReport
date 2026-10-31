import { ReportSuccess, SupportedLanguage } from '../features/analyzer/types';

export const LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

export const MANDATORY_DISCLAIMER =
  'This is an AI-generated explanation for learning only. It is not medical advice and can make mistakes. Always consult a qualified doctor.';

export const SAMPLE_REPORT: ReportSuccess = {
  isReport: true,
  overallSummary:
    'Your routine blood work is mostly in good order, but two key numbers need your attention. Your Hemoglobin is slightly below the normal range, indicating mild anemia which may explain feelings of tiredness. Additionally, your Fasting Blood Sugar is slightly elevated, suggesting early pre-diabetes that can often be reversed with targeted nutrition and daily walks. Your kidney and liver markers look healthy.',
  overallStatus: 'attention',
  topPriorities: [
    'Boost dietary iron with leafy greens, lentils, and vitamin C to improve your red blood cells.',
    'Reduce refined sugars and white bread to bring fasting blood glucose back into the normal zone.',
    'Schedule a non-urgent check-in with your general physician to discuss follow-up testing in 3 months.',
  ],
  parameters: [
    {
      name: 'Hemoglobin (Hb)',
      plainName: 'Hemoglobin = the protein in red blood cells that carries oxygen across your body',
      value: '11.2',
      unit: 'g/dL',
      normalRange: '12.0 - 15.5 g/dL',
      status: 'low',
      difference: '0.8 g/dL below the healthy minimum',
      whatItMeans:
        'Hemoglobin carries oxygen from your lungs to your muscles and brain. When it is slightly low, your tissues receive slightly less oxygen, which can cause subtle fatigue or dizziness when standing quickly.',
      possibleCauses: [
        'Insufficient iron or folate intake in daily diet',
        'Recent menstrual blood loss in females',
        'Mild digestive malabsorption',
      ],
      howToImprove: [
        'Increase iron-rich foods: spinach, lentils (dhal), eggs, lean poultry, and beans.',
        'Pair iron foods with Vitamin C (citrus, lime, guava) to multiply iron absorption by up to 3x.',
        'Avoid drinking black tea or coffee immediately with meals, as tannins block iron uptake.',
      ],
      askYourDoctor: [
        'Should we check my Serum Ferritin (iron storage) levels?',
        'Would a short course of oral iron supplements be appropriate for me?',
      ],
    },
    {
      name: 'Fasting Blood Sugar (FBS)',
      plainName: 'Fasting Blood Sugar = the amount of glucose circulating in your bloodstream after an overnight fast',
      value: '108',
      unit: 'mg/dL',
      normalRange: '70 - 99 mg/dL',
      status: 'high',
      difference: '9 mg/dL above normal range',
      whatItMeans:
        'This measures your baseline blood sugar after at least 8 hours without food. A level between 100 and 125 mg/dL indicates impaired fasting glucose (pre-diabetes). Your body is producing insulin, but your cells are becoming slightly resistant.',
      possibleCauses: [
        'High intake of refined carbohydrates, sugary drinks, or white rice',
        'Sedentary lifestyle or lack of muscle resistance exercise',
        'Chronic stress or inadequate sleep',
      ],
      howToImprove: [
        'Switch from white refined carbs to whole grains (red rice, oats, whole wheat).',
        'Take a 10 to 15-minute brisk walk immediately following your largest meal of the day.',
        'Prioritize 7-8 hours of continuous sleep to regulate morning cortisol and insulin sensitivity.',
      ],
      askYourDoctor: [
        'Would you recommend an HbA1c test to see my average 3-month blood sugar?',
        'What target blood sugar should I aim for over the next 90 days?',
      ],
    },
    {
      name: 'Total Cholesterol',
      plainName: 'Total Cholesterol = total waxy fats circulating in your bloodstream',
      value: '184',
      unit: 'mg/dL',
      normalRange: '125 - 200 mg/dL',
      status: 'normal',
      difference: 'Well within optimal limits (16 mg/dL safety buffer)',
      whatItMeans:
        'Your overall blood fat level is within a healthy range, which supports cell membranes and hormone production without excessive plaque formation risk.',
      possibleCauses: ['Balanced dietary fats and active metabolism'],
      howToImprove: [
        'Maintain healthy fats from olive oil, avocados, nuts, and fish.',
        'Continue regular cardiovascular physical activity.',
      ],
      askYourDoctor: [
        'Is my LDL (bad cholesterol) and HDL (good cholesterol) ratio equally balanced?',
      ],
    },
    {
      name: 'Platelet Count',
      plainName: 'Platelets = tiny cell fragments responsible for normal blood clotting',
      value: '265',
      unit: '10^3/uL',
      normalRange: '150 - 450 10^3/uL',
      status: 'normal',
      difference: 'Comfortably in the middle of normal range',
      whatItMeans:
        'Your blood has an adequate supply of clotting cells to repair minor tissue wounds and prevent unexpected bleeding.',
      possibleCauses: ['Healthy bone marrow function'],
      howToImprove: [
        'Maintain general hydration and nutrient-dense balanced nutrition.',
      ],
      askYourDoctor: [
        'No follow-up needed for platelets based on this test.',
      ],
    },
  ],
  whenToSeeDoctorUrgently: [
    'Sudden severe shortness of breath or persistent chest discomfort',
    'Extreme lightheadedness, fainting spells, or blackouts',
    'Signs of active bleeding such as dark black stools or frequent unexplained bruising',
  ],
  disclaimer: MANDATORY_DISCLAIMER,
};

export const FAQ_ITEMS = [
  {
    question: 'How accurate is the AI explanation of my lab report?',
    answer:
      'MediReport AI uses advanced vision models to read the numbers and reference ranges directly printed on your report. It is calibrated specifically for educational understanding and explains findings in plain language. However, AI can misread blurry scans and cannot account for your personal medical history. It should always be verified with your physician.',
  },
  {
    question: 'Is my medical report saved or shared with third parties?',
    answer:
      'Never. Your privacy is absolute. The image is processed in-memory directly during your request and is immediately discarded. We do not store your report, we do not build health profiles, and we never share your data with advertisers or third parties.',
  },
  {
    question: 'What types of reports can I upload?',
    answer:
      'You can upload Full Blood Count (FBC / CBC), Lipid Profiles, Liver Function Tests (LFT), Renal Function Tests (KFT / RFT), Fasting Blood Sugar (FBS / HbA1c), Thyroid panels (TSH), and standard urine routine reports in JPG, PNG, WebP, or single-page PDF formats.',
  },
  {
    question: 'What if my report contains numbers outside normal ranges?',
    answer:
      'The platform highlights any values that sit above or below your laboratory’s reference range in clear amber or red cards. We explain what that parameter does in simple terms, potential everyday lifestyle or dietary reasons, and practical questions you can bring to your next doctor appointment.',
  },
  {
    question: 'Can this replace a consultation with my doctor?',
    answer:
      'No. MediReport AI is designed to empower you with health literacy so you feel informed and prepared for your doctor visit. Only a licensed physician can diagnose conditions, review your physical symptoms, and prescribe treatment plans.',
  },
  {
    question: 'Does this service cost anything?',
    answer:
      'MediReport AI is completely free for everyday patients worldwide. We built this tool to break down the language barrier in healthcare and help people take proactive control of their well-being.',
  },
];

