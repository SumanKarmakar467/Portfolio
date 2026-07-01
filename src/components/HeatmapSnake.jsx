import React from 'react';
import './HeatmapSnake.css';

export default function HeatmapSnake() {
  return (
    <div className="heatmap-snake-layer" aria-hidden="true">
      <div className="heatmap-snake-glow" />
      <div className="heatmap-snake">
        <span className="heatmap-snake-segment heatmap-snake-seg-3" />
        <span className="heatmap-snake-segment heatmap-snake-seg-2" />
        <span className="heatmap-snake-segment heatmap-snake-seg-1" />
        <span className="heatmap-snake-head">
          <span className="heatmap-snake-eye" />
          <span className="heatmap-snake-eye" />
        </span>
      </div>
    </div>
  );
}
