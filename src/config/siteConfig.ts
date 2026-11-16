/**
 * CENTRAL SITE & DOWNLOAD CONFIGURATION
 * ============================================================================
 * Update the placeholder URLs below before publishing to GitHub Pages.
 * Every Download CTA, footer link, and FAQ reference across the website
 * reads directly from this single configuration object.
 */

export const XTINS_DOWNLOAD_URL = "https://github.com/scool7238-sys/nexora-xtins/releases/download/v2.0.0/NEXORA.XTINS_2.0.0_x64-setup.exe";

export interface SiteConfig {
  productName: string;
  tagline: string;
  platformLabel: string;
  downloadUrl: string;
  githubUrl: string;
  contactUrl: string;
  termsUrl: string;
  privacyUrl: string;
  pricingAnswer: string;
}

export const SITE_CONFIG: SiteConfig = {
  productName: "NEXORA XTINS",
  tagline: "Your web. Your privacy. Your control.",
  platformLabel: "Windows Desktop Browser",

  // Replace with the official NEXORA XTINS Windows installer URL
  downloadUrl: XTINS_DOWNLOAD_URL,

  // Replace with official repository, contact, and legal URLs when ready
  githubUrl: "REPLACE_WITH_GITHUB_URL",
  contactUrl: "REPLACE_WITH_CONTACT_URL",
  termsUrl: "REPLACE_WITH_TERMS_URL",
  privacyUrl: "./privacy.html",

  // Replace with official licensing / pricing details when finalized
  pricingAnswer:
    "Pricing and licensing details will be published on the official NEXORA XTINS release page.",
};

export function isPlaceholderUrl(url: string): boolean {
  return !url || url.startsWith("REPLACE_WITH_");
}

/**
 * Authoritative product screenshots mapped to relative paths for GitHub Pages compatibility.
 */
export const PRODUCT_SCREENSHOTS = {
  aurousHome: "./assets/aistudio/image_64121c10.png",
  aetherHome: "./assets/aistudio/image_9887f6d9.png",
  privacyDashboard: "./assets/aistudio/image_f7938ada.png",
  downloadsPanel: "./assets/aistudio/image_d72174b9.png",
  chromeStrip: "./assets/aistudio/image_896b213a.png",
} as const;

export interface ScreenshotSlot {
  id:
    | "home"
    | "tabs"
    | "tab-groups"
    | "privacy-dashboard"
    | "download-manager"
    | "aurous"
    | "aether";
  label: string;
  title: string;
  caption: string;
  /**
   * Relative path to the real screenshot asset, or null to show an architectural placeholder.
   */
  imageSrc: string | null;
  altText: string;
}

export const SCREENSHOT_SLOTS: ScreenshotSlot[] = [
  {
    id: "home",
    label: "XTINS Home",
    title: "XTINS Home Surface",
    caption:
      "Deep-space start workspace with address search, Quick Access shortcuts, Local Time widget, and Quick Control bar.",
    imageSrc: PRODUCT_SCREENSHOTS.aurousHome,
    altText:
      "NEXORA XTINS Home interface showing the search bar, Quick Access shortcuts, Local Time widget, and Quick Control bar",
  },
  {
    id: "tabs",
    label: "Browser Tabs",
    title: "Navigation Bar, Tabs & Incognito",
    caption:
      "Top titlebar with AUROUS/AETHER switcher, tab strip, Incognito toggle, + Group button, and unified address bar.",
    imageSrc: PRODUCT_SCREENSHOTS.chromeStrip,
    altText:
      "Close-up of the NEXORA XTINS browser navigation bar, AUROUS/AETHER toggle, tab strip, Incognito button, and + Group control",
  },
  {
    id: "tab-groups",
    label: "Tab Groups",
    title: "Multi-Tab Workspace & Tab Groups",
    caption:
      "Organize active browsing sessions alongside color-coded tab groups such as the study group across multiple open tabs.",
    imageSrc: PRODUCT_SCREENSHOTS.downloadsPanel,
    altText:
      "NEXORA XTINS multi-tab header showing New Tab, the purple study tab group, YouTube, Google, and Wikipedia tabs",
  },
  {
    id: "privacy-dashboard",
    label: "Privacy Dashboard",
    title: "NEXORA XTINS Privacy Dashboard",
    caption:
      "Manage Tracking Prevention, Network Ad Blocking, and Clear Browsing Data from a single dedicated dashboard.",
    imageSrc: PRODUCT_SCREENSHOTS.privacyDashboard,
    altText:
      "NEXORA XTINS Privacy Dashboard showing Tracking Prevention, Network Ad Blocking, Site Permissions status, and Clear Browsing Data controls",
  },
  {
    id: "download-manager",
    label: "Download Manager",
    title: "Downloads Panel",
    caption:
      "Dedicated Downloads view accessible from the left navigation rail and top toolbar with quick Clear finished controls.",
    imageSrc: PRODUCT_SCREENSHOTS.downloadsPanel,
    altText:
      "NEXORA XTINS Downloads view alongside the left sidebar rail and multi-tab workspace header",
  },
  {
    id: "aurous",
    label: "AUROUS Theme",
    title: "AUROUS Cosmic Interface",
    caption:
      "Deep-space dark navy atmosphere with luminous violet-cyan accents and subtle cosmic starfield depth.",
    imageSrc: PRODUCT_SCREENSHOTS.aurousHome,
    altText:
      "NEXORA XTINS running the AUROUS cosmic theme with deep-space background and luminous gradient wordmark",
  },
  {
    id: "aether",
    label: "AETHER Theme",
    title: "AETHER Glass Interface",
    caption:
      "Framed translucent glass container over a calm atmospheric canvas with clean surface contrast.",
    imageSrc: PRODUCT_SCREENSHOTS.aetherHome,
    altText:
      "NEXORA XTINS running the AETHER glass theme with translucent framed workspace card",
  },
];
