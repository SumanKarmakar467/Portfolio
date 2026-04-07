import React from 'react';
import { certifications } from '../constants/certifications';

export default function Certifications() {
  return (
    <section id="certifications" className="section">
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
                <article key={certificate.id} className="card w-[84vw] max-w-[360px] shrink-0 snap-start overflow-hidden group">
                  <a href={certificate.href} target="_blank" rel="noopener noreferrer" className="block mb-4">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border">
                      <img
                        src={certificate.image}
                        alt={`${certificate.title} certificate`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </a>

                  <h3 className="font-space font-semibold mb-2 group-hover:text-primary transition-colors">
                    {certificate.title}
                  </h3>
                  <p className="text-sm text-muted mb-4">{certificate.issuer}</p>

                  <a
                    href={certificate.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-medium text-primary hover:underline"
                  >
                    Open Certificate
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
          {certifications.map((certificate) => (
            <article key={certificate.id} className="card overflow-hidden group">
              <a href={certificate.href} target="_blank" rel="noopener noreferrer" className="block mb-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border">
                  <img
                    src={certificate.image}
                    alt={`${certificate.title} certificate`}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </a>

              <h3 className="font-space font-semibold mb-2 group-hover:text-primary transition-colors">
                {certificate.title}
              </h3>
              <p className="text-sm text-muted mb-4">{certificate.issuer}</p>

              <a
                href={certificate.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-medium text-primary hover:underline"
              >
                Open Certificate
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
