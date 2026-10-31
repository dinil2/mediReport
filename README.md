# MediReport AI 🩸🩺

> **Empowering patients with calm, plain-language explanations of their laboratory blood test reports in under 60 seconds.**

[![Live Demo](https://img.shields.io/badge/Live_Site-medireport--ai.netlify.app-0D9488?style=for-the-badge&logo=netlify)](https://medireport-ai.netlify.app)
[![Built with React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Powered by Groq](https://img.shields.io/badge/AI-Groq_Vision-F55036?style=for-the-badge)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**🌐 Live Production Site:** [https://medireport-ai.netlify.app](https://medireport-ai.netlify.app)

---

## 📖 Table of Contents

- [What is MediReport AI?](#-what-is-medireport-ai)
- [What Does It Do?](#-what-does-it-do)
- [How Does It Work?](#-how-does-it-work)
- [Why It Matters](#-why-it-matters)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Security & Zero-Storage Privacy](#-security--zero-storage-privacy)
- [Getting Started Locally](#-getting-started-locally)
- [Deploying to Netlify](#-deploying-to-netlify)
- [Medical & Ethical Disclaimer](#-medical--ethical-disclaimer)

---

## 💡 What is MediReport AI?

**MediReport AI** is an intelligent, patient-first web application designed to help everyday people understand their blood test reports before or after visiting a doctor.

Most patients receive dense, intimidating lab reports packed with cryptic medical abbreviations (such as *MCV, MCHC, SGPT, eGFR, HbA1c, Differential Leucocyte Counts*), unfamiliar measurement units (*fl, pg, 10^3/uL, mmol/L*), and clinical reference intervals. For someone without medical training, this often leads to unnecessary panic, late-night search engine anxiety, or misunderstanding critical health warnings.

MediReport AI bridges this gap. By uploading a photo or PDF of a lab report, patients receive an immediate, empathetic, and comprehensive breakdown written at a friendly 7th-grade (12-year-old) reading level. It does not replace a doctor—instead, it transforms confused patients into informed, prepared partners in their own healthcare journey.

---

## 🎯 What Does It Do?

MediReport AI performs an exhaustive, end-to-end analysis of laboratory reports:

1. **Complete Multi-Parameter Extraction:**
   Reads and extracts every single test parameter printed on the report (Complete Blood Counts, Lipid Profiles, Liver Function Tests, Renal Panels, Electrolytes, Thyroid, etc.) without truncating or omitting normal values.
2. **Age & Gender Demographic Calibration:**
   Considers the patient's age and biological sex (either auto-detected from report headers or entered manually) to tailor interpretations, reference expectations, and health context accurately.
3. **Plain-Language Translations:**
   Translates every clinical term into everyday language (e.g. *Haemoglobin* ➔ *"Oxygen-Carrying Protein in Blood"*, *Platelets* ➔ *"Blood-Clotting Cells"*, *Neutrophils* ➔ *"Infection-Fighting White Blood Cells"*).
4. **Visual Range Comparison & Anomaly Detection:**
   Compares the patient's measured number directly against the laboratory's printed reference range. Color-coded horizontal range bars show at a glance whether a value is **Low**, **Healthy/Normal**, **High**, or **Critically High/Low**.
5. **Practical, Non-Prescriptive Guidance:**
   Provides actionable, food-based adjustments and lifestyle suggestions (such as iron-rich leafy greens, hydration, low-glycemic foods, sunlight for Vitamin D, sleep hygiene, and light aerobic exercise). *Never prescribes pharmaceuticals or synthetic medications.*
6. **Smart Doctor Discussion Preparation:**
   Automatically compiles targeted, highly relevant questions for the patient to ask their doctor at their next checkup, complete with a **One-Click Copy** button.
7. **Doctor Urgency & Safety Banners:**
   If a biomarker is severely out of range, the system displays a clear, calm prompt advising the patient to seek professional medical attention soon.
8. **Multi-Language Accessibility:**
   Supports **English**, **Sinhala (සිංහල)**, and **Tamil (தமிழ்)** to serve diverse communities in Sri Lanka and globally.
9. **Doctor-Ready Print & PDF Export:**
   Features a dedicated print stylesheet (`@media print`) so patients can print a clean, high-contrast, doctor-ready physical summary with one click.

---

## ⚙️ How Does It Work?

```
┌─────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│  Patient        │       │  Client-Side Browser   │       │  Secure Netlify Proxy  │
│  Uploads Photo  │ ────> │  Compression & Canvas  │ ────> │  (Zero-Key Leakage)    │
│  or Single PDF  │       │  (< 1600px, WebP/JPEG) │       │  /.netlify/functions   │
└─────────────────┘       └────────────────────────┘       └───────────┬────────────┘
                                                                       │
                                                                       ▼
┌─────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│  Doctor-Ready   │       │  Interactive Results   │       │  Groq Vision AI        │
│  Print / Copy   │ <──── │  Range Bars, Badges,   │ <──── │  Structured Multimodal │
│  Summary        │       │  Diet & Doctor Advice  │       │  Qwen 27B Extraction   │
└─────────────────┘       └────────────────────────┘       └────────────────────────┘
```

1. **Step 1: Upload (Mobile Camera, Gallery, or PDF)**
   - The user selects a photo of their lab report or uploads a single-page PDF.
   - For PDFs, an in-browser PDF renderer lazily paints page 1 directly onto an HTML Canvas without sending the raw document anywhere.
2. **Step 2: Client-Side Preprocessing & Optimization**
   - The image is intelligently downscaled and compressed in the browser (max dimension ~1600px, JPEG quality 0.82). This ensures blazing-fast upload speeds even on mobile connections and prevents network payload timeouts.
3. **Step 3: Secure Serverless AI Analysis (Netlify Functions)**
   - The compressed image is transmitted to `/.netlify/functions/analyze`.
   - The server validates the payload, applies rate-limiting defenses, and proxies the image to Groq's high-speed multimodal vision inference endpoint (`qwen/qwen3.8-27b`).
   - The AI uses a strict medical prompt that mandates extracting **only printed values**, prohibits hallucinating missing intervals, and enforces structured JSON output.
4. **Step 4: Clinical Presentation & Filtering**
   - The frontend renders an organized dashboard:
     - **Overall Summary Card** with health status badge.
     - **Top 3 Priorities to Focus On**.
     - **Quick-Glance Summary Table** with visual range position indicators.
     - **Abnormal Parameters (Attention Needed)** expanded first at the top.
     - **Healthy / Normal Parameters** cleanly grouped and expandable.
     - **Doctor Preparation Questions** with a one-click clipboard copy.

---

## 🌍 Why It Matters

- **Healthcare Literacy:** Medical reports are written for physicians, not patients. Understanding test results empowers patients to actively care for their health.
- **Anxiety Reduction:** Waiting days or weeks for a follow-up appointment while staring at "HIGH" or "LOW" red flags induces extreme stress. Simple explanations provide calm and context.
- **Better Doctor Visits:** Instead of wasting clinic time asking "What is MCH?", the patient arrives informed, holding targeted questions about root causes and personalized treatment options.

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **Comprehensive Extraction** | Captures all 20+ markers in Complete Blood Counts and multi-panel reports. |
| **Patient Demographics** | Incorporates Age & Sex calibration for accurate clinical context. |
| **Plain Language** | Explains each biomarker at an easy 7th-grade reading level. |
| **Multilingual** | Full support for English, Sinhala (සිංහල), and Tamil (தமிழ்). |
| **Visual Range Bars** | Shows where your number sits relative to your lab's minimum and maximum limits. |
| **Zero Storage Privacy** | Ephemeral processing. Images are never written to disk or databases. |
| **Clinical Safeguards** | Prominently urges medical consultations; strictly avoids drug prescriptions. |
| **One-Click Export** | Clean print stylesheet designed for physical doctor hand-outs. |

---

## 🏗️ Architecture & Tech Stack

```
/netlify/functions/analyze.ts   -> Secure Groq Vision proxy (only place API key lives)
/netlify.toml                   -> Netlify build configuration & SPA fallback rules
/src/app/                       -> App entry point, routing setup, global providers
/src/pages/                     -> Home, Analyze, HowItWorks, FAQ, About, Privacy, Disclaimer
/src/components/ui/             -> Button, Card, Badge, Accordion, Modal, Toast, Skeleton, RangeBar
/src/components/layout/         -> Navbar, Footer, DisclaimerBanner
/src/features/analyzer/         -> UploadZone, ImagePreview, ResultView, ParameterCard, SummaryHeader
/src/features/analyzer/hooks/   -> useAnalyze, useImageCompress
/src/features/analyzer/types.ts -> Single source of truth (Zod schemas & TypeScript types)
/src/lib/                       -> api client, image utils, pdf converter, constants
/src/styles/                    -> Tailwind layers, design tokens, print styling
```

- **Frontend Framework:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS (Calm clinical teal `#0D9488`, slate `#0F172A`, surface `#FFFFFF`)
- **Icons & Motion:** Lucide React, Framer Motion
- **Type Safety & Validation:** Zod
- **Backend Infrastructure:** Netlify Serverless Functions (Node.js/TypeScript)
- **AI Vision Engine:** Groq Cloud API (`qwen/qwen3.8-27b`)

---

## 🔒 Security & Zero-Storage Privacy

- **Server-Side API Key Protection:** The `GROQ_API_KEY` is injected exclusively in Netlify serverless environment variables. The API key is **never** bundled into frontend client code.
- **100% Ephemeral Processing:** Images uploaded by users are processed in memory and immediately discarded. No patient images, names, or health records are saved to databases, cookies, or storage buckets.
- **Git Leak Prevention:** Pre-configured `.gitignore` ensures that `.env` files, credentials, and internal prompt templates are never tracked in version control.

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/dinil2/mediReport.git
cd mediReport
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example file to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your free Groq API key:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b
```

> **Note:** You can obtain a free API key at [console.groq.com](https://console.groq.com/keys).

### 4. Start Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.  
*(Vite includes a built-in proxy for `/.netlify/functions/analyze`, allowing full local end-to-end testing without needing the Netlify CLI!)*

---

## 🌐 Deploying to Netlify

The site is configured for instant deployment on Netlify:

1. **Push your repository to GitHub.**
2. **Connect to Netlify:** Click **"Add new site"** → **"Import from Git"** → Select `mediReport`.
3. Netlify automatically reads `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
4. Add environment variables under **Site Settings > Environment Variables**:
   - `GROQ_API_KEY`: Your Groq Cloud API key
   - `GROQ_MODEL`: `qwen/qwen3.8-27b`
5. Click **Deploy**. Your app will be live at `https://<your-site-name>.netlify.app`.

---

## 🩺 Medical & Ethical Disclaimer

**MediReport AI is an educational tool designed to promote health literacy and patient empowerment. It is NOT a medical device, does NOT diagnose diseases, and does NOT prescribe medications, dosages, or treatments.**

Laboratory results must always be evaluated in conjunction with full clinical history, physical examinations, and other diagnostic tests by a licensed healthcare professional. Never change, start, or stop any prescribed medication or medical regimen based on AI-generated explanations. If you are experiencing chest pain, difficulty breathing, or severe sudden symptoms, contact your nearest emergency services immediately.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
