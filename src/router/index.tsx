import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import ContentPage from '../pages/ContentPage';
import ContentDetailPage from '../pages/ContentDetailPage';
import ImportsPage from '../pages/ImportsPage';
import ReviewPage from '../pages/ReviewPage';
import SettingsPage from '../pages/SettingsPage';
import MembersPage from '../pages/MembersPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default function AppRouter() {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/content/vocabulary" replace />} />
          
          <Route path="content" element={
            <PrivateRoute allowedRoles={['editor', 'reviewer', 'admin']}>
              <Navigate to="/content/vocabulary" replace />
            </PrivateRoute>
          } />
          
          <Route path="content/:contentType" element={
            <PrivateRoute allowedRoles={['editor', 'reviewer', 'admin']}>
              <ContentPage />
            </PrivateRoute>
          } />
          
          <Route path="content/:contentType/:id" element={
            <PrivateRoute allowedRoles={['editor', 'reviewer', 'admin']}>
              <ContentDetailPage />
            </PrivateRoute>
          } />

          <Route path="imports" element={
            <PrivateRoute allowedRoles={['editor', 'admin']}>
              <ImportsPage />
            </PrivateRoute>
          } />
          <Route path="review" element={
            <PrivateRoute allowedRoles={['reviewer', 'admin']}>
              <ReviewPage />
            </PrivateRoute>
          } />
          <Route path="settings" element={
            <PrivateRoute allowedRoles={['admin']}>
              <SettingsPage />
            </PrivateRoute>
          } />
          <Route path="members" element={
            <PrivateRoute allowedRoles={['admin']}>
              <MembersPage />
            </PrivateRoute>
          } />
        </Route>
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
