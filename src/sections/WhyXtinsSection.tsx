import { ArrowRight } from 'lucide-react';
import { DownloadButton } from '../components/DownloadButton';

const PILLARS = [
  {
    index: '01',
    title: 'Privacy',
    description:
      'Privacy controls and tracking prevention designed to give users more control over web activity.',
  },
  {
    index: '02',
    title: 'Control',
    description:
      'Tools for tabs, groups, downloads, search engines, and browsing data organized for everyday workflows.',
  },
  {
    index: '03',
    title: 'Experience',
    description:
      'A custom Windows desktop interface with a distinctive visual identity built for native interaction.',
  },
  {
    index: '04',
    title: 'Customization',
    description:
      'Switch between AUROUS and AETHER themes to match your workspace mood and visual preferences.',
  },
];

export function WhyXtinsSection() {
  return (
    <section className="relative border-t border-slate-800/70 bg-[#070912] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-cyan-300">Why NEXORA XTINS</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built around deliberate desktop browsing
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0b1020]/70 p-6 transition-colors hover:border-violet-500/40"
            >
              <div>
                <span className="font-mono text-xs font-medium text-cyan-400">{pillar.index}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-[#0a0e1d] px-6 py-5">
          <div className="flex items-center gap-3 text-base font-medium text-slate-200">
            <span className="font-display font-semibold text-white">Experience XTINS</span>
            <ArrowRight className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span className="text-slate-400 text-sm">Ready for Windows desktops</span>
          </div>
          <DownloadButton label="Download XTINS" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
