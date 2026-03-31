import mongoose, { Schema, Document } from "mongoose";

export interface IExperience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      website?: string;
      summary?: string;
    };
    experience: IExperience[];
    education: IEducation[];
    skills: string[];
    projects: IProject[];
    certifications?: ICertification[];
  };
  fileUrl?: string;
  extractedText?: string;
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
});

const EducationSchema: Schema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  gpa: { type: String },
});

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  link: { type: String },
  startDate: { type: String },
  endDate: { type: String },
});

const CertificationSchema: Schema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  link: { type: String },
});

const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      personalInfo: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String },
        website: { type: String },
        summary: { type: String },
      },
      experience: { type: [ExperienceSchema], default: [] },
      education: { type: [EducationSchema], default: [] },
      skills: { type: [String], default: [] },
      projects: { type: [ProjectSchema], default: [] },
      certifications: { type: [CertificationSchema], default: [] },
    },
    fileUrl: { type: String },
    extractedText: { type: String },
    template: { type: String, default: "modern" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
