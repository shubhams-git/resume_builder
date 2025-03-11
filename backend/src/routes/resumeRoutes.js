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

const resumeRoutes = express.Router();

resumeRoutes.use(authenticateUser);

resumeRoutes.post('/',validateResumeData(ResumeSchema), createResume);
resumeRoutes.get('/:id', getResume);
resumeRoutes.put('/:id', validateResumeData(ResumeSchema), updateResume);
resumeRoutes.post('/:id/generate', generateResumePDF);

export default resumeRoutes;