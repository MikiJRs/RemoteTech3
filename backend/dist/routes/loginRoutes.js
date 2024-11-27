"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginController_1 = require("../controllers/LoginController"); // Controller'ı import ettik
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// Login Route
router.post('/login', LoginController_1.login); // Controller'daki login fonksiyonu kullanılıyor
// Logout Route
router.post('/logout', LoginController_1.logout); // Controller'daki logout fonksiyonu kullanılıyor
exports.default = router;
