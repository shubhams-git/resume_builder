/**
 * Rate limiting configuration for different routes
 */
export const rateLimits = {
  auth: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 requests per hour for auth routes
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again later'
    }
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes for general API
    message: {
      success: false,
      message: 'Too many requests, please try again later'
    }
  },
  pdf: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 PDF generations per hour
    message: {
      success: false,
      message: 'Too many PDF generation requests, please try again later'
    }
  }
};

export const defaultOptions = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: false, // Count failed requests against the rate limit
  skipSuccessfulRequests: false, // Count successful requests against the rate limit
  keyGenerator: (req) => req.ip // Use IP address as the key
}; 