// script.js - Modernized with Preloader and Mobile Menu

// 1. Theme Toggle Logic (Kept and slightly cleaned up)
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;

if (themeBtn) {
  function applyTheme(isDark) {
    if (isDark) {
      body.classList.add("dark");
      themeBtn.textContent = "☀️";
      themeBtn.setAttribute("aria-label", "Switch to light theme");
    } else {
      body.classList.remove("dark");
      themeBtn.textContent = "🌙";
      themeBtn.setAttribute("aria-label", "Switch to dark theme");
    }
  }

  // Load saved theme or apply system preference
  const saved = localStorage.getItem("theme");
  if (saved) {
    applyTheme(saved === "dark");
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark);
  }

  // Toggle on click
  themeBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Respond to system changes (if no saved preference)
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", e => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches);
    }
  });
}

// 2. Mobile Menu Logic (New)
const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link"); // Get all navigation links

if (menuBtn && navbar) {
  // Toggle menu when button is clicked
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navbar.classList.toggle("active");
    // Prevent scrolling when mobile menu is open
    body.style.overflow = navbar.classList.contains("active") ? "hidden" : "auto";
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      navbar.classList.remove("active");
      body.style.overflow = "auto"; // Restore scrolling
    });
  });
}


// 3. Preloader Logic (New)
const preloader = document.getElementById("preloader");

if (preloader) {
    // Duration for the "Hi" message (4000ms = 4 seconds)
    const PRELOADER_DURATION = 4000; 

    // Use a slight delay before starting to ensure the body class is applied
    setTimeout(() => {
        // Fade out the preloader
        preloader.classList.add("hidden");
        
        // Remove 'loading' class from body to re-enable scrolling
        preloader.addEventListener('transitionend', () => {
            body.classList.remove("loading");
            // Optional: Remove the preloader element from the DOM entirely
            preloader.remove(); 
        }, { once: true }); // Ensure the listener only runs once
        
    }, PRELOADER_DURATION);
}
