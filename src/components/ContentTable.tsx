import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentItem, formatDifficultyLabel, getContentDifficulty } from '../services/content.service';
import { StatusBadge } from './StatusBadge';

interface ContentTableProps {
  items: ContentItem[];
  contentType: string;
}

export const ContentTable: React.FC<ContentTableProps> = ({ items, contentType }) => {
  const navigate = useNavigate();
  const showChapter = contentType === 'vocabulary';

  const getPrimaryField = (item: ContentItem) => {
    return item.word || item.title || item.text || '(제목 없음)';
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
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={showChapter ? 6 : 5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
