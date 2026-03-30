import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { contentService, ContentItem, DIFFICULTY_OPTIONS } from '../services/content.service';
import { ContentTable } from '../components/ContentTable';
import { FilterValues, SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';
import { useAuthStore } from '../stores/authStore';

const contentTypes = [
  { id: 'vocabulary', label: '단어' },
  { id: 'grammar', label: '문법' },
  { id: 'conversation', label: '회화' },
  { id: 'exampleSentence', label: '예문' },
  { id: 'listening', label: '듣기' },
  { id: 'reading', label: '읽기' },
];

export default function ContentPage() {
  const { contentType } = useParams<{ contentType: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const currentType = contentType || 'vocabulary';
  const canDelete = user?.role === 'admin';

  const createFilters = (): FilterValues => ({
    search: '',
    status: '',
    targetLanguage: '',
    level: '',
    chapter: '',
  });

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterValues>(createFilters());

  useEffect(() => {
    if (!contentType) {
      navigate('/content/vocabulary', { replace: true });
    }
  }, [contentType, navigate]);

  useEffect(() => {
    if (!contentType) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType, page, filters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      chapter: currentType === 'vocabulary' ? prev.chapter : '',
    }));
    setPage(1);
  }, [currentType]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const selectedLevel = DIFFICULTY_OPTIONS.find((option) => option.value === filters.level)?.value;

      const res = await contentService.getList(currentType, {
        page,
        limit: 10,
        ...filters,
        level: selectedLevel,
        chapter: currentType === 'vocabulary' && filters.chapter ? Number(filters.chapter) : undefined,
      });
      setItems(res.data);
      if (res.pagination) {
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (err: unknown) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;

    const confirmed = window.confirm('이 콘텐츠를 삭제(보관 처리)하시겠습니까?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await contentService.delete(currentType, id);
      await loadData();
    } catch (err: unknown) {
      setError('콘텐츠 삭제 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">콘텐츠 관리</h1>
        <button className="btn btn-primary" onClick={() => navigate(`/content/${currentType}/new`)}>
          새 콘텐츠
        </button>
      </div>

      <div className="tabs">
        {contentTypes.map((type) => (
          <Link
            key={type.id}
            to={`/content/${type.id}`}
            className={`tab ${currentType === type.id ? 'active' : ''}`}
          >
            {type.label}
          </Link>
        ))}
      </div>

      <div className="card">
        <SearchFilter key={currentType} onFilter={handleFilter} initialValues={filters} contentType={currentType} />
        {error && <div style={{ color: 'var(--color-danger)', padding: 'var(--spacing-4)' }}>{error}</div>}
        {loading ? (
          <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>로딩 중...</div>
        ) : (
          <>
            <ContentTable
              items={items}
              contentType={currentType}
              onDelete={canDelete ? handleDelete : undefined}
              deletingId={deletingId}
            />
            <Pagination
              page={page}
              totalPages={totalPages || 1}
              total={total}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>
    </div>
  );
}
