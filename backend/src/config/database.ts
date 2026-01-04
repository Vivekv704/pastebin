import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function runMigrations(): Promise<void> {
  try {
    console.log('🔄 Connecting to database...');
    
    // Ensure database connection
    await prisma.$connect();
    
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}