# TrustHire Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting steps for common issues you may encounter while using TrustHire. Issues are organized by category with step-by-step solutions.

---

## Installation & Setup Issues

### Database Connection Errors

#### Problem: "Can't reach database server"
```bash
Error: PrismaClientUnknownRequestError: Invalid prisma.user.findUnique() invocation:
```

**Solutions:**
1. **Check Database URL**
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

2. **Database Server Status**
```bash
# PostgreSQL
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

3. **Network Issues**
```bash
# Test connectivity
telnet localhost 5432

# Check firewall
sudo ufw status
```

#### Problem: "Migration failed"
```bash
Error: P3001: Migration failed to apply
```

**Solutions:**
1. **Reset Database**
```bash
npx prisma migrate reset --force
npx prisma migrate dev
```

2. **Check Migration Files**
```bash
# View migration files
ls prisma/migrations/

# Manually apply SQL
psql $DATABASE_URL -f prisma/migrations/001_init.sql
```

3. **Schema Validation**
```bash
npx prisma validate
npx prisma generate
```

### Dependency Issues

#### Problem: "Module not found"
```bash
Error: Cannot find module '@prisma/client'
```

**Solutions:**
1. **Reinstall Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Clear npm Cache**
```bash
npm cache clean --force
npm install
```

3. **Check Node Version**
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

#### Problem: "TypeScript compilation errors"
```bash
Error: Type 'string' is not assignable to type 'number'
```

**Solutions:**
1. **Check TypeScript Configuration**
```bash
npx tsc --noEmit
```

2. **Update Type Definitions**
```bash
npx prisma generate
npm run build
```

3. **Fix Type Errors**
- Review error messages for specific type mismatches
- Update interfaces to match expected types
- Use proper type assertions

---

## Runtime Issues

### Application Startup

#### Problem: "Port already in use"
```bash
Error: listen EADDRINUSE :::3000
```

**Solutions:**
1. **Kill Process on Port**
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use fuser
fuser -k 3000/tcp
```

2. **Change Port**
```bash
# Use different port
npm run dev -- -p 3001
```

#### Problem: "Environment variables not found"
```bash
Error: DATABASE_URL is not defined
```

**Solutions:**
1. **Check Environment File**
```bash
# Verify .env.local exists
ls -la .env*

# Create from example
cp .env.example .env.local
```

2. **Load Environment Variables**
```bash
# Source environment file
source .env.local

# Or use dotenv
npm install dotenv
```

3. **Verify Variable Names**
```bash
# Check for typos
grep -n "DATABASE_URL" .env.local
```

### Performance Issues

#### Problem: "Slow API responses"
```bash
Response time: >5 seconds
```

**Solutions:**
1. **Database Optimization**
```sql
-- Add indexes
CREATE INDEX CONCURRENTLY idx_assessments_created_at 
ON assessments(created_at);

-- Analyze tables
ANALYZE assessments;
```

2. **Enable Caching**
```bash
# Check Redis connection
redis-cli ping

# Enable Redis in .env.local
REDIS_URL="redis://localhost:6379"
```

3. **Monitor Resources**
```bash
# Check memory usage
free -h

# Check CPU usage
top -p $(pgrep node)

# Check database connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

#### Problem: "Memory leaks"
```bash
Error: JavaScript heap out of memory
```

**Solutions:**
1. **Increase Node Memory Limit**
```bash
# Increase heap size
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

2. **Monitor Memory Usage**
```bash
# Memory profiling
node --inspect app.js

# Use clinic.js
npm install -g clinic
clinic doctor -- node app.js
```

3. **Fix Memory Leaks**
- Review code for event listener cleanup
- Check for circular references
- Optimize database queries

---

## API Issues

### Authentication Problems

#### Problem: "Invalid JWT token"
```bash
Error: 401 Unauthorized - Invalid token
```

**Solutions:**
1. **Check Token Format**
```bash
# Decode JWT token
node -e "
const token = '<your-token>';
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
console.log(payload);
"
```

2. **Verify Token Expiration**
```bash
# Check expiration
node -e "
const token = '<your-token>';
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
console.log('Expires:', new Date(payload.exp * 1000));
"
```

