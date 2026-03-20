import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { contentService, ContentItem } from '../services/content.service';
import { ContentTable } from '../components/ContentTable';
import { SearchFilter } from '../components/SearchFilter';
import { Pagination } from '../components/Pagination';

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
  const currentType = contentType || 'vocabulary';

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    targetLanguage: '',
    level: '',
  });

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

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await contentService.getList(currentType, {
        page,
        limit: 10,
        ...filters,
        level: filters.level ? Number(filters.level) : undefined,
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

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
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
        <SearchFilter onFilter={handleFilter} initialValues={filters} />
        {error && <div style={{ color: 'var(--color-danger)', padding: 'var(--spacing-4)' }}>{error}</div>}
        {loading ? (
          <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>로딩 중...</div>
        ) : (
          <>
            <ContentTable items={items} contentType={currentType} />
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