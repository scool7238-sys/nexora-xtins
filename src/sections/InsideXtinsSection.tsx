import React, { useState } from 'react';
import { ImageOff, Maximize2, Monitor, X } from 'lucide-react';
import { SCREENSHOT_SLOTS, ScreenshotSlot } from '../config/siteConfig';
import { DownloadButton } from '../components/DownloadButton';

function PlaceholderSchematic({ slot }: { slot: ScreenshotSlot }) {
  return (
    <div className="flex h-full min-h-[320px] sm:min-h-[420px] w-full flex-col justify-between rounded-xl border border-dashed border-slate-700/90 bg-[#080c18] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Monitor className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          <span className="font-display text-sm font-semibold text-white">{slot.title}</span>
        </div>
        <span className="font-mono text-xs text-amber-300/90">
          Screenshot Placeholder · Capture Not Yet Supplied
        </span>
      </div>

      <div className="my-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-800/90 bg-[#0b1020]/70 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400">
          <ImageOff className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-slate-200">
          {slot.label} Capture Slot
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">{slot.caption}</p>
      </div>
    </div>
  );
}

export function InsideXtinsSection() {
  const [activeId, setActiveId] = useState<ScreenshotSlot['id']>(SCREENSHOT_SLOTS[0].id);
  const [imgErrorIds, setImgErrorIds] = useState<Record<string, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const activeSlot = SCREENSHOT_SLOTS.find((s) => s.id === activeId) ?? SCREENSHOT_SLOTS[0];
  const showImage = Boolean(activeSlot.imageSrc) && !imgErrorIds[activeSlot.id];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    // Keep perspective ultra-gentle so UI text remains razor-sharp
    setTilt({ rx: -ny * 2.2, ry: nx * 2.8 });
  };

  return (
    <section
      id="inside-xtins"
      className="relative border-t border-slate-800/70 bg-[#06070d] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-cyan-300">Inside XTINS</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See XTINS in action
            </h2>
            <p className="mt-4 text-base text-slate-300">
              Explore real captures of the NEXORA XTINS Windows desktop browser across Home,
              navigation chrome, tab groups, Privacy Dashboard, Downloads, AUROUS, and AETHER.
            </p>
          </div>

          <DownloadButton label="Download NEXORA XTINS" variant="primary" />
        </div>

        {/* Category Switcher */}
        <div
          className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-[#0a0e1c] p-2"
          role="tablist"
          aria-label="XTINS interface screenshot categories"
        >
          {SCREENSHOT_SLOTS.map((slot) => {
            const active = slot.id === activeSlot.id;
            return (
              <button
                key={slot.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveId(slot.id)}
                className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>

        {/* Active Display Frame with Gentle Perspective Depth */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#090d1a] p-4 sm:p-6">
          {showImage && activeSlot.imageSrc ? (
            <div>
              <div
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
                className="relative overflow-hidden rounded-xl border border-violet-500/25 bg-[#050711] shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
                style={{ perspective: '1400px' }}
              >
                <div
                  className="transition-transform duration-200 ease-out"
                  style={{
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  }}
                >
                  <img
                    src={activeSlot.imageSrc}
                    alt={activeSlot.altText}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() =>
                      setImgErrorIds((prev) => ({ ...prev, [activeSlot.id]: true }))
                    }
                    className="block h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {activeSlot.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{activeSlot.caption}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0b1020] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-white whitespace-nowrap shrink-0"
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                    <span>Inspect Full View</span>
                  </button>
                  <DownloadButton label="Get XTINS" variant="compact" />
                </div>
              </div>
            </div>
          ) : (
            <PlaceholderSchematic slot={activeSlot} />
          )}
        </div>
      </div>

      {/* Full-Resolution Screenshot Lightbox */}
      {lightboxOpen && showImage && activeSlot.imageSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeSlot.title}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-6xl rounded-2xl border border-slate-700/80 bg-[#080c18] p-3 sm:p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-3 px-1">
              <div>
                <p className="font-display text-base font-semibold text-white">
                  {activeSlot.title}
                </p>
                <p className="text-xs text-slate-400">{activeSlot.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close full view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#05070e]">
              <img
                src={activeSlot.imageSrc}
                alt={activeSlot.altText}
                referrerPolicy="no-referrer"
                className="block max-h-[78vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
