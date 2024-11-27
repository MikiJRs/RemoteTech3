// backend/src/controllers/UserController.ts
import { Request, Response } from 'express';
import User from '../models/UserLoginModel';

export const submitUserInfo = async (req: Request, res: Response) => {
    try {
        const { name, surname, email, phone, isKVKKChecked } = req.body;

        // Alanların eksik olup olmadığını kontrol edin
        if (!name || !surname || !email || !phone || typeof isKVKKChecked === 'undefined') {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = new User({
            name,
            surname,
            email,
            phone,
            kvkk_approved: isKVKKChecked,
        });

        await user.save();

        // Yeni oluşturulan userId'yi döndürün
        res.status(201).json({ message: 'Form submitted successfully!', userId: user._id });
    } catch (error) {
        console.error('Error submitting user info:', error);
        res.status(500).json({ message: 'An error occurred while submitting the form.' });
    }
};
