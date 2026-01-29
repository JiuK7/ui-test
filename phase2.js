(() => {
  const track = document.getElementById("timelineTrack");
  const bubble = document.getElementById("timelineBubble");
  const bubbleText = document.getElementById("timelineBubbleText");
  const bubbleImg = document.getElementById("timelineBubbleImg");
  const points = Array.from(document.querySelectorAll(".timeline-point"));

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
      image: "assets/phase2/huanyi.png"
    },
    {
      text: "You already liked food I made^",
    },
    {
      text: "I haven't ragebaited you on overcooked yet",
    },
    {
      text: "I need to boost your acs",
      image: "assets/phase2/24acs.png"
    },
    {
      text: "I'm using my computer science for a valentines date ㅠㅠ",
    },
    {
      text: `My bad we met on Hinge
      we can make up a new origin story together`,
    },
    {
      text: `Time for the big question...`,
    }
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
    const point = POINTS[index];

    bubbleText.textContent = point.text;

    if (point.image) {
      bubbleImg.src = point.image;
      bubbleImg.style.display = "block";
      bubble.classList.remove("no-image");
    } else {
      bubbleImg.src = "";
      bubbleImg.style.display = "none";
      bubble.classList.add("no-image");
    }

    bubble.classList.remove("show");
    void bubble.offsetWidth; // restart animation
    bubble.classList.add("show");
    bubble.classList.remove("hidden");

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

})();
