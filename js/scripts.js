/* =========================================================
   Nour Ali — Portfolio ("Ink & Voltage")
   Handles: preloader, Lenis smooth scroll, custom cursor,
   magnetic elements, split-letter hero, GSAP ScrollTrigger
   reveals, timeline drawing, ripple dot-grid canvas, typed
   subtitle, scroll spy, contact form, resume modal.
   ========================================================= */

/* Always start at the top on refresh (disable browser scroll restoration) */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

(function handleRefreshScroll() {
  let isReload = false;
  const navEntries = performance.getEntriesByType
    ? performance.getEntriesByType("navigation")
    : [];
  if (navEntries.length && navEntries[0].type) {
    isReload = navEntries[0].type === "reload";
  } else if (performance.navigation) {
    isReload = performance.navigation.type === 1;
  }

  if (isReload && window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const shouldForceTop = isReload || !window.location.hash;
  if (!shouldForceTop) return;

  const toTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

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
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* =========================================================
   1. Preloader
   ========================================================= */
(function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    preloader.classList.add("done");
    document.body.classList.add("loaded");
    setTimeout(() => preloader.remove(), 800);
  };

  // Hide as soon as the DOM is ready — don't hold the page hostage
  // waiting for slow CDNs/images (window.load can take seconds).
  setTimeout(hide, prefersReducedMotion ? 0 : 400);
  // Safety net: never trap the visitor behind the loader
  setTimeout(hide, 2500);
})();

/* =========================================================
   2. Lenis smooth scrolling (+ GSAP ScrollTrigger sync)
   ========================================================= */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor links scroll through Lenis so easing stays consistent
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -60 });
    });
  });
}

/* =========================================================
   3. Footer year
   ========================================================= */
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();

/* =========================================================
   4. Custom cursor
   ========================================================= */
(function initCursor() {
  if (!finePointer || prefersReducedMotion) return;
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  let mx = -100, my = -100;   // mouse
  let rx = -100, ry = -100;   // ring (lags behind)

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }, { passive: true });

  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  // Hover states via data-cursor attributes + native interactive elements
  const hoverSelector = 'a, button, [data-cursor="hover"], input, textarea';
  document.addEventListener("mouseover", (e) => {
    const view = e.target.closest('[data-cursor="view"]');
    if (view) {
      ring.classList.add("is-view");
      ring.classList.remove("is-hover");
      return;
    }
    if (e.target.closest(hoverSelector)) {
      ring.classList.add("is-hover");
      ring.classList.remove("is-view");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverSelector) || e.target.closest('[data-cursor="view"]')) {
      ring.classList.remove("is-hover", "is-view");
    }
  });
})();

/* =========================================================
   5. Magnetic elements
   ========================================================= */
(function initMagnetic() {
  if (!finePointer || prefersReducedMotion) return;
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = 0.35;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 500);
    });
  });
})();

/* =========================================================
   6. Split hero words + section titles into characters
   ========================================================= */
(function splitText() {
  document.querySelectorAll("[data-split], [data-split-title]").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "char";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch === " " ? " " : ch;
      el.appendChild(span);
    });
  });
})();

