import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contentService, ContentItem } from '../services/content.service';
import { ContentForm } from '../components/ContentForm';

export default function ContentDetailPage() {
  const { contentType, id } = useParams<{ contentType: string; id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [data, setData] = useState<Partial<ContentItem> | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [_saving, setSaving] = useState(false);

  const createInitialData = (type?: string): Partial<ContentItem> => {
    if (type === 'listening' || type === 'reading') {
      return { status: 'draft', targetLanguage: 'en', difficulty: 'beginner' };
    }

    return { status: 'draft', targetLanguage: 'en', level: 'beginner' };
  };

  useEffect(() => {
    if (isNew) {
      setData(createInitialData(contentType));
      setLoading(false);
      return;
    }
    
    if (contentType && id) {
      loadData(contentType, id);
    }
  }, [contentType, id, isNew]);

  const loadData = async (type: string, contentId: string) => {
    try {
      setLoading(true);
      const res = await contentService.getDetail(type, contentId);
      setData(res.data);
    } catch (err: unknown) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Partial<ContentItem>) => {
    if (!contentType) return;
    
    try {
      setSaving(true);
      if (isNew) {
        await contentService.create(contentType, formData);
        navigate(`/content/${contentType}`);
      } else if (id) {
        await contentService.update(contentType, id, formData);
        alert('저장되었습니다.');
        loadData(contentType, id);
      }
    } catch (err: unknown) {
      setError('저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 'var(--spacing-6)' }}>로딩 중...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">{isNew ? '새 콘텐츠' : '콘텐츠 상세 / 수정'}</h1>
        <button className="btn btn-secondary" onClick={() => navigate(`/content/${contentType}`)}>
          목록으로
        </button>
      </div>

      {error && <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-4)' }}>{error}</div>}

      {data && (
        <ContentForm
          initialData={data}
          contentType={contentType || 'vocabulary'}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/content/${contentType}`)}
        />
      )}
    </div>
  );
}
