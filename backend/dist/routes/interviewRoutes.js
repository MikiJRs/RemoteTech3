"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InterviewController_1 = require("../controllers/InterviewController");
const router = express_1.default.Router();
// Tüm mülakatları almak için GET isteği
router.get('/interviews', InterviewController_1.getAllInterviews);
// Yeni bir mülakat oluşturmak için POST isteği
router.post('/interviews', InterviewController_1.createInterview);
// Belirli bir mülakatı silmek için DELETE isteği
router.delete('/interviews/:id', InterviewController_1.deleteInterview);
// Belirli bir mülakatı güncellemek için PUT isteği
router.put('/interviews/:id', InterviewController_1.updateInterview);
router.get('/interviews/:id', InterviewController_1.getInterviewById);
router.get('/interviews/:id/questions', InterviewController_1.getInterviewQuestions);
exports.default = router;
