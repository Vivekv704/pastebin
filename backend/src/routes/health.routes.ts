import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

router.get('/healthz', healthController.checkHealth.bind(healthController));

export { router as healthRoutes };