import asyncHandler from 'express-async-handler';
import prisma from '../models/prismaClient.js';
import bcrypt from 'bcrypt';

// Get current user profile
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    data: user
  });
});

// Update user profile
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const updateData = {};

  // Basic validation
  if (name) {
    if (typeof name !== 'string' || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }
    updateData.name = name;
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== req.user.email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const existingUser = await prisma.user.findUnique({ 
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    updateData.email = email;
  }

  // Handle password update if provided
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required to update password'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    updateData.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  updateData.updatedAt = new Date();

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    data: updatedUser
  });
});

// Delete user account
export const deleteUser = asyncHandler(async (req, res) => {
  await prisma.user.delete({
    where: { id: req.user.id }
  });

  res.json({
    success: true,
    message: 'User account deleted successfully'
  });
});

// Get user's resumes
export const getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await prisma.resume.findMany({
    where: { userId: req.user.id },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  res.json({
    success: true,
    data: resumes
  });
});
