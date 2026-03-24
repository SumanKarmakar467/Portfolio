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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
