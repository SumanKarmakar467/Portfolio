import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { techStack } from '../constants/techStack';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './TechStack.css';

const PROJECT_SEARCH_EVENT = 'portfolio-project-search';
const ALL_FILTER = 'all';
const CATEGORY_CONFIG = [
  { id: 'frontend', label: 'Frontend', sources: ['frontend'] },
  { id: 'backend', label: 'Backend', sources: ['backend'] },
  { id: 'databaseTools', label: 'Database & Tools', sources: ['database', 'tools'] },
  { id: 'ai', label: 'AI Toolkit', sources: ['ai'] },
];

const ICON_CONFIG = {
  HTML: { slug: 'html5', color: 'E34F26' },
  CSS: { slug: 'css3', color: '1572B6' },
  JavaScript: { slug: 'javascript', color: 'F7DF1E' },
  React: { slug: 'react', color: '61DAFB' },
  'Tailwind CSS': { slug: 'tailwindcss', color: '06B6D4' },
  'Responsive Design': { slug: 'css3', color: '1572B6' },
  Java: { slug: 'openjdk', color: 'F89820' },
  'Spring Boot': { slug: 'springboot', color: '6DB33F' },
  'Node.js': { slug: 'nodedotjs', color: '339933' },
  Express: { slug: 'express', color: 'FFFFFF' },
  'REST APIs': { slug: 'postman', color: 'FF6C37' },
  MongoDB: { slug: 'mongodb', color: '47A248' },
  MySQL: { slug: 'mysql', color: '4479A1' },
  PostgreSQL: { slug: 'postgresql', color: '4169E1' },
  'AWS Basics': { slug: 'amazonwebservices', color: 'FF9900' },
  ChatGPT: { slug: 'openai', color: '74AA9C' },
  Blackbox: { slug: 'visualstudiocode', color: '007ACC' },
  Gemini: { slug: 'googlegemini', color: '8E75FF' },
  Codex: { slug: 'openai', color: '74AA9C' },
  'GitHub Copilot': { slug: 'githubcopilot', color: 'FFFFFF' },
  Git: { slug: 'git', color: 'F05032' },
  GitHub: { slug: 'github', color: 'FFFFFF' },
  Netlify: { slug: 'netlify', color: '00C7B7' },
  Vercel: { slug: 'vercel', color: 'FFFFFF' },
};

function getOfficialIconUrl(name) {
  const icon = ICON_CONFIG[name];
  return icon ? `https://cdn.simpleicons.org/${icon.slug}/${icon.color}` : '';
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function playHoverTune(audioContext) {
  const now = audioContext.currentTime;
  const riff = [
    { midi: 42, time: 0.0, duration: 0.12 },
    { midi: 42, time: 0.13, duration: 0.11 },
    { midi: 45, time: 0.27, duration: 0.12 },
    { midi: 42, time: 0.43, duration: 0.14 },
    { midi: 40, time: 0.62, duration: 0.19 },
  ];

  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.032, now + 0.02);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
  masterGain.connect(audioContext.destination);

  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(1420, now);
  lowpass.Q.setValueAtTime(0.8, now);
  lowpass.connect(masterGain);

  riff.forEach((note) => {
    const start = now + note.time;
    const end = start + note.duration;
    const osc = audioContext.createOscillator();
    const noteGain = audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(midiToFrequency(note.midi), start);
    noteGain.gain.setValueAtTime(0.0001, start);
    noteGain.gain.exponentialRampToValueAtTime(0.38, start + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(noteGain);
    noteGain.connect(lowpass);
    osc.start(start);
    osc.stop(end + 0.02);

    osc.onended = () => {
      noteGain.disconnect();
      osc.disconnect();
    };
  });

  window.setTimeout(() => {
    lowpass.disconnect();
    masterGain.disconnect();
  }, 1200);
}

function CategoryIcon({ categoryId }) {
  if (categoryId === 'frontend') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="12" rx="2.2" />
        <path d="M9 19.5h6" />
        <path d="M12 16.5v3" />
      </svg>
    );
  }

  if (categoryId === 'backend') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="4" width="17" height="6.5" rx="1.8" />
        <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.8" />
        <path d="M7.5 7.2h.01" />
        <path d="M7.5 16.8h.01" />
        <path d="M11 7.2h2.2" />
        <path d="M11 16.8h2.2" />
      </svg>
    );
  }

  if (categoryId === 'databaseTools') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="5.5" rx="8.5" ry="3" />
        <path d="M3.5 5.5v6c0 1.6 3.8 3 8.5 3s8.5-1.4 8.5-3v-6" />
        <path d="M3.5 11.5v6c0 1.6 3.8 3 8.5 3s8.5-1.4 8.5-3v-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5 14.4 8l5.8.8-4.2 4.1 1 5.8L12 15.9 7 18.7l1-5.8L3.8 8.8 9.6 8Z" />
    </svg>
  );
}

