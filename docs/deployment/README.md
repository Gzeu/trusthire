# TrustHire Deployment Guide

## Overview

This guide covers the complete deployment process for the TrustHire AI-Powered Security Operations Platform, including development, staging, and production environments.

## Prerequisites

### System Requirements
- **Node.js**: 18.0+ 
- **Database**: PostgreSQL 14+ or SQLite 3.0+
- **Redis**: 6.0+ (optional, for caching)
- **Memory**: 4GB+ RAM recommended
- **Storage**: 20GB+ available space
- **Network**: Stable internet connection

### Environment Setup
- **Git**: For source code management
- **Docker**: For containerization (optional)
- **Kubernetes**: For orchestration (production)
- **Domain**: Custom domain (production)

---

## Environment Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trusthire"
# OR for SQLite
DATABASE_URL="file:./dev.db"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GROQ_API_KEY="your-groq-api-key"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External Services
VIRUSTOTAL_API_KEY="your-virustotal-api-key"
MISP_URL="https://your-misp-instance.com"
MISP_API_KEY="your-misp-api-key"

# Load Balancer
LOAD_BALANCER_ENABLED="true"
LOAD_BALANCER_ALGORITHM="round_robin"

# Monitoring
PROMETHEUS_ENABLED="true"
GRAFANA_URL="https://your-grafana-instance.com"

# Vercel (production)
VERCEL_ENV="production"
VERCEL_PROJECT_NAME="trusthire"
```

### Database Setup

#### PostgreSQL
```bash
# Create database
createdb trusthire

# Run migrations
npx prisma migrate dev

# Seed data (optional)
npx prisma db seed
```

#### SQLite
```bash
# Initialize database
npx prisma migrate dev

# Create SQLite file
touch dev.db
```

---

## Development Deployment

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/Gzeu/trusthire.git
cd trusthire
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Access Application**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Database Studio**: `npx prisma studio`

### Development Docker Setup

1. **Create Docker Compose**
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: trusthire
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

2. **Start Services**
```bash
docker-compose -f docker-compose.dev.yml up
```

---

## Staging Deployment

### Vercel Staging

1. **Connect to Vercel**
```bash
npx vercel link
```

2. **Environment Variables**
```bash
# Set environment variables in Vercel dashboard
# or via CLI
npx vercel env add DATABASE_URL
npx vercel env add JWT_SECRET
npx vercel env add OPENAI_API_KEY
```

3. **Deploy to Staging**
```bash
npx vercel --env preview
```

### Docker Staging

1. **Build Image**
```bash
docker build -t trusthire:staging .
```

2. **Run Container**
```bash
docker run -d \
  --name trusthire-staging \
  -p 3001:3000 \
  --env-file .env.staging \
  trusthire:staging
```

---

## Production Deployment

### Vercel Production

1. **Domain Configuration**
```bash
# Add custom domain
npx vercel domains add trusthire.com
```

2. **Environment Variables**
```bash
# Production environment variables
npx vercel env add DATABASE_URL production
npx vercel env add JWT_SECRET production
npx vercel env add OPENAI_API_KEY production
```

3. **Deploy**
```bash
npx vercel --prod
```

4. **Verify Deployment**
```bash
# Check deployment status
npx vercel ls
```

### Kubernetes Production

1. **Create Namespace**
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: trusthire
```

2. **ConfigMap**
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trusthire-config
  namespace: trusthire
data:
  NODE_ENV: "production"
  PORT: "3000"
```

3. **Secret**
```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: trusthire-secrets
  namespace: trusthire
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  OPENAI_API_KEY: <base64-encoded-openai-key>
```

4. **Deployment**
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: trusthire
  namespace: trusthire
spec:
  replicas: 3
  selector:
    matchLabels:
      app: trusthire
  template:
    metadata:
      labels:
        app: trusthire
    spec:
      containers:
      - name: trusthire
        image: trusthire:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: trusthire-config
        - secretRef:
            name: trusthire-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

5. **Service**
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: trusthire-service
  namespace: trusthire
spec:
  selector:
    app: trusthire
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

6. **Ingress**
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: trusthire-ingress
  namespace: trusthire
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - trusthire.com
    secretName: trusthire-tls
  rules:
  - host: trusthire.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: trusthire-service
            port:
              number: 80
```

