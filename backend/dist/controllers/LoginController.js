"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Admin bilgilerini .env dosyasından alıyoruz
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const login = (req, res) => {
    const { username, password } = req.body;
    // Email ve şifre kontrolü
    if (username === adminEmail && password === adminPassword) {
        // JWT token oluşturma
        const token = jsonwebtoken_1.default.sign({ email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res
            .cookie('token', token, {
            httpOnly: true, // Çerez, sadece HTTP istekleriyle erişilebilir olacak. JavaScript ile doğrudan erişilemez. Bu güvenlik için önemlidir.
            secure: true, // Çerez, sadece HTTPS bağlantıları üzerinden gönderilecek. Gerçek bir ortamda bu özelliği `true` olarak ayarlamak güvenlik için önemlidir.
            sameSite: 'none', // Çerezin, diğer sitelerden gelen isteklere de dahil edilebilmesi için ayarlanır. "none" değeri ile çerez üçüncü parti isteklere de gönderilir.
            maxAge: 8 * 60 * 60 * 1000, // Çerezin geçerlilik süresini 8 saat olarak ayarlıyoruz. 8 saat sonra çerez otomatik olarak geçersiz olur.
        })
            .status(200) // HTTP yanıt durumunu 200 olarak ayarlıyoruz. Bu, başarılı bir isteği belirtir.
            .json({ message: 'Login successful' }); // JSON formatında bir yanıt döneriz ve bu yanıt içinde "Login successful" mesajı bulunur.
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Gerçek ortamda HTTPS kullanıyorsanız true yapmalısınız
        sameSite: 'strict',
    });
    res.json({ message: 'Logout successful' });
};
exports.logout = logout;
