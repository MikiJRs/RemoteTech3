import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuestionPackage extends Document {
    packageName: string;
    questions: string[];
}

interface IQuestion {
    questionText: string;
    time: number
}

const questionSchema = new Schema<IQuestion>({
    questionText: { type: String, required: true },
    time: {type: Number, required: true}
});


const questionPackageSchema = new Schema<IQuestionPackage>({
    packageName: { type: String, required: true, unique: true },
    questions: [questionSchema],
  }, { timestamps: true });
  

const QuestionPackage = mongoose.model<IQuestionPackage>('QuestionPackage', questionPackageSchema);

export default QuestionPackage;