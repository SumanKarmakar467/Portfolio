import React, { useMemo, useState } from 'react';
import { techStack } from '../constants/techStack';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './TechStack.css';

const PROJECT_SEARCH_EVENT = 'portfolio-project-search';
const CATEGORY_CONFIG = [
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'database', label: 'Database & Cloud' },
  { id: 'ai', label: 'AI Tools' },
  { id: 'tools', label: 'Tools & DevOps' },
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

const ICON_ACCENTS = {
  HTML: '#F97316',
  CSS: '#2563EB',
  JavaScript: '#FACC15',
  React: '#38BDF8',
  'Tailwind CSS': '#22D3EE',
  'Responsive Design': '#60A5FA',
  Java: '#F97316',
  'Spring Boot': '#22C55E',
  'Node.js': '#22C55E',
  Express: '#94A3B8',
  'REST APIs': '#A5B4FC',
  MongoDB: '#22C55E',
  MySQL: '#60A5FA',
  PostgreSQL: '#38BDF8',
  'AWS Basics': '#F59E0B',
  ChatGPT: '#34D399',
  Blackbox: '#A855F7',
  Gemini: '#60A5FA',
  Codex: '#38BDF8',
  'GitHub Copilot': '#8B5CF6',
  Git: '#F97316',
  GitHub: '#F8FAFC',
  Netlify: '#2DD4BF',
  Vercel: '#E2E8F0',
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

export default function TechStack() {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, rootMargin: '120px 0px' });
  const [failedIconSourceIndex, setFailedIconSourceIndex] = useState({});

  const categories = useMemo(
    () =>
      CATEGORY_CONFIG.map((category) => ({
        ...category,
        items: (techStack[category.id] || []).filter((item) => getIconSources(item.name).length > 0),
      })).filter((category) => category.items.length > 0),
    [],
  );

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
        <div className="tech-category-grid">
          {categories.map((category, categoryIndex) => (
            <div key={category.id} className="tech-category-panel">
              <p className="tech-category-title">{category.label}</p>
              <div className="tech-icons-grid" aria-label={`${category.label} skills`}>
                {category.items.map((item, itemIndex) => {
                  const iconSources = getIconSources(item.name);
                  const stateKey = `${category.id}:${item.name}`;
                  const sourceIndex = failedIconSourceIndex[stateKey] || 0;
                  const iconUrl = iconSources[sourceIndex];
                  const showFallback = !iconUrl;
                  const revealDelay = `${(categoryIndex * 0.08 + itemIndex * 0.05).toFixed(2)}s`;
                  const accentColor = ICON_ACCENTS[item.name] || 'var(--primary)';

                  return (
                    <button
                      key={`${category.id}-${item.name}`}
                      type="button"
                      className={`tech-skill-tile ${isIntersecting ? 'is-visible' : ''}`}
                      title={item.name}
                      aria-label={item.name}
                      onClick={() => handleTechClick(item.name)}
                      style={{
                        '--tile-delay': revealDelay,
                        '--accent': accentColor,
                      }}
                    >
                      <span className="tech-skill-icon-shell">
                        {showFallback ? (
                          <span className="tech-skill-fallback">{getFallbackLabel(item.name)}</span>
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
                      <span className="tech-skill-label">{item.name}</span>
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
