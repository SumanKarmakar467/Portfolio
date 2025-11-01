// script.js — corrected theme toggle

// IDs/classes must match the HTML. Button id in HTML: "theme-toggle"
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;

// If button not found, bail out (prevents errors)
if (!themeBtn) {
  console.warn("Theme toggle button not found (expected id='theme-toggle').");
} else {
  // Helper to apply theme state (adds/removes .dark and sets icon/label)
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

  // 1) Load saved theme from localStorage
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    applyTheme(saved === "dark");
  } else {
    // 2) No saved preference — respect system preference (if available)
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark); // will set default based on system
  }

  // 3) Toggle on click
  themeBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // 4) (Optional) respond to system changes: update only if user hasn't saved a preference
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", e => {
      // only apply system change when user hasn't explicitly saved theme
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches);
      }
    });
  }
}
