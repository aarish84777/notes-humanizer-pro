// landing.js
// Attach at bottom of index.html: <script src="/landing.js"></script>

// ============= THEME HANDLING =============
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");

  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

// ============= PARTICLES =============
(function initParticles() {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = Math.random() * 100 + "vh";
    p.style.animationDelay = Math.random() * 6 + "s";
    document.body.appendChild(p);
  }
})();

// ============= PARALLAX BG =============
(function initParallax() {
  const bg = document.querySelector(".parallax-bg");
  if (!bg) return;

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    bg.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

// ============= REVEAL ON SCROLL =============
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ============= SMOOTH SCROLL CTAs =============
(function initCTAs() {
  document.querySelectorAll(".js-try-free").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scroll-target") || "#tool-card";
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

// ============= FAQ ACCORDION =============
(function initFAQ() {
  const items = Array.from(document.querySelectorAll(".faq-item"));
  const questions = items.map((item) => item.querySelector(".faq-question"));

  if (!items.length) return;

  function closeAll(except) {
    items.forEach((item) => {
      if (item === except) return;
      const btn = item.querySelector(".faq-question");
      const ans = item.querySelector(".faq-answer");
      if (!btn || !ans) return;
      btn.setAttribute("aria-expanded", "false");
      ans.hidden = true;
    });
  }

  questions.forEach((btn, index) => {
    const item = items[index];
    const answer = item.querySelector(".faq-answer");
    if (!answer) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) {
        btn.setAttribute("aria-expanded", "false");
        answer.hidden = true;
      } else {
        closeAll(item);
        btn.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });

    btn.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        btn.click();
      } else if (key === "ArrowDown") {
        e.preventDefault();
        const next = questions[index + 1] || questions[0];
        next.focus();
      } else if (key === "ArrowUp") {
        e.preventDefault();
        const prev = questions[index - 1] || questions[questions.length - 1];
        prev.focus();
      }
    });
  });
})();

// ============= SIGN IN / CLERK HANDLING =============
(function initSignIn() {
  const overlay = document.getElementById("sign-in");
  const signInBox = document.getElementById("clerk-sign-in");
  const coreBtn = document.getElementById("openSignIn");

  if (!overlay || !signInBox || !coreBtn) return;

  function openOverlay() {
    overlay.classList.add("show");
    overlay.style.display = "block";

    if (window.Clerk && !signInBox.hasChildNodes()) {
      window.Clerk.mountSignIn(signInBox, {
        appearance: { baseTheme: "light" }
      });
    }
  }

  function closeOverlay() {
    overlay.classList.remove("show");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);
  }

  // Core trigger
  coreBtn.addEventListener("click", openOverlay);

  // Overlay outside click
  overlay.addEventListener("click", (e) => {
    if (!signInBox.contains(e.target)) {
      closeOverlay();
    }
  });

  // Any visible "Sign In" button -> click core button
  function triggerSignIn() {
    if (coreBtn) {
      coreBtn.click();
    } else {
      // fallback: scroll to tool-card
      const tool = document.getElementById("tool-card");
      if (tool) tool.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  document.querySelectorAll(".js-signin-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerSignIn();
    });
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("show")) {
      closeOverlay();
    }
  });

  // Load Clerk & update state (optional; keeps behaviour closest to your old setup)
  window.addEventListener("load", async () => {
    if (!window.Clerk) return;
    try {
      await window.Clerk.load();
    } catch (err) {
      console.error("Clerk load error:", err);
    }
  });
})();
