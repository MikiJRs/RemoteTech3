"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserLoginMiddleware = (app) => {
    // JSON parse etme
    app.use(express_1.default.json());
    // CORS ayarı
    app.use((0, cors_1.default)());
};
exports.default = UserLoginMiddleware;
