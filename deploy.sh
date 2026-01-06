#!/bin/bash

# =============================================================================
# Sasel Lab - Secure Production Deployment Script
# Domain: sasellab.com
# =============================================================================
#
# This script deploys the Sasel Lab application with security hardening
# Run on a fresh Ubuntu 24.04 EC2 instance
#
# Usage: ALLOWED_SSH_IP=your.ip.here ./deploy-sasellab.sh
#
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION - Modify these for your environment
# =============================================================================

ALLOWED_SSH_IP="${ALLOWED_SSH_IP:-YOUR_IP_HERE}"

PROJECT_DIR="/var/www/sasel_lab"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/venv"

DOMAIN="sasellab.com"
SSL_EMAIL="admin@sasellab.com"
GIT_REPO="${GIT_REPO:-YOUR_REPO_URL_HERE}"

# =============================================================================
# COLORS AND HELPERS
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║            Sasel Lab - Secure Production Deployment              ║"
    echo "║                       sasellab.com                               ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_step() { echo -e "\n${BLUE}[STEP]${NC} $1\n"; }
print_section() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

activate_venv() {
    if [ ! -f "$VENV_DIR/bin/activate" ]; then
        print_error "Virtual environment not found"
        exit 1
    fi
    source "$VENV_DIR/bin/activate"
}

# Parse arguments
SKIP_SECURITY=false
SKIP_SSL=false
for arg in "$@"; do
    case $arg in
        --skip-security) SKIP_SECURITY=true ;;
        --skip-ssl) SKIP_SSL=true ;;
    esac
done

# =============================================================================
# PRE-FLIGHT CHECKS
# =============================================================================

print_banner

if [[ $EUID -eq 0 ]]; then
    print_error "Do not run as root. Run as ubuntu user with sudo access."
    exit 1
fi

if [[ "$ALLOWED_SSH_IP" == "YOUR_IP_HERE" ]]; then
    print_error "You must set ALLOWED_SSH_IP!"
    print_warning "Find your IP: curl -s ifconfig.me"
    print_warning "Then run: ALLOWED_SSH_IP=your.ip.here ./deploy-sasellab.sh"
    exit 1
fi

print_status "SSH will be restricted to: $ALLOWED_SSH_IP"
print_warning "Make sure this is YOUR IP or you will be locked out!"
echo ""
read -p "Press Enter to continue or Ctrl+C to abort..."

# =============================================================================
# PHASE 1: SECURITY HARDENING (BEFORE ANYTHING ELSE)
# =============================================================================

if [[ "$SKIP_SECURITY" == false ]]; then
    print_section "PHASE 1: SECURITY HARDENING"

    print_step "1.1 System Updates"
    sudo apt update
    sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y
    print_status "System updated"

    print_step "1.2 Installing Security Tools"
    sudo apt install -y \
        fail2ban \
        ufw \
        unattended-upgrades \
        apt-listchanges
    print_status "Security tools installed"

    print_step "1.3 Configuring Firewall (UFW)"
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow from "$ALLOWED_SSH_IP" to any port 22 proto tcp comment 'SSH from allowed IP'
    sudo ufw allow 80/tcp comment 'HTTP'
    sudo ufw allow 443/tcp comment 'HTTPS'
    sudo ufw deny from 38.150.0.118 comment 'Known attacker'
    sudo ufw deny from 67.210.97.41 comment 'Known attacker'
    sudo ufw deny out to any port 10128 comment 'Block mining pool'
    sudo ufw deny out to any port 3333 comment 'Block mining pool'
    sudo ufw --force enable
    print_status "Firewall configured"
    sudo ufw status verbose

    print_step "1.4 Configuring fail2ban"
    sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[DEFAULT]
bantime = 86400
findtime = 600
maxretry = 5
backend = systemd
banaction = ufw

