import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 140;
const CONNECT_DISTANCE = 90;
const REPEL_DISTANCE = 120;
const PARTICLE_COLORS = ['rgba(99,102,241,0.18)', 'rgba(56,189,248,0.15)'];

const random = (min, max) => Math.random() * (max - min) + min;

const createParticle = (width, height) => {
  const angle = random(0, Math.PI * 2);
  const speed = random(6, 16);

  return {
    x: random(0, width),
    y: random(0, height),
    radius: random(1, 3),
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    wobblePhase: random(0, Math.PI * 2),
    wobbleSpeed: random(0.7, 1.5),
    wobbleAmp: random(1.2, 3.6),
  };
};

export default function DustBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let startTime = 0;
    let lastTime = 0;
    let particles = [];

    const mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height));
    };

    const wrapParticle = (particle) => {
      const margin = particle.radius * 2;

      if (particle.x < -margin) particle.x = width + margin;
      if (particle.x > width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = height + margin;
      if (particle.y > height + margin) particle.y = -margin;
    };

    const drawFrame = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
        lastTime = timestamp;
      }

      const elapsed = (timestamp - startTime) / 1000;
      const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      const positions = new Array(particles.length);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        wrapParticle(particle);

        let drawX =
          particle.x + Math.sin((elapsed * particle.wobbleSpeed) + particle.wobblePhase) * particle.wobbleAmp;
        let drawY =
          particle.y +
          Math.cos((elapsed * particle.wobbleSpeed * 0.82) + particle.wobblePhase) * particle.wobbleAmp * 0.72;

        if (mouse.active) {
          const dx = drawX - mouse.x;
          const dy = drawY - mouse.y;
          const distSq = (dx * dx) + (dy * dy);

          if (distSq > 0.0001 && distSq < (REPEL_DISTANCE * REPEL_DISTANCE)) {
            const dist = Math.sqrt(distSq);
            const strength = ((REPEL_DISTANCE - dist) / REPEL_DISTANCE) * 24 * dt;
            const nx = dx / dist;
            const ny = dy / dist;
            particle.x += nx * strength;
            particle.y += ny * strength;
            drawX += nx * strength;
            drawY += ny * strength;
          }
        }

        positions[i] = { x: drawX, y: drawY, particle };
      }

      for (let i = 0; i < positions.length; i += 1) {
        const a = positions[i];
        for (let j = i + 1; j < positions.length; j += 1) {
          const b = positions[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = (dx * dx) + (dy * dy);

          if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
            const dist = Math.sqrt(distSq);
            const alpha = 0.05 * (1 - (dist / CONNECT_DISTANCE));
            ctx.strokeStyle = `rgba(99,102,241,${alpha.toFixed(4)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const point of positions) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.particle.color;
        ctx.fill();
      }

      frameId = window.requestAnimationFrame(drawFrame);
    };

    const handlePointerMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const clearMouse = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', clearMouse);
    window.addEventListener('blur', clearMouse);
    frameId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', clearMouse);
      window.removeEventListener('blur', clearMouse);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
