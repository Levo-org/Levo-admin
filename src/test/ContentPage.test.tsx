import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ContentPage from '../pages/ContentPage';
import { contentService } from '../services/content.service';

vi.mock('../services/content.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/content.service')>();

  return {
    ...actual,
    contentService: {
      ...actual.contentService,
      getList: vi.fn().mockResolvedValue({ data: [], pagination: { page: 1, totalPages: 1, total: 0 } }),
    },
  };
});

describe('ContentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders content management title and tabs', async () => {
    render(
      <MemoryRouter initialEntries={['/content/vocabulary']}>
        <Routes>
          <Route path="/content/:contentType" element={<ContentPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('콘텐츠 관리')).toBeInTheDocument();
    expect(screen.getByText('새 콘텐츠')).toBeInTheDocument();
    
    expect(screen.getByText('단어')).toBeInTheDocument();
    expect(screen.getByText('문법')).toBeInTheDocument();
    expect(screen.getByText('회화')).toBeInTheDocument();
  });

  it('passes difficulty and chapter filters for vocabulary', async () => {
    render(
      <MemoryRouter initialEntries={['/content/vocabulary']}>
        <Routes>
          <Route path="/content/:contentType" element={<ContentPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByDisplayValue('모든 난이도'), {
      target: { name: 'level', value: 'advanced' },
    });
    fireEvent.change(screen.getByPlaceholderText('챕터'), {
      target: { name: 'chapter', value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: '검색' }));

    await waitFor(() => {
      expect(contentService.getList).toHaveBeenLastCalledWith(
        'vocabulary',
        expect.objectContaining({
          level: 'advanced',
          chapter: 3,
        }),
      );
    });
  });

  it('hides chapter filter for non-vocabulary content', () => {
    render(
      <MemoryRouter initialEntries={['/content/reading']}>
        <Routes>
          <Route path="/content/:contentType" element={<ContentPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByPlaceholderText('챕터')).not.toBeInTheDocument();
  });
});
