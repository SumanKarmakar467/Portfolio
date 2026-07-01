import React, { useMemo } from 'react';
import './SnakeStreak.css';

const MAX_PELLETS = 14;
const CYCLE_SECONDS = 4.5;

export default function SnakeStreak({ streak = 0, label = 'Max Streak' }) {
  const safeStreak = Number.isFinite(streak) ? Math.max(streak, 0) : 0;
  const pelletCount = Math.max(Math.min(safeStreak, MAX_PELLETS), safeStreak > 0 ? 1 : 0);

  const pellets = useMemo(() => Array.from({ length: pelletCount }, (_, i) => i), [pelletCount]);

  return (
    <div className="snake-streak">
      <div className="snake-track">
        <div className="snake-pellets" style={{ '--pellet-count': Math.max(pelletCount, 1) }}>
          {pellets.map((i) => (
            <span
              key={i}
              className="snake-pellet"
              style={{
                '--i': i,
                animationDelay: `${(i / Math.max(pelletCount, 1)) * 0.85 * CYCLE_SECONDS}s`,
              }}
            />
          ))}
        </div>
        <div className="snake-runner" aria-hidden="true">
          <span className="snake-segment snake-seg-3" />
          <span className="snake-segment snake-seg-2" />
          <span className="snake-segment snake-seg-1" />
          <span className="snake-head">
            <span className="snake-eye" />
            <span className="snake-eye" />
          </span>
        </div>
      </div>
      <div className="snake-streak-info">
        <span className="snake-streak-flame">🔥</span>
        <div>
          <p className="snake-streak-label">{label}</p>
          <p className="snake-streak-value">
            {safeStreak} day{safeStreak === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </div>
  );
}
