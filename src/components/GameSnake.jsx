import React, { useEffect, useMemo, useRef, useState } from 'react';
import './GameSnake.css';

const STEP_MS = 260;

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
  const [stepIndex, setStepIndex] = useState(0);
  const onVisitRef = useRef(onVisit);
  onVisitRef.current = onVisit;

  useEffect(() => {
    setStepIndex(0);
  }, [path]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || path.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % path.length);
    }, STEP_MS);

    return () => window.clearInterval(intervalId);
  }, [path]);

  const [col, row] = path[stepIndex] || [0, 0];
  const [prevCol, prevRow] = path[(stepIndex - 1 + path.length) % path.length] || [col, row];

  useEffect(() => {
    onVisitRef.current?.(col, row);
  }, [col, row]);

  const colDenom = Math.max(columns - 1, 1);
  const rowDenom = Math.max(rows - 1, 1);
  const left = `${(col / colDenom) * 100}%`;
  const top = `${(row / rowDenom) * 100}%`;

  const facingRight = col >= prevCol;
  const facingDown = row >= prevRow;

  return (
    <div className="game-snake-layer" aria-hidden="true">
      <span className="game-snake-seg game-snake-seg-3" style={{ left, top }} />
      <span className="game-snake-seg game-snake-seg-2" style={{ left, top }} />
      <span className="game-snake-seg game-snake-seg-1" style={{ left, top }} />
      <span
        className="game-snake-head"
        style={{
          left,
          top,
          '--eye-x': facingRight ? '1px' : '-1px',
          '--eye-y': facingDown ? '1px' : '-1px',
        }}
      >
        <span className="game-snake-eye" />
        <span className="game-snake-eye" />
      </span>
    </div>
  );
}
