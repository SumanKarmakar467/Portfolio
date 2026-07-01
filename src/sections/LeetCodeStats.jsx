import React, { useEffect, useMemo, useState } from 'react';
import GameSnake from '../components/GameSnake';

const LEETCODE_USERNAME = 'suman2k04';
const LEETCODE_API_URLS = [
  `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`,
  `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`,
];

function StatCard({ label, value, tone }) {
  const toneClass =
    tone === 'easy' ? 'text-emerald-500' : tone === 'medium' ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-5 text-center shadow-sm min-h-[118px] flex flex-col items-center justify-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted leading-5">{label}</p>
      <p className={`mt-2 text-4xl font-playfair font-bold leading-none tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

function buildWeeklyHeatmapFromUnixMap(unixMap = {}) {
  const dateCountMap = new Map();
  Object.entries(unixMap).forEach(([unix, count]) => {
    const isoDate = new Date(Number(unix) * 1000).toISOString().slice(0, 10);
    dateCountMap.set(isoDate, Number(count || 0));
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const cells = [];
  for (let d = new Date(gridStart); d <= today; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    cells.push({
      date: iso,
      count: Number(dateCountMap.get(iso) || 0),
      weekday: d.getDay(),
      month: d.getMonth(),
    });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function formatDateLabel(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
  }
  return months;
}

function heatColor(count) {
  if (count <= 0) return 'bg-[#2b2b2b]';
  if (count <= 2) return 'bg-[#1e4f2b]';
  if (count <= 5) return 'bg-[#1f7a36]';
  if (count <= 9) return 'bg-[#24a148]';
  return 'bg-[#4cd964]';
}

function HeatmapGrid({ weeks, mode = 'submissions' }) {
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, placement: 'top' });
  const [bitten, setBitten] = useState(null);
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const updateTooltipPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const showBelow = rect.top < 64 && window.innerHeight - rect.bottom > 72;

    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: showBelow ? rect.bottom + 10 : rect.top - 10,
      placement: showBelow ? 'bottom' : 'top',
    });
  };

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

      <div className="overflow-hidden">
        <div className="relative inline-flex max-w-full gap-[2px]">
          <GameSnake
            columns={weeks.length}
            rows={7}
            onVisit={(col, row) => setBitten(`${col}-${row}`)}
          />
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => (
                <button
                  key={day.date}
                  type="button"
                  className={`h-[10px] w-[10px] rounded-[2px] ${heatColor(day.count)} transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-primary/80 ${
                    bitten === `${weekIndex}-${dayIndex}` ? 'snake-bite' : ''
                  }`}
                  onMouseEnter={(event) => {
                    setHovered(day);
                    updateTooltipPosition(event);
                  }}
                  onMouseMove={updateTooltipPosition}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${day.count} submissions on ${day.date}`}
                />
              ))}
            </div>
          ))}

          {hovered && (
            <div
              className={`pointer-events-none fixed z-[999] w-max max-w-[210px] -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#7ee787]/45 bg-[#120a12]/95 px-3 py-1.5 text-xs text-white shadow-lg ${
                tooltipPos.placement === 'top' ? '-translate-y-full' : 'translate-y-0'
              }`}
              style={{
                left: `clamp(105px, ${tooltipPos.x}px, calc(100vw - 105px))`,
                top: tooltipPos.y,
              }}
            >
              <span className="font-semibold text-[#7ee787]">{hovered.count}</span>{' '}
              <span>{mode}</span>{' '}
              <span className="text-[#f6c9d4]">on {formatDateLabel(hovered.date)}</span>
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
  const [monthFilter, setMonthFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const CACHE_KEY = 'leetcodeStatsCache';
    const CACHE_TTL_MS = 5 * 60 * 1000;

    const readCache = () => {
      try {
        const raw = window.sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.savedAt || Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
        return parsed;
      } catch {
        return null;
      }
    };

    const writeCache = (data) => {
      try {
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
      } catch {
        /* storage unavailable */
      }
    };

    const cached = readCache();
    if (cached) {
      setStats(cached.stats);
      setCalendar(cached.calendar);
      setLastUpdated(new Date(cached.savedAt));
      setLoading(false);
    }

    const fetchStats = async () => {
      for (const url of LEETCODE_API_URLS) {
        try {
          const response = await fetch(url, { cache: 'no-store' });
          const data = await response.json();
          const easy = data.easySolved ?? null;
          const medium = data.mediumSolved ?? null;
          const hard = data.hardSolved ?? null;
          const total = data.totalSolved ?? data.solvedProblem ?? null;

          if (easy !== null || medium !== null || hard !== null || total !== null) {
            if (!isMounted) return;
            const nextStats = { easySolved: easy, mediumSolved: medium, hardSolved: hard, totalSolved: total };
            const nextCalendar = data.submissionCalendar || calendar;
            setStats(nextStats);
            if (data.submissionCalendar) setCalendar(nextCalendar);
            setLastUpdated(new Date());
            writeCache({ stats: nextStats, calendar: nextCalendar });
            return;
          }
        } catch (_) {}
      }
    };

    fetchStats().finally(() => {
      if (isMounted) setLoading(false);
    });
    const intervalId = window.setInterval(fetchStats, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const allWeeks = useMemo(() => buildWeeklyHeatmapFromUnixMap(calendar), [calendar]);
  const monthOptions = useMemo(() => ['all', ...getLast12Months()], []);

  const weeks = useMemo(() => {
    if (monthFilter === 'all') return allWeeks;
    const filteredDays = allWeeks
      .flat()
      .filter(
        (d) =>
          new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) === monthFilter,
      );
    const regrouped = [];
    for (let i = 0; i < filteredDays.length; i += 7) regrouped.push(filteredDays.slice(i, i + 7));
    return regrouped;
  }, [allWeeks, monthFilter]);

  const graphStats = useMemo(() => {
    const cells = weeks.flat().sort((a, b) => new Date(a.date) - new Date(b.date));
    const solved = cells.reduce((sum, day) => sum + day.count, 0);
    const activeDays = cells.filter((day) => day.count > 0).length;
    const bestDay = cells.reduce((max, day) => Math.max(max, day.count), 0);
    let streak = 0;
    let maxStreak = 0;
    cells.forEach((day) => {
      if (day.count > 0) {
        streak += 1;
        if (streak > maxStreak) maxStreak = streak;
      } else {
        streak = 0;
      }
    });
    return { solved, activeDays, bestDay, maxStreak };
  }, [weeks]);
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
                  <div className="flex items-center gap-2">
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className="appearance-none rounded-xl border border-primary/70 bg-[#120a12] px-3 py-1.5 text-xs font-semibold text-primary shadow-[0_0_0_1px_rgba(255,77,109,0.18)] outline-none transition hover:bg-primary/20 hover:border-primary"
                      style={{ colorScheme: 'dark' }}
                    >
                      {monthOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === 'all' ? 'All Months' : option}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-muted">Interactive</span>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span>
                    <span className="font-semibold text-text">{graphStats.solved}</span> submissions in the past one year
                  </span>
                  <span>Max streak: {graphStats.maxStreak}</span>
                </div>
                <HeatmapGrid weeks={weeks} mode="submissions" />
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>Less</span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((lvl) => (
                      <span key={lvl} className={`h-2.5 w-2.5 rounded-sm ${heatColor(lvl === 0 ? 0 : lvl * 3)}`} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
                <div className="mt-4 grid gap-3 text-center sm:grid-cols-4">
                  <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Submissions</p>
                    <p className="mt-1 text-lg font-semibold text-text">{graphStats.solved}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Active Days</p>
                    <p className="mt-1 text-lg font-semibold text-text">{graphStats.activeDays}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Best Day</p>
                    <p className="mt-1 text-lg font-semibold text-text">{graphStats.bestDay}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Max Streak</p>
                    <p className="mt-1 text-lg font-semibold text-text">{graphStats.maxStreak}</p>
                  </div>
                </div>
                <p className="mt-3 text-right text-[11px] text-muted">
                  {lastUpdated ? `Auto-updated: ${lastUpdated.toLocaleTimeString()}` : ''}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
