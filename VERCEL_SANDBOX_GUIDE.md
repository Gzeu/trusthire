# Vercel Sandboxes Integration Guide for TrustHire

## Setup Complete! 

### What we've accomplished:
- [x] Installed Vercel Sandbox CLI
- [x] Authenticated with Vercel
- [x] Created demo implementation
- [x] Deployed sandbox demo page

## How Vercel Sandboxes would work in TrustHire:

### 1. Repository Analysis (Real Implementation)
```bash
# Create a sandbox for repo analysis
SANDBOX_ID=$(sandbox create --timeout 5m --silent)

# Clone repository securely
sandbox exec $SANDBOX_ID git clone https://github.com/user/repo.git /tmp/repo

# Analyze package.json for dangerous scripts
sandbox exec $SANDBOX_ID node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('/tmp/repo/package.json', 'utf8'));
const dangerous = Object.keys(pkg.scripts || {})
  .filter(script => pkg.scripts[script].includes('rm -rf') || 
                   pkg.scripts[script].includes('curl | bash'));
console.log(JSON.stringify({ dangerous, hasPackageJson: true }));
"

# Clean up
sandbox stop $SANDBOX_ID
```

### 2. Code Execution in Isolated Environment
```bash
# Execute suspicious code safely
SANDBOX_ID=$(sandbox create --timeout 2m --silent)

# Copy code to sandbox
sandbox copy ./suspicious-code.js $SANDBOX_ID:/app/

# Execute and capture output
RESULT=$(sandbox exec $SANDBOX_ID node /app/suspicious-code.js)

# Stop sandbox
sandbox stop $SANDBOX_ID
```

### 3. URL/Domain Analysis
```bash
# Test URLs in isolated environment
SANDBOX_ID=$(sandbox create --timeout 1m --silent)

sandbox exec $SANDBOX_ID node -e "
const url = process.argv[1];
const urlObj = new URL(url);
const suspicious = urlObj.hostname.includes('.tk') || 
                   urlObj.hostname.includes('.ml') ||
                   urlObj.hostname.length > 30;
console.log(JSON.stringify({
  domain: urlObj.hostname,
  suspicious,
  hasHttps: urlObj.protocol === 'https:'
}));
" "https://suspicious-domain.tk"
```

## Benefits for TrustHire:

### Security
- **Zero Risk**: Code runs in isolated Linux containers
- **No Access**: Cannot reach environment variables or database
- **Sandboxed**: File system and network are isolated

### Performance
- **Parallel**: Multiple sandboxes can run simultaneously
- **Fast**: Sandboxes start in seconds
- **Efficient**: Only pay for active CPU time

### Scalability
- **Auto-scaling**: Vercel manages infrastructure
- **No Setup**: No local configuration needed
- **Global**: Sandboxes run close to users

## Current Implementation Status:

### Demo Mode (Currently Active)
- URL: https://trusthire-five.vercel.app/sandbox
- Simulated sandbox functionality
- Shows UI and workflow
- Safe for demonstration

### Production Mode (Future)
```javascript
// Real sandbox integration
import { Sandbox } from "@vercel/sandbox";

export class SandboxService {
  static async analyzeRepository(repoUrl: string) {
    const sandbox = await Sandbox.create({ timeout: 30000 });
    
    try {
      // Clone and analyze in real sandbox
      await sandbox.runCommand("git", ["clone", repoUrl, "/tmp/repo"]);
      const result = await sandbox.runCommand("node", [analysisScript]);
      
      return JSON.parse(await result.stdout());
    } finally {
      await sandbox.stop();
    }
  }
}
```

## Next Steps for Production:

1. **Configure Environment Variables**
   ```env
   VERCEL_TOKEN=your_vercel_token
   SANDBOX_ENABLED=true
   ```

2. **Update Sandbox Service**
   - Replace simulated functions with real @vercel/sandbox
   - Add error handling and timeouts
   - Implement proper cleanup

3. **Add Monitoring**
   - Track sandbox usage and costs
   - Monitor execution times
   - Log security events

4. **Testing**
   - Test with known malicious repositories
   - Verify isolation works correctly
   - Performance testing with concurrent sandboxes

## Cost Considerations:

- **CPU Time**: ~$0.0002 per second
- **Memory**: Included with CPU time
- **Storage**: Temporary, cleaned up automatically
- **Network**: Included, no data transfer costs

## Security Best Practices:

1. **Always stop sandboxes** when done
2. **Use timeouts** to prevent runaway processes
3. **Limit resource usage** with appropriate timeouts
4. **Never pass secrets** to sandbox commands
5. **Validate all inputs** before sandbox execution

## Example Use Cases:

### Malicious Package Detection
```bash
# Test npm package without installing locally
sandbox exec sb_abc123 "npm install suspicious-package --dry-run"
```

### Code Pattern Analysis
```bash
# Analyze JavaScript for eval() usage
sandbox exec sb_abc123 "grep -r 'eval(' /tmp/code/"
```

### URL Safety Testing
```bash
# Test URL without making actual requests
sandbox exec sb_abc123 "node analyze-url.js https://phishing-site.tk"
```

## Conclusion:

Vercel Sandboxes provide the perfect solution for TrustHire's security analysis needs. They offer:
- Maximum security through isolation
- Excellent performance and scalability
- Cost-effective usage model
- Easy integration with existing Vercel infrastructure

The demo implementation shows the full workflow, and production deployment is just a few configuration changes away!
