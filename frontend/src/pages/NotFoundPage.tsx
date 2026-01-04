import React from 'react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔍 Page Not Found</h2>
          <p className="card-subtitle">The page you're looking for doesn't exist</p>
        </div>
        
        <div className="card-body">
          <div className="alert alert-info">
            <p style={{ margin: 0 }}>
              The URL you entered doesn't match any pages on our site. 
              This might happen if the paste has expired or the link is incorrect.
            </p>
          </div>

          <div className="btn-group">
            <a href="/" className="btn btn-primary">
              🏠 Go Home
            </a>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};