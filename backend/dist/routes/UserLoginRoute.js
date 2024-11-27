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
const express_1 = __importDefault(require("express"));
const UserLoginModel_1 = __importDefault(require("../models/UserLoginModel"));
const router = express_1.default.Router();
router.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, surname, email, phone, isKVKKChecked } = req.body;
    if (!name || !surname || !email || !phone || isKVKKChecked === undefined) {
        res.status(400).json({ message: 'All fields are required and KVKK must be approved.' });
        return;
    }
    try {
        const newUser = yield UserLoginModel_1.default.create({
            name,
            surname,
            email,
            phone,
            kvkk_approved: isKVKKChecked,
        });
        console.log('Yeni Kullanıcı Kaydedildi:', newUser.toJSON());
        res.status(201).json({ message: 'Form başarıyla kaydedildi!' });
    }
    catch (error) {
        console.error('Veritabanına kaydetme hatası:', error);
        res.status(500).json({ message: 'Veritabanına kaydetme sırasında hata oluştu.' });
    }
}));
exports.default = router;
