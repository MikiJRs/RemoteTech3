import mongoose, { Schema, Document } from 'mongoose';
import { IQuestionPackage } from './QuestionPackageModel'; // QuestionPackage arayüzünü içe aktarın

// Mülakat arayüzü
export interface IInterview extends Document {
    interviewTitle: string;
    extraQuestions: ExtraQuestion[];
    expireDate: Date;
    packageIds: packageId[]; // packageIds, packageId tipinde dizi
}

// packageId arayüzü
interface packageId extends Document {
    packageId: string;
}

// Ekstra sorular için arayüz
interface ExtraQuestion {
    questionText: string;
    time: number;
}

const packageIdSchema = new Schema<packageId>({
    packageId: { type: String,  required: true }
});

const extraQuestionSchema = new Schema<ExtraQuestion>({
    questionText: { type: String, required: true },
    time: { type: Number, required: true }
});

const interviewSchema = new Schema<IInterview>({
    interviewTitle: { type: String, required: true },
    extraQuestions: [extraQuestionSchema],
    expireDate: { type: Date, required: true },
    packageIds: [packageIdSchema] // packageId dizisi olarak tanımlanması
}, { timestamps: true });

const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;
