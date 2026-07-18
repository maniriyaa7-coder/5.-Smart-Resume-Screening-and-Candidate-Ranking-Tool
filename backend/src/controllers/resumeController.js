import Resume from '../models/Resume.js';
import ParsedResume from '../models/ParsedResume.js';
import ATSScore from '../models/ATSScore.js';
import AIAnalysis from '../models/AIAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import { parseResume } from '../services/resumeParser.js';
import { calculateATSScore } from '../services/atsScoringService.js';
import { generateResumeAnalysis, generateJobMatchAnalysis } from '../services/aiAnalysisService.js';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Upload resume
 * @route   POST /api/resume/upload
 * @access  Private (Candidates only)
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Check if user already has an active resume
    const existingResume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    // If exists, mark as inactive (soft delete)
    if (existingResume) {
      existingResume.isActive = false;
      await existingResume.save();
    }

    // Create resume record
    const resume = await Resume.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/api/resume/download/${req.file.filename}`,
    });

    // Parse resume asynchronously (don't wait for completion)
    parseResumeAsync(resume._id, req.user._id, req.file.path, req.file.mimetype);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully. Parsing in progress...',
      data: {
        resume: resume.toSafeObject(),
      },
    });
  } catch (error) {
    // Clean up uploaded file if database operation fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @desc    Get current user's resume
 * @route   GET /api/resume
 * @access  Private
 */
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resume: resume.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user's resumes (including inactive)
 * @route   GET /api/resume/all
 * @access  Private
 */
export const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        resumes: resumes.map((resume) => resume.toSafeObject()),
        count: resumes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download resume
 * @route   GET /api/resume/download/:filename
 * @access  Private
 */
export const downloadResume = async (req, res, next) => {
  try {
    const { filename } = req.params;

    // Find resume
    const resume = await Resume.findOne({
      filename: filename,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check if user owns the resume or is a recruiter
    if (
      req.user._id.toString() !== resume.userId.toString() &&
      req.user.role !== 'recruiter'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this resume',
      });
    }

    // Check if file exists
    if (!fs.existsSync(resume.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
      });
    }

    // Set headers
    res.setHeader('Content-Type', resume.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${resume.originalName}"`
    );

    // Stream file
    const fileStream = fs.createReadStream(resume.path);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Preview resume
 * @route   GET /api/resume/preview/:filename
 * @access  Private
 */
