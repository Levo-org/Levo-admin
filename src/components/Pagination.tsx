import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, total, onPageChange }) => {
  return (
    <div className="pagination">
      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
        총 {total}개 항목 (페이지 {page} / {totalPages})
      </div>
      <div className="pagination-controls">
        <button
          className="btn btn-secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          이전
        </button>
        <button
          className="btn btn-secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};