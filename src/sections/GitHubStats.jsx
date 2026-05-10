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
                    className={`h-[11px] w-[11px] rounded-[3px] ${githubHeatColor(day.count)} transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-primary/80`}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const profileRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`).then((res) => res.json());
    const contributionsRequest = fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`).then((res) =>
      res.json(),
    );

    Promise.allSettled([profileRequest, contributionsRequest])
      .then(([profileResult, contributionsResult]) => {
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
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const weeks = useMemo(() => groupWeeksFromContributions(contributions), [contributions]);
  const statItems = [
    { label: 'Last Year Contributions', value: totalContributions ?? '--' },
    { label: 'Public Repositories', value: profile.publicRepos ?? '--' },
    { label: 'Followers', value: profile.followers ?? '--' },
    { label: 'Following', value: profile.following ?? '--' },
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
              <div key={item.label} className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 text-center shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-playfair font-bold text-primary">{item.value}</p>
              </div>
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
