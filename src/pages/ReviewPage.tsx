import React from 'react';
import ReviewQueue from '../components/ReviewQueue';
import { useAuthStore } from '../stores/authStore';

export default function ReviewPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">검수 대기열</h1>
      </div>

      <ReviewQueue status="in_review" title="검수 대기 중인 항목" />
      
      {isAdmin && (
        <ReviewQueue status="approved" title="게시 대기 중인 항목 (승인됨)" />
      )}
    </div>
  );
}
