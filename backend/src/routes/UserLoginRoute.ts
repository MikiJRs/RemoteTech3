import express, { Request, Response } from 'express';
import User from '../models/UserLoginModel';

const router = express.Router();

router.post('/submit', async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, phone, isKVKKChecked } = req.body;

  if (!name || !surname || !email || !phone || isKVKKChecked === undefined) {
    res.status(400).json({ message: 'All fields are required and KVKK must be approved.' });
    return;
  }

  try {
    const newUser = await User.create({
      name,
      surname,
      email,
      phone,
      kvkk_approved: isKVKKChecked,
    });
    console.log('Yeni Kullanıcı Kaydedildi:', newUser.toJSON());
    res.status(201).json({ message: 'Form başarıyla kaydedildi!' });
  } catch (error) {
    console.error('Veritabanına kaydetme hatası:', error);
    res.status(500).json({ message: 'Veritabanına kaydetme sırasında hata oluştu.' });
  }
});

export default router;
