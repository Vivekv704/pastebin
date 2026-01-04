import React, { useState } from 'react';
import type { CreatePasteRequest } from '../services/api.service';
import { validatePasteContent, validateTTL, validateMaxViews } from '../utils/validation';

interface PasteFormProps {
  onSubmit: (data: CreatePasteRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const PasteForm: React.FC<PasteFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState<string>('');
  const [maxViews, setMaxViews] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{
    content?: string;
    ttl?: string;
    maxViews?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate content
    const contentError = validatePasteContent(content);
    if (contentError) {
      errors.content = contentError;
    }

    // Validate TTL
    if (ttlSeconds.trim()) {
      const ttlNum = parseInt(ttlSeconds, 10);
      const ttlError = validateTTL(isNaN(ttlNum) ? undefined : ttlNum);
      if (ttlError || isNaN(ttlNum)) {
        errors.ttl = ttlError || 'TTL must be a valid number';
      }
    }

    // Validate max views
    if (maxViews.trim()) {
      const maxViewsNum = parseInt(maxViews, 10);
      const maxViewsError = validateMaxViews(isNaN(maxViewsNum) ? undefined : maxViewsNum);
      if (maxViewsError || isNaN(maxViewsNum)) {
        errors.maxViews = maxViewsError || 'Max views must be a valid number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: CreatePasteRequest = {
      content: content.trim(),
    };

    if (ttlSeconds.trim()) {
      data.ttl_seconds = parseInt(ttlSeconds, 10);
    }

    if (maxViews.trim()) {
      data.max_views = parseInt(maxViews, 10);
    }

    await onSubmit(data);
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Create New Paste</h2>
          <p className="card-subtitle">Share your text securely with optional expiration and view limits</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Paste Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text here..."
                className={`form-textarea ${validationErrors.content ? 'error' : ''}`}
                disabled={isLoading}
                rows={10}
              />
              {validationErrors.content && (
                <span className="field-error">
                  {validationErrors.content}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ttl" className="form-label">
                  Expiration (seconds)
                </label>
                <input
                  id="ttl"
                  type="number"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  placeholder="Optional (e.g., 3600 for 1 hour)"
                  min="1"
                  className={`form-input ${validationErrors.ttl ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {validationErrors.ttl && (
                  <span className="field-error">
                    {validationErrors.ttl}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="maxViews" className="form-label">
                  Max Views
                </label>
                <input
                  id="maxViews"
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="Optional (e.g., 10)"
                  min="1"
                  className={`form-input ${validationErrors.maxViews ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {validationErrors.maxViews && (
                  <span className="field-error">
                    {validationErrors.maxViews}
                  </span>
                )}
              </div>
            </div>

            <div className="btn-group">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading && <span className="loading-spinner" />}
                {isLoading ? 'Creating...' : '✨ Create Paste'}
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};