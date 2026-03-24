import React from 'react';
import CountUp from 'react-countup';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

export default function About({ theme }) {
  const { ref, hasIntersected } = useIntersectionObserver();
  const profileImage = theme === 'dark' ? '/profile/dark-theme.jpg' : '/profile/light-theme.jpg';

  const stats = [
    { label: 'Projects Built', value: 15, suffix: '+' },
    { label: 'Tech Skills', value: 20, suffix: '+' },
    { label: 'Years Learning', value: 4, suffix: '+' },
    { label: 'Certificates', value: 4, suffix: '' },
  ];

  return (
    <section id="about" className="section bg-surface" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            Passionate full stack developer focused on modern frontend and robust backend engineering
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="w-full max-w-md mx-auto">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl rotate-6 animate-float" />
                <div className="absolute inset-4 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                  <img
                    src={profileImage}
                    alt={theme === 'dark' ? 'Suman portrait for dark theme' : 'Suman portrait for light theme'}
                    className="h-full w-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-space font-semibold mb-4 text-primary">
                Passionate MERN Stack Developer
              </h3>
              <p className="text-muted leading-relaxed mb-4">
                I specialize in creating modern, responsive, and user-friendly web applications. With
                hands-on experience in Java ecosystem, React for dynamic frontends, and Node.js plus
                MongoDB for scalable backends, I enjoy turning complex ideas into practical solutions.
              </p>
              <p className="text-muted leading-relaxed">
                My goal is to keep learning new technologies and apply best practices to build
                high-quality software with clean architecture and strong user experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm">Problem Solving</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-sm">Team Collaboration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm">Clean Code</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-sm">Continuous Learning</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">
                {hasIntersected && (
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix} delay={index * 0.2} />
                )}
              </div>
              <div className="text-muted text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
