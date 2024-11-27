import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import QuestionPackage from '../models/QuestionPackageModel';

// Yeni bir QuestionPackage oluşturmak için POST isteği
export const createQuestionPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { packageName, questions } = req.body;

    const newQuestionPackage = new QuestionPackage({
      packageName,
      questions
    });

    // Veriyi MongoDB'ye kaydet
    await newQuestionPackage.save();

    res.status(201).json(newQuestionPackage);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Tüm QuestionPackage verilerini almak için GET isteği
export const getAllQuestionPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questionPackages = await QuestionPackage.find();
    res.status(200).json(questionPackages);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Belirli bir QuestionPackage'i ID ile silmek için DELETE isteği
export const deleteQuestionPackage = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Geçersiz paket ID formatı.' });
      return;
    }

    const deletedQuestionPackage = await QuestionPackage.findByIdAndDelete(id);

    if (!deletedQuestionPackage) {
      res.status(404).json({ message: 'Paket bulunamadı.' });
      return;
    }

    res.status(200).json({ message: 'Paket başarıyla silindi.', deletedQuestionPackage });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Belirli bir QuestionPackage'i ID ile güncellemek için PUT isteği
export const updateQuestionPackage = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Geçersiz paket ID formatı.' });
      return;
    }

    const updatedQuestionPackage = await QuestionPackage.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedQuestionPackage) {
      res.status(404).json({ message: 'Paket bulunamadı.' });
      return;
    }

    res.status(200).json({ message: 'Paket başarıyla güncellendi.', updatedQuestionPackage });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
