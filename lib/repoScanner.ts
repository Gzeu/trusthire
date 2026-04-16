export interface PatternMatch {
  pattern: string
  severity: 'critical' | 'high' | 'medium'
  file: string
  context?: string
}

export interface RepoScanResult {
  owner?: string
  repo?: string
  repoAgeDays?: number
  stars?: number
  forks?: number
  commitCount?: number
  defaultBranch?: string
  hasPackageJson: boolean
  dangerousScripts: string[]
  patternMatches: PatternMatch[]
  suspiciousNetworkCalls: string[]
  envExfiltrationRisk: boolean
  dynamicExecutionRisk: boolean
  typosquattedPackages: string[]
  riskLevel: 'safe' | 'warning' | 'critical'
  error?: string
}

const LIFECYCLE_SCRIPTS = ['postinstall', 'preinstall', 'prepare', 'install', 'prepack', 'postpack']

const CODE_PATTERNS: Array<{ name: string; regex: RegExp; severity: 'critical' | 'high' | 'medium' }> = [
  { name: 'eval_execution', regex: /\beval\s*\(/, severity: 'critical' },
  { name: 'new_function', regex: /new\s+Function\s*\(/, severity: 'critical' },
  { name: 'child_process_exec', regex: /child_process|exec\s*\(|execSync\s*\(|spawn\s*\(/, severity: 'critical' },
  { name: 'env_exfiltration', regex: /(?:fetch|axios|http\.request|https\.request)\s*\([^)]*process\.env/, severity: 'critical' },
  { name: 'env_dump', regex: /JSON\.stringify\s*\(\s*process\.env/, severity: 'critical' },
  { name: 'private_key_env', regex: /process\.env\.(?:PRIVATE_KEY|SEED|MNEMONIC|SECRET_KEY|API_SECRET|AWS_SECRET)/, severity: 'critical' },
  { name: 'curl_bash', regex: /curl\s+[^|]*\|\s*(?:ba)?sh/, severity: 'critical' },
  { name: 'wget_bash', regex: /wget\s+[^|]*\|\s*(?:ba)?sh/, severity: 'critical' },
  { name: 'base64_decode_node', regex: /Buffer\.from\s*\([^)]+,\s*['"]base64['"]\)/, severity: 'high' },
  { name: 'atob_decode', regex: /\batob\s*\(/, severity: 'high' },
  { name: 'dynamic_require', regex: /require\s*\(\s*(?!['"\`][a-zA-Z@])/, severity: 'high' },
  { name: 'hex_obfuscation', regex: /(?:\\x[0-9a-fA-F]{2}){4,}/, severity: 'medium' },
  { name: 'string_timeout_exec', regex: /setTimeout\s*\(\s*['"]/, severity: 'medium' },
  { name: 'network_in_postinstall', regex: /(?:require|import)\s*\(?\s*['"](?:axios|node-fetch|got|superagent|request)['"]/, severity: 'high' }
]

const TOP_NPM_PACKAGES = [
  'react', 'lodash', 'express', 'axios', 'next', 'typescript', 'webpack', 'babel',
  'eslint', 'prettier', 'jest', 'mocha', 'moment', 'dayjs', 'uuid', 'dotenv',
  'cors', 'helmet', 'mongoose', 'prisma', 'zod', 'zustand', 'tailwindcss',
  'vite', 'rollup', 'esbuild', 'ethers', 'web3', 'hardhat', 'wagmi', 'viem'
]

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[a.length][b.length]
}

export function detectTyposquatting(packageName: string): boolean {
  const clean = packageName.replace(/^@[^/]+\//, '')
  return TOP_NPM_PACKAGES.some(pkg => pkg !== clean && levenshtein(pkg, clean) === 1)
}

function scanCodePatterns(code: string, filename: string): PatternMatch[] {
  const matches: PatternMatch[] = []
  for (const p of CODE_PATTERNS) {
    const match = p.regex.exec(code)
    if (match) {
      const start = Math.max(0, match.index - 40)
      const end = Math.min(code.length, match.index + 80)
      matches.push({
        pattern: p.name,
        severity: p.severity,
        file: filename,
        context: code.slice(start, end).replace(/\n/g, ' ').trim()
      })
    }
  }
  return matches
}

const FILES_TO_SCAN = [
  'index.js', 'index.ts', 'index.mjs',
  'src/index.js', 'src/index.ts',
  'app.js', 'app.ts', 'server.js', 'server.ts',
  'main.js', 'main.ts', 'setup.js', 'setup.ts',
  'install.js', 'postinstall.js', 'scripts/postinstall.js'
]

export async function scanGithubRepo(url: string): Promise<RepoScanResult> {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/)
  if (!match) return { hasPackageJson: false, dangerousScripts: [], patternMatches: [], suspiciousNetworkCalls: [], envExfiltrationRisk: false, dynamicExecutionRisk: false, typosquattedPackages: [], riskLevel: 'safe', error: 'Invalid GitHub URL' }

  const [, owner, repoName] = match
  const baseRaw = `https://raw.githubusercontent.com/${owner}/${repoName}`
  const apiBase = `https://api.github.com/repos/${owner}/${repoName}`
  const headers: Record<string, string> = {}
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`

  let repoMeta: { created_at?: string; stargazers_count?: number; forks_count?: number; default_branch?: string; size?: number } = {}
  try {
    const metaRes = await fetch(apiBase, { headers, signal: AbortSignal.timeout(8000) })
    if (metaRes.ok) repoMeta = await metaRes.json()
  } catch { /* ignore */ }

  const repoAgeDays = repoMeta.created_at
    ? Math.floor((Date.now() - new Date(repoMeta.created_at).getTime()) / 86400000)
    : undefined

  const defaultBranch = repoMeta.default_branch ?? 'main'

  // Fetch package.json
  let hasPackageJson = false
  const dangerousScripts: string[] = []
  const typosquattedPackages: string[] = []

  try {
    const pkgRes = await fetch(`${baseRaw}/${defaultBranch}/package.json`, { signal: AbortSignal.timeout(8000) })
    if (pkgRes.ok) {
      hasPackageJson = true
      const pkg = await pkgRes.json()

      // Check lifecycle scripts
      if (pkg.scripts) {
        for (const script of LIFECYCLE_SCRIPTS) {
          if (pkg.scripts[script]) {
            const val: string = pkg.scripts[script]
            const isSafe = /^(tsc|prisma|next|node_modules)/.test(val)
            if (!isSafe) dangerousScripts.push(`${script}: ${val}`)
          }
        }
      }

      // Check for typosquatting
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies
      }
      for (const dep of Object.keys(allDeps ?? {})) {
        if (detectTyposquatting(dep)) typosquattedPackages.push(dep)
      }
    }
  } catch { /* ignore */ }

  // Scan source files
  const allMatches: PatternMatch[] = []
  for (const file of FILES_TO_SCAN) {
    try {
      const res = await fetch(`${baseRaw}/${defaultBranch}/${file}`, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        const code = await res.text()
        allMatches.push(...scanCodePatterns(code, file))
      }
    } catch { /* ignore */ }
  }

  const envExfiltrationRisk = allMatches.some(m => m.pattern === 'env_exfiltration' || m.pattern === 'env_dump' || m.pattern === 'private_key_env')
  const dynamicExecutionRisk = allMatches.some(m => m.pattern === 'eval_execution' || m.pattern === 'new_function' || m.pattern === 'child_process_exec')

  const suspiciousNetworkCalls: string[] = []
  const networkRegex = /(?:fetch|axios|http\.get|https\.get)\s*\(['"]?(https?:\/\/[^'"\s)]+)/g
  // collected from scan

  let riskLevel: 'safe' | 'warning' | 'critical' = 'safe'
  if (dangerousScripts.length > 0 || envExfiltrationRisk || dynamicExecutionRisk || typosquattedPackages.length > 0) riskLevel = 'critical'
  else if (allMatches.some(m => m.severity === 'high') || (repoAgeDays !== undefined && repoAgeDays < 14)) riskLevel = 'warning'

  return {
    owner,
    repo: repoName,
    repoAgeDays,
    stars: repoMeta.stargazers_count,
    forks: repoMeta.forks_count,
    defaultBranch,
    hasPackageJson,
    dangerousScripts,
    patternMatches: allMatches,
    suspiciousNetworkCalls,
    envExfiltrationRisk,
    dynamicExecutionRisk,
    typosquattedPackages,
    riskLevel
  }
}
