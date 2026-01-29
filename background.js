const bgA = document.getElementById("bgA");
const bgB = document.getElementById("bgB");

let activeBg = bgA;
let inactiveBg = bgB;
let currentVideo = null;

export function setBackground({ type, src }) {
  // Prepare inactive layer
  if (currentVideo) {
    currentVideo.remove();
    currentVideo = null;
  }

  if (type === "image") {
    inactiveBg.style.backgroundImage = `url(${src})`;
  }

  if (type === "video") {
    inactiveBg.style.backgroundImage = "none";

    const video = document.createElement("video");
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    video.style.cssText = `
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
    `;

    inactiveBg.appendChild(video);
    currentVideo = video;
  }

  // Crossfade
  inactiveBg.classList.add("visible");
  inactiveBg.classList.remove("hidden");

  activeBg.classList.remove("visible");
  activeBg.classList.add("hidden");

  // Swap layers
  [activeBg, inactiveBg] = [inactiveBg, activeBg];
}
