import React, { useEffect, useMemo, useState } from 'react';

const GITHUB_USERNAME = 'SumanKarmakar467';

function groupWeeksFromContributions(contributions = []) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const past = contributions.filter((day) => day.date <= todayIso).slice(-364);
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

function githubHeatColor(count) {
  if (count <= 0) return 'bg-[#211a1d]';
  if (count <= 2) return 'bg-[#5a252b]';
  if (count <= 6) return 'bg-[#8a2f3b]';
  if (count <= 12) return 'bg-[#c73f58]';
  return 'bg-[#ff5f7d]';
}

function GitHubHeatmap({ weeks }) {
  const [hovered, setHovered] = useState(null);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

      <div className="overflow-x-auto">
        <div className="relative inline-flex gap-[3px]">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {week.map((day, dayIdx) =>
                day.empty ? (
                  <div key={`e-${weekIdx}-${dayIdx}`} className="h-[11px] w-[11px]" />
                ) : (
                  <button
                    key={day.date}
                    type="button"
                    className={`h-[12px] w-[12px] rounded-[3px] ${githubHeatColor(day.count)} transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-primary/80`}
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${day.count} contributions on ${day.date}`}
                  />
                ),
              )}
            </div>
          ))}
          {hovered && (
            <div className="pointer-events-none absolute -top-12 left-0 z-20 rounded-lg border border-border bg-background/95 px-2.5 py-1.5 text-xs text-text shadow-lg">
              {hovered.count} contributions on {hovered.date}
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
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const profileRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`).then((res) => res.json());
    const contributionsRequest = fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`).then((res) =>
      res.json(),
    );
    const followersRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}/followers?per_page=12`).then((res) =>
      res.json(),
    );
    const followingRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}/following?per_page=12`).then((res) =>
      res.json(),
    );

    Promise.allSettled([profileRequest, contributionsRequest, followersRequest, followingRequest])
      .then(([profileResult, contributionsResult, followersResult, followingResult]) => {
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
          const thisYear = new Date().getFullYear();
          const prevYear = thisYear - 1;
          const total = (contributionsResult.value?.total?.[thisYear] || 0) + (contributionsResult.value?.total?.[prevYear] || 0);
          setContributions(daily);
          setTotalContributions(total || null);
        }
        if (followersResult.status === 'fulfilled' && Array.isArray(followersResult.value)) {
          setFollowersList(followersResult.value);
        }
        if (followingResult.status === 'fulfilled' && Array.isArray(followingResult.value)) {
          setFollowingList(followingResult.value);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const weeks = useMemo(() => groupWeeksFromContributions(contributions), [contributions]);
  const graphStats = useMemo(() => {
    const cells = weeks.flat().filter((day) => !day.empty);
    const committed = cells.reduce((sum, day) => sum + day.count, 0);
    const activeDays = cells.filter((day) => day.count > 0).length;
    const bestDay = cells.reduce((max, day) => Math.max(max, day.count), 0);
    return { committed, activeDays, bestDay };
  }, [weeks]);
  const statItems = [
    { label: 'Last Year Contributions', value: totalContributions ?? '--' },
    { label: 'Public Repositories', value: profile.publicRepos ?? '--' },
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
                      {item.key === 'followers' ? 'Followers Preview' : 'Following Preview'}
                    </p>
                    <div className="space-y-1.5">
                      {(item.key === 'followers' ? followersList : followingList).slice(0, 6).map((user) => (
                        <div key={user.id} className="flex items-center gap-2 text-xs text-text">
                          <img src={user.avatar_url} alt={user.login} className="h-5 w-5 rounded-full border border-border" />
                          <span className="truncate">{user.login}</span>
                        </div>
                      ))}
                      {(item.key === 'followers' ? followersList : followingList).length === 0 && (
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
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {loading ? 'Loading live data...' : 'Interactive'}
              </span>
            </div>
            <GitHubHeatmap weeks={weeks} />
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
