(() => {
  const track = document.getElementById("timelineTrack");
  const popover = document.getElementById("timelinePopover");
  const popoverText = document.getElementById("timelinePopoverText");
  const popoverImg = document.getElementById("timelinePopoverImg");


  const cta = document.getElementById("timelineCTA");

  const phase2 = document.getElementById("phase2");
  const phase3 = document.getElementById("phase3");

  const points = Array.from(document.querySelectorAll(".timeline-point"));

  const POINTS = [
    {
      text: `I went from thank fck she's not a catfish,
to oh sht she's acc pretty
to oh sht idk what to say
to thank fck she's a yapper
to oh I'm really enjoying spending time with her
to I gotta stay awake!
(*≧ω≦)`,
    },
    {
      text: "I already know how to write your name",
      image: "assets/phase2/huanyi.jpg",
    },
    { text: "You already liked food I made^" },
    { text: "I haven't ragebaited you on overcooked yet" },
    {
      text: "I need to boost your acs",
      image: "assets/phase2/24acs.JPG",
    },
    { text: "I'm using my computer science for a valentines date ㅠㅠ" },
    {
      text: `My bad we met on Hinge
we can make up a new origin story together`,
    },
    { text: "Time for the big question..." },
  ];

  let currentIndex = 0;

  function centerPoint(pointEl) {
    const viewport = document.querySelector(".timeline-viewport");

    const pointRect = pointEl.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    const pointCenter = pointRect.left + pointRect.width / 2;
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    const delta = viewportCenter - pointCenter;

    const currentTransform = track.style.transform;
    const match = currentTransform.match(/translateX\((-?\d+\.?\d*)px\)/);
    const currentX = match ? parseFloat(match[1]) : 0;

    track.style.transform = `translateX(${currentX + delta}px)`;
  }

  function showBubble(index) {
    const point = POINTS[index];
    if (!point) return;

    popoverText.textContent = point.text;

    if (point.image) {
      popoverImg.src = point.image;
      popover.classList.remove("no-image");
    } else {
      popoverImg.src = "";
      popover.classList.add("no-image");
    }

    popover.classList.remove("hidden", "show");
    void popover.offsetWidth; // restart animation
    popover.classList.add("show");
  }


  function goToIndex(index) {
    const clamped = Math.max(0, Math.min(index, POINTS.length - 1));
    currentIndex = clamped;

    // highlight active
    points.forEach(p => p.classList.remove("active"));

    const target = points.find(p => Number(p.dataset.index) === clamped);
    if (!target) return;

    target.classList.add("active");
    centerPoint(target);
    const rect = target.getBoundingClientRect();
    const viewportRect = document
      .querySelector(".timeline-viewport")
      .getBoundingClientRect();

    showBubble(clamped);
  }

  points.forEach(pointEl => {
    pointEl.addEventListener("click", () => {
      const index = Number(pointEl.dataset.index);
      goToIndex(index);
    });
  });


  cta.addEventListener("click", () => {
    phase2.classList.remove("screen--active");
    phase3.classList.add("screen--active");

    requestAnimationFrame(() => {
      window.initPhase3();
    });
  });

  // optional: start on first point
  goToIndex(0);
})();
