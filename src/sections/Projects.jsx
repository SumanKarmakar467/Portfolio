import React, { useState } from 'react';
import { projects } from '../constants/projects';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [imageLoadError, setImageLoadError] = useState({});

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((project) => project.featured === (filter === 'featured'));

  const getGeneratedImageUrl = (project) => {
    const prompt = `${project.title}, ${project.technologies.slice(0, 3).join(', ')}, web app user interface`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=450&seed=${project.id}&nologo=true`;
  };

  const getFallbackImageUrl = (project) =>
    `https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/450`;

  const getProjectImageUrl = (project) => {
    if (imageLoadError[project.id]) {
      return getFallbackImageUrl(project);
    }

    const hasPlaceholder = typeof project.image === 'string' && project.image.startsWith('/api/placeholder');
    return hasPlaceholder ? getGeneratedImageUrl(project) : project.image;
  };

  const handleImageError = (projectId) => {
    setImageLoadError((prev) => {
      if (prev[projectId]) {
        return prev;
      }

      return { ...prev, [projectId]: true };
    });
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            Real projects migrated from my previous portfolio
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                filter === 'featured'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-text'
              }`}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card group cursor-pointer relative overflow-hidden"
            >
              {/* Project image */}
              <div className="aspect-video rounded-lg mb-4 overflow-hidden relative">
                <img
                  src={getProjectImageUrl(project)}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => handleImageError(project.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute left-3 right-3 bottom-3 text-white text-xs font-medium tracking-wide uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {project.technologies[0]} Project
                </div>
              </div>

              {/* Project info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-space font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium shrink-0">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-muted text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-surface border border-border text-xs rounded-md text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-surface border border-border text-xs rounded-md text-muted">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex space-x-4 pt-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>Code</span>
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/30 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/SumanKarmakar467/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View All Projects on GitHub
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

