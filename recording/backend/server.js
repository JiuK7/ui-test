import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const app = express();
const upload = multer();

app.post("/upload", upload.single("video"), async (req, res) => {
  const video = req.file;
  const events = JSON.parse(req.body.events);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_EMAIL@gmail.com",
      pass: "APP_PASSWORD",
    },
  });

  await transporter.sendMail({
    from: "Valentine Recorder <bot@valentine>",
    to: "YOUR_EMAIL@gmail.com",
    subject: "Valentine Experience Recording 💗",
    text: JSON.stringify(events, null, 2),
    attachments: [
      {
        filename: "valentine.webm",
        content: video.buffer,
      },
    ],
  });

  res.sendStatus(200);
});

app.listen(3000);
