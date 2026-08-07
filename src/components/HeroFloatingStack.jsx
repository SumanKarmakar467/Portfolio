import React from 'react';
import './HeroFloatingStack.css';

const GLYPHS = [
  { id: 'braces', label: '{ }', top: '14%', left: '54%', size: 'lg', delay: '0s' },
  { id: 'tags', label: '</>', top: '30%', left: '72%', size: 'md', delay: '0.6s' },
  { id: 'arrow', label: '=>', top: '58%', left: '60%', size: 'sm', delay: '1.4s' },
  { id: 'brackets', label: '[ ]', top: '68%', left: '80%', size: 'md', delay: '2.1s' },
  { id: 'db', label: 'DB', top: '46%', left: '86%', size: 'sm', delay: '0.9s' },
  { id: 'async', label: 'async', top: '20%', left: '86%', size: 'sm', delay: '1.7s' },
];

export default function HeroFloatingStack() {
  return (
    <div className="hero-float-stage" aria-hidden="true">
      {GLYPHS.map((glyph) => (
        <span
          key={glyph.id}
          className={`hero-float-glyph hero-float-glyph--${glyph.size}`}
          style={{ top: glyph.top, left: glyph.left, animationDelay: glyph.delay }}
        >
          {glyph.label}
        </span>
      ))}
    </div>
  );
}
