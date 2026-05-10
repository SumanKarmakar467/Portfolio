import React, { useEffect, useMemo, useState } from 'react';

const LEETCODE_USERNAME = 'suman2k04';
const LEETCODE_API_URLS = [
  `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`,
  `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`,
];

function StatCard({ label, value, tone }) {
  const toneClass =
    tone === 'easy' ? 'text-emerald-500' : tone === 'medium' ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-5 text-center shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-playfair font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function buildWeeklyHeatmapFromUnixMap(unixMap = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const cells = [];
  for (let d = new Date(gridStart); d <= today; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const unix = String(Math.floor(d.getTime() / 1000));
    cells.push({
      date: iso,
      count: Number(unixMap[unix] || 0),
      weekday: d.getDay(),
      month: d.getMonth(),
    });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function heatColor(count) {
  if (count <= 0) return 'bg-[#24191b]';
  if (count <= 2) return 'bg-[#5a252b]';
  if (count <= 5) return 'bg-[#8a2f3b]';
  if (count <= 9) return 'bg-[#c73f58]';
  return 'bg-[#ff5f7d]';
}

function HeatmapGrid({ weeks }) {
  const [hovered, setHovered] = useState(null);
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthMarkers = useMemo(() => {
    const markers = [];
    weeks.forEach((week, index) => {
      const first = week[0];
      if (!first) return;
      if (index === 0 || first.date.endsWith('-01')) {
        markers.push({ index, month: monthLabels[first.month] });
      }
    });
    return markers;
  }, [weeks]);

  return (
    <div className="rounded-xl border border-border bg-black/30 p-3">
      <div className="relative mb-2 h-4">
        {monthMarkers.map((marker) => (
          <span
            key={`${marker.index}-${marker.month}`}
            className="absolute top-0 text-[10px] text-muted"
            style={{ left: `${marker.index * 14}px` }}
          >
            {marker.month}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="relative inline-flex gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  className={`h-[11px] w-[11px] rounded-[3px] ${heatColor(day.count)} transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-primary/80`}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${day.count} submissions on ${day.date}`}
                />
              ))}
            </div>
          ))}

          {hovered && (
            <div className="pointer-events-none absolute -top-12 left-0 z-20 rounded-lg border border-border bg-background/95 px-2.5 py-1.5 text-xs text-text shadow-lg">
              {hovered.count} submissions on {hovered.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LeetCodeStats() {
  const [stats, setStats] = useState({ easySolved: null, mediumSolved: null, hardSolved: null, totalSolved: null });
  const [calendar, setCalendar] = useState({});
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
            setStats({ easySolved: easy, mediumSolved: medium, hardSolved: hard, totalSolved: total });
            if (data.submissionCalendar) setCalendar(data.submissionCalendar);
            return;
          }
        } catch (_) {}
      }
    };

    fetchStats().finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const weeks = useMemo(() => buildWeeklyHeatmapFromUnixMap(calendar), [calendar]);
  const displayValue = (value) => (value === null ? '--' : value);

  return (
    <section id="leetcode" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">LeetCode Progress</h2>
          <p className="section-subtitle">Live interactive heatmap with daily hover insights.</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <article className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-background/80 p-5 shadow-sm sm:p-7">
            <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr]">
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
                  <p className="mt-1 text-3xl font-playfair font-bold text-text">{displayValue(stats.totalSolved)}</p>
                  <p className="mt-2 text-sm text-muted">{loading ? 'Loading live data...' : 'Hover any cell to view date and submissions.'}</p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Heatmap</h4>
                  <span className="text-xs text-muted">Interactive</span>
                </div>
                <HeatmapGrid weeks={weeks} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
