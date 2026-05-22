import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  email: string;
  content: string;
  cta?: string;
  videoUrl?: string;
  imageUrl?: string;
  type: 'text' | 'video';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'], // e.g., Mentee, Fellow, Mentor
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
    },
    cta: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '/avatar.svg',
    },
    type: {
      type: String,
      enum: ['text', 'video'],
      default: 'text',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
