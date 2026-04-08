import React, { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createShape(width, height) {
  const sidesPool = [3, 5, 6, 8];
  const palette = [
    'rgba(216, 120, 255, 0.22)',
    'rgba(194, 112, 255, 0.2)',
    'rgba(255, 102, 214, 0.2)',
    'rgba(245, 120, 255, 0.18)',
  ];

  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    vx: randomBetween(-0.2, 0.2),
    vy: randomBetween(-0.16, 0.16),
    radius: randomBetween(26, clamp(Math.min(width, height) * 0.16, 58, 120)),
    sides: sidesPool[(Math.random() * sidesPool.length) | 0],
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.0035, 0.0035),
    scaleBase: randomBetween(0.76, 1.12),
    scaleAmplitude: randomBetween(0.08, 0.24),
    scaleSpeed: randomBetween(0.00035, 0.0012),
    scalePhase: randomBetween(0, Math.PI * 2),
    innerOffset: randomBetween(0.15, 0.5),
    innerScale: randomBetween(0.48, 0.7),
    stroke: palette[(Math.random() * palette.length) | 0],
    lineWidth: randomBetween(0.8, 1.8),
  };
}

function drawPolygon(context, sides, centerX, centerY, radius, rotation) {
  context.beginPath();
  for (let index = 0; index < sides; index += 1) {
    const angle = rotation + (index * Math.PI * 2) / sides;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
}

function shapeCountForViewport(width, height) {
  const area = width * height;
  return clamp(Math.round(area / 100000), 15, 20);
}

export default function GeoBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let lastTime = performance.now();
    let shapes = [];
    let backgroundGradient = null;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const radius = Math.hypot(width, height) * 0.72;
      backgroundGradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius);
      backgroundGradient.addColorStop(0, '#120920');
      backgroundGradient.addColorStop(0.5, '#0a0613');
      backgroundGradient.addColorStop(1, '#040308');

      const count = shapeCountForViewport(width, height);
      shapes = Array.from({ length: count }, () => createShape(width, height));
    };

    const tickShape = (shape, delta, time) => {
      shape.x += shape.vx * delta;
      shape.y += shape.vy * delta;
      shape.rotation += shape.rotationSpeed * delta;

      const wrapMargin = shape.radius * 1.6;
      if (shape.x < -wrapMargin) shape.x = width + wrapMargin;
      if (shape.x > width + wrapMargin) shape.x = -wrapMargin;
      if (shape.y < -wrapMargin) shape.y = height + wrapMargin;
      if (shape.y > height + wrapMargin) shape.y = -wrapMargin;

      const scalePulse = shape.scaleBase + Math.sin(time * shape.scaleSpeed + shape.scalePhase) * shape.scaleAmplitude;
      const outerRadius = shape.radius * scalePulse;
      const innerRadius = outerRadius * shape.innerScale;

      context.strokeStyle = shape.stroke;
      context.lineWidth = shape.lineWidth;

      drawPolygon(context, shape.sides, shape.x, shape.y, outerRadius, shape.rotation);
      context.stroke();

      drawPolygon(context, shape.sides, shape.x, shape.y, innerRadius, shape.rotation + shape.innerOffset);
      context.stroke();
    };

    const render = (time) => {
      const delta = clamp((time - lastTime) / 16.67, 0.4, 2.2);
      lastTime = time;

      if (backgroundGradient) {
        context.fillStyle = backgroundGradient;
      } else {
        context.fillStyle = '#040308';
      }
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < shapes.length; index += 1) {
        tickShape(shapes[index], delta, time);
      }

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    frameId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);

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
        overflow: 'hidden',
        background: '#040308',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
