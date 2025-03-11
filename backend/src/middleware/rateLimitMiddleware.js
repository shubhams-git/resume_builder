import rateLimit from 'express-rate-limit';
import { rateLimits, defaultOptions } from '../config/rateLimit.js';

/**
 * Creates a rate limiter with the specified configuration
 * @param {Object} config Rate limit configuration
 * @returns {Function} Express middleware
 */
const createLimiter = (config) => {
  return rateLimit({
    ...defaultOptions,
    ...config
  });
};

// Create specific limiters for different routes
export const authLimiter = createLimiter(rateLimits.auth);
export const apiLimiter = createLimiter(rateLimits.api);
export const pdfLimiter = createLimiter(rateLimits.pdf);

/**
 * Global rate limit middleware that applies different limits based on route type
 */
const rateLimitMiddleware = (req, res, next) => {
  const path = req.path.toLowerCase();
  
  // Apply PDF generation limit
  if (path.includes('/generate')) {
    return pdfLimiter(req, res, next);
  }
  
  // Apply auth limit to authentication routes
  if (path.includes('/auth/')) {
    return authLimiter(req, res, next);
  }
  
  // Apply general API limit to all other routes
  return apiLimiter(req, res, next);
};

export default rateLimitMiddleware;