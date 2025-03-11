import asyncHandler from 'express-async-handler';
import { ResumeSchema } from '../utils/schemas.js';
import { validateResumeData } from '../middleware/validateMiddleware.js';
import { generatePDF } from '../services/pdfService.js';
import prisma from '../models/prismaClient.js';
import logger from '../utils/logger.js';

// Use the Zod validation middleware in your routes
export const createResume = async (req, res) => {
  try {
    logger.info(`Resume creation attempt by user: ${req.user.id}`);
    const userId = req.user.id;
    const resumeData = req.body;

    const resume = await prisma.resume.create({
      data: {
        ...resumeData,
        userId
      }
    });

    logger.info(`Resume created successfully - ID: ${resume.id}`);
    res.status(201).json({ resume });
  } catch (error) {
    logger.error('Resume creation error:', { 
      error: error.message, 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({ message: 'Error creating resume' });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    logger.info(`Resume update attempt - ID: ${id}, User: ${req.user.id}`);

    const resume = await prisma.resume.update({
      where: { 
        id,
        userId: req.user.id
      },
      data: updateData
    });

    logger.info(`Resume updated successfully - ID: ${id}`);
    res.json({ resume });
  } catch (error) {
    logger.error('Resume update error:', { 
      error: error.message,
      resumeId: req.params.id,
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error updating resume' });
  }
};

export const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Resume retrieval attempt - ID: ${id}, User: ${req.user.id}`);

    const resume = await prisma.resume.findUnique({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!resume) {
      logger.warn(`Resume not found - ID: ${id}`);
      return res.status(404).json({ message: 'Resume not found' });
    }

    logger.info(`Resume retrieved successfully - ID: ${id}`);
    res.json({ resume });
  } catch (error) {
    logger.error('Resume retrieval error:', { 
      error: error.message,
      resumeId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ message: 'Error retrieving resume' });
  }
};

export const generateResumePDF = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`PDF generation attempt - Resume ID: ${id}, User: ${req.user.id}`);

    const resume = await prisma.resume.findUnique({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!resume) {
      logger.warn(`Resume not found for PDF generation - ID: ${id}`);
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Add your PDF generation logic here
    const pdfBuffer = await generatePDF(resume); // You'll need to implement this

    logger.info(`PDF generated successfully - Resume ID: ${id}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('PDF generation error:', { 
      error: error.message,
      resumeId: req.params.id,
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error generating PDF' });
  }
};