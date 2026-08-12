import mongoose, { Schema, models } from 'mongoose';

const coreTeamMemberSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  role: { type: String, required: true },
  linkedin: { type: String, required: true },
  order: { type: Number, default: 0 },
  lastModifiedBy: { type: String, default: 'Unknown' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

coreTeamMemberSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const CoreTeamMember = models.CoreTeamMember || mongoose.model('CoreTeamMember', coreTeamMemberSchema); 