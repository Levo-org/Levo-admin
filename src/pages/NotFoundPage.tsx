
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#EF4444' }}>404 - 페이지를 찾을 수 없음</h1>
      <p style={{ color: '#111827', marginBottom: '1rem' }}>요청하신 페이지가 존재하지 않습니다.</p>
      <Link to="/" style={{ color: '#4F46E5', textDecoration: 'none' }}>홈으로 돌아가기</Link>
    </div>
  );
}
