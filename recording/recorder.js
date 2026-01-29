// recorder.js

let mediaRecorder = null;
let recordedChunks = [];
let stream = null;

export async function startRecording() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    console.warn("Screen recording not supported");
    return;
  }

  stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      frameRate: 30,
      cursor: "always",
    },
    audio: false,
  });

  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });

  recordedChunks = [];

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.start();
}

export async function stopRecording() {
  if (!mediaRecorder) return null;

  return new Promise(resolve => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      // stop tracks
      stream.getTracks().forEach(t => t.stop());

      resolve(blob);
    };

    mediaRecorder.stop();
  });
}
