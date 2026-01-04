import { Request } from 'express';
import { getEnvironmentConfig } from '../config/environment';

export class TimeService {
  getCurrentTime(req?: Request): Date {
    const config = getEnvironmentConfig();
    
    if (config.testMode && req) {
      const testTimeHeader = req.headers['x-test-now-ms'];
      
      if (testTimeHeader && typeof testTimeHeader === 'string') {
        const timestamp = parseInt(testTimeHeader, 10);
        
        if (!isNaN(timestamp)) {
          return new Date(timestamp);
        }
      }
    }
    
    return new Date();
  }
}