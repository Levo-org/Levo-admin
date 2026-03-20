import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContentPage from '../pages/ContentPage';

vi.mock('../services/content.service', () => ({
  contentService: {
    getList: vi.fn().mockResolvedValue({ data: [], pagination: { page: 1, totalPages: 1, total: 0 } }),
  },
}));

describe('ContentPage', () => {
  it('renders content management title and tabs', async () => {
    render(
      <MemoryRouter initialEntries={['/content/vocabulary']}>
        <ContentPage />
      </MemoryRouter>
    );

    expect(screen.getByText('콘텐츠 관리')).toBeInTheDocument();
    expect(screen.getByText('새 콘텐츠')).toBeInTheDocument();
    
    expect(screen.getByText('단어')).toBeInTheDocument();
    expect(screen.getByText('문법')).toBeInTheDocument();
    expect(screen.getByText('회화')).toBeInTheDocument();
  });
});