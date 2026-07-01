import React, { useEffect, useMemo, useState } from 'react';
import SnakeStreak from '../components/SnakeStreak';

const GITHUB_USERNAME = 'SumanKarmakar467';

function groupWeeksFromContributions(contributions = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  const sorted = [...contributions]
    .filter((day) => day?.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const past = sorted.filter((day) => {
    const d = new Date(`${day.date}T00:00:00`);
    return d >= start && d <= today;
  });

  const cells = past.map((day) => {
    const d = new Date(`${day.date}T00:00:00`);
    return { date: day.date, count: day.count || 0, month: d.getMonth(), weekday: d.getDay() };
  });

  if (cells.length === 0) return [];

  const first = new Date(`${cells[0].date}T00:00:00`);
  const prepend = first.getDay();
  const padded = [
    ...Array.from({ length: prepend }, (_, i) => ({
      date: `pad-${i}`,
      count: 0,
      month: first.getMonth(),
      weekday: i,
      empty: true,
    })),
    ...cells,
  ];

  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

function getRollingYearTotal(contributions = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  return [...contributions]
    .filter((day) => day?.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((day) => {
      const d = new Date(`${day.date}T00:00:00`);
      return d >= start && d <= today;
    })
    .reduce((sum, day) => sum + (day.count || 0), 0);
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

function githubHeatColor(count) {
  if (count <= 0) return 'bg-[#2b2b2b]';
  if (count <= 2) return 'bg-[#1e4f2b]';
  if (count <= 6) return 'bg-[#1f7a36]';
  if (count <= 12) return 'bg-[#24a148]';
  return 'bg-[#4cd964]';
}

function GitHubHeatmap({ weeks, mode = 'contributions' }) {
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, placement: 'top' });
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
    weeks.forEach((week, idx) => {
      const first = week.find((d) => !d.empty);
      if (!first) return;
      if (idx === 0 || first.date.endsWith('-01')) markers.push({ idx, month: months[first.month] });
    });
    return markers;
  }, [weeks]);

  return (
    <div className="rounded-xl border border-border bg-background/35 p-3">
      <div className="relative mb-2 h-4">
        {monthMarkers.map((m) => (
          <span key={`${m.idx}-${m.month}`} className="absolute top-0 text-[10px] text-muted" style={{ left: `${m.idx * 14}px` }}>
            {m.month}
          </span>
        ))}
      </div>

      <div className="overflow-hidden">
        <div className="relative inline-flex max-w-full gap-[2px]">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {week.map((day, dayIdx) =>
                day.empty ? (
                  <div key={`e-${weekIdx}-${dayIdx}`} className="h-[11px] w-[11px]" />
                ) : (
                  <button
                    key={day.date}
                    type="button"
                    className={`h-[10px] w-[10px] rounded-[2px] ${githubHeatColor(day.count)} transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-primary/80`}
                    onMouseEnter={(event) => {
                      setHovered(day);
                      updateTooltipPosition(event);
                    }}
                    onMouseMove={updateTooltipPosition}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${day.count} contributions on ${day.date}`}
                  />
                ),
              )}
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

export default function GitHubStats() {
  const [profile, setProfile] = useState({ publicRepos: null, followers: null, following: null });
  const [totalContributions, setTotalContributions] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [reposList, setReposList] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [monthFilter, setMonthFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = () => {
      const options = { cache: 'no-store' };
      const profileRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, options).then((res) => res.json());
      const contributionsRequest = fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`, options).then((res) =>
        res.json(),
      );
      const followersRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}/followers?per_page=12`, options).then((res) =>
        res.json(),
      );
      const followingRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}/following?per_page=12`, options).then((res) =>
        res.json(),
      );
      const reposRequest = fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
        options,
      ).then((res) => res.json());

      Promise.allSettled([profileRequest, contributionsRequest, followersRequest, followingRequest, reposRequest])
        .then(([profileResult, contributionsResult, followersResult, followingResult, reposResult]) => {
          if (!isMounted) return;
          if (profileResult.status === 'fulfilled') {
            setProfile({
              publicRepos: profileResult.value?.public_repos ?? null,
              followers: profileResult.value?.followers ?? null,
              following: profileResult.value?.following ?? null,
            });
          }
        if (contributionsResult.status === 'fulfilled') {
          const daily = contributionsResult.value?.contributions || [];
          setContributions(daily);
          setTotalContributions(getRollingYearTotal(daily) || 0);
        }
          if (followersResult.status === 'fulfilled' && Array.isArray(followersResult.value)) {
            setFollowersList(followersResult.value);
          }
          if (followingResult.status === 'fulfilled' && Array.isArray(followingResult.value)) {
            setFollowingList(followingResult.value);
          }
          if (reposResult.status === 'fulfilled' && Array.isArray(reposResult.value)) {
            setReposList(reposResult.value);
          }
          setLastUpdated(new Date());
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    fetchAll();
    const intervalId = window.setInterval(fetchAll, 120000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const monthOptions = useMemo(() => ['all', ...getLast12Months()], []);

  const filteredContributions = useMemo(() => {
    if (monthFilter === 'all') return contributions;
    return contributions.filter((d) => {
      const key = new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      return key === monthFilter;
    });
  }, [contributions, monthFilter]);

  const weeks = useMemo(() => groupWeeksFromContributions(filteredContributions), [filteredContributions]);
  const graphStats = useMemo(() => {
    const cells = weeks.flat().filter((day) => !day.empty);
    const committed = cells.reduce((sum, day) => sum + day.count, 0);
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
    return { committed, activeDays, bestDay, maxStreak };
  }, [weeks]);
  const statItems = [
    { label: 'Last Year Contributions', value: totalContributions ?? '--' },
    {
      label: 'Public Repositories',
      value: profile.publicRepos ?? '--',
      key: 'repos',
      href: `https://github.com/${GITHUB_USERNAME}?tab=repositories`,
    },
    {
      label: 'Followers',
      value: profile.followers ?? '--',
      key: 'followers',
      href: `https://github.com/${GITHUB_USERNAME}?tab=followers`,
    },
    {
      label: 'Following',
      value: profile.following ?? '--',
      key: 'following',
      href: `https://github.com/${GITHUB_USERNAME}?tab=following`,
    },
  ];

  return (
    <section id="github" className="section bg-surface">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">GitHub Contributions</h2>
          <p className="section-subtitle">Interactive contribution heatmap with daily hover details.</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
              <a
                key={item.label}
                href={item.href || `https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 text-center shadow-sm transition hover:border-primary/60 hover:shadow-lg ${item.key ? 'cursor-pointer' : ''}`}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-playfair font-bold text-primary">{item.value}</p>
                {item.key && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-64 -translate-x-1/2 rounded-xl border border-border bg-background/95 p-3 text-left shadow-xl group-hover:block">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {item.key === 'followers'
                        ? 'Followers Preview'
                        : item.key === 'following'
                          ? 'Following Preview'
                          : 'Projects Preview'}
                    </p>
                    <div className="space-y-1.5">
                      {(item.key === 'repos'
                        ? reposList.map((repo) => ({
                            id: repo.id,
                            avatar_url: repo.owner?.avatar_url,
                            login: repo.name,
                            meta: repo.stargazers_count,
                          }))
                        : (item.key === 'followers' ? followersList : followingList).map((user) => ({
                            id: user.id,
                            avatar_url: user.avatar_url,
                            login: user.login,
                            meta: null,
                          }))
                      )
                        .slice(0, 6)
                        .map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between gap-2 text-xs text-text">
                            <div className="flex min-w-0 items-center gap-2">
                              <img src={entry.avatar_url} alt={entry.login} className="h-5 w-5 rounded-full border border-border" />
                              <span className="truncate">{entry.login}</span>
                            </div>
                            {entry.meta !== null && <span className="text-[10px] text-muted">* {entry.meta}</span>}
                          </div>
                        ))}
                      {(item.key === 'repos' ? reposList : item.key === 'followers' ? followersList : followingList).length === 0 && (
                        <p className="text-xs text-muted">No preview available right now.</p>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] text-primary">Click card to open all on GitHub</p>
                  </div>
                )}
              </a>
            ))}
          </div>

          <article className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-space font-semibold text-primary">Contribution Graph</h3>
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
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {loading ? 'Loading live data...' : 'Interactive'}
                </span>
              </div>
            </div>
            <GitHubHeatmap weeks={weeks} mode="commits" />
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>Less</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span key={lvl} className={`h-2.5 w-2.5 rounded-sm ${githubHeatColor(lvl === 0 ? 0 : lvl * 4)}`} />
                ))}
              </div>
              <span>More</span>
            </div>
            <div className="mt-4 grid gap-3 text-center sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Committed</p>
                <p className="mt-1 text-lg font-semibold text-text">{graphStats.committed}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Active Days</p>
                <p className="mt-1 text-lg font-semibold text-text">{graphStats.activeDays}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Best Day</p>
                <p className="mt-1 text-lg font-semibold text-text">{graphStats.bestDay}</p>
              </div>
            </div>
            <div className="mt-4">
              <SnakeStreak streak={graphStats.maxStreak} label="Max Streak" />
            </div>
            <p className="mt-3 text-right text-[11px] text-muted">
              {lastUpdated ? `Auto-updated: ${lastUpdated.toLocaleTimeString()}` : ''}
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-primary/5 p-5 text-center">
            <h3 className="text-base font-space font-semibold text-text">GitHub Profile</h3>
            <p className="mt-2 text-sm text-muted">Explore repositories, commit history, and latest project activity directly on GitHub.</p>
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-4">
              View Full GitHub Profile
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

