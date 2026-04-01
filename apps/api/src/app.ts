import express, { Application, Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiError } from '@tidy/shared-types';

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input sanitization middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Sanitize URL parameters
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      req.params[key] = String(req.params[key]).replace(/[<>]/g, '');
    });
  }
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = String(req.query[key]).replace(/[<>]/g, '');
      }
    });
  }
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse<string> = {
    data: 'API is running',
    message: 'Health check successful',
    statusCode: 200,
  };
  res.status(200).json(response);
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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

// Only start server if not in Lambda environment
if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}
