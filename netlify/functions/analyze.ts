import type { Handler, HandlerEvent } from '@netlify/functions';
import { z } from 'zod';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const MANDATORY_DISCLAIMER =
  'This is an AI-generated explanation for learning only. It is not medical advice and can make mistakes. Always consult a qualified doctor.';

// Input Request Schema
const RequestSchema = z.object({
  image: z
    .string()
    .min(100, 'Image data is too short')
    .max(10 * 1024 * 1024, 'Image size exceeds maximum limit of 8MB')
    .refine(
      (val) => /^data:image\/(jpeg|png|webp);base64,/.test(val),
      'Image must be a valid JPEG, PNG, or WebP base64 data URL'
    ),
  language: z.enum(['en', 'si', 'ta']).default('en'),
  age: z.string().optional(),
  gender: z.string().optional(),
});

const PatientContextSchema = z.object({
  age: z.string().optional(),
  gender: z.string().optional(),
  isAgeCalibrated: z.boolean().default(true),
});

// Output Parameter Schema
const ParameterSchema = z.object({
  name: z.string(),
  plainName: z.string().default('Laboratory Biomarker'),
  value: z.union([z.string(), z.number()]).transform((v) => String(v)),
  unit: z.string().default(''),
  normalRange: z.string().default('Range not shown on report'),
  status: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  difference: z.string().default('Within normal limits'),
  whatItMeans: z.string().default('Biomarker measured in blood sample.'),
  possibleCauses: z.array(z.string()).default([]),
  howToImprove: z.array(z.string()).default([]),
  askYourDoctor: z.array(z.string()).default([]),
});

// Full Output Schema
const ReportAnalysisSchema = z.discriminatedUnion('isReport', [
  z.object({
    isReport: z.literal(false),
    reason: z.string().default('Could not verify as a medical laboratory report.'),
  }),
  z.object({
    isReport: z.literal(true),
    overallSummary: z.string().default('Here is the summary of your blood test report.'),
    overallStatus: z.enum(['good', 'attention', 'urgent']).default('attention'),
    parameters: z.array(ParameterSchema).min(1),
    topPriorities: z.array(z.string()).default([]),
    whenToSeeDoctorUrgently: z.array(z.string()).default([]),
    disclaimer: z.string().optional().default(MANDATORY_DISCLAIMER),
    patientContext: PatientContextSchema.optional(),
  }),
]);

export type ReportAnalysis = z.infer<typeof ReportAnalysisSchema>;

type Lang = 'en' | 'si' | 'ta';

interface BiomarkerDetail {
  plain: Record<Lang, string>;
  meaning: Record<Lang, string>;
  low?: {
    causes: Record<Lang, string[]>;
    tips: Record<Lang, string[]>;
    doctorQuestion: Record<Lang, string[]>;
  };
  high?: {
    causes: Record<Lang, string[]>;
    tips: Record<Lang, string[]>;
    doctorQuestion: Record<Lang, string[]>;
  };
}

