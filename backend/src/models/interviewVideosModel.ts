import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Interview schema
export interface IInterviewVideos extends Document {
  interviewId: string;
  videos: IVideos[];
}

export interface IVideo {
  _id: mongoose.Types.ObjectId;  // ObjectId türünü belirleyin
  userId: string;
  videoKey: string;
}

interface IVideos extends Document {
  userId: string;
  videoKey: string;
}

const videosSchema = new Schema<IVideos>({
  userId: {
    type: String,
    required: true,
  },
  videoKey: {
    type: String,
    required: true,
  },
});

// Mongoose schema for Interview
const InterviewVideosSchema: Schema = new Schema<IInterviewVideos>(
  {
    interviewId: {
      type: String,
      required: true,
    },
    videos: { type: [videosSchema], required: true, default: [] },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose model for Interview
const InterviewVideos = mongoose.model<IInterviewVideos>(
  "InterviewVideos",
  InterviewVideosSchema
);

export default InterviewVideos;