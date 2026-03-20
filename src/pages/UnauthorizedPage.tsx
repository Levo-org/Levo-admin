import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#EF4444' }}>접근 권한 없음</h1>
      <p style={{ color: '#111827', marginBottom: '1rem' }}>이 페이지를 볼 수 있는 권한이 없습니다.</p>
      <Link to="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>홈으로 돌아가기</Link>
    </div>
  );
}
