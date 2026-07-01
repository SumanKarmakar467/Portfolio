import React from 'react';
import { certifications } from '../constants/certifications';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './Certifications.css';

function CertCard({ certificate, className = '', style }) {
  return (
    <article className={`cert-card group ${className}`} style={style}>
      <a href={certificate.href} target="_blank" rel="noopener noreferrer" className="block">
        <div className="cert-thumb">
          <span className="cert-verified-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2 4 5v6.5c0 5 3.4 8.9 8 10.5 4.6-1.6 8-5.5 8-10.5V5Z" opacity="0.25" />
              <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            Verified
          </span>
          <img
            src={certificate.image}
            alt={`${certificate.title} certificate`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </a>

      <h3 className="font-space font-semibold mb-1.5 group-hover:text-primary transition-colors">
        {certificate.title}
      </h3>
      <p className="cert-issuer">{certificate.issuer}</p>

      <a href={certificate.href} target="_blank" rel="noopener noreferrer" className="cert-open-btn">
        Open Certificate
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    </article>
  );
}

export default function Certifications() {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <section id="certifications" className="section" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">
            Verified course completions and tech camp participation from your previous portfolio
          </p>
        </div>

        <p className="mb-3 text-sm font-medium text-muted md:hidden">
          See certifications -&gt; swipe horizontally to view more
        </p>

        <div className="md:hidden">
          <div className="-mx-4 px-4">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {certifications.map((certificate) => (
                <CertCard
                  key={certificate.id}
                  certificate={certificate}
                  className={`w-[84vw] max-w-[360px] shrink-0 snap-start ${hasIntersected ? 'is-visible' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {certifications.map((certificate, index) => (
            <CertCard
              key={certificate.id}
              certificate={certificate}
              className={hasIntersected ? 'is-visible' : ''}
              style={{ transitionDelay: `${index * 90}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
