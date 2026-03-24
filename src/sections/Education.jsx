import React from 'react';
import { education } from '../constants/education';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic journey</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary" />

            {education.map((edu) => (
              <div key={edu.id} className="relative mb-12 last:mb-0">
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />

                <div className="ml-20 card">
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

                  <p className="text-muted mb-4 leading-relaxed">{edu.description}</p>

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-primary">Highlights:</h4>
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-muted flex items-start">
                            <span className="text-primary mr-2 mt-1">-</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
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
