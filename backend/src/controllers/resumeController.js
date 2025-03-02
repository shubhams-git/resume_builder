import asyncHandler from 'express-async-handler';
import { ResumeSchema } from '../utils/schemas.js';
import { validateResumeData } from '../middleware/validateMiddleware.js';
import { generatePDF } from '../services/pdfService.js';
import prisma from '../models/prismaClient.js';

// Use the Zod validation middleware in your routes
export const createResume = asyncHandler(async (req, res) => {
  const { user } = req;
  const validatedData = req.validatedData;

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      ...validatedData
    }
  });

  res.status(201).json({
    success: true,
    data: resume
  });
});

export const updateResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = req.validatedData;

  const updatedResume = await prisma.resume.update({
    where: { id, userId: req.user.id },
    data: validatedData
  });

  res.json({
    success: true,
    data: updatedResume
  });
});