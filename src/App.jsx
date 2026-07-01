import React, { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import CustomCursor from './components/CustomCursor';
import AuroraBackground from './components/AuroraBackground';
import VoiceAssistant from './components/VoiceAssistant';
import useTheme from './hooks/useTheme';
import useVisitNotifier from './hooks/useVisitNotifier';
import Hero from './sections/Hero';

const About = lazy(() => import('./sections/About'));
const Projects = lazy(() => import('./sections/Projects'));
const TechStack = lazy(() => import('./sections/TechStack'));
const GitHubStats = lazy(() => import('./sections/GitHubStats'));
const LeetCodeStats = lazy(() => import('./sections/LeetCodeStats'));
const Education = lazy(() => import('./sections/Education'));
const Certifications = lazy(() => import('./sections/Certifications'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  useVisitNotifier();
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
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted">Loading...</p>
              </div>
            </div>
          }>
            <About theme={theme} />
            <Projects />
            <TechStack />
            <GitHubStats />
            <LeetCodeStats />
            <VoiceAssistant />
            <Education />
            <Certifications />
            <Contact />
            <Footer />
          </Suspense>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