export default function TechStack() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, rootMargin: '120px 0px' });
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const audioContextRef = useRef(null);
  const lastHoverRef = useRef({ key: '', time: 0 });

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }, []);

  const unlockAudio = useCallback(() => {
    const context = getAudioContext();
    if (context?.state === 'suspended') {
      context.resume().catch(() => {});
    }
  }, [getAudioContext]);

  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [unlockAudio]);

  const handleSkillHover = useCallback(
    (skillName) => {
      const now = performance.now();
      if (lastHoverRef.current.key === skillName && now - lastHoverRef.current.time < 150) return;
      lastHoverRef.current = { key: skillName, time: now };

      const context = getAudioContext();
      if (!context) return;

      if (context.state === 'suspended') {
        context
          .resume()
          .then(() => {
            if (context.state === 'running') playHoverTune(context);
          })
          .catch(() => {});
        return;
      }

      if (context.state === 'running') {
        playHoverTune(context);
      }
    },
    [getAudioContext],
  );

  const skillsByCategory = useMemo(() => {
    return CATEGORY_CONFIG.reduce((accumulator, category) => {
      const groupedSkills = category.sources.flatMap((source) => techStack[source] || []);
      accumulator[category.id] = groupedSkills.filter((item) =>
        Boolean(getOfficialIconUrl(item.name)),
      );
      return accumulator;
    }, {});
  }, []);

  const visibleCategories = useMemo(() => {
    if (activeFilter === ALL_FILTER) {
      return CATEGORY_CONFIG.map((category) => ({
        ...category,
        skills: skillsByCategory[category.id] || [],
      }));
    }

    const category = CATEGORY_CONFIG.find((item) => item.id === activeFilter);
    if (!category) return [];
    return [{ ...category, skills: skillsByCategory[category.id] || [] }];
  }, [activeFilter, skillsByCategory]);

  const activeCategoryLabel =
    activeFilter === ALL_FILTER
      ? 'All Skills'
      : CATEGORY_CONFIG.find((category) => category.id === activeFilter)?.label || 'Skills';

  const handleTechClick = (techName) => {
    localStorage.setItem('projectSearchQuery', techName);
    window.dispatchEvent(
      new CustomEvent(PROJECT_SEARCH_EVENT, {
        detail: { query: techName },
      }),
    );

    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = 'projects';
    }
  };

  return (
    <section id="techstack" className="section bg-surface">
      <div className="container" ref={ref}>
        <div className="tech-stack-shell">
          <div className="tech-intro">
            <p className="tech-intro-kicker">Expertise</p>
            <h2 className="section-title">Skills &amp; Technologies</h2>
            <p className="section-subtitle">
              The tools, languages, and frameworks I use to build full-stack web products.
            </p>
          </div>

          <div className="tech-filter-nav" role="tablist" aria-label="Skill categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === ALL_FILTER}
              className={`tech-filter-btn ${activeFilter === ALL_FILTER ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(ALL_FILTER)}
            >
              All
            </button>
            {CATEGORY_CONFIG.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === category.id}
                className={`tech-filter-btn ${activeFilter === category.id ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div
            className={`tech-collection-surface ${isIntersecting ? 'is-visible' : ''}`}
            aria-label={`${activeCategoryLabel} skills`}
          >
            <div className="tech-collection-head">
              <p className="tech-collection-title">{activeCategoryLabel}</p>
              <p className="tech-collection-hint">Click any skill to jump to matching projects.</p>
            </div>

            <div
              className={`tech-categories-grid ${
                visibleCategories.length === 1 ? 'tech-categories-grid--single' : ''
              }`}
            >
              {visibleCategories.map((category, categoryIndex) => (
                <article
                  key={category.id}
                  className="tech-category-panel"
                  style={{ '--panel-delay': `${categoryIndex * 70}ms` }}
                >
                  <div className="tech-category-head">
                    <div className="tech-category-title-wrap">
                      <span className="tech-category-icon">
                        <CategoryIcon categoryId={category.id} />
                      </span>
                      <h3 className="tech-category-title">{category.label}</h3>
                    </div>
                    <span className="tech-category-count">{category.skills.length} skills</span>
                  </div>

                  {category.skills.length === 0 && (
                    <p className="tech-empty-state">No skills available in this category.</p>
                  )}

                  <div className="tech-skill-list">
                    {category.skills.map((skill) => {
                      const iconUrl = getOfficialIconUrl(skill.name);
                      if (!iconUrl) return null;

                      return (
                        <button
                          key={`${category.id}-${skill.name}`}
                          type="button"
                          className="tech-skill-chip"
                          title={skill.name}
                          aria-label={skill.name}
                          onClick={() => handleTechClick(skill.name)}
                          onMouseEnter={() => handleSkillHover(skill.name)}
                          onFocus={() => handleSkillHover(skill.name)}
                        >
                          <span className="tech-skill-main">
                            <span className="tech-skill-icon-wrap">
                              <img src={iconUrl} alt="" className="tech-skill-icon" loading="lazy" />
                            </span>
                            <span className="tech-skill-name">{skill.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
