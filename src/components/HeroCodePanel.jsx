import React, { useEffect, useState } from 'react';
import './HeroCodePanel.css';

const SNIPPETS = [
  {
    name: 'twoSum.js',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const rest = target - nums[i];
    if (map.has(rest)) return [map.get(rest), i];
    map.set(nums[i], i);
  }
}`,
  },
  {
    name: 'binarySearch.js',
    code: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;
  }
  return -1;
}`,
  },
  {
    name: 'reverseList.js',
    code: `function reverseList(head) {
  let prev = null;
  while (head) {
    const next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}`,
  },
];

const KEYWORDS = /\b(function|const|let|var|if|return|while|for)\b/g;

function highlightCode(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(KEYWORDS, '<span class="hero-code-kw">$1</span>')
    .replace(/\b(-?\d+)\b/g, '<span class="hero-code-num">$1</span>');
}

function useCodeTypewriter(snippets, { typeSpeed = 22, holdTime = 1800, deleteSpeed = 8 } = {}) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const fullText = snippets[snippetIndex].code;

  useEffect(() => {
    if (reduceMotion) return undefined;

    let timeoutId;
    const runWhenVisible = (fn, delay) => {
      timeoutId = window.setTimeout(() => {
        if (document.hidden) {
          // Tab is backgrounded: stop burning cycles, just poll occasionally.
          runWhenVisible(fn, 400);
          return;
        }
        fn();
      }, delay);
    };

    if (!deleting && charIndex === fullText.length) {
      runWhenVisible(() => setDeleting(true), holdTime);
      return () => window.clearTimeout(timeoutId);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setSnippetIndex((prev) => (prev + 1) % snippets.length);
      return undefined;
    }

    runWhenVisible(
      () => setCharIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => window.clearTimeout(timeoutId);
  }, [charIndex, deleting, fullText, snippets.length, reduceMotion, typeSpeed, deleteSpeed, holdTime]);

  if (reduceMotion) return { text: fullText, name: snippets[snippetIndex].name };
  return { text: fullText.slice(0, charIndex), name: snippets[snippetIndex].name };
}

export default function HeroCodePanel() {
  const { text, name } = useCodeTypewriter(SNIPPETS);

  return (
    <div className="hero-code-stage" aria-hidden="true">
      <div className="hero-code-card">
        <div className="hero-code-titlebar">
          <span className="hero-code-dot hero-code-dot-red" />
          <span className="hero-code-dot hero-code-dot-yellow" />
          <span className="hero-code-dot hero-code-dot-green" />
          <span className="hero-code-filename">{name}</span>
        </div>
        <pre className="hero-code-body">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(text) }} />
          <span className="hero-code-cursor" />
        </pre>
      </div>

      <span className="hero-code-badge hero-code-badge-1">O(n)</span>
      <span className="hero-code-badge hero-code-badge-2">{'{ }'}</span>
      <span className="hero-code-badge hero-code-badge-3">DSA</span>
    </div>
  );
}
