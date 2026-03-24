import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    const updateCursor = () => {
      // Smooth cursor movement
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      // Faster dot movement
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;

      if (cursor) {
        cursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`;
      }
      if (cursorDot) {
        cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }

      requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      if (cursor) cursor.style.opacity = '1';
      if (cursorDot) cursorDot.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      if (cursor) cursor.style.opacity = '0';
      if (cursorDot) cursorDot.style.opacity = '0';
    };

    const handleMouseDown = () => {
      if (cursor) {
        cursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px) scale(0.8)`;
      }
    };

    const handleMouseUp = () => {
      if (cursor) {
        cursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px) scale(1)`;
      }
    };

    // Add hover effects for interactive elements
    const handleElementHover = (e) => {
      if (e.target.matches('a, button, [role="button"], input, textarea, select')) {
        if (cursor) {
          cursor.style.width = '40px';
          cursor.style.height = '40px';
          cursor.style.borderColor = 'var(--primary)';
        }
      } else {
        if (cursor) {
          cursor.style.width = '32px';
          cursor.style.height = '32px';
          cursor.style.borderColor = 'var(--text)';
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);

    updateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-text rounded-full pointer-events-none z-50 transition-all duration-100 hidden md:block"
        style={{ opacity: 0 }}
      />

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-50 hidden md:block"
        style={{ opacity: 0 }}
      />
    </>
  );
}
