import { prisma } from '../config/database';

export class HealthService {
  async checkDatabaseConnectivity(): Promise<boolean> {
    try {
      // Simple query to verify database connectivity
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connectivity check failed:', error);
      return false;
    }
  }
}