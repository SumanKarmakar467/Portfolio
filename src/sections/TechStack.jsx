import React, { useMemo, useState } from 'react';
import { techStack } from '../constants/techStack';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './TechStack.css';

const PROJECT_SEARCH_EVENT = 'portfolio-project-search';
const CATEGORY_CONFIG = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database & Cloud' },
  { id: 'auth', label: 'Auth' },
  { id: 'ai', label: 'AI Tools' },
  { id: 'tools', label: 'Tools' },
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

function buildFloatLayout(names, groupKey = 'default') {
  const total = names.length;
  const columns = Math.max(4, Math.ceil(Math.sqrt(total * 1.5)));
  const rows = Math.max(3, Math.ceil(total / columns));

  return names.map((name, index) => {
    let seed = hashString(`${groupKey}-${name}-${index}`);
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const col = index % columns;
    const row = Math.floor(index / columns);
    const baseX = ((col + 0.5) / columns) * 100;
    const baseY = ((row + 0.5) / rows) * 100;

    return {
      name,
      slug: SIMPLE_ICON_SLUGS[name],
      x: clamp(baseX + (random() * 10 - 5), 8, 92),
      y: clamp(baseY + (random() * 12 - 6), 10, 90),
      dx1: Math.round(random() * 50 - 25),
      dy1: Math.round(random() * 48 - 24),
      dx2: Math.round(random() * 40 - 20),
      dy2: Math.round(random() * 40 - 20),
      dx3: Math.round(random() * 46 - 23),
      dy3: Math.round(random() * 44 - 22),
      duration: (11 + random() * 8).toFixed(2),
      delay: (-random() * 8).toFixed(2),
    };
  });
}

export default function TechStack() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, rootMargin: '120px 0px' });
  const [failedIconSourceIndex, setFailedIconSourceIndex] = useState({});

  const categoryBoxes = useMemo(() => {
    return CATEGORY_CONFIG.map((category) => {
      const techNames = (techStack[category.id] || []).map((item) => item.name);
      const mappedTechNames = techNames.filter((name) => getIconSources(name).length > 0);
      return {
        ...category,
        floatingIcons: buildFloatLayout(mappedTechNames, category.id),
      };
    });
  }, []);

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
        <p className="mb-3 text-sm font-medium text-muted md:hidden">
          See skills -&gt; swipe horizontally to view more
        </p>
        <div className="tech-category-grid">
          {categoryBoxes.map((category) => (
            <div key={category.id} className="tech-category-card">
              <p className="tech-category-title">{category.label}</p>
              <div
                className={`tech-icon-box ${isIntersecting ? '' : 'tech-icon-box--paused'}`}
                aria-label={`${category.label} animated icons`}
              >
                {category.floatingIcons.length === 0 && (
                  <p className="tech-empty-state">No skills added yet.</p>
                )}
                {category.floatingIcons.map((icon) => {
                  const iconSources = getIconSources(icon.name);
                  const stateKey = `${category.id}:${icon.name}`;
                  const sourceIndex = failedIconSourceIndex[stateKey] || 0;
                  const iconUrl = iconSources[sourceIndex];
                  const showFallback = !iconUrl;

                  return (
                    <button
                      key={`${category.id}-${icon.name}`}
                      type="button"
                      className="tech-floating-icon"
                      title={icon.name}
                      aria-label={icon.name}
                      onClick={() => handleTechClick(icon.name)}
                      style={{
                        '--start-x': `${icon.x}%`,
                        '--start-y': `${icon.y}%`,
                        '--dx1': `${icon.dx1}px`,
                        '--dy1': `${icon.dy1}px`,
                        '--dx2': `${icon.dx2}px`,
                        '--dy2': `${icon.dy2}px`,
                        '--dx3': `${icon.dx3}px`,
                        '--dy3': `${icon.dy3}px`,
                        '--duration': `${icon.duration}s`,
                        '--delay': `${icon.delay}s`,
                      }}
                    >
                      {showFallback ? (
                        <span className="tech-floating-fallback">{getFallbackLabel(icon.name)}</span>
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
                      <span className="tech-floating-label">{icon.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
