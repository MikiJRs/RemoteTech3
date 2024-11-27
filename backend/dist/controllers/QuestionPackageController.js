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
exports.updateQuestionPackage = exports.deleteQuestionPackage = exports.getAllQuestionPackages = exports.createQuestionPackage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionPackageModel_1 = __importDefault(require("../models/QuestionPackageModel"));
// Yeni bir QuestionPackage oluşturmak için POST isteği
const createQuestionPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { packageName, questions } = req.body;
        const newQuestionPackage = new QuestionPackageModel_1.default({
            packageName,
            questions
        });
        // Veriyi MongoDB'ye kaydet
        yield newQuestionPackage.save();
        res.status(201).json(newQuestionPackage);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.createQuestionPackage = createQuestionPackage;
// Tüm QuestionPackage verilerini almak için GET isteği
const getAllQuestionPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionPackages = yield QuestionPackageModel_1.default.find();
        res.status(200).json(questionPackages);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.getAllQuestionPackages = getAllQuestionPackages;
// Belirli bir QuestionPackage'i ID ile silmek için DELETE isteği
const deleteQuestionPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Geçersiz paket ID formatı.' });
            return;
        }
        const deletedQuestionPackage = yield QuestionPackageModel_1.default.findByIdAndDelete(id);
        if (!deletedQuestionPackage) {
            res.status(404).json({ message: 'Paket bulunamadı.' });
            return;
        }
        res.status(200).json({ message: 'Paket başarıyla silindi.', deletedQuestionPackage });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.deleteQuestionPackage = deleteQuestionPackage;
// Belirli bir QuestionPackage'i ID ile güncellemek için PUT isteği
const updateQuestionPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Geçersiz paket ID formatı.' });
            return;
        }
        const updatedQuestionPackage = yield QuestionPackageModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedQuestionPackage) {
            res.status(404).json({ message: 'Paket bulunamadı.' });
            return;
        }
        res.status(200).json({ message: 'Paket başarıyla güncellendi.', updatedQuestionPackage });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
exports.updateQuestionPackage = updateQuestionPackage;
