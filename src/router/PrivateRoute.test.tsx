import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { PrivateRoute } from './index';

describe('PrivateRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  });

  const renderWithRouter = (ui: React.ReactNode) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>로그인 페이지</div>} />
          <Route path="/protected" element={ui} />
          <Route path="/unauthorized" element={<div>권한 없음</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('redirects to /login when not authenticated', () => {
    useAuthStore.setState({ isAuthenticated: false, isLoading: false, user: null });
    
    renderWithRouter(
      <PrivateRoute>
        <div>보호된 콘텐츠</div>
      </PrivateRoute>
    );

    expect(screen.getByText('로그인 페이지')).toBeInTheDocument();
  });

  it('renders children when authenticated and no roles specified', () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      isLoading: false, 
      user: { _id: '1', email: 'test@test.com', name: 'Test', role: 'editor' } 
    });
    
    renderWithRouter(
      <PrivateRoute>
        <div>보호된 콘텐츠</div>
      </PrivateRoute>
    );

    expect(screen.getByText('보호된 콘텐츠')).toBeInTheDocument();
  });

  it('redirects to /unauthorized when role is not allowed', () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      isLoading: false, 
      user: { _id: '1', email: 'test@test.com', name: 'Test', role: 'learner' } 
    });
    
    renderWithRouter(
      <PrivateRoute allowedRoles={['admin']}>
        <div>관리자 전용</div>
      </PrivateRoute>
    );

    expect(screen.getByText('권한 없음')).toBeInTheDocument();
  });

  it('renders children when role is allowed', () => {
    useAuthStore.setState({ 
      isAuthenticated: true, 
      isLoading: false, 
      user: { _id: '1', email: 'test@test.com', name: 'Test', role: 'admin' } 
    });
    
    renderWithRouter(
      <PrivateRoute allowedRoles={['admin', 'editor']}>
        <div>관리자 전용</div>
      </PrivateRoute>
    );

    expect(screen.getByText('관리자 전용')).toBeInTheDocument();
  });
});
