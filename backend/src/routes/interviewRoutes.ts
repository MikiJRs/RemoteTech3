import express from 'express';
import { getAllInterviews, createInterview, deleteInterview, updateInterview, getInterviewById, getInterviewQuestions} from '../controllers/InterviewController';

const router = express.Router();

// Tüm mülakatları almak için GET isteği
router.get('/interviews', getAllInterviews);

// Yeni bir mülakat oluşturmak için POST isteği
router.post('/interviews', createInterview);

// Belirli bir mülakatı silmek için DELETE isteği
router.delete('/interviews/:id', deleteInterview);

// Belirli bir mülakatı güncellemek için PUT isteği
router.put('/interviews/:id', updateInterview);

router.get('/interviews/:id', getInterviewById);

router.get('/interviews/:id/questions', getInterviewQuestions);
export default router;