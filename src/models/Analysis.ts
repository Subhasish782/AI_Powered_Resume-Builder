import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
  resumeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
  sectionScores?: {
    format: number;
    content: number;
    keywords: number;
    readability: number;
  };
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema(
  {
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    sectionScores: {
      format: { type: Number, min: 0, max: 100 },
      content: { type: Number, min: 0, max: 100 },
      keywords: { type: Number, min: 0, max: 100 },
      readability: { type: Number, min: 0, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Analysis || mongoose.model<IAnalysis>("Analysis", AnalysisSchema);
