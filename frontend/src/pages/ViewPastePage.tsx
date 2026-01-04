import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PasteDisplay } from '../components/PasteDisplay';
import { apiService } from '../services/api.service';
import type { GetPasteResponse } from '../services/api.service';

export const ViewPastePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<GetPasteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPaste = async () => {
      if (!id) {
        setError('Invalid paste ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const pasteData = await apiService.getPaste(id);
        setPaste(pasteData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch paste';
        setError(errorMessage);
        setPaste(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ 
              width: '2rem', 
              height: '2rem', 
              margin: '0 auto 1rem auto' 
            }} />
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Loading paste...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">❌ Paste Not Found</h2>
            <p className="card-subtitle">
              The paste you're looking for is not available
            </p>
          </div>
          
          <div className="card-body">
            <div className="alert alert-error">
              <p style={{ margin: 0 }}>
                {error.includes('not found') || error.includes('expired') 
                  ? 'This paste doesn\'t exist, has expired, or has reached its view limit.'
                  : error
                }
              </p>
            </div>

            <div className="btn-group">
              <a href="/" className="btn btn-primary">
                🏠 Go Home
              </a>
              
              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              No paste data available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <PasteDisplay paste={paste} />;
};