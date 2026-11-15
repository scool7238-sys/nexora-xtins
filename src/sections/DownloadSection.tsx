import { Monitor } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { DownloadButton } from '../components/DownloadButton';

export function DownloadSection() {
  return (
    <section
      id="download"
      className="relative border-t border-slate-800/70 bg-[#06070d] py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle atmospheric glow behind the conversion card */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.18),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-violet-500/35 bg-gradient-to-b from-[#0f152a] to-[#090c18] p-8 sm:p-14 text-center shadow-[0_28px_90px_rgba(0,0,0,0.65)]">
          <div className="mx-auto flex w-fit items-center gap-3">
            <BrandMark size={40} />
            <div className="text-left">
              <p className="font-display text-lg font-bold text-white leading-tight">
                NEXORA XTINS
              </p>
              <p className="flex items-center gap-1.5 text-xs text-cyan-300">
                <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Windows Desktop Browser</span>
              </p>
            </div>
          </div>

          <h2 className="mt-8 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready for XTINS?
          </h2>

          <p className="mt-4 text-lg font-medium text-violet-200 sm:text-xl">
            Download NEXORA XTINS for Windows.
          </p>

          <div className="mt-9 flex justify-center">
            <DownloadButton
              label="Download NEXORA XTINS"
              variant="primary"
              className="px-8 py-4 text-base sm:text-lg"
            />
          </div>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-slate-300">
            Download the installer, launch it on Windows, and start browsing with NEXORA XTINS.
          </p>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Official NEXORA XTINS download
          </p>
        </div>
      </div>
    </section>
  );
}
