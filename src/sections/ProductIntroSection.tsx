import { useState } from 'react';
import { Monitor, Layers, Shield, Download } from 'lucide-react';
import { FloatingBrowserScene, BrowserFocusPreset } from '../three/FloatingBrowserScene';
import { BrowserThemeMode } from '../three/buildBrowserModel';
import { DownloadButton } from '../components/DownloadButton';

const VIEW_CONTROLS: { id: BrowserFocusPreset; label: string; icon: typeof Monitor }[] = [
  { id: 'overview', label: 'XTINS Home', icon: Monitor },
  { id: 'tabs', label: 'Tabs & Groups', icon: Layers },
  { id: 'privacy', label: 'Privacy Dashboard', icon: Shield },
  { id: 'downloads', label: 'Downloads', icon: Download },
];

export function ProductIntroSection() {
  const [focusPreset, setFocusPreset] = useState<BrowserFocusPreset>('overview');
  const [themeMode, setThemeMode] = useState<BrowserThemeMode>('aurous');

  return (
    <section id="meet-xtins" className="relative py-20 sm:py-28 bg-[#06070d]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Narrative */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-cyan-300">Windows Desktop Application</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet NEXORA XTINS
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              NEXORA XTINS is a Windows desktop browser designed to provide a modern browsing
              experience with privacy controls, organized tabs, customization, and native desktop
              interaction.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Inspect the real NEXORA XTINS interface inside the floating 3D desktop frame—switch
              between Home, Tabs &amp; Groups, the Privacy Dashboard, and Downloads, or toggle
              between AUROUS and AETHER.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <DownloadButton label="Download XTINS" variant="primary" />
              <a
                href="#inside-xtins"
                className="text-sm font-semibold text-slate-300 underline-offset-4 hover:text-cyan-300 hover:underline whitespace-nowrap shrink-0"
              >
                Inspect full screenshots
              </a>
            </div>
          </div>

          {/* Right Interactive 3D Browser Window */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#090d1a]">
              <div className="relative h-[340px] sm:h-[430px] w-full">
                <FloatingBrowserScene focusPreset={focusPreset} themeMode={themeMode} />
              </div>

              {/* Clean bottom control bar outside WebGL canvas */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/90 bg-[#0b1020] px-4 py-3">
                <div
                  className="flex flex-wrap items-center gap-1.5"
                  role="group"
                  aria-label="Browser view presets"
                >
                  {VIEW_CONTROLS.map((ctrl) => {
                    const Icon = ctrl.icon;
                    const active = focusPreset === ctrl.id;
                    return (
                      <button
                        key={ctrl.id}
                        type="button"
                        onClick={() => setFocusPreset(ctrl.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-violet-600/30 text-cyan-200 border border-violet-400/40'
                            : 'text-slate-400 border border-transparent hover:bg-slate-800/70 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{ctrl.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-[#060913] p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('aurous');
                      setFocusPreset('overview');
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      themeMode === 'aurous'
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    AUROUS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('aether');
                      setFocusPreset('overview');
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      themeMode === 'aether'
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    AETHER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
