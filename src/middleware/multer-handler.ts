import type { Request, Response } from "express";
import multer, { MulterError } from "multer";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_AUDIO_SIZE = 20 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const allowedAudioTypes = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
];

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.fieldname === "image") {
    if (allowedImageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only JPEG, PNG & WebP images are allowed"));
  }

  if (file.fieldname === "audio") {
    if (allowedAudioTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new Error("Only MP3, M4A, WAV, OGG, AAC audio files are allowed"),
    );
  }

  cb(new Error(`Unexpected field: ${file.fieldname}`));
};

export const upload = multer({
  storage,
  limits: {
    fileSize: Math.max(MAX_IMAGE_SIZE, MAX_AUDIO_SIZE),
    fields: 10,
    files: 2,
  },
  fileFilter,
});

export const uploadArticleMedia = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);
