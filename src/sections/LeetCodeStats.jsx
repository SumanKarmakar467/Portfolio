import React, { useEffect, useMemo, useState } from 'react';

const LEETCODE_USERNAME = 'suman2k04';
const LEETCODE_API_URLS = [
  `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`,
  `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`,
];

function StatCard({ label, value, tone }) {
  const toneClass =
    tone === 'easy'
      ? 'text-emerald-500'
      : tone === 'medium'
        ? 'text-amber-500'
        : 'text-rose-500';

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-5 text-center shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-playfair font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default function LeetCodeStats() {
  const [stats, setStats] = useState({
    easySolved: null,
    mediumSolved: null,
    hardSolved: null,
    totalSolved: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      for (const url of LEETCODE_API_URLS) {
        try {
          const response = await fetch(url);
          const data = await response.json();

          const easy = data.easySolved ?? null;
          const medium = data.mediumSolved ?? null;
          const hard = data.hardSolved ?? null;
          const total = data.totalSolved ?? data.solvedProblem ?? null;

          if (easy !== null || medium !== null || hard !== null || total !== null) {
            if (!isMounted) return;
            setStats({
              easySolved: easy,
              mediumSolved: medium,
              hardSolved: hard,
              totalSolved: total,
            });
            return;
          }
        } catch (_) {
          // Try next API
        }
      }
    };

    fetchStats().finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const solvedText = useMemo(() => {
    if (loading) return 'Loading your latest LeetCode problem counts...';
    if (stats.totalSolved === null) return 'Live solved-count API is unavailable at the moment. Activity graph is still shown below.';
    return `Total solved: ${stats.totalSolved}`;
  }, [loading, stats.totalSolved]);

  const displayValue = (value) => (value === null ? '--' : value);
  const totalSolved = stats.totalSolved ?? '--';

  return (
    <section id="leetcode" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">LeetCode Progress</h2>
          <p className="section-subtitle">
            Difficulty-wise solved questions and activity graph from my LeetCode profile.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <article className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-background/80 p-5 shadow-sm sm:p-7">
            <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-space font-semibold text-primary">DSA Snapshot</h3>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    @{LEETCODE_USERNAME}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard label="Easy Solved" value={displayValue(stats.easySolved)} tone="easy" />
                  <StatCard label="Medium Solved" value={displayValue(stats.mediumSolved)} tone="medium" />
                  <StatCard label="Hard Solved" value={displayValue(stats.hardSolved)} tone="hard" />
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-background/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Total Solved</p>
                  <p className="mt-1 text-3xl font-playfair font-bold text-text">{totalSolved}</p>
                  <p className="mt-2 text-sm text-muted">{solvedText}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/35 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Heatmap</h4>
                  <span className="text-xs text-muted">Theme-tuned</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-black/30 p-2">
                  <img
                    src={`https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?theme=dark&font=Karma&ext=heatmap`}
                    alt={`${LEETCODE_USERNAME} LeetCode heatmap`}
                    className="w-full rounded-lg"
                    style={{ filter: 'hue-rotate(-120deg) saturate(1.5) brightness(1.05)' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-5 shadow-sm">
              <h3 className="text-base font-space font-semibold text-text">Consistency Focus</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Building problem-solving consistency across Easy, Medium, and Hard levels with regular weekly practice.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-5 shadow-sm text-center sm:text-left">
              <h3 className="text-base font-space font-semibold text-text">LeetCode Profile</h3>
              <p className="mt-2 text-sm text-muted">
                Explore detailed submissions, contest history, and solved set directly on profile.
              </p>
              <a
                href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-4"
              >
                View LeetCode Profile
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
