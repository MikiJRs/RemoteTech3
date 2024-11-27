"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.uploadVideo = exports.getVideoById = void 0;
const VideoService = __importStar(require("../services/videoServices"));
// Belirli bir ID ile video al
const getVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params; // interviewId parametresi eksik olabilir, kontrol edin
        if (!interviewId) {
            res.status(400).json({ message: "Eksik interviewId." });
            return;
        }
        const video = yield VideoService.fetchVideosByInterviewId(interviewId);
        res.status(200).json(video);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Video bulunamadı";
        res.status(500).json({ message, error });
    }
});
exports.getVideoById = getVideoById;
// Video yükle
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const responseData = yield VideoService.uploadVideoToAPI(req.file, userId, interviewId);
        // Güncellenmiş dökümanı döndür
        res.status(200).json(responseData.updatedInterview);
    }
    catch (error) {
        console.error("Error during video upload:", error.message);
        res
            .status(500)
            .json({ message: "Video yüklenemedi", error: error.message });
    }
});
exports.uploadVideo = uploadVideo;
// Video sil
const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: videoId } = req.params;
        const { interviewId } = req.body;
        if (!interviewId || !videoId) {
            res.status(400).json({ message: "Eksik video veya interview ID" });
            return;
        }
        yield VideoService.deleteVideo(videoId, interviewId);
        res.status(204).send();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Video silinemedi";
        res.status(500).json({ message, error });
    }
});
exports.deleteVideo = deleteVideo;
