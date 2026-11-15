import { useEffect, useRef, useState } from 'react';
import { ScrollAssemblyScene } from '../three/ScrollAssemblyScene';
import { DownloadButton } from '../components/DownloadButton';
import { prefersReducedMotion } from '../utils/webgl';

const ASSEMBLY_STAGES = [
  {
    step: '01',
    title: 'A browser window appears',
    description:
      'The native NEXORA XTINS Windows frame opens with the deep-space home workspace and top AUROUS | AETHER toggle.',
    targetProgress: 0.1,
  },
  {
    step: '02',
    title: 'Tabs & navigation emerge',
    description:
      'Active tabs, Incognito mode, + Group control, and the unified search and address bar align across the top chrome.',
    targetProgress: 0.24,
  },
  {
    step: '03',
    title: 'Tabs form groups',
    description:
      'Color-coded tab groups such as the study group organize alongside active browsing tabs.',
    targetProgress: 0.39,
  },
  {
    step: '04',
    title: 'Privacy controls appear',
    description:
      'The Privacy Dashboard brings Tracking Prevention, Network Ad Blocking, and Clear Browsing Data into clear view.',
    targetProgress: 0.54,
  },
  {
    step: '05',
    title: 'Download manager appears',
    description:
      'The dedicated Downloads panel integrates with the left navigation rail for quick file tracking and cleanup.',
    targetProgress: 0.69,
  },
  {
    step: '06',
    title: 'Theme changes',
    description:
      'Toggle smoothly from the deep-space AUROUS canvas into AETHER’s translucent glass workspace.',
    targetProgress: 0.83,
  },
  {
    step: '07',
    title: 'This is NEXORA XTINS.',
    description:
      'The complete Windows desktop browser comes into crisp focus—ready to install and use.',
    targetProgress: 1.0,
  },
];

export function ScrollBrowserExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0.1);
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(1.0);
      return;
    }

    let raf = 0;
    const updateFromScroll = () => {
      if (manualOverride) return;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const raw = -rect.top / scrollable;
      const clamped = Math.min(1, Math.max(0, raw));
      setProgress(clamped);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateFromScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [manualOverride]);

  const activeStageIndex = Math.min(
    ASSEMBLY_STAGES.length - 1,
    Math.floor(progress * ASSEMBLY_STAGES.length),
  );
  const activeStage = ASSEMBLY_STAGES[activeStageIndex];
  const isFinalReveal = progress >= 0.86;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative border-t border-slate-800/70 bg-[#06070d]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:min-h-[210vh] py-20 lg:py-16">
        <div className="lg:sticky lg:top-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-cyan-300">3D Browser Experience</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Walk through the real NEXORA XTINS
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {manualOverride && (
                <button
                  type="button"
                  onClick={() => setManualOverride(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-cyan-400/50 hover:text-white whitespace-nowrap"
                >
                  Resume scroll sync
                </button>
              )}
              <DownloadButton label="Try XTINS" variant="compact" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Left Stage Selector List */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-2">
              <div className="space-y-2">
                {ASSEMBLY_STAGES.map((stage, idx) => {
                  const active = idx === activeStageIndex;
                  return (
                    <button
                      key={stage.step}
                      type="button"
                      onClick={() => {
                        setManualOverride(true);
                        setProgress(stage.targetProgress);
                      }}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                        active
                          ? 'border-cyan-400/55 bg-[#0e1529]'
                          : 'border-slate-800/80 bg-[#0a0e1b]/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            active ? 'text-cyan-300' : 'text-slate-500'
                          }`}
                        >
                          {stage.step}
                        </span>
                        <span
                          className={`font-display text-sm font-semibold ${
                            active ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {stage.title}
                        </span>
                      </div>
                      {active && (
                        <p className="mt-1.5 pl-7 text-xs leading-relaxed text-slate-300">
                          {stage.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Final Reveal Callout */}
              <div
                className={`mt-3 rounded-2xl border p-5 transition-all duration-300 ${
                  isFinalReveal
                    ? 'border-violet-400/55 bg-[#11152c]'
                    : 'border-slate-800 bg-[#090d1a]'
                }`}
              >
                <p className="font-display text-xl font-bold text-white">
                  {isFinalReveal ? 'This is NEXORA XTINS.' : activeStage.title}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  {isFinalReveal
                    ? 'Ready for your Windows desktop.'
                    : 'Scroll or click any stage to inspect the real browser views in 3D.'}
                </p>
                <div className="mt-4">
                  <DownloadButton label="Download XTINS" variant="primary" />
                </div>
              </div>
            </div>

            {/* Right 3D Assembly Viewport */}
            <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-slate-800 bg-[#090d1a] flex flex-col">
              <div className="relative h-[360px] sm:h-[480px] lg:flex-1 lg:min-h-[520px] w-full">
                <ScrollAssemblyScene progress={progress} />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-800 bg-[#0b1020] px-5 py-3 text-xs text-slate-400">
                <span>
                  Stage {activeStage.step} / 07 ·{' '}
                  <strong className="text-slate-200">{activeStage.title}</strong>
                </span>
                <span className="font-mono text-cyan-300">{Math.round(progress * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
