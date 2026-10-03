/* ============================================
   Ishant Sahu — Portfolio
   Theme toggle, scroll reveal, typing effect,
   hero particles, live GitHub stats
   ============================================ */

(function () {
  "use strict";

  const GITHUB_USER = "ishantsahu118-a11y";
  const STATS_CACHE_KEY = "gh-stats-" + GITHUB_USER;
  const STATS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes
  const STORAGE_KEY = "portfolio-theme";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. Theme: read stored preference, else follow OS setting
     --------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  function preferredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch (e) {
      /* storage blocked, fall through to OS preference */
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", "Switch to " + next + " theme");
    }
  }

  applyTheme(preferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ---------------------------------------------------------
     2. Footer year
     --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     3. Mobile navigation
     --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navbar = document.getElementById("navbar");

  function closeNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 10 : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      closeNav();
      history.replaceState(null, "", id);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeNav();
  });

  /* ---------------------------------------------------------
     4. Scroll effects: navbar shadow, active link, to-top
     --------------------------------------------------------- */
  const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute("href")); })
    .filter(Boolean);
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.pageYOffset;

    if (navbar) navbar.classList.toggle("is-scrolled", y > 12);
    if (toTop) toTop.classList.toggle("is-visible", y > 500);

    let current = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) {
        current = section;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + (current && current.id));
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     5. Scroll reveal with stagger
     --------------------------------------------------------- */
  const revealTargets = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  const groups = new Map();

  revealTargets.forEach(function (el) {
    const parent = el.parentElement;
    const list = groups.get(parent) || [];
    list.push(el);
    groups.set(parent, list);
  });

  groups.forEach(function (list) {
    list.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", Math.min(i * 70, 350) + "ms");
    });
  });

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     6. Typing effect in the hero
     --------------------------------------------------------- */
  const typedEl = document.getElementById("typed");
  const roles = [
    "Software Developer",
    "Web Developer",
    "C++ & Systems Enthusiast",
    "Problem Solver"
  ];

  function typeLoop() {
    if (!typedEl) return;
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function tick() {
      const current = roles[roleIndex];

      if (deleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }
      typedEl.textContent = current.slice(0, charIndex);

      let delay = deleting ? 45 : 90;
      if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 1900;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 320;
      }
      window.setTimeout(tick, delay);
    }
    tick();
  }

  if (typedEl && !reduceMotion) {
    typedEl.textContent = "";
    window.setTimeout(typeLoop, 900);
  } else if (typedEl) {
    typedEl.textContent = roles[0];
  }

  /* ---------------------------------------------------------
     7. Hero particles (paused when hero is off screen)
     --------------------------------------------------------- */
  const canvas = document.getElementById("heroCanvas");

  function initParticles() {
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = canvas.parentElement;
    let particles = [];
    let width = 0;
    let height = 0;
    let rafId = null;
    let running = false;

    function cssVar(name) {
      return getComputedStyle(root).getPropertyValue(name).trim() || "#f0a93c";
    }

    function resize() {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(24, Math.min(70, Math.round(width / 22)));
      particles = [];
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.7 + 0.5,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          a: Math.random() * 0.5 + 0.2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = cssVar("--particle");

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 15000) {
            ctx.globalAlpha = (1 - distSq / 15000) * 0.16;
            ctx.strokeStyle = cssVar("--particle");
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = window.requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      if (rafId) window.cancelAnimationFrame(rafId);
    }

    resize();
    start();

    let resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 180);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      }).observe(hero);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (hero.getBoundingClientRect().bottom > 0) start();
    });
  }

  initParticles();

  /* ---------------------------------------------------------
     8. Animated counters
     --------------------------------------------------------- */
  function animateCount(el) {
    const target = Number(el.getAttribute("data-count-to")) || 0;
    const duration = 1100;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     9. GitHub stats (cached, with graceful fallback)
     --------------------------------------------------------- */
  // Static hero counters animate immediately; GitHub ones wait for the API.
  document.querySelectorAll("[data-count-to]:not([data-gh])").forEach(function (node) {
    node.textContent = "0";
    if (!reduceMotion) animateCount(node);
  });

  const repoList = document.getElementById("repoList");
  const statNodes = document.querySelectorAll("[data-gh]");

  const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    "Jupyter Notebook": "#da5b0b",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SCSS: "#c6538c",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Go: "#00add8",
    Rust: "#dea584",
    PHP: "#4f5d95",
    Shell: "#89e051",
    Ruby: "#701516",
    Kotlin: "#a97bff",
    Swift: "#f05138",
    Dart: "#00b4ab",
    Vue: "#41b883",
    "Jupyter": "#da5b0b"
  };

  function setStat(name, value) {
    statNodes.forEach(function (node) {
      if (node.getAttribute("data-gh") !== name) return;
      node.setAttribute("data-count-to", String(value));
      node.textContent = reduceMotion ? String(value) : "0";
      if (!reduceMotion) animateCount(node);
    });
  }

  function renderRepos(repos) {
    if (!repoList) return;
    if (!repos || !repos.length) {
      repoList.innerHTML = '<li class="repo-placeholder">No public repositories yet.</li>';
      return;
    }

    const list = repos.slice(0, 4);
    repoList.innerHTML = list
      .map(function (repo) {
        const color = LANG_COLORS[repo.language] || "#8b909c";
        const lang = repo.language
          ? '<span><span class="lang-dot" style="background:' + color + '"></span>' + repo.language + "</span>"
          : "<span>—</span>";
        return (
          '<li class="repo-item">' +
          '<a class="repo-name" href="' + repo.html_url + '" target="_blank" rel="noopener">' +
          repo.name +
          "</a>" +
          '<span class="repo-meta">' + lang +
          "<span>&#9733; " + repo.stargazers_count + "</span>" +
          '<span>updated ' + new Date(repo.pushded_at || repo.pushed_at).toLocaleDateString() + "</span>" +
          "</span>" +
          "</li>"
        );
      })
      .join("");

    Array.prototype.forEach.call(repoList.children, function (item, i) {
      item.style.opacity = "0";
      item.style.transform = "translateY(10px)";
      item.style.transition = "opacity .5s var(--ease), transform .5s var(--ease)";
      window.setTimeout(function () {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 120 + i * 90);
    });
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(STATS_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.time > STATS_CACHE_TTL) return null;
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ time: Date.now(), data: data }));
    } catch (e) {
      /* ignore */
    }
  }

  function applyStats(data) {
    setStat("repos", data.repos);
    setStat("followers", data.followers);
    setStat("following", data.following);
    renderRepos(data.reposList);
  }

  function loadStats() {
    const cached = readCache();
    if (cached) {
      applyStats(cached);
      return;
    }

    const api = "https://api.github.com/users/" + GITHUB_USER;
    const headers = { Accept: "application/vnd.github+json" };

    window
      .fetch(api, { headers: headers })
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub API responded " + res.status);
        return res.json();
      })
      .then(function (user) {
        const data = {
          repos: user.public_repos || 0,
          followers: user.followers || 0,
          following: user.following || 0,
          reposList: []
        };
        return window
          .fetch(api + "/repos?per_page=100&sort=pushed", { headers: headers })
          .then(function (res) {
            return res.ok ? res.json() : [];
          })
          .then(function (repos) {
            data.reposList = Array.isArray(repos) ? repos.filter(function (r) { return !r.fork; }) : [];
            return data;
          })
          .catch(function () {
            return data;
          });
      })
      .then(function (data) {
        writeCache(data);
        applyStats(data);
      })
      .catch(function () {
        setStat("repos", 0);
        setStat("followers", 0);
        setStat("following", 0);
        renderRepos(null);
      });
  }

  loadStats();

  /* ---------------------------------------------------------
     10. Project card spotlight follows the cursor
     --------------------------------------------------------- */
  document.querySelectorAll(".project-card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });
})();
