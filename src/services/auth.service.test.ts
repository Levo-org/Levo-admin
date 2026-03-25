import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './auth.service';
import api from './api';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('unwraps login response data envelope', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          user: {
            _id: 'admin-1',
            email: 'admin@levo.app',
            name: 'Admin',
            role: 'admin',
          },
          tokens: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
          },
        },
      },
    });

    await expect(authService.login('admin@levo.app', 'TempPass1234!')).resolves.toEqual({
      user: {
        _id: 'admin-1',
        email: 'admin@levo.app',
        name: 'Admin',
        role: 'admin',
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
    });
  });

  it('unwraps refresh response data envelope', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        success: true,
        data: {
          tokens: {
            accessToken: 'next-access-token',
            refreshToken: 'next-refresh-token',
          },
        },
      },
    });

    await expect(authService.refresh('refresh-token')).resolves.toEqual({
      tokens: {
        accessToken: 'next-access-token',
        refreshToken: 'next-refresh-token',
      },
    });
  });
});
