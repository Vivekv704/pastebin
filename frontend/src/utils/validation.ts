// Validation utilities will be implemented here

export const validatePasteContent = (content: string): string | null => {
  if (!content || content.trim().length === 0) {
    return 'Content is required';
  }
  return null;
};

export const validateTTL = (ttl?: number): string | null => {
  if (ttl !== undefined && (ttl < 1 || !Number.isInteger(ttl))) {
    return 'TTL must be a positive integer';
  }
  return null;
};

export const validateMaxViews = (maxViews?: number): string | null => {
  if (maxViews !== undefined && (maxViews < 1 || !Number.isInteger(maxViews))) {
    return 'Max views must be a positive integer';
  }
  return null;
};