/* THE SANIYA ARCHIVE — portal.js
   Stage 03: Immigration Portal Sequence Manager
   Handles the intro terminal, document scanning, and approval stamp. */

(function () {
  "use strict";

  // 1. Remove no-js fallback (allows CSS to hide final state and start sequence)
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  // 2. Element References
  const phaseTerminal = document.getElementById("phase-terminal");
  const phaseDocument = document.getElementById("phase-document");
  const skipBtn = document.getElementById("skip-btn");
  const terminalLines = [
    document.getElementById("term-1"),
    document.getElementById("term-2"),
    document.getElementById("term-3"),
    document.getElementById("term-4"),
    document.getElementById("term-5"),
    document.getElementById("term-6"),
    document.getElementById("term-7")
  ];
  const scannerLine = document.getElementById("scanner-line");
  const statusBadge = document.getElementById("status-badge");
  const approvalStamp = document.getElementById("approval-stamp");
  const actionArea = document.getElementById("action-area");
  const authDocument = document.getElementById("auth-document");
  const enterBtn = document.getElementById("enter-btn");

  // 3. State & Config
  let isSkipped = false;
  let sequenceTimeouts = [];
  
  // Timing config (in ms)
  const T = {
    terminalLineDelay: 700,
    terminalToDocTransition: 1500,
    scannerDelay: 800,
    scannerDuration: 2200,
    stampDelay: 400,
    actionAreaDelay: 1000
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 4. Utility: Cancellable Sleep
  function sleep(ms) {
    return new Promise(resolve => {
      const timeoutId = setTimeout(resolve, ms);
      sequenceTimeouts.push(timeoutId);
    });
  }

  // 5. Sequence Execution
  async function runSequence() {
    // If reduced motion is requested, instantly skip to the end to avoid flashy scanner/terminal.
    if (prefersReducedMotion) {
      completeSequenceInstantly();
      return;
    }

    try {
      // Phase 1: Terminal Typewriter Effect
      await sleep(500);
      for (let i = 0; i < terminalLines.length; i++) {
        if (isSkipped) return;
        if (terminalLines[i]) {
          terminalLines[i].classList.add('is-visible');
        }
        // Slightly faster typing for the middle lines
        const delay = (i === 1 || i === 2 || i === 5) ? 400 : T.terminalLineDelay;
        await sleep(delay);
      }

      await sleep(T.terminalToDocTransition);
      if (isSkipped) return;

      // Phase 2: Transition to Document Screen
      phaseTerminal.classList.remove('is-active');
      phaseDocument.classList.add('is-active');
      
      await sleep(T.scannerDelay);
      if (isSkipped) return;

      // Start Scanner
      scannerLine.classList.add('is-scanning');
      
      // Wait for scanner to reach the bottom
      await sleep(T.scannerDuration);
      if (isSkipped) return;

      // Update Status Badge dynamically
      statusBadge.className = "badge badge--verified";
      statusBadge.textContent = "VERIFIED";

      await sleep(T.stampDelay);
      if (isSkipped) return;

      // Phase 3: The Stamp Thud
      approvalStamp.classList.add("is-stamped");
      
      // Add physical "thud" shake to the document using our base animation classes
      authDocument.classList.add("thud");

      await sleep(T.actionAreaDelay);
      if (isSkipped) return;

      // Show welcome text and enter button
      actionArea.classList.add("is-visible");
      skipBtn.style.display = "none"; // Sequence over, remove skip button

    } catch (e) {
      console.error("Portal sequence interrupted:", e);
      completeSequenceInstantly();
    }
  }

  // 6. Skip / Instant Completion Logic
  function completeSequenceInstantly() {
    isSkipped = true;
    
    // Clear any pending timeouts
    sequenceTimeouts.forEach(clearTimeout);
    sequenceTimeouts = [];

    // Force UI to final state instantly
    phaseTerminal.classList.remove('is-active');
    phaseDocument.classList.add('is-active');
    
    scannerLine.style.display = "none"; // Hide scanner
    
    statusBadge.className = "badge badge--verified";
    statusBadge.textContent = "VERIFIED";
    
    // Ensure stamp renders without delay
    approvalStamp.style.animationDuration = "0.01ms";
    approvalStamp.classList.add("is-stamped");
    
    actionArea.classList.add("is-visible");
    actionArea.style.transitionDuration = "0.01ms"; // Remove fade delay
    
    skipBtn.style.display = "none";
  }

  // 7. Event Listeners
  if (skipBtn) {
    skipBtn.addEventListener('click', completeSequenceInstantly);
  }

  // Page Exit Transition helper (when Enter Archive is clicked)
  if (enterBtn) {
    enterBtn.addEventListener('click', function(e) {
      // If the dashboard doesn't exist yet, we can let it gracefully 404 or prevent default.
      // Assuming it will navigate to dashboard.html, we add the page-exit animation.
      document.body.classList.add("page-exit");
    });
  }

  // 8. Initiate
  window.addEventListener('load', runSequence);

})();
