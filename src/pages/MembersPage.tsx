import { useCallback, useEffect, useState } from 'react';
import { memberService } from '../services/member.service';
import { MemberItem, MemberListParams } from '../types/member';
import { MembersSearchFilter, MemberFilterValues } from '../components/MembersSearchFilter';
import { MembersTable } from '../components/MembersTable';
import { Pagination } from '../components/Pagination';

const createFilters = (): MemberFilterValues => ({
  search: '',
  provider: '',
  role: '',
  targetLanguage: '',
  level: '',
  onboardingCompleted: '',
});

const mapFilterValuesToParams = (values: MemberFilterValues): MemberListParams => ({
  search: values.search || undefined,
  provider: values.provider || undefined,
  role: values.role || undefined,
  targetLanguage: values.targetLanguage || undefined,
  level: values.level || undefined,
  onboardingCompleted: values.onboardingCompleted || undefined,
});

export default function MembersPage() {
  const [items, setItems] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<MemberFilterValues>(createFilters());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await memberService.getList({
        page,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...mapFilterValuesToParams(filters),
      });

      setItems(response.data);

      if (response.pagination) {
        setPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages || 1);
        setTotal(response.pagination.total);
      } else {
        setTotalPages(1);
        setTotal(response.data.length);
      }
    } catch (err: unknown) {
      setError('회원 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilter = (newFilters: MemberFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">회원 관리</h1>
      </div>

      <div className="card">
        <MembersSearchFilter onFilter={handleFilter} initialValues={filters} />
        {error && <div style={{ color: 'var(--color-danger)', padding: 'var(--spacing-4)' }}>{error}</div>}
        {loading ? (
          <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>로딩 중...</div>
        ) : (
          <>
            <MembersTable items={items} />
            <Pagination
              page={page}
              totalPages={totalPages || 1}
              total={total}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
}
