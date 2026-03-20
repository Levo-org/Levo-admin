import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewPage from '../../src/pages/ReviewPage';
import { useAuthStore } from '../../src/stores/authStore';

vi.mock('../../src/services/workflow.service', () => ({
  workflowService: {
    getContentByStatus: vi.fn().mockResolvedValue({ success: true, data: [] }),
    transitionContent: vi.fn(),
  },
}));

vi.mock('../../src/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('ReviewPage', () => {
  it('renders review queue for reviewer', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { role: 'reviewer' }
    } as unknown as ReturnType<typeof useAuthStore>);

    render(<ReviewPage />);
    expect(screen.getByText('검수 대기열')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/검수 대기 중인 항목/)).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/게시 대기 중인 항목/)).not.toBeInTheDocument();
  });

  it('renders both review and publish queues for admin', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { role: 'admin' }
    } as unknown as ReturnType<typeof useAuthStore>);

    render(<ReviewPage />);
    expect(screen.getByText('검수 대기열')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/검수 대기 중인 항목/)).toBeInTheDocument();
      expect(screen.getByText(/게시 대기 중인 항목/)).toBeInTheDocument();
    });
  });
});
