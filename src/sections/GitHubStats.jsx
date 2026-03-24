import React from 'react';

export default function GitHubStats() {
  const stats = [
    { label: 'Featured Projects', value: '5', icon: 'PRJ' },
    { label: 'Portfolio Builds', value: '10+', icon: 'WEB' },
    { label: 'Public Repos', value: '25+', icon: 'GIT' },
    { label: 'Tech Skills', value: '20+', icon: 'SKL' },
  ];

  const links = [
    {
      title: 'GitHub Profile',
      description: 'Check my complete project list and ongoing work.',
      href: 'https://github.com/SumanKarmakar467/',
      label: 'github.com/SumanKarmakar467',
    },
    {
      title: 'LinkedIn',
      description: 'Open for collaboration, opportunities, and professional networking.',
      href: 'https://www.linkedin.com/in/suman-karmakar-jerry/',
      label: 'linkedin.com/in/suman-karmakar-jerry',
    },
  ];

  return (
    <section id="github" className="section bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">GitHub & More Links</h2>
          <p className="section-subtitle">Quick overview and direct links from your previous portfolio</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-sm font-semibold text-primary/80 mb-3">{stat.icon}</div>
              <div className="text-2xl font-playfair font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-muted text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {links.map((item) => (
            <article key={item.title} className="card">
              <h3 className="text-lg font-space font-semibold text-primary mb-2">{item.title}</h3>
              <p className="text-muted text-sm mb-4">{item.description}</p>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {item.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
