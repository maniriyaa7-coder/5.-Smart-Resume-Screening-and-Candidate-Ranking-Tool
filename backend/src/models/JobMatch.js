import mongoose from 'mongoose';

const jobMatchSchema = new mongoose.Schema(
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
    jobDescription: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: 'Job Position',
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchingSkills: [String],
    missingKeywords: [String],
    suggestions: [String],
    skillGaps: [
      {
        skill: String,
        importance: { type: String, enum: ['critical', 'important', 'nice-to-have'] },
      },
    ],
    strengthAreas: [String],
    improvementAreas: [String],
    fitScore: {
      technical: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
jobMatchSchema.index({ userId: 1, resumeId: 1 });
jobMatchSchema.index({ matchPercentage: -1 });
jobMatchSchema.index({ analyzedAt: -1 });

// Method to get safe object
jobMatchSchema.methods.toSafeObject = function () {
  const match = this.toObject();
  delete match.__v;
  return match;
};

const JobMatch = mongoose.model('JobMatch', jobMatchSchema);

export default JobMatch;
