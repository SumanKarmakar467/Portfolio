import React, { useEffect, useRef } from 'react';
import './AuroraBackground.css';

const PALETTES = {
  dark: {
    particle: 'rgba(255, 138, 160, ALPHA)',
    link: 'rgba(255, 122, 180, ALPHA)',
    mouseLink: 'rgba(140, 220, 255, ALPHA)',
  },
  light: {
    particle: 'rgba(68, 161, 148, ALPHA)',
    link: 'rgba(236, 143, 141, ALPHA)',
    mouseLink: 'rgba(68, 161, 148, ALPHA)',
  },
};

const random = (min, max) => Math.random() * (max - min) + min;

function createParticle(width, height) {
  return {
    x: random(0, width),
    y: random(0, height),
    vx: random(-9, 9),
    vy: random(-9, 9),
    radius: random(1.1, 2.6),
  };
}

export default function AuroraBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = 0;
    let lastTime = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const density = 15000;
    const maxParticles = 110;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(maxParticles, Math.max(38, Math.floor((width * height) / density)));
      particles = Array.from({ length: count }, () => createParticle(width, height));
    };

    const onMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const linkDistance = 130;
    const mouseRadius = 150;

    const draw = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      const palette = PALETTES[themeRef.current] || PALETTES.dark;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouseRadius && dist > 0.001) {
              const force = (1 - dist / mouseRadius) * 46;
              p.x += (dx / dist) * force * dt;
              p.y += (dy / dist) * force * dt;
            }
          }

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.5;
            ctx.strokeStyle = palette.link.replace('ALPHA', alpha.toFixed(3));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRadius) {
            const alpha = (1 - dist / mouseRadius) * 0.6;
            ctx.strokeStyle = palette.mouseLink.replace('ALPHA', alpha.toFixed(3));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = palette.particle.replace('ALPHA', '0.9');
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-grid" />
      <canvas ref={canvasRef} className="aurora-canvas" />
      <div className="aurora-vignette" />
    </div>
  );
}