/* =========================================================
   7. Mobile navigation toggle
   ========================================================= */
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  mainNav.classList.remove("active");
  document.body.classList.remove("nav-open");
  if (navToggle) {
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = mainNav.classList.toggle("active");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
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
   8. Back to top
   ========================================================= */
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   9. Scroll progress bar + sticky header state
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
   10. Active nav link highlighting (scroll spy)
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
   11. Reveal on scroll (non-GSAP fallback elements)
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
   12. GSAP — hero intro + scroll choreography
   ========================================================= */
(function initAnimations() {
  if (prefersReducedMotion || typeof gsap === "undefined") {
    // No intro will run — enable hover transitions right away
    document.body.classList.add("intro-done");
    return;
  }

  /* --- Hero entrance (runs immediately — script sits at end of body) --- */
  const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.35 });

  tl.from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.6 })
    .from(
      ".hero-line:first-child .char",
      { yPercent: 110, duration: 0.8, stagger: 0.04 },
      "-=0.3"
    )
    .from(
      ".hero-word-outline .char",
      { yPercent: 110, duration: 0.8, stagger: 0.05 },
      "-=0.6"
    )
    .from(
      ".hero-portrait-wrap",
      { scale: 0, rotate: 30, duration: 0.8, ease: "back.out(1.6)" },
      "-=0.55"
    )
    .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(".hero-blurb", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(".hero-cta > *", { y: 24, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3")
    .from(".hero-marquee", { yPercent: 100, duration: 0.6 }, "-=0.4")
    .from(".scroll-down", { opacity: 0, duration: 0.5 }, "-=0.3")
    // Clear inline transforms so the CSS hover effects on the name
    // and portrait take over once the intro has finished.
    .call(() => {
      gsap.set(".hero-word .char, .hero-portrait-wrap, .hero-marquee", {
        clearProps: "transform",
      });
      document.body.classList.add("intro-done");
    });

  if (typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on("scroll", ScrollTrigger.update);
  // Re-measure trigger positions once late resources (images, fonts) settle
  window.addEventListener("load", () => ScrollTrigger.refresh());

  /* --- Scroll-scrubbed effects: desktop only. On phones scrubbed
     transforms repaint on every native-scroll frame and cause jank,
     so the layout simply stays put there. --- */
  const largeScreen = window.matchMedia("(min-width: 861px)").matches;

  if (largeScreen) {
    /* Hero parallax out */
    gsap.to(".hero-content", {
      yPercent: -12,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    /* Ghost titles drift with scroll */
    gsap.utils.toArray(".ghost-title").forEach((ghost) => {
      gsap.fromTo(
        ghost,
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: ghost.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    });
  }

  /* --- Section titles: chars rise in --- */
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.from(title.querySelectorAll(".char"), {
      yPercent: 120,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.035,
      scrollTrigger: { trigger: title, start: "top 88%" },
    });
  });

  /* --- Section numbers draw their rule --- */
  gsap.utils.toArray(".section-num").forEach((num) => {
    gsap.from(num, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      scrollTrigger: { trigger: num, start: "top 90%" },
    });
  });

  /* --- Education cards stagger up (one quick pass for the whole
     grid, then transforms are cleared so rows align and the CSS
     hover-lift works) --- */
  gsap.from(".edu-card", {
    opacity: 0,
    y: 40,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.08,
    clearProps: "transform",
    scrollTrigger: { trigger: ".edu-grid", start: "top 85%", once: true },
  });

  /* --- Timeline: line draws, nodes light, cards slide in --- */
  gsap.utils.toArray(".timeline").forEach((timeline) => {
    const line = timeline.querySelector(".timeline-line");
    if (line) {
      gsap.fromTo(
        line,
        { "--line-progress": 0 },
        {
          "--line-progress": 1,
          ease: "none",
          scrollTrigger: {
            trigger: timeline,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );
    }

    timeline.querySelectorAll(".timeline-item").forEach((item) => {
      gsap.from(item.querySelector(".timeline-card"), {
        opacity: 0,
        x: 70,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: item, start: "top 85%", once: true },
      });
      ScrollTrigger.create({
        trigger: item,
        start: "top 70%",
        onEnter: () => item.classList.add("lit"),
      });
    });
  });

  /* --- Project rows wipe in --- */
  gsap.utils.toArray(".project-row").forEach((row) => {
    const inner = [row.querySelector(".project-index"), row.querySelector(".project-body")];
    gsap.from(inner, {
      opacity: 0,
      y: 50,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.1,
      clearProps: "transform",
      scrollTrigger: { trigger: row, start: "top 85%", once: true },
    });
  });

  /* --- Skill chips pop in --- */
  gsap.utils.toArray(".skills-grid").forEach((grid) => {
    gsap.from(grid.querySelectorAll("span"), {
      opacity: 0,
      y: 22,
      scale: 0.85,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.025,
      clearProps: "transform",
      scrollTrigger: { trigger: grid, start: "top 88%" },
    });
  });

  /* --- Interest chips cascade --- */
  gsap.from(".interest-chip", {
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.08,
    clearProps: "transform",
    scrollTrigger: { trigger: ".interests-grid", start: "top 88%" },
  });

  /* --- Contact panel --- */
  gsap.from(".contact-intro", {
    opacity: 0,
    x: -50,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: ".contact-grid", start: "top 82%" },
  });
  gsap.from(".contact-form", {
    opacity: 0,
    x: 50,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: ".contact-grid", start: "top 82%" },
  });
})();

/* =========================================================
   13. 3D tilt on cards (custom, dependency-free)
   ========================================================= */
(function initTilt() {
  if (!finePointer || prefersReducedMotion) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const MAX = 7;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-py * MAX}deg) rotateY(${px * MAX}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      card.style.transform = "";
      setTimeout(() => (card.style.transition = ""), 600);
    });
  });
})();

