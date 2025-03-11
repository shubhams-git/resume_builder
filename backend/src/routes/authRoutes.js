import express from 'express';
import {
  signup,
  signin,
  refreshToken,
  logout
} from '../controllers/authController.js';

const authRoutes = express.Router()
authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
authRoutes.post('/refresh-token', refreshToken);
authRoutes.get('/logout', logout);

export default authRoutes;