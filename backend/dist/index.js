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
const config_1 = require("./config");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const QuestionPackageController_1 = require("./controllers/QuestionPackageController");
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes")); // Interview routes'u import ettik
const UserLoginRoute_1 = __importDefault(require("./routes/UserLoginRoute"));
const VideoRoutes_1 = __importDefault(require("./routes/VideoRoutes"));
const InterviewPackageModel_1 = __importDefault(require("./models/InterviewPackageModel"));
const QuestionPackageModel_1 = __importDefault(require("./models/QuestionPackageModel"));
const app = (0, express_1.default)();
// CORS ayarları ekle
app.use((0, cors_1.default)({
    origin: ['http://localhost:5172', 'http://localhost:5173'],
    credentials: true
}));
// MongoDB'ye bağlan
mongoose_1.default.connect(config_1.MONGODB_URI)
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));
// Body'yi parse etmek için JSON desteği ekle
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hoşgeldin, TypeScript ile Express.js sunucu çalışıyor!');
});
// Yeni bir QuestionPackage oluşturmak için POST isteği (Sadece adminler)
app.post('/api/question-package', QuestionPackageController_1.createQuestionPackage);
// Tüm QuestionPackage verilerini almak için GET isteği (Herkes erişebilir)
app.get('/api/question-packages', QuestionPackageController_1.getAllQuestionPackages);
// Belirli bir QuestionPackage'i ID ile silmek için DELETE isteği (Sadece adminler)
app.delete('/api/question-package/:id', QuestionPackageController_1.deleteQuestionPackage);
// Belirli bir QuestionPackage'i ID ile güncellemek için PUT isteği (Sadece adminler)
app.put('/api/question-package/:id', QuestionPackageController_1.updateQuestionPackage);
// Interview routes'u ekliyoruz
app.use('/api', interviewRoutes_1.default);
// Login route
app.use('/api', loginRoutes_1.default);
// User login routes
app.use('/api', UserLoginRoute_1.default); // '/api/submit' rotasına yönlendirme
app.get('/api/getQuestions/:interviewId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        console.log(interviewId);
        const fetchedInterview = yield InterviewPackageModel_1.default.findById(interviewId);
        // packageIds varsa al, yoksa boş bir dizi olarak ayarla
        const packageIds = yield Promise.all(((fetchedInterview === null || fetchedInterview === void 0 ? void 0 : fetchedInterview.packageIds) || []).map((packageInfo) => __awaiter(void 0, void 0, void 0, function* () {
            return packageInfo.packageId;
        })));
        console.log("Package IDs:", packageIds);
        // Tüm paketlerdeki soruları alma
        const questions = yield Promise.all(packageIds.map((packageId) => __awaiter(void 0, void 0, void 0, function* () {
            const aPackage = yield QuestionPackageModel_1.default.findById(packageId);
            return (aPackage === null || aPackage === void 0 ? void 0 : aPackage.questions) || []; // Soruların olmadığı durumda boş dizi döndür
        })));
        const extraQuestions = fetchedInterview === null || fetchedInterview === void 0 ? void 0 : fetchedInterview.extraQuestions;
        const allQuestions = [...questions, extraQuestions];
        // Soruları tek bir dizide birleştir
        const flatQuestions = allQuestions.flat();
        console.log("Questions:", flatQuestions);
        res.json({ questions: flatQuestions });
    }
    catch (error) {
        console.error('Soruları alırken hata oluştu:', error);
        res.status(500).json({ error: 'Soruları alırken hata oluştu.' });
    }
}));
app.use('/api/videos', VideoRoutes_1.default);
app.listen(config_1.PORT, () => {
    console.log(`Sunucu http://localhost:${config_1.PORT} üzerinde çalışıyor`);
});
