import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: { path: string; label: string; roles: UserRole[] }[] = [
    { path: '/content', label: '콘텐츠 관리', roles: ['editor', 'reviewer', 'admin'] },
    { path: '/imports', label: '가져오기', roles: ['editor', 'admin'] },
    { path: '/review', label: '검수 대기열', roles: ['reviewer', 'admin'] },
    { path: '/settings', label: '설정', roles: ['admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar Overlay for mobile */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ 
            position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, 
            background: '#4F46E5', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' 
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: isSidebarOpen ? '250px' : '0',
        overflow: 'hidden',
        backgroundColor: '#1F2937', 
        color: '#fff', 
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        position: 'relative'
      }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#F9FAFB', margin: 0, fontSize: '1.25rem' }}>Levo Admin</h2>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', flex: 1, padding: '0 1rem' }}>
          {visibleMenuItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  color: isActive ? '#fff' : '#D1D5DB', 
                  backgroundColor: isActive ? '#374151' : 'transparent',
                  textDecoration: 'none', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '0.375rem',
                  display: 'block',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'background-color 0.2s'
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #374151', backgroundColor: '#111827' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.name}</span>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', backgroundColor: '#374151', padding: '0.125rem 0.375rem', borderRadius: '9999px', alignSelf: 'flex-start' }}>
              {user?.role}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', padding: '0.5rem', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB', overflowX: 'hidden' }}>
        <div style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
