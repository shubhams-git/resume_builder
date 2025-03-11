import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import config from './config/index.js';
import rateLimitMiddleware from './middleware/rateLimitMiddleware.js';
import v1Router from './routes/v1Router.js';
import { requestLogger } from './middleware/requestLogger.js';
import logger from './utils/logger.js';

const app = express();

// Log startup
logger.info(`Application starting in ${config.env} environment`);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(rateLimitMiddleware);
app.use(requestLogger);

// Routes
app.use('/api/v1', v1Router);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Log successful setup
logger.info('Express app configured successfully');

export default app;