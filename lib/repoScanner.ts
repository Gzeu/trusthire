import { RepoScanResult, PatternMatch } from '@/types';

const LIFECYCLE_SCRIPTS = ['postinstall', 'preinstall', 'prepare', 'install', 'prepack', 'postpack'];

const CODE_PATTERNS: Array<{ name: string; regex: RegExp; severity: PatternMatch['severity'] }> = [
  { name: 'eval_execution', regex: /eval\s*\(/, severity: 'critical' },
  { name: 'new_function', regex: /new\s+Function\s*\(/, severity: 'critical' },
  { name: 'child_process_exec', regex: /child_process.*exec\s*\(/, severity: 'critical' },
  { name: 'env_exfiltration_fetch', regex: /(fetch|axios)\s*\([^)]*process\.env/, severity: 'critical' },
  { name: 'env_dump_json', regex: /JSON\.stringify\s*\(\s*process\.env\s*\)/, severity: 'critical' },
  { name: 'private_key_access', regex: /process\.env\.(PRIVATE_KEY|SEED|MNEMONIC|SECRET_KEY|AWS_SECRET)/, severity: 'critical' },
  { name: 'curl_bash', regex: /curl\s+.*\|\s*(ba)?sh/, severity: 'critical' },
  { name: 'wget_pipe', regex: /wget\s+.*\|\s*(ba)?sh/, severity: 'critical' },
  { name: 'base64_decode_node', regex: /Buffer\.from\s*\([^)]*,\s*['"]base64['"]\)/, severity: 'high' },
  { name: 'atob_decode', regex: /atob\s*\(/, severity: 'high' },
  { name: 'dynamic_require', regex: /require\s*\(\s*[^'"`a-zA-Z]/, severity: 'high' },
  { name: 'process_env_generic', regex: /process\.env\.[A-Z_]{4,}/, severity: 'medium' },
  { name: 'obfuscated_hex', regex: /(\\x[0-9a-fA-F]{2}){4,}/, severity: 'medium' },
  { name: 'hardcoded_url', regex: /https?:\/\/[^'"\s]{30,}/, severity: 'low' },
];

const FILES_TO_SCAN = [
  'index.js', 'index.ts', 'index.mjs',
  'src/index.js', 'src/index.ts',
  'app.js', 'server.js', 'main.js', 'main.ts',
  'setup.js', 'install.js', 'postinstall.js',
];

function findLineNumber(code: string, regex: RegExp): number | undefined {
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) return i + 1;
  }
  return undefined;
}

function scanCodePatterns(code: string, filename: string): PatternMatch[] {
  return CODE_PATTERNS
    .filter((p) => p.regex.test(code))
    .map((p) => ({
      pattern: p.name,
      severity: p.severity,
      file: filename,
      line: findLineNumber(code, p.regex),
    }));
}

function calculateRepoRisk(dangerousScripts: string[], patterns: PatternMatch[]): RepoScanResult['riskLevel'] {
  if (dangerousScripts.length > 0) return 'critical';
  if (patterns.some((p) => p.severity === 'critical')) return 'critical';
  if (patterns.some((p) => p.severity === 'high')) return 'warning';
  if (patterns.length > 3) return 'warning';
  return 'safe';
}

export async function scanGithubRepo(repoUrl: string): Promise<RepoScanResult> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) return {
    repoUrl,
    hasPackageJson: false,
    dangerousScripts: [],
    patternMatches: [],
    riskLevel: 'safe',
    error: 'Invalid GitHub URL format',
  };

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  const headers: Record<string, string> = {
    'User-Agent': 'TrustHire-Scanner/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Fetch repo metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });
    if (!repoRes.ok) return {
      repoUrl,
      hasPackageJson: false,
      dangerousScripts: [],
      patternMatches: [],
      riskLevel: 'safe',
      error: `GitHub API error: ${repoRes.status}`,
    };

    const repoData = await repoRes.json();
    const repoAge = Math.floor(
      (Date.now() - new Date(repoData.created_at).getTime()) / 86400000
    );

    // Fetch package.json
    let hasPackageJson = false;
    const dangerousScripts: string[] = [];

    const pkgRes = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/contents/package.json`,
      { headers }
    );

    if (pkgRes.ok) {
      hasPackageJson = true;
      try {
        const pkgData = await pkgRes.json();
        const content = Buffer.from(pkgData.content, 'base64').toString('utf-8');
        const pkg = JSON.parse(content);
        const scripts = pkg.scripts || {};
        for (const s of LIFECYCLE_SCRIPTS) {
          if (scripts[s]) dangerousScripts.push(s);
        }
      } catch { /* malformed package.json */ }
    }

    // Scan source files
    const patternMatches: PatternMatch[] = [];
    for (const file of FILES_TO_SCAN) {
      try {
        const fileRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/${file}`
        );
        if (fileRes.ok) {
          const code = await fileRes.text();
          if (code.length < 500000) { // skip huge files
            patternMatches.push(...scanCodePatterns(code, file));
          }
        }
      } catch { /* file not found, skip */ }
    }

    return {
      repoUrl,
      repoAge,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      hasPackageJson,
      dangerousScripts,
      patternMatches,
      riskLevel: calculateRepoRisk(dangerousScripts, patternMatches),
    };
  } catch (err) {
    return {
      repoUrl,
      hasPackageJson: false,
      dangerousScripts: [],
      patternMatches: [],
      riskLevel: 'safe',
      error: String(err),
    };
  }
}
