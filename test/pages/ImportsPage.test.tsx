import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImportsPage from '../../src/pages/ImportsPage';

vi.mock('../../src/services/import.service', () => ({
  importService: {
    getBatches: vi.fn().mockResolvedValue({ success: true, data: [] }),
    uploadFile: vi.fn(),
    confirmBatch: vi.fn(),
    cancelBatch: vi.fn(),
  },
}));

describe('ImportsPage', () => {
  it('renders upload component and batch list', async () => {
    render(<ImportsPage />);
    expect(screen.getByText('콘텐츠 가져오기')).toBeInTheDocument();
    expect(screen.getByText('파일 업로드')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('최근 가져오기 내역')).toBeInTheDocument();
    });
  });
});
