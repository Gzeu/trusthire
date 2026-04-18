# TrustHire API Gateway Setup Guide

## Overview

This guide explains how to set up and configure the KrakenD API Gateway for TrustHire, including rate limiting, caching, and monitoring.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Redis (included in Docker setup)

## Quick Start

### 1. Update Dependencies

Add the new dependencies to your project:

```bash
# Install ioredis for Redis connectivity
npm install ioredis

# Update package.json with new scripts
cp package-updated.json package.json
npm install
```

### 2. Environment Configuration

Copy the gateway environment file:

```bash
cp .env.gateway .env.local
```

Update the environment variables in `.env.local`:

```env
# Gateway Configuration
GATEWAY_URL=http://localhost:8080
GATEWAY_API_KEY=your_secure_api_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Add to your existing .env.local
```

### 3. Start Services

Start all services with Docker Compose:

```bash
# Start gateway and monitoring stack
npm run docker:up

# Or start individual services
npm run gateway
npm run monitoring
```

### 4. Verify Setup

Check if services are running:

```bash
# Gateway health check
curl http://localhost:8080/__health

# API metrics
curl http://localhost:8080/__debug/metrics

# Application health
curl http://localhost:3000/api/health
```

## Services Overview

### KrakenD API Gateway (Port 8080)

**Features:**
- Rate limiting per endpoint
- Response caching
- CORS configuration
- Request routing to Vercel APIs
- Performance monitoring

**Rate Limits:**
- Assessment: 20 requests/minute
- Sandbox analysis: 5 requests/minute
- Repository scans: 10 requests/minute
- URL scans: 100 requests/minute
- Global API: 1000 requests/minute

**Cache TTL:**
- Security patterns: 1 hour
- Analysis results: 30 minutes
- Recent assessments: 5 minutes

### Redis (Port 6379)

**Features:**
- Response caching
- Session management
- Rate limiting storage
- Performance optimization

**Configuration:**
- Max memory: 256MB
- Eviction policy: All keys LRU
- Persistence: Enabled

### Prometheus (Port 9090)

**Features:**
- Metrics collection
- Performance monitoring
- Alerting rules
- Data retention: 200 hours

**Access:**
- URL: http://localhost:9090
- Default: No authentication (development)

### Grafana (Port 3000)

**Features:**
- Visualization dashboard
- Custom panels
- Alert management
- User management

**Access:**
- URL: http://localhost:3000
- Username: admin
- Password: trusthire123

## API Endpoints

### Gateway Endpoints

All application APIs are proxied through the gateway:

```bash
# Assessment creation
POST http://localhost:8080/assessment

# Sandbox analysis
POST http://localhost:8080/sandbox/analyze

# Repository scanning
POST http://localhost:8080/scan/repo

# URL scanning
POST http://localhost:8080/scan/url

# Security patterns
GET http://localhost:8080/patterns

# Recent assessments
GET http://localhost:8080/assessments/recent

# Report generation
POST http://localhost:8080/report
```

### Monitoring Endpoints

```bash
# Application health
GET http://localhost:3000/api/health

# Prometheus metrics
GET http://localhost:3000/api/metrics

# Gateway metrics
GET http://localhost:8080/__debug/metrics

# Gateway health
GET http://localhost:8080/__health
```

## Configuration

### Gateway Configuration

Edit `krakend.json` to customize:

- **Rate limits**: Adjust `rate_limit` settings
- **Cache TTL**: Modify `cache.ttl` values
- **Timeouts**: Change `timeout` and backend timeouts
- **CORS**: Update allowed origins and headers

### Redis Configuration

Edit `redis.conf` to customize:

- **Memory limits**: Adjust `maxmemory`
- **Persistence**: Modify save intervals
- **Security**: Add password protection

### Monitoring Configuration

Edit `prometheus.yml` to customize:

- **Scrape intervals**: Adjust timing
- **Targets**: Add new monitoring targets
- **Rules**: Add alerting rules

## Development Workflow

### 1. Local Development

```bash
# Start Next.js application
npm run dev

# Start gateway in separate terminal
npm run gateway

# Test through gateway
curl -X POST http://localhost:8080/assessment \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 2. Testing Rate Limits

```bash
# Test rate limiting (should work first 20 times)
for i in {1..25}; do
  curl -X POST http://localhost:8080/assessment \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}' \
    -w "Status: %{http_code}, Remaining: %{x-rate-limit-remaining}\n"
done
```

### 3. Monitoring Performance

```bash
# View real-time metrics
curl http://localhost:8080/__debug/metrics

# Check system health
curl http://localhost:3000/api/health | jq

# View Grafana dashboard
open http://localhost:3000
```

## Production Deployment

### 1. Environment Variables

Set these in your production environment:

```env
GATEWAY_URL=https://your-domain.com
GATEWAY_API_KEY=your_production_api_key
REDIS_URL=your_production_redis_url
```

### 2. Security Considerations

- **API Keys**: Use strong, randomly generated keys
- **HTTPS**: Enable SSL/TLS in production
- **Firewall**: Restrict access to monitoring ports
- **Authentication**: Add authentication to Grafana

### 3. Performance Optimization

- **Caching**: Adjust TTL based on data freshness requirements
- **Rate Limits**: Balance between protection and usability
- **Monitoring**: Set up alerts for performance degradation

## Troubleshooting

### Common Issues

**Gateway not starting:**
```bash
# Check Docker logs
docker-compose logs krakend

# Verify configuration
docker-compose config
```

**Redis connection issues:**
```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# View Redis logs
docker-compose logs redis
```

**Rate limiting not working:**
```bash
# Check gateway configuration
cat krakend.json | jq '.endpoints[].rate_limit'

# Test with curl headers
curl -I http://localhost:8080/assessment
```

**Metrics not appearing:**
```bash
# Check Prometheus targets
open http://localhost:9090/targets

# Verify metrics endpoint
curl http://localhost:3000/api/metrics
```

### Performance Issues

**Slow response times:**
1. Check Redis connectivity
2. Verify cache hit rates
3. Monitor backend API performance
4. Adjust timeout settings

**High memory usage:**
1. Check Redis memory usage
2. Adjust cache TTL values
3. Monitor request patterns
4. Scale resources if needed

## Next Steps

1. **Custom Dashboards**: Create Grafana dashboards for specific metrics
2. **Alerting**: Set up Prometheus alerts for critical metrics
3. **Load Testing**: Test performance under load
4. **Security**: Add authentication and authorization
5. **Scaling**: Prepare for horizontal scaling

## Support

For issues or questions:

1. Check the logs: `npm run docker:logs`
2. Review configuration files
3. Consult KrakenD documentation
4. Check Docker and Docker Compose status

---

**Note**: This setup is designed for development and can be adapted for production deployment with appropriate security measures.
