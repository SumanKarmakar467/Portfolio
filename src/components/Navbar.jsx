import React, { useEffect, useState } from 'react';
import ResumePreviewLink from './ResumePreviewLink';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#techstack' },
  { label: 'GitHub', href: '#github' },
  { label: 'LeetCode', href: '#leetcode' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbr({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <a href="#hero" className="flex min-w-0 items-center">
            <span className="truncate font-space font-semibold text-base sm:text-lg">Suman Karmakar</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link text-muted hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
            <ResumePreviewLink className="btn btn-outline text-sm px-4 py-2">
              Resume
            </ResumePreviewLink>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </nav>

          <button
            className="md:hidden rounded-xl border border-border bg-surface/80 p-2 shadow-sm"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-text transition-all duration-300 ${
                  open ? 'rotate-45 translate-y-1' : '-translate-y-1'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-text transition-all duration-300 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-text transition-all duration-300 ${
                  open ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                }`}
              />
            </div>
          </button>
        </div>

        <div className={`md:hidden mobile-menu-collapse ${open ? 'is-open' : ''}`}>
          <div className="mt-3 rounded-2xl border border-border bg-surface/95 p-3 shadow-2xl backdrop-blur-xl">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-3">
                <ResumePreviewLink
                  className="btn btn-outline flex-1 justify-center text-sm px-4 py-2"
                  onClick={() => setOpen(false)}
                >
                  Resume
                </ResumePreviewLink>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