// Embedded Medical Knowledge Base (English, Sinhala, Tamil)
const BIOMARKER_KNOWLEDGE: Record<string, BiomarkerDetail> = {
  // Complete Blood Count (CBC)
  haemoglobin: {
    plain: {
      en: 'Oxygen-Carrying Protein (Haemoglobin)',
      si: 'ඔක්සිජන් පරිවහනය කරන ප්‍රෝටීනය (හිමොග්ලොබින්)',
      ta: 'ஆக்சிஜன் சுமந்து செல்லும் புரதம் (ஹீமோகுளோபின்)',
    },
    meaning: {
      en: 'The vital protein in red blood cells that transports oxygen from your lungs to the entire body.',
      si: 'පෙනහළු වල සිට මුළු සිරුර පුරා ඔක්සිජන් ගෙන යන රතු රුධිර සෛලවල ඇති ප්‍රධාන ප්‍රෝටීනය.',
      ta: 'நுரையீரலில் இருந்து உடல் முழுவதும் ஆக்சிஜனை எடுத்துச் செல்லும் முக்கியமான புரதம்.',
    },
    low: {
      causes: {
        en: ['Iron deficiency anemia', 'Blood loss or heavy menstruation', 'Vitamin B12 or folate deficiency', 'Chronic kidney disease'],
        si: ['යකඩ ඌනතා රක්තහීනතාවය (ලේ අඩුකම)', 'රුධිර වහනය වීම', 'විටමින් B12 හෝ ෆෝලික් අම්ල ඌනතාවය'],
        ta: ['இரும்புச்சத்து குறைபாடு இரத்த சோகை', 'வைட்டமின் B12 குறைபாடு', 'இரத்த இழப்பு'],
      },
      tips: {
        en: ['Eat iron-dense foods: lentils (dhal), spinach, dark greens, beans, eggs, fish', 'Combine iron foods with vitamin C (lime, oranges) for maximum absorption', 'Consult your doctor for serum ferritin and full anemia evaluation'],
        si: ['යකඩ බහුල ආහාර ගන්න: පරිප්පු, නිවිති, කොළ මැල්ලුම්, බෝංචි, බිත්තර, මාළු', 'යකඩ අවශෝෂණයට දෙහි හෝ දොඩම් වැනි විටමින් C එකතු කරන්න', 'වෛද්‍යවරයා හමුවී අවශ්‍ය නම් යකඩ ඌනතාව සඳහා උපදෙස් ලබාගන්න'],
        ta: ['பருப்பு, கீரை, முட்டை, மீன் போன்ற இரும்புச்சத்து உணவுகளை உண்ணுங்கள்', 'வைட்டமின் சி உணவுகளுடன் சேர்த்து உட்கொள்ளுங்கள்'],
      },
      doctorQuestion: {
        en: ['What type of anemia is causing my low hemoglobin? Should we check my iron stores?'],
        si: ['මගේ හිමොග්ලොබින් අඩුවීමට හේතුව කුමක්ද? මට යකඩ ඌනතාවක් තිබේද?'],
        ta: ['எனது ஹீமோகுளோபின் குறைவாக இருப்பதற்கு காரணம் என்ன?'],
      },
    },
    high: {
      causes: {
        en: ['Dehydration or low fluid intake', 'Smoking or chronic respiratory conditions', 'Living at high altitude'],
        si: ['සිරුරේ ජලය අඩුවීම (dehydration)', 'දුම්පානය හෝ ශ්වසන අපහසුතා'],
        ta: ['நீரிழப்பு (தண்ணீர் பற்றாக்குறை)', 'புகைபிடித்தல்'],
      },
      tips: {
        en: ['Drink plenty of water (2-2.5 liters daily)', 'Avoid smoking and excessive dry heat exposure'],
        si: ['දිනකට ප්‍රමාණවත් තරම් පිරිසිදු වතුර (ලීටර් 2-2.5ක්) පානය කරන්න', 'දුම්පානයෙන් වළකින්න'],
        ta: ['தினசரி போதுமான தண்ணீர் குடிக்கவும்'],
      },
      doctorQuestion: {
        en: ['Could dehydration have caused this elevated hemoglobin?'],
        si: ['ශරීරයේ ජලය අඩු වීම නිසා හිමොග්ලොබින් වැඩි විය හැකිද?'],
        ta: ['நீரிழப்பினால் இந்த அளவு அதிகரித்ததா?'],
      },
    },
  },
  totalleucocytecount: {
    plain: {
      en: 'Total White Blood Cells (Infection Defense)',
      si: 'සමස්ත සුදු රුධිරාණු (ආසාදන ආරක්ෂාව)',
      ta: 'மொத்த வெள்ளை இரத்த அணுக்கள் (நோய் எதிர்ப்பு)',
    },
    meaning: {
      en: 'Your body’s primary immune defense cells that protect you against infections.',
      si: 'විෂබීජ සහ විවිධ ආසාදන වලට එරෙහිව සටන් කරන ප්‍රධාන ප්‍රතිශක්තිකරණ සෛල.',
      ta: 'உடலில் தொற்றுகளை எதிர்த்துப் போராடும் நோய் எதிர்ப்பு செல்கள்.',
    },
    low: {
      causes: {
        en: ['Recent viral infection', 'Certain medications', 'Bone marrow condition or severe deficiency'],
        si: ['මෑතකදී වැළඳුනු වයිරස් ආසාදනයක්', 'ඖෂධ ප්‍රතික්‍රියා', 'ප්‍රතිශක්තිය දුර්වල වීම'],
        ta: ['சமீபத்திய வைரஸ் தொற்று', 'நோய் எதிர்ப்பு குறைவு'],
      },
      tips: {
        en: ['Practice good hand hygiene and avoid crowded places while recovering', 'Eat immune-supportive protein and nutrient-rich whole foods'],
        si: ['ආසාදන වලින් ආරක්ෂා වීමට දෑත් පිරිසිදුව තබාගන්න', 'පෝෂ්‍යදායී සමබල ආහාර ගන්න'],
        ta: ['சுத்தமான சுகாதாரத்தை கடைபிடிக்கவும்'],
      },
      doctorQuestion: {
        en: ['Does my low WBC count require a follow-up test after recovering from viral illness?'],
        si: ['මගේ සුදු රුධිරාණු අඩුවීම ගැන තවදුරටත් පරීක්ෂා කළ යුතුද?'],
        ta: ['குறைந்த வெள்ளை அணுக்களுக்கு மீண்டும் பரிசோதனை தேவையா?'],
      },
    },
    high: {
      causes: {
        en: ['Active bacterial or viral infection', 'Bodily inflammation or tissue injury', 'Physical or emotional stress'],
        si: ['බැක්ටීරියා හෝ වයිරස් ආසාදනයක්', 'ශරීරයේ යම් දැවිල්ලක් හෝ තුවාලයක්', 'දැඩි තෙහෙට්ටුව'],
        ta: ['பாக்டீரியா அல்லது வைரஸ் தொற்று', 'உடல் அழற்சி'],
      },
      tips: {
        en: ['Get plenty of restorative rest and stay well hydrated', 'Monitor for symptoms like fever, chills, cough, or pain and see a doctor'],
        si: ['හොඳින් විවේක ගන්න සහ දියර වර්ග පානය කරන්න', 'උණ හෝ වෙනත් අපහසුතා ඇත්නම් වෛද්‍යවරයකු හමුවන්න'],
        ta: ['நன்றாக ஓய்வெடுக்கவும், காய்ச்சல் உள்ளதா என கவனிக்கவும்'],
      },
      doctorQuestion: {
        en: ['Could an active infection or inflammation be causing this elevated white cell count?'],
        si: ['මෙම සුදු රුධිරාණු වැඩිවීමට කිසියම් ආසාදනයක් හේතු වී තිබේද?'],
        ta: ['இந்த அதிகரிப்புக்கு ஏதேனும் தொற்று காரணமா?'],
      },
    },
  },
  neutrophils: {
    plain: {
      en: 'Neutrophils (Bacterial Defense)',
      si: 'නියුට්‍රොෆිල්ස් (බැක්ටීරියා විනාශක සෛල)',
      ta: 'நியூட்ரோபில்கள் (பாக்டீரியா எதிர்ப்பு)',
    },
    meaning: {
      en: 'The frontline white blood cells that specifically fight bacterial infections.',
      si: 'බැක්ටීරියා ආසාදන වලට එරෙහිව ප්‍රධාන වශයෙන් සටන් කරන සුදු රුධිර සෛල.',
      ta: 'பாக்டீரியா தொற்றுகளை எதிர்த்து போராடும் முன்னணி செல்கள்.',
    },
  },
  lymphocytes: {
    plain: {
      en: 'Lymphocytes (Viral & Antibody Defense)',
      si: 'ලිම්ෆොසයිට්ස් (වයිරස නාශක සෛල)',
      ta: 'லிம்போசைட்டுகள் (வைரஸ் எதிர்ப்பு)',
    },
    meaning: {
      en: 'White blood cells that produce protective antibodies and fight viral infections.',
      si: 'ප්‍රතිදේහ නිපදවමින් වයිරස ආසාදන වලට එරෙහිව ක්‍රියා කරන සෛල.',
      ta: 'வைரஸ் தொற்றுகளை எதிர்க்கும் நோய் எதிர்ப்பு செல்கள்.',
    },
  },
  eosinophils: {
    plain: {
      en: 'Eosinophils (Allergy & Parasite Cells)',
      si: 'ඉයොසිනොෆිල්ස් (ආසාත්මිකතා ප්‍රතිචාර සෛල)',
      ta: 'ஈசினோபில்கள் (ஒவ்வாமை செல்கள்)',
    },
    meaning: {
      en: 'White blood cells involved in allergy responses, asthma, skin reactions, and parasitic defense.',
      si: 'ආසාත්මිකතා (allergies), ඇදුම සහ පරපෝෂිතයන්ට එරෙහිව ක්‍රියා කරන සෛල.',
      ta: 'ஒவ்வாமை மற்றும் ஒட்டுண்ணிகளுக்கு எதிராக செயல்படும் செல்கள்.',
    },
    high: {
      causes: {
        en: ['Allergies (eczema, allergic rhinitis, asthma)', 'Parasitic or worm exposure', 'Drug reactions'],
        si: ['ආසාත්මිකතා (පීනස, ඇදුම, සමේ කැසීම්)', 'පණු ආසාදන', 'ඖෂධ ආසාත්මිකතා'],
        ta: ['ஒவ்வாமை (தோல் அரிப்பு, ஆஸ்துமா)', 'புழு தொற்று'],
      },
      tips: {
        en: ['Identify and reduce known dust, pollen, or food allergen exposure', 'Discuss deworming or anti-allergy guidance with your doctor'],
        si: ['දූවිලි සහ ආසාත්මික වන ආහාර වලින් හැකිතාක් වළකින්න', 'පණු බෙහෙත් අවශ්‍යදැයි වෛද්‍යවරයාගෙන් විමසන්න'],
        ta: ['தூசி மற்றும் ஒவ்வாமை காரணிகளைத் தவிர்க்கவும்'],
      },
      doctorQuestion: {
        en: ['Could my allergic symptoms or a routine condition explain this elevated eosinophil count?'],
        si: ['මගේ ආසාත්මිකතා ලක්ෂණ නිසා මෙම අගය වැඩි විය හැකිද?'],
        ta: ['எனது ஒவ்வாமை காரணமாக இது அதிகரித்ததா?'],
      },
    },
  },
  monocytes: {
    plain: {
      en: 'Monocytes (Cellular Cleanup)',
      si: 'මොනොසයිට්ස් (අපද්‍රව්‍ය ඉවත් කරන සෛල)',
      ta: 'மோனோசைட்டுகள் (தூய்மை செல்கள்)',
    },
    meaning: {
      en: 'White blood cells that break down dead tissues and fight lingering infections.',
      si: 'මියගිය සෛල සහ විෂබීජ ඉවත් කරන සුදු රුධිර සෛල වර්ගයකි.',
      ta: 'இறந்த செல்களை அழித்து தொற்றுகளை நீக்கும் செல்கள்.',
    },
  },
  basophils: {
    plain: {
      en: 'Basophils (Inflammatory Response)',
      si: 'බේසොෆිල්ස් (දැවිල්ල පාලක සෛල)',
      ta: 'பாசோபில்கள் (அழற்சி செல்கள்)',
    },
    meaning: {
      en: 'Rare white blood cells that release histamine during allergic and inflammatory responses.',
      si: 'ආසාත්මිකතා ප්‍රතිචාර වලදී ක්‍රියාකාරී වන සෛල.',
      ta: 'ஒவ்வாமை எதிர்வினைகளில் பங்குபெறும் செல்கள்.',
    },
  },
  rbccount: {
    plain: {
      en: 'Red Blood Cell Count (RBC)',
      si: 'රතු රුධිර සෛල සංඛ්‍යාව (RBC)',
      ta: 'சிவப்பு இரத்த அணுக்களின் எண்ணிக்கை (RBC)',
    },
    meaning: {
      en: 'The total number of red blood cells circulating to carry oxygen throughout your body.',
      si: 'ශරීරය පුරා ඔක්සිජන් රැගෙන යන රතු රුධිර සෛලවල සමස්ත සංඛ්‍යාව.',
      ta: 'உடல் முழுவதும் ஆக்சிஜனை எடுத்துச் செல்லும் சிவப்பு அணுக்களின் எண்ணிக்கை.',
    },
  },
  mcv: {
    plain: {
      en: 'Red Blood Cell Size (MCV)',
      si: 'රතු රුධිර සෛල ප්‍රමාණය (MCV)',
      ta: 'சிவப்பு இரத்த அணு அளவு (MCV)',
    },
    meaning: {
      en: 'Measures the average physical volume/size of individual red blood cells.',
      si: 'ඔබේ රතු රුධිර සෛලවල සාමාන්‍ය ප්‍රමාණය මනිනු ලබයි.',
      ta: 'உங்கள் சிவப்பு இரத்த அணுக்களின் சராசரி அளவை அளவிடுகிறது.',
    },
    low: {
      causes: {
        en: ['Early mild iron deficiency', 'Thalassemia trait (common, benign inherited trait in South Asia)', 'Chronic inflammation'],
        si: ['මුල් අවධියේ යකඩ ඌනතාවය', 'තැලසීමියා ලක්ෂණය (ජානමය වශයෙන් උරුම වන සාමාන්‍ය තත්ත්වයක්)', 'නිදන්ගත දැවිල්ල'],
        ta: ['ஆரம்ப நிலை இரும்புச்சத்து குறைபாடு', 'தலசீமியா பண்பு (மரபணு பண்பு)', 'நீண்டகால அழற்சி'],
      },
      tips: {
        en: ['Include iron-dense foods: lentils (dhal), spinach, dark green leafy mallum, beans, eggs, fish', 'Combine iron foods with vitamin C (lime, oranges) to boost absorption', 'Consider asking your doctor about a serum ferritin blood test'],
        si: ['යකඩ බහුල ආහාර ගන්න: පරිප්පු, නිවිති, කොළ මැල්ලුම්, බෝංචි, බිත්තර, මාළු', 'යකඩ අවශෝෂණය වැඩි කිරීමට දෙහි හෝ දොඩම් වැනි විටමින් C සහිත ආහාර එකතු කරන්න', 'සීරම් ෆෙරිටින් (ferritin) පරීක්ෂණයක් අවශ්‍යදැයි වෛද්‍යවරයාගෙන් විමසන්න'],
        ta: ['பருப்பு, கீரைகள், முட்டை, மீன் போன்ற இரும்புச்சத்து உணவுகளை உண்ணுங்கள்', 'உறிஞ்சுதலை அதிகரிக்க எலுமிச்சை போன்ற வைட்டமின் சி உணவுகளுடன் சேர்த்துக்கொள்ளுங்கள்'],
      },
      doctorQuestion: {
        en: ['Could this slightly low MCV be early iron deficiency or a thalassemia trait? Should I check ferritin?'],
        si: ['මගේ MCV අගය මඳක් අඩු වීම යකඩ ඌනතාවක් හෝ ජානමය ලක්ෂණයක් නිසා විය හැකිද? මම ferritin පරීක්ෂණයක් කළ යුතුද?'],
        ta: ['எனது குறைந்த MCV இரும்புச்சத்து குறைபாட்டினாலா? நான் ferritin பரிசோதனை செய்ய வேண்டுமா?'],
      },
    },
    high: {
      causes: {
        en: ['Vitamin B12 or folate deficiency', 'Thyroid underactivity', 'Regular alcohol consumption'],
        si: ['විටමින් B12 හෝ ෆෝලේට් ඌනතාවය', 'තයිරොයිඩ් ක්‍රියාකාරිත්වය අඩු වීම'],
        ta: ['வைட்டமின் B12 அல்லது ஃபோலேட் குறைபாடு', 'தைராய்டு குறைபாடு'],
      },
      tips: {
        en: ['Eat vitamin B12-rich foods: dairy, eggs, fish', 'Consume dark green vegetables for natural folate', 'Discuss B12 testing with your doctor'],
        si: ['විටමින් B12 බහුල කිරි, බිත්තර, මාළු ආහාරයට ගන්න', 'කොළ පැහැති එළවළු ආහාරයට එක්කර ගන්න'],
        ta: ['வைட்டமின் B12 நிறைந்த உணவுகளை உண்ணுங்கள்'],
      },
      doctorQuestion: {
        en: ['Should I check my Vitamin B12 and folate levels to investigate this higher MCV?'],
        si: ['මගේ විටමින් B12 සහ ෆෝලික් අම්ල මට්ටම පරීක්ෂා කළ යුතුද?'],
        ta: ['வைட்டமின் B12 அளவை நான் பரிசோதிக்க வேண்டுமா?'],
      },
    },
  },
  mch: {
    plain: {
      en: 'Average Hemoglobin per Red Cell (MCH)',
      si: 'රතු සෛලයක සාමාන්‍ය හිමොග්ලොබින් ප්‍රමාණය (MCH)',
      ta: 'ஒரு சிவப்பு அணுவின் சராசரி ஹீமோகுளோபின் (MCH)',
    },
    meaning: {
      en: 'The average amount of oxygen-carrying hemoglobin contained inside each single red blood cell.',
      si: 'එක් එක් රතු රුධිර සෛලයක් තුළ අඩංගු සාමාන්‍ය හිමොග්ලොබින් ප්‍රමාණය.',
      ta: 'ஒவ்வொரு சிவப்பு இரத்த அணுவிலும் உள்ள சராசரி ஹீமோகுளோபின் அளவு.',
    },
  },
  mchc: {
    plain: {
      en: 'Hemoglobin Concentration in Red Cells (MCHC)',
      si: 'රතු සෛල තුළ හිමොග්ලොබින් සාන්ද්‍රණය (MCHC)',
      ta: 'சிவப்பு அணுக்களில் ஹீமோகுளோபின் செறிவு (MCHC)',
    },
    meaning: {
      en: 'Measures how densely packed hemoglobin is inside your red blood cells.',
      si: 'රතු රුධිර සෛල තුළ හිමොග්ලොබින් සාන්ද්‍රණය වී ඇති ආකාරය මනිනු ලබයි.',
      ta: 'சிவப்பு அணுக்களில் ஹீமோகுளோபின் எவ்வளவு செறிவூட்டப்பட்டுள்ளது என்பதை அளவிடுகிறது.',
    },
    high: {
      causes: {
        en: ['Mild dehydration during blood collection', 'Slight sample concentration or laboratory artifact', 'Hereditary spherocytosis (very rare)'],
        si: ['ලේ සාම්පලය ගන්නා විට සිරුරේ ජලය මඳක් අඩු වීම (dehydration)', 'සාමාන්‍ය රසායනාගාර සාම්පල විචල්‍යතාව'],
        ta: ['இரத்தம் எடுக்கும் போது லேசான நீரிழப்பு', 'ஆய்வக மாதிரி மாறுபாடு'],
      },
      tips: {
        en: ['Drink plenty of clean water (2-2.5 liters daily) to maintain optimal hydration', 'Isolated mild MCHC elevation is common and usually requires no major restriction'],
        si: ['දිනපතා ප්‍රමාණවත් තරම් පිරිසිදු වතුර (ලීටර් 2-2.5ක්) පානය කරන්න', 'තනිව මඳක් වැඩි වූ MCHC අගයක් සඳහා විශේෂ ආහාර සීමා අවශ්‍ය නොවේ'],
        ta: ['போதுமான அளவு தண்ணீர் குடிக்கவும்'],
      },
      doctorQuestion: {
        en: ['Could this mild MCHC elevation be due to mild dehydration when the sample was drawn?'],
        si: ['ලේ සාම්පලය ගන්නා විට ජලය අඩු වීම නිසා මෙම MCHC අගය මඳක් වැඩි විය හැකිද?'],
        ta: ['மாதிரி எடுத்தபோது ஏற்பட்ட நீரிழப்பினால் இது அதிகரித்திருக்கலாமா?'],
      },
    },
  },
  hct: {
    plain: {
      en: 'Hematocrit / Packed Cell Volume (Hct / PCV)',
      si: 'රුධිර පරිමා ප්‍රතිශතය (Hematocrit / PCV)',
      ta: 'ஹெமடோக்ரிட் (Hct)',
    },
    meaning: {
      en: 'The percentage of your total blood volume made up of red blood cells.',
      si: 'මුළු රුධිර පරිමාවෙන් රතු රුධිර සෛල සතු ප්‍රතිශතය.',
      ta: 'மொத்த இரத்தத்தில் சிவப்பு அணுக்களின் விகிதம்.',
    },
  },
  rdwcv: {
    plain: {
      en: 'Red Cell Size Variation (RDW)',
      si: 'රතු සෛල ප්‍රමාණ විචලනය (RDW)',
      ta: 'சிவப்பு அணு பரவல் அகலம் (RDW)',
    },
    meaning: {
      en: 'Measures how much your red blood cells differ from one another in size.',
      si: 'රතු රුධිර සෛල එකිනෙකට ප්‍රමාණයෙන් වෙනස් වන තරම මනිනු ලබයි.',
      ta: 'சிவப்பு அணுக்களின் அளவுகளில் உள்ள மாறுபாட்டை அளவிடுகிறது.',
    },
  },
  plateletcount: {
    plain: {
      en: 'Platelet Count (Blood Clotting Cells)',
      si: 'ප්ලේට්ලට් සංඛ්‍යාව (රුධිර කැටි ගැසීමේ සෛල)',
      ta: 'பிளேட்லெட் எண்ணிக்கை (இரத்த உறைவு செல்கள்)',
    },
    meaning: {
      en: 'Specialized blood cells that clump together to stop bleeding when you have an injury.',
      si: 'තුවාල වූ විට ලේ ගැලීම නැවැත්වීමට රුධිරය කැටි ගස්වන ප්‍රධාන සෛල.',
      ta: 'காயம் ஏற்படும் போது இரத்தக் கசிவை நிறுத்தும் இரத்த உறைவு செல்கள்.',
    },
    low: {
      causes: {
        en: ['Recent viral fever (e.g. dengue, viral infections)', 'Medication effect', 'Immune platelet destruction'],
        si: ['මෑතකදී වැළඳුනු වයිරස් උණ (උදා: ඩෙංගු හෝ සාමාන්‍ය වයිරස් උණ)', 'ඖෂධ බලපෑම්'],
        ta: ['சமீபத்திய வைரஸ் காய்ச்சல் (டெங்கு போன்றவை)', 'மருந்துகளின் விளைவு'],
      },
      tips: {
        en: ['Avoid contact sports or activities with injury risk', 'Watch for abnormal bruising, bleeding gums, or small red spots on skin', 'Seek medical review if accompanied by fever or bleeding'],
        si: ['තුවාල සිදුවිය හැකි ක්‍රියාකාරකම් වලින් වළකින්න', 'සමේ ලප, විදුරුමස් වලින් ලේ ගැලීම් ඇත්නම් වහාම වෛද්‍යවරයකු හමුවන්න'],
        ta: ['காயம் ஏற்படும் செயல்களைத் தவிர்க்கவும்'],
      },
      doctorQuestion: {
        en: ['Does my low platelet count require close monitoring or follow-up testing?'],
        si: ['මගේ ප්ලේට්ලට් අඩුවීම ගැන නැවත පරීක්ෂා කළ යුතුද?'],
        ta: ['எனது குறைந்த பிளேட்லெட்டுகளுக்கு மருத்துவ பரிசோதனை தேவையா?'],
      },
    },
    high: {
      causes: {
        en: ['Reaction to recent infection or bodily inflammation', 'Iron deficiency', 'Tissue recovery'],
        si: ['මෑතකදී ඇතිවූ ආසාදනයකට හෝ දැවිල්ලකට ශරීරයේ ප්‍රතිචාරයක්', 'යකඩ ඌනතාවය'],
        ta: ['சமீபத்திய தொற்று அல்லது அழற்சி'],
      },
      tips: {
        en: ['Stay well hydrated with clean water', 'Follow up with your doctor once the underlying infection resolves'],
        si: ['හොඳින් වතුර පානය කරන්න', 'ආසාදනය සුව වූ පසු නැවත පරීක්ෂා කරන්න'],
        ta: ['போதுமான தண்ணீர் குடிக்கவும்'],
      },
      doctorQuestion: {
        en: ['Is this reactive thrombocytosis from a recent infection?'],
        si: ['මෙම ප්ලේට්ලට් වැඩිවීම මෑතකදී වැළඳුනු ආසාදනයක් නිසා සිදුවූවක්ද?'],
        ta: ['சமீபத்திய தொற்றினால் இது அதிகரித்ததா?'],
      },
    },
  },
  mpv: {
    plain: {
      en: 'Mean Platelet Volume (Platelet Size)',
      si: 'සාමාන්‍ය ප්ලේට්ලට් ප්‍රමාණය (MPV)',
      ta: 'சராசரி பிளேட்லெட் அளவு (MPV)',
    },
    meaning: {
      en: 'Measures the average physical size of your blood-clotting platelets.',
      si: 'රුධිර කැටි ගැසීමේ ප්ලේට්ලට් සෛලවල සාමාන්‍ය ප්‍රමාණය මනිනු ලබයි.',
      ta: 'இரத்த உறைவு செல்களின் சராசரி அளவை அளவிடுகிறது.',
    },
  },
};

