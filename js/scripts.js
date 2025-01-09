// ===== Show current year in footer =====
const currentYear = document.getElementById('current-year');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// ===== Mobile Nav Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });
}

// ===== Smooth Scroll Button in Hero Section =====
const scrollBtn = document.querySelector('.btn-scroll');
if (scrollBtn) {
  scrollBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const resumeSection = document.getElementById('resume');
    if (resumeSection) {
      resumeSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== Back to Top Button =====
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== Reveal on Scroll (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
};
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver(revealOnScroll, observerOptions);
revealElements.forEach((el) => observer.observe(el));

// ==== NEW: GSAP Intro Animations ====
// Example: fade in hero image from the left
window.addEventListener('load', () => {
  gsap.from('.hero-image', {
    x: -150,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out"
  });
  gsap.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    delay: 0.5,
    ease: "power2.out"
  });
});

// ==== NEW: Typed.js for hero-subtitle ====
document.addEventListener('DOMContentLoaded', function () {
  const typedSubtitle = document.querySelector('.typed-subtitle');
  if (typedSubtitle) {
    new Typed(typedSubtitle, {
      strings: [
        "Software Engineer",
        "Computer Scientist",
        "Full-Stack Developer"
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1200,
      loop: true
    });
  }
});

