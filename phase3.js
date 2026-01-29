(() => {
  const phase3 = document.getElementById("phase3");

  if (!phase3.classList.contains("screen--active")) {
    // Do nothing until explicitly activated
  }


  const success = document.getElementById("success");

  const stage = document.getElementById("buttonStage");
  const questionText = document.getElementById("questionText");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  // --- Config (aggressive by design) ---
  const TAUNTS = [
    "We’ve talked about this.",
    "This is getting suspicious.",
    "Okay now you’re just lying.",
    "Be serious.",
    "That button is for decoration.",
    "You’re running out of excuses."
  ];

  // Safe padding around YES so NO never overlaps it
  const SAFE_PADDING = 22;

  // Round feel: pause after click No
  const RESET_PAUSE_MS = 420;

  // Aggressive scaling:
  // By ~5 resets, YES is huge.
  const YES_SCALE_MULT = 1.55; // per round
  const NO_SCALE_MULT = 0.78;  // per round
  const SPEED_MULT = 1.2;     // per round

  // --- State ---
  const state = {
    round: 0,
    running: false,      // animation loop active (this round)
    paused: false,       // reset pause
    hoveredOnce: false,  // only need hover to start each round
    lastTs: 0,

    // No button motion (position is in stage-local pixels)
    no: {
      x: 0,
      y: 0,
      vx: 320, // px/s baseline (will be scaled)
      vy: 210,
      w: 0,
      h: 0
    },

    // scales applied via transform
    yesScale: 1,
    noScale: 1,
    speedScale: 1
  };

  // --- Helpers ---
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function rectsIntersect(a, b) {
    return !(
      a.x + a.w <= b.x ||
      a.x >= b.x + b.w ||
      a.y + a.h <= b.y ||
      a.y >= b.y + b.h
    );
  }

  function getStageRect() {
    return stage.getBoundingClientRect();
  }

  function getYesSafeRectStageLocal() {
    const stageRect = getStageRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const x = (yesRect.left - stageRect.left) - SAFE_PADDING;
    const y = (yesRect.top - stageRect.top) - SAFE_PADDING;
    const w = yesRect.width + SAFE_PADDING * 2;
    const h = yesRect.height + SAFE_PADDING * 2;

    return { x, y, w, h };
  }

  function measureNo() {
    // getBoundingClientRect reflects transform scales; we want actual drawn size
    const r = noBtn.getBoundingClientRect();
    const s = getStageRect();
    state.no.w = r.width;
    state.no.h = r.height;

    // Keep x/y within stage bounds after any scaling changes
    state.no.x = clamp(state.no.x, 0, s.width - state.no.w);
    state.no.y = clamp(state.no.y, 0, s.height - state.no.h);
  }

  function applyScales() {
    yesBtn.style.transform = `scale(${state.yesScale})`;
    noBtn.style.transform = `scale(${state.noScale})`;
    measureNo();
  }

  function centerButtons() {
    const stageRect = stage.getBoundingClientRect();

    // Measure buttons (no transforms involved)
    const yesRect = yesBtn.getBoundingClientRect();
    const noRect  = noBtn.getBoundingClientRect();

    // Center YES
    const yesX = (stageRect.width - yesRect.width) / 2;
    const yesY = (stageRect.height - yesRect.height) / 2;

    yesBtn.style.left = `${yesX}px`;
    yesBtn.style.top  = `${yesY}px`;

    // Place NO to the right of YES
    const gap = 24;
    state.no.x = yesX + yesRect.width + gap;
    state.no.y = yesY;

    noBtn.style.left = `${state.no.x}px`;
    noBtn.style.top  = `${state.no.y}px`;
  }





  function setTaunt() {
    // round 0 keeps original question; from round 1 onward rotate taunts
    if (state.round === 0) {
      questionText.textContent = "Will you be my Valentine?";
      return;
    }
    const idx = (state.round - 1) % TAUNTS.length;
    questionText.textContent = TAUNTS[idx];
  }


  function resetRoundVisual() {
    state.running = false;
    state.paused = true;
    state.hoveredOnce = false;

    setTaunt();
    centerButtons();

    setTimeout(() => {
      applyScales();      // 👈 APPLY NEW SCALES HERE
      state.paused = false;
    }, RESET_PAUSE_MS);
  }


  function escalate() {
    state.round += 1;

    state.yesScale *= YES_SCALE_MULT;
    state.noScale *= NO_SCALE_MULT;
    state.speedScale *= SPEED_MULT;

    // Clamp NO so it never becomes unusably tiny
    state.noScale = Math.max(state.noScale, 0.20);

    // Make YES absurd by ~5 resets (as requested)
    // No clamp on YES—this is the point.
  }

  function startMotionIfAllowed() {
    if (state.paused) return;
    if (state.running) return;

    state.running = true;
    state.lastTs = 0;

    // Randomize direction a bit each time motion starts (feels less robotic)
    const dirX = Math.random() < 0.5 ? -1 : 1;
    const dirY = Math.random() < 0.5 ? -1 : 1;
    state.no.vx = Math.abs(state.no.vx) * dirX;
    state.no.vy = Math.abs(state.no.vy) * dirY;
  }

  // Push NO out of the YES safe area without teleporting:
  // reflect velocity and nudge by minimal overlap direction.
  function resolveSafeZoneCollision(noRect, safeRect) {
    if (!rectsIntersect(noRect, safeRect)) return;

    // Compute overlaps on each axis
    const overlapLeft = (noRect.x + noRect.w) - safeRect.x;
    const overlapRight = (safeRect.x + safeRect.w) - noRect.x;
    const overlapTop = (noRect.y + noRect.h) - safeRect.y;
    const overlapBottom = (safeRect.y + safeRect.h) - noRect.y;

    // Minimal push direction
    const minX = Math.min(overlapLeft, overlapRight);
    const minY = Math.min(overlapTop, overlapBottom);

    if (minX < minY) {
      // push in x
      if (overlapLeft < overlapRight) {
        state.no.x -= overlapLeft;
      } else {
        state.no.x += overlapRight;
      }
      state.no.vx *= -1;
    } else {
      // push in y
      if (overlapTop < overlapBottom) {
        state.no.y -= overlapTop;
      } else {
        state.no.y += overlapBottom;
      }
      state.no.vy *= -1;
    }
  }

  function tick(ts) {
    requestAnimationFrame(tick);

    if (!state.running || state.paused) return;

    if (!state.lastTs) state.lastTs = ts;
    const dt = (ts - state.lastTs) / 1000;
    state.lastTs = ts;

    const s = getStageRect();
    const safe = getYesSafeRectStageLocal();

    // Update “No” motion
    const speed = state.speedScale;
    state.no.x += state.no.vx * speed * dt;
    state.no.y += state.no.vy * speed * dt;

    // Boundary bounce
    if (state.no.x <= 0) {
      state.no.x = 0;
      state.no.vx *= -1;
    }
    if (state.no.x + state.no.w >= s.width) {
      state.no.x = s.width - state.no.w;
      state.no.vx *= -1;
    }
    if (state.no.y <= 0) {
      state.no.y = 0;
      state.no.vy *= -1;
    }
    if (state.no.y + state.no.h >= s.height) {
      state.no.y = s.height - state.no.h;
      state.no.vy *= -1;
    }

    // Avoid YES safe zone
    const noRect = { x: state.no.x, y: state.no.y, w: state.no.w, h: state.no.h };
    resolveSafeZoneCollision(noRect, safe);

    // Apply
    noBtn.style.left = `${state.no.x}px`;
    noBtn.style.top = `${state.no.y}px`;
  }

  // --- Events ---
  noBtn.addEventListener("mouseenter", () => {
    if (state.paused) return;
    if (!state.hoveredOnce) {
      state.hoveredOnce = true;
      startMotionIfAllowed();
    } else {
      // If already hovered once, still ensure motion continues
      startMotionIfAllowed();
    }
  });

  // Each click on NO resets + escalates
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Stop motion immediately so reset feels clean
    state.running = false;

    escalate();
    resetRoundVisual();
  });

  // YES always clickable, never moves; click -> phase 4
  yesBtn.addEventListener("click", () => {
    phase3.classList.remove("screen--active");
    success.classList.add("screen--active");
  });

  // Handle resize: keep everything valid and NO not inside safe zone
  window.addEventListener("resize", () => {
    applyScales();
    centerButtons();
  });

  // --- Init ---
  function init() {
    setTaunt();
    centerButtons();   
    applyScales();     
    requestAnimationFrame(tick);
  }
  


  window.initPhase3 = init;
})();
