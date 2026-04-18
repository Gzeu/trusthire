import { RepoScanResult, PatternMatch } from '@/types';

const LIFECYCLE_SCRIPTS = ['postinstall', 'preinstall', 'prepare', 'install', 'prepack', 'postpack'];

const CODE_PATTERNS: Array<{ name: string; regex: RegExp; severity: PatternMatch['severity'] }> = [
  { name: 'eval_execution', regex: /eval\s*\(/, severity: 'critical' },
  { name: 'new_function', regex: /new\s+Function\s*\(/, severity: 'critical' },
  { name: 'child_process_exec', regex: /child_process[\s\S]{0,120}exec(?:Sync)?\s*\(/, severity: 'critical' },
  { name: 'child_process_spawn', regex: /child_process[\s\S]{0,120}spawn(?:Sync)?\s*\(/, severity: 'critical' },
  { name: 'env_exfiltration_fetch', regex: /(fetch|axios|got)\s*\([\s\S]{0,200}process\.env/, severity: 'critical' },
  { name: 'env_dump_json', regex: /JSON\.stringify\s*\(\s*process\.env\s*\)/, severity: 'critical' },
  { name: 'private_key_access', regex: /process\.env\.(PRIVATE_KEY|SEED|MNEMONIC|SECRET_KEY|AWS_SECRET|WALLET|TOKEN)/, severity: 'critical' },
  { name: 'curl_bash', regex: /curl\s+[^\n|]+\|\s*(ba)?sh/, severity: 'critical' },
  { name: 'wget_pipe', regex: /wget\s+[^\n|]+\|\s*(ba)?sh/, severity: 'critical' },
  { name: 'powershell_download', regex: /(Invoke-WebRequest|iwr)[\s\S]{0,120}(iex|Invoke-Expression)/i, severity: 'critical' },
  { name: 'discord_webhook', regex: /discord(?:app)?\.com\/api\/webhooks\//, severity: 'critical' },
  { name: 'telegram_exfil', regex: /api\.telegram\.org\//, severity: 'high' },
  { name: 'base64_decode_node', regex: /Buffer\.from\s*\([^)]*,\s*['"]base64['"]\)/, severity: 'high' },
  { name: 'atob_decode', regex: /atob\s*\(/, severity: 'high' },
  { name: 'dynamic_require', regex: /require\s*\(\s*[^'"`a-zA-Z]/, severity: 'high' },
  { name: 'hex_obfuscation', regex: /_0x[a-f0-9]{4,}/i, severity: 'high' },
  { name: 'wallet_keyword_cluster', regex: /(seed phrase|private key|mnemonic|wallet connect|walletconnect)/i, severity: 'high' },
  { name: 'process_env_generic', regex: /process\.env\.[A-Z_]{4,}/, severity: 'medium' },
  { name: 'obfuscated_hex', regex: /(\\x[0-9a-fA-F]{2}){4,}/, severity: 'medium' },
  { name: 'long_single_line_payload', regex: /^.{800,}$/m, severity: 'medium' },
  { name: 'hardcoded_url', regex: /https?:\/\/[^'"\s]{30,}/, severity: 'low' },
];

const FILES_TO_SCAN = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'index.js', 'index.ts', 'index.mjs',
  'src/index.js', 'src/index.ts', 'src/index.tsx',
  'app.js', 'server.js', 'main.js', 'main.ts',
  'setup.js', 'install.js', 'postinstall.js',
  'src/main.js', 'src/main.ts',
  'scripts/setup.js', 'scripts/install.js', 'scripts/bootstrap.js',
  'utils/index.js', 'utils/helper.js', 'lib/index.js',
  'src/utils/index.js', 'src/utils/helper.js',
  'config/init.js', 'config/setup.js',
];

const SUSPICIOUS_PACKAGES = [
  'node-fetchs', 'axioss', 'lodahs', 'expresss', 'reacts', 'nextjs',
  'walletconnects', 'etherss', 'web3js', 'discord-webhook-nodee',
  'requests', 'cryptoo', 'telegrm', 'telegrafs'
];

function findLineNumber(code: string, regex: RegExp): number | undefined {
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const testRegex = new RegExp(regex.source, regex.flags);
    if (testRegex.test(lines[i])) return i + 1;
  }
  return undefined;
}

function scanCodePatterns(code: string, filename: string): PatternMatch[] {
  const matches = CODE_PATTERNS
    .filter((p) => {
      const testRegex = new RegExp(p.regex.source, p.regex.flags);
      return testRegex.test(code);
    })
    .map((p) => ({
      pattern: p.name,
      severity: p.severity,
      file: filename,
      line: findLineNumber(code, p.regex),
    }));

  const minifiedSuspicion = code.length > 4000 && !code.includes('\n')
    ? [{ pattern: 'minified_or_packed_payload', severity: 'high' as const, file: filename, line: 1 }]
    : [];

  const excessiveSingleCharVars = (code.match(/\b(?:const|let|var)\s+[a-zA-Z]\s*=/g) || []).length > 12
    ? [{ pattern: 'excessive_single_char_variables', severity: 'medium' as const, file: filename }]
    : [];

  return [...matches, ...minifiedSuspicion, ...excessiveSingleCharVars];
}

function scanPackageJson(content: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  try {
    const pkg = JSON.parse(content);
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.optionalDependencies || {}),
    };

    for (const dep of Object.keys(deps)) {
      if (SUSPICIOUS_PACKAGES.includes(dep.toLowerCase())) {
        matches.push({
          pattern: `suspicious_dependency:${dep}`,
          severity: 'high',
          file: 'package.json',
        });
      }
    }

    const scripts = pkg.scripts || {};
    for (const [name, value] of Object.entries(scripts)) {
      const script = String(value).toLowerCase();
      if (/curl\s+.+\|\s*(ba)?sh/.test(script) || /wget\s+.+\|\s*(ba)?sh/.test(script)) {
        matches.push({ pattern: `dangerous_script:${name}`, severity: 'critical', file: 'package.json' });
      }
      if (/powershell|invoke-webrequest|iex/.test(script)) {
        matches.push({ pattern: `powershell_download:${name}`, severity: 'high', file: 'package.json' });
      }
    }
  } catch {
    matches.push({ pattern: 'malformed_package_json', severity: 'medium', file: 'package.json' });
  }
  return matches;
}

function calculateRepoRisk(dangerousScripts: string[], patterns: PatternMatch[], repoAge?: number, stars?: number, forks?: number): RepoScanResult['riskLevel'] {
  const criticalCount = patterns.filter((p) => p.severity === 'critical').length;
  const highCount = patterns.filter((p) => p.severity === 'high').length;

  if (dangerousScripts.length > 0) return 'critical';
  if (criticalCount >= 1) return 'critical';
  if (highCount >= 2) return 'critical';
  if (repoAge !== undefined && repoAge < 7 && (stars ?? 0) === 0 && (forks ?? 0) === 0 && patterns.length > 0) return 'critical';
  if (highCount >= 1 || patterns.length >= 4) return 'warning';
  return 'safe';
}

export async function scanGithubRepo(repoUrl: string): Promise<RepoScanResult> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) {
    return {
      repoUrl,
      hasPackageJson: false,
      dangerousScripts: [],
      patternMatches: [],
      riskLevel: 'safe',
      error: 'Invalid GitHub URL format',
    };
  }

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  const headers: Record<string, string> = { 'User-Agent': 'TrustHire-Scanner/2.0' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers, cache: 'no-store' });
    if (!repoRes.ok) {
      return {
        repoUrl,
        hasPackageJson: false,
        dangerousScripts: [],
        patternMatches: [],
        riskLevel: 'safe',
        error: `GitHub API error: ${repoRes.status}`,
      };
    }

    const repoData = await repoRes.json();
    const repoAge = Math.floor((Date.now() - new Date(repoData.created_at).getTime()) / 86400000);

    let hasPackageJson = false;
    const dangerousScripts: string[] = [];
    const patternMatches: PatternMatch[] = [];

    const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/package.json`, { headers, cache: 'no-store' });
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
        patternMatches.push(...scanPackageJson(content));
      } catch {
        patternMatches.push({ pattern: 'malformed_package_json', severity: 'medium', file: 'package.json' });
      }
    }

    for (const file of FILES_TO_SCAN.filter((f) => f !== 'package.json')) {
      try {
        const fileRes = await fetch(`https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/${file}`, { cache: 'no-store' });
        if (fileRes.ok) {
          const code = await fileRes.text();
          if (code.length < 750000) {
            patternMatches.push(...scanCodePatterns(code, file));
          }
        }
      } catch {}
    }

    const uniqueMatches = patternMatches.filter((match, index, arr) => {
      return index === arr.findIndex((m) => m.pattern === match.pattern && m.file === match.file && m.line === match.line);
    });

    return {
      repoUrl,
      repoAge,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      hasPackageJson,
      dangerousScripts,
      patternMatches: uniqueMatches,
      riskLevel: calculateRepoRisk(dangerousScripts, uniqueMatches, repoAge, repoData.stargazers_count, repoData.forks_count),
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
