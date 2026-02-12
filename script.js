const toggleBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const themeToggle = document.querySelector('.theme-toggle');
const navbar = document.querySelector('.navbar');
const progressBar = document.querySelector('.scroll-progress');
const backTop = document.querySelector('.back-top');
const heroGallery = document.querySelector('.hero-gallery');
const tiltCards = document.querySelectorAll('[data-tilt]');
const revealElements = document.querySelectorAll('.reveal');
const ambients = document.querySelectorAll('.ambient');

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('theme-dark', isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
};

if (themeToggle) {
  let initialTheme = 'light';
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      initialTheme = savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }
  } catch (error) {
    initialTheme = 'light';
  }

  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // Ignore storage failures and keep toggle working.
    }
  });
}

const heroHeading = document.querySelector('.hero-content h1');

if (heroHeading) {
  const sourceText = heroHeading.textContent.trim();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const keywords = {
    full: '#ff8a3d',
    stack: '#12c2a4',
    developer: '#0b8f7d',
    java: '#fb7185',
    react: '#38bdf8',
    'node.js': '#22c55e',
    mongodb: '#f59e0b'
  };
  const tokens = sourceText.split(/(\s+|\|)/);
  const focusableIndexes = [];

  const renderHeading = (activeFocus = -1) => {
    heroHeading.innerHTML = tokens
      .map((token, index) => {
        if (!token || token === '|' || /^\s+$/.test(token)) return token;
        const normalized = token.toLowerCase().replace(/^[^\w]+|[^\w.]+$/g, '');
        const color = keywords[normalized];
        if (!color) return token;
        const focusIndex = focusableIndexes.indexOf(index);
        const activeClass = focusIndex === activeFocus ? ' is-active' : '';
        return `<span class="hero-keyword${activeClass}" style="color:${color}">${token}</span>`;
      })
      .join('');
  };

  tokens.forEach((token, index) => {
    const normalized = token.toLowerCase().replace(/^[^\w]+|[^\w.]+$/g, '');
    if (keywords[normalized]) focusableIndexes.push(index);
  });

  renderHeading(0);

  if (!prefersReducedMotion && focusableIndexes.length > 1) {
    let currentFocus = 0;
    setInterval(() => {
      currentFocus = (currentFocus + 1) % focusableIndexes.length;
      renderHeading(currentFocus);
    }, 3000);
  }
}

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

links.forEach((link) => {
  link.addEventListener('click', () => {
    if (navLinks) {
      navLinks.classList.remove('open');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

const updateScrollUi = () => {
  const scrollY = window.scrollY;
  let currentId = '';

  sections.forEach((section) => {
    const top = section.offsetTop - 130;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      currentId = section.getAttribute('id');
    }
  });

  links.forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === currentId);
  });

  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 14);
  }

  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  if (backTop) {
    backTop.classList.toggle('show', scrollY > 500);
  }
};

window.addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  observer.observe(el);
});

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 9;
    const rotateY = (x - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
});

window.addEventListener(
  'pointermove',
  (event) => {
    if (window.innerWidth < 860) return;
    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;

    ambients.forEach((blob, index) => {
      const strength = index === 0 ? 22 : 16;
      blob.style.transform = `translate(${xRatio * strength}px, ${yRatio * strength}px)`;
    });

    if (heroGallery) {
      heroGallery.style.transform = `translate(${xRatio * 10}px, ${yRatio * 8}px)`;
    }
  },
  { passive: true }
);

let audioContext;

const playClickSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(980, now);
    oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.045);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.052);
  } catch (error) {
    // Audio is optional; ignore unsupported environments.
  }
};

const spawnRipple = (button, event) => {
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-wave';
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
};

document.addEventListener('pointerdown', (event) => {
  const target = event.target.closest('a, button');
  if (!target) return;
  playClickSound();
  const button = target.closest('.btn');
  if (button) {
    spawnRipple(button, event);
  }
});

const form = document.querySelector('.contact-form');
const formMsg = document.querySelector('.form-msg');

if (form && formMsg) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMsg.textContent = 'Thanks! This demo form is working and ready to connect to a backend.';
    form.reset();
  });
}

// Education result toggle functionality
const eduResultButtons = document.querySelectorAll('.edu-result-btn');

if (eduResultButtons.length) {
  const setEduPanelState = (button, panel, isOpen) => {
    button.setAttribute('aria-expanded', String(isOpen));
    button.textContent = isOpen
      ? button.dataset.openLabel || 'Hide Result'
      : button.dataset.closeLabel || 'Show Result';
    panel.hidden = !isOpen;
  };

  eduResultButtons.forEach((button) => {
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    setEduPanelState(button, panel, false);

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      eduResultButtons.forEach((otherButton) => {
        const otherPanelId = otherButton.getAttribute('aria-controls');
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
        if (!otherPanel || otherButton === button) return;
        setEduPanelState(otherButton, otherPanel, false);
      });

      setEduPanelState(button, panel, !isOpen);
    });
  });
}
