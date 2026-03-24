# Suman Karmakar - Portfolio

A modern, responsive portfolio website built with React 18, Vite, and Tailwind CSS. Showcasing MERN Stack development skills with beautiful animations and interactive elements.

## 🚀 Features

- **Modern Design**: Clean, professional design with dark/light theme support
- **Responsive**: Fully responsive across all devices and screen sizes
- **Animations**: Smooth Framer Motion animations and micro-interactions
- **Performance**: Optimized with lazy loading and code splitting
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **SEO Ready**: Meta tags and Open Graph support for social sharing

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, CSS Custom Properties
- **Animations**: Framer Motion
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Playfair Display, Space Grotesk, DM Sans, JetBrains Mono)

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "framer-motion": "^10.16.0",
  "react-intersection-observer": "^9.5.3",
  "react-type-animation": "^3.2.0",
  "react-countup": "^6.5.3",
  "react-hot-toast": "^2.4.1",
  "emailjs-com": "^3.2.0"
}
```

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/suman-karmakar/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Fixed navigation with theme toggle
│   ├── CustomCursor.jsx # Desktop cursor effects
│   ├── ScrollProgress.jsx # Top progress bar
│   ├── BackToTop.jsx    # Floating back-to-top button
│   └── ThemeToggle.jsx  # Dark/light theme switcher
├── sections/           # Main page sections
│   ├── Hero.jsx        # Landing section with animated name
│   ├── About.jsx       # Profile with stats and skills
│   ├── Projects.jsx    # Featured projects grid
│   ├── TechStack.jsx   # Technology skills showcase
│   ├── Education.jsx   # Education timeline
│   ├── GitHubStats.jsx # GitHub activity and stats
│   ├── Contact.jsx     # Contact form with EmailJS
│   └── Footer.jsx      # Site footer with social links
├── hooks/              # Custom React hooks
│   ├── useTheme.js     # Theme management
│   ├── useScrollProgress.js # Scroll tracking
│   └── useIntersectionObserver.js # Viewport detection
├── constants/          # Static data
│   ├── projects.js     # Project portfolio data
│   ├── techStack.js    # Technology stack data
│   └── education.js    # Education history data
└── styles/             # Global styles
    ├── globals.css     # CSS variables and base styles
    └── animations.css  # Keyframe animations
```

## 🎨 Customization

### Theme Colors
Update color variables in `src/index.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #06b6d4;
  --text: #1f2937;
  --muted: #6b7280;
  --surface: #ffffff;
  --background: #f9fafb;
  --border: #e5e7eb;
}
```

### Personal Information
Update personal details in the respective constant files:
- `src/constants/projects.js` - Your projects
- `src/constants/techStack.js` - Your tech stack
- `src/constants/education.js` - Your education

### Contact Form
Configure EmailJS in `src/sections/Contact.jsx`:
```javascript
emailjs.init('YOUR_SERVICE_ID');
```

### Visit Notifications
To get notified when someone visits your live portfolio:

1. Copy `.env.example` to `.env`
2. Set `VITE_VISIT_NOTIFY_ENDPOINT` to your webhook endpoint
3. Optionally set `VITE_VISIT_NOTIFY_TOKEN` for endpoint verification

Notification payload includes URL, time, referrer, timezone, language, and user-agent.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Custom domain support included

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy with one click

### Manual Deployment
```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Suman Karmakar**
- Website: [suman-karmakar.dev](https://suman-karmakar.dev)
- LinkedIn: [linkedin.com/in/suman-karmakar](https://linkedin.com/in/suman-karmakar)
- GitHub: [github.com/suman-karmakar](https://github.com/suman-karmakar)
- Email: suman.karmakar@example.com

---

Built with ❤️ using React and modern web technologies.
