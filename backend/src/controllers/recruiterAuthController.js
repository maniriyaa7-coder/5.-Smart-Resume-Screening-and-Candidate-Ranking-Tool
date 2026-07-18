import Recruiter from '../models/Recruiter.js';
import Resume from '../models/Resume.js';
import ParsedResume from '../models/ParsedResume.js';
import ATSScore from '../models/ATSScore.js';
import {
  generateTokenPair,
  setTokenCookies,
  clearTokenCookies,
  verifyRefreshToken,
} from '../utils/jwt.js';

/**
 * @desc    Register new recruiter
 * @route   POST /api/auth/recruiter/register
 * @access  Public
 */
export const registerRecruiter = async (req, res, next) => {
  try {
    const {
      companyName,
      recruiterName,
      email,
      password,
      phoneNumber,
      companyWebsite,
      companyLocation,
    } = req.body;
    console.log(`[REGISTRATION] Attempting recruiter registration for email: ${email}`);

    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    console.log(`[REGISTRATION] Existing recruiter check: ${existingRecruiter ? 'Found' : 'Not Found'}`);

    if (existingRecruiter) {
      console.log(`[REGISTRATION] Recruiter registration failed: Email ${email} already registered`);
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create recruiter
    const recruiter = await Recruiter.create({
      companyName,
      recruiterName,
      email,
      password,
      phoneNumber,
      companyWebsite,
      companyLocation,
      role: 'recruiter', // Explicitly specify recruiter role for unified model
    });
    console.log(`[REGISTRATION] Recruiter successfully created in DB: ${recruiter._id}`);

    // Generate tokens
    console.log('[REGISTRATION] Generating JWT tokens...');
    const { accessToken, refreshToken } = generateTokenPair(recruiter._id, 'recruiter');
    console.log('[REGISTRATION] Tokens generated successfully');

    // Save refresh token to database
    recruiter.refreshToken = refreshToken;
    await recruiter.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken, false);

    console.log('[REGISTRATION] Returning successful response (201)');
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: recruiter.toSafeObject(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`[REGISTRATION] Error occurred during recruiter registration: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Login recruiter
 * @route   POST /api/auth/recruiter/login
 * @access  Public
 */
export const loginRecruiter = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log(`[LOGIN] Recruiter login request received for email: ${email}`);

    // Find recruiter and include password field
    const recruiter = await Recruiter.findOne({ email }).select('+password');
    console.log(`[LOGIN] Recruiter lookup result: ${recruiter ? 'Found' : 'Not Found'}`);

    if (!recruiter) {
      console.log('[LOGIN] Login failed: Recruiter not found in DB');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log(`[LOGIN] Stored hashed password: ${recruiter.password}`);

    // Check if recruiter is active
    if (!recruiter.isActive) {
      console.log('[LOGIN] Login failed: Account is inactive');
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await recruiter.comparePassword(password);
    console.log(`[LOGIN] Password validation (bcrypt.compare) result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log('[LOGIN] Login failed: Incorrect password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    recruiter.lastLogin = new Date();

    // Generate tokens
    console.log('[LOGIN] Generating JWT token pair...');
    const { accessToken, refreshToken } = generateTokenPair(recruiter._id, 'recruiter');
    console.log('[LOGIN] Tokens generated successfully');

    // Save refresh token to database
    recruiter.refreshToken = refreshToken;
    await recruiter.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken, rememberMe);

    console.log('[LOGIN] Returning successful response (200)');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: recruiter.toSafeObject(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(`[LOGIN] Error occurred during recruiter login: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Logout recruiter
 * @route   POST /api/auth/recruiter/logout
 * @access  Private
 */
export const logoutRecruiter = async (req, res, next) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      await Recruiter.findByIdAndUpdate(req.user._id, {
        refreshToken: null,
      });
    }

    // Clear cookies
    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recruiter profile
 * @route   GET /api/auth/recruiter/profile
 * @access  Private
 */
export const getRecruiterProfile = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.user._id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: recruiter.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update recruiter profile
 * @route   PUT /api/auth/recruiter/profile
 * @access  Private
 */
export const updateRecruiterProfile = async (req, res, next) => {
  try {
    const {
      companyName,
      recruiterName,
      phoneNumber,
      companyWebsite,
      companyLocation,
    } = req.body;

    const recruiter = await Recruiter.findById(req.user._id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found',
      });
    }

    // Update fields
    if (companyName) recruiter.companyName = companyName;
    if (recruiterName) recruiter.recruiterName = recruiterName;
    if (phoneNumber) recruiter.phoneNumber = phoneNumber;
    if (companyWebsite) recruiter.companyWebsite = companyWebsite;
    if (companyLocation) recruiter.companyLocation = companyLocation;

    await recruiter.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: recruiter.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all candidates for recruiter dashboard
 * @route   GET /api/auth/recruiter/candidates
 * @access  Private (Recruiter only)
 */
export const getAllCandidatesForRecruiter = async (req, res, next) => {
  try {
    const candidates = await Recruiter.find({ role: 'candidate' });
    
    const candidatesWithDetails = await Promise.all(
      candidates.map(async (cand) => {
        // Fetch active resume
        const resume = await Resume.findOne({ userId: cand._id, isActive: true });
        
        let parsedResume = null;
        let atsScore = null;
        
        if (resume) {
          parsedResume = await ParsedResume.findOne({ resumeId: resume._id });
          atsScore = await ATSScore.findOne({ resumeId: resume._id });
        }
        
        return {
          ...cand.toSafeObject(),
          candidateStatus: cand.candidateStatus || 'applied',
          resume: resume ? resume.toSafeObject() : null,
          parsedResume: parsedResume ? parsedResume.toSafeObject() : null,
          atsScore: atsScore ? atsScore.toSafeObject() : null,
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        candidates: candidatesWithDetails,
        count: candidatesWithDetails.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update candidate application status
 * @route   PATCH /api/auth/recruiter/candidates/:id/status
 * @access  Private (Recruiter only)
 */
export const updateCandidateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['applied', 'shortlisted', 'rejected', 'interviewed', 'offered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }
    
    const candidate = await Recruiter.findOneAndUpdate(
      { _id: id, role: 'candidate' },
      { candidateStatus: status },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Candidate status updated to ${status} successfully`,
      data: {
        candidate: candidate.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recruiter dashboard analytics
 * @route   GET /api/auth/recruiter/analytics
 * @access  Private (Recruiter only)
 */
export const getRecruiterAnalytics = async (req, res, next) => {
  try {
    const totalCandidates = await Recruiter.countDocuments({ role: 'candidate' });
    const shortlistedCandidates = await Recruiter.countDocuments({ role: 'candidate', candidateStatus: 'shortlisted' });
    const rejectedCandidates = await Recruiter.countDocuments({ role: 'candidate', candidateStatus: 'rejected' });
    const interviewedCandidates = await Recruiter.countDocuments({ role: 'candidate', candidateStatus: 'interviewed' });
    const offeredCandidates = await Recruiter.countDocuments({ role: 'candidate', candidateStatus: 'offered' });
    
    const statusBreakdown = {
      applied: await Recruiter.countDocuments({ role: 'candidate', candidateStatus: 'applied' }),
      shortlisted: shortlistedCandidates,
      rejected: rejectedCandidates,
      interviewed: interviewedCandidates,
      offered: offeredCandidates,
    };
    
    const candidatesList = await Recruiter.find({ role: 'candidate' });
    const monthlyTrend = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach((m) => {
      monthlyTrend[m] = { name: m, candidates: 0, hired: 0 };
    });
    
    candidatesList.forEach((cand) => {
      const date = new Date(cand.createdAt);
      const monthName = months[date.getMonth()];
      if (monthlyTrend[monthName]) {
        monthlyTrend[monthName].candidates += 1;
        if (cand.candidateStatus === 'offered') {
          monthlyTrend[monthName].hired += 1;
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalCandidates,
        shortlistedCandidates,
        rejectedCandidates,
        interviewedCandidates,
        offeredCandidates,
        statusBreakdown,
        monthlyTrend: Object.values(monthlyTrend),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk import candidates
 * @route   POST /api/auth/recruiter/candidates/import
 * @access  Private (Recruiter only)
 */
export const importCandidates = async (req, res, next) => {
  try {
    const { candidates } = req.body;
    
    if (!Array.isArray(candidates)) {
      return res.status(400).json({
        success: false,
        message: 'Candidates data must be an array',
      });
    }
    
    const imported = [];
    
    for (const cand of candidates) {
      const existing = await Recruiter.findOne({ email: cand.email.toLowerCase() });
      if (existing) continue;
      
      const newCand = await Recruiter.create({
        fullName: cand.fullName,
        email: cand.email.toLowerCase(),
        password: 'Password123', // Default password
        phoneNumber: cand.phoneNumber || '0000000000',
        college: cand.college || 'N/A',
        skills: Array.isArray(cand.skills) ? cand.skills : (cand.skills ? cand.skills.split(',').map(s => s.trim()) : []),
        currentLocation: cand.currentLocation || 'N/A',
        role: 'candidate',
        candidateStatus: cand.candidateStatus || 'applied',
      });
      
      imported.push(newCand.toSafeObject());
    }
    
    res.status(201).json({
      success: true,
      message: `Successfully imported ${imported.length} candidates`,
      data: {
        imported,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed profile of a candidate
 * @route   GET /api/auth/recruiter/candidates/:id
 * @access  Private (Recruiter only)
 */
export const getCandidateDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cand = await Recruiter.findOne({ _id: id, role: 'candidate' });
    if (!cand) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // Fetch active resume
    const resume = await Resume.findOne({ userId: cand._id, isActive: true });
    let parsedResume = null;
    let atsScore = null;
    let aiAnalysis = null;

    if (resume) {
      parsedResume = await ParsedResume.findOne({ resumeId: resume._id });
      atsScore = await ATSScore.findOne({ resumeId: resume._id });
      // Find AIAnalysis for this resume
      const AIAnalysisModel = mongoose.model('AIAnalysis');
      if (AIAnalysisModel) {
        aiAnalysis = await AIAnalysisModel.findOne({ resumeId: resume._id });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        candidate: {
          ...cand.toSafeObject(),
          recruiterNotes: cand.recruiterNotes || '',
          interviewNotes: cand.interviewNotes || '',
          communicationHistory: cand.communicationHistory || [],
        },
        resume: resume ? resume.toSafeObject() : null,
        parsedResume: parsedResume ? parsedResume.toSafeObject() : null,
        atsScore: atsScore ? atsScore.toSafeObject() : null,
        aiAnalysis: aiAnalysis ? aiAnalysis.toSafeObject() : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update candidate notes and communication history
 * @route   PATCH /api/auth/recruiter/candidates/:id/notes
 * @access  Private (Recruiter only)
 */
export const updateCandidateNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { recruiterNotes, interviewNotes, communicationMessage } = req.body;

    const cand = await Recruiter.findOne({ _id: id, role: 'candidate' });
    if (!cand) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    if (recruiterNotes !== undefined) cand.recruiterNotes = recruiterNotes;
    if (interviewNotes !== undefined) cand.interviewNotes = interviewNotes;
    
    if (communicationMessage) {
      cand.communicationHistory.push({
        message: communicationMessage,
        date: new Date(),
        author: req.user.name || 'Recruiter',
      });
    }

    await cand.save();

    res.status(200).json({
      success: true,
      message: 'Candidate notes updated successfully',
      data: {
        candidate: cand.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};


