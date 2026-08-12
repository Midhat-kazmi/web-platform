import mongoose, { Schema, Document } from 'mongoose';

export interface IDSOCProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  organization: string;
  repositoryUrls: string[];
  websiteUrl?: string;
  timelineUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "3 months", "6 weeks"
  technologies: string[];
  tags: string[];
  mentors: mongoose.Types.ObjectId[];
  selectedMentees: mongoose.Types.ObjectId[];
  maxMentees: number;
  status: 'draft' | 'open' | 'in-progress' | 'completed' | 'archived';
  applicationDeadline: Date;
  startDate: Date;
  endDate: Date;
  requirements: string[];
  learningOutcomes: string[];
  milestones: {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
  }[];
  discordChannelId?: string;
  discordRoleId?: string;
  featuredImage?: string;
  gallery: string[];
  isActive: boolean;
  season: string; // e.g., "2025", "Summer 2025"
  createdAt: Date;
  updatedAt: Date;
}

const DSOCProjectSchema = new Schema<IDSOCProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    repositoryUrls: [{
      type: String,
      required: [true, 'Repository URL is required'],
      trim: true,
    }],
    websiteUrl: {
      type: String,
      trim: true,
    },
    timelineUrl: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    duration: {
      type: String,
      required: [true, 'Project duration is required'],
      trim: true,
    },
    technologies: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    mentors: [{
      type: Schema.Types.ObjectId,
      ref: 'DSOCMentor',
    }],
    selectedMentees: [{
      type: Schema.Types.ObjectId,
      ref: 'DSOCMentee',
    }],
    maxMentees: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'in-progress', 'completed', 'archived'],
      default: 'draft',
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    requirements: [{
      type: String,
      trim: true,
    }],
    learningOutcomes: [{
      type: String,
      trim: true,
    }],
    milestones: [{
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: Date },
      completed: { type: Boolean, default: false },
    }],
    discordChannelId: {
      type: String,
      trim: true,
    },
    discordRoleId: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    season: {
      type: String,
      required: [true, 'Season is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching projects
DSOCProjectSchema.index({ title: 'text', description: 'text', technologies: 'text', tags: 'text' });

export const DSOCProject = mongoose.models.DSOCProject || mongoose.model<IDSOCProject>('DSOCProject', DSOCProjectSchema);
