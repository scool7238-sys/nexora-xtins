import { useState } from 'react';
import {
  ShieldCheck,
  EyeOff,
  Download,
  FolderKanban,
  Pin,
  Search,
  Palette,
  Lock,
} from 'lucide-react';
import { DownloadButton } from '../components/DownloadButton';

interface FeatureItem {
  id: string;
  title: string;
  summary: string;
  detail: string;
  icon: typeof ShieldCheck;
  span?: 'wide' | 'normal';
}

const VERIFIED_FEATURES: FeatureItem[] = [
  {
    id: 'privacy-shields',
    title: 'Privacy Shields',
    summary: 'Tracking prevention and network ad-blocking controls.',
    detail:
      'Enable Balanced tracking prevention and bundled network ad-blocking rules directly inside the NEXORA XTINS Privacy Dashboard, alongside one-click browsing-data clearing.',
    icon: ShieldCheck,
    span: 'wide',
  },
  {
    id: 'private-browsing',
    title: 'Private Browsing',
    summary: 'Private browsing sessions are separated from normal browsing session persistence.',
    detail:
      'Launch Incognito directly from the top tab bar without mixing private session activity into your standard XTINS browsing persistence.',
    icon: EyeOff,
  },
  {
    id: 'smart-downloads',
    title: 'Smart Downloads',
    summary: 'Native download management with persistent download information.',
    detail:
      'Access the dedicated Downloads view from the navigation rail or top toolbar to review saved files and clear finished items.',
    icon: Download,
  },
  {
    id: 'tab-groups',
    title: 'Tab Groups',
    summary: 'Create, rename, color, collapse, expand, and move tabs between groups.',
    detail:
      'Use + Group right from the tab bar to organize open tabs into labeled, color-coded groups you can collapse, expand, and edit.',
    icon: FolderKanban,
    span: 'wide',
  },
  {
    id: 'pinned-tabs',
    title: 'Pinned Tabs',
    summary: 'Keep important tabs accessible.',
    detail:
      'Anchor essential web apps and references in your tab strip so they stay compact and immediately reachable.',
    icon: Pin,
  },
  {
    id: 'search-engines',
    title: 'Multiple Search Engines',
    summary: 'Choose between supported search engines.',
    detail:
      'Switch your active search engine directly from the Quick Control bar on XTINS Home.',
    icon: Search,
  },
  {
    id: 'custom-themes',
    title: 'Custom Themes',
    summary: 'Switch between AUROUS and AETHER.',
    detail:
      'Toggle between AUROUS (cosmic interface) and AETHER (glass interface) using the built-in switcher in the top window bar.',
    icon: Palette,
  },
  {
    id: 'encrypted-storage',
    title: 'Encrypted Local Storage',
    summary: 'NEXORA-owned persistent browser data is protected with encrypted local storage.',
    detail:
      'Uses AES-256-GCM and Windows DPAPI for NEXORA-owned persistent data (sessions, bookmarks/history, downloads, privacy and ad-block settings). Website and WebView2 storage remain separate.',
    icon: Lock,
    span: 'wide',
  },
];

export function FeaturesSection() {
  const [selectedId, setSelectedId] = useState<string>(VERIFIED_FEATURES[0].id);
  const selected = VERIFIED_FEATURES.find((f) => f.id === selectedId) ?? VERIFIED_FEATURES[0];

  return (
    <section id="features" className="relative border-t border-slate-800/70 bg-[#06070d] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-cyan-300">Verified Capabilities</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Features built for real browser control
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Select any capability below to inspect how NEXORA XTINS structures privacy, tab
              organization, downloads, and customization on Windows.
            </p>
          </div>

          <DownloadButton label="Get XTINS" variant="primary" />
        </div>

        {/* Interactive Feature Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VERIFIED_FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isSelected = feature.id === selectedId;
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setSelectedId(feature.id)}
                className={`group text-left rounded-2xl border p-6 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  feature.span === 'wide' ? 'lg:col-span-2' : ''
                } ${
                  isSelected
                    ? 'border-cyan-400/60 bg-[#0e1529] shadow-[0_0_28px_rgba(34,211,238,0.08)]'
                    : 'border-slate-800/90 bg-[#0a0f1f]/75 hover:border-violet-500/45 hover:bg-[#0d1326]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-300'
                        : 'border-slate-700/70 bg-slate-900 text-violet-300 group-hover:text-cyan-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {isSelected ? 'Selected' : 'Inspect'}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Active Feature Detail Strip */}
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-violet-500/30 bg-[#0c1124] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-cyan-300">Capability Detail · {selected.title}</p>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-200">
              {selected.detail}
            </p>
          </div>
          <DownloadButton label="Get XTINS" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