// Standard Reference Intervals for clinical sanity checks
const STANDARD_CBC_RANGES: Record<string, { min: number; max: number }> = {
  haemoglobin: { min: 13, max: 17 },
  totalleucocytecount: { min: 4000, max: 10000 },
  neutrophils: { min: 40, max: 80 },
  lymphocytes: { min: 20, max: 40 },
  eosinophils: { min: 1, max: 6 },
  monocytes: { min: 2, max: 10 },
  basophils: { min: 0, max: 1 },
  absoluteneutrophils: { min: 1000, max: 7000 },
  absolutelymphocytes: { min: 1000, max: 3000 },
  absoluteeosinophils: { min: 20, max: 500 },
  absolutemonocytes: { min: 200, max: 1000 },
  rbccount: { min: 4.5, max: 5.5 },
  mcv: { min: 81, max: 101 },
  mch: { min: 27, max: 32 },
  mchc: { min: 31.5, max: 34.5 },
  hct: { min: 40, max: 50 },
  rdwcv: { min: 11.6, max: 14.0 },
  plateletcount: { min: 150000, max: 410000 },
  mpv: { min: 7.5, max: 11.5 },
};

// Precise numeric comparator with clinical sanity checking
function evaluateStatusAndDifference(
  name: string,
  valStr: string,
  rangeStr: string,
  lang: Lang = 'en'
): { status: 'low' | 'normal' | 'high' | 'critical'; difference: string; cleanRange: string } {
  const cleanKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const standard = STANDARD_CBC_RANGES[cleanKey];

  const cleanValStr = valStr.replace(/,/g, '');
  const val = parseFloat(cleanValStr);
  if (isNaN(val)) {
    return {
      status: 'normal',
      difference:
        lang === 'si'
          ? 'සාමාන්‍ය පරාසය තුළ පවතී'
          : lang === 'ta'
          ? 'சாதாரண வரம்பிற்குள் உள்ளது'
          : 'Within reference range',
      cleanRange: rangeStr,
    };
  }

  // Parse range: e.g. "13 - 17", "4000 - 10000", "81 - 101", "31.5 - 34.5", "0 - 1"
  let min: number | undefined;
  let max: number | undefined;
  let activeRangeStr = rangeStr;

  const rangeMatch = rangeStr.match(/([0-9.]+)\s*-\s*([0-9.]*)/);
  if (rangeMatch && rangeMatch[1]) {
    min = parseFloat(rangeMatch[1]);
    if (rangeMatch[2]) {
      max = parseFloat(rangeMatch[2]);
    }
  }

  // Clinical verification:
  // 1. If max is missing or smaller than min (e.g. "31.5 - 3" or "81 -")
  if (min !== undefined && (max === undefined || isNaN(max) || min > max)) {
    if (standard) {
      min = standard.min;
      max = standard.max;
      activeRangeStr = `${standard.min} - ${standard.max}`;
    }
  }

  // 2. Row misalignment check: Absolute Lymphocytes (1000 - 3000) misreading eosinophils range (20 - 500)
  if (cleanKey === 'absolutelymphocytes' && max !== undefined && max < 600) {
    if (standard) {
      min = standard.min;
      max = standard.max;
      activeRangeStr = `${standard.min} - ${standard.max}`;
    }
  }

  if (min !== undefined && max !== undefined && !isNaN(min) && !isNaN(max)) {
    if (val < min) {
      const diff = (min - val).toFixed(2);
      const isCritical = min > 0 && val < min * 0.6;
      return {
        status: isCritical ? 'critical' : 'low',
        difference:
          lang === 'si'
            ? `අවම අගයට වඩා ${diff} කින් අඩුයි (${min} - ${max})`
            : lang === 'ta'
            ? `குறைந்தபட்சத்தை விட ${diff} குறைவு (${min} - ${max})`
            : `${diff} below minimum (${min} - ${max})`,
        cleanRange: activeRangeStr,
      };
    }
    if (val > max) {
      const diff = (val - max).toFixed(2);
      const isCritical = max > 0 && val > max * 1.5;
      return {
        status: isCritical ? 'critical' : 'high',
        difference:
          lang === 'si'
            ? `උපරිම අගයට වඩා ${diff} කින් වැඩියි (${min} - ${max})`
            : lang === 'ta'
            ? `அதிகபட்சத்தை விட ${diff} அதிகம் (${min} - ${max})`
            : `${diff} above maximum (${min} - ${max})`,
        cleanRange: activeRangeStr,
      };
    }
    return {
      status: 'normal',
      difference:
        lang === 'si'
          ? `නිරෝගී පරාසය තුළ පවතී (${min} - ${max})`
          : lang === 'ta'
          ? `சாதாரண வரம்பிற்குள் உள்ளது (${min} - ${max})`
          : `Healthy within range (${min} - ${max})`,
      cleanRange: activeRangeStr,
    };
  }

  // Single upper bound: "< 200", "<= 100"
  const lessMatch = rangeStr.match(/<\s*=?\s*([0-9.]+)/);
  if (lessMatch) {
    const bound = parseFloat(lessMatch[1]);
    if (val > bound) {
      const diff = (val - bound).toFixed(2);
      return {
        status: 'high',
        difference:
          lang === 'si'
            ? `උපරිම අගයට වඩා ${diff} ක් වැඩිය`
            : `${diff} above upper limit (${rangeStr})`,
        cleanRange: rangeStr,
      };
    }
    return {
      status: 'normal',
      difference: lang === 'si' ? 'සාමාන්‍ය පරාසය තුළ පවතී' : 'Within normal limits',
      cleanRange: rangeStr,
    };
  }

  return {
    status: 'normal',
    difference: lang === 'si' ? 'සාමාන්‍ය පරාසය තුළ පවතී' : 'Within normal limits',
    cleanRange: rangeStr,
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Handle preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
    };
  }

  // Check API Key
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('Missing GROQ_API_KEY environment variable');
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'AI service configuration is incomplete on the server. Please check environment settings.',
      }),
    };
  }

  // Parse & validate request body
  let parsedBody: z.infer<typeof RequestSchema>;
  try {
    const rawBody = event.body ? JSON.parse(event.body) : {};
    parsedBody = RequestSchema.parse(rawBody);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: err.errors[0]?.message || 'Invalid request payload',
        }),
      };
    }
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Malformed JSON in request body' }),
    };
  }

  const model = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  const lang: Lang = parsedBody.language || 'en';

  const langInstruction =
    lang === 'si'
      ? 'In natural Sinhala (සිංහල), write a 2-3 sentence reassuring SUMMARY and 2-3 PRIORITIES explaining the overall health findings. Keep the TESTS table names in English as printed on the report.'
      : lang === 'ta'
      ? 'In natural Tamil (தமிழ்), write a 2-3 sentence SUMMARY and PRIORITIES. Keep the TESTS table names in English as printed on the report.'
      : 'In clear, friendly plain English, write a 2-3 sentence SUMMARY and 2-3 PRIORITIES. Keep the TESTS table names in English as printed on the report.';

  const prompt = `You are an expert medical laboratory report reader.
Carefully read this laboratory blood test report image.
First, check if this is a genuine medical blood test or lab report.
If it is NOT a readable blood/lab report, output:
NOT_A_REPORT: <friendly reason>

If it IS a report:
${langInstruction}

You must scan the ENTIRE document table from top to bottom and extract EVERY single test row printed on the report into the TESTS section:
Haemoglobin, Total Leucocyte Count, Neutrophils, Lymphocytes, Eosinophils, Monocytes, Basophils, Absolute Neutrophils, Absolute Lymphocytes, Absolute Eosinophils, Absolute Monocytes, RBC Count, MCV, MCH, MCHC, Hct, RDW-CV, RDW-SD, Platelet Count, PCT, MPV, PDW, or whatever tests are present on this document.
Extract ALL rows visible on the document. Do not stop halfway!

Format:
PATIENT_AGE: <e.g. 20 or Not specified>
PATIENT_GENDER: <e.g. Male or Female or Not specified>
SUMMARY: <2-3 simple sentences>
STATUS: <good | attention | urgent>
PRIORITIES:
- <priority 1>
- <priority 2>
TESTS:
<Test Name> | <Result Value> | <Unit> | <Reference Range>

Example line:
Haemoglobin | 15 | g/dL | 13 - 17`;

  // Call Groq API with timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        temperature: 0.1,
        max_tokens: 650,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: parsedBody.image,
                },
              },
            ],
          },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      let parsedErr: { error?: { message?: string; code?: string } } = {};
      try {
        parsedErr = JSON.parse(errText);
      } catch {
        // fallback
      }

      console.error(`Groq API Error (${groqResponse.status}):`, parsedErr?.error?.message || errText);

      if (groqResponse.status === 429) {
        const matchSeconds = parsedErr?.error?.message?.match(/in ([0-9.]+)s/);
        const retrySeconds = matchSeconds ? Math.ceil(parseFloat(matchSeconds[1])) : 25;

        return {
          statusCode: 429,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: `Our free AI quota is cooling down. Please wait ${retrySeconds} seconds, then click Explain again.`,
            code: 'RATE_LIMIT',
            retryAfter: retrySeconds,
          }),
        };
      }

      if (groqResponse.status === 400 && parsedErr?.error?.message?.includes('invalid image')) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: 'The uploaded image could not be processed. Please try another clear photo or scan.',
            code: 'INVALID_IMAGE',
          }),
        };
      }

      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'The AI service encountered an issue while reading the report. Please try again shortly.',
          code: 'UPSTREAM_ERROR',
        }),
      };
    }

    const data = await groqResponse.json();
    const content = data?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('Empty response from AI model');
    }

    // Check if not a report
    if (content.startsWith('NOT_A_REPORT:')) {
      const reason = content.replace('NOT_A_REPORT:', '').trim();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          isReport: false,
          reason: reason || 'The uploaded file does not look like a readable blood test report.',
        }),
      };
    }

    // Parse response
    const lines = content.split('\n').map((l: string) => l.trim()).filter(Boolean);
    let summary = '';
    const priorities: string[] = [];
    const parameters: z.infer<typeof ParameterSchema>[] = [];
    let inTests = false;
    let detectedAge = parsedBody.age;
    let detectedGender = parsedBody.gender;

    for (const line of lines) {
      if (line.startsWith('PATIENT_AGE:') && !detectedAge) {
        const rawAge = line.replace('PATIENT_AGE:', '').trim();
        if (rawAge && !rawAge.toLowerCase().includes('not') && !rawAge.toLowerCase().includes('unknown')) {
          detectedAge = rawAge;
        }
      } else if (line.startsWith('PATIENT_GENDER:') && !detectedGender) {
        const rawGender = line.replace('PATIENT_GENDER:', '').trim();
        if (rawGender && !rawGender.toLowerCase().includes('not') && !rawGender.toLowerCase().includes('unknown')) {
          detectedGender = rawGender;
        }
      } else if (line.startsWith('SUMMARY:')) {
        summary = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('STATUS:')) {
        // model status is noted, final status is deterministically verified from biomarkers
      } else if (line.startsWith('PRIORITIES:')) {
        // section header
      } else if (line.startsWith('- ') && !inTests) {
        priorities.push(line.replace('- ', '').trim());
      } else if (line.startsWith('TESTS:')) {
        inTests = true;
      } else if (inTests && line.includes('|')) {
        const parts = line.split('|').map((p: string) => p.trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const val = parts[1];
          const unit = parts[2] || '';
          const range = parts[3] || 'Range not shown on report';

          // Look up clinical knowledge base
          const cleanKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const knowledge = BIOMARKER_KNOWLEDGE[cleanKey];

          // Deterministic numeric evaluation with clinical sanity validation
          const evaluated = evaluateStatusAndDifference(name, val, range, lang);

          const plainName = knowledge?.plain?.[lang] || knowledge?.plain?.en || name;
          const meaning =
            knowledge?.meaning?.[lang] ||
            knowledge?.meaning?.en ||
            (lang === 'si'
              ? 'රුධිර සාම්පලයක මනිනු ලබන රසායනාගාර දර්ශකයකි.'
              : lang === 'ta'
              ? 'இரத்த மாதிரியில் அளவிடப்படும் ஆய்வக குறியீடு.'
              : 'Laboratory biomarker measured in blood sample.');

          let causes: string[] = [];
          let tips: string[] = [];
          let doctorQuestions: string[] = [];

          if (evaluated.status === 'low') {
            causes =
              knowledge?.low?.causes?.[lang] ||
              knowledge?.low?.causes?.en ||
              (lang === 'si'
                ? ['සාමාන්‍ය රසායනාගාර පරාසයට වඩා අඩුවෙන් පැවතීම']
                : ['Value is below the laboratory reference interval']);
            tips =
              knowledge?.low?.tips?.[lang] ||
              knowledge?.low?.tips?.en ||
              (lang === 'si'
                ? ['පෝෂ්‍යදායී සමබල ආහාර වේලක් ගන්න සහ වෛද්‍ය උපදෙස් ලබාගන්න']
                : ['Maintain balanced nutrition and review findings with your physician']);
            doctorQuestions =
              knowledge?.low?.doctorQuestion?.[lang] ||
              knowledge?.low?.doctorQuestion?.en ||
              (lang === 'si'
                ? [`මෙම ${name} අගය අඩුවීමට හේතුව කුමක් විය හැකිද?`]
                : [`What could be contributing to this low ${name} reading?`]);
          } else if (evaluated.status === 'high' || evaluated.status === 'critical') {
            causes =
              knowledge?.high?.causes?.[lang] ||
              knowledge?.high?.causes?.en ||
              (lang === 'si'
                ? ['සාමාන්‍ය රසායනාගාර පරාසයට වඩා ඉහළින් පැවතීම']
                : ['Value is above the laboratory reference interval']);
            tips =
              knowledge?.high?.tips?.[lang] ||
              knowledge?.high?.tips?.en ||
              (lang === 'si'
                ? ['දිනපතා හොඳින් වතුර පානය කරන්න සහ සෞඛ්‍ය සම්පන්න ජීවන රටාවක් පවත්වා ගන්න']
                : ['Stay well hydrated and maintain healthy daily lifestyle habits']);
            doctorQuestions =
              knowledge?.high?.doctorQuestion?.[lang] ||
              knowledge?.high?.doctorQuestion?.en ||
              (lang === 'si'
                ? [`මෙම ${name} අගය වැඩිවීම සඳහා තවදුරටත් ප්‍රතිකාර අවශ්‍යද?`]
                : [`Does this elevated ${name} require any medical follow-up?`]);
          }

          parameters.push({
            name,
            plainName,
            value: val,
            unit,
            normalRange: evaluated.cleanRange,
            status: evaluated.status,
            difference: evaluated.difference,
            whatItMeans: meaning,
            possibleCauses: causes,
            howToImprove: tips,
            askYourDoctor: doctorQuestions,
          });
        }
      }
    }

    // Fallback: If parameters array is empty, attempt JSON parsing
    if (parameters.length === 0) {
      try {
        const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsedJson = JSON.parse(cleaned);
        if (parsedJson && Array.isArray(parsedJson.parameters)) {
          for (const p of parsedJson.parameters) {
            parameters.push({
              name: String(p.name || 'Test'),
              plainName: String(p.plainName || p.name || 'Biomarker'),
              value: String(p.value ?? 'Recorded'),
              unit: String(p.unit || ''),
              normalRange: String(p.normalRange || 'Range not shown on report'),
              status: ['low', 'normal', 'high', 'critical'].includes(p.status) ? p.status : 'normal',
              difference: String(p.difference || 'Within normal limits'),
              whatItMeans: String(p.whatItMeans || 'Laboratory biomarker.'),
              possibleCauses: Array.isArray(p.possibleCauses) ? p.possibleCauses : [],
              howToImprove: Array.isArray(p.howToImprove) ? p.howToImprove : [],
              askYourDoctor: Array.isArray(p.askYourDoctor) ? p.askYourDoctor : [],
            });
          }
          if (parsedJson.overallSummary) summary = parsedJson.overallSummary;
          if (Array.isArray(parsedJson.topPriorities)) priorities.push(...parsedJson.topPriorities);
        }
      } catch {
        // ignore fallback parse error
      }
    }

    if (parameters.length === 0) {
      return {
        statusCode: 422,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error:
            'Could not extract individual test values clearly from this image. Please upload a clear, well-lit photo or PDF scan.',
        }),
      };
    }

    // Deterministic overall status computation based on actual extracted parameters
    const hasCritical = parameters.some((p) => p.status === 'critical');
    const abnormalParams = parameters.filter((p) => p.status === 'low' || p.status === 'high');
    const finalStatus: 'good' | 'attention' | 'urgent' = hasCritical
      ? 'urgent'
      : abnormalParams.length > 0
      ? 'attention'
      : 'good';

    // Prioritize actionable insights if abnormal parameters exist
    const finalPriorities: string[] = [];
    if (abnormalParams.length > 0) {
      abnormalParams.slice(0, 3).forEach((p) => {
        if (lang === 'si') {
          finalPriorities.push(
            `${p.plainName}: අගය ${p.value} ${p.unit} (${p.difference}) - වෛද්‍ය උපදෙස් සඳහා සටහන් කරගන්න.`
          );
        } else if (lang === 'ta') {
          finalPriorities.push(
            `${p.plainName}: ${p.value} ${p.unit} (${p.difference}) - மருத்துவரிடம் ஆலோசிக்கவும்.`
          );
        } else {
          finalPriorities.push(
            `${p.name} (${p.plainName}) is ${p.value} ${p.unit} (${p.difference}).`
          );
        }
      });
      // Add reassuring note for the rest of the report
      if (parameters.length > abnormalParams.length) {
        if (lang === 'si') {
          finalPriorities.push(
            `වාර්තාවේ අනෙකුත් සියලුම පරීක්ෂණ (${parameters.length - abnormalParams.length} ක්) සාමාන්‍ය නිරෝගී මට්ටමේ පවතී.`
          );
        } else if (lang === 'ta') {
          finalPriorities.push(
            `மற்ற அனைத்து சோதனைகளும் (${parameters.length - abnormalParams.length}) ஆரோக்கியமான சாதாரண வரம்பிற்குள் உள்ளன.`
          );
        } else {
          finalPriorities.push(
            `All other ${parameters.length - abnormalParams.length} measured parameters are within healthy normal reference limits.`
          );
        }
      }
    } else if (priorities.length > 0) {
      finalPriorities.push(...priorities);
    } else {
      finalPriorities.push(
        lang === 'si'
          ? 'සියලු ප්‍රතිඵල සාමාන්‍ය මට්ටමේ පවතින බැවින් සාමාන්‍ය සෞඛ්‍ය සම්පන්න ජීවන රටාව පවත්වා ගන්න.'
          : 'All laboratory parameters are within normal reference ranges. Continue maintaining healthy habits.'
      );
    }

    // Ensure summary is populated and informative
    if (!summary || (finalStatus === 'attention' && !summary.includes('attention') && !summary.includes('පරාසය'))) {
      if (lang === 'si') {
        summary =
          finalStatus === 'good'
            ? 'ඔබගේ රුධිර පරීක්ෂණ වාර්තාවේ සියලුම පරීක්ෂණ සාමාන්‍ය නිරෝගී පරාසය තුළ පවතී.'
            : `ඔබගේ රුධිර පරීක්ෂණ වාර්තාව බොහෝ දුරට නිරෝගී මට්ටමක පවතින අතර, පරීක්ෂණ ${abnormalParams.length} ක් සාමාන්‍ය පරාසයට වඩා මඳක් වෙනස්ව පවතී.`;
      } else if (lang === 'ta') {
        summary =
          finalStatus === 'good'
            ? 'உங்கள் இரத்த பரிசோதனை முடிவுகள் அனைத்தும் சாதாரண வரம்பிற்குள் உள்ளன.'
            : `உங்கள் இரத்த அறிக்கையில் ${abnormalParams.length} அளவுகள் சாதாரண வரம்பை விட சற்று மாறுபட்டுள்ளன.`;
      } else {
        summary =
          finalStatus === 'good'
            ? 'All measured laboratory biomarkers in your report fall within healthy reference limits.'
            : `Your report is generally healthy, with ${abnormalParams.length} test value(s) slightly outside your laboratory reference range.`;
      }
    }

    const urgentItems = hasCritical
      ? [
          lang === 'si'
            ? 'වාර්තාවේ ඉතා ඉහළ හෝ අඩු අගයන් පවතින බැවින් හැකි ඉක්මනින් වෛද්‍යවරයකු හමුවන්න.'
            : 'One or more values are critically outside reference limits. Please consult a qualified doctor soon.',
        ]
      : [];

    const result = {
      isReport: true as const,
      overallSummary: summary,
      overallStatus: finalStatus,
      parameters,
      topPriorities: finalPriorities,
      whenToSeeDoctorUrgently: urgentItems,
      disclaimer: MANDATORY_DISCLAIMER,
      patientContext: {
        age: detectedAge || undefined,
        gender: detectedGender || undefined,
        isAgeCalibrated: true,
      },
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(result),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        statusCode: 504,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Analysis timed out. Please try uploading a slightly smaller or cropped image.',
          code: 'TIMEOUT',
        }),
      };
    }

    console.error('Server function error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'An unexpected error occurred while processing your report. Please try again.',
      }),
    };
  }
};
