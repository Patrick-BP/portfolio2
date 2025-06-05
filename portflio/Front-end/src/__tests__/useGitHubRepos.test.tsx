import { renderHook, waitFor } from '@testing-library/react';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false // Disable retries for testing
    }
  }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useGitHubRepos Hook', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    // Clear the query cache before each test
    queryClient.clear();
  });

  it('fetches GitHub repos successfully', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        description: 'Test repository',
        html_url: 'https://github.com/test/test-repo',
        homepage: 'https://test.com',
        stargazers_count: 10,
        forks_count: 5,
        language: 'TypeScript',
        topics: ['react', 'typescript'],
        created_at: '2023-01-01',
        updated_at: '2023-12-31'
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos
    });

    const { result } = renderHook(() => useGitHubRepos('testuser'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockRepos);
    });
  });

  it('handles error when fetching fails', async () => {
    const mockError = new Error('Failed to fetch');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGitHubRepos('testuser'), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe('Failed to fetch');
    });
  });
});