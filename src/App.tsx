import { ConfigNoticeProvider } from './context/ConfigNoticeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { ProductIntroSection } from './sections/ProductIntroSection';
import { WhyXtinsSection } from './sections/WhyXtinsSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { PrivacySection } from './sections/PrivacySection';
import { InsideXtinsSection } from './sections/InsideXtinsSection';
import { ThemeShowcaseSection } from './sections/ThemeShowcaseSection';
import { ScrollBrowserExperience } from './sections/ScrollBrowserExperience';
import { PerformanceAndAboutSection } from './sections/PerformanceAndAboutSection';
import { DownloadSection } from './sections/DownloadSection';
import { FaqSection } from './sections/FaqSection';
import { FinalCtaSection } from './sections/FinalCtaSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ConfigNoticeProvider>
      <div className="min-h-screen bg-[#06070d] text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content">
          <HeroSection />
          <ProductIntroSection />
          <WhyXtinsSection />
          <FeaturesSection />
          <PrivacySection />
          <InsideXtinsSection />
          <ThemeShowcaseSection />
          <ScrollBrowserExperience />
          <PerformanceAndAboutSection />
          <DownloadSection />
          <FaqSection />
          <FinalCtaSection />
        </main>

        <Footer />
      </div>
    </ConfigNoticeProvider>
  );
}
