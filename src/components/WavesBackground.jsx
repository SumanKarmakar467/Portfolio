import React, { useEffect, useRef } from 'react';

const WAVE_COLORS = [
  'rgba(99,102,241,0.06)',
  'rgba(56,189,248,0.07)',
  'rgba(167,139,250,0.08)',
  'rgba(99,102,241,0.06)',
  'rgba(56,189,248,0.07)',
];

const WAVE_CONFIG = [
  { amplitude: 22, frequency: 0.0065, speed: 42, yBase: 0.56, phase: 0.5 },
  { amplitude: 28, frequency: 0.0082, speed: 58, yBase: 0.62, phase: 1.4 },
  { amplitude: 19, frequency: 0.0094, speed: 33, yBase: 0.68, phase: 2.2 },
  { amplitude: 25, frequency: 0.0073, speed: 47, yBase: 0.74, phase: 3.1 },
  { amplitude: 16, frequency: 0.0104, speed: 64, yBase: 0.8, phase: 4.0 },
];

const drawWave = (ctx, wave, width, height) => {
  const baseY = height * wave.yBase;

  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY);

  for (let x = 0; x <= width; x += 6) {
    const y = baseY + (Math.sin((x * wave.frequency) + wave.phase) * wave.amplitude);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = wave.color;
  ctx.fill();
};

export default function WavesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let lastTime = 0;
    const waves = WAVE_CONFIG.map((wave, index) => ({
      ...wave,
      color: WAVE_COLORS[index % WAVE_COLORS.length],
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (const wave of waves) {
        // Reduce phase to create rightward flow.
        wave.phase -= wave.speed * wave.frequency * dt;
        drawWave(ctx, wave, width, height);
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
