import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects as projectData } from '../constants/projects';

const CATEGORIES = ['All', 'Web', 'AI', 'Mobile', 'Realtime'];
const PROJECT_FALLBACK_IMAGE = 'https://picsum.photos/seed/portfolio-project-fallback/1200/675';
const PROJECT_SEARCH_EVENT = 'portfolio-project-search';

const GOAL_KEYWORDS = [
  { goal: 'AI & automation', terms: ['ai', 'ats', 'resume', 'analysis', 'ml'] },
  { goal: 'Dashboard analytics', terms: ['dashboard', 'metrics', 'stats', 'tracking'] },
  { goal: 'Full-stack product', terms: ['auth', 'firebase', 'api', 'mongodb', 'spring'] },
  { goal: 'Frontend polish', terms: ['responsive', 'ui', 'ux', 'animation'] },
];

function slugify(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function inferCategory(project) {
  const text = `${project.title} ${project.description} ${(project.technologies || []).join(' ')}`.toLowerCase();
  if (/socket|realtime|real-time|live/.test(text)) return 'Realtime';
  if (/react native|android|ios|mobile|flutter/.test(text)) return 'Mobile';
  if (/ai|ml|machine learning|ats|analysis/.test(text)) return 'AI';
  return 'Web';
}

function inferGoals(query) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  return GOAL_KEYWORDS.filter(({ terms }) => terms.some((term) => normalized.includes(term))).map(
    ({ goal }) => goal,
  );
}

function ensureArray(value, fallback = []) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

function normalizeProjects(source) {
  return source.map((project) => {
    const primaryTech = project.technologies?.[0] || 'Web';
    const secondaryTech = project.technologies?.[1] || 'Modern JavaScript';
    const slug = project.slug || slugify(project.title);
    const category = project.category || inferCategory(project);

    return {
      ...project,
      slug,
      category,
      role: project.role || `${primaryTech} Developer`,
      impact: project.impact || project.description,
      problem:
        project.problem ||
        `Build a reliable ${category.toLowerCase()} project that solves a practical user need with clean UX and clear outcomes.`,
      solution:
        project.solution ||
        `Implemented a production-style solution using ${primaryTech} and ${secondaryTech}, with attention to performance, responsiveness, and maintainable structure.`,
      points: ensureArray(project.points, [
        `Designed and shipped core features for ${project.title}.`,
        `Integrated stack components: ${(project.technologies || []).slice(0, 3).join(', ')}.`,
        'Improved usability with responsive layouts and clear component structure.',
      ]),
      learnings: ensureArray(project.learnings, [
        `Deepened practical skills in ${primaryTech}.`,
        'Strengthened debugging and deployment workflow.',
        'Learned to balance developer speed with user experience quality.',
      ]),
      tech: ensureArray(project.tech, project.technologies || []),
      bgImage: project.bgImage || project.image || PROJECT_FALLBACK_IMAGE,
      liveUrl: project.liveUrl || project.live || '',
      previewVideo: project.previewVideo || '',
    };
  });
}

function moveSlugBefore(order, draggingSlug, targetSlug) {
  const withoutDragging = order.filter((slug) => slug !== draggingSlug);
  const targetIndex = withoutDragging.indexOf(targetSlug);
  if (targetIndex === -1) return order;

  const nextOrder = [...withoutDragging];
  nextOrder.splice(targetIndex, 0, draggingSlug);
  return nextOrder;
}