/* =========================================================
   14. Typed.js subtitle
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
      startDelay: 1800,
      loop: true,
      smartBackspace: true,
    });
  }
});

/* =========================================================
   15. Scroll-down button visibility
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
   16. Contact form submission
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
        successMessage.style.color = "var(--volt)";
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
   17. Resume modal (embedded live viewer)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-resume");
  const modal = document.getElementById("resume-modal");
  if (!openBtn || !modal) return;

  const iframe = modal.querySelector("iframe");
  let loaded = false;

  function openModal() {
    if (!loaded && iframe && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
      loaded = true;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lenis) lenis.start();
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
   18. Hero background — interactive ripple dot grid
   Dots breathe softly; the pointer sends a magnetic ripple
   through the grid that lights nearby dots in volt green.
   ========================================================= */
(function initDotGrid() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  const isSmall = window.matchMedia("(max-width: 600px)").matches;
  // Phones: render at a lower pixel ratio and sparser grid — the effect
  // reads the same but costs a fraction of the fill-rate.
  const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
  let width, height, dots, animationId;
  const mouse = { x: -9999, y: -9999, radius: 170 };

  const GAP = isSmall ? 44 : 42;
  const BASE_R = 1.1;

  function size() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createDots() {
    dots = [];
    const cols = Math.ceil(width / GAP) + 1;
    const rows = Math.ceil(height / GAP) + 1;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          ox: i * GAP,          // origin
          oy: j * GAP,
          x: i * GAP,
          y: j * GAP,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    t += 0.014;

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      // Gentle ambient breathing
      const breathe = Math.sin(t + d.phase) * 0.5 + 0.5;

      // Pointer displacement + glow
      const dx = d.ox - mouse.x;
      const dy = d.oy - mouse.y;
      const dist = Math.hypot(dx, dy);
      let glow = 0;

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius);
        glow = force;
        const push = force * 22;
        d.x += (d.ox + (dx / (dist || 1)) * push - d.x) * 0.12;
        d.y += (d.oy + (dy / (dist || 1)) * push - d.y) * 0.12;
      } else {
        d.x += (d.ox - d.x) * 0.08;
        d.y += (d.oy - d.y) * 0.08;
      }

      const r = BASE_R + breathe * 0.7 + glow * 2.4;
      const alpha = 0.10 + breathe * 0.08 + glow * 0.8;

      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = glow > 0.08
        ? `rgba(214, 249, 75, ${Math.min(alpha, 0.95)})`
        : `rgba(233, 255, 210, ${alpha})`;
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    size();
    createDots();
    cancelAnimationFrame(animationId);
    draw();
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationId);
    start();
  });

  // Track pointer across the hero (canvas sits under content).
  // Touch devices skip this — no hover means no ripple to compute.
  const hero = document.querySelector(".hero-section");
  if (finePointer) {
    (hero || canvas).addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    (hero || canvas).addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  // Pause when hero is off-screen (saves battery/CPU)
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!animationId) draw();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }).observe(hero);
  }

  start();
})();