[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
bantime = 86400
findtime = 600
EOF
    sudo systemctl enable fail2ban
    sudo systemctl restart fail2ban
    print_status "fail2ban configured"

    print_step "1.5 Configuring Automatic Security Updates"
    sudo tee /etc/apt/apt.conf.d/20auto-upgrades > /dev/null << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
EOF

    sudo tee /etc/apt/apt.conf.d/50unattended-upgrades > /dev/null << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF
    sudo systemctl enable unattended-upgrades
    sudo systemctl start unattended-upgrades
    print_status "Auto-updates configured"

    print_step "1.6 SSH Hardening"
    sudo tee /etc/ssh/sshd_config.d/hardening.conf > /dev/null << 'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitEmptyPasswords no
EOF
    if sudo sshd -t; then
        sudo systemctl restart sshd || sudo systemctl restart ssh
        print_status "SSH hardened"
    else
        print_error "SSH config error - skipping"
    fi

    print_step "1.7 Creating Security Monitoring Script"
    sudo tee /usr/local/bin/security-check.sh > /dev/null << 'EOFSCRIPT'
#!/bin/bash
echo "=== Security Check $(date) ==="

echo -e "\n--- Crontabs ---"
for user in $(cut -f1 -d: /etc/passwd); do
    crontab -u $user -l 2>/dev/null | grep -v "^#" | grep -v "^$" && echo "  ^ User: $user"
done

echo -e "\n--- Suspicious processes ---"
ps aux | grep -E "(javae|xmrig|mine|pnscan|cc.txt|kdevtmpfsi|immunify|/dev/shm/|/var/tmp/\.)" | grep -v grep || echo "None found"

echo -e "\n--- High CPU processes ---"
ps aux --sort=-%cpu | head -5

echo -e "\n--- Failed SSH attempts (last 24h) ---"
sudo grep "Failed password\|Invalid user" /var/log/auth.log 2>/dev/null | tail -10 || echo "None"

echo -e "\n--- fail2ban status ---"
sudo fail2ban-client status sshd 2>/dev/null || echo "fail2ban not running"

echo -e "\n--- Hidden directories in /tmp ---"
find /tmp /var/tmp -name ".*" -type d 2>/dev/null | grep -v -E "^\.(X11|ICE|font|XIM)-unix$" || echo "None"

echo -e "\n--- Listening ports ---"
sudo ss -tlnp

echo -e "\n--- SSH authorized_keys ---"
cat ~/.ssh/authorized_keys 2>/dev/null | cut -d' ' -f3

echo -e "\n=== Check Complete ==="
EOFSCRIPT
    sudo chmod +x /usr/local/bin/security-check.sh
    (crontab -l 2>/dev/null | grep -v "security-check.sh"; echo "0 8 * * 1 /usr/local/bin/security-check.sh >> /var/log/security-check.log 2>&1") | crontab -
    print_status "Security monitoring configured"

    print_step "1.8 Configuring Temp Cleanup"
    sudo tee /etc/tmpfiles.d/tmp-clean.conf > /dev/null << 'EOF'
D /tmp 1777 root root 1d
D /var/tmp 1777 root root 7d
D /dev/shm 1777 root root 1d
EOF
    print_status "Temp cleanup configured"

    print_status "Security hardening complete!"
else
    print_warning "Skipping security hardening (--skip-security flag)"
fi

# =============================================================================
# PHASE 2: SYSTEM DEPENDENCIES
# =============================================================================

print_section "PHASE 2: SYSTEM DEPENDENCIES"

print_step "2.1 Installing Build Dependencies"
sudo apt install -y \
    python3-pip python3-venv python3-dev \
    nginx supervisor certbot python3-certbot-nginx \
    curl wget git build-essential \
    sqlite3 jq htop
print_status "Dependencies installed"

print_step "2.2 Installing Node.js 20.x"
if ! command -v node &> /dev/null || ! node --version | grep -q "v20"; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
print_status "Node.js $(node --version)"

# =============================================================================
# PHASE 3: APPLICATION DEPLOYMENT
# =============================================================================

print_section "PHASE 3: APPLICATION DEPLOYMENT"

print_step "3.1 Cloning Repository"
if [ -d "$PROJECT_DIR" ]; then
    print_warning "Project exists, pulling latest..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    sudo mkdir -p "$(dirname $PROJECT_DIR)"
    sudo chown "$USER:$USER" "$(dirname $PROJECT_DIR)"
    git clone "$GIT_REPO" "$PROJECT_DIR"
fi
sudo chown -R "$USER:$USER" "$PROJECT_DIR"
print_status "Repository ready"

print_step "3.2 Setting up Python Backend"
cd "$BACKEND_DIR"

rm -rf "$VENV_DIR"
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"

pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

deactivate
print_status "Python environment ready"

print_step "3.3 Configuring Backend Environment"
cd "$BACKEND_DIR"

SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")

if [ ! -f ".env" ]; then
    cat > .env << EOF
DEBUG=False
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=$DOMAIN,www.$DOMAIN,localhost,127.0.0.1

CORS_ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True
X_FRAME_OPTIONS=DENY
EOF
    chmod 600 .env
    print_status "Backend .env created"
else
    print_warning ".env exists, keeping it"
fi

print_step "3.4 Django Setup"
cd "$BACKEND_DIR"
source "$VENV_DIR/bin/activate"

rm -rf staticfiles __pycache__
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

python manage.py collectstatic --noinput --clear
python manage.py migrate

# Set permissions
sudo chown "$USER:www-data" "$BACKEND_DIR"
sudo chmod 775 "$BACKEND_DIR"
if [ -f "$BACKEND_DIR/db.sqlite3" ]; then
    sudo chown "$USER:www-data" "$BACKEND_DIR/db.sqlite3"
    sudo chmod 664 "$BACKEND_DIR/db.sqlite3"
fi

deactivate
print_status "Django configured"

print_step "3.5 Building Frontend"
cd "$FRONTEND_DIR"

rm -rf .next node_modules/.cache 2>/dev/null || true

if [ ! -f ".env.production.local" ]; then
    cat > .env.production.local << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF
    chmod 600 .env.production.local
fi

npm ci
npm run build
print_status "Frontend built"

# =============================================================================
# PHASE 4: SERVER CONFIGURATION
# =============================================================================

print_section "PHASE 4: SERVER CONFIGURATION"

print_step "4.1 Configuring Nginx"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=general_limit:10m rate=30r/s;

upstream django_backend {
    server unix:$BACKEND_DIR/sasellab.sock fail_timeout=0;
}

upstream nextjs_frontend {
    server 127.0.0.1:3000 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80 default_server;
    server_name _;
    return 444;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 20M;

    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_redirect off;
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    location /static/ {
        alias $BACKEND_DIR/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias $BACKEND_DIR/media/;
        expires 7d;
    }

    location /admin {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://django_backend;
    }

    location /admin/ {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://django_backend;
    }

    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://django_backend;
    }

    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://django_backend;
    }

    location /_next/static/ {
        proxy_pass http://nextjs_frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass \$http_upgrade;
    }

    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
        internal;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
