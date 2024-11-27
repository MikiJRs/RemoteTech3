import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  phone: string;
  kvkk_approved: boolean;
  videoUrl?: string;  // Optional
  status?: string;    // Optional, with default 'pending'
  note?: string;      // Optional

}

const PersonalInfoSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  kvkk_approved: { type: Boolean, required: true },
  videoUrl: { type: String, required: false},
  status: {type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'],default: 'pending'},
  note: {type: String, required: false, trim: true}
}, 
{
  timestamps: true // automatically adds createdAt and updatedAt fields
});

export default mongoose.model<IUser>('PersonelInfo', PersonalInfoSchema);