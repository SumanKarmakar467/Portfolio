import React, { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import CustomCursor from './components/CustomCursor';
import useTheme from './hooks/useTheme';
import useVisitNotifier from './hooks/useVisitNotifier';

const Hero = lazy(() => import('./sections/Hero'));
const About = lazy(() => import('./sections/About'));
const Projects = lazy(() => import('./sections/Projects'));
const TechStack = lazy(() => import('./sections/TechStack'));
const Education = lazy(() => import('./sections/Education'));
const Certifications = lazy(() => import('./sections/Certifications'));
const GitHubStats = lazy(() => import('./sections/GitHubStats'));
const Contact = lazy(() => import('./sections/Contact'));
const Footer = lazy(() => import('./sections/Footer'));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  useVisitNotifier();

  return (
    <div className={`min-h-screen ${theme}`}>
      <ScrollProgress />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
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
          <Education />
          <Certifications />
          <GitHubStats />
          <Contact />
          <Footer />
        </Suspense>
      </main>

      <BackToTop />
    </div>
  );
}
