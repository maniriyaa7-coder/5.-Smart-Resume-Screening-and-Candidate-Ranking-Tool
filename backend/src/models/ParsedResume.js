import mongoose from 'mongoose';

const parsedResumeSchema = new mongoose.Schema(
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
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    skills: [
      {
        type: String,
      },
    ],
    experience: [
      {
        position: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    rawText: {
      type: String,
      select: false, // Don't return by default
    },
    isParsed: {
      type: Boolean,
      default: false,
    },
    parseError: {
      type: String,
      default: null,
    },
    parsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
parsedResumeSchema.index({ userId: 1, resumeId: 1 });
parsedResumeSchema.index({ isParsed: 1 });

// Method to get safe object
parsedResumeSchema.methods.toSafeObject = function () {
  const parsed = this.toObject();
  delete parsed.__v;
  delete parsed.rawText;
  return parsed;
};

const ParsedResume = mongoose.model('ParsedResume', parsedResumeSchema);

export default ParsedResume;
