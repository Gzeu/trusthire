// Repository scanner for TrustHire Autonomous System
export interface RepoScanResult {
  repository: string;
  commits: number;
  contributions: number;
  languages: string[];
  activity: 'high' | 'medium' | 'low';
  lastActive: string;
}

export class RepoScanner {
  async scanRepository(repoUrl: string): Promise<RepoScanResult> {
    // Mock implementation - in production, this would use GitHub API
    return {
      repository: repoUrl,
      commits: Math.floor(Math.random() * 1000),
      contributions: Math.floor(Math.random() * 500),
      languages: ['JavaScript', 'TypeScript', 'Python'],
      activity: 'high',
      lastActive: new Date().toISOString()
    };
  }

  async scanMultipleRepositories(repos: string[]): Promise<RepoScanResult[]> {
    const results = await Promise.all(
      repos.map(repo => this.scanRepository(repo))
    );
    return results;
  }

  calculateDeveloperScore(results: RepoScanResult[]): number {
    const totalCommits = results.reduce((sum, r) => sum + r.commits, 0);
    const totalContributions = results.reduce((sum, r) => sum + r.contributions, 0);
    const activeRepos = results.filter(r => r.activity === 'high').length;
    
    // Simple scoring algorithm
    const score = (totalCommits * 0.3 + totalContributions * 0.4 + activeRepos * 30) / 100;
    return Math.min(100, Math.max(0, score * 100));
  }
}

export const repoScanner = new RepoScanner();
