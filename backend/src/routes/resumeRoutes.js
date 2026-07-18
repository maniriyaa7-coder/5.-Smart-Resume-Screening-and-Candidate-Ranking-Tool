import express from 'express';
import {
  uploadResume,
  getResume,
  getAllResumes,
  downloadResume,
  previewResume,
  deleteResume,
  replaceResume,
  getParsedResume,
  getCurrentParsedResume,
  analyzeResume,
  matchJob,
  getATSScore,
  getAIAnalysis,
  getJobMatches,
  getResumeDashboard,
} from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload, { handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Upload resume (candidates only)
router.post(
  '/upload',
  authorize('candidate'),
  upload.single('resume'),
  handleMulterError,
  uploadResume
);

// Replace resume (candidates only)
router.put(
  '/replace',
  authorize('candidate'),
  upload.single('resume'),
  handleMulterError,
  replaceResume
);

// Get current user's active resume
router.get('/', getResume);

// Get current user's parsed resume data
router.get('/parsed', getCurrentParsedResume);

// Get all user's resumes
router.get('/all', getAllResumes);

// Get parsed data for specific resume
router.get('/parsed/:resumeId', getParsedResume);

// Download resume
router.get('/download/:filename', downloadResume);

// Preview resume
router.get('/preview/:filename', previewResume);

// Delete resume
router.delete('/:id', deleteResume);

// AI Analysis routes (candidates only)
router.post('/analyze', authorize('candidate'), analyzeResume);
router.post('/job-match', authorize('candidate'), matchJob);
router.get('/ats-score', getATSScore);
router.get('/ai-analysis', getAIAnalysis);
router.get('/job-matches', getJobMatches);
router.get('/dashboard', getResumeDashboard);

export default router;
