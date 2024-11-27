"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videoController_1 = require("../controllers/videoController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
// GET: Interview ID'ye göre tüm videoları al
router.get("/:interviewId", videoController_1.getVideoById);
// POST: Video yükle
router.post("/", upload.single("file"), videoController_1.uploadVideo);
// DELETE: Video sil
router.delete("/:id", videoController_1.deleteVideo);
exports.default = router;
