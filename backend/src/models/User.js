import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['recruiter', 'candidate'],
      required: [true, 'Role is required'],
    },
    company: {
      type: String,
      trim: true,
    },
    // Candidate fields
    fullName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    candidateStatus: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'interviewed', 'offered'],
      default: 'applied',
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
    interviewNotes: {
      type: String,
      default: '',
    },
    communicationHistory: [
      {
        message: String,
        date: { type: Date, default: Date.now },
        author: { type: String, default: 'Recruiter' },
      },
    ],

    // Recruiter fields
    companyName: {
      type: String,
      trim: true,
    },
    recruiterName: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companyLocation: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'interviewed', 'offered'],
          default: 'applied',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to map name
userSchema.pre('validate', function (next) {
  if (!this.name) {
    this.name = this.fullName || this.recruiterName || 'User';
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.name) {
    this.name = this.fullName || this.recruiterName || 'User';
  }

  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get user without sensitive data
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
