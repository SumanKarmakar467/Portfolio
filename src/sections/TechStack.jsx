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

const ICON_URLS = {
  HTML: [
    'https://cdn.simpleicons.org/html5',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  ],
  CSS: [
    'https://cdn.simpleicons.org/css3',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  ],
  JavaScript: [
    'https://cdn.simpleicons.org/javascript',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  ],
  React: [
    'https://cdn.simpleicons.org/react',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  ],
  'Tailwind CSS': [
    'https://cdn.simpleicons.org/tailwindcss',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  ],
  'Responsive Design': [
    'https://cdn.simpleicons.org/css3',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  ],
  Java: [
    'https://cdn.simpleicons.org/openjdk',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  ],
  'Spring Boot': [
    'https://cdn.simpleicons.org/springboot',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  ],
  'Node.js': [
    'https://cdn.simpleicons.org/nodedotjs',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  ],
  Express: [
    'https://cdn.simpleicons.org/express',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  ],
  'REST APIs': [
    'https://cdn.simpleicons.org/postman',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
  ],
  MongoDB: [
    'https://cdn.simpleicons.org/mongodb',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  ],
  MySQL: [
    'https://cdn.simpleicons.org/mysql',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  ],
  PostgreSQL: [
    'https://cdn.simpleicons.org/postgresql',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  ],
  'AWS Basics': [
    'https://cdn.simpleicons.org/amazonwebservices',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  ],
  ChatGPT: [
    'https://cdn.simpleicons.org/chatgpt',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg',
  ],
  Blackbox: [
    'https://cdn.simpleicons.org/visualstudiocode',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  ],
  Gemini: [
    'https://cdn.simpleicons.org/googlegemini',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  ],
  Codex: [
    'https://cdn.simpleicons.org/openai',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg',
  ],
  'GitHub Copilot': [
    'https://cdn.simpleicons.org/githubcopilot',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  ],
  Git: [
    'https://cdn.simpleicons.org/git',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  ],
  GitHub: [
    'https://cdn.simpleicons.org/github',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  ],
  Netlify: [
    'https://cdn.simpleicons.org/netlify',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg',
  ],
  Vercel: [
    'https://cdn.simpleicons.org/vercel',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  ],
};

const ICON_ACCENTS = {
  HTML: '#E34F26',
  CSS: '#1572B6',
  JavaScript: '#F7DF1E',
  React: '#61DAFB',
  'Tailwind CSS': '#06B6D4',
  'Responsive Design': '#1572B6',
  Java: '#ED8B00',
  'Spring Boot': '#6DB33F',
  'Node.js': '#339933',
  Express: '#6B7280',
  'REST APIs': '#FF6C37',
  MongoDB: '#47A248',
  MySQL: '#4479A1',
  PostgreSQL: '#4169E1',
  'AWS Basics': '#FF9900',
  ChatGPT: '#10A37F',
  Blackbox: '#007ACC',
  Gemini: '#4285F4',
  Codex: '#412991',
  'GitHub Copilot': '#8957E5',
  Git: '#F05032',
  GitHub: '#6E5494',
  Netlify: '#00C7B7',
  Vercel: '#111827',
};

function getIconSources(name) {
  if (ICON_URLS[name]?.length) return ICON_URLS[name];

  const slug = SIMPLE_ICON_SLUGS[name];
  return slug ? [`https://cdn.simpleicons.org/${slug}`] : [];
}

function getFallbackLabel(name) {
  return String(name)
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
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

function playHoverTune(audioContext, skillName) {
  const now = audioContext.currentTime;
  const seed = hashString(skillName);
  const baseMidi = 60 + (seed % 8);
  const leadOffset = [0, 2, 4, 7][seed % 4];
  const echoOffset = [7, 9, 11, 12][Math.floor(seed / 7) % 4];

  const leadNote = midiToFrequency(baseMidi + leadOffset);
  const echoNote = midiToFrequency(baseMidi + echoOffset);

  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.035, now + 0.03);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  masterGain.connect(audioContext.destination);

  const leadOsc = audioContext.createOscillator();
  const leadToneGain = audioContext.createGain();
  leadOsc.type = 'triangle';
  leadOsc.frequency.setValueAtTime(leadNote, now);
  leadToneGain.gain.setValueAtTime(0.7, now);
  leadToneGain.gain.exponentialRampToValueAtTime(0.08, now + 0.2);
  leadOsc.connect(leadToneGain);
  leadToneGain.connect(masterGain);
  leadOsc.start(now);
  leadOsc.stop(now + 0.22);

  const echoOsc = audioContext.createOscillator();
  const echoToneGain = audioContext.createGain();
  echoOsc.type = 'sine';
  echoOsc.frequency.setValueAtTime(echoNote, now + 0.05);
  echoToneGain.gain.setValueAtTime(0.0001, now);
  echoToneGain.gain.exponentialRampToValueAtTime(0.36, now + 0.08);
  echoToneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  echoOsc.connect(echoToneGain);
  echoToneGain.connect(masterGain);
  echoOsc.start(now + 0.04);
  echoOsc.stop(now + 0.24);

  leadOsc.onended = () => {
    leadToneGain.disconnect();
    leadOsc.disconnect();
  };
  echoOsc.onended = () => {
    echoToneGain.disconnect();
    echoOsc.disconnect();
    masterGain.disconnect();
  };
}

export default function TechStack() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, rootMargin: '120px 0px' });
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [failedIconSourceIndex, setFailedIconSourceIndex] = useState({});
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
            if (context.state === 'running') playHoverTune(context, skillName);
          })
          .catch(() => {});
        return;
      }

      if (context.state === 'running') {
        playHoverTune(context, skillName);
      }
    },
    [getAudioContext],
  );

  const skillsByCategory = useMemo(() => {
    return CATEGORY_CONFIG.reduce((accumulator, category) => {
      accumulator[category.id] = (techStack[category.id] || []).filter(
        (item) => getIconSources(item.name).length > 0,
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
                      const iconSources = getIconSources(skill.name);
                      const stateKey = `${category.id}:${skill.name}`;
                      const sourceIndex = failedIconSourceIndex[stateKey] || 0;
                      const iconUrl = iconSources[sourceIndex];
                      const showFallback = !iconUrl;
                      const accentColor = ICON_ACCENTS[skill.name] || 'var(--primary)';
                      const level = getSkillLevel(skill);

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
                          style={{ '--accent': accentColor }}
                        >
                          <span className="tech-skill-main">
                            <span className="tech-skill-icon-wrap">
                              {showFallback ? (
                                <span className="tech-skill-fallback">{getFallbackLabel(skill.name)}</span>
                              ) : (
                                <img
                                  src={iconUrl}
                                  alt=""
                                  loading="lazy"
                                  className="tech-skill-icon-img"
                                  onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    setFailedIconSourceIndex((prev) => ({
                                      ...prev,
                                      [stateKey]: sourceIndex + 1,
                                    }));
                                  }}
                                />
                              )}
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