print_status "Nginx configured"

# Create error page
sudo mkdir -p /var/www/html
sudo tee /var/www/html/50x.html > /dev/null << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Sasel Lab - Service Temporarily Unavailable</title>
    <style>
        body { font-family: -apple-system, sans-serif; text-align: center; margin-top: 100px; background: #1a365d; color: white; }
        .container { background: rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔬 Sasel Lab</h1>
        <h2>Service Temporarily Unavailable</h2>
        <p>Our services are starting up. Please try again in a moment.</p>
    </div>
</body>
</html>
EOF

print_step "4.2 Configuring Supervisor"

NPM_PATH=$(which npm)

sudo tee /etc/supervisor/conf.d/sasellab-backend.conf > /dev/null << EOF
[program:sasellab-backend]
command=$VENV_DIR/bin/gunicorn --workers 3 --bind unix:$BACKEND_DIR/sasellab.sock --timeout 300 sasel_lab_site.wsgi:application
directory=$BACKEND_DIR
user=$USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/sasellab-backend.log
stderr_logfile=/var/log/sasellab-backend-error.log
environment=PATH="$VENV_DIR/bin"
stopwaitsecs=60
stopsignal=KILL
stopasgroup=true
killasgroup=true
EOF

sudo tee /etc/supervisor/conf.d/sasellab-frontend.conf > /dev/null << EOF
[program:sasellab-frontend]
command=$NPM_PATH start
directory=$FRONTEND_DIR
user=$USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/sasellab-frontend.log
stderr_logfile=/var/log/sasellab-frontend-error.log
environment=NODE_ENV="production",PORT="3000"
stopwaitsecs=60
stopsignal=KILL
stopasgroup=true
killasgroup=true
EOF

sudo touch /var/log/sasellab-{backend,backend-error,frontend,frontend-error}.log
sudo chown "$USER:$USER" /var/log/sasellab-*.log
print_status "Supervisor configured"

# =============================================================================
# PHASE 5: START SERVICES AND SSL
# =============================================================================

print_section "PHASE 5: STARTING SERVICES"

print_step "5.1 Starting Services"
sudo systemctl enable nginx supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo systemctl start nginx
sudo supervisorctl start all

sleep 10
sudo supervisorctl status

print_step "5.2 SSL Certificate"
if [[ "$SKIP_SSL" == false ]]; then
    sudo mkdir -p /etc/letsencrypt
    if [ ! -f "/etc/letsencrypt/options-ssl-nginx.conf" ]; then
        sudo curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o /etc/letsencrypt/options-ssl-nginx.conf
        sudo curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o /etc/letsencrypt/ssl-dhparams.pem
    fi

    print_warning "Requesting SSL certificate..."
    if sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$SSL_EMAIL" --redirect; then
        print_status "SSL installed"
        sudo nginx -t && sudo systemctl reload nginx
    else
        print_error "SSL failed - configure manually later"
    fi

    (sudo crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx") | sudo crontab -
else
    print_warning "Skipping SSL (--skip-ssl flag)"
fi

# =============================================================================
# PHASE 6: UTILITY SCRIPTS
# =============================================================================

print_section "PHASE 6: CREATING UTILITY SCRIPTS"

# Backup script
sudo tee /usr/local/bin/sasellab-backup.sh > /dev/null << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/sasellab"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
sqlite3 $BACKEND_DIR/db.sqlite3 ".backup \$BACKUP_DIR/db_backup_\$DATE.sqlite3"
find \$BACKUP_DIR -name "db_backup_*.sqlite3" -mtime +7 -delete
echo "Backup: db_backup_\$DATE.sqlite3"
EOF
sudo chmod +x /usr/local/bin/sasellab-backup.sh

# Status script
sudo tee /usr/local/bin/sasellab-status.sh > /dev/null << 'EOF'
#!/bin/bash
echo "=== Sasel Lab Status ==="
echo ""
echo "Services:"
sudo supervisorctl status
echo ""
echo "Firewall:"
sudo ufw status | head -15
echo ""
echo "fail2ban:"
sudo fail2ban-client status sshd 2>/dev/null | grep -E "(Currently|Total)" || echo "Not running"
echo ""
echo "Disk:"
df -h / | tail -1
echo ""
echo "Memory:"
free -h | grep Mem
EOF
sudo chmod +x /usr/local/bin/sasellab-status.sh

# Update script
sudo tee /usr/local/bin/sasellab-update.sh > /dev/null << EOF
#!/bin/bash
set -e
echo "🔄 Updating Sasel Lab..."

cd $PROJECT_DIR
git pull origin main

cd $BACKEND_DIR
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate

cd $FRONTEND_DIR
npm ci
npm run build

sudo supervisorctl restart all
sudo systemctl reload nginx

echo "✅ Update complete!"
EOF
sudo chmod +x /usr/local/bin/sasellab-update.sh

# Schedule backup
(sudo crontab -l 2>/dev/null | grep -v "sasellab-backup"; echo "0 2 * * * /usr/local/bin/sasellab-backup.sh >> /var/log/sasellab-backup.log 2>&1") | sudo crontab -

print_status "Utility scripts created"

# =============================================================================
# COMPLETION
# =============================================================================

print_banner

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    🎉 DEPLOYMENT COMPLETE! 🎉                    ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo "
🌍 Your application is running at:
   • https://$DOMAIN

🔒 Security measures active:
   • SSH restricted to: $ALLOWED_SSH_IP
   • fail2ban: Blocking after 3 failed attempts
   • Firewall: Mining ports blocked
   • Auto-updates: Security patches enabled

📁 Important paths:
   • Project: $PROJECT_DIR
   • Backend logs: /var/log/sasellab-backend.log
   • Frontend logs: /var/log/sasellab-frontend.log

🛠 Utility commands:
   • Status: sasellab-status.sh
   • Update: sudo /usr/local/bin/sasellab-update.sh
   • Backup: sudo /usr/local/bin/sasellab-backup.sh
   • Security: sudo /usr/local/bin/security-check.sh

⚠️  Next steps:
   1. Create Django superuser:
      cd $BACKEND_DIR && source venv/bin/activate && python manage.py createsuperuser
   2. Verify DNS: dig $DOMAIN
   3. Test: curl https://$DOMAIN
"