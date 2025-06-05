
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Define the GitHub repo interface
export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

// Function to fetch GitHub repos
const fetchGitHubRepos = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json() as Promise<GitHubRepo[]>;
};

// Custom hook to get GitHub repos
export const useGitHubRepos = (username: string) => {
  return useQuery({
    queryKey: ['githubRepos', username],
    queryFn: () => fetchGitHubRepos(username),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch GitHub repos:', error);
        toast.error('Failed to fetch GitHub repositories');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!username, // Only run the query if a username is provided
  });
};

export default useGitHubRepos;
