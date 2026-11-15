import React, { createContext, useContext, useState } from 'react';
import { SITE_CONFIG, isPlaceholderUrl } from '../config/siteConfig';
import { X, ExternalLink, Download, FileCode2 } from 'lucide-react';

interface NoticeInfo {
  title: string;
  label: string;
  placeholderKey: string;
  description: string;
}

interface ConfigNoticeContextValue {
  handleConfiguredAction: (
    e: React.MouseEvent<HTMLElement>,
    url: string,
    info: NoticeInfo,
  ) => void;
}

const ConfigNoticeContext = createContext<ConfigNoticeContextValue | null>(null);

export function ConfigNoticeProvider({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState<NoticeInfo | null>(null);

  const handleConfiguredAction = (
    e: React.MouseEvent<HTMLElement>,
    url: string,
    info: NoticeInfo,
  ) => {
    if (isPlaceholderUrl(url)) {
      e.preventDefault();
      setNotice(info);
    }
  };

  return (
    <ConfigNoticeContext.Provider value={{ handleConfiguredAction }}>
      {children}

      {notice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-notice-title"
          onClick={() => setNotice(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-700/80 bg-[#0c1020] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300">
                  {notice.placeholderKey === 'XTINS_DOWNLOAD_URL' ? (
                    <Download className="h-5 w-5" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 id="config-notice-title" className="text-lg font-semibold text-white">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-400">{notice.label}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotice(null)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">{notice.description}</p>

            <div className="mt-4 rounded-lg border border-slate-800 bg-[#070913] p-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileCode2 className="h-4 w-4 text-cyan-400" />
                <span>Configuration target</span>
              </div>
              <code className="mt-1.5 block break-all font-mono text-xs text-cyan-300">
                src/config/siteConfig.ts → {notice.placeholderKey}
              </code>
              <p className="mt-1.5 font-mono text-[11px] text-slate-500">
                Current value: &quot;
                {notice.placeholderKey === 'XTINS_DOWNLOAD_URL'
                  ? SITE_CONFIG.downloadUrl
                  : notice.placeholderKey === 'SITE_CONFIG.githubUrl'
                    ? SITE_CONFIG.githubUrl
                    : notice.placeholderKey === 'SITE_CONFIG.contactUrl'
                      ? SITE_CONFIG.contactUrl
                      : SITE_CONFIG.termsUrl}
                &quot;
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 whitespace-nowrap shrink-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfigNoticeContext.Provider>
  );
}

export function useConfigNotice() {
  const ctx = useContext(ConfigNoticeContext);
  if (!ctx) {
    throw new Error('useConfigNotice must be used inside ConfigNoticeProvider');
  }
  return ctx;
}
