import { useState } from 'react';
import { Shield, Filter, EyeOff, Trash2, HardDrive, Lock } from 'lucide-react';
import { EncryptedStorageScene, StorageLayerKey } from '../three/EncryptedStorageScene';
import { DownloadButton } from '../components/DownloadButton';

const PRIVACY_PILLARS = [
  {
    icon: Shield,
    title: 'Tracking Prevention',
    text: 'Built-in controls to limit cross-site trackers and reduce passive data collection during everyday browsing.',
  },
  {
    icon: Filter,
    title: 'Network Filtering',
    text: 'Configurable network request filtering rules managed directly within your browser privacy settings.',
  },
  {
    icon: EyeOff,
    title: 'Private Browsing',
    text: 'Private browsing windows stay separated from normal session persistence so temporary sessions remain distinct.',
  },
  {
    icon: Trash2,
    title: 'Browsing-Data Clearing',
    text: 'Clear stored browsing history and session artifacts on demand whenever you want a clean slate.',
  },
  {
    icon: HardDrive,
    title: 'Local-First Architecture',
    text: 'NEXORA-owned browser preferences, bookmarks, and download records are structured to stay on your Windows device.',
  },
];

const DATA_STREAMS: { id: StorageLayerKey; label: string; detail: string }[] = [
  {
    id: 'sessions',
    label: 'Sessions',
    detail: 'Saved normal-mode tab and workspace session state managed by NEXORA XTINS.',
  },
  {
    id: 'bookmarks-history',
    label: 'Bookmarks & History',
    detail: 'User-saved bookmarks and local navigation history owned by the XTINS profile.',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    detail: 'Persistent native download metadata and file tracking records.',
  },
  {
    id: 'privacy-settings',
    label: 'Privacy Settings',
    detail: 'Tracking prevention preferences and per-profile privacy configurations.',
  },
  {
    id: 'adblock-settings',
    label: 'Ad-Block Settings',
    detail: 'Network filtering lists and custom rule toggles stored locally.',
  },
];

export function PrivacySection() {
  const [activeStream, setActiveStream] = useState<StorageLayerKey | null>('sessions');
  const [focusBoundary, setFocusBoundary] = useState<'nexora' | 'webview2'>('nexora');

  const activeItem = DATA_STREAMS.find((s) => s.id === activeStream);

  return (
    <section id="privacy" className="relative border-t border-slate-800/70 bg-[#070913] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-cyan-300">Privacy &amp; Local Storage Architecture</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Privacy That Stays Close to You
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            NEXORA XTINS combines practical browsing controls with a local-first storage model—keeping
            tracking prevention, private sessions, data clearing, and encrypted NEXORA-owned profile
            storage directly on your Windows machine.
          </p>
        </div>

        {/* Five Privacy Pillars */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PRIVACY_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800/90 bg-[#0b1020]/80 p-5"
              >
                <Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.text}</p>
              </div>
            );
          })}
        </div>

        {/* Encrypted Local Storage 3D Visualization */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-[#090d1b]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Interactive Legend & Architecture Explanation */}
            <div className="flex flex-col justify-between border-b border-slate-800 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>AES-256-GCM</span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span>Windows DPAPI</span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-bold text-white">
                  Protected NEXORA-Owned Persistent Storage
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  NEXORA-owned persistent browser data enters a local encryption layer protected with{' '}
                  <span className="font-mono text-cyan-200">AES-256-GCM</span> and{' '}
                  <span className="font-mono text-violet-200">Windows DPAPI</span>.
                </p>

                {/* Boundary Toggle */}
                <div className="mt-5 flex items-center gap-1 rounded-xl border border-slate-800 bg-[#060812] p-1">
                  <button
                    type="button"
                    onClick={() => setFocusBoundary('nexora')}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      focusBoundary === 'nexora'
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    NEXORA Protected Layer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFocusBoundary('webview2')}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      focusBoundary === 'webview2'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    WebView2 Boundary
                  </button>
                </div>

                {/* Data Streams List */}
                <div className="mt-5 space-y-2" role="group" aria-label="Encrypted storage data types">
                  {DATA_STREAMS.map((stream) => {
                    const active = activeStream === stream.id && focusBoundary === 'nexora';
                    return (
                      <button
                        key={stream.id}
                        type="button"
                        onClick={() => {
                          setFocusBoundary('nexora');
                          setActiveStream((prev) => (prev === stream.id ? null : stream.id));
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs transition-colors ${
                          active
                            ? 'border-cyan-400/55 bg-cyan-500/10 text-white'
                            : 'border-slate-800/90 bg-[#0b1020]/70 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-medium">{stream.label}</span>
                        <span className="font-mono text-[11px] text-cyan-300/80">
                          {active ? 'Inspecting' : 'Encrypted'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Architectural Boundary Notice */}
              <div className="mt-6 rounded-xl border border-slate-800 bg-[#060913] p-4">
                {focusBoundary === 'webview2' ? (
                  <p className="text-xs leading-relaxed text-slate-300">
                    <strong className="text-white">Storage Separation:</strong> Website data such as
                    third-party cookies, site cache, and web page storage is managed inside the
                    WebView2 runtime boundary and is distinct from NEXORA-owned encrypted local
                    storage.
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-slate-300">
                    <strong className="text-cyan-200">
                      {activeItem ? activeItem.label : 'All NEXORA-Owned Streams'}:
                    </strong>{' '}
                    {activeItem
                      ? activeItem.detail
                      : 'All five NEXORA-owned profile stores are sealed locally with AES-256-GCM and Windows DPAPI. Website/WebView2 storage remains separate.'}
                  </p>
                )}
              </div>
            </div>

            {/* Right 3D Vault Canvas */}
            <div className="relative h-[380px] sm:h-[460px] lg:col-span-7 lg:h-auto min-h-[420px]">
              <EncryptedStorageScene
                activeStream={activeStream}
                focusBoundary={focusBoundary}
              />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/90 bg-[#080c18]/90 px-4 py-2.5 text-xs text-slate-300">
                <span>
                  Left plane: <strong className="text-slate-200">WebView2 Website Storage</strong>
                </span>
                <span>
                  Right core: <strong className="text-cyan-300">AES-256-GCM · Windows DPAPI</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            NEXORA XTINS focuses on practical local control without exaggerated security claims.
          </p>
          <DownloadButton label="Download NEXORA XTINS" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
