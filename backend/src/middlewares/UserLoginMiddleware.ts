import express, { Application } from 'express';
import cors from 'cors';

const UserLoginMiddleware = (app: Application) => {
  // JSON parse etme
  app.use(express.json());

  // CORS ayarı
  app.use(cors());

};

export default UserLoginMiddleware; 