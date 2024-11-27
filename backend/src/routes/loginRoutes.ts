import express, { Router, Request, Response } from 'express';
import { login, logout } from '../controllers/LoginController'; // Controller'ı import ettik
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Login Route
router.post('/login', login); // Controller'daki login fonksiyonu kullanılıyor

// Logout Route
router.post('/logout', logout); // Controller'daki logout fonksiyonu kullanılıyor

export default router;
