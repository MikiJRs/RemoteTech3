import express from "express";
import { getVideoById, uploadVideo, deleteVideo } from "../controllers/videoController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// GET: Interview ID'ye göre tüm videoları al
router.get("/:interviewId", getVideoById);

// POST: Video yükle
router.post("/", upload.single("file"), uploadVideo);

// DELETE: Video sil
router.delete("/:id", deleteVideo);

export default router;