import { ArrowDownRight } from 'lucide-react';
import { HeroSpaceScene } from '../three/HeroSpaceScene';
import { DownloadButton } from '../components/DownloadButton';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] w-full overflow-hidden bg-[#06070d] pt-28 pb-16 sm:pt-32 sm:pb-20 flex items-center"
    >
      {/* 3D Deep-Space Environment & NEXORA XTINS Emblem */}
      <div className="absolute inset-0 z-0">
        <HeroSpaceScene />
      </div>

      {/* Subtle directional gradient scrim for crisp left-column legibility */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#06070d]/92 via-[#06070d]/68 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#06070d] to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-cyan-300/90">
            <span>Windows Desktop Browser</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span className="text-slate-300">Native Desktop Application</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06]">
            NEXORA XTINS
          </h1>

          <p className="mt-4 font-display text-xl font-semibold text-violet-200 sm:text-2xl lg:text-3xl">
            Your web. Your privacy. Your control.
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A modern Windows browser built around privacy, performance, and control.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <DownloadButton label="Download NEXORA XTINS" variant="primary" />

            <a
              href="#meet-xtins"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#0b1020]/85 px-5 py-3.5 text-sm sm:text-base font-medium text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-white whitespace-nowrap shrink-0"
            >
              <span>Explore XTINS</span>
              <ArrowDownRight className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-5 text-xs sm:text-sm text-slate-400">
            Built for Windows desktops · Privacy-first local architecture · AUROUS &amp; AETHER themes
          </p>
        </div>
      </div>
    </section>
  );
}
