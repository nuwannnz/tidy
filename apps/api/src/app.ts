import express, { Application, Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiError } from '@tidy/shared-types';
import { env } from './utils/env';
import { authRouter } from './routes/auth';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input sanitization middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Sanitize URL parameters
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = String(req.params[key]).replace(/[<>]/g, '');
    });
  }
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = String(req.query[key]).replace(/[<>]/g, '');
      }
    });
  }
  next();
});

// Auth routes
app.use('/api/v1/auth', authRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse<string> = {
    data: 'API is running',
    message: 'Health check successful',
    statusCode: 200,
  };
  res.status(200).json(response);
});

// Versioned health check endpoint (used by Docker local dev)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  const response: ApiResponse<string> = {
    data: 'Welcome to Tidy API',
    message: 'API is running successfully',
    statusCode: 200,
  };
  res.status(200).json(response);
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);

  const errorResponse: ApiError = {
    statusCode: 500,
    message: 'Internal server error',
    error: err.message,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  res.status(500).json(errorResponse);
});

export { app };
