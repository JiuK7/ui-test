const globalBackground = document.getElementById("globalBackground");

let currentVideo = null;

export function setBackground({ type, src }) {
  globalBackground.classList.add("fade-out");

  setTimeout(() => {
    if (currentVideo) {
      currentVideo.remove();
      currentVideo = null;
    }

    if (type === "image") {
      globalBackground.style.backgroundImage = `url(${src})`;
    }

    if (type === "video") {
      globalBackground.style.backgroundImage = "none";

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
        z-index:-1;
      `;

      globalBackground.appendChild(video);
      currentVideo = video;
    }

    globalBackground.classList.remove("fade-out");
  }, 400);
}
