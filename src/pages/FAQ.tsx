import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, ArrowRight } from 'lucide-react';
import { AccordionItem } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { FAQ_ITEMS } from '../lib/constants';

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const additionalFaqs = [
    {
      question: 'Which languages are supported?',
      answer:
        'MediReport AI currently supports English, Sinhala (සිංහල), and Tamil (தமிழ்). The AI reads the English medical terminology printed on standard diagnostic reports and provides translations and summaries in your chosen language.',
    },
    {
      question: 'What if my doctor gave me a paper printed report?',
      answer:
        'Simply lay the paper report flat on a well-lit table and use your mobile phone camera to take a clear, top-down photo. You can tap "Take Photo" directly inside our upload zone to open your camera.',
    },
    {
      question: 'Why are my lab reference ranges different from someone else’s?',
      answer:
        'Every laboratory uses different diagnostic machinery, chemical reagents, and regional reference populations. This is why MediReport AI always references the exact normal interval printed on your specific piece of paper, rather than generic textbook ranges.',
    },
    {
      question: 'Is there a limit on how many reports I can analyze?',
      answer:
        'MediReport AI is completely free to use. To protect our free API infrastructure from automated spam, there is a simple 10-second cooldown timer between analyses.',
    },
  ];

  const allFaqs = [...FAQ_ITEMS, ...additionalFaqs];

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary mx-auto flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-ink tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          Learn how MediReport AI processes blood tests, safeguards your privacy, and empowers your healthcare literacy.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-muted">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions (e.g. privacy, Sinhala, normal range)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-surface text-ink text-sm placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question} defaultOpen={index === 0 && !searchTerm}>
              {faq.answer}
            </AccordionItem>
          ))
        ) : (
          <div className="text-center py-12 text-ink-muted space-y-2">
            <p>No questions matched your search query "{searchTerm}".</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="rounded-2xl bg-surface border border-border p-8 text-center space-y-4 shadow-soft">
        <h3 className="font-heading font-bold text-xl text-ink">
          Still Have Questions or Ready to Analyze?
        </h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          You can test the tool immediately with a sample report or upload your own lab photo in seconds.
        </p>
        <div className="pt-2">
          <Link to="/analyze">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Go to Report Analyzer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
