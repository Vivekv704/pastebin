import React, { useState } from 'react';
import { PasteForm } from '../components/PasteForm';
import { apiService } from '../services/api.service';
import type { CreatePasteRequest } from '../services/api.service';

export const CreatePastePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successData, setSuccessData] = useState<{ id: string; url: string } | null>(null);

  const handleSubmit = async (data: CreatePasteRequest) => {
    setIsLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const result = await apiService.createPaste(data);
      setSuccessData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create paste');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setSuccessData(null);
    setError('');
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

  if (successData) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🎉 Paste Created Successfully!</h2>
            <p className="card-subtitle">Your paste is ready to share</p>
          </div>
          
          <div className="card-body">
            <div className="alert alert-success">
              <div style={{ marginBottom: '1rem' }}>
                <strong>Paste ID:</strong>
                <div style={{ 
                  fontFamily: 'JetBrains Mono, Consolas, monospace',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'var(--primary-color)',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center'
                }}>
                  {successData.id}
                </div>
              </div>
              
              <div>
                <strong>Shareable URL:</strong>
                <div style={{ 
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  wordBreak: 'break-all',
                  fontSize: '0.875rem'
                }}>
                  <a 
                    href={successData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                  >
                    {successData.url}
                  </a>
                </div>
              </div>
            </div>

            <div className="btn-group">
              <button
                onClick={() => copyToClipboard(successData.url)}
                className="btn btn-primary"
              >
                📋 Copy URL
              </button>
              
              <a
                href={successData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success"
              >
                👁️ View Paste
              </a>
              
              <button
                onClick={handleCreateAnother}
                className="btn btn-secondary"
              >
                ✨ Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PasteForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
      error={error}
    />
  );
};