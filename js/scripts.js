/* =========================================================
   Nour Ali — Portfolio
   Handles: particle hero, GSAP intro timeline, ScrollTrigger
   reveals, vanilla-tilt, scroll progress, active-nav, header
   state, mobile nav, typed subtitle, contact form.
   ========================================================= */

/* Always start at the top on refresh (disable browser scroll restoration) */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

(function handleRefreshScroll() {
  // Was this a reload (refresh / Cmd+R)?
  let isReload = false;
  const navEntries = performance.getEntriesByType
    ? performance.getEntriesByType("navigation")
    : [];
  if (navEntries.length && navEntries[0].type) {
    isReload = navEntries[0].type === "reload";
  } else if (performance.navigation) {
    // Older browsers
    isReload = performance.navigation.type === 1;
  }

  if (isReload && window.location.hash) {
    // Strip the leftover #section so it can't pull us back down,
    // without adding a new history entry.
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  // Only honor a hash on a genuine fresh visit (shared deep link).
  const shouldForceTop = isReload || !window.location.hash;
  if (!shouldForceTop) return;

  // Jump instantly, bypassing CSS smooth-scroll.
  const toTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  // Run it now and repeatedly to beat late browser scroll-restoration.
  toTop();
  document.addEventListener("DOMContentLoaded", toTop);
  window.addEventListener("load", () => {
    toTop();
    requestAnimationFrame(toTop);
    setTimeout(toTop, 60);
    setTimeout(toTop, 200);
  });
})();

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* =========================================================
   1. Footer year
   ========================================================= */
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();

/* =========================================================
   2. Mobile navigation toggle
   ========================================================= */
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  mainNav.classList.remove("active");
  if (navToggle) navToggle.classList.remove("open");
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    mainNav.classList.toggle("active");
    navToggle.classList.toggle("open");
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });
}

/* =========================================================
   3. Back to top
   ========================================================= */
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   4. Scroll progress bar + sticky header state
   ========================================================= */
const progressBar = document.querySelector(".scroll-progress");
const header = document.querySelector(".main-header");

function onScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
  if (header) header.classList.toggle("scrolled", scrollTop > 20);
}
window.addEventListener("scroll", onScrollUI, { passive: true });
onScrollUI();

/* =========================================================
   5. Active nav link highlighting (scroll spy)
   ========================================================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav a");

if (sections.length && navLinks.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* =========================================================
   6. Reveal on scroll (fallback / non-GSAP elements)
   ========================================================= */
const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));
}

/* =========================================================
   7. GSAP intro timeline + ScrollTrigger card reveals
   ========================================================= */
window.addEventListener("load", () => {
  if (prefersReducedMotion || typeof gsap === "undefined") return;

  // Hero entrance choreography
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".hero-image-wrap", { scale: 0.6, opacity: 0, duration: 0.9 })
    .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.3")
    .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(
      ".hero-cta > *",
      { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 },
      "-=0.3"
    )
    .from(".scroll-down", { opacity: 0, duration: 0.6 }, "-=0.2");

  // ScrollTrigger directional reveals for cards
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Stagger cards within each section, alternating slide direction
    const groups = [
      { selector: "#education .card", x: -50 },
      { selector: "#experience .experience-block", x: 50 },
      { selector: "#projects .project-card", x: -50 },
      { selector: "#volunteer .experience-block", x: 50 },
    ];

    groups.forEach((g) => {
      const items = gsap.utils.toArray(g.selector);
      items.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: g.x,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          delay: (i % 2) * 0.05,
        });
      });
    });

    // Skill / interest chips pop in with stagger
    gsap.utils.toArray(".skills-grid").forEach((grid) => {
      gsap.from(grid.querySelectorAll("span"), {
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.03,
        scrollTrigger: { trigger: grid, start: "top 85%" },
      });
    });

    // Section titles draw in
    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: title, start: "top 90%" },
      });
    });
  }
});

