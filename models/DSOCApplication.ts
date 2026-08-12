import mongoose, { Schema, Document } from 'mongoose';

export interface IDSOCApplication extends Document {
  project: mongoose.Types.ObjectId;
  mentee: mongoose.Types.ObjectId;
  discordUsername: string;
  proposal: string;
  coverLetter?: string;
  whyThisProject: string;
  motivation?: string;
  relevantExperience: string;
  technicalSkills?: string;
  githubProfile?: string;
  portfolioLinks: string[];
  previousContributions?: string;
  timeline?: string;
  expectedLearnings: string;
  challenges?: string;
  availability: string;
  timezone?: string;
  startDate?: Date;
  status: 'pending' | 'under-review' | 'accepted' | 'rejected' | 'waitlisted' | 'withdrawn';
  mentorNotes?: string;
  adminNotes?: string;
  score?: number;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DSOCApplicationSchema = new Schema<IDSOCApplication>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'DSOCProject',
      required: [true, 'Project is required'],
    },
    mentee: {
      type: Schema.Types.ObjectId,
      ref: 'DSOCMentee',
      required: [true, 'Mentee is required'],
    },
    discordUsername: {
      type: String,
      required: [true, 'Discord username is required'],
      trim: true,
    },
    proposal: {
      type: String,
      required: [true, 'Proposal is required'],
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    whyThisProject: {
      type: String,
      required: [true, 'Why this project answer is required'],
      trim: true,
    },
    motivation: {
      type: String,
      trim: true,
    },
    relevantExperience: {
      type: String,
      required: [true, 'Relevant experience is required'],
      trim: true,
    },
    technicalSkills: {
      type: String,
      trim: true,
    },
    githubProfile: {
      type: String,
      trim: true,
    },
    portfolioLinks: [{
      type: String,
      trim: true,
    }],
    previousContributions: {
      type: String,
      trim: true,
    },
    timeline: {
      type: String,
      trim: true,
    },
    expectedLearnings: {
      type: String,
      required: [true, 'Expected learnings is required'],
      trim: true,
    },
    challenges: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      trim: true,
    },
    timezone: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'under-review', 'accepted', 'rejected', 'waitlisted', 'withdrawn'],
      default: 'pending',
    },
    mentorNotes: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'DSOCMentor',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one application per mentee per project
DSOCApplicationSchema.index({ project: 1, mentee: 1 }, { unique: true });

export const DSOCApplication = mongoose.models.DSOCApplication || mongoose.model<IDSOCApplication>('DSOCApplication', DSOCApplicationSchema);
