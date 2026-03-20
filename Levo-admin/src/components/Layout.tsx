import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1a1a2e', color: '#fff', padding: '1rem' }}>
        <h2 style={{ color: '#4361ee' }}>Levo Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/content" style={{ color: '#fff', textDecoration: 'none' }}>Content</Link>
          <Link to="/imports" style={{ color: '#fff', textDecoration: 'none' }}>Imports</Link>
          <Link to="/review" style={{ color: '#fff', textDecoration: 'none' }}>Review Queue</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
        {/* Top bar */}
        <header style={{ backgroundColor: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{user?.name || 'Admin User'} ({user?.role})</span>
            <button 
              onClick={handleLogout}
              style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
