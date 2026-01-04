import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  async checkHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isHealthy = await this.healthService.checkDatabaseConnectivity();
      
      if (isHealthy) {
        res.status(200).json({ ok: true });
      } else {
        res.status(503).json({ 
          error: 'Database connectivity check failed',
          code: 'DATABASE_UNAVAILABLE'
        });
      }
    } catch (error) {
      next(error);
    }
  }
}