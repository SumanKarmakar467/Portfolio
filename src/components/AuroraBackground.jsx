import React, { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function AuroraBackground() {
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
    let baseGradient = null;

    const layers = [
      {
        color: 'rgba(72, 255, 151, 0.22)',
        baseYFactor: 0.24,
        amplitudeFactor: 0.09,
        frequency: 0.0068,
        speed: 0.00032,
        phase: Math.PI * 0.15,
      },
      {
        color: 'rgba(103, 235, 255, 0.18)',
        baseYFactor: 0.33,
        amplitudeFactor: 0.1,
        frequency: 0.0059,
        speed: 0.00026,
        phase: Math.PI * 0.75,
      },
      {
        color: 'rgba(151, 109, 255, 0.16)',
        baseYFactor: 0.41,
        amplitudeFactor: 0.11,
        frequency: 0.0051,
        speed: 0.0002,
        phase: Math.PI * 1.25,
      },
      {
        color: 'rgba(75, 255, 211, 0.14)',
        baseYFactor: 0.5,
        amplitudeFactor: 0.08,
        frequency: 0.0045,
        speed: 0.00015,
        phase: Math.PI * 1.7,
      },
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const radius = Math.hypot(width, height) * 0.82;
      baseGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      baseGradient.addColorStop(0, '#0b1830');
      baseGradient.addColorStop(0.45, '#060f20');
      baseGradient.addColorStop(1, '#02050c');
    };

    const drawLayer = (layer, time) => {
      const baseY = height * layer.baseYFactor;
      const amplitude = clamp(height * layer.amplitudeFactor, 26, 130);
      const step = 14;

      context.beginPath();
      context.moveTo(0, height);

      for (let x = 0; x <= width + step; x += step) {
        const waveA = Math.sin(x * layer.frequency + time * layer.speed + layer.phase) * amplitude;
        const waveB =
          Math.sin(x * layer.frequency * 1.9 + time * layer.speed * 0.64 + layer.phase * 1.3) * amplitude * 0.45;
        const y = baseY + waveA + waveB;
        context.lineTo(x, y);
      }

      context.lineTo(width, height);
      context.closePath();

      context.fillStyle = layer.color;
      context.fill();
    };

    const drawFrame = (time) => {
      if (baseGradient) {
        context.fillStyle = baseGradient;
        context.fillRect(0, 0, width, height);
      } else {
        context.fillStyle = '#02050c';
        context.fillRect(0, 0, width, height);
      }

      context.globalCompositeOperation = 'source-over';
      for (let index = 0; index < layers.length; index += 1) {
        drawLayer(layers[index], time);
      }

      context.globalCompositeOperation = 'lighter';
      for (let index = 0; index < layers.length; index += 1) {
        drawLayer(
          {
            ...layers[index],
            color: layers[index].color.replace(/,\s*0\.\d+\)/, ', 0.06)'),
            baseYFactor: layers[index].baseYFactor - 0.025,
            amplitudeFactor: layers[index].amplitudeFactor * 0.72,
            speed: layers[index].speed * 1.25,
          },
          time,
        );
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
