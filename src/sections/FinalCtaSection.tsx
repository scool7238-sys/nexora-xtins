import { ArrowUpRight } from 'lucide-react';
import { DownloadButton } from '../components/DownloadButton';

export function FinalCtaSection() {
  return (
    <section className="relative border-t border-slate-800/70 bg-[#06070d] py-24 sm:py-32 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(139,92,246,0.22),transparent_62%),radial-gradient(ellipse_at_50%_20%,rgba(34,211,238,0.12),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <p className="text-xs font-medium text-cyan-300">Windows Desktop Browser</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Your next browser starts here.
        </h2>
        <p className="mt-4 text-lg text-slate-300 sm:text-xl">
          Enter the XTINS experience.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <DownloadButton
            label="Download for Windows"
            variant="primary"
            className="px-7 py-4 text-base"
          />
          <a
            href="#meet-xtins"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#0b1020] px-6 py-4 text-base font-medium text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-white whitespace-nowrap shrink-0"
          >
            <span>Explore XTINS</span>
            <ArrowUpRight className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
