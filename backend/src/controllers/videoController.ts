import { Request, Response } from "express";
import * as VideoService from "../services/videoServices";

// Belirli bir ID ile video al
export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params; // interviewId parametresi eksik olabilir, kontrol edin
    if (!interviewId) {
      res.status(400).json({ message: "Eksik interviewId." });
      return;
    }
    const video = await VideoService.fetchVideosByInterviewId(interviewId);
    res.status(200).json(video);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video bulunamadı";
    res.status(500).json({ message, error });
  }
};

// Video yükle
export const uploadVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Dosyanın yüklendiğini doğrula
    if (!req.file) {
      res.status(400).json({ message: "No video file uploaded." });
      return;
    }

    const { interviewId, userId } = req.body;

    // interviewId ve userId'nin eksik olmadığını doğrula
    if (!interviewId) {
      res.status(400).json({ message: "Missing interviewId." });
      return;
    }
    if (!userId) {
      res.status(400).json({ message: "Missing userId." });
      return;
    }

    // Video upload ve veritabanına ekleme işlemi
    const responseData = await VideoService.uploadVideoToAPI(
      req.file,
      userId,
      interviewId
    );

    // Güncellenmiş dökümanı döndür
    res.status(200).json(responseData.updatedInterview);
  } catch (error: unknown) {
    console.error("Error during video upload:", (error as Error).message);
    res
      .status(500)
      .json({ message: "Video yüklenemedi", error: (error as Error).message });
  }
};

// Video sil
export const deleteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: videoId } = req.params;
    const { interviewId } = req.body;

    if (!interviewId || !videoId) {
      res.status(400).json({ message: "Eksik video veya interview ID" });
      return;
    }

    await VideoService.deleteVideo(videoId, interviewId);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video silinemedi";
    res.status(500).json({ message, error });
  }
};