export const previewResume = async (req, res, next) => {
  try {
    const { filename } = req.params;

    // Find resume
    const resume = await Resume.findOne({
      filename: filename,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check if user owns the resume or is a recruiter
    if (
      req.user._id.toString() !== resume.userId.toString() &&
      req.user.role !== 'recruiter'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to preview this resume',
      });
    }

    // Check if file exists
    if (!fs.existsSync(resume.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
      });
    }

    // Set headers for inline viewing
    res.setHeader('Content-Type', resume.mimeType);
    res.setHeader('Content-Disposition', 'inline');

    // Stream file
    const fileStream = fs.createReadStream(resume.path);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete resume
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find resume
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check if user owns the resume
    if (req.user._id.toString() !== resume.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resume',
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(resume.path)) {
      fs.unlinkSync(resume.path);
    }

    // Delete from database
    await Resume.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Async function to parse resume
 */
const parseResumeAsync = async (resumeId, userId, filePath, mimeType) => {
  try {
    console.log(`Starting resume parsing for ${resumeId}...`);

    // Parse the resume
    const parsedData = await parseResume(filePath, mimeType);

    // Save parsed data to database
    await ParsedResume.create({
      userId: userId,
      resumeId: resumeId,
      ...parsedData,
      isParsed: true,
    });

    console.log(`Resume parsing completed for ${resumeId}`);
  } catch (error) {
    console.error(`Resume parsing failed for ${resumeId}:`, error);

    // Save error to database
    await ParsedResume.create({
      userId: userId,
      resumeId: resumeId,
      isParsed: false,
      parseError: error.message,
    });
  }
};

/**
 * @desc    Get parsed resume data
 * @route   GET /api/resume/parsed/:resumeId
 * @access  Private
 */
export const getParsedResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    // Find parsed resume
    const parsedResume = await ParsedResume.findOne({
      resumeId: resumeId,
      userId: req.user._id,
    });

    if (!parsedResume) {
      return res.status(404).json({
        success: false,
        message: 'Parsed resume data not found. Parsing may still be in progress.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        parsedResume: parsedResume.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's parsed resume
 * @route   GET /api/resume/parsed
 * @access  Private
 */
export const getCurrentParsedResume = async (req, res, next) => {
  try {
    // Find current active resume
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found',
      });
    }

    // Find parsed data for this resume
    const parsedResume = await ParsedResume.findOne({
      resumeId: resume._id,
      userId: req.user._id,
    });

    if (!parsedResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume parsing in progress. Please check back in a moment.',
        isParsing: true,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resume: resume.toSafeObject(),
        parsedResume: parsedResume.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const replaceResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Find current active resume
    const oldResume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    // Mark old resume as inactive
    if (oldResume) {
      oldResume.isActive = false;
      await oldResume.save();
    }

    // Create new resume record
    const newResume = await Resume.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/api/resume/download/${req.file.filename}`,
    });

    // Parse resume asynchronously
    parseResumeAsync(newResume._id, req.user._id, req.file.path, req.file.mimetype);

    res.status(200).json({
      success: true,
      message: 'Resume replaced successfully. Parsing in progress...',
      data: {
        resume: newResume.toSafeObject(),
      },
    });
  } catch (error) {
    // Clean up uploaded file if database operation fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @desc    Analyze resume - Generate ATS Score and AI Analysis
 * @route   POST /api/resume/analyze
 * @access  Private (Candidates only)
 */
export const analyzeResume = async (req, res, next) => {
  try {
    // Get current active resume
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found. Please upload a resume first.',
      });
    }

    // Get parsed resume data
    const parsedResume = await ParsedResume.findOne({
      resumeId: resume._id,
      userId: req.user._id,
      isParsed: true,
    });

    if (!parsedResume) {
      return res.status(400).json({
        success: false,
        message: 'Resume parsing is still in progress. Please try again in a moment.',
      });
    }

    // Calculate ATS Score
    const atsScoreData = calculateATSScore(parsedResume.toObject());

    // Check if ATS score already exists
    let atsScore = await ATSScore.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    if (atsScore) {
      // Update existing
      Object.assign(atsScore, {
        ...atsScoreData,
        parsedResumeId: parsedResume._id,
        calculatedAt: Date.now(),
      });
      await atsScore.save();
    } else {
      // Create new
      atsScore = await ATSScore.create({
        userId: req.user._id,
        resumeId: resume._id,
        parsedResumeId: parsedResume._id,
        ...atsScoreData,
      });
    }

    // Generate AI Analysis
    const aiAnalysisData = await generateResumeAnalysis(parsedResume.toObject());

    // Check if AI analysis already exists
    let aiAnalysis = await AIAnalysis.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    if (aiAnalysis) {
      // Update existing
      Object.assign(aiAnalysis, {
        ...aiAnalysisData,
        parsedResumeId: parsedResume._id,
        analyzedAt: Date.now(),
      });
      await aiAnalysis.save();
    } else {
      // Create new
      aiAnalysis = await AIAnalysis.create({
        userId: req.user._id,
        resumeId: resume._id,
        parsedResumeId: parsedResume._id,
        ...aiAnalysisData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume analysis completed successfully',
      data: {
        atsScore: atsScore.toSafeObject(),
        aiAnalysis: aiAnalysis.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Match resume with job description
 * @route   POST /api/resume/job-match
 * @access  Private (Candidates only)
 */
export const matchJob = async (req, res, next) => {
  try {
    const { jobDescription, jobTitle } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required',
      });
    }

    // Get current active resume
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found. Please upload a resume first.',
      });
    }

    // Get parsed resume data
    const parsedResume = await ParsedResume.findOne({
      resumeId: resume._id,
      userId: req.user._id,
      isParsed: true,
    });

    if (!parsedResume) {
      return res.status(400).json({
        success: false,
        message: 'Resume parsing is still in progress. Please try again in a moment.',
      });
    }

    // Generate job match analysis
    const jobMatchData = await generateJobMatchAnalysis(
      parsedResume.toObject(),
      jobDescription,
      jobTitle || 'Job Position'
    );

    // Create job match record
    const jobMatch = await JobMatch.create({
      userId: req.user._id,
      resumeId: resume._id,
      jobDescription,
      jobTitle: jobTitle || 'Job Position',
      ...jobMatchData,
    });

    res.status(200).json({
      success: true,
      message: 'Job match analysis completed successfully',
      data: {
        jobMatch: jobMatch.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get ATS score for current resume
 * @route   GET /api/resume/ats-score
 * @access  Private
 */
export const getATSScore = async (req, res, next) => {
  try {
    // Get current active resume
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found',
      });
    }

    // Get ATS score
    const atsScore = await ATSScore.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    if (!atsScore) {
      return res.status(404).json({
        success: false,
        message: 'ATS score not found. Please run analysis first.',
        needsAnalysis: true,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        atsScore: atsScore.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get AI analysis for current resume
 * @route   GET /api/resume/ai-analysis
 * @access  Private
 */
export const getAIAnalysis = async (req, res, next) => {
  try {
    // Get current active resume
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found',
      });
    }

    // Get AI analysis
    const aiAnalysis = await AIAnalysis.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    if (!aiAnalysis) {
      return res.status(404).json({
        success: false,
        message: 'AI analysis not found. Please run analysis first.',
        needsAnalysis: true,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        aiAnalysis: aiAnalysis.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all job matches for user
 * @route   GET /api/resume/job-matches
 * @access  Private
 */
export const getJobMatches = async (req, res, next) => {
  try {
    const jobMatches = await JobMatch.find({
      userId: req.user._id,
    })
      .sort({ matchPercentage: -1, createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        jobMatches: jobMatches.map((match) => match.toSafeObject()),
        count: jobMatches.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complete resume dashboard data
 * @route   GET /api/resume/dashboard
 * @access  Private
 */
export const getResumeDashboard = async (req, res, next) => {
  try {
    // Get current active resume
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found',
      });
    }

    // Get parsed resume
    const parsedResume = await ParsedResume.findOne({
      resumeId: resume._id,
      userId: req.user._id,
    });

    // Get ATS score
    const atsScore = await ATSScore.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    // Get AI analysis
    const aiAnalysis = await AIAnalysis.findOne({
      userId: req.user._id,
      resumeId: resume._id,
    });

    // Get recent job matches
    const jobMatches = await JobMatch.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        resume: resume.toSafeObject(),
        parsedResume: parsedResume ? parsedResume.toSafeObject() : null,
        atsScore: atsScore ? atsScore.toSafeObject() : null,
        aiAnalysis: aiAnalysis ? aiAnalysis.toSafeObject() : null,
        recentJobMatches: jobMatches.map((match) => match.toSafeObject()),
        needsAnalysis: !atsScore || !aiAnalysis,
      },
    });
  } catch (error) {
    next(error);
  }
};
