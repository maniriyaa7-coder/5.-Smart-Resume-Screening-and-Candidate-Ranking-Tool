import mongoose from 'mongoose';

const atsScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    parsedResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParsedResume',
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    breakdown: {
      skillsMatch: {
        score: { type: Number, default: 0 },
        weight: { type: Number, default: 30 },
      },
      experience: {
        score: { type: Number, default: 0 },
        weight: { type: Number, default: 25 },
      },
      education: {
        score: { type: Number, default: 0 },
        weight: { type: Number, default: 20 },
      },
      formatting: {
        score: { type: Number, default: 0 },
        weight: { type: Number, default: 15 },
      },
      keywords: {
        score: { type: Number, default: 0 },
        weight: { type: Number, default: 10 },
      },
    },
    missingSkills: [String],
    recommendations: [String],
    strengths: [String],
    weaknesses: [String],
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
atsScoreSchema.index({ userId: 1, resumeId: 1 });
atsScoreSchema.index({ overallScore: -1 });

// Method to get safe object
atsScoreSchema.methods.toSafeObject = function () {
  const ats = this.toObject();
  delete ats.__v;
  return ats;
};

const ATSScore = mongoose.model('ATSScore', atsScoreSchema);

export default ATSScore;
