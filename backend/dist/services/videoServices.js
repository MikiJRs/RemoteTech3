"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.uploadVideoToAPI = exports.fetchVideosByInterviewId = void 0;
// services/videoService.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const interviewVideosModel_1 = __importDefault(require("../models/interviewVideosModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const s3Client = new client_s3_1.S3Client({
    region: process.env.VIDEO_API_REGION,
    credentials: {
        accessKeyId: process.env.VIDEO_API_ACCESS_KEY,
        secretAccessKey: process.env.VIDEO_API_SECRET_KEY,
    },
});
// Interview ID'ye göre tüm videoları getir
const fetchVideosByInterviewId = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviewVideos = yield interviewVideosModel_1.default.findOne({ interviewId });
        if (!interviewVideos || interviewVideos.videos.length === 0) {
            throw new Error("Videolar bulunamadı");
        }
        // S3 URL'lerini her video için oluştur
        const videosWithUrls = yield Promise.all(interviewVideos.videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: process.env.VIDEO_API_BUCKET,
                Key: video.videoKey,
            });
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
            return Object.assign(Object.assign({}, video.toObject()), { s3Url: signedUrl });
        })));
        return videosWithUrls;
    }
    catch (error) {
        throw new Error(`Failed to fetch videos by Interview ID: ${error.message}`);
    }
});
exports.fetchVideosByInterviewId = fetchVideosByInterviewId;
// Tek bir video yükle
const uploadVideoToAPI = (file, userId, interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const randomFileName = `${Date.now()}.mp4`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.VIDEO_API_BUCKET,
            Key: randomFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ContentDisposition: "inline",
        });
        const uploadResult = yield s3Client.send(command);
        const updatedInterview = yield interviewVideosModel_1.default.findOneAndUpdate({ interviewId }, {
            $push: {
                videos: {
                    userId,
                    videoKey: randomFileName,
                },
            },
        }, { new: true, upsert: true });
        return {
            randomFileName,
            uploadResult,
            updatedInterview,
        };
    }
    catch (error) {
        throw new Error(`Failed to upload video: ${error.message}`);
    }
});
exports.uploadVideoToAPI = uploadVideoToAPI;
// Belirli bir video sil
const deleteVideo = (videoId, interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviewVideo = yield interviewVideosModel_1.default.findOne({ interviewId }).lean();
        if (!interviewVideo) {
            throw new Error("Interview not found");
        }
        // Video kaydını bul
        const video = interviewVideo.videos.find((v) => v._id.toString() === videoId);
        if (!video) {
            throw new Error("Video bulunamadı");
        }
        // S3'ten video silme işlemi
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.VIDEO_API_BUCKET,
            Key: video.videoKey,
        });
        yield s3Client.send(command);
        console.log("Video successfully deleted from S3");
        // Veritabanından video kaydını silme
        yield interviewVideosModel_1.default.findOneAndUpdate({ interviewId }, { $pull: { videos: { _id: new mongoose_1.default.Types.ObjectId(videoId) } } });
        console.log("Video successfully deleted from MongoDB");
    }
    catch (error) {
        console.error("Failed to delete video:", error);
        throw new Error(`Failed to delete video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
exports.deleteVideo = deleteVideo;
