import React, { useEffect, useRef } from 'react';

const SPARKLE_COUNT = 90;
const COLORS = [
  { r: 251, g: 191, b: 36, a: 0.35 },
  { r: 99, g: 102, b: 241, a: 0.28 },
  { r: 56, g: 189, b: 248, a: 0.3 },
];

const random = (min, max) => Math.random() * (max - min) + min;

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const createSparkle = (width, height) => ({
  x: random(0, width),
  y: random(0, height),
  radius: random(4, 14),
  color: pick(COLORS),
  phase: random(0, Math.PI * 2),
  speed: random(0.35, 1.2),
});

const lifeAlpha = (wave) => {
  // Fade in (0-0.22), hold (0.22-0.72), fade out (0.72-1.0).
  if (wave < 0.22) return wave / 0.22;
  if (wave < 0.72) return 1;
  return Math.max(0, (1 - wave) / 0.28);
};

const drawSparkle = (ctx, sparkle, alpha) => {
  const longArm = sparkle.radius;
  const shortArm = sparkle.radius * 0.6;
  const rgba = `rgba(${sparkle.color.r},${sparkle.color.g},${sparkle.color.b},${(sparkle.color.a * alpha).toFixed(3)})`;

  ctx.strokeStyle = rgba;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  // Horizontal and vertical lines, total length radius * 2.
  ctx.moveTo(sparkle.x - longArm, sparkle.y);
  ctx.lineTo(sparkle.x + longArm, sparkle.y);
  ctx.moveTo(sparkle.x, sparkle.y - longArm);
  ctx.lineTo(sparkle.x, sparkle.y + longArm);
  // Diagonal lines, total length radius * 1.2.
  ctx.moveTo(sparkle.x - shortArm, sparkle.y - shortArm);
  ctx.lineTo(sparkle.x + shortArm, sparkle.y + shortArm);
  ctx.moveTo(sparkle.x - shortArm, sparkle.y + shortArm);
  ctx.lineTo(sparkle.x + shortArm, sparkle.y - shortArm);
  ctx.stroke();
};

export default function SparkleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let startTime = 0;
    let sparkles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sparkles = Array.from({ length: SPARKLE_COUNT }, () => createSparkle(width, height));
    };

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      for (const sparkle of sparkles) {
        const wave = (Math.sin((elapsed * sparkle.speed) + sparkle.phase) + 1) / 2;
        const alpha = lifeAlpha(wave);
        if (alpha > 0.01) {
          drawSparkle(ctx, sparkle, alpha);
        }
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
