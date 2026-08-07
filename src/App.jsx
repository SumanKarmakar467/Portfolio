import React, { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import CustomCursor from './components/CustomCursor';
import AuroraBackground from './components/AuroraBackground';
import VoiceAssistant from './components/VoiceAssistant';
import useTheme from './hooks/useTheme';
import useVisitNotifier from './hooks/useVisitNotifier';
import useSmoothScroll from './hooks/useSmoothScroll';
import Hero from './sections/Hero';

const About = lazy(() => import('./sections/About'));
const Experience = lazy(() => import('./sections/Experience'));
const Projects = lazy(() => import('./sections/Projects'));
const TechStack = lazy(() => import('./sections/TechStack'));
const GitHubStats = lazy(() => import('./sections/GitHubStats'));
const LeetCodeStats = lazy(() => import('./sections/LeetCodeStats'));
const Education = lazy(() => import('./sections/Education'));
const Certifications = lazy(() => import('./sections/Certifications'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));

const SECTION_FALLBACK = (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

export default function App() {
  const { theme, toggleTheme } = useTheme();
  useVisitNotifier();
  useSmoothScroll();
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    let timeoutId;
    let idleId;

    const revealSections = () => setShowDeferredSections(true);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(revealSections, { timeout: 1600 });
    } else {
      timeoutId = window.setTimeout(revealSections, 1000);
    }

    return () => {
      if (idleId) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className={`min-h-screen relative z-0 ${theme}`}>
      <AuroraBackground theme={theme} />
      <ScrollProgress />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        {showDeferredSections && (
          <>
            <Suspense fallback={SECTION_FALLBACK}>
              <About />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <Experience />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <Projects />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <TechStack />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <GitHubStats />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <LeetCodeStats />
            </Suspense>
            <Suspense fallback={null}>
              <VoiceAssistant />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <Education />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <Certifications />
            </Suspense>
            <Suspense fallback={SECTION_FALLBACK}>
              <Contact />
            </Suspense>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
