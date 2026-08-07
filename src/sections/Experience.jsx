import React from 'react';
import { experience } from '../constants/experience';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SectionAccent3D from '../components/SectionAccent3D';
import './Experience.css';

export default function Experience() {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <p className="kicker-label justify-center mb-3">(02) &mdash; Experience</p>
          <div className="flex items-center justify-center gap-3">
            <SectionAccent3D />
            <h2 className="section-title">On The Job.</h2>
          </div>
          <p className="section-subtitle">Where I&apos;ve been putting the stack to work</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="exp-timeline-rail" />

            {experience.map((job, index) => (
              <div key={job.id} className="relative mb-12 last:mb-0">
                <span className="exp-node">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
                    <path d="M3 12h18" />
                  </svg>
                </span>

                <div
                  className={`ml-20 exp-card exp-item ${hasIntersected ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${index * 110}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-space font-semibold text-primary mb-1">{job.role}</h3>
                      <p className="text-muted font-medium">
                        {job.company} | {job.location}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      {job.current && <span className="exp-current-dot" aria-hidden="true" />}
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                        {job.duration}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {job.points.map((point) => (
                      <div key={point} className="exp-point">
                        <span className="exp-point-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        </span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
