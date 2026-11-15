import { useState } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { PRODUCT_SCREENSHOTS } from '../config/siteConfig';
import { DownloadButton } from '../components/DownloadButton';

type ThemeKey = 'aurous' | 'aether';

const THEME_SPECS: Record<
  ThemeKey,
  {
    name: string;
    subtitle: string;
    description: string;
    highlights: string[];
    screenshot: string;
    alt: string;
  }
> = {
  aurous: {
    name: 'AUROUS',
    subtitle: 'Cosmic neon interface',
    description:
      'Dark space-inspired visuals with luminous cyan-violet wordmark illumination and open cosmic depth across the home workspace.',
    highlights: [
      'Deep obsidian-navy cosmic canvas with subtle starlight',
      'Luminous cyan-white NEXORA wordmark and violet action accents',
      'Seamless top-bar switcher directly inside the browser chrome',
    ],
    screenshot: PRODUCT_SCREENSHOTS.aurousHome,
    alt: 'Real NEXORA XTINS browser running the AUROUS cosmic theme',
  },
  aether: {
    name: 'AETHER',
    subtitle: 'Glass interface',
    description:
      'Translucent glass-inspired workspace framing over a calmer atmospheric indigo canvas with balanced surface contrast.',
    highlights: [
      'Framed translucent glass container around search and Quick Access',
      'Softer indigo-violet atmospheric tone and clean border highlights',
      'Instant switching from the top AUROUS | AETHER toggle',
    ],
    screenshot: PRODUCT_SCREENSHOTS.aetherHome,
    alt: 'Real NEXORA XTINS browser running the AETHER glass theme',
  },
};

export function ThemeShowcaseSection() {
  const [theme, setTheme] = useState<ThemeKey>('aurous');
  const current = THEME_SPECS[theme];
  const isAurous = theme === 'aurous';

  return (
    <section className="relative border-t border-slate-800/70 bg-[#070912] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium text-cyan-300">Theme Demonstration</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              AUROUS and AETHER
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-300">
              Switch between the two real NEXORA XTINS visual themes directly below to compare
              their native Windows desktop appearance.
            </p>
          </div>

          {/* Interactive Theme Switcher */}
          <div
            className="inline-flex rounded-xl border border-slate-700/80 bg-[#0b1020] p-1"
            role="group"
            aria-label="Select XTINS theme demonstration"
          >
            <button
              type="button"
              onClick={() => setTheme('aurous')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isAurous
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>AUROUS</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('aether')}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                !isAurous
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span>AETHER</span>
            </button>
          </div>
        </div>

        {/* Dynamic Demonstration Panel with Real Product Screenshot */}
        <div
          className={`mt-10 overflow-hidden rounded-3xl border transition-all duration-300 ${
            isAurous
              ? 'border-violet-500/40 bg-[#070915] shadow-[0_24px_80px_rgba(109,40,217,0.22)]'
              : 'border-sky-300/35 bg-gradient-to-br from-[#131b31] via-[#18233c] to-[#0f1629] shadow-[0_24px_80px_rgba(56,189,248,0.16)]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Theme Description Column */}
            <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                <p
                  className={`text-xs font-medium ${
                    isAurous ? 'text-cyan-300' : 'text-sky-200'
                  }`}
                >
                  Active Theme · {current.name}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold text-white">{current.name}</h3>
                <p
                  className={`mt-1 text-base font-medium ${
                    isAurous ? 'text-violet-300' : 'text-sky-200'
                  }`}
                >
                  {current.subtitle}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-slate-200">{current.description}</p>

                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  {current.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                          isAurous ? 'bg-cyan-400' : 'bg-sky-200'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm font-semibold text-white">Choose your XTINS experience</p>
                <div className="mt-4">
                  <DownloadButton label="Try XTINS" variant="primary" />
                </div>
              </div>
            </div>

            {/* Real Product Screenshot Stage */}
            <div className="p-4 sm:p-8 lg:col-span-7">
              <div
                className={`overflow-hidden rounded-2xl border shadow-2xl transition-all duration-300 ${
                  isAurous
                    ? 'border-violet-500/40 bg-[#050711]'
                    : 'border-sky-300/35 bg-[#0c1224]'
                }`}
              >
                <img
                  src={current.screenshot}
                  alt={current.alt}
                  referrerPolicy="no-referrer"
                  className="block h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
