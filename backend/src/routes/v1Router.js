import express from 'express';
import authRoutes from './authRoutes.js';
import resumeRoutes from './resumeRoutes.js';

const v1Router = express.Router();

v1Router.use('/auth',  authRoutes);
v1Router.use('/resumes', resumeRoutes);


export default v1Router;