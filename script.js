/* ================================================
   AMEN SOSSOUKPE — PORTFOLIO SCRIPT
   Particles • Animations • Nav • Skills • Security
   ================================================ */

"use strict";

/* ─── UTILITAIRES ────────────────────────────────── */
const isTouchDevice = () =>
  window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
  navigator.maxTouchPoints > 0;

/* ─── 1. PHOTO FALLBACK (sans inline onerror) ────── */
(function initPhotoFallback() {
  const img = document.getElementById("profilePhoto");
  const fallback = document.getElementById("photoFallback");
  if (!img || !fallback) return;

  // La photo se charge bien → cache le fallback
  if (img.complete && img.naturalWidth > 0) {
    fallback.style.display = "none";
    return;
  }
  img.addEventListener("load", () => {
    fallback.style.display = "none";
  });
  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "flex";
  });
})();

/* ─── 2. PARTICLE CANVAS ─────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  // Désactivé sur très petits écrans pour économiser la batterie
  if (window.innerWidth < 480) return;

  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
  const COLORS = [
    "rgba(168, 85, 247,",
    "rgba(124, 58, 237,",
    "rgba(79,  70, 229,",
    "rgba(99, 102, 241,",
    "rgba(255,255,255,",
    "rgba(196,181,253,",
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: rand(0.05, 0.45),
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * rand(0.001, 0.004),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.12, 0.12),
      glow: Math.random() > 0.6,
    };
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawParticle(p) {
    ctx.save();
    if (p.glow) {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, p.color + p.alpha + ")");
      g.addColorStop(1, p.color + "0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ")";
    ctx.fill();
    ctx.restore();
  }

  let rafId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaDir;

      if (p.alpha <= 0.02 || p.alpha >= 0.5) p.alphaDir *= -1;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      drawParticle(p);
    }
    rafId = requestAnimationFrame(animate);
  }

  resize();
  buildParticles();
  animate();

  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(rafId);
        resize();
        buildParticles();
        animate();
      }, 200);
    },
    { passive: true },
  );
})();

/* ─── 3. NAVBAR SCROLL EFFECT ────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-link");
  const toggle = document.getElementById("navToggle");
  const navList = document.getElementById("navLinks");
  const sections = document.querySelectorAll("section[id]");

  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
    highlightActiveLink();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Fermer le menu mobile en cliquant en dehors
  document.addEventListener("click", (e) => {
    if (
      navList.classList.contains("open") &&
      !navList.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      navList.classList.remove("open");
    }
  });

  // Toggle burger
  toggle &&
    toggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

  // Fermeture au clic d'un lien (mobile)
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  function highlightActiveLink() {
    const scrollY = window.scrollY + 120;
    let current = "";
    sections.forEach((sec) => {
      if (scrollY >= sec.offsetTop) current = sec.getAttribute("id");
    });
    links.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      );
    });
  }
})();

/* ─── 4. SMOOTH ANCHOR SCROLL ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    // Sécurité : ignorer les ancres vides ou sans cible réelle
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ─── 5. SCROLL ANIMATIONS (AOS-like) ───────────── */
(function initAOS() {
  const elements = document.querySelectorAll("[data-aos]");
  if (!elements.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.aosDelay || 0, 10);
        setTimeout(() => el.classList.add("aos-animate"), delay);
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );

  elements.forEach((el) => io.observe(el));
})();

/* ─── 6. SKILL BAR ANIMATION ─────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const pct = Math.min(
          Math.max(parseInt(bar.dataset.pct || 0, 10), 0),
          100,
        );
        setTimeout(() => {
          bar.style.width = pct + "%";
        }, 400);
        io.unobserve(bar);
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((bar) => {
    bar.style.width = "0%";
    io.observe(bar);
  });
})();

/* ─── 7. TYPING EFFECT ───────────────────────────── */
(function initTyping() {
  const el = document.querySelector(".hero-subtitle");
  if (!el) return;

  const texts = [
    "Digitaler Lösungsentwickler (Junior)",
    "Interface-Entwickler",
    "Technik- & Cloud-Security-Enthusiast",
    "Prompt Engineer",
  ];
  let ti = 0,
    ci = 0,
    deleting = false;
  const speed = { type: 80, delete: 40, pause: 2200 };

  function tick() {
    const full = texts[ti];
    el.textContent = deleting
      ? full.substring(0, ci--)
      : full.substring(0, ci++);

    if (!deleting && ci > full.length) {
      deleting = true;
      setTimeout(tick, speed.pause);
      return;
    }
    if (deleting && ci < 0) {
      ci = 0;
      deleting = false;
      ti = (ti + 1) % texts.length;
    }
    setTimeout(tick, deleting ? speed.delete : speed.type);
  }

  setTimeout(tick, 1200);
})();

/* ─── 8. PARALLAX SOURIS (desktop uniquement) ────── */
(function initParallax() {
  if (isTouchDevice()) return; // pas de parallaxe sur mobile/tablette tactile

  const orbs = document.querySelectorAll(".bg-orb");
  if (!orbs.length) return;

  const speeds = [0.02, 0.035, 0.015, 0.025];
  let ticking = false;
  let lastX = 0,
    lastY = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(() => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = lastX - cx;
          const dy = lastY - cy;
          orbs.forEach((orb, i) => {
            const s = speeds[i] || 0.02;
            orb.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
})();

/* ─── 9. TILT 3D (desktop uniquement) ───────────── */
(function initTilt() {
  if (isTouchDevice()) return; // désactivé sur écrans tactiles

  const cards = document.querySelectorAll(".project-card, .skill-card");

  cards.forEach((card) => {
    card.addEventListener(
      "mousemove",
      (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -5;
        const rotateY = ((x - cx) / cx) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      },
      { passive: true },
    );

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ─── 10. COMPTEURS ANIMÉS ───────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll(".stat-num");
  if (!stats.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const num = parseInt(raw, 10);
        const suffix = raw.replace(/\d/g, "");
        if (isNaN(num)) return;

        let start = 0;
        const step = Math.max(1, Math.ceil(num / 40));
        const id = setInterval(() => {
          start = Math.min(start + step, num);
          el.textContent = start + suffix;
          if (start >= num) clearInterval(id);
        }, 40);
        io.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((s) => io.observe(s));
})();
