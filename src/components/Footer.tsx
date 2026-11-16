import React from 'react';
import { BrandMark } from './BrandMark';
import { SITE_CONFIG, isPlaceholderUrl } from '../config/siteConfig';
import { useConfigNotice } from '../context/ConfigNoticeContext';

export function Footer() {
  const { handleConfiguredAction } = useConfigNotice();
  const currentYear = new Date().getFullYear();

  const handleExternalPlaceholder = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    title: string,
    key: string,
  ) => {
    handleConfiguredAction(e, url, {
      title,
      label: `NEXORA XTINS · ${title}`,
      placeholderKey: key,
      description: `Update ${key} in src/config/siteConfig.ts to connect this footer link to its official destination.`,
    });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#05060b] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark size={26} />
              <span className="font-display text-lg font-bold text-white">NEXORA XTINS</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Your web. Your privacy. Your control.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300"
          >
            <a
              href={isPlaceholderUrl(SITE_CONFIG.downloadUrl) ? '#download' : SITE_CONFIG.downloadUrl}
              onClick={(e) =>
                handleConfiguredAction(e, SITE_CONFIG.downloadUrl, {
                  title: 'Official Windows Installer Link',
                  label: 'NEXORA XTINS · Central Download URL',
                  placeholderKey: 'XTINS_DOWNLOAD_URL',
                  description:
                    'Replace XTINS_DOWNLOAD_URL in src/config/siteConfig.ts with the official NEXORA XTINS Windows installer URL.',
                })
              }
              download={!isPlaceholderUrl(SITE_CONFIG.downloadUrl) ? true : undefined}
              className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200 whitespace-nowrap"
            >
              Download XTINS
            </a>
            <a href="#features" className="transition-colors hover:text-white whitespace-nowrap">
              Features
            </a>
            <a href="./privacy.html" className="transition-colors hover:text-white whitespace-nowrap">
              Privacy
            </a>
            <a
              href={isPlaceholderUrl(SITE_CONFIG.termsUrl) ? '#terms' : SITE_CONFIG.termsUrl}
              onClick={(e) =>
                handleExternalPlaceholder(e, SITE_CONFIG.termsUrl, 'Terms of Use', 'SITE_CONFIG.termsUrl')
              }
              rel={!isPlaceholderUrl(SITE_CONFIG.termsUrl) ? 'noopener noreferrer' : undefined}
              className="transition-colors hover:text-white whitespace-nowrap"
            >
              Terms
            </a>
            <a
              href={isPlaceholderUrl(SITE_CONFIG.contactUrl) ? '#contact' : SITE_CONFIG.contactUrl}
              onClick={(e) =>
                handleExternalPlaceholder(e, SITE_CONFIG.contactUrl, 'Contact NEXORA', 'SITE_CONFIG.contactUrl')
              }
              rel={!isPlaceholderUrl(SITE_CONFIG.contactUrl) ? 'noopener noreferrer' : undefined}
              className="transition-colors hover:text-white whitespace-nowrap"
            >
              Contact
            </a>
            <a
              href={isPlaceholderUrl(SITE_CONFIG.githubUrl) ? '#github' : SITE_CONFIG.githubUrl}
              onClick={(e) =>
                handleExternalPlaceholder(e, SITE_CONFIG.githubUrl, 'GitHub Repository', 'SITE_CONFIG.githubUrl')
              }
              rel={!isPlaceholderUrl(SITE_CONFIG.githubUrl) ? 'noopener noreferrer' : undefined}
              className="transition-colors hover:text-white whitespace-nowrap"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} NEXORA XTINS</p>
          <p>Windows Desktop Browser · Built by NEXORA</p>
        </div>
      </div>
    </footer>
  );
}
