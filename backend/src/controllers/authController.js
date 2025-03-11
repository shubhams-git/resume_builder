import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../models/prismaClient.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration
  });

  const refreshToken = jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiration
  });
  return { accessToken, refreshToken };
};

export const signup = async (req, res) => {
  try {
    logger.info('New user signup attempt');
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logger.warn(`Signup failed: Email already exists - ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    logger.info(`User successfully created with ID: ${user.id}`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    logger.error('Signup error:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const signin = async (req, res) => {
  try {
    logger.info('User signin attempt');
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`Signin failed: User not found - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Signin failed: Invalid password for user - ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User successfully signed in - ${user.id}`);
    res.json({ token });
  } catch (error) {
    logger.error('Signin error:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Error during signin' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    logger.info('Token refresh attempt');
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`Token refreshed successfully for user - ${decoded.userId}`);
    res.json({ token: newToken });
  } catch (error) {
    logger.error('Token refresh error:', { error: error.message });
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = async (req, res) => {
  try {
    logger.info(`User logout - ${req.user?.id || 'unknown'}`);
    // Implement any necessary logout logic here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', { error: error.message });
    res.status(500).json({ message: 'Error during logout' });
  }
};