3. **Regenerate Token**
```bash
# Request new token
curl -X POST https://trusthire.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password"}'
```

#### Problem: "Rate limit exceeded"
```bash
Error: 429 Too Many Requests
```

**Solutions:**
1. **Check Rate Limit Headers**
```bash
curl -I https://trusthire.com/api/assessment/create \
     -H "Authorization: Bearer <token>"
```

2. **Wait and Retry**
```bash
# Implement exponential backoff
sleep 30
# Retry request
```

3. **Increase Rate Limits**
```bash
# Contact support for higher limits
# or implement client-side rate limiting
```

### API Response Issues

#### Problem: "500 Internal Server Error"
```bash
Error: Internal server error
```

**Solutions:**
1. **Check Server Logs**
```bash
# Application logs
tail -f logs/application.log

# Error logs
tail -f logs/error.log

# System logs
journalctl -u trusthire
```

2. **Debug Mode**
```bash
# Enable debug logging
DEBUG=trusthire:* npm run dev
```

3. **Check Database Status**
```bash
# Database connectivity
npx prisma db pull

# Database health
psql $DATABASE_URL -c "SELECT 1;"
```

#### Problem: "Malformed request"
```bash
Error: 400 Bad Request
```

**Solutions:**
1. **Validate Request Body**
```bash
# Check JSON syntax
echo '{"test": "data"}' | jq .

# Validate against schema
curl -X POST https://trusthire.com/api/assessment/create \
     -H "Content-Type: application/json" \
     -d '{"type": "github_repo", "target": "https://github.com/user/repo"}' \
     --dry-run
```

2. **Check Headers**
```bash
# Verify content type
curl -v -X POST https://trusthire.com/api/assessment/create \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>"
```

---

## AI/ML Service Issues

### Model Loading Problems

#### Problem: "Model not found"
```bash
Error: ML model 'threat_detection_v1' not found
```

**Solutions:**
1. **Check Model Registry**
```bash
# List available models
curl https://trusthire.com/api/ml/models \
     -H "Authorization: Bearer <token>"
```

2. **Train Missing Model**
```bash
# Train model
curl -X POST https://trusthire.com/api/ml/models/threat_detection_v1/train \
     -H "Authorization: Bearer <token>" \
     -d '{"training_data": "path/to/data"}'
```

3. **Check Model Files**
```bash
# Verify model files exist
ls -la models/threat_detection_v1/
```

#### Problem: "Model training failed"
```bash
Error: Training job failed with error
```

**Solutions:**
1. **Check Training Logs**
```bash
# Training logs
tail -f logs/training.log

# Check training status
curl https://trusthire.com/api/ml/models/threat_detection_v1/training-status \
     -H "Authorization: Bearer <token>"
```

2. **Validate Training Data**
```bash
# Check data format
head -n 5 training_data.json

# Validate JSON schema
jq . training_data.json
```

3. **Adjust Training Parameters**
```bash
# Reduce batch size
curl -X POST https://trusthire.com/api/ml/models/threat_detection_v1/train \
     -H "Authorization: Bearer <token>" \
     -d '{"batch_size": 16, "epochs": 50}'
```

### Prediction Issues

#### Problem: "Prediction timeout"
```bash
Error: Request timeout after 30 seconds
```

**Solutions:**
1. **Check Model Performance**
```bash
# Model metrics
curl https://trusthire.com/api/ml/models/threat_detection_v1/metrics \
     -H "Authorization: Bearer <token>"
```

2. **Optimize Request**
```bash
# Reduce input size
curl -X POST https://trusthire.com/api/ml/predict \
     -H "Authorization: Bearer <token>" \
     -d '{"data": "small_input"}'
```

3. **Increase Timeout**
```bash
# Configure timeout
export PREDICTION_TIMEOUT=60000
```

---

## Database Issues

### Connection Problems

#### Problem: "Too many connections"
```bash
Error: sorry, too many clients already
```

