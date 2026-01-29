(() => {
  const track = document.getElementById("timelineTrack");
  const bubble = document.getElementById("timelineBubble");
  const points = Array.from(document.querySelectorAll(".timeline-point"));

  const prevBtn = document.getElementById("timelinePrev");
  const nextBtn = document.getElementById("timelineNext");
  const cta = document.getElementById("timelineCTA");
  const phase2 = document.getElementById("phase2");
  const phase3 = document.getElementById("phase3");

    cta.addEventListener("click", () => {
        phase2.classList.remove("screen--active");
        phase3.classList.add("screen--active");

        requestAnimationFrame(() => {
            window.initPhase3(); // positions buttons correctly
        });
    });




  let currentIndex = 0;

  const TEXT = [
    "This day was lowkey one of my favourites.",
    "You made this way more fun than it should’ve been.",
    "Still think about this sometimes.",
    "Okay… time for the big question."
  ];

  function centerPoint(point) {
    const viewport = document.querySelector(".timeline-viewport");

    const pointRect = point.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    const pointCenter =
        pointRect.left + pointRect.width / 2;

    const viewportCenter =
        viewportRect.left + viewportRect.width / 2;

    const delta = viewportCenter - pointCenter;

    // read current translateX
    const currentTransform = track.style.transform;
    const match = currentTransform.match(/translateX\((-?\d+\.?\d*)px\)/);
    const currentX = match ? parseFloat(match[1]) : 0;

    const nextX = currentX + delta;

    track.style.transform = `translateX(${nextX}px)`;
    }


  function showBubble(index) {
    bubble.textContent = TEXT[index];

    bubble.classList.remove("show");
    void bubble.offsetWidth;
    bubble.classList.add("show");
    bubble.classList.remove("hidden");

    // Show CTA only on final point
    if (index === points.length - 1) {
        cta.classList.remove("hidden");
        requestAnimationFrame(() => cta.classList.add("show"));
    } else {
        cta.classList.remove("show");
        cta.classList.add("hidden");
    }
    }



  points.forEach(point => {
    point.addEventListener("click", () => {
        const index = Number(point.dataset.index);

        // remove previous active
        points.forEach(p => p.classList.remove("active"));

        // set new active
        point.classList.add("active");

        currentIndex = index;
        centerPoint(point);
        showBubble(index);
    });
    });


  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateTrack();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < points.length - 1) {
      currentIndex++;
      updateTrack();
    }
  });
})();
