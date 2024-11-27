import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Interview from '../models/InterviewPackageModel';
import QuestionPackage from '../models/QuestionPackageModel'

// Yeni bir Interview oluşturmak için POST isteği
export const createInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { interviewTitle, extraQuestions, expireDate, packageIds } = req.body;

    const newInterview = new Interview({
      interviewTitle,
      extraQuestions,
      expireDate,
      packageIds
    });

    // Veriyi MongoDB'ye kaydet
    await newInterview.save();

    res.status(201).json(newInterview);
  } catch (err) {
    console.error('Failed to create interview:', err);
    res.status(500).json({ message: 'Failed to create interview.' });
    next(err);
  }
};

// Tüm Interview verilerini almak için GET isteği
export const getAllInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await Interview.find();
    res.status(200).json(interviews);
  } catch (err) {
    console.error('Failed to fetch interviews:', err);
    res.status(500).json({ message: 'Failed to fetch interviews.' });
    next(err);
  }
};

// Belirli bir Interview'i ID ile silmek için DELETE isteği
export const deleteInterview = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid interview ID format.' });
      return;
    }

    const deletedInterview = await Interview.findByIdAndDelete(id);

    if (!deletedInterview) {
      res.status(404).json({ message: 'Interview not found.' });
      return;
    }

    res.status(200).json({ message: 'Interview successfully deleted.', deletedInterview });
  } catch (err) {
    console.error('Failed to delete interview:', err);
    res.status(500).json({ message: 'Failed to delete interview.' });
    next(err);
  }
};

// Belirli bir Interview'i ID ile güncellemek için PUT isteği
export const updateInterview = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid interview ID format.' });
      return;
    }

    const updatedInterview = await Interview.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedInterview) {
      res.status(404).json({ message: 'Interview not found.' });
      return;
    }

    res.status(200).json({ message: 'Interview successfully updated.', updatedInterview });
  } catch (err) {
    console.error('Failed to update interview:', err);
    res.status(500).json({ message: 'Failed to update interview.' });
    next(err);
  }
};

// Belirli bir Mülakatı ID ile almak için GET isteği
export const getInterviewById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Geçersiz mülakat ID formatı.' });
      return;
    }

    const interview = await Interview.findById(id);

    if (!interview) {
      res.status(404).json({ message: 'Mülakat bulunamadı.' });
      return;
    }

    res.status(200).json(interview);
  } catch (err) {
    console.error('Mülakat alınamadı:', err);
    res.status(500).json({ message: 'Mülakat alınamadı.' });
    next(err);
  }
};

// Belirli bir Mülakatın sorularını almak için GET isteği
export const getInterviewQuestions = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Geçersiz mülakat ID formatı.' });
      return;
    }

    const interview = await Interview.findById(id).populate({
      path: 'packageIds',
      model: QuestionPackage
    });

    if (!interview) {
      res.status(404).json({ message: 'Mülakat bulunamadı.' });
      return;
    }

    const questions = interview.packageIds.flatMap((pkg: any) => pkg.questions);
    res.status(200).json({ questions });
  } catch (error) {
    console.error('Sorular alınamadı:', error);
    res.status(500).json({ message: 'İç sunucu hatası.' });
    next(error);
  }
};