**Solutions:**
1. **Check Connection Count**
```bash
# Active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Connection limits
psql $DATABASE_URL -c "SHOW max_connections;"
```

2. **Close Idle Connections**
```bash
# Close idle connections
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';"
```

3. **Increase Connection Limit**
```bash
# Edit postgresql.conf
max_connections = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Problem: "Database locked"
```bash
Error: database is locked
```

**Solutions:**
1. **Check Lock Status**
```bash
# Active locks
psql $DATABASE_URL -c "SELECT * FROM pg_locks;"

# Blocked queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';"
```

2. **Kill Blocking Process**
```bash
# Find blocking PID
psql $DATABASE_URL -c "SELECT pid, query FROM pg_stat_activity WHERE wait_event_type = 'Lock';"

# Kill process
psql $DATABASE_URL -c "SELECT pg_terminate_backend(<PID>);"
```

3. **Optimize Queries**
```bash
# Explain query plan
psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM assessments;"

# Add indexes
psql $DATABASE_URL -c "CREATE INDEX CONCURRENTLY idx_assessments_status ON assessments(status);"
```

### Performance Issues

#### Problem: "Slow queries"
```bash
Query took 10+ seconds
```

**Solutions:**
1. **Analyze Slow Queries**
```bash
# Enable slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

# View slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

2. **Optimize Database**
```bash
# Update statistics
ANALYZE;

# Reindex database
REINDEX DATABASE trusthire;

# Vacuum tables
VACUUM ANALYZE assessments;
```

3. **Add Missing Indexes**
```bash
# Find missing indexes
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

# Create composite indexes
CREATE INDEX CONCURRENTLY idx_assessments_status_created 
ON assessments(status, created_at);
```

---

## Security Issues

### SSL/TLS Problems

#### Problem: "SSL certificate error"
```bash
Error: unable to get local issuer certificate
```

**Solutions:**
1. **Update Certificate Bundle**
```bash
# Update CA certificates
sudo apt-get update && sudo apt-get install ca-certificates

# Or on macOS
brew update && brew upgrade ca-certificates
```

2. **Disable SSL Verification (Development Only)**
```bash
# Set environment variable
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Or in code
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
```

3. **Use Custom Certificate**
```bash
# Specify certificate path
export SSL_CERT_FILE=/path/to/certificate.pem
```

#### Problem: "CORS error"
```bash
Error: No 'Access-Control-Allow-Origin' header is present
```

**Solutions:**
1. **Check CORS Configuration**
```bash
# Verify CORS settings
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://trusthire.com/api/assessment/create
```

2. **Update CORS Settings**
```typescript
// In middleware
cors({
  origin: ['https://example.com', 'https://trusthire.com'],
  credentials: true
});
```

3. **Add Preflight Handler**
```typescript
// Handle OPTIONS requests
app.options('*', cors());
```

---

## Deployment Issues

### Vercel Deployment

#### Problem: "Build failed"
```bash
Error: Build failed with exit code 1
```

**Solutions:**
1. **Check Build Logs**
```bash
# View detailed logs
npx vercel logs <deployment-id>

# Local build test
npm run build
```

2. **Fix TypeScript Errors**
```bash
# Check TypeScript
npx tsc --noEmit

# Fix type errors
# Review error messages and update types
```

3. **Update Dependencies**
```bash
# Update to compatible versions
npm update

# Clear build cache
rm -rf .next
npm run build
```

#### Problem: "Environment variables not working"
```bash
Error: DATABASE_URL is not defined
```

**Solutions:**
1. **Check Environment Variables**
```bash
# List environment variables
npx vercel env ls

# Add missing variables
npx vercel env add DATABASE_URL
```

2. **Verify Variable Names**
```bash
# Check for typos
npx vercel env pull .env.production
cat .env.production
```

3. **Redeploy**
```bash
# Redeploy with new environment
npx vercel --prod
```

### Docker Issues

#### Problem: "Container won't start"
```bash
Error: Container exited with code 1
```

**Solutions:**
1. **Check Container Logs**
```bash
# View logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>
```

2. **Debug Container**
```bash
# Run interactive shell
docker run -it --entrypoint /bin/sh trusthire:latest

# Check processes
ps aux
```

