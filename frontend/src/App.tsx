import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CreatePastePage } from './pages/CreatePastePage';
import { ViewPastePage } from './pages/ViewPastePage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

function AppHeader() {
  const location = useLocation();
  const isViewPage = location.pathname.startsWith('/p/');

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <span className="logo-text">PasteBin</span>
          </div>
        </Link>
        
        {isViewPage && (
          <nav className="header-nav">
            <Link to="/" className="nav-button">
              <span className="nav-icon">✨</span>
              Create New
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CreatePastePage />} />
            <Route path="/p/:id" element={<ViewPastePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <p>Made by Vivek Gupta</p>
            <div className="footer-links">
              <span>Fast</span>
              <span>•</span>
              <span>Simple</span>
              <span>•</span>
              <span>User friendly</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
