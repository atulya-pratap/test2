/* THE SANIYA ARCHIVE — dashboard.js
   Stage 04: Dashboard Logic & Data Architecture
   Populates the archive registry arrays into the DOM and handles routing/toasts. */

(function () {
  "use strict";

  // 1. Data Architecture: Departments
  const departments = [
    {
      id: "identity",
      title: "Identity & Credentials",
      desc: "Official travel license and supporting identity documents.",
      ref: "DEPT-01",
      icon: "icon--compass",
      status: "pending",
      styleClass: "card card--document"
    },
    {
      id: "destinations",
      title: "Destination Registry",
      desc: "Logged places, spontaneous stops, and future adventures.",
      ref: "DEPT-02",
      icon: "icon--pin",
      status: "pending",
      styleClass: "card surface-grain"
    },
    {
      id: "soundtrack",
      title: "Soundtrack Archive",
      desc: "Songs, music, and compositions associated with the journey.",
      ref: "DEPT-03",
      icon: "icon--star",
      status: "pending",
      styleClass: "card--ticket" // Requires nesting in ticket wrapper during render
    },
    {
      id: "journal",
      title: "Travel Journal",
      desc: "Photographs, stories, and collected physical memories.",
      ref: "DEPT-04",
      icon: "icon--envelope",
      status: "pending",
      styleClass: "card surface-aged border-dashed"
    },
    {
      id: "permits",
      title: "Special Permits",
      desc: "Unusual allowances issued specifically to the traveler.",
      ref: "DEPT-05",
      icon: "icon--key",
      status: "pending",
      styleClass: "card surface-certificate"
    },
    {
      id: "officer",
      title: "Officer's Letter",
      desc: "A personal dispatch from the issuing archive officer.",
      ref: "DEPT-06",
      icon: "icon--envelope",
      status: "pending",
      styleClass: "card surface-letter"
    },
    {
      id: "classified",
      title: "Classified Archives",
      desc: "Redacted files, secret notes, and restricted easter eggs.",
      ref: "DEPT-07",
      icon: "icon--key",
      status: "restricted",
      styleClass: "card--classified dept-card--classified"
    }
  ];

  // 2. Data Architecture: Featured Documents
  const featuredDocs = [
    {
      id: "feat-license",
      title: "Travel License",
      sub: "TTC6252021",
      badge: "VERIFIED",
      badgeType: "badge--verified",
      target: "identity",
      style: "card card--tight surface-parchment border-double"
    },
    {
      id: "feat-music",
      title: "The Unplanned Journey",
      sub: "VOL. 01",
      badge: "IN PREP",
      badgeType: "badge--pending",
      target: "soundtrack",
      style: "card card--tight surface-grain border-ink"
    },
    {
      id: "feat-permit",
      title: "Unlimited Detour",
      sub: "PERMIT",
      badge: "ISSUED",
      badgeType: "badge--approved",
      target: "permits",
      style: "card card--tight surface-certificate"
    }
  ];

  // 3. Data Architecture: System Stats & Progress
  const stats = [
    { label: "Active Travel Licenses", value: "01" },
    { label: "Archive Departments", value: "07" },
    { label: "Special Permits Planned", value: "08" },
    { label: "Classified Files Opened", value: "00" }
  ];

  const archiveProgress = [
    { label: "Immigration Portal", status: "complete" },
    { label: "Main Dashboard", status: "complete" },
    { label: "Identity & Credentials", status: "pending" },
    { label: "Destination Registry", status: "pending" },
    { label: "Soundtrack Archive", status: "pending" },
    { label: "Travel Journal", status: "pending" },
    { label: "Special Permits", status: "pending" },
    { label: "Classified Archives", status: "pending" },
    { label: "Officer's Letter", status: "pending" }
  ];

  // 4. Rendering Functions
  function renderDepartments() {
    const container = document.getElementById("departments-container");
    if (!container) return;

    let html = "";
    departments.forEach(dept => {
      // Determine label based on status
      let badgeHtml = dept.status === 'restricted' 
        ? `<span class="badge badge--classified">RESTRICTED</span>`
        : `<span class="badge badge--pending">PENDING</span>`;

      // Ticket class requires a special wrapper based on Stage 02 design
      let isTicket = dept.styleClass.includes("card--ticket");
      
      let cardInner = `
        <article class="${dept.styleClass} dept-card lift">
          ${isTicket ? `<div>` : ''}
          <div class="flex-between mb-4">
            <span class="icon ${dept.icon} dept-icon" aria-hidden="true"></span>
            <span class="t-meta text-muted">${dept.ref}</span>
          </div>
          <h4 class="${isTicket ? 't-label' : 'card__title'}">${dept.title}</h4>
          <p class="${isTicket ? 't-doc mt-4' : 'card__body t-body-sm'}">${dept.desc}</p>
          <div class="${isTicket ? 'mt-4' : 'card__footer'}">${badgeHtml}</div>
          ${isTicket ? `</div><div class="ticket__stub"><div class="barcode"><span class="barcode__bars"></span></div></div>` : ''}
        </article>
      `;

      let finalHtml = isTicket 
        ? `<a href="${dept.id}.html" class="ticket archive-link" data-id="${dept.id}">${cardInner}</a>`
        : `<a href="${dept.id}.html" class="archive-link" data-id="${dept.id}" style="text-decoration:none;">${cardInner}</a>`;
        
      html += finalHtml;
    });

    container.innerHTML = html;
  }

  function renderFeatured() {
    const container = document.getElementById("featured-container");
    if (!container) return;

    let html = "";
    featuredDocs.forEach(doc => {
      html += `
        <a href="${doc.target}.html" class="${doc.style} archive-link lift" data-id="${doc.target}" style="text-decoration:none; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <h4 class="t-label">${doc.title}</h4>
            <p class="t-meta text-muted mt-1">${doc.sub}</p>
          </div>
          <div class="mt-4">
            <span class="badge ${doc.badgeType}">${doc.badge}</span>
          </div>
        </a>
      `;
    });
    container.innerHTML = html;
  }

  function renderStats() {
    const container = document.getElementById("stats-container");
    if (!container) return;

    let html = "";
    stats.forEach(stat => {
      html += `
        <li class="stat-row">
          <span class="t-label text-muted">${stat.label}</span>
          <span class="stat-value">${stat.value}</span>
        </li>
      `;
    });
    container.innerHTML = html;
  }

  function renderProgress() {
    const container = document.getElementById("progress-container");
    if (!container) return;

    let html = "";
    archiveProgress.forEach(item => {
      let stateClass = item.status === "complete" ? "is-complete" : "is-pending";
      html += `
        <div class="progress-item ${stateClass}">
          ${item.label}
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // 5. Toast Notification System
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "system-toast";
    toast.textContent = message;

    container.appendChild(toast);

    // Clean up DOM after animation completes
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 4000);
  }

  // 6. Navigation Interceptor
  // Blocks navigation to files that do not exist yet and shows an elegant toast.
  function bindNavigation() {
    const links = document.querySelectorAll(".archive-link");
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("data-id");
        
        // Find if target is pending or classified in our DB
        const dept = departments.find(d => d.id === targetId);
        
        if (dept) {
          if (dept.status === "pending") {
            e.preventDefault();
            showToast(`DEPT: ${dept.title} — Currently Pending Assembly.`);
          } else if (dept.status === "restricted") {
            e.preventDefault();
            showToast(`ACCESS DENIED: Section Classified.`);
          }
        } else {
          // Unmapped targets (like the featured placeholders)
          e.preventDefault();
          showToast(`DOCUMENT PENDING CLEARANCE.`);
        }
      });
    });
  }

  // 7. Scroll Reveal Logic (Recycled from showcase.js standards)
  function initScrollReveal() {
    const targets = document.querySelectorAll(".js-reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { 
            e.target.classList.add("is-visible"); 
            io.unobserve(e.target); 
          }
        });
      }, { threshold: 0.1 });
      targets.forEach((t) => { io.observe(t); });
    } else {
      targets.forEach((t) => { t.classList.add("is-visible"); });
    }
  }

  // 8. Initialization
  document.addEventListener("DOMContentLoaded", () => {
    // Reveal JS interface
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");

    renderDepartments();
    renderFeatured();
    renderStats();
    renderProgress();
    
    bindNavigation();
    initScrollReveal();
  });

})();
