import React from 'react';
import { MemberItem } from '../types/member';

interface MembersTableProps {
  items: MemberItem[];
}

function providerLabel(provider: MemberItem['provider']): string {
  if (provider === 'google') return 'Google';
  if (provider === 'apple') return 'Apple';
  return 'Email';
}

function languageLabel(language: MemberItem['activeLanguage']): string {
  if (language === 'en') return '영어';
  if (language === 'ja') return '일본어';
  return '중국어';
}

function levelLabel(level: MemberItem['level']): string {
  if (!level) return '-';
  if (level === 'beginner') return '입문';
  if (level === 'elementary') return '초급';
  if (level === 'intermediate') return '중급';
  return '고급';
}

export const MembersTable: React.FC<MembersTableProps> = ({ items }) => {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>SNS</th>
            <th>언어</th>
            <th>난이도</th>
            <th>온보딩</th>
            <th>권한</th>
            <th>프리미엄</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td style={{ fontWeight: 600 }}>{item.name}</td>
              <td>{item.email}</td>
              <td>{providerLabel(item.provider)}</td>
              <td>{languageLabel(item.activeLanguage)}</td>
              <td>{levelLabel(item.level)}</td>
              <td>
                <span
                  className="badge"
                  style={{
                    backgroundColor: item.onboardingCompleted ? '#DCFCE7' : '#FEF3C7',
                    color: item.onboardingCompleted ? '#166534' : '#92400E',
                  }}
                >
                  {item.onboardingCompleted ? '완료' : '미완료'}
                </span>
              </td>
              <td>{item.role}</td>
              <td>{item.isPremium ? 'Y' : 'N'}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                조회된 회원이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
