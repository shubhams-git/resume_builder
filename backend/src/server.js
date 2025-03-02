// src/server.js
import app from './app.js';
import config from './config/index.js';
import prisma from './models/prismaClient.js';
import { logger } from './utils/logger.js';

const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.env} mode on port ${config.port}`);
});

// Handle database connection and graceful shutdown
const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connection established');

    server.on('close', async () => {
      await prisma.$disconnect();
      logger.info('Server closed - Database connection disconnected');
    });

  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
const shutdown = async (signal) => {
  logger.info(`${signal} received: closing server`);
  
  try {
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await prisma.$disconnect();
    logger.info('Server successfully shutdown');
    process.exit(0);
    
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle signals
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
  process.on(signal, () => {
    shutdown(signal).catch(err => {
      logger.error('Forced shutdown:', err);
      process.exit(1);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  shutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});