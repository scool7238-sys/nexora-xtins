import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { DownloadButton } from '../components/DownloadButton';

interface FaqItem {
  question: string;
  answer: string;
  includeDownloadCta?: boolean;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is NEXORA XTINS?',
    answer:
      'NEXORA XTINS is a Windows desktop browser built around privacy controls, organized tab management, local-first storage protection, and customizable visual themes.',
  },
  {
    question: 'Where can I download XTINS?',
    answer:
      'You can download the Windows installer directly using any official Download NEXORA XTINS button on this website.',
    includeDownloadCta: true,
  },
  {
    question: 'Is XTINS available for Windows?',
    answer: 'Yes. NEXORA XTINS is built as a Windows desktop browser.',
  },
  {
    question: 'Does XTINS have private browsing?',
    answer:
      'Yes. Private browsing sessions are separated from normal browsing session persistence.',
  },
  {
    question: 'Does XTINS include privacy controls?',
    answer:
      'Yes. XTINS includes Privacy Shields with tracking prevention, network filtering controls, browsing-data clearing, and encrypted local storage for NEXORA-owned persistent data.',
  },
  {
    question: 'Can I change the browser theme?',
    answer: 'Yes. Both the AUROUS (cosmic neon) and AETHER (glass) themes are available.',
  },
  {
    question: 'Is XTINS free?',
    answer: SITE_CONFIG.pricingAnswer,
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative border-t border-slate-800/70 bg-[#070912] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-medium text-cyan-300">Questions &amp; Answers</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-800/90 rounded-2xl border border-slate-800 bg-[#0a0e1d]">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-800/30"
                >
                  <span className="font-display text-base font-semibold text-white sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-300' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-0 text-sm leading-relaxed text-slate-300">
                    <p>{item.answer}</p>
                    {item.includeDownloadCta && (
                      <div className="mt-4">
                        <DownloadButton label="Download NEXORA XTINS" variant="compact" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
