/* THE SANIYA ARCHIVE — soundtrack.js
   Stage 07: Soundtrack Archive Logic
   Handles the Mixtape Data, YouTube API Integration, and Cassette Interactions. */

(function () {
  "use strict";

  // Reveal JS Interface
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  // 1. DATA ARCHITECTURE: The Unplanned Journey Tracklist
  // Sourced verbatim from provided project context.
  // Note: youtubeId placeholders are used here. To make audio play, replace with actual YouTube video IDs.
  const tracklist = [
    // SIDE A[cite: 9]
    {
      id: "trk-01",
      trackNumber: 1,
      side: "A",
      title: "Safarnama FULL AUDIO Song",
      artist: "Ranbir Kapoor, Deepika Padukone | T-Series",
      album: "Tamasha",
      description: "A track for the beginning of an unexpectedly good day.",
      youtubeId: "sOhESxhibAM" // Example standard ID to prevent API crash, replace freely.
    },
    {
      id: "trk-02",
      trackNumber: 2,
      side: "A",
      title: "ROCKSTAR: Phir Se Ud Chala (Full Song)",
      artist: "Ranbir Kapoor, Nargis Fakhri | A.R. Rahman, Mohit Chauhan",
      album: "Rockstar",
      description: "For the journey that takes longer than expected, but feels exactly right.",
      youtubeId: "2mWaqsC3U7k"
    },
    {
      id: "trk-03",
      trackNumber: 3,
      side: "A",
      title: "Shiv Kailashon Ke Vasi",
      artist: "LAMAN | Bhole Baba | Official song | Folk Himachal",
      album: "Folk Himachal",
      description: "A grounded, traditional rhythm to center the mind during long stretches of road.",
      youtubeId: "BArlCOQ__ug"
    },
    {
      id: "trk-04",
      trackNumber: 4,
      side: "A",
      title: "Highway: \"Maahi Ve\" Full Song with lyrics",
      artist: "Alia Bhatt, Randeep Hooda | A.R Rahman",
      album: "Highway",
      description: "A soundtrack for the places that stay in your mind long after you leave.",
      youtubeId: "PLACEHOLDER_04"
    },
    {
      id: "trk-05",
      trackNumber: 5,
      side: "A",
      title: "Shiv kailasho ke Vasi || Official Music Video",
      artist: "Hansraj Raghuwanshi || Baba Ji",
      album: "Independent",
      description: "Echoes of the mountains, curated for high altitudes and quiet spaces.",
      youtubeId: "PLACEHOLDER_05"
    },
    {
      id: "trk-06",
      trackNumber: 6,
      side: "A",
      title: "Ilahi Full Video Song",
      artist: "Ranbir Kapoor, Deepika Padukone | Pritam",
      album: "Yeh Jawaani Hai Deewani",
      description: "The definitive anthem for walking through unfamiliar streets.",
      youtubeId: "PLACEHOLDER_06"
    },
    {
      id: "trk-07",
      trackNumber: 7,
      side: "A",
      title: "Dil Beparvah (feat. Dhruv Bhola, Nikhil Vasudevan)",
      artist: "Ankur Tewari (The Dewarists, Season 5)",
      album: "The Dewarists",
      description: "An acoustic detour for when the original itinerary falls apart beautifully.",
      youtubeId: "PLACEHOLDER_07"
    },
    {
      id: "trk-08",
      trackNumber: 8,
      side: "A",
      title: "Journey Song Full Audio",
      artist: "Amitabh Bachchan, Irrfan Khan & Deepika Padukone",
      album: "Piku",
      description: "Light, rolling rhythms suited for staring out of passenger side windows.",
      youtubeId: "PLACEHOLDER_08"
    },
    {
      id: "trk-09",
      trackNumber: 9,
      side: "A",
      title: "Patakha Guddi Highway Full Video Song",
      artist: "A.R Rahman | Alia Bhatt, Randeep Hooda",
      album: "Highway",
      description: "High energy momentum. Do not listen while attempting to abide by speed limits.",
      youtubeId: "PLACEHOLDER_09"
    },
    {
      id: "trk-10",
      trackNumber: 10,
      side: "A",
      title: "Mohit Chauhan - Babaji",
      artist: "Universal Music India",
      album: "Independent",
      description: "Wrapping up the first leg of the journey. Time to flip the tape.",
      youtubeId: "PLACEHOLDER_10"
    },
    // SIDE B[cite: 10]
    {
      id: "trk-11",
      trackNumber: 11,
      side: "B",
      title: "Papon - Banao Banao",
      artist: "GoMADFestival",
      album: "Live Session",
      description: "A relaxed, acoustic re-entry for the quieter part of the journey.",
      youtubeId: "PLACEHOLDER_11"
    },
    {
      id: "trk-12",
      trackNumber: 12,
      side: "B",
      title: "Yun Hi Chala Chal Lyrical Video",
      artist: "A.R. Rahman | Javed Akhtar | Udit Narayan",
      album: "Swades",
      description: "For recognizing that the act of moving is often better than arriving.",
      youtubeId: "PLACEHOLDER_12"
    },
    {
      id: "trk-13",
      trackNumber: 13,
      side: "B",
      title: "Banjarey Full Audio Song",
      artist: "Yo Yo Honey Singh",
      album: "Fugly",
      description: "One of those distinct tracks you don't skip when driving late at night.",
      youtubeId: "PLACEHOLDER_13"
    },
    {
      id: "trk-14",
      trackNumber: 14,
      side: "B",
      title: "Gaurav Pandey - Back Home To The Mountains",
      artist: "gauravpandeymusic",
      album: "Official Music Video",
      description: "A homeward bound reflection, specifically tailored for the descent.",
      youtubeId: "PLACEHOLDER_14"
    },
    {
      id: "trk-15",
      trackNumber: 15,
      side: "B",
      title: "Arijit Singh: Chota Sa Fasana Video Song",
      artist: "Irrfan Khan | DulQuer Salmaan",
      album: "Karwaan",
      description: "A brief, beautiful chapter in an otherwise long and winding narrative.",
      youtubeId: "PLACEHOLDER_15"
    },
    {
      id: "trk-16",
      trackNumber: 16,
      side: "B",
      title: "Khaabon Ke Parinday (Full video song)",
      artist: "Hrithik Roshan, Katrina Kaif",
      album: "Zindagi Na Milegi Dobara",
      description: "Atmospheric and airy. Highly recommended for early morning departures.",
      youtubeId: "PLACEHOLDER_16"
    },
    {
      id: "trk-17",
      trackNumber: 17,
      side: "B",
      title: "Full Video:Aao Milo Chalen",
      artist: "Shahid Kapoor, Kareena Kapoor|Pritam, Shaan",
      album: "Jab We Met",
      description: "A collective invitation to abandon the map entirely.",
      youtubeId: "PLACEHOLDER_17"
    },
    {
      id: "trk-18",
      trackNumber: 18,
      side: "B",
      title: "Saansein Lyrical Song",
      artist: "Irrfan Khan, Dulquer Salmaan, Mithila Palkar | Prateek Kuhad",
      album: "Karwaan",
      description: "Gentle pacing. The audible equivalent of taking a deep breath of fresh air.",
      youtubeId: "PLACEHOLDER_18"
    },
    {
      id: "trk-19",
      trackNumber: 19,
      side: "B",
      title: "Theher Ja | October",
      artist: "Varun Dhawan & Banita Sandhu | Armaan Malik",
      album: "October",
      description: "A momentary pause in the itinerary to simply observe the surroundings.",
      youtubeId: "PLACEHOLDER_19"
    },
    {
      id: "trk-20",
      trackNumber: 20,
      side: "B",
      title: "Full Video: Yeh Ishq Hai",
      artist: "Kareena Kapoor, Shahid Kapoor | Pritam | Shreya Ghoshal",
      album: "Jab We Met",
      description: "The final track, but certainly not the end of the story.",
      youtubeId: "PLACEHOLDER_20"
    }
  ];

  // 2. Global State & DOM
  let currentTrackIndex = 0;
  let isPlaying = false;
  let player; // YouTube Player Instance
  
  const cassetteVisual = document.getElementById("cassette-visual");
  const cassetteStatus = document.getElementById("cassette-status");
  const playIcon = document.getElementById("play-icon");
  
  const noteTitle = document.getElementById("note-title");
  const noteArtist = document.getElementById("note-artist");
  const noteDescription = document.getElementById("note-description");
  const trackIdBadge = document.getElementById("track-id-badge");
  const externalLinkBtn = document.getElementById("external-link-btn");
  
  const tracklistSideA = document.getElementById("tracklist-side-a");
  const tracklistSideB = document.getElementById("tracklist-side-b");

  // 3. Render Tracklist
  function renderTracklist() {
    let htmlA = "";
    let htmlB = "";

    tracklist.forEach((track, index) => {
      const trackHtml = `
        <li class="track-item" data-index="${index}" role="button" tabindex="0" aria-label="Play ${track.title}">
          <span class="track-number">${track.trackNumber}.</span>
          <div class="track-details">
            <span class="track-title">${track.title}</span>
            <span class="track-artist">${track.artist}</span>
          </div>
        </li>
      `;
      if (track.side === "A") htmlA += trackHtml;
      else htmlB += trackHtml;
    });

    tracklistSideA.innerHTML = htmlA;
    tracklistSideB.innerHTML = htmlB;

    // Bind clicks
    document.querySelectorAll(".track-item").forEach(item => {
      item.addEventListener("click", function() {
        selectTrack(parseInt(this.dataset.index), true);
      });
      item.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectTrack(parseInt(this.dataset.index), true);
        }
      });
    });
  }

  // 4. Track Selection & UI Updates
  function selectTrack(index, autoPlay = false) {
    if (index < 0) index = tracklist.length - 1;
    if (index >= tracklist.length) index = 0;
    
    currentTrackIndex = index;
    const track = tracklist[currentTrackIndex];

    // Highlight active list item
    document.querySelectorAll(".track-item").forEach(el => el.classList.remove("is-active"));
    const activeEl = document.querySelector(`.track-item[data-index="${index}"]`);
    if (activeEl) {
      activeEl.classList.add("is-active");
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Update Listening Notes
    noteTitle.textContent = track.title;
    noteArtist.textContent = track.artist;
    noteDescription.textContent = track.description;
    trackIdBadge.textContent = track.id.toUpperCase();
    
    externalLinkBtn.style.display = "inline-flex";
    externalLinkBtn.href = `https://www.youtube.com/watch?v=${track.youtubeId}`;

    // Update Cassette Tape Label
    cassetteStatus.textContent = `TTC-TRK: ${track.trackNumber} / SIDE ${track.side}`;

    // Trigger YouTube Player
    if (player && player.loadVideoById) {
      if (autoPlay) {
        player.loadVideoById(track.youtubeId);
      } else {
        player.cueVideoById(track.youtubeId);
      }
    } else {
      // Fallback if API hasn't loaded yet
      if (autoPlay) setPlaybackState(true);
    }
  }

  // 5. Playback Visual State Management
  function setPlaybackState(playing) {
    isPlaying = playing;
    if (isPlaying) {
      cassetteVisual.classList.add("is-playing");
      playIcon.textContent = "⏸";
    } else {
      cassetteVisual.classList.remove("is-playing");
      playIcon.textContent = "▶";
    }
  }

  function togglePlayPause() {
    if (!player || !player.getPlayerState) {
      // API fallback
      setPlaybackState(!isPlaying);
      return;
    }
    
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  // 6. YouTube IFrame API Initialization
  // This function is automatically called by the YT API script once loaded.
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player-container', {
      height: '1',
      width: '1',
      videoId: tracklist[0].youtubeId,
      playerVars: {
        'playsinline': 1,
        'controls': 0,
        'disablekb': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });
  };

  function onPlayerReady(event) {
    // Select the first track but do not autoplay (respecting copyright/ux rules)
    selectTrack(0, false);
  }

  function onPlayerStateChange(event) {
    // Sync physical cassette reels to actual digital playback
    if (event.data === YT.PlayerState.PLAYING) {
      setPlaybackState(true);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.CUED) {
      setPlaybackState(false);
    } else if (event.data === YT.PlayerState.ENDED) {
      setPlaybackState(false);
      // Auto-advance
      selectTrack(currentTrackIndex + 1, true);
    }
  }

  function onPlayerError(event) {
    console.warn("YouTube Playback Error. Proceeding to next track.", event.data);
    // Graceful error handling for missing/restricted videos
    cassetteStatus.textContent = "ERROR: SIGNAL LOST";
    setPlaybackState(false);
    setTimeout(() => {
      selectTrack(currentTrackIndex + 1, true);
    }, 2500);
  }

  // 7. Event Listeners for Controls
  document.getElementById("btn-play-pause").addEventListener("click", togglePlayPause);
  
  document.getElementById("btn-prev").addEventListener("click", () => {
    selectTrack(currentTrackIndex - 1, true);
  });
  
  document.getElementById("btn-next").addEventListener("click", () => {
    selectTrack(currentTrackIndex + 1, true);
  });

  // 8. Easter Egg Button
  document.getElementById("btn-eject").addEventListener("click", () => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    
    // Check if toast already exists
    if (container.children.length > 0) return;

    const toast = document.createElement("div");
    toast.className = "system-toast";
    toast.textContent = "CLASSIFIED: ESSENTIAL TRAVEL EQUIPMENT. DO NOT REMOVE.";
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 4000);
  });

  // 9. Initialization
  document.addEventListener("DOMContentLoaded", () => {
    renderTracklist();
  });

})();
