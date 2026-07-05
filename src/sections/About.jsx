import React from 'react';
import CountUp from 'react-countup';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionAccent3D from '../components/SectionAccent3D';
import './About.css';

const STAT_ICONS = {
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c3.2 1.6 5 5 5 9 0 2-.6 3.8-1.6 5.2L12 20l-3.4-3.3C7.6 15.3 7 13.5 7 11.5c0-4 1.8-7.4 5-9Z" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M9 17.5 7 21M15 17.5l2 3.5" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13 6l-2 12" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.2 13.5-1.4 7 5.2-2.6 5.2 2.6-1.4-7" />
    </svg>
  ),
};

export default function About({ theme }) {
  const { ref, hasIntersected } = useIntersectionObserver();
  const profileImage = theme === 'dark' ? '/profile/dark-theme.jpg' : '/profile/light-theme.jpg';

  const stats = [
    { label: 'Projects Built', value: 15, suffix: '+', icon: 'rocket' },
    { label: 'Tech Skills', value: 20, suffix: '+', icon: 'code' },
    { label: 'Years Learning', value: 4, suffix: '+', icon: 'clock' },
    { label: 'Certificates', value: 4, suffix: '', icon: 'award' },
  ];

  const strengths = [
    { label: 'Problem Solving', tone: 'primary' },
    { label: 'Team Collaboration', tone: 'secondary' },
    { label: 'Clean Code', tone: 'primary' },
    { label: 'Continuous Learning', tone: 'secondary' },
  ];

  const reveal = () => `about-reveal ${hasIntersected ? 'is-visible' : ''}`;
  const revealStyle = (delay = 0) => ({ transitionDelay: `${delay}ms` });

  return (
    <section id="about" className="section bg-surface" ref={ref}>
      <div className="container">
        <div className={`text-center mb-16 ${reveal()}`} style={revealStyle(0)}>
          <div className="flex items-center justify-center gap-3">
            <SectionAccent3D />
            <h2 className="section-title">About Me</h2>
          </div>
          <p className="section-subtitle">
            Passionate full stack developer focused on modern frontend and robust backend engineering
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={reveal()} style={revealStyle(80)}>
            <div className="about-photo-wrap">
              <div className="about-photo-ring">
                <div className="about-photo-inner">
                  <img
                    src={profileImage}
                    alt={theme === 'dark' ? 'Suman portrait for dark theme' : 'Suman portrait for light theme'}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
              <span className="about-photo-badge">
                <span className="about-photo-badge-dot" />
                <span className="about-photo-badge-text">Full Stack Developer</span>
              </span>
            </div>
          </div>

          <div className={`space-y-6 ${reveal()}`} style={revealStyle(160)}>
            <div>
              <h3 className="text-2xl font-space font-semibold mb-4 text-primary">
                Passionate MERN Stack Developer
              </h3>
              <p className="text-muted leading-relaxed mb-4">
                I specialize in creating modern, responsive, and user-friendly web applications. With
                hands-on experience in Java ecosystem, React for dynamic frontends, and Node.js plus
                MongoDB for scalable backends, I enjoy turning complex ideas into practical solutions.
              </p>
              <p className="text-muted leading-relaxed">
                My goal is to keep learning new technologies and apply best practices to build
                high-quality software with clean architecture and strong user experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {strengths.map((item) => (
                <span key={item.label} className="about-strength-chip">
                  <span
                    className="about-strength-dot"
                    style={{ background: `var(--${item.tone})` }}
                  />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`about-stat-card ${reveal()}`}
              style={revealStyle(240 + index * 80)}
            >
              <span className="about-stat-icon">{STAT_ICONS[stat.icon]}</span>
              <div className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-1">
                {hasIntersected && (
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix} delay={index * 0.2} />
                )}
              </div>
              <div className="text-muted text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
