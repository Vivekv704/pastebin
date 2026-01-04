/**
 * Generates a simple 6-character alphanumeric ID
 * Uses uppercase letters and numbers for better readability
 */
export function generateSimpleId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Validates if an ID matches the expected format
 */
export function isValidId(id: string): boolean {
  return /^[A-Z0-9]{6}$/.test(id);
}