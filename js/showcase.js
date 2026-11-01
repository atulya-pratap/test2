/* THE SANIYA ARCHIVE — showcase.js (temporary, Stage 02)
   Powers the demo toggles only. Delete with showcase.html when Stage 03 begins.
   The design system itself (css/*.css) needs no JavaScript. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* Scroll reveal */
  var targets = document.querySelectorAll(".js-reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("is-visible"); });
  }

  /* Replay helper: remove the class, force reflow, add it again */
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  /* data-replay="selector|class" buttons */
  document.querySelectorAll("[data-replay]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parts = btn.getAttribute("data-replay").split("|");
      document.querySelectorAll(parts[0]).forEach(function (el) { replay(el, parts[1]); });
    });
  });

  /* Stamp press: play when scrolled into view the first time */
  var press = document.querySelectorAll(".stamp--press");
  if ("IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-stamped"); sio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    press.forEach(function (s) { sio.observe(s); });
  } else {
    press.forEach(function (s) { s.classList.add("is-stamped"); });
  }

  /* Envelope */
  var env = document.getElementById("envelope");
  var envBtn = document.getElementById("envelope-toggle");
  if (env && envBtn) {
    envBtn.addEventListener("click", function () {
      var open = env.classList.toggle("is-open");
      envBtn.setAttribute("aria-expanded", String(open));
      envBtn.textContent = open ? "Close envelope" : "Open envelope";
    });
    var seal = env.querySelector(".envelope__seal");
    if (seal) seal.addEventListener("click", function () { envBtn.click(); });
  }

  /* Licence flip */
  var flip = document.getElementById("flip");
  var flipBtn = document.getElementById("flip-toggle");
  if (flip && flipBtn) {
    flipBtn.addEventListener("click", function () {
      var on = flip.classList.toggle("is-flipped");
      flipBtn.setAttribute("aria-pressed", String(on));
      flipBtn.textContent = on ? "Show front" : "Show back";
    });
  }

  /* Forced reduced-motion preview toggle */
  var rm = document.getElementById("rm-note");
  if (rm && window.matchMedia) {
    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    var update = function () {
      rm.textContent = mq.matches
        ? "Your system requests reduced motion: animations resolve instantly."
        : "Your system allows motion. Turn on 'Reduce motion' in OS settings and reload to verify the fallback.";
    };
    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
  }

  /* Live viewport readout */
  var vp = document.getElementById("vp");
  function readout() {
    var w = window.innerWidth;
    var name = w < 360 ? "xs (small phone)" : w < 600 ? "base (phone)" : w < 768 ? "sm" : w < 1024 ? "md (tablet)" : w < 1280 ? "lg (desktop)" : "xl";
    if (vp) vp.textContent = w + "px · " + name;
  }
  readout();
  window.addEventListener("resize", readout);
})();
