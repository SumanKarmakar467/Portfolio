import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { techStack } from '../constants/techStack';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './TechStack.css';

const PROJECT_SEARCH_EVENT = 'portfolio-project-search';
const ALL_FILTER = 'all';
const CATEGORY_CONFIG = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'ai', label: 'AI Tools' },
  { id: 'tools', label: 'Tools & Deploy' },
];

const SIMPLE_ICON_SLUGS = {
  HTML: 'html5',
  CSS: 'css3',
  JavaScript: 'javascript',
  React: 'react',
  'Tailwind CSS': 'tailwindcss',
  'Responsive Design': 'css3',
  Java: 'openjdk',
  'Spring Boot': 'springboot',
  'Node.js': 'nodedotjs',
  Express: 'express',
  'REST APIs': 'postman',
  MongoDB: 'mongodb',
  MySQL: 'mysql',
  PostgreSQL: 'postgresql',
  'AWS Basics': 'amazonwebservices',
  ChatGPT: 'openai',
  Blackbox: 'visualstudiocode',
  Gemini: 'googlegemini',
  Codex: 'openai',
  'GitHub Copilot': 'githubcopilot',
  Git: 'git',
  GitHub: 'github',
  Netlify: 'netlify',
  Vercel: 'vercel',
};

function getOfficialIconUrl(name) {
  const slug = SIMPLE_ICON_SLUGS[name];
  return slug ? `https://cdn.simpleicons.org/${slug}` : '';
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
}

function getSkillLevel(skill) {
  return clamp(Number(skill?.level) || 70, 42, 100);
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
      accumulator[category.id] = (techStack[category.id] || []).filter((item) =>
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
            <p className="tech-intro-kicker">Skill Zone</p>
            <h2 className="section-title">Tech Stack</h2>
            <p className="section-subtitle">
              Explore my stack by category. Hover a skill icon for a soft audio cue, and click any skill
              to jump into matching projects.
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
              <p className="tech-collection-hint">Click a skill to filter matching projects instantly.</p>
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
                    <h3 className="tech-category-title">{category.label}</h3>
                    <span className="tech-category-count">{category.skills.length} skills</span>
                  </div>

                  {category.skills.length === 0 && (
                    <p className="tech-empty-state">No skills available in this category.</p>
                  )}

                  <div className="tech-skill-list">
                    {category.skills.map((skill) => {
                      const iconUrl = getOfficialIconUrl(skill.name);
                      const level = getSkillLevel(skill);
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
                              <span
                                className="tech-skill-icon-mask"
                                style={{ '--icon-url': `url("${iconUrl}")` }}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="tech-skill-copy">
                              <span className="tech-skill-name">{skill.name}</span>
                              <span className="tech-skill-action">View projects</span>
                            </span>
                          </span>
                          <span className="tech-skill-meter" aria-hidden="true">
                            <span style={{ width: `${level}%` }} />
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
