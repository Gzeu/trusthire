#!/bin/bash

# TrustHire Autonomous System Deployment Script
# This script deploys the autonomous system to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_NAME="trusthire-autonomous"
DOCKER_COMPOSE_FILE="docker-compose.autonomous.yml"
ENV_FILE=".env.autonomous"
BACKUP_DIR="./backups"
LOG_DIR="./logs"

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "./data"
    mkdir -p "./prometheus/rules"
    mkdir -p "./grafana/provisioning/datasources"
    mkdir -p "./grafana/provisioning/dashboards"
    mkdir -p "./grafana/dashboards"
    mkdir -p "./nginx/ssl"
    mkdir -p "./alertmanager"
    mkdir -p "./logstash/pipeline"
    mkdir -p "./scripts"
    
    log_success "Directories created"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "Environment file not found. Creating template..."
        cp .env.autonomous.example "$ENV_FILE"
        log_warning "Please edit $ENV_FILE with your actual configuration"
        read -p "Press Enter to continue after editing the environment file..."
    fi
    
    # Load environment variables
    source "$ENV_FILE"
    
    log_success "Environment setup completed"
}

# Build application
build_application() {
    log_info "Building application..."
    
    # Install dependencies
    npm ci
    
    # Generate Prisma client
    npx prisma generate
    
    # Build the application
    npm run build
    
    log_success "Application built successfully"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    npx prisma migrate deploy
    
    log_success "Database migrations completed"
}

# Setup SSL certificates
setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    if [ ! -f "./nginx/ssl/cert.pem" ]; then
        log_warning "SSL certificates not found. Generating self-signed certificates..."
        
        # Generate self-signed certificate
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ./nginx/ssl/key.pem \
            -out ./nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        
        log_warning "Self-signed certificates generated. Replace with production certificates."
    fi
    
    log_success "SSL setup completed"
}

# Deploy services
deploy_services() {
    log_info "Deploying services..."
    
    # Stop existing services
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Pull latest images
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Start services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    log_success "Services deployed"
}

# Wait for services to be ready
wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    # Wait for application to be ready
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost:3000/api/autonomous/health-check &> /dev/null; then
            log_success "Application is ready"
            break
        fi
        
        attempt=$((attempt + 1))
        log_info "Waiting for application to be ready... (attempt $attempt/$max_attempts)"
        sleep 10
    done
    
    if [ $attempt -eq $max_attempts ]; then
        log_error "Application failed to become ready"
        exit 1
    fi
    
    # Wait for other services
    sleep 30
    log_success "All services are ready"
}

# Run health checks
run_health_checks() {
    log_info "Running health checks..."
    
    # Check application health
    if curl -f http://localhost:3000/api/autonomous/health-check &> /dev/null; then
        log_success "Application health check passed"
    else
        log_error "Application health check failed"
        exit 1
    fi
    
    # Check database connection
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T postgres pg_isready -U trusthire -d trusthire &> /dev/null; then
        log_success "Database health check passed"
    else
        log_error "Database health check failed"
        exit 1
    fi
    
    # Check Redis connection
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T redis redis-cli ping &> /dev/null; then
        log_success "Redis health check passed"
    else
        log_error "Redis health check failed"
        exit 1
    fi
    
    # Check Prometheus
    if curl -f http://localhost:9090/-/healthy &> /dev/null; then
        log_success "Prometheus health check passed"
    else
        log_warning "Prometheus health check failed"
    fi
    
    # Check Grafana
    if curl -f http://localhost:3001/api/health &> /dev/null; then
        log_success "Grafana health check passed"
    else
        log_warning "Grafana health check failed"
    fi
    
    log_success "Health checks completed"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Create Grafana datasources
    cat > ./grafana/provisioning/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF
    
    log_success "Monitoring setup completed"
}

# Create backup
create_backup() {
    log_info "Creating backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/backup_$timestamp.tar.gz"
    
    # Create backup of configuration and data
    tar -czf "$backup_file" \
        "$ENV_FILE" \
        ./docker-compose.autonomous.yml \
        ./prometheus/ \
        ./grafana/ \
        ./nginx/ \
        ./data/ \
        ./logs/
    
    log_success "Backup created: $backup_file"
}

# Display deployment information
display_info() {
    log_info "Deployment completed successfully!"
    echo ""
    echo "=== Access Information ==="
    echo "Application: http://localhost:3000"
    echo "Grafana Dashboard: http://localhost:3001 (admin/trusthire123)"
    echo "Prometheus: http://localhost:9090"
    echo "Kibana: http://localhost:5601"
    echo "AlertManager: http://localhost:9093"
    echo ""
    echo "=== Health Check ==="
    echo "curl http://localhost:3000/api/autonomous/health-check"
    echo ""
    echo "=== Logs ==="
    echo "Application logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f app"
    echo "All logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo ""
    echo "=== Management Commands ==="
    echo "Stop: docker-compose -f $DOCKER_COMPOSE_FILE down"
    echo "Restart: docker-compose -f $DOCKER_COMPOSE_FILE restart"
    echo "Update: ./scripts/update-autonomous.sh"
    echo "Backup: ./scripts/backup-autonomous.sh"
    echo ""
}

# Main deployment function
main() {
    log_info "Starting TrustHire Autonomous System deployment..."
    
    check_prerequisites
    create_directories
    setup_environment
    build_application
    run_migrations
    setup_ssl
    setup_monitoring
    deploy_services
    wait_for_services
    run_health_checks
    create_backup
    display_info
    
    log_success "TrustHire Autonomous System deployed successfully!"
}

# Script entry point
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
