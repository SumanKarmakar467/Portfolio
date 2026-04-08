import React, { useMemo, useState } from 'react';
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
];
const ICON_RED_HEX = 'ff5a6e';
const ICON_RED_COLOR = '#ff5a6e';

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
  'AWS Basics': 'amazonaws',
  ChatGPT: 'openai',
  Blackbox: 'blackbox',
  Gemini: 'googlegemini',
  Codex: 'openai',
  'GitHub Copilot': 'githubcopilot',
  Git: 'git',
  GitHub: 'github',
  Netlify: 'netlify',
  Vercel: 'vercel',
};

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

function getIconSources(name) {
  const withAccent = (url) =>
    url.startsWith('https://cdn.simpleicons.org/')
      ? `https://cdn.simpleicons.org/${url.replace('https://cdn.simpleicons.org/', '').split('/')[0]}/${ICON_RED_HEX}`
      : url;

  if (ICON_URLS[name]?.length) {
    return ICON_URLS[name].map((url, index) => (index === 0 ? withAccent(url) : url));
  }

  const slug = SIMPLE_ICON_SLUGS[name];
  return slug
    ? [`https://cdn.simpleicons.org/${slug}/${ICON_RED_HEX}`, `https://cdn.simpleicons.org/${slug}/${ICON_RED_HEX}`]
    : [];
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

function buildFloatLayout(items, groupKey = 'default') {
  const total = Math.max(items.length, 1);
  const columns = Math.max(3, Math.ceil(Math.sqrt(total * 1.35)));
  const rows = Math.max(2, Math.ceil(total / columns));

  return items.map((item, index) => {
    let seed = hashString(`${groupKey}-${item.name}-${index}`);
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const col = index % columns;
    const row = Math.floor(index / columns);
    const baseX = ((col + 0.5) / columns) * 100;
    const baseY = 26 + ((row + 0.5) / rows) * 68;

    return {
      ...item,
      x: clamp(baseX + (random() * 8 - 4), 8, 92),
      y: clamp(baseY + (random() * 8 - 4), 28, 92),
      dx1: Math.round(random() * 24 - 12),
      dy1: Math.round(random() * 22 - 11),
      dx2: Math.round(random() * 20 - 10),
      dy2: Math.round(random() * 18 - 9),
      dx3: Math.round(random() * 22 - 11),
      dy3: Math.round(random() * 22 - 11),
      duration: (8.6 + random() * 5.2).toFixed(2),
      delay: (-random() * 5.5).toFixed(2),
    };
  });
}

export default function TechStack() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, rootMargin: '120px 0px' });
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [failedIconSourceIndex, setFailedIconSourceIndex] = useState({});

  const skillsByCategory = useMemo(() => {
    return CATEGORY_CONFIG.reduce((accumulator, category) => {
      accumulator[category.id] = (techStack[category.id] || []).filter(
        (item) => getIconSources(item.name).length > 0,
      );
      return accumulator;
    }, {});
  }, []);

  const allSkills = useMemo(() => {
    const seenNames = new Set();
    return CATEGORY_CONFIG.flatMap((category) => skillsByCategory[category.id] || []).filter((skill) => {
      if (seenNames.has(skill.name)) return false;
      seenNames.add(skill.name);
      return true;
    });
  }, [skillsByCategory]);

  const visibleSkills = useMemo(() => {
    if (activeFilter === ALL_FILTER) return allSkills;
    return skillsByCategory[activeFilter] || [];
  }, [activeFilter, allSkills, skillsByCategory]);

  const floatingSkills = useMemo(
    () => buildFloatLayout(visibleSkills, activeFilter),
    [visibleSkills, activeFilter],
  );
  const dynamicBoxHeight = useMemo(() => {
    const skillsCount = Math.max(visibleSkills.length, 1);
    const iconsPerRow = activeFilter === ALL_FILTER ? 5 : 4;
    const rows = Math.max(2, Math.ceil(skillsCount / iconsPerRow));
    return clamp(185 + rows * 70, 250, 520);
  }, [visibleSkills.length, activeFilter]);

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
            className={`tech-skill-box ${isIntersecting ? '' : 'tech-skill-box--paused'}`}
            aria-label={`${activeCategoryLabel} animated skills`}
            style={{ '--dynamic-box-height': `${dynamicBoxHeight}px` }}
          >
            <div className="tech-skill-box-header">
              <p className="tech-skill-box-title">{activeCategoryLabel}</p>
              <p className="tech-skill-box-hint">Click any icon to view related projects</p>
            </div>

            {floatingSkills.length === 0 && <p className="tech-empty-state">No skills available.</p>}

            {floatingSkills.map((skill) => {
              const iconSources = getIconSources(skill.name);
              const stateKey = `${activeFilter}:${skill.name}`;
              const sourceIndex = failedIconSourceIndex[stateKey] || 0;
              const iconUrl = iconSources[sourceIndex];
              const showFallback = !iconUrl;
              const accentColor = ICON_RED_COLOR;

              return (
                <button
                  key={`${activeFilter}-${skill.name}`}
                  type="button"
                  className="tech-floating-icon"
                  title={skill.name}
                  aria-label={skill.name}
                  onClick={() => handleTechClick(skill.name)}
                  style={{
                    '--start-x': `${skill.x}%`,
                    '--start-y': `${skill.y}%`,
                    '--dx1': `${skill.dx1}px`,
                    '--dy1': `${skill.dy1}px`,
                    '--dx2': `${skill.dx2}px`,
                    '--dy2': `${skill.dy2}px`,
                    '--dx3': `${skill.dx3}px`,
                    '--dy3': `${skill.dy3}px`,
                    '--duration': `${skill.duration}s`,
                    '--delay': `${skill.delay}s`,
                    '--accent': accentColor,
                  }}
                >
                  {showFallback ? (
                    <span className="tech-floating-fallback">{getFallbackLabel(skill.name)}</span>
                  ) : (
                    <img
                      src={iconUrl}
                      alt=""
                      loading="lazy"
                      className="tech-floating-icon-img"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        setFailedIconSourceIndex((prev) => ({
                          ...prev,
                          [stateKey]: sourceIndex + 1,
                        }));
                      }}
                    />
                  )}
                  <span className="tech-floating-label">{skill.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
