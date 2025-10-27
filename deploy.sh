#!/bin/bash

# Sasel Lab Production Deployment Script for sasellab.com
# Run this script on your AWS EC2 instance

set -e  # Exit on any error

echo "🚀 Starting Sasel Lab Production Deployment for sasellab.com"

# Configuration
PROJECT_DIR="/var/www/sasel_lab"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/venv"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to ensure virtual environment is activated
activate_venv() {
    if [ ! -f "$VENV_DIR/bin/activate" ]; then
        print_error "Virtual environment not found at $VENV_DIR"
        exit 1
    fi

    source $VENV_DIR/bin/activate

    if [ "$VIRTUAL_ENV" != "$VENV_DIR" ]; then
        print_error "Failed to activate virtual environment"
        exit 1
    fi

    print_status "Virtual environment active: $VIRTUAL_ENV"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# 1. System Dependencies
print_status "Installing system dependencies..."
sudo apt update
sudo apt install -y python3-pip python3-venv python3-dev nginx supervisor certbot python3-certbot-nginx sqlite3 curl

# Install Node.js 18.x for frontend
print_status "Installing Node.js for frontend..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version

# 2. Verify project structure
print_status "Verifying project structure..."

# Check if we're in the right directory
if [ ! -f "$BACKEND_DIR/requirements.txt" ]; then
    print_error "Project structure not found. Make sure the repository is cloned to $PROJECT_DIR"
    print_error "Expected file: $BACKEND_DIR/requirements.txt"
    exit 1
fi

print_status "Project structure verified ✓"

# 3. Create project directory permissions
print_status "Setting up project directory permissions..."
sudo chown -R $USER:$USER $PROJECT_DIR

# 4. Setup Python virtual environment
print_status "Creating Python virtual environment..."
cd $BACKEND_DIR

# Remove existing venv if it exists
if [ -d "$VENV_DIR" ]; then
    print_warning "Removing existing virtual environment..."
    rm -rf $VENV_DIR
fi

# Create new virtual environment
python3 -m venv $VENV_DIR

# Verify venv was created
if [ ! -f "$VENV_DIR/bin/activate" ]; then
    print_error "Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
activate_venv

# 5. Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Verify Django is installed
python -c "import django; print(f'Django {django.get_version()} installed')"

# 6. Environment configuration
print_status "Setting up environment configuration..."
if [ ! -f "$BACKEND_DIR/.env" ]; then
    print_warning "No .env file found. Using production environment template..."
    if [ -f "$BACKEND_DIR/.env.production" ]; then
        cp $BACKEND_DIR/.env.production $BACKEND_DIR/.env
        print_warning "Please edit .env file with your production values!"
        print_warning "IMPORTANT: Generate a new SECRET_KEY before continuing!"
        read -p "Press enter when you've updated the .env file..."
    else
        print_error "Production environment template not found at $BACKEND_DIR/.env.production"
        exit 1
    fi
fi

# 7. Setup SQLite database directory with proper permissions
print_status "Setting up SQLite database..."
sudo chown $USER:www-data $BACKEND_DIR
sudo chmod 775 $BACKEND_DIR

# 8. Django setup
print_status "Running Django migrations and setup..."
cd $BACKEND_DIR

# Ensure virtual environment is still activated
activate_venv

# Clear Django cache and old static files
print_status "Clearing Django cache and static files..."
rm -rf staticfiles
rm -rf __pycache__
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Run Django commands
python manage.py collectstatic --noinput --clear
python manage.py migrate

# Set proper permissions for SQLite database
if [ -f "$BACKEND_DIR/db.sqlite3" ]; then
    sudo chown $USER:www-data $BACKEND_DIR/db.sqlite3
    sudo chmod 664 $BACKEND_DIR/db.sqlite3
fi

# Set proper permissions for media directory
if [ -d "$BACKEND_DIR/media" ]; then
    sudo chown -R $USER:www-data $BACKEND_DIR/media
    sudo chmod -R 775 $BACKEND_DIR/media
fi

# 9. Create Django superuser (if needed)
print_status "Creating Django superuser (if needed)..."

# Ensure virtual environment is activated
activate_venv

python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@sasellab.com', 'change-this-password')
    print("Superuser 'admin' created")
else:
    print("Superuser already exists")
EOF

# 10. Frontend Build and Deployment
print_status "Building and deploying frontend..."
cd $FRONTEND_DIR

# Clear existing cache and builds
print_status "Clearing frontend cache and old builds..."
rm -rf .next
rm -rf node_modules/.cache

# Create production environment file
if [ ! -f "$FRONTEND_DIR/.env.production.local" ]; then
    if [ -f "$FRONTEND_DIR/.env.production" ]; then
        print_status "Using production environment configuration..."
        cp $FRONTEND_DIR/.env.production $FRONTEND_DIR/.env.production.local
    else
        print_warning "No .env.production found, creating default..."
        echo "NEXT_PUBLIC_API_URL=https://sasellab.com/api" > $FRONTEND_DIR/.env.production.local
    fi
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm ci

# Build the frontend
print_status "Building frontend for production..."
npm run build

print_status "Frontend build completed ✓"

# 11. Nginx configuration - HTTP only (SSL will be added after certbot)
print_status "Configuring Nginx (HTTP only, SSL will be added next)..."

# Create initial HTTP-only nginx configuration
sudo tee /etc/nginx/sites-available/sasellab.com > /dev/null << EOF
# Upstream definitions
upstream django_backend {
    server unix:$BACKEND_DIR/sasellab.sock fail_timeout=0;
}

upstream nextjs_frontend {
    server 127.0.0.1:3000;
}

# HTTP server - temporary configuration for SSL setup
server {
    listen 80;
    listen [::]:80;
    server_name sasellab.com www.sasellab.com 3.97.84.37;

    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client body size limit
    client_max_body_size 20M;

    # Common proxy settings
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_redirect off;
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    # Django static files
    location /static/ {
        alias $BACKEND_DIR/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Django media files
    location /media/ {
        alias $BACKEND_DIR/media/;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Django Admin
    location /admin {
        proxy_pass http://django_backend;
    }

    location /admin/ {
        proxy_pass http://django_backend;
    }

    # Django API
    location /api {
        proxy_pass http://django_backend;
    }

    location /api/ {
        proxy_pass http://django_backend;
    }

    # Next.js static files
    location /_next/static/ {
        proxy_pass http://nextjs_frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js frontend - all other routes
    location / {
        proxy_pass http://nextjs_frontend;

        # WebSocket support for Next.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass \$http_upgrade;
    }

    # Error pages
    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
        internal;
    }
}
EOF

# Enable the site and test configuration
sudo ln -sf /etc/nginx/sites-available/sasellab.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
if ! sudo nginx -t; then
    print_error "Nginx configuration test failed"
    exit 1
fi

print_status "Nginx HTTP configuration completed ✓"

# Create a simple error page
sudo mkdir -p /var/www/html
sudo tee /var/www/html/50x.html > /dev/null << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Sasel Lab - Service Temporarily Unavailable</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
        h1 { color: #333; }
        p { color: #666; }
    </style>
</head>
<body>
    <h1>Service Temporarily Unavailable</h1>
    <p>Sasel Lab services are starting up. Please try again in a moment.</p>
</body>
</html>
EOF

# 12. Supervisor configuration for services
print_status "Configuring Supervisor for service management..."

# Django/Gunicorn configuration
sudo tee /etc/supervisor/conf.d/sasellab-backend.conf > /dev/null << EOF
[program:sasellab-backend]
command=$VENV_DIR/bin/gunicorn --workers 3 --bind unix:$BACKEND_DIR/sasellab.sock --timeout 300 sasel_lab_site.wsgi:application
directory=$BACKEND_DIR
user=$USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/sasellab-backend.log
environment=PATH="$VENV_DIR/bin"
EOF

# Next.js frontend configuration
sudo tee /etc/supervisor/conf.d/sasellab-frontend.conf > /dev/null << EOF
[program:sasellab-frontend]
command=/usr/bin/npm start
directory=$FRONTEND_DIR
user=$USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/sasellab-frontend.log
environment=NODE_ENV="production",PORT="3000"
EOF

print_status "Supervisor configuration completed ✓"

# 13. SSL Certificate with Let's Encrypt
print_status "Setting up SSL certificate with Let's Encrypt..."

# Ensure required certbot files exist
sudo mkdir -p /etc/letsencrypt
if [ ! -f "/etc/letsencrypt/options-ssl-nginx.conf" ]; then
    print_status "Downloading certbot SSL configuration files..."
    sudo curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o /etc/letsencrypt/options-ssl-nginx.conf
    sudo curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o /etc/letsencrypt/ssl-dhparams.pem
fi

# Start nginx for Let's Encrypt challenge
print_status "Starting Nginx for SSL certificate verification..."
sudo systemctl start nginx

# Get SSL certificate
print_status "Requesting SSL certificate from Let's Encrypt..."
if sudo certbot --nginx -d sasellab.com -d www.sasellab.com --non-interactive --agree-tos --email admin@sasellab.com --redirect; then
    print_status "SSL certificate installed successfully ✓"

    # Verify SSL certificate was installed
    if [ -f "/etc/letsencrypt/live/sasellab.com/fullchain.pem" ]; then
        # Test configuration and reload
        if sudo nginx -t; then
            sudo systemctl reload nginx
            print_status "HTTPS configuration activated ✓"
        else
            print_error "Nginx configuration test failed after SSL setup"
        fi
    fi
else
    print_error "SSL certificate installation failed"
    print_warning "Continuing with HTTP-only configuration"
    print_warning "You can run 'sudo certbot --nginx -d sasellab.com -d www.sasellab.com' manually later"
    print_warning "Make sure your domain DNS is properly configured and pointing to this server"
fi

# 14. Start services
print_status "Starting services..."
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
sudo systemctl enable nginx supervisor
sudo systemctl restart nginx supervisor

# Wait for services to start
sleep 5

# Check service status
print_status "Checking service status..."
sudo supervisorctl status

# 15. Firewall configuration
print_status "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# 16. Setup automatic SSL renewal
print_status "Setting up automatic SSL certificate renewal..."
(sudo crontab -l 2>/dev/null || true; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -

# 17. Create backup script for SQLite database
print_status "Setting up database backup..."
sudo tee /usr/local/bin/sasellab-backup.sh > /dev/null << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/sasellab"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
sqlite3 $BACKEND_DIR/db.sqlite3 ".backup \$BACKUP_DIR/sasellab_backup_\$DATE.sqlite3"
# Keep only last 7 days of backups
find \$BACKUP_DIR -name "sasellab_backup_*.sqlite3" -mtime +7 -delete
echo "Backup completed: sasellab_backup_\$DATE.sqlite3"
EOF

sudo chmod +x /usr/local/bin/sasellab-backup.sh

# Setup daily backup
(sudo crontab -l 2>/dev/null || true; echo "0 2 * * * /usr/local/bin/sasellab-backup.sh") | sudo crontab -

print_status "✅ Sasel Lab Production Deployment Complete!"
echo ""
print_status "Your Sasel Lab application is now running at https://sasellab.com"
echo ""
print_status "Services deployed:"
print_status "- Frontend (Next.js): https://sasellab.com → port 3000"
print_status "- Backend (Django): https://sasellab.com/api/, /admin/ → Unix socket"
echo ""
print_status "Next steps:"
print_status "1. Update $BACKEND_DIR/.env with actual production SECRET_KEY"
print_status "2. Change default superuser password: cd $BACKEND_DIR && source venv/bin/activate && python manage.py changepassword admin"
print_status "3. Test the deployment: curl https://sasellab.com"
print_status "4. Monitor logs: sudo tail -f /var/log/sasellab-*.log"
echo ""
print_status "Service management commands:"
print_status "- sudo supervisorctl status"
print_status "- sudo supervisorctl restart sasellab-frontend"
print_status "- sudo supervisorctl restart sasellab-backend"
print_status "- sudo systemctl reload nginx"
echo ""
print_status "Database backup:"
print_status "- Manual backup: sudo /usr/local/bin/sasellab-backup.sh"
print_status "- Backups location: /var/backups/sasellab/"
echo ""
print_status "🎉 Deployment successful!"
