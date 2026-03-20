import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { setAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Fake login for now
    setAuthenticated(
      { id: '1', email: 'admin@levo.com', name: 'Admin', role: 'admin' },
      { accessToken: 'fake-access', refreshToken: 'fake-refresh' }
    );
    navigate('/content');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Login</h1>
      <p>Coming soon...</p>
      <button onClick={handleLogin}>Bypass Login</button>
    </div>
  );
}
