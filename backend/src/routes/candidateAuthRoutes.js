import express from 'express';
import {
  registerCandidate,
  loginCandidate,
  logoutCandidate,
  getCandidateProfile,
  updateCandidateProfile,
} from '../controllers/candidateAuthController.js';
import { protect } from '../middleware/auth.js';
import {
  validateCandidateRegister,
  validateLogin,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateCandidateRegister, registerCandidate);
router.post('/login', validateLogin, loginCandidate);

// Protected routes
router.post('/logout', protect, logoutCandidate);
router.get('/profile', protect, getCandidateProfile);
router.put('/profile', protect, updateCandidateProfile);

export default router;
