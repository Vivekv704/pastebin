import React from 'react';
import type { GetPasteResponse } from '../services/api.service';

interface PasteDisplayProps {
  paste: GetPasteResponse;
}

export const PasteDisplay: React.FC<PasteDisplayProps> = ({ paste }) => {
  const formatExpiresAt = (expiresAt: string | null): string => {
    if (!expiresAt) return 'Never';
    
    const date = new Date(expiresAt);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const formatRemainingViews = (remainingViews: number | null): string => {
    if (remainingViews === null) return 'Unlimited';
    return remainingViews.toString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (execErr) {
        console.warn('Fallback copy failed:', execErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📄 Paste Content</h2>
          <div className="paste-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Expires</span>
              <span className="metadata-value">{formatExpiresAt(paste.expires_at)}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Remaining Views</span>
              <span className="metadata-value">{formatRemainingViews(paste.remaining_views)}</span>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="paste-content-container">
            <div className="paste-content-header">
              <span>Content</span>
              <span>{paste.content.length} characters</span>
            </div>
            
            <div className="paste-content-body">
              <pre className="paste-content-pre">{paste.content}</pre>
            </div>
          </div>

          <div className="btn-group">
            <button
              onClick={() => copyToClipboard(paste.content)}
              className="btn btn-primary"
            >
              📋 Copy Content
            </button>
            
            <button
              onClick={() => copyToClipboard(window.location.href)}
              className="btn btn-secondary"
            >
              🔗 Copy Link
            </button>
            
            <a
              href="/"
              className="btn btn-success"
            >
              ✨ Create New Paste
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};