7. **Deploy to Kubernetes**
```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

### AWS Production

1. **ECS Setup**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name trusthire

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

2. **RDS Database**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier trusthire-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password yourpassword \
  --allocated-storage 20
```

3. **ElastiCache Redis**
```bash
# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-id trusthire-redis \
  --replication-group-description "TrustHire Redis" \
  --num-cache-clusters 2 \
  --cache-node-type cache.t3.micro \
  --engine redis
```

---

## Monitoring & Logging

### Prometheus Setup

1. **Prometheus Configuration**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'trusthire'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
```

2. **Grafana Dashboard**
```json
{
  "dashboard": {
    "title": "TrustHire Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      }
    ]
  }
}
```

### Logging Setup

1. **Winston Configuration**
```typescript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

---

## Performance Optimization

### Database Optimization

1. **Connection Pooling**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pool configuration
const poolConfig = {
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};
```

2. **Indexing Strategy**
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_assessments_created_at ON assessments(created_at);
CREATE INDEX idx_threats_severity ON threats(severity);
CREATE INDEX idx_users_email ON users(email);
```

### Caching Strategy

1. **Redis Caching**
```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl: number = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  }
};
```

2. **Application Caching**
```typescript
// Cache middleware
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

## Security Hardening

### SSL/TLS Configuration

1. **Nginx Configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name trusthire.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Security Headers

```typescript
// lib/security.ts
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

---

## Backup & Recovery

### Database Backup

1. **Automated Backups**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="trusthire_backup_$DATE.sql"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://trusthire-backups/

# Clean up local file
rm $BACKUP_FILE
```

2. **Cron Job**
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

### Disaster Recovery

1. **Recovery Script**
```bash
#!/bin/bash
# recovery.sh
BACKUP_FILE=$1

# Download from S3
aws s3 cp s3://trusthire-backups/$BACKUP_FILE .

# Restore database
psql $DATABASE_URL < $BACKUP_FILE
```

---

## Scaling Strategy

### Horizontal Scaling

1. **Load Balancer Configuration**
```yaml
# load-balancer.yaml
apiVersion: v1
kind: Service
metadata:
  name: trusthire-lb
spec:
  selector:
    app: trusthire
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

2. **Auto-scaling**
```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: trusthire-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: trusthire
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Troubleshooting

### Common Issues

1. **Database Connection**
```bash
# Check database connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

2. **Memory Issues**
```bash
# Check memory usage
docker stats

# Increase memory limit
docker run --memory=2g trusthire
```

3. **Performance Issues**
```bash
# Check logs
kubectl logs -f deployment/trusthire

# Monitor resources
kubectl top pods
```

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis
    await redis.ping();
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: 'healthy',
        ai: 'healthy'
      }
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 500 });
  }
}
```

---

## Maintenance

### Regular Tasks

1. **Database Maintenance**
```bash
# Update statistics
ANALYZE;

# Rebuild indexes
REINDEX DATABASE trusthire;

# Vacuum
VACUUM ANALYZE;
```

2. **Log Rotation**
```bash
# Configure logrotate
/var/log/trusthire/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 trusthire trusthire
}
```

3. **Security Updates**
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Support & Monitoring

### Alerting Setup

1. **Prometheus Alerts**
```yaml
# alerts.yml
groups:
- name: trusthire
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage"
```

2. **Slack Integration**
```yaml
# alertmanager.yml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'

route:
  receiver: 'slack-notifications'

receivers:
- name: 'slack-notifications'
  slack_configs:
  - channel: '#alerts'
    title: 'TrustHire Alert'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

---

## Conclusion

This deployment guide provides comprehensive instructions for deploying TrustHire across different environments. Follow the appropriate section based on your deployment needs:

- **Development**: Local development setup
- **Staging**: Pre-production testing
- **Production**: Full production deployment

For additional support, refer to the [troubleshooting guide](./troubleshooting.md) or contact the support team.

---

*Last updated: April 19, 2026*
