import React, { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomChar(characters) {
  return characters[(Math.random() * characters.length) | 0];
}

function createColumn(height, fontSize) {
  return {
    y: -Math.random() * (height / fontSize),
    speed: 0.7 + Math.random() * 2.1,
    resetAt: height + Math.random() * height * 0.8,
  };
}

export default function MatrixBackground() {
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

    const fontSize = 18;
    const characters = [
      'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
      'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
      'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
      'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
      'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', '0', '1',
    ];

    let columns = [];

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columnCount = Math.ceil(width / fontSize) + 1;
      columns = Array.from({ length: columnCount }, () => createColumn(height, fontSize));

      context.fillStyle = '#020503';
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px "JetBrains Mono", "Noto Sans JP", monospace`;
      context.textBaseline = 'top';
    };

    const drawFrame = (time) => {
      const delta = clamp((time - lastTime) / 16.67, 0.35, 2.5);
      lastTime = time;

      context.fillStyle = 'rgba(2, 6, 3, 0.16)';
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < columns.length; index += 1) {
        const column = columns[index];
        const x = index * fontSize;
        const y = column.y * fontSize;

        const whiteFlash = Math.random() < 0.028;
        if (whiteFlash) {
          context.fillStyle = 'rgba(224, 255, 234, 0.95)';
        } else {
          const alpha = clamp(0.5 + column.speed * 0.2, 0.45, 0.95);
          context.fillStyle = `rgba(52, 255, 110, ${alpha.toFixed(3)})`;
        }

        context.fillText(randomChar(characters), x, y);

        column.y += column.speed * delta;

        const randomDesyncReset = Math.random() < 0.0018;
        if (y > column.resetAt || randomDesyncReset) {
          columns[index] = createColumn(height, fontSize);
        }
      }

      frameId = window.requestAnimationFrame(drawFrame);
    };

    setupCanvas();
    frameId = window.requestAnimationFrame(drawFrame);
    window.addEventListener('resize', setupCanvas);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', setupCanvas);
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
        background: '#010304',
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
