#!/bin/bash

# Oxford ERP Production Deployment Script
# This script sets up the complete production environment

set -e

echo "🎓 Oxford ERP Production Deployment Setup"
echo "=========================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root for security reasons"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed successfully"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
fi

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p {logs,uploads,ssl,backups}
mkdir -p deployment/ssl

# Generate SSL certificates (self-signed for development)
if [ ! -f "deployment/ssl/cert.pem" ]; then
    echo "🔐 Generating SSL certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout deployment/ssl/key.pem \
        -out deployment/ssl/cert.pem \
        -subj "/C=IN/ST=State/L=City/O=Oxford College/CN=localhost"
    echo "✅ SSL certificates generated"
fi

# Copy environment file
if [ ! -f "deployment/.env" ]; then
    echo "⚙️ Setting up environment configuration..."
    cp deployment/.env.production deployment/.env
    echo "📝 Please edit deployment/.env with your actual configuration values"
    echo "🔑 Don't forget to set your WhatsApp API credentials!"
fi

# Create MongoDB initialization script
cat > deployment/mongo-init.js << 'EOF'
// MongoDB initialization script
db = db.getSiblingDB('oxford-erp');

// Create collections
db.createCollection('students');
db.createCollection('faculty');
db.createCollection('attendance');
db.createCollection('marks');
db.createCollection('fees');
db.createCollection('notifications');

// Create indexes for better performance
db.students.createIndex({ "rollNumber": 1 }, { unique: true });
db.students.createIndex({ "email": 1 }, { unique: true });
db.faculty.createIndex({ "jobId": 1 }, { unique: true });
db.faculty.createIndex({ "email": 1 }, { unique: true });
db.attendance.createIndex({ "studentId": 1, "date": 1, "subject": 1 });
db.marks.createIndex({ "studentId": 1, "subject": 1, "examType": 1 });
db.fees.createIndex({ "studentId": 1, "status": 1 });
db.notifications.createIndex({ "timestamp": 1 });

print('✅ Oxford ERP database initialized successfully');
EOF

# Create backup script
cat > deployment/backup.sh << 'EOF'
#!/bin/bash

# Oxford ERP Backup Script
BACKUP_DIR="/app/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="oxford-erp-backup-$DATE.tar.gz"

echo "🔄 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec oxford-erp-mongodb mongodump --out /tmp/mongodb-backup
docker cp oxford-erp-mongodb:/tmp/mongodb-backup ./mongodb-backup-$DATE

# Backup uploads
cp -r uploads uploads-backup-$DATE

# Create compressed archive
tar -czf $BACKUP_DIR/$BACKUP_FILE mongodb-backup-$DATE uploads-backup-$DATE

# Cleanup temporary files
rm -rf mongodb-backup-$DATE uploads-backup-$DATE

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "oxford-erp-backup-*.tar.gz" -mtime +30 -delete

echo "✅ Backup completed: $BACKUP_FILE"
EOF

chmod +x deployment/backup.sh

# Create monitoring script
cat > deployment/monitor.sh << 'EOF'
#!/bin/bash

# Oxford ERP Monitoring Script
echo "🔍 Oxford ERP System Status"
echo "=========================="

# Check container status
echo "📦 Container Status:"
docker-compose ps

echo ""
echo "💾 Disk Usage:"
df -h

echo ""
echo "🧠 Memory Usage:"
free -h

echo ""
echo "📊 API Health Check:"
curl -s http://localhost:3001/api/health | jq '.' || echo "❌ API not responding"

echo ""
echo "📱 WhatsApp API Status:"
# Add WhatsApp API health check here

echo ""
echo "📈 Recent Logs (last 10 lines):"
docker-compose logs --tail=10 api
EOF

chmod +x deployment/monitor.sh

# Create systemd service for auto-start
if command -v systemctl &> /dev/null; then
    echo "🔧 Creating systemd service..."
    sudo tee /etc/systemd/system/oxford-erp.service > /dev/null << EOF
[Unit]
Description=Oxford ERP System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable oxford-erp.service
    echo "✅ Systemd service created and enabled"
fi

# Setup log rotation
sudo tee /etc/logrotate.d/oxford-erp > /dev/null << 'EOF'
/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart api
    endscript
}
EOF

echo ""
echo "🎉 Oxford ERP Production Setup Complete!"
echo "========================================"
echo ""
echo "📋 Next Steps:"
echo "1. Edit deployment/.env with your actual configuration"
echo "2. Set up your WhatsApp Business API credentials"
echo "3. Configure your domain and SSL certificates"
echo "4. Run: docker-compose up -d"
echo "5. Access your application at https://your-domain.com"
echo ""
echo "🔧 Useful Commands:"
echo "• Start system: docker-compose up -d"
echo "• Stop system: docker-compose down"
echo "• View logs: docker-compose logs -f"
echo "• Monitor system: ./deployment/monitor.sh"
echo "• Backup data: ./deployment/backup.sh"
echo ""
echo "📱 WhatsApp Integration:"
echo "• Webhook URL: https://your-domain.com/webhook/whatsapp"
echo "• Make sure to configure this in your WhatsApp Business API settings"
echo ""
echo "🔐 Security Notes:"
echo "• Change all default passwords in .env file"
echo "• Use proper SSL certificates for production"
echo "• Configure firewall rules"
echo "• Set up monitoring and alerting"
echo ""
echo "✅ Happy Learning! 🎓"
EOF

chmod +x deployment/setup.sh

# Create production README
cat > deployment/README.md << 'EOF'
# Oxford ERP Production Deployment

This directory contains all the necessary files for deploying Oxford ERP in a production environment.

## Quick Start

1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. Configure your environment:
   ```bash
   nano .env
   ```

3. Start the system:
   ```bash
   docker-compose up -d
   ```

## Configuration

### WhatsApp Business API Setup

1. Create a WhatsApp Business Account
2. Get your API credentials from Facebook Developer Console
3. Configure webhook URL: `https://your-domain.com/webhook/whatsapp`
4. Update `.env` file with your credentials

### SSL Certificates

For production, replace the self-signed certificates with proper SSL certificates:

```bash
# Using Let's Encrypt
certbot certonly --standalone -d your-domain.com
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
```

### Database Setup

The system automatically initializes MongoDB with proper indexes and collections.

## Monitoring

- System status: `./monitor.sh`
- Application logs: `docker-compose logs -f`
- Health check: `curl https://your-domain.com/api/health`

## Backup & Recovery

- Create backup: `./backup.sh`
- Backups are stored in `/app/backups`
- Automatic cleanup keeps last 30 days

## Scaling

To scale the application:

```bash
docker-compose up -d --scale api=3
```

## Security

- All passwords should be changed from defaults
- Use proper SSL certificates
- Configure firewall rules
- Regular security updates
- Monitor access logs

## Support

For technical support, contact: support@lifeboxnextgen.com
EOF

echo "✅ All deployment files created successfully!"
echo ""
echo "📋 Summary of what was created:"
echo "• Complete Docker setup with MongoDB, Redis, API, and Frontend"
echo "• Production-ready Nginx configuration with SSL"
echo "• WhatsApp Business API integration"
echo "• Real-time notifications with Socket.IO"
echo "• Automated backup and monitoring scripts"
echo "• Systemd service for auto-start"
echo "• Log rotation configuration"
echo "• Comprehensive documentation"
echo ""
echo "🚀 Your Oxford ERP system is ready for production deployment!"