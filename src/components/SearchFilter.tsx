import React, { useEffect, useState } from 'react';
import { DIFFICULTY_OPTIONS } from '../services/content.service';

export interface FilterValues {
  search: string;
  status: string;
  targetLanguage: string;
  level: string;
  chapter: string;
}

interface SearchFilterProps {
  onFilter: (filters: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
  contentType: string;
}

const createFilters = (initialValues?: Partial<FilterValues>): FilterValues => ({
  search: initialValues?.search || '',
  status: initialValues?.status || '',
  targetLanguage: initialValues?.targetLanguage || '',
  level: initialValues?.level || '',
  chapter: initialValues?.chapter || '',
});

export const SearchFilter: React.FC<SearchFilterProps> = ({ onFilter, initialValues, contentType }) => {
  const [filters, setFilters] = useState<FilterValues>(createFilters(initialValues));

  useEffect(() => {
    setFilters(createFilters(initialValues));
  }, [initialValues, contentType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="검색어 입력..."
        className="form-control"
        style={{ flex: 1, minWidth: '200px' }}
      />
      
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="form-control"
        style={{ width: '150px' }}
      >
        <option value="">모든 상태</option>
        <option value="draft">초안</option>
        <option value="in_review">검토중</option>
        <option value="approved">승인됨</option>
        <option value="published">게시됨</option>
        <option value="archived">보관됨</option>
      </select>

      <select
        name="targetLanguage"
        value={filters.targetLanguage}
        onChange={handleChange}
        className="form-control"
        style={{ width: '150px' }}
      >
        <option value="">모든 언어</option>
        <option value="ko">한국어</option>
        <option value="en">영어</option>
        <option value="ja">일본어</option>
        <option value="es">스페인어</option>
      </select>

      <select
        name="level"
        value={filters.level}
        onChange={handleChange}
        className="form-control"
        style={{ width: '120px' }}
      >
        <option value="">모든 난이도</option>
        {DIFFICULTY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {contentType === 'vocabulary' && (
        <input
          type="number"
          name="chapter"
          value={filters.chapter}
          onChange={handleChange}
          placeholder="챕터"
          min={1}
          className="form-control"
          style={{ width: '120px' }}
        />
      )}

      <button type="submit" className="btn btn-primary">
        검색
      </button>
    </form>
  );
};
