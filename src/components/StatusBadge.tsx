import React from 'react';

export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

interface StatusBadgeProps {
  status: ContentStatus | string;
}

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: '초안', bg: 'var(--status-draft-bg)', text: 'var(--status-draft-text)' },
  in_review: { label: '검토중', bg: 'var(--status-in-review-bg)', text: 'var(--status-in-review-text)' },
  approved: { label: '승인됨', bg: 'var(--status-approved-bg)', text: 'var(--status-approved-text)' },
  published: { label: '게시됨', bg: 'var(--status-published-bg)', text: 'var(--status-published-text)' },
  archived: { label: '보관됨', bg: 'var(--status-archived-bg)', text: 'var(--status-archived-text)' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const mapping = statusMap[status] || { label: status, bg: '#eee', text: '#333' };

  return (
    <span
      className="badge"
      style={{ backgroundColor: mapping.bg, color: mapping.text }}
    >
      {mapping.label}
    </span>
  );
};