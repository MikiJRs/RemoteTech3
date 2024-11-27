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
exports.submitUserInfo = void 0;
const UserLoginModel_1 = __importDefault(require("../models/UserLoginModel"));
const submitUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, phone, isKVKKChecked } = req.body;
        // Alanların eksik olup olmadığını kontrol edin
        if (!name || !surname || !email || !phone || typeof isKVKKChecked === 'undefined') {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = new UserLoginModel_1.default({
            name,
            surname,
            email,
            phone,
            kvkk_approved: isKVKKChecked,
        });
        yield user.save();
        // Yeni oluşturulan userId'yi döndürün
        res.status(201).json({ message: 'Form submitted successfully!', userId: user._id });
    }
    catch (error) {
        console.error('Error submitting user info:', error);
        res.status(500).json({ message: 'An error occurred while submitting the form.' });
    }
});
exports.submitUserInfo = submitUserInfo;
