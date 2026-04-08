import React, { useEffect, useRef } from 'react';

const SHAPE_COUNT = 18;
const SIDES = [3, 5, 6, 8];
const OUTLINE_COLORS = ['rgba(186, 123, 255, 0.24)', 'rgba(255, 122, 220, 0.22)'];
const INNER_COLORS = ['rgba(186, 123, 255, 0.16)', 'rgba(255, 122, 220, 0.15)'];

const random = (min, max) => Math.random() * (max - min) + min;

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const drawPolygon = (ctx, shape, radius, rotation, color, lineWidth) => {
  const step = (Math.PI * 2) / shape.sides;
  ctx.beginPath();

  for (let i = 0; i < shape.sides; i += 1) {
    const angle = rotation + (i * step);
    const x = shape.x + (Math.cos(angle) * radius);
    const y = shape.y + (Math.sin(angle) * radius);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

const makeShape = (width, height) => {
  const baseRadius = random(26, 110);

  return {
    sides: pick(SIDES),
    x: random(0, width),
    y: random(0, height),
    vx: random(-15, 15),
    vy: random(-15, 15),
    rotation: random(0, Math.PI * 2),
    rotationSpeed: random(-0.32, 0.32),
    pulseSpeed: random(0.35, 1.1),
    pulsePhase: random(0, Math.PI * 2),
    pulseDepth: random(0.09, 0.22),
    baseRadius,
    innerScale: random(0.48, 0.7),
    innerOffset: random(0.16, 0.62),
    outerColor: pick(OUTLINE_COLORS),
    innerColor: pick(INNER_COLORS),
    lineWidth: random(0.8, 1.7),
  };
};

export default function GeoBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let animationStart = 0;
    let lastTime = 0;
    let shapes = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      shapes = Array.from({ length: SHAPE_COUNT }, () => makeShape(width, height));
    };

    const animate = (timestamp) => {
      if (!animationStart) {
        animationStart = timestamp;
        lastTime = timestamp;
      }

      const elapsed = (timestamp - animationStart) / 1000;
      const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      ctx.fillStyle = '#070511';
      ctx.fillRect(0, 0, width, height);

      for (const shape of shapes) {
        shape.x += shape.vx * dt;
        shape.y += shape.vy * dt;
        shape.rotation += shape.rotationSpeed * dt;

        const pulse = 1 + (Math.sin((elapsed * shape.pulseSpeed) + shape.pulsePhase) * shape.pulseDepth);
        const radius = shape.baseRadius * pulse;
        const padding = radius * 1.3;

        if (shape.x < -padding) shape.x = width + padding;
        if (shape.x > width + padding) shape.x = -padding;
        if (shape.y < -padding) shape.y = height + padding;
        if (shape.y > height + padding) shape.y = -padding;

        drawPolygon(ctx, shape, radius, shape.rotation, shape.outerColor, shape.lineWidth);
        drawPolygon(
          ctx,
          shape,
          radius * shape.innerScale,
          shape.rotation + shape.innerOffset,
          shape.innerColor,
          Math.max(0.6, shape.lineWidth - 0.35),
        );
      }

      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
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
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
