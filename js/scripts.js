/*
  scripts.js
  --------
  Handles functionality for:
  - Current year in footer
  - Mobile nav toggle
  - Back-to-top button
  - Reveal on scroll
  - GSAP animations
  - Typed.js effect
  - Scroll-down button visibility
  - Contact form submission
*/

/* =========================================
   1. Show current year in the footer
   ========================================= */
   const currentYear = document.getElementById('current-year');
   if (currentYear) {
     currentYear.textContent = new Date().getFullYear();
   }
   
   /* =========================================
      2. Mobile Navigation Toggle
      ========================================= */
   const navToggle = document.querySelector('.nav-toggle');
   const mainNav = document.querySelector('.main-nav');
   
   /**
    * closeMenu:
    * Removes the 'active' class to hide the mobile nav.
    */
   function closeMenu() {
     mainNav.classList.remove('active');
   }
   
   if (navToggle && mainNav) {
     // Toggle the nav menu on hamburger click
     navToggle.addEventListener('click', () => {
       mainNav.classList.toggle('active');
     });
   
     // Close the nav menu when a link is clicked
     mainNav.addEventListener('click', (event) => {
       if (event.target.tagName === 'A') {
         closeMenu();
       }
     });
   
     // Close the nav menu when clicking outside of it
     document.addEventListener('click', (event) => {
       if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
         closeMenu();
       }
     });
   }
   
   /* =========================================
      3. Smooth Scroll Button in Hero Section
      ========================================= */
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
   
   /* =========================================
      4. Back to Top Button
      ========================================= */
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
   
   /* =========================================
      5. Reveal on Scroll (Intersection Observer)
      ========================================= */
   const revealElements = document.querySelectorAll('.reveal');
   
   /**
    * revealOnScroll:
    * Callback for intersection observer to reveal elements on scroll.
    */
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
   
   /* =========================================
      6. GSAP Intro Animations
      ========================================= */
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
   
   /* =========================================
      7. Typed.js Effect for Hero Subtitle
      ========================================= */
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
   
   /* =========================================
      8. Scroll-Down Button Visibility
      ========================================= */
   document.addEventListener("DOMContentLoaded", () => {
     const resumeButton = document.querySelector(".btn-resume");
     const scrollDownButton = document.querySelector(".scroll-down");
     const gap = 10; // Small gap in pixels before disappearance
     const heroSection = document.querySelector("#home");
   
     /**
      * checkVisibility:
      * Hides the scroll-down button if it overlaps the resume button
      * or if the hero section is scrolled out of view.
      */
     const checkVisibility = () => {
       const resumeRect = resumeButton.getBoundingClientRect();
       const scrollRect = scrollDownButton.getBoundingClientRect();
       const heroRect = heroSection.getBoundingClientRect();
   
       if (
         resumeRect.bottom >= scrollRect.top - gap ||
         heroRect.top < 0
       ) {
         scrollDownButton.classList.add("hidden");
       } else {
         scrollDownButton.classList.remove("hidden");
       }
     };
   
     window.addEventListener("resize", checkVisibility);
     window.addEventListener("scroll", checkVisibility);
   
     checkVisibility(); // Initial check
   });
   
   /* =========================================
      9. Contact Form Submission
      ========================================= */
   document.addEventListener("DOMContentLoaded", () => {
     const form = document.getElementById("contact-form");
     const successMessage = document.getElementById("form-success-message");
   
     if (form) {
       form.addEventListener("submit", async function (event) {
         event.preventDefault();
   
         const formData = new FormData(form);
         const action = form.action;
   
         try {
           const response = await fetch(action, {
             method: "POST",
             body: formData,
             headers: {
               Accept: "application/json",
             },
           });
   
           if (response.ok) {
             successMessage.style.display = "block";
             successMessage.textContent = "Thank you! Your message has been sent.";
             form.reset();
           } else {
             successMessage.style.display = "block";
             successMessage.textContent = "Oops! There was a problem. Please try again.";
             successMessage.style.color = "red";
           }
         } catch (error) {
           successMessage.style.display = "block";
           successMessage.textContent = "There was a problem sending your message.";
           successMessage.style.color = "red";
         }
       });
     }
   });
   