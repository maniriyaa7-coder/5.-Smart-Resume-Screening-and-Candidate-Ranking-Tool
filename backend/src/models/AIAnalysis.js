import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema(
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
    summary: {
      type: String,
      default: '',
    },
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    suggestedImprovements: [String],
    recommendedTechnologies: [String],
    careerSuggestions: [String],
    interviewPreparationTips: [String],
    industryInsights: [String],
    experienceLevel: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
      default: 'mid',
    },
    estimatedSalaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
    },
    topSkills: [String],
    improvementPriority: [
      {
        area: String,
        priority: { type: String, enum: ['high', 'medium', 'low'] },
        suggestion: String,
      },
    ],
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
    aiModel: {
      type: String,
      default: 'groq-llama',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
aiAnalysisSchema.index({ userId: 1, resumeId: 1 });
aiAnalysisSchema.index({ analyzedAt: -1 });

// Method to get safe object
aiAnalysisSchema.methods.toSafeObject = function () {
  const analysis = this.toObject();
  delete analysis.__v;
  return analysis;
};

const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);

export default AIAnalysis;