/* =========================================================
   8. Vanilla-tilt on cards
   ========================================================= */
window.addEventListener("load", () => {
  if (prefersReducedMotion || typeof VanillaTilt === "undefined") return;
  // Only on devices with a precise pointer (mouse). Touch screens skip tilt
  // so cards don't get stuck mid-tilt after a tap.
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const tiltEls = document.querySelectorAll(
    ".project-card, .experience-block, .card"
  );
  VanillaTilt.init(tiltEls, {
    max: 5,
    speed: 600,
    glare: true,
    "max-glare": 0.12,
    scale: 1.01,
    gyroscope: false,
  });
});

/* =========================================================
   9. Typed.js subtitle
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const typedSubtitle = document.querySelector(".typed-subtitle");
  if (typedSubtitle && typeof Typed !== "undefined") {
    new Typed(typedSubtitle, {
      strings: [
        "Software Engineer @ Amazon",
        "ML &amp; AI Enthusiast",
        "Full-Stack Developer",
        "Lifelong Learner",
      ],
      typeSpeed: 55,
      backSpeed: 28,
      backDelay: 1400,
      startDelay: 600,
      loop: true,
      smartBackspace: true,
    });
  }
});

/* =========================================================
   10. Scroll-down button visibility
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const scrollDownButton = document.querySelector(".scroll-down");
  const heroSection = document.querySelector("#home");
  if (!scrollDownButton || !heroSection) return;

  const checkVisibility = () => {
    const heroRect = heroSection.getBoundingClientRect();
    scrollDownButton.classList.toggle("hidden", heroRect.bottom < window.innerHeight * 0.5);
  };

  window.addEventListener("scroll", checkVisibility, { passive: true });
  window.addEventListener("resize", checkVisibility);
  checkVisibility();
});

/* =========================================================
   11. Contact form submission
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success-message");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      successMessage.style.display = "block";
      if (response.ok) {
        successMessage.textContent = "Thank you! Your message has been sent.";
        successMessage.style.color = "var(--secondary)";
        form.reset();
      } else {
        successMessage.textContent = "Oops! There was a problem. Please try again.";
        successMessage.style.color = "#ff6b6b";
      }
    } catch (error) {
      successMessage.style.display = "block";
      successMessage.textContent = "There was a problem sending your message.";
      successMessage.style.color = "#ff6b6b";
    }
  });
});

/* =========================================================
   12. Resume modal (embedded live viewer)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-resume");
  const modal = document.getElementById("resume-modal");
  if (!openBtn || !modal) return;

  const iframe = modal.querySelector("iframe");
  let loaded = false;

  function openModal() {
    // Lazy-load the embed only the first time it's opened
    if (!loaded && iframe && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
      loaded = true;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);

  modal.querySelectorAll("[data-close-resume]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
});

/* =========================================================
   13. Particle constellation hero background
   ========================================================= */
(function initParticles() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  if (prefersReducedMotion) return; // keep it calm for reduced-motion users

  const ctx = canvas.getContext("2d");
  let width, height, particles, animationId;
  const mouse = { x: null, y: null, radius: 140 };

  const COLORS = ["#bb86fc", "#03dac6", "#7c5cff"];

  function size() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  // Lighter load on phones: fewer particles, shorter link distance
  const isSmall = window.matchMedia("(max-width: 600px)").matches;
  const MAX_PARTICLES = isSmall ? 40 : 90;
  const LINK_DIST = isSmall ? 90 : 120;

  function createParticles() {
    // Density scales with area, capped for performance
    const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / 14000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }
      }

      // Draw point
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.8;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.18;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(draw);
  }

  function start() {
    size();
    createParticles();
    cancelAnimationFrame(animationId);
    draw();
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationId);
    start();
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Pause when hero off-screen (saves battery/CPU)
  const heroSection = document.querySelector("#home");
  if (heroSection && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!animationId) draw();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }).observe(heroSection);
  }

  start();
})();
