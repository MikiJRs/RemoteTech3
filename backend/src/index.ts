import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createQuestionPackage, getAllQuestionPackages, deleteQuestionPackage, updateQuestionPackage } from './controllers/QuestionPackageController';
import loginRoutes from './routes/loginRoutes';
import interviewRoutes from './routes/interviewRoutes'; // Interview routes'u import ettik
import UserLoginRoutes from './routes/UserLoginRoute';
import videoRoutes from './routes/VideoRoutes';
import InterviewModel from "./models/InterviewPackageModel"
import QuestionPackageModel from "./models/QuestionPackageModel"


const app = express();

// CORS ayarları ekle
app.use(cors({
  origin: [ process.env.FRONTEND_URL || "https://remote-tech2-admin.vercel.app" , process.env.WEB_URL || "https://remote-tech2-user.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Credentials ile ilgili isteklere izin ver
}));

// MongoDB'ye bağlan
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Body'yi parse etmek için JSON desteği ekle
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hoşgeldin, TypeScript ile Express.js sunucu çalışıyor!');
});

// Yeni bir QuestionPackage oluşturmak için POST isteği (Sadece adminler)
app.post('/api/question-package', createQuestionPackage);

// Tüm QuestionPackage verilerini almak için GET isteği (Herkes erişebilir)
app.get('/api/question-packages', getAllQuestionPackages);

// Belirli bir QuestionPackage'i ID ile silmek için DELETE isteği (Sadece adminler)
app.delete('/api/question-package/:id', deleteQuestionPackage);

// Belirli bir QuestionPackage'i ID ile güncellemek için PUT isteği (Sadece adminler)
app.put('/api/question-package/:id', updateQuestionPackage);

// Interview routes'u ekliyoruz
app.use('/api', interviewRoutes);

// Login route
app.use('/api', loginRoutes);



// User login routes
app.use('/api', UserLoginRoutes);  // '/api/submit' rotasına yönlendirme

app.get('/api/getQuestions/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;

    console.log(interviewId)

    const fetchedInterview = await InterviewModel.findById(interviewId);  

    // packageIds varsa al, yoksa boş bir dizi olarak ayarla
    const packageIds = await Promise.all(
      (fetchedInterview?.packageIds || []).map(async (packageInfo) => {
        return packageInfo.packageId;
      })
    );

    console.log("Package IDs:", packageIds);

    // Tüm paketlerdeki soruları alma
    const questions = await Promise.all(
      packageIds.map(async (packageId) => {
        const aPackage = await QuestionPackageModel.findById(packageId);
        return aPackage?.questions || []; // Soruların olmadığı durumda boş dizi döndür
      })
    );

    const extraQuestions = fetchedInterview?.extraQuestions

    const allQuestions = [...questions, extraQuestions];



    // Soruları tek bir dizide birleştir
    const flatQuestions = allQuestions.flat();

    console.log("Questions:", flatQuestions);

    res.json({ questions: flatQuestions });
  } catch (error) {
    console.error('Soruları alırken hata oluştu:', error);
    res.status(500).json({ error: 'Soruları alırken hata oluştu.' });
  }
});


app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});
