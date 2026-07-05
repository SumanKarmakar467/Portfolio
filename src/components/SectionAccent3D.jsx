import React from 'react';
import './SectionAccent3D.css';

export default function SectionAccent3D({ size = 'md' }) {
  return (
    <span className={`section-accent-3d section-accent-3d-${size}`} aria-hidden="true">
      <span className="section-accent-3d-cube">
        <span className="section-accent-3d-face section-accent-3d-face-front" />
        <span className="section-accent-3d-face section-accent-3d-face-back" />
        <span className="section-accent-3d-face section-accent-3d-face-right" />
        <span className="section-accent-3d-face section-accent-3d-face-left" />
        <span className="section-accent-3d-face section-accent-3d-face-top" />
        <span className="section-accent-3d-face section-accent-3d-face-bottom" />
      </span>
    </span>
  );
}
