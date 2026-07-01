import React, { useEffect, useMemo, useRef, useState } from 'react';
import './GameSnake.css';

const STEP_MS = 260;
const BODY_LENGTH = 7;

function buildPath(columns, rows) {
  if (columns <= 0 || rows <= 0) return [[0, 0]];
  const path = [];

  for (let col = 0; col < columns; col += 1) {
    if (col % 2 === 0) {
      for (let row = 0; row < rows; row += 1) path.push([col, row]);
    } else {
      for (let row = rows - 1; row >= 0; row -= 1) path.push([col, row]);
    }
  }

  const lastRow = path[path.length - 1][1];
  for (let col = columns - 2; col >= 0; col -= 1) path.push([col, lastRow]);

  return path;
}

export default function GameSnake({ columns, rows = 7, onVisit }) {
  const path = useMemo(() => buildPath(columns, rows), [columns, rows]);
  const [history, setHistory] = useState(() => Array.from({ length: BODY_LENGTH }, () => path[0] || [0, 0]));
  const onVisitRef = useRef(onVisit);
  const layerRef = useRef(null);
  const isVisibleRef = useRef(true);
  onVisitRef.current = onVisit;

  useEffect(() => {
    setHistory(Array.from({ length: BODY_LENGTH }, () => path[0] || [0, 0]));
  }, [path]);

  useEffect(() => {
    const element = layerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || path.length <= 1) return undefined;

    let stepIndex = 0;
    const intervalId = window.setInterval(() => {
      if (!isVisibleRef.current) return;
      stepIndex = (stepIndex + 1) % path.length;
      setHistory((prev) => [path[stepIndex], ...prev.slice(0, BODY_LENGTH - 1)]);
    }, STEP_MS);

    return () => window.clearInterval(intervalId);
  }, [path]);

  const [headCol, headRow] = history[0];

  useEffect(() => {
    onVisitRef.current?.(headCol, headRow);
  }, [headCol, headRow]);

  const colDenom = Math.max(columns - 1, 1);
  const rowDenom = Math.max(rows - 1, 1);
  const toPercent = ([col, row]) => ({
    left: `${(col / colDenom) * 100}%`,
    top: `${(row / rowDenom) * 100}%`,
  });

  return (
    <div className="game-snake-layer" aria-hidden="true" ref={layerRef}>
      {history
        .map((pos, index) => ({ pos, index }))
        .reverse()
        .map(({ pos, index }) => (
          <span
            key={index}
            className={`game-snake-seg game-snake-seg-${index}`}
            style={toPercent(pos)}
          />
        ))}
    </div>
  );
}
