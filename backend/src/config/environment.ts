export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  frontendBaseUrl: string;
  testMode: boolean;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
    frontendBaseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
    testMode: process.env.TEST_MODE === '1',
  };
}

export function validateEnvironment(): void {
  const config = getEnvironmentConfig();
  
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  if (!config.frontendBaseUrl) {
    throw new Error('FRONTEND_BASE_URL environment variable is required');
  }
}