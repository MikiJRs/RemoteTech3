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
exports.getInterviewQuestions = exports.getInterviewById = exports.updateInterview = exports.deleteInterview = exports.getAllInterviews = exports.createInterview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InterviewPackageModel_1 = __importDefault(require("../models/InterviewPackageModel"));
const QuestionPackageModel_1 = __importDefault(require("../models/QuestionPackageModel"));
// Yeni bir Interview oluşturmak için POST isteği
const createInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewTitle, extraQuestions, expireDate, packageIds } = req.body;
        const newInterview = new InterviewPackageModel_1.default({
            interviewTitle,
            extraQuestions,
            expireDate,
            packageIds
        });
        // Veriyi MongoDB'ye kaydet
        yield newInterview.save();
        res.status(201).json(newInterview);
    }
    catch (err) {
        console.error('Failed to create interview:', err);
        res.status(500).json({ message: 'Failed to create interview.' });
        next(err);
    }
});
exports.createInterview = createInterview;
// Tüm Interview verilerini almak için GET isteği
const getAllInterviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const interviews = yield InterviewPackageModel_1.default.find();
        res.status(200).json(interviews);
    }
    catch (err) {
        console.error('Failed to fetch interviews:', err);
        res.status(500).json({ message: 'Failed to fetch interviews.' });
        next(err);
    }
});
exports.getAllInterviews = getAllInterviews;
// Belirli bir Interview'i ID ile silmek için DELETE isteği
const deleteInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid interview ID format.' });
            return;
        }
        const deletedInterview = yield InterviewPackageModel_1.default.findByIdAndDelete(id);
        if (!deletedInterview) {
            res.status(404).json({ message: 'Interview not found.' });
            return;
        }
        res.status(200).json({ message: 'Interview successfully deleted.', deletedInterview });
    }
    catch (err) {
        console.error('Failed to delete interview:', err);
        res.status(500).json({ message: 'Failed to delete interview.' });
        next(err);
    }
});
exports.deleteInterview = deleteInterview;
// Belirli bir Interview'i ID ile güncellemek için PUT isteği
const updateInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid interview ID format.' });
            return;
        }
        const updatedInterview = yield InterviewPackageModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedInterview) {
            res.status(404).json({ message: 'Interview not found.' });
            return;
        }
        res.status(200).json({ message: 'Interview successfully updated.', updatedInterview });
    }
    catch (err) {
        console.error('Failed to update interview:', err);
        res.status(500).json({ message: 'Failed to update interview.' });
        next(err);
    }
});
exports.updateInterview = updateInterview;
// Belirli bir Mülakatı ID ile almak için GET isteği
const getInterviewById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Geçersiz mülakat ID formatı.' });
            return;
        }
        const interview = yield InterviewPackageModel_1.default.findById(id);
        if (!interview) {
            res.status(404).json({ message: 'Mülakat bulunamadı.' });
            return;
        }
        res.status(200).json(interview);
    }
    catch (err) {
        console.error('Mülakat alınamadı:', err);
        res.status(500).json({ message: 'Mülakat alınamadı.' });
        next(err);
    }
});
exports.getInterviewById = getInterviewById;
// Belirli bir Mülakatın sorularını almak için GET isteği
const getInterviewQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Geçersiz mülakat ID formatı.' });
            return;
        }
        const interview = yield InterviewPackageModel_1.default.findById(id).populate({
            path: 'packageIds',
            model: QuestionPackageModel_1.default
        });
        if (!interview) {
            res.status(404).json({ message: 'Mülakat bulunamadı.' });
            return;
        }
        const questions = interview.packageIds.flatMap((pkg) => pkg.questions);
        res.status(200).json({ questions });
    }
    catch (error) {
        console.error('Sorular alınamadı:', error);
        res.status(500).json({ message: 'İç sunucu hatası.' });
        next(error);
    }
});
exports.getInterviewQuestions = getInterviewQuestions;
