import React from 'react';
import { Download } from 'lucide-react';
import { SITE_CONFIG, isPlaceholderUrl } from '../config/siteConfig';
import { useConfigNotice } from '../context/ConfigNoticeContext';

interface DownloadButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  className?: string;
  showIcon?: boolean;
}

export function DownloadButton({
  label = 'Download NEXORA XTINS',
  variant = 'primary',
  className = '',
  showIcon = true,
}: DownloadButtonProps) {
  const { handleConfiguredAction } = useConfigNotice();
  const isPlaceholder = isPlaceholderUrl(SITE_CONFIG.downloadUrl);

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400';

  const variantStyles = {
    primary:
      'rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-6 py-3.5 text-sm sm:text-base text-white shadow-[0_0_28px_rgba(139,92,246,0.35)] hover:brightness-110 active:scale-[0.99]',
    secondary:
      'rounded-xl border border-violet-400/35 bg-violet-500/15 px-5 py-3 text-sm font-semibold text-slate-100 hover:border-cyan-400/50 hover:bg-violet-500/25',
    compact:
      'rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-xs sm:text-sm text-white shadow-[0_0_18px_rgba(139,92,246,0.28)] hover:brightness-110',
  }[variant];

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleConfiguredAction(e, SITE_CONFIG.downloadUrl, {
      title: 'Official Windows Installer Link',
      label: 'NEXORA XTINS · Central Download URL',
      placeholderKey: 'XTINS_DOWNLOAD_URL',
      description:
        'This button is wired to the single central download configuration. Replace XTINS_DOWNLOAD_URL with the official NEXORA XTINS Windows installer URL to activate direct downloads across the entire site.',
    });
  };

  return (
    <a
      href={isPlaceholder ? '#download' : SITE_CONFIG.downloadUrl}
      onClick={onClick}
      download={!isPlaceholder ? true : undefined}
      rel={!isPlaceholder ? 'noopener noreferrer' : undefined}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {showIcon && <Download className={variant === 'compact' ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'} aria-hidden="true" />}
      <span>{label}</span>
    </a>
  );
}
