import { useEffect } from 'react';

const VISIT_PING_KEY = 'portfolio:last-visit-notification';
const RATE_LIMIT_MS = 6 * 60 * 60 * 1000; // 6 hours
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export default function useVisitNotifier() {
  useEffect(() => {
    const endpoint = import.meta.env.VITE_VISIT_NOTIFY_ENDPOINT;
    const token = import.meta.env.VITE_VISIT_NOTIFY_TOKEN;

    if (!endpoint || typeof window === 'undefined') return;
    if (LOCAL_HOSTS.has(window.location.hostname)) return;

    const now = Date.now();
    const lastPingRaw = window.localStorage.getItem(VISIT_PING_KEY);
    const lastPing = lastPingRaw ? Number(lastPingRaw) : 0;

    if (Number.isFinite(lastPing) && now - lastPing < RATE_LIMIT_MS) return;

    const payload = {
      event: 'portfolio_visit',
      visitedAt: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
      language: navigator.language || 'unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      userAgent: navigator.userAgent,
    };

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headers['x-visit-token'] = token;
    }

    window.localStorage.setItem(VISIT_PING_KEY, String(now));

    fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // If notification fails, allow retry on the next visit.
      window.localStorage.removeItem(VISIT_PING_KEY);
    });
  }, []);
}
