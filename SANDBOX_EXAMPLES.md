# Vercel Sandboxes - Practical Examples for TrustHire

## Quick Test Commands

Once authenticated, you can test these commands:

### 1. Basic Sandbox Test
```bash
sandbox run echo "Hello from TrustHire Sandbox!"
```

### 2. Create Long-running Sandbox
```bash
# Create sandbox with 15 minute timeout
SANDBOX_ID=$(sandbox create --timeout 15m --silent)
echo "Sandbox ID: $SANDBOX_ID"

# Check Node.js version
sandbox exec $SANDBOX_ID node --version

# Install a package
sandbox exec $SANDBOX_ID npm install express

# Clean up
sandbox stop $SANDBOX_ID
```

### 3. Repository Analysis Example
```bash
# Create sandbox for repo analysis
SANDBOX_ID=$(sandbox create --timeout 10m --silent)

# Clone a repository
sandbox exec $SANDBOX_ID git clone https://github.com/expressjs/express.git /tmp/repo

# Analyze package.json
sandbox exec $SANDBOX_ID node -e "
const fs = require('fs');
const path = '/tmp/repo/package.json';
try {
  const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log('Package name:', pkg.name);
  console.log('Dependencies:', Object.keys(pkg.dependencies || {}).length);
  console.log('Scripts:', Object.keys(pkg.scripts || {}));
} catch (e) {
  console.log('No package.json found');
}
"

# Stop sandbox
sandbox stop $SANDBOX_ID
```

### 4. Code Security Analysis
```bash
# Create sandbox for code analysis
SANDBOX_ID=$(sandbox create --timeout 5m --silent)

# Create test file with suspicious code
cat > test-code.js << 'EOF'
const fs = require('fs');
const exec = require('child_process').exec;

// Suspicious code patterns
eval('console.log("This is dangerous")');
exec('rm -rf /', (error, stdout, stderr) => {
  console.log('This would be very bad!');
});

// Read sensitive files
try {
  const data = fs.readFileSync('/etc/passwd', 'utf8');
  console.log('Read system file');
} catch (e) {
  console.log('Could not read file');
}
EOF

# Copy to sandbox and analyze
sandbox copy test-code.js $SANDBOX_ID:/tmp/

# Analyze for dangerous patterns
sandbox exec $SANDBOX_ID node -e "
const fs = require('fs');
const content = fs.readFileSync('/tmp/test-code.js', 'utf8');

const dangerousPatterns = [
  'eval(',
  'exec(',
  'require(\'child_process\')',
  'fs.readFileSync',
  'rm -rf',
  'sudo',
  'chmod +x'
];

const found = dangerousPatterns.filter(pattern => content.includes(pattern));

console.log('Dangerous patterns found:', found.length);
found.forEach(pattern => console.log('- ' + pattern));

console.log('\\nSafety score:', Math.max(0, 100 - (found.length * 20)));
"

# Clean up
sandbox stop $SANDBOX_ID
rm test-code.js
```

### 5. URL Analysis in Sandbox
```bash
# Create sandbox for URL analysis
SANDBOX_ID=$(sandbox create --timeout 3m --silent)

# Test URL analysis
sandbox exec $SANDBOX_ID node -e "
const urls = [
  'https://github.com',
  'https://suspicious-site.tk',
  'http://phishing-domain.ml',
  'https://very-long-domain-name-that-looks-suspicious.com'
];

urls.forEach(url => {
  try {
    const urlObj = new URL(url);
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf'];
    const isSuspicious = suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld)) ||
                        urlObj.hostname.length > 30 ||
                        urlObj.protocol === 'http:';

    console.log(url);
    console.log('  Domain:', urlObj.hostname);
    console.log('  HTTPS:', urlObj.protocol === 'https:');
    console.log('  Suspicious:', isSuspicious);
    console.log('');
  } catch (e) {
    console.log('Invalid URL:', url);
  }
});
"

# Stop sandbox
sandbox stop $SANDBOX_ID
```

### 6. Interactive Sandbox Session
```bash
# Create long-running sandbox
SANDBOX_ID=$(sandbox create --timeout 30m --silent)
echo "Sandbox ID: $SANDBOX_ID"

# Start interactive shell
sandbox exec --interactive --tty $SANDBOX_ID bash

# Inside sandbox, you can run:
# pwd
# ls -la
# node --version
# npm --version
# mkdir /tmp/test
# cd /tmp/test
# npm init -y
# npm install lodash
# node -e "console.log(require('lodash').VERSION)"
# exit

# After exiting interactive shell, stop sandbox
sandbox stop $SANDBOX_ID
```

### 7. File Operations
```bash
# Create sandbox
SANDBOX_ID=$(sandbox create --timeout 5m --silent)

# Create local test file
echo "console.log('Hello from sandbox!');" > hello.js

# Copy to sandbox
sandbox copy hello.js $SANDBOX_ID:/tmp/

# Run in sandbox
sandbox exec $SANDBOX_ID node /tmp/hello.js

# Copy results back
sandbox exec $SANDBOX_ID "echo 'Analysis complete' > /tmp/result.txt"
sandbox copy $SANDBOX_ID:/tmp/result.txt ./result.txt

# View result
cat result.txt

# Clean up
sandbox stop $SANDBOX_ID
rm hello.js result.txt
```

## Integration with TrustHire

These examples show how Vercel Sandboxes can be integrated into TrustHire's security analysis workflow:

1. **Safe Repository Scanning** - Clone and analyze repos without local risk
2. **Code Pattern Detection** - Execute suspicious code in isolation
3. **URL Security Testing** - Test domains without actual network requests
4. **Package Analysis** - Examine npm packages without installing locally

## Cost Estimation

Based on these examples:
- Quick analysis (1-2 minutes): ~$0.01-0.02
- Repository scan (5-10 minutes): ~$0.05-0.10
- Complex analysis (15-30 minutes): ~$0.15-0.30

Very cost-effective for the security benefits provided!
