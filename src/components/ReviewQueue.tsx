import { useEffect, useState } from 'react';
import { ContentItem } from '../types/workflow';
import { workflowService } from '../services/workflow.service';
import { useAuthStore } from '../stores/authStore';

interface ReviewQueueProps {
  status: 'in_review' | 'approved';
  title: string;
}

export default function ReviewQueue({ status, title }: ReviewQueueProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await workflowService.getContentByStatus('vocabulary', status);
      if (res.success) {
        setItems(res.data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${status} items:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [status]);

  const handleAction = async (item: ContentItem, targetStatus: string) => {
    try {
      setActionLoading(item._id);
      await workflowService.transitionContent(item.contentType || 'vocabulary', item._id, targetStatus);
      await fetchItems();
    } catch (error) {
      console.error(`Failed to transition to ${targetStatus}:`, error);
      alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>{title} ({items.length})</h3>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>유형</th>
              <th>내용</th>
              <th>언어</th>
              <th>작성자/승인자</th>
              <th>일시</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                  해당하는 항목이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td>{item.contentType || 'vocabulary'}</td>
                  <td style={{ fontWeight: 500 }}>{item.word || item.title || '-'}</td>
                  <td>{item.language || item.targetLanguage || 'en'}</td>
                  <td>
                    {status === 'in_review' ? item.submittedBy || '-' : item.approvedBy || '-'}
                  </td>
                  <td>
                    {new Date(status === 'in_review' ? (item.submittedAt || item.createdAt) : (item.approvedAt || item.updatedAt)).toLocaleDateString('ko-KR')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                      {status === 'in_review' && (
                        <>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-xs)' }}
                            onClick={() => handleAction(item, 'approved')}
                            disabled={actionLoading === item._id}
                          >
                            승인
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-xs)' }}
                            onClick={() => handleAction(item, 'draft')}
                            disabled={actionLoading === item._id}
                          >
                            반려
                          </button>
                        </>
                      )}
                      
                      {status === 'approved' && isAdmin && (
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-xs)', backgroundColor: 'var(--status-published-text)' }}
                          onClick={() => handleAction(item, 'published')}
                          disabled={actionLoading === item._id}
                        >
                          게시
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
