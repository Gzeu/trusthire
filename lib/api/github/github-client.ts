// GitHub API Client for Real Repository Scanning
// Provides real GitHub repository analysis instead of mock data

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
  };
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics: string[];
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string;
  type: string;
  content: string | null;
  encoding: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  tree: {
    sha: string;
    url: string;
  };
  url: string;
  verification: {
    verified: boolean;
    reason: string | null;
    signature: string | null;
    payload: string | null;
  };
}

export interface GitHubBranch {
  name: string;
  commit: GitHubCommit;
  protected: boolean;
  protection: {
    url: string;
    enabled: boolean;
    required_approving_review_count: number;
    required_status_checks: {
      contexts: Array<{
        context: string;
        required: boolean;
      }>;
    };
  } | null;
}

export interface GitHubContent {
  content: string;
  encoding: string;
}

export class GitHubClient {
  private baseUrl: string;
  private token: string | null;
  private headers: Record<string, string>;

  constructor(token?: string) {
    this.baseUrl = 'https://api.github.com';
    this.token = token || process.env.GITHUB_TOKEN || null;
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'TrustHire-Security-Scanner',
      ...(this.token && { Authorization: `token ${this.token}` })
    };
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    return this.makeRequest<GitHubRepo>(url);
  }

  async getRepositoryContents(owner: string, repo: string, path = ''): Promise<GitHubFile[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    return this.makeRequest<GitHubFile[]>(url);
  }

  async getFileContent(owner: string, repo: string, path: string): Promise<GitHubContent> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    return this.makeRequest<GitHubContent>(url);
  }

  async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/branches`;
    return this.makeRequest<GitHubBranch[]>(url);
  }

  async getCommits(owner: string, repo: string, branch = 'main', perPage = 100): Promise<GitHubCommit[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/commits`;
    const params = new URLSearchParams({
      sha: branch,
      per_page: perPage.toString()
    });
    
    return this.makeRequest<GitHubCommit[]>(`${url}?${params}`);
  }

  async searchRepositories(query: string, sort = 'stars', order = 'desc', perPage = 10): Promise<{
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepo[];
  }> {
    const url = `${this.baseUrl}/search/repositories`;
    const params = new URLSearchParams({
      q: query,
      sort,
      order,
      per_page: perPage.toString()
    });
    
    return this.makeRequest<{total_count: number; incomplete_results: boolean; items: GitHubRepo[]}>(`${url}?${params}`);
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/languages`;
    return this.makeRequest<Record<string, number>>(url);
  }

  async getRepositoryContributors(owner: string, repo: string): Promise<Array<{
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
    type: string;
  }>> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contributors`;
    return this.makeRequest<Array<{login: string; id: number; avatar_url: string; html_url: string; contributions: number; type: string}>>(url);
  }

  async getRepositoryIssues(owner: string, repo: string, state = 'open', perPage = 100): Promise<Array<{
    id: number;
    title: string;
    body: string | null;
    state: string;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    user: {
      login: string;
      id: number;
      avatar_url: string;
    };
    labels: Array<{
      id: number;
      name: string;
      color: string;
      description: string;
    }>;
  }>> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/issues`;
    const params = new URLSearchParams({
      state,
      per_page: perPage.toString()
    });
    
    return this.makeRequest<Array<{id: number; title: string; body: string | null; state: string; created_at: string; updated_at: string; closed_at: string | null; user: {login: string; id: number; avatar_url: string;}; labels: Array<{id: number; name: string; color: string; description: string;}>}>>(`${url}?${params}`);
  }

  async getRepositoryPullRequests(owner: string, repo: string, state = 'open', perPage = 100): Promise<Array<{
    id: number;
    title: string;
    body: string | null;
    state: string;
    created_at: string;
    updated_at: string;
    merged_at: string | null;
    user: {
      login: string;
      id: number;
      avatar_url: string;
    };
    head: {
      ref: string;
      sha: string;
    };
    base: {
      ref: string;
      sha: string;
    };
  }>> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/pulls`;
    const params = new URLSearchParams({
      state,
      per_page: perPage.toString()
    });
    
    return this.makeRequest<Array<{id: number; title: string; body: string | null; state: string; created_at: string; updated_at: string; merged_at: string | null; user: {login: string; id: number; avatar_url: string;}; head: {ref: string; sha: string;}; base: {ref: string; sha: string;}>>(`${url}?${params}`);
  }

  async getRepositoryReleases(owner: string, repo: string, perPage = 10): Promise<Array<{
    id: number;
    tag_name: string;
    name: string;
    body: string | null;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    author: {
      login: string;
      id: number;
      avatar_url: string;
    };
    assets: Array<{
      name: string;
      content_type: string;
      size: number;
      browser_download_url: string;
    }>;
  }>> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/releases`;
    const params = new URLSearchParams({
      per_page: perPage.toString()
    });
    
    return this.makeRequest<Array<{id: number; tag_name: string; name: string; body: string | null; draft: boolean; prerelease: boolean; created_at: string; published_at: string; author: {login: string; id: number; avatar_url: string;}; assets: Array<{name: string; content_type: string; size: number; browser_download_url: string;}>}>>(`${url}?${params}`);
  }

  async checkRateLimit(): Promise<{
    resources: {
      core: {
        limit: number;
        used: number;
        remaining: number;
        reset: string;
      };
      search: {
        limit: number;
        used: number;
        remaining: number;
        reset: string;
      };
      graphql: {
        limit: number;
        used: number;
        remaining: number;
        reset: string;
      };
    };
  }> {
    return this.makeRequest<{resources: {core: {limit: number; used: number; remaining: number; reset: string;}; search: {limit: number; used: number; remaining: number; reset: string;}; graphql: {limit: number; used: number; remaining: number; reset: string;}}}>('https://api.github.com/rate_limit');
  }

  // Helper method to parse GitHub repository URL
  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length >= 2 && pathParts[0] === 'github.com') {
        return {
          owner: pathParts[1],
          repo: pathParts[2]
        };
      } else if (pathParts.length >= 2) {
        return {
          owner: pathParts[0],
          repo: pathParts[1]
        };
      }
      
      return null;
    } catch {
      return null;
    }
  }

  // Check if client is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get rate limit information
  async getRateLimitInfo() {
    try {
      return await this.checkRateLimit();
    } catch (error) {
      console.warn('Could not fetch rate limit info:', error);
      return null;
    }
  }
}

// Singleton instance
export const githubClient = new GitHubClient();