function sortByOrder(projects, order) {
  const indexMap = new Map(order.map((slug, index) => [slug, index]));
  return [...projects].sort((a, b) => {
    const aIndex = indexMap.has(a.slug) ? indexMap.get(a.slug) : Number.MAX_SAFE_INTEGER;
    const bIndex = indexMap.has(b.slug) ? indexMap.get(b.slug) : Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

function scoreProject(project, query, goals, recruiterMode) {
  const blob = `${project.title} ${project.description} ${project.impact} ${project.category} ${project.tech.join(
    ' ',
  )}`.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();
  let score = 0;

  if (recruiterMode && project.featured) score += 3;
  if (normalizedQuery && blob.includes(normalizedQuery)) score += 4;
  if (project.featured) score += 2;

  goals.forEach((goal) => {
    if (blob.includes(goal.toLowerCase().split(' ')[0])) {
      score += 2;
    }
  });

  return score;
}

const ContentCard = ({ title, content }) => (
  <div className="rounded-2xl border border-border bg-surface/80 p-5">
    <p className="text-sm font-semibold text-text">{title}</p>
    <p className="mt-3 text-sm leading-relaxed text-muted">{content}</p>
  </div>
);

const BulletCard = ({ title, items }) => (
  <div className="rounded-2xl border border-border bg-surface/80 p-5">
    <p className="text-sm font-semibold text-text">{title}</p>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted">
          <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MobileProjectCard = ({ project, brokenImages, onImageError, onPreview, recruiterMode }) => (
  <article className="w-[84vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface/85 shadow-sm">
    <div className="relative h-44 overflow-hidden">
      <img
        src={brokenImages[project.slug] ? PROJECT_FALLBACK_IMAGE : project.bgImage}
        alt={project.title}
        loading="lazy"
        decoding="async"
        onError={() => onImageError(project.slug)}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <div className="absolute left-3 top-3">
        <span className="rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/90">
          {project.category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="mt-1 text-xs text-white/85">{project.role}</p>
      </div>
    </div>

    <div className="space-y-3 p-4">
      <p className="text-sm leading-relaxed text-muted">{project.description}</p>

      {recruiterMode && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary">Recruiter Highlight</p>
          <p className="mt-1.5 text-sm text-text">{project.impact}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {project.tech.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onPreview}
          className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Preview
        </button>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-semibold text-muted"
          >
            Live
          </a>
        )}
      </div>
    </div>
  </article>
);

function ProjectModal({ project, onClose }) {
  const [tab, setTab] = useState('overview');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setTab('overview');
    setIframeLoaded(false);
    setImageError(false);
  }, [project.slug]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 px-3 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background p-4 sm:p-6 md:p-8"
        initial={{ scale: 0.95, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 24 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-border px-2.5 py-1 text-sm font-medium text-muted hover:border-primary hover:text-primary"
          aria-label="Close project preview"
        >
          Close
        </button>

        <div className="overflow-hidden rounded-2xl border border-border">
          <img
            src={imageError ? PROJECT_FALLBACK_IMAGE : project.bgImage}
            alt={project.title}
            onError={() => setImageError(true)}
            className="h-60 w-full object-cover sm:h-72"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary">{project.category}</p>
            <h2 className="mt-2 text-2xl font-bold text-text sm:text-3xl">{project.title}</h2>
            <p className="mt-2 text-sm text-muted">{project.role}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('overview')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tab === 'overview'
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted hover:text-text'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tab === 'preview'
                  ? 'bg-primary text-white'
                  : 'border border-border text-muted hover:text-text'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {tab === 'overview' ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <ContentCard title="Problem" content={project.problem} />
              <ContentCard title="Solution" content={project.solution} />
              <BulletCard title="Key Contributions" items={project.points} />
              <BulletCard title="What I Learned" items={project.learnings} />
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-surface/80 p-5">
                <p className="text-sm font-semibold text-text">Tech Stack</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface/80 p-5">
                <p className="text-sm font-semibold text-text">Actions</p>
                <div className="mt-4 grid gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted hover:border-primary hover:text-primary"
                  >
                    View GitHub Code
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      Open Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {project.previewVideo ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-black">
                <video src={project.previewVideo} controls className="h-full w-full" />
              </div>
            ) : project.liveUrl ? (
              <div className="relative h-[56vh] overflow-hidden rounded-2xl border border-border bg-surface">
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90">
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      Loading live preview...
                    </div>
                  </div>
                )}
                <iframe
                  src={project.liveUrl}
                  title={`${project.title} live preview`}
                  className="h-full w-full"
                  loading="lazy"
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-surface/80 p-6 text-sm text-muted">
                Preview is not available for this project yet.
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [query, setQuery] = useState('');
  const [draggingSlug, setDraggingSlug] = useState(null);
  const [projectOrder, setProjectOrder] = useState([]);
  const [brokenImages, setBrokenImages] = useState({});

  const allProjects = useMemo(() => normalizeProjects(projectData), []);

  useEffect(() => {
    setProjectOrder(allProjects.map((project) => project.slug));
  }, [allProjects]);

  useEffect(() => {
    const applySearch = (nextQuery) => {
      if (!nextQuery || typeof nextQuery !== 'string') return;
      setQuery(nextQuery);
      setSelectedCategory('All');
      setFeaturedOnly(false);
    };

    const savedQuery = localStorage.getItem('projectSearchQuery');
    if (savedQuery) {
      applySearch(savedQuery);
      localStorage.removeItem('projectSearchQuery');
    }

    const handleProjectSearch = (event) => {
      applySearch(event?.detail?.query);
    };

    window.addEventListener(PROJECT_SEARCH_EVENT, handleProjectSearch);
    return () => window.removeEventListener(PROJECT_SEARCH_EVENT, handleProjectSearch);
  }, []);

  const orderedProjects = useMemo(
    () => (projectOrder.length > 0 ? sortByOrder(allProjects, projectOrder) : allProjects),
    [allProjects, projectOrder],
  );

  const inferredGoals = useMemo(() => inferGoals(query), [query]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return orderedProjects.filter((project) => {
      const categoryMatches = selectedCategory === 'All' || project.category === selectedCategory;
      const featuredMatches = !featuredOnly || project.featured;
      const queryMatches =
        !normalizedQuery ||
        `${project.title} ${project.description} ${project.role} ${project.impact} ${project.tech.join(' ')}`.toLowerCase().includes(
          normalizedQuery,
        );

      return categoryMatches && featuredMatches && queryMatches;
    });
  }, [orderedProjects, selectedCategory, featuredOnly, query]);

  const recommendedProjects = useMemo(() => {
    const ranked = filteredProjects
      .map((project) => ({
        project,
        score: scoreProject(project, query, inferredGoals, recruiterMode),
      }))
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .slice(0, 3)
      .map((item) => item.project);

    return ranked;
  }, [filteredProjects, query, inferredGoals, recruiterMode]);

  const handleDrop = (targetSlug) => {
    if (!draggingSlug || draggingSlug === targetSlug) {
      setDraggingSlug(null);
      return;
    }

    setProjectOrder((prev) => moveSlugBefore(prev, draggingSlug, targetSlug));
    setDraggingSlug(null);
  };

  const handleImageError = (slug) => {
    setBrokenImages((prev) => ({ ...prev, [slug]: true }));
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.26em] text-primary">Projects System</p>
            <h2 className="text-3xl font-bold text-text sm:text-4xl">
              Searchable, draggable, recruiter-aware project showcase
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            This section behaves like a product surface with smart filtering, drag ordering, recruiter
            highlights, and richer previews.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'border border-border text-muted hover:text-text'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
                <span className="text-xs uppercase tracking-wider text-muted">Search</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Smart search projects..."
                  className="w-full bg-transparent text-sm text-text outline-none sm:w-48"
                />
              </label>
              <button
                type="button"
                onClick={() => setFeaturedOnly((prev) => !prev)}
                className={`w-full rounded-full px-4 py-2 text-sm font-medium sm:w-auto ${
                  featuredOnly
                    ? 'bg-secondary text-white'
                    : 'border border-border text-muted hover:text-text'
                }`}
              >
                {featuredOnly ? 'Featured only' : 'Show featured'}
              </button>
              <button
                type="button"
                onClick={() => setRecruiterMode((prev) => !prev)}
                className={`w-full rounded-full px-4 py-2 text-sm font-medium sm:w-auto ${
                  recruiterMode
                    ? 'bg-primary text-white'
                    : 'border border-border text-muted hover:text-text'
                }`}
              >
                {recruiterMode ? 'Recruiter mode on' : 'Recruiter mode'}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted">
              Showing {filteredProjects.length} of {orderedProjects.length} projects
              {query.trim() ? ` for "${query.trim()}"` : ''}
            </p>
            {inferredGoals.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
                  AI matched goals
                </span>
                {inferredGoals.map((goal) => (
                  <span
                    key={goal}
                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {recommendedProjects.length > 0 && (
          <div className="mb-8 hidden gap-4 lg:grid lg:grid-cols-3">
            {recommendedProjects.map((project, index) => (
              <motion.button
                key={project.slug}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.22, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-left transition hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.22em] text-primary">Recommended</span>
                  <span className="text-xs text-primary/80">{project.category}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-text">{project.title}</h3>
                <p className="mt-2 text-sm text-muted">{project.impact}</p>
              </motion.button>
            ))}
          </div>
        )}

        <div className="md:hidden">
          <div className="-mx-4 px-4">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filteredProjects.map((project) => (
                <MobileProjectCard
                  key={project.slug}
                  project={project}
                  brokenImages={brokenImages}
                  onImageError={handleImageError}
                  recruiterMode={recruiterMode}
                  onPreview={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="hidden grid-cols-1 gap-6 md:grid xl:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.article
                key={project.slug}
                layout
                draggable
                onDragStart={() => setDraggingSlug(project.slug)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(project.slug)}
                onDragEnd={() => setDraggingSlug(null)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.24 }}
                className={`group ${draggingSlug === project.slug ? 'opacity-60' : ''}`}
              >
                <div className="h-full overflow-hidden rounded-2xl border border-border bg-surface/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={brokenImages[project.slug] ? PROJECT_FALLBACK_IMAGE : project.bgImage}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(project.slug)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                        {project.category}
                      </span>
                      <span className="rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                        Drag
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                      <p className="mt-1 text-sm text-white/80">{project.role}</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-sm leading-relaxed text-muted">{project.description}</p>

                    {recruiterMode && (
                      <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-primary">Recruiter Highlight</p>
                        <p className="mt-2 text-sm text-text">{project.impact}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                      >
                        Preview
                      </button>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted hover:border-primary hover:text-primary"
                        >
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/70 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-text">No projects matched this query</p>
            <p className="mt-2 text-sm text-muted">
              Try a broader keyword like React, AI, mobile, API, or realtime.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="mb-3 text-sm font-medium text-muted md:hidden">
            See projects -&gt; swipe horizontally to view more
          </p>
          <a
            href="https://github.com/SumanKarmakar467/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View All Projects on GitHub
          </a>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
}
