import React, { useEffect, useMemo, useState } from 'react';

const GITHUB_USERNAME = 'SumanKarmakar467';

export default function GitHubStats() {
  const [profile, setProfile] = useState({
    publicRepos: null,
    followers: null,
    following: null,
  });
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const profileRequest = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`).then((res) => res.json());
    const contributionsRequest = fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`,
    ).then((res) => res.json());

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
          const total = contributionsResult.value?.total?.[0]?.contributions ?? null;
          setContributions(total);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const statItems = useMemo(
    () => [
      { label: 'Last Year Contributions', value: contributions ?? '--' },
      { label: 'Public Repositories', value: profile.publicRepos ?? '--' },
      { label: 'Followers', value: profile.followers ?? '--' },
      { label: 'Following', value: profile.following ?? '--' },
    ],
    [contributions, profile.followers, profile.following, profile.publicRepos],
  );

  return (
    <section id="github" className="section bg-surface">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title">GitHub Contributions</h2>
          <p className="section-subtitle">
            Real commit activity and repository insights from my public GitHub profile.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 text-center shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-playfair font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>

          <article className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-space font-semibold text-primary">
                Contribution Graph
              </h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {loading ? 'Loading live data...' : 'Live profile data'}
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border bg-background/40 p-3">
              <img
                src={`https://ghchart.rshah.org/ff4d6d/${GITHUB_USERNAME}`}
                alt={`${GITHUB_USERNAME} GitHub contribution graph`}
                className="min-w-[720px] w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-space font-semibold text-primary mb-4">
                Profile Stats
              </h3>
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=tokyonight&hide_border=true`}
                alt={`${GITHUB_USERNAME} GitHub profile stats`}
                className="w-full"
                loading="lazy"
                decoding="async"
              />
            </article>

            <article className="rounded-2xl border border-border bg-gradient-to-br from-surface to-background/70 p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-space font-semibold text-primary mb-4">
                Top Languages
              </h3>
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=tokyonight&hide_border=true`}
                alt={`${GITHUB_USERNAME} top languages`}
                className="w-full"
                loading="lazy"
                decoding="async"
              />
            </article>
          </div>

          <article className="rounded-2xl border border-border bg-primary/5 p-5 text-center">
            <h3 className="text-base font-space font-semibold text-text">GitHub Profile</h3>
            <p className="mt-2 text-sm text-muted">
              Explore repositories, commit history, and latest project activity directly on GitHub.
            </p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-4"
            >
              View Full GitHub Profile
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
