import express from 'express';
import {
  createJob,
  editJob,
  deleteJob,
  getJobs,
  getJobDetails,
  applyJob,
  withdrawJob,
  saveJob,
  getJobAnalytics,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Publicly view jobs
router.get('/', getJobs);
router.get('/:id', getJobDetails);

// Protected routes (require login)
router.use(protect);

// Recruiter only routes
router.post('/', authorize('recruiter'), createJob);
router.put('/:id', authorize('recruiter'), editJob);
router.delete('/:id', authorize('recruiter'), deleteJob);
router.get('/:id/analytics', authorize('recruiter'), getJobAnalytics);

// Candidate only routes
router.post('/:id/apply', authorize('candidate'), applyJob);
router.post('/:id/withdraw', authorize('candidate'), withdrawJob);
router.post('/:id/save', authorize('candidate'), saveJob);

export default router;
