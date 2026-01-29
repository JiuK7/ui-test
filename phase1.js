import { THEMES } from "./themes.js";
import { setBackground } from "./background.js";

(() => {
  const messages = [
    "imkyla.k changed the theme to Star Line",
    "imkyla.k changed the theme to Heart Drive",
    "imkyla.k changed the theme to Lo-Fi",
    "imkyla.k changed the theme to Lucky Pink",
    "imkyla.k changed the theme to Selena Gomez & Benny Blanco",
    "imkyla.k changed the theme to Flirt",
    "imkyla.k changed the theme to I Heart You",
    "imkyla.k changed the theme to Love"
  ];

  const msgEl = document.getElementById("igSystemMessage");
  const phase1 = document.getElementById("phase1");
  const phase2 = document.getElementById("phase2");

  let index = 0;

  function nextTheme() {
    // Phase 1 image themes
    if (index < THEMES.phase1.length) {
      setBackground(THEMES.phase1[index]);
      msgEl.textContent = messages[index];
      index++;
      setTimeout(nextTheme, 900);
      return;
    }

    // Final persistent background (video)
    setBackground(THEMES.persistent);
    msgEl.textContent = messages[messages.length - 1];

    // Transition to Phase 2
    setTimeout(() => {
      phase1.classList.remove("screen--active");
      phase2.classList.add("screen--active");
    }, 1200);
  }

  // Start Phase 1
  setTimeout(nextTheme, 600);
})();
