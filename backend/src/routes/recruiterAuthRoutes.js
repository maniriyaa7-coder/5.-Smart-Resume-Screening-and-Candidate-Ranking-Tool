import express from 'express';
import {
  registerRecruiter,
  loginRecruiter,
  logoutRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  getAllCandidatesForRecruiter,
  updateCandidateStatus,
  getRecruiterAnalytics,
  importCandidates,
  getCandidateDetails,
  updateCandidateNotes,
} from '../controllers/recruiterAuthController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateRecruiterRegister,
  validateLogin,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRecruiterRegister, registerRecruiter);
router.post('/login', validateLogin, loginRecruiter);

// Protected routes
router.post('/logout', protect, logoutRecruiter);
router.get('/profile', protect, getRecruiterProfile);
router.put('/profile', protect, updateRecruiterProfile);

// Recruiter specific management routes
router.get('/candidates', protect, authorize('recruiter'), getAllCandidatesForRecruiter);
router.get('/candidates/:id', protect, authorize('recruiter'), getCandidateDetails);
router.patch('/candidates/:id/status', protect, authorize('recruiter'), updateCandidateStatus);
router.patch('/candidates/:id/notes', protect, authorize('recruiter'), updateCandidateNotes);
router.get('/analytics', protect, authorize('recruiter'), getRecruiterAnalytics);
router.post('/candidates/import', protect, authorize('recruiter'), importCandidates);

export default router;


