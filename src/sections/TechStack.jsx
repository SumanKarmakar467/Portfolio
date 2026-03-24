import React, { useState } from 'react';
import { techStack } from '../constants/techStack';

const categories = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Databases & Cloud' },
  { id: 'ai', label: 'AI Tools' },
  { id: 'tools', label: 'Tools & Deployment' },
];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState('frontend');

  return (
    <section id="techstack" className="section bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-subtitle">
            Core technologies from your previous portfolio, now integrated here
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2 bg-background border border-border rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
              >
                <span className="font-medium text-sm md:text-base">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {techStack[activeCategory].map((tech, index) => (
            <div key={tech.name} className="card text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-sm font-bold tracking-wide mb-3 text-primary/80 group-hover:text-primary transition-colors duration-200">
                {tech.icon}
              </div>
              <h3 className="font-space font-semibold mb-2 group-hover:text-primary transition-colors">
                {tech.name}
              </h3>

              <div className="w-full bg-border rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: '0%',
                    animation: `progress-${index} 2s ease-out ${index * 0.1}s forwards`,
                  }}
                />
              </div>

              <div className="text-xs text-muted">{tech.level}% proficiency</div>

              <style>{`
                @keyframes progress-${index} {
                  to { width: ${tech.level}%; }
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
