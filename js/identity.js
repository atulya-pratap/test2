/* THE SANIYA ARCHIVE — identity.js
   Stage 05: Identity & Passport Module Interactive Logic
   Handles the 3D opening and flipping mechanisms, controls, and print triggers. */

(function () {
  "use strict";

  // 1. Reveal JS interface
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  // 2. Element References
  const container = document.getElementById("passport-container");
  const cover = document.querySelector(".passport-cover");
  const btnOpen = document.getElementById("btn-open");
  const btnFront = document.getElementById("btn-front");
  const btnReverse = document.getElementById("btn-reverse");
  const btnClose = document.getElementById("btn-close");
  const btnPrint = document.getElementById("btn-print");
  const backStamps = document.querySelectorAll(".passport-back .stamp--press");
  const passportInner = document.querySelector(".passport-inner");

  // 3. State Tracking
  let isOpened = false;
  let isFlipped = false;

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 4. State Management Functions
  function updateControls() {
    if (!isOpened) {
      btnOpen.hidden = false;
      btnFront.hidden = true;
      btnReverse.hidden = true;
      btnClose.hidden = true;
    } else {
      btnOpen.hidden = true;
      btnClose.hidden = false;
      
      if (isFlipped) {
        btnFront.hidden = false;
        btnReverse.hidden = true;
      } else {
        btnFront.hidden = true;
        btnReverse.hidden = false;
      }
    }
  }

  function openPassport() {
    if (isOpened) return;
    isOpened = true;
    isFlipped = false;
    
    container.classList.add("is-open");
    container.classList.remove("is-flipped");
    updateControls();
  }

  function flipToReverse() {
    if (!isOpened || isFlipped) return;
    isFlipped = true;
    
    container.classList.add("is-flipped");
    
    // Add tactile 'thud' and trigger stamps when the reverse side comes into view
    // Using timeouts to align with the CSS flip transition duration (0.9s)
    if (!prefersReducedMotion) {
      setTimeout(() => {
        passportInner.classList.remove("thud");
        void passportInner.offsetWidth; // trigger reflow
        passportInner.classList.add("thud");

        // Re-trigger stamp animations for dramatic effect
        backStamps.forEach(stamp => {
          stamp.classList.remove("is-stamped");
          void stamp.offsetWidth;
          stamp.classList.add("is-stamped");
        });
      }, 700);
    } else {
      backStamps.forEach(s => s.classList.add("is-stamped"));
    }

    updateControls();
  }

  function flipToFront() {
    if (!isOpened || !isFlipped) return;
    isFlipped = false;
    
    container.classList.remove("is-flipped");
    updateControls();
  }

  function closePassport() {
    if (!isOpened) return;
    
    isOpened = false;
    isFlipped = false;
    
    container.classList.remove("is-open");
    container.classList.remove("is-flipped");
    updateControls();
  }

  // 5. Event Listeners
  if (btnOpen) btnOpen.addEventListener("click", openPassport);
  
  // Allow clicking the physical cover to open as well
  if (cover) {
    cover.addEventListener("click", openPassport);
    // Accessibility for cover click
    cover.setAttribute("role", "button");
    cover.setAttribute("tabindex", "0");
    cover.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPassport();
      }
    });
  }

  if (btnFront) btnFront.addEventListener("click", flipToFront);
  if (btnReverse) btnReverse.addEventListener("click", flipToReverse);
  if (btnClose) btnClose.addEventListener("click", closePassport);

  // Print button hooks into the native browser print dialogue
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // 6. Scroll Reveal Initialization (from core guidelines)
  const targets = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { 
          e.target.style.animationPlayState = 'running';
          e.target.classList.add("is-visible"); 
          io.unobserve(e.target); 
        }
      });
    }, { threshold: 0.1 });
    
    targets.forEach((t) => {
      t.style.animationPlayState = 'paused';
      io.observe(t); 
    });
  }

})();
