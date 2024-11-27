// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Admin bilgilerini .env dosyasından alıyoruz
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Email ve şifre kontrolü
  if (username === adminEmail && password === adminPassword) {
    // JWT token oluşturma
    const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
    
    res
    .cookie('token', token, { // Kullanıcıya bir çerez (cookie) ayarlıyoruz. Bu çerez "token" adında olacak ve içine JWT token yerleştirilecek.
      httpOnly: true, // Çerez, sadece HTTP istekleriyle erişilebilir olacak. JavaScript ile doğrudan erişilemez. Bu güvenlik için önemlidir.
      secure: true, // Çerez, sadece HTTPS bağlantıları üzerinden gönderilecek. Gerçek bir ortamda bu özelliği `true` olarak ayarlamak güvenlik için önemlidir.
      sameSite: 'none', // Çerezin, diğer sitelerden gelen isteklere de dahil edilebilmesi için ayarlanır. "none" değeri ile çerez üçüncü parti isteklere de gönderilir.
      maxAge: 8 * 60 * 60 * 1000, // Çerezin geçerlilik süresini 8 saat olarak ayarlıyoruz. 8 saat sonra çerez otomatik olarak geçersiz olur.
    })
    .status(200) // HTTP yanıt durumunu 200 olarak ayarlıyoruz. Bu, başarılı bir isteği belirtir.
    .json({ message: 'Login successful' }); // JSON formatında bir yanıt döneriz ve bu yanıt içinde "Login successful" mesajı bulunur.
  }  
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Gerçek ortamda HTTPS kullanıyorsanız true yapmalısınız
    sameSite: 'strict',
  });
  res.json({ message: 'Logout successful' });
};
