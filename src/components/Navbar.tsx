import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { DownloadButton } from './DownloadButton';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Privacy Policy', href: './privacy.html' },
  { label: 'Experience', href: '#experience' },
  { label: 'Download', href: '#download' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4 pointer-events-none">
      <div className="mx-auto max-w-6xl pointer-events-auto">
        <div className="flex items-center justify-between gap-4 sm:gap-8 rounded-2xl border border-slate-700/50 bg-[#090c18]/88 px-4 py-2.5 sm:px-6 sm:py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            <BrandMark size={26} />
            <span>NEXORA XTINS</span>
          </a>

          {/* Zone 2: 5 concise single-line text links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300 whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Download Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <DownloadButton label="Download XTINS" variant="compact" />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/80 text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-white md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile responsive drawer */}
        {mobileOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="mt-2 rounded-2xl border border-slate-700/60 bg-[#090c18]/96 p-3 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800/70 hover:text-cyan-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