3. **Fix Dockerfile**
```dockerfile
# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

#### Problem: "Out of memory"
```bash
Error: Container killed due to memory limit
```

**Solutions:**
1. **Increase Memory Limit**
```bash
# Set memory limit
docker run --memory=2g trusthire:latest
```

2. **Optimize Application**
```bash
# Profile memory usage
docker stats <container-id>

# Fix memory leaks
# Review code for memory issues
```

3. **Use Swap Space**
```bash
# Enable swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Monitoring & Debugging

### Health Checks

#### Problem: "Health check failing"
```bash
Error: Health check failed
```

**Solutions:**
1. **Check Health Endpoint**
```bash
# Test health endpoint
curl https://trusthire.com/api/health

# Check response
curl -w "%{http_code}" https://trusthire.com/api/health
```

2. **Verify Dependencies**
```bash
# Database health
psql $DATABASE_URL -c "SELECT 1;"

# Redis health
redis-cli ping

# External API health
curl -I https://api.openai.com/v1/models
```

3. **Fix Health Check**
```typescript
// Improve health check
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis
    await redis.ping();
    
    // Check external services
    const externalCheck = await checkExternalServices();
    
    return Response.json({
      status: 'healthy',
      services: {
        database: 'healthy',
        redis: 'healthy',
        external: externalCheck
      }
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 });
  }
}
```

### Logging Issues

#### Problem: "No logs appearing"
```bash
# No log output
```

**Solutions:**
1. **Check Log Configuration**
```bash
# Verify log level
export LOG_LEVEL=debug

# Check log file permissions
ls -la logs/
```

2. **Enable Debug Logging**
```typescript
// Configure logger
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

3. **Check Log Rotation**
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/trusthire

# Test logrotate
sudo logrotate -f /etc/logrotate.d/trusthire
```

---

## Performance Optimization

### Database Optimization

#### Slow Query Optimization
```sql
-- Identify slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_table_column 
ON table(column);

-- Analyze table statistics
ANALYZE table_name;
```

#### Connection Pooling
```typescript
// Configure connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pool settings
const poolConfig = {
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};
```

### Caching Optimization

#### Redis Configuration
```bash
# Redis configuration
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### Application Caching
```typescript
// Implement caching
export const withCache = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.url}`;
    const cached = await cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    next();
  };
};
```

---

## Getting Help

### Support Channels

1. **Documentation**: [docs.trusthire.com](https://docs.trusthire.com)
2. **GitHub Issues**: [github.com/Gzeu/trusthire/issues](https://github.com/Gzeu/trusthire/issues)
3. **Community Forum**: [discussions.github.com](https://github.com/Gzeu/trusthire/discussions)
4. **Email Support**: support@trusthire.com

### Reporting Issues

When reporting issues, include:
1. **Environment**: OS, Node.js version, database version
2. **Error Messages**: Complete error messages and stack traces
3. **Steps to Reproduce**: Detailed reproduction steps
4. **Expected Behavior**: What you expected to happen
5. **Actual Behavior**: What actually happened

### Debug Information

```bash
# System information
uname -a
node --version
npm --version
psql --version

# Application information
npm list --depth=0
npx prisma --version
git log --oneline -1

# Environment variables
env | grep -E "(DATABASE|REDIS|JWT|NODE)"
```

---

## Quick Reference

### Common Commands
```bash
# Development
npm run dev
npm run build
npm start

# Database
npx prisma generate
npx prisma migrate dev
npx prisma studio

# Testing
npm test
npm run test:coverage
npm run test:e2e

# Deployment
npx vercel --prod
docker build -t trusthire .
docker run -p 3000:3000 trusthire
```

### Environment Variables
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/trusthire"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="your-openai-api-key"
NODE_ENV="production"
```

### Health Check Endpoints
```bash
# Application health
curl https://trusthire.com/api/health

# Database health
curl https://trusthire.com/api/health/database

# Services health
curl https://trusthire.com/api/health/services
```

---

*Last updated: April 19, 2026*
