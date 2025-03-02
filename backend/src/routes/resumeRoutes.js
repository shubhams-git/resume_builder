import express from 'express';
import {
  createResume,
  getResume,
  updateResume,
  generateResumePDF
} from '../controllers/resumeController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validateResumeData } from '../middleware/validateMiddleware.js';
import { ResumeSchema } from '../utils/schemas.js';

const router = express.Router();

router.use(authenticateUser);

// Apply Zod validation middleware
router.post('/', validateResumeData(ResumeSchema), createResume);
router.put('/:id', validateResumeData(ResumeSchema), updateResume);
router.get('/:id', getResume);
router.post('/:id/generate', generateResumePDF);

export default router;