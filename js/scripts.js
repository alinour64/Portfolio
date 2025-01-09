// ===== Show current year in footer =====
const currentYear = document.getElementById('current-year');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// ===== Mobile Nav Toggle =====
// Select elements
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

// Function to close the menu
function closeMenu() {
  mainNav.classList.remove('active');
}

// Toggle menu on button click
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });

  // Close menu when clicking on a menu item
  mainNav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      closeMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
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



document.addEventListener("DOMContentLoaded", () => {
  const resumeButton = document.querySelector(".btn-resume");
  const scrollDownButton = document.querySelector(".scroll-down");
  const gap = 10; // Small gap in pixels before disappearance
  const heroSection = document.querySelector("#home"); // The hero section container

  const checkVisibility = () => {
    const resumeRect = resumeButton.getBoundingClientRect();
    const scrollRect = scrollDownButton.getBoundingClientRect();
    const heroRect = heroSection.getBoundingClientRect(); // Get bounding rectangle for the hero section

    // Check if the scroll-down button should disappear
    if (
      resumeRect.bottom >= scrollRect.top - gap || // Overlap condition
      heroRect.top < 0 // Hero section partially out of view
    ) {
      scrollDownButton.classList.add("hidden");
    } else {
      scrollDownButton.classList.remove("hidden");
    }
  };

  // Check on load, resize, and scroll
  window.addEventListener("resize", checkVisibility);
  window.addEventListener("scroll", checkVisibility);

  checkVisibility(); // Initial check
});


document.addEventListener("DOMContentLoaded", () => {
  // Select the form and the success message div
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success-message");

  if (form) {
    // Add a submit event listener to the form
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      const formData = new FormData(form); // Gather form data
      const action = form.action; // Get the action URL

      try {
        // Send the form data using the Fetch API
        const response = await fetch(action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // If the response is successful, display a success message
          successMessage.style.display = "block";
          successMessage.textContent = "Thank you! Your message has been sent.";
          form.reset(); // Clear the form
        } else {
          // Handle errors
          successMessage.style.display = "block";
          successMessage.textContent = "Oops! There was a problem. Please try again.";
          successMessage.style.color = "red";
        }
      } catch (error) {
        // Handle network errors
        successMessage.style.display = "block";
        successMessage.textContent = "There was a problem sending your message.";
        successMessage.style.color = "red";
      }
    });
  }
});
