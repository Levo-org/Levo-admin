import React, { useEffect, useState } from 'react';

export interface MemberFilterValues {
  search: string;
  provider: '' | 'google' | 'apple' | 'email';
  role: '' | 'learner' | 'editor' | 'reviewer' | 'admin';
  targetLanguage: '' | 'en' | 'ja' | 'zh';
  level: '' | 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  onboardingCompleted: '' | 'true' | 'false';
}

interface MembersSearchFilterProps {
  onFilter: (filters: MemberFilterValues) => void;
  initialValues?: Partial<MemberFilterValues>;
}

const createFilters = (initialValues?: Partial<MemberFilterValues>): MemberFilterValues => ({
  search: initialValues?.search || '',
  provider: initialValues?.provider || '',
  role: initialValues?.role || '',
  targetLanguage: initialValues?.targetLanguage || '',
  level: initialValues?.level || '',
  onboardingCompleted: initialValues?.onboardingCompleted || '',
});

export const MembersSearchFilter: React.FC<MembersSearchFilterProps> = ({ onFilter, initialValues }) => {
  const [filters, setFilters] = useState<MemberFilterValues>(createFilters(initialValues));

  useEffect(() => {
    setFilters(createFilters(initialValues));
  }, [initialValues]);

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
        placeholder="이름/이메일/providerId 검색"
        className="form-control"
        style={{ flex: 1, minWidth: '280px' }}
      />

      <select
        name="provider"
        value={filters.provider}
        onChange={handleChange}
        className="form-control"
        style={{ width: '140px' }}
      >
        <option value="">모든 SNS</option>
        <option value="google">Google</option>
        <option value="apple">Apple</option>
        <option value="email">Email</option>
      </select>

      <select
        name="targetLanguage"
        value={filters.targetLanguage}
        onChange={handleChange}
        className="form-control"
        style={{ width: '130px' }}
      >
        <option value="">모든 언어</option>
        <option value="en">영어</option>
        <option value="ja">일본어</option>
        <option value="zh">중국어</option>
      </select>

      <select
        name="level"
        value={filters.level}
        onChange={handleChange}
        className="form-control"
        style={{ width: '130px' }}
      >
        <option value="">모든 난이도</option>
        <option value="beginner">입문</option>
        <option value="elementary">초급</option>
        <option value="intermediate">중급</option>
        <option value="advanced">고급</option>
      </select>

      <select
        name="onboardingCompleted"
        value={filters.onboardingCompleted}
        onChange={handleChange}
        className="form-control"
        style={{ width: '140px' }}
      >
        <option value="">온보딩 전체</option>
        <option value="true">완료</option>
        <option value="false">미완료</option>
      </select>

      <select
        name="role"
        value={filters.role}
        onChange={handleChange}
        className="form-control"
        style={{ width: '130px' }}
      >
        <option value="">모든 권한</option>
        <option value="learner">learner</option>
        <option value="editor">editor</option>
        <option value="reviewer">reviewer</option>
        <option value="admin">admin</option>
      </select>

      <button type="submit" className="btn btn-primary">
        검색
      </button>
    </form>
  );
};
