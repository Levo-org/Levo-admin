import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentItem, formatDifficultyLabel, getContentDifficulty } from '../services/content.service';
import { StatusBadge } from './StatusBadge';

interface ContentTableProps {
  items: ContentItem[];
  contentType: string;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

export const ContentTable: React.FC<ContentTableProps> = ({ items, contentType, onDelete, deletingId }) => {
  const navigate = useNavigate();
  const showChapter = contentType === 'vocabulary';

  const getPrimaryField = (item: ContentItem) => {
    if (contentType === 'vocabulary') return item.word || '(단어 없음)';
    if (contentType === 'grammar') return item.title || '(제목 없음)';
    if (contentType === 'conversation') return item.title || '(제목 없음)';
    if (contentType === 'exampleSentence') return item.originalText || item.text || '(문장 없음)';
    if (contentType === 'listening') return item.audioText || '(오디오 텍스트 없음)';
    if (contentType === 'reading') return item.title || '(제목 없음)';

    return item.word || item.title || item.originalText || item.text || '(제목 없음)';
  };

  const handleRowClick = (id: string) => {
    navigate(`/content/${contentType}/${id}`);
  };

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>제목 / 단어</th>
            <th>상태</th>
            <th>언어</th>
            <th>난이도</th>
            {showChapter && <th>챕터</th>}
            <th>최종 수정일</th>
            {onDelete && <th>관리</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item._id}
              className="tr-clickable"
              onClick={() => handleRowClick(item._id)}
            >
              <td style={{ fontWeight: 500 }}>{getPrimaryField(item)}</td>
              <td><StatusBadge status={item.status} /></td>
              <td>{item.targetLanguage}</td>
              <td>{formatDifficultyLabel(getContentDifficulty(item))}</td>
              {showChapter && <td>{item.chapter ?? '-'}</td>}
              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
              {onDelete && (
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-xs)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item._id);
                    }}
                    disabled={deletingId === item._id}
                  >
                    {deletingId === item._id ? '삭제 중...' : '삭제'}
                  </button>
                </td>
              )}
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={showChapter ? (onDelete ? 7 : 6) : (onDelete ? 6 : 5)} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
