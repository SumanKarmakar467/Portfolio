import React from 'react';
import { education } from '../constants/education';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionAccent3D from '../components/SectionAccent3D';
import './Education.css';

export default function Education() {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <section id="education" className="section" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <p className="kicker-label justify-center mb-3">(04) &mdash; Trajectory</p>
          <div className="flex items-center justify-center gap-3">
            <SectionAccent3D />
            <h2 className="section-title">Where I&apos;ve Been.</h2>
          </div>
          <p className="section-subtitle">My academic journey</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="edu-timeline-rail" />

            {education.map((edu, index) => (
              <div key={edu.id} className="relative mb-12 last:mb-0">
                <span className="edu-node">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 3 1 8l11 5 9-4.09V17h2V8Z" />
                    <path d="M5 10.5V15c0 1.5 3 3.5 7 3.5s7-2 7-3.5v-4.5l-7 3.18Z" />
                  </svg>
                </span>

                <div
                  className={`ml-20 edu-card edu-item ${hasIntersected ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${index * 110}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-space font-semibold text-primary mb-1">{edu.degree}</h3>
                      <p className="text-muted font-medium">
                        {edu.institution} | {edu.location}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                        {edu.duration}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full font-medium">
                      {edu.grade}
                    </span>
                  </div>

                  <p className="text-muted leading-relaxed mb-4">{edu.description}</p>

                  {edu.achievements?.length > 0 && (
                    <div className="space-y-2 border-t border-border/70 pt-4">
                      {edu.achievements.map((item) => (
                        <div key={item} className="edu-achievement">
                          <span className="edu-achievement-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
