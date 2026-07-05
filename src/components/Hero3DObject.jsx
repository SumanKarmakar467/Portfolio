import React, { useEffect, useRef } from 'react';
import './Hero3DObject.css';

export default function Hero3DObject() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrapper = wrapperRef.current;
    if (!stage || !wrapper) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rect = stage.getBoundingClientRect();
    let isVisible = true;
    let isRunning = false;

    const updateRect = () => {
      rect = stage.getBoundingClientRect();
    };

    const onMouseMove = (event) => {
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = py * -22;
      targetY = px * 26;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      wrapper.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      raf = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      raf = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      isRunning = false;
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const syncLoopState = () => {
      if (isVisible && !document.hidden) startLoop();
      else stopLoop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncLoopState();
    });
    observer.observe(stage);

    const onVisibilityChange = () => syncLoopState();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', updateRect);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateRect);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div className="hero-3d-stage" ref={stageRef} aria-hidden="true">
      <div className="hero-3d-glow" />
      <div className="hero-3d-wrapper" ref={wrapperRef}>
        <div className="hero-3d-cube">
          <span className="hero-3d-face hero-3d-face-front" />
          <span className="hero-3d-face hero-3d-face-back" />
          <span className="hero-3d-face hero-3d-face-right" />
          <span className="hero-3d-face hero-3d-face-left" />
          <span className="hero-3d-face hero-3d-face-top" />
          <span className="hero-3d-face hero-3d-face-bottom" />
        </div>

        <div className="hero-3d-shard hero-3d-shard-1" />
        <div className="hero-3d-shard hero-3d-shard-2" />
        <div className="hero-3d-shard hero-3d-shard-3" />
        <div className="hero-3d-ring" />
      </div>
    </div>
  );
}
