/* THE SANIYA ARCHIVE — destinations.js
   Stage 06: Destination Registry Logic
   Handles filtering, mapping, wishlist persistence, and the detail view. */

(function () {
  "use strict";

  // 1. Reveal JS interface
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  // 2. DATA ARCHITECTURE: Destinations
  // Coordinates (x, y) are percentages to plot on the abstract CSS Atlas.
  const destinationData = [
    {
      id: "dest-01",
      name: "The Mountain Files",
      category: "outdoors",
      categoryLabel: "The Great Outdoors",
      description: "A place where the air feels different and the world suddenly becomes quieter.",
      longDescription: "Elevated above the noise of standard itineraries, this location offers untouched trails and profound silence. It is highly recommended for clearing the mind and archiving stress.",
      location: "High Altitudes",
      status: "approved",
      referenceNumber: "IDA-DEST-001",
      isFictional: false,
      mapCoords: { x: 25, y: 35 },
      cardStyle: "card surface-parchment"
    },
    {
      id: "dest-02",
      name: "The Little Bookshop",
      category: "city",
      categoryLabel: "The City Files",
      description: "A place where getting lost between shelves is considered a perfectly valid itinerary.",
      longDescription: "Smelling faintly of old paper and dust, this destination is a temporal anomaly where hours pass in minutes. Navigation maps are useless here; follow the spines of the books.",
      location: "An Old City Street",
      status: "pending",
      referenceNumber: "IDA-DEST-002",
      isFictional: false,
      mapCoords: { x: 65, y: 40 },
      cardStyle: "card card-style-postcard"
    },
    {
      id: "dest-03",
      name: "Somewhere by the Sea",
      category: "outdoors",
      categoryLabel: "The Great Outdoors",
      description: "No schedule. No hurry. Just the sound of the waves and an unusually long afternoon.",
      longDescription: "The coastal archive sector. Characterized by salt air and an absolute lack of urgency. Authorized activities include staring at the horizon and collecting smooth stones.",
      location: "Coastline",
      status: "wishlist",
      referenceNumber: "IDA-DEST-003",
      isFictional: false,
      mapCoords: { x: 15, y: 70 },
      cardStyle: "card surface-grain"
    },
    {
      id: "dest-04",
      name: "The City After Rain",
      category: "city",
      categoryLabel: "The City Files",
      description: "Wet streets, warm lights and the feeling that the city has become a different place.",
      longDescription: "A specific atmospheric condition rather than a fixed coordinate. The reflection of streetlights on wet cobblestones grants temporary access to a deeply nostalgic state of mind.",
      location: "Metropolis",
      status: "approved",
      referenceNumber: "IDA-DEST-004",
      isFictional: false,
      mapCoords: { x: 55, y: 45 },
      cardStyle: "card surface-distressed"
    },
    {
      id: "dest-05",
      name: "The Unexpected Detour",
      category: "unplanned",
      categoryLabel: "The Unplanned",
      description: "A destination that was never on the original itinerary.",
      longDescription: "Discovered purely by accident following a missed train or a wrong turn. These locations often yield the highest quality archival memories.",
      location: "Unknown",
      status: "uncharted",
      referenceNumber: "IDA-DEST-005",
      isFictional: true,
      mapCoords: { x: 45, y: 65 },
      cardStyle: "card card-style-ticket"
    },
    {
      id: "dest-06",
      name: "Somewhere with Friends",
      category: "people",
      categoryLabel: "The People's Places",
      description: "The destination matters less than the people who make the journey memorable.",
      longDescription: "A collective registry entry. The geographical coordinates shift, but the atmosphere remains constant. Characterized by loud laughter and shared provisions.",
      location: "Shared Coordinates",
      status: "unlimited",
      referenceNumber: "IDA-DEST-006",
      isFictional: false,
      mapCoords: { x: 75, y: 60 },
      cardStyle: "card surface-aged"
    },
    {
      id: "dest-07",
      name: "The Place Beyond the Map",
      category: "imaginary",
      categoryLabel: "The Imaginary Dept.",
      description: "Coordinates unavailable. Curiosity sufficient.",
      longDescription: "A strictly theoretical destination existing at the intersection of imagination and wanderlust. Travel is permitted solely via daydreaming.",
      location: "Theoretical Space",
      status: "classified",
      referenceNumber: "IDA-DEST-007",
      isFictional: true,
      mapCoords: { x: 85, y: 25 },
      cardStyle: "card card--classified"
    },
    {
      id: "dest-08",
      name: "The Quiet Corner",
      category: "unplanned",
      categoryLabel: "The Unplanned",
      description: "A place where absolutely nothing needs to happen.",
      longDescription: "A rare sanctuary offering complete immunity from itineraries, notifications, and expectations. Highly restricted access; usually found when not actively looking.",
      location: "Undisclosed",
      status: "approved",
      referenceNumber: "IDA-DEST-008",
      isFictional: true,
      mapCoords: { x: 35, y: 55 },
      cardStyle: "card surface-letter"
    }
  ];

  // 3. State & DOM References
  let wishlist = JSON.parse(localStorage.getItem("saniya_archive_wishlist")) || [];
  let currentFilterState = {
    search: "",
    category: "all",
    status: "all",
    showOnlyWishlist: false
  };

  const gridContainer = document.getElementById("destinations-grid");
  const atlasLayer = document.getElementById("atlas-markers-layer");
  const emptyState = document.getElementById("empty-state");
  const countDisplay = document.getElementById("total-destinations-count");
  
  const searchInput = document.getElementById("search-input");
  const catFilter = document.getElementById("category-filter");
  const statusFilter = document.getElementById("status-filter");
  const toggleWishlistBtn = document.getElementById("toggle-wishlist-btn");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");

  const detailOverlay = document.getElementById("destination-detail-overlay");
  const detailContent = document.getElementById("detail-content-area");
  const closeDetailBtn = document.getElementById("close-detail-btn");

  // Helper: Status to Badge Mapping
  function getStatusBadge(status) {
    const map = {
      "approved": { label: "APPROVED", class: "badge--approved" },
      "wishlist": { label: "ON THE WISHLIST", class: "badge--pending" }, // Gold
      "pending": { label: "CLEARANCE PENDING", class: "badge--pending" },
      "uncharted": { label: "UNCHARTED", class: "" }, // Default ink
      "unlimited": { label: "UNLIMITED ACCESS", class: "badge--verified" },
      "classified": { label: "CLASSIFIED", class: "badge--classified" }
    };
    const mapped = map[status] || { label: status.toUpperCase(), class: "" };
    return `<span class="badge ${mapped.class}">${mapped.label}</span>`;
  }

  // Helper: Status to Stamp Mapping
  function getStatusStamp(status) {
    const map = {
      "approved": `<div class="stamp stamp--rect stamp--red stamp--r2 stamp--press"><span class="stamp__main">APPROVED</span></div>`,
      "pending": `<div class="stamp stamp--rect stamp--black stamp--r1 stamp--press"><span class="stamp__main">PENDING</span></div>`,
      "wishlist": `<div class="stamp stamp--round stamp--gold stamp--r3 stamp--press"><span class="stamp__stars"></span><span class="stamp__main">WISHLIST</span><span class="stamp__stars"></span></div>`,
      "unlimited": `<div class="stamp stamp--oval stamp--teal stamp--r4 stamp--press"><span class="stamp__main">ACCESS GRANTED</span></div>`,
      "uncharted": `<div class="stamp stamp--rect stamp--red stamp--r2 stamp--press"><span class="stamp__main">UNCHARTED</span></div>`,
      "classified": `<div class="stamp stamp--rect stamp--red stamp--r1 stamp--press"><span class="stamp__main">CLASSIFIED</span></div>`
    };
    return map[status] || '';
  }

  // 4. Rendering Functions
  function renderView() {
    // Apply filters
    const filteredData = destinationData.filter(dest => {
      const matchSearch = dest.name.toLowerCase().includes(currentFilterState.search.toLowerCase()) || 
                          dest.description.toLowerCase().includes(currentFilterState.search.toLowerCase());
      const matchCat = currentFilterState.category === "all" || dest.category === currentFilterState.category;
      const matchStatus = currentFilterState.status === "all" || dest.status === currentFilterState.status;
      const matchWishlist = !currentFilterState.showOnlyWishlist || wishlist.includes(dest.id);
      
      return matchSearch && matchCat && matchStatus && matchWishlist;
    });

    countDisplay.textContent = filteredData.length.toString().padStart(2, '0');

    if (filteredData.length === 0) {
      gridContainer.innerHTML = "";
      atlasLayer.innerHTML = "";
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    // Render Grid
    gridContainer.innerHTML = filteredData.map(dest => {
      const isSaved = wishlist.includes(dest.id);
      
      return `
        <article class="${dest.cardStyle} dest-card lift" data-id="${dest.id}" tabindex="0" role="button">
          <div class="dest-card-header flex-between">
            <span class="t-meta text-muted">${dest.referenceNumber}</span>
            <button class="wishlist-icon ${isSaved ? 'is-saved' : ''}" aria-label="${isSaved ? 'Remove from wishlist' : 'Save to wishlist'}" data-id="${dest.id}"></button>
          </div>
          <div class="dest-card-body pointer-events-none">
            <h3 class="card__title">${dest.name}</h3>
            <p class="t-label t-accent mt-1" style="font-size: 0.65rem;">${dest.categoryLabel}</p>
            <p class="t-body-sm mt-3">${dest.description}</p>
          </div>
          <div class="dest-card-footer pointer-events-none">
            ${getStatusBadge(dest.status)}
          </div>
        </article>
      `;
    }).join("");

    // Render Atlas Markers
    atlasLayer.innerHTML = filteredData.map(dest => `
      <div class="atlas-marker" style="left: ${dest.mapCoords.x}%; top: ${dest.mapCoords.y}%;" data-id="${dest.id}" tabindex="0" role="button" aria-label="Map marker for ${dest.name}">
        <div class="atlas-tooltip">${dest.name}</div>
      </div>
    `).join("");
  }

  function renderDetail(id) {
    const dest = destinationData.find(d => d.id === id);
    if (!dest) return;

    // Build the miniature permit
    const permitHtml = `
      <div class="travel-permit mt-6">
        <header class="doc-header mb-4" style="padding-bottom: var(--sp-2);">
          <span class="icon icon--plane" aria-hidden="true" style="font-size: 1.5rem;"></span>
          <h4 class="t-doc font-bold mt-2">Int. Destination Authorization</h4>
          <p class="t-meta">PERMIT NO. ${dest.referenceNumber}</p>
        </header>
        
        <div class="grid grid--2" style="gap: var(--sp-4);">
          <div class="stack stack--sm">
            <div class="doc-field"><span class="doc-field__label">HOLDER</span><span class="doc-field__value doc-field__value--typed">SANIYA</span></div>
            <div class="doc-field"><span class="doc-field__label">DESTINATION</span><span class="doc-field__value doc-field__value--typed" style="font-size:0.8rem;">${dest.name.toUpperCase()}</span></div>
            <div class="doc-field"><span class="doc-field__label">CLEARANCE</span><span class="doc-field__value doc-field__value--typed t-accent">${dest.status.toUpperCase()}</span></div>
            <div class="doc-field"><span class="doc-field__label">ISSUING AUTH.</span><span class="doc-field__value doc-field__value--typed">I.D.U.A</span></div>
          </div>
          
          <div class="flex-between" style="flex-direction: column; align-items: flex-end;">
             <div class="seal seal--sm" aria-hidden="true" style="transform: scale(0.8);"><span class="icon icon--compass seal__mark"></span></div>
             <div class="stamp-wrap" style="position:relative; width: 100%; height: 4rem; display: flex; justify-content:flex-end;">
               ${getStatusStamp(dest.status)}
             </div>
             <p class="t-label text-muted mt-2">ISSUE YR: 2026</p>
          </div>
        </div>
      </div>
    `;

    // Construct full page
    detailContent.innerHTML = `
      <div class="grid grid--2" style="gap: var(--sp-7); align-items: start;">
        
        <div class="detail-left stack stack--lg">
          <div>
            <p class="t-eyebrow mb-2">Destination Record // ${dest.categoryLabel}</p>
            <h2 class="t-display">${dest.name}</h2>
            <p class="t-meta text-muted mt-2">REF: ${dest.referenceNumber} | LOC: ${dest.location}</p>
            <div class="mt-4">${getStatusBadge(dest.status)}</div>
          </div>
          
          <div class="divider divider--dotted"></div>
          
          <div>
            <h3 class="t-label t-accent mb-2">Travel Notes</h3>
            <p class="t-body prose">${dest.longDescription}</p>
            ${dest.isFictional ? `<p class="t-note mt-4">Note: This location exists purely within the imaginary coordinates of the archive.</p>` : ''}
          </div>
        </div>

        <div class="detail-right">
          <h3 class="t-label t-accent mb-3">Travel Authorization</h3>
          ${permitHtml}
          
          <div class="surface-distressed border-ink p-4 mt-6 frame-corners">
            <h4 class="t-label mb-2">Additional Details</h4>
            <p class="t-doc text-muted">Awaiting physical memories, photographs, or official field reports from the traveler to update this dossier.</p>
          </div>
        </div>

      </div>
    `;

    // Update wishlist button in header
    const detailWishBtn = document.getElementById("detail-wishlist-btn");
    const isSaved = wishlist.includes(dest.id);
    detailWishBtn.innerHTML = isSaved ? "★ Remove from Wishlist" : "☆ Save to Wishlist";
    detailWishBtn.dataset.id = dest.id;
    if (isSaved) detailWishBtn.classList.add("t-accent");
    else detailWishBtn.classList.remove("t-accent");

    // Show overlay
    detailOverlay.hidden = false;
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Trigger stamp animations inside the modal
    setTimeout(() => {
      const stamps = detailContent.querySelectorAll(".stamp--press");
      stamps.forEach(s => s.classList.add("is-stamped"));
    }, 50);
  }

  function closeDetail() {
    detailOverlay.hidden = true;
    document.body.style.overflow = "";
    detailContent.innerHTML = "";
  }

  function toggleWishlist(id) {
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(item => item !== id);
    } else {
      wishlist.push(id);
    }
    localStorage.setItem("saniya_archive_wishlist", JSON.stringify(wishlist));
    renderView(); // Re-render to update stars and filters
    
    // If detail modal is open, update its button too
    if (!detailOverlay.hidden) {
      const btn = document.getElementById("detail-wishlist-btn");
      if (btn && btn.dataset.id === id) {
        const isSaved = wishlist.includes(id);
        btn.innerHTML = isSaved ? "★ Remove from Wishlist" : "☆ Save to Wishlist";
        if (isSaved) btn.classList.add("t-accent");
        else btn.classList.remove("t-accent");
      }
    }
  }

  function resetFilters() {
    searchInput.value = "";
    catFilter.value = "all";
    statusFilter.value = "all";
    currentFilterState.showOnlyWishlist = false;
    toggleWishlistBtn.innerHTML = "★ Show Favourites";
    toggleWishlistBtn.classList.remove("btn--primary");
    toggleWishlistBtn.classList.add("btn--secondary");
    
    updateFilterState();
  }

  function updateFilterState() {
    currentFilterState.search = searchInput.value;
    currentFilterState.category = catFilter.value;
    currentFilterState.status = statusFilter.value;
    renderView();
  }

  // 5. Event Listeners
  searchInput.addEventListener("input", updateFilterState);
  catFilter.addEventListener("change", updateFilterState);
  statusFilter.addEventListener("change", updateFilterState);
  
  toggleWishlistBtn.addEventListener("click", () => {
    currentFilterState.showOnlyWishlist = !currentFilterState.showOnlyWishlist;
    if (currentFilterState.showOnlyWishlist) {
      toggleWishlistBtn.innerHTML = "★ Viewing Favourites";
      toggleWishlistBtn.classList.remove("btn--secondary");
      toggleWishlistBtn.classList.add("btn--primary");
    } else {
      toggleWishlistBtn.innerHTML = "★ Show Favourites";
      toggleWishlistBtn.classList.remove("btn--primary");
      toggleWishlistBtn.classList.add("btn--secondary");
    }
    renderView();
  });

  clearFiltersBtn.addEventListener("click", resetFilters);
  closeDetailBtn.addEventListener("click", closeDetail);

  // Detail Wishlist Button
  document.getElementById("detail-wishlist-btn").addEventListener("click", function() {
    toggleWishlist(this.dataset.id);
  });

  // Event Delegation for Grid Cards and Wishlist Icons
  gridContainer.addEventListener("click", (e) => {
    // Check if clicked the star icon
    if (e.target.classList.contains("wishlist-icon")) {
      e.stopPropagation();
      toggleWishlist(e.target.dataset.id);
      return;
    }
    // Check if clicked a card
    const card = e.target.closest(".dest-card");
    if (card) {
      renderDetail(card.dataset.id);
    }
  });

  // Event Delegation for Atlas Markers
  atlasLayer.addEventListener("click", (e) => {
    const marker = e.target.closest(".atlas-marker");
    if (marker) {
      // Highlight momentarily, then open
      document.querySelectorAll(".atlas-marker").forEach(m => m.classList.remove("is-active"));
      marker.classList.add("is-active");
      setTimeout(() => renderDetail(marker.dataset.id), 200);
    }
  });

  // Keyboard accessibility for cards and markers
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (document.activeElement.classList.contains("dest-card") || 
          document.activeElement.classList.contains("atlas-marker")) {
        e.preventDefault();
        renderDetail(document.activeElement.dataset.id);
      }
    }
    if (e.key === "Escape" && !detailOverlay.hidden) {
      closeDetail();
    }
  });

  // 6. Initialization
  document.addEventListener("DOMContentLoaded", () => {
    renderView();
    
    // Re-initialize scroll reveal for dynamic content
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
    }
  });

})();
