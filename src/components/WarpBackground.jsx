import React, { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function starCountForViewport(width, height) {
  const area = width * height;
  return clamp(Math.round(area / 4200), 180, 520);
}

function createStar(width, height, startNearCenter = false) {
  const maxRadius = Math.hypot(width, height) * 0.7;
  const angle = Math.random() * Math.PI * 2;
  const depth = 0.18 + Math.random() * 0.82;
  const radius = startNearCenter ? Math.random() * 14 : Math.random() * maxRadius * 0.32;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return {
    x,
    y,
    previousX: x,
    previousY: y,
    angle,
    depth,
  };
}

export default function WarpBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let frameId = 0;
    let lastTimestamp = performance.now();
    let backgroundGradient = null;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const radius = Math.hypot(width, height) * 0.7;
      backgroundGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      backgroundGradient.addColorStop(0, '#0b1633');
      backgroundGradient.addColorStop(0.35, '#050d1f');
      backgroundGradient.addColorStop(1, '#010308');

      const starCount = starCountForViewport(width, height);
      stars = Array.from({ length: starCount }, () => createStar(width, height, false));
    };

    const respawnStar = (index) => {
      stars[index] = createStar(width, height, true);
    };

    const drawFrame = (timestamp) => {
      const delta = clamp((timestamp - lastTimestamp) / 16.67, 0.35, 2.1);
      lastTimestamp = timestamp;

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const bounds = Math.max(width, height) * 0.65;

      context.fillStyle = '#010308';
      context.fillRect(0, 0, width, height);
      if (backgroundGradient) {
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, width, height);
      }

      context.lineCap = 'round';

      for (let index = 0; index < stars.length; index += 1) {
        const star = stars[index];
        const directionX = Math.cos(star.angle);
        const directionY = Math.sin(star.angle);
        const speed = (1.2 + star.depth * star.depth * 23) * delta;

        star.previousX = star.x;
        star.previousY = star.y;
        star.x += directionX * speed;
        star.y += directionY * speed;

        if (Math.abs(star.x) > bounds || Math.abs(star.y) > bounds) {
          respawnStar(index);
          continue;
        }

        const fromX = centerX + star.previousX;
        const fromY = centerY + star.previousY;
        const toX = centerX + star.x;
        const toY = centerY + star.y;

        const intensity = clamp(0.28 + star.depth * 0.9, 0.22, 1);
        const red = Math.round(155 + star.depth * 100);
        const green = Math.round(185 + star.depth * 70);
        const blue = 255;

        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${intensity})`;
        context.lineWidth = 0.5 + star.depth * 2.1;
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
      }

      frameId = window.requestAnimationFrame(drawFrame);
    };

    resize();
    frameId = window.requestAnimationFrame(drawFrame);
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
