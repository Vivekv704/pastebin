import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRoutes } from './routes/health.routes';
import { pasteRoutes } from './routes/paste.routes';
import { errorHandler } from './middleware/error.middleware';
import { runMigrations } from './config/database';

export async function createServer(): Promise<express.Application> {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  const allowedOrigins = process.env.FRONTEND_BASE_URL 
    ? [process.env.FRONTEND_BASE_URL]
    : ['http://localhost:5173'];
    
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Run database migrations on startup
  await runMigrations();

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api', pasteRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}