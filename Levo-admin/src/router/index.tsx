import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import ContentPage from '../pages/ContentPage';
import ImportsPage from '../pages/ImportsPage';
import ReviewPage from '../pages/ReviewPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/content" replace />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="content/:type" element={<ContentPage />} />
          <Route path="imports" element={<ImportsPage />} />
          <Route path="review" element={<ReviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
