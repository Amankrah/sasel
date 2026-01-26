# Sasel Lab - Secure Production Deployment Guide

Complete deployment guide for deploying Sasel Lab to production on AWS EC2 with domain `sasellab.com`.

> ⚠️ **SECURITY FIRST**: This guide prioritizes security hardening BEFORE application deployment. Following a January 2026 cryptominer incident, all deployments must implement security measures as the first step.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Security Checklist](#security-checklist)
- [Phase 1: Security Hardening](#phase-1-security-hardening)
- [Phase 2: Server Setup](#phase-2-server-setup)
- [Phase 3: Application Deployment](#phase-3-application-deployment)
- [Phase 4: SSL & Final Configuration](#phase-4-ssl--final-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Security Monitoring](#security-monitoring)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Quick Reference](#quick-reference)

---

## Prerequisites

### Required Resources

| Resource | Value | Notes |
|----------|-------|-------|
| AWS EC2 Instance | Ubuntu 24.04 LTS | t3.small or larger |
| Elastic IP | Your assigned IP | Associate before deployment |
| Domain | sasellab.com | DNS must point to Elastic IP |
| SSH Key | Your .pem file | Keep secure, never commit to git |
| GitHub Repo | Your repository URL | Verify clean before deployment |

### Your IP Address

Before deployment, get your public IP for SSH restriction:

```bash
# Run this on YOUR machine (not the server)
curl -s ifconfig.me
```

**Write it down:** `___.___.___.___`

### Recommended EC2 Instance Specs

| Spec | Minimum | Recommended |
|------|---------|-------------|
| Instance Type | t3.micro | t3.small |
| vCPU | 1 | 2 |
| RAM | 1 GB | 2 GB |
| Storage | 15 GB | 20 GB SSD |
| OS | Ubuntu 22.04 | Ubuntu 24.04 LTS |

### Security Group Configuration

Configure **before** launching instance:

| Type | Port | Source | Description |
|------|------|--------|-------------|
| SSH | 22 | Your IP/32 | SSH access (your IP only!) |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |

⚠️ **Never** set SSH source to `0.0.0.0/0` (anywhere)

---

## Architecture Overview

```
                                    Internet
                                       │
                                  [Port 443 HTTPS]
                                       │
                              ┌────────┴────────┐
                              │  UFW Firewall   │
                              │  + fail2ban     │
                              └────────┬────────┘
                                       │
                                [Nginx Reverse Proxy]
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                      │
            [Django Backend]                      [Next.js Frontend]
            (/api, /admin)                        (All other routes)
                    │                                      │
            [Unix Socket]                           [Port 3000]
                    │                                      │
            [Gunicorn + Django]                   [Next.js Server]
                    │
                    ▼
            [SQLite Database]
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Security** | UFW, fail2ban, auto-updates | Protection |
| **Frontend** | Next.js + React | User interface |
| **Backend** | Django + Gunicorn | REST API & Admin |
| **Database** | SQLite | Data storage |
| **Web Server** | Nginx | Reverse proxy & SSL |
| **Process Manager** | Supervisor | Service management |

---

## Security Checklist

### Pre-Deployment
- [ ] Your IP noted for SSH restriction
- [ ] Git repository verified clean (`git status`)
- [ ] AWS Security Group restricts SSH to your IP
- [ ] Fresh EC2 instance (not reused from compromised server)

### During Deployment
- [ ] Security hardening runs FIRST (before app deployment)
- [ ] UFW firewall enabled with your IP only for SSH
- [ ] fail2ban installed and configured
- [ ] Automatic security updates enabled
- [ ] SSH hardened (key-only, no root login)
- [ ] Mining ports blocked (10128, 3333)
- [ ] Known attacker IPs blocked

### Post-Deployment
- [ ] Security check script installed and scheduled
- [ ] All services running via Supervisor
- [ ] SSL certificate installed
- [ ] Default admin password changed
- [ ] Test security monitoring script

---

## Phase 1: Security Hardening

> ⚠️ **CRITICAL**: Complete this phase BEFORE deploying the application!

### 1.1 Connect to Fresh EC2 Instance

```bash
# If you get host key warning (expected for new instance)
ssh-keygen -R 3.97.84.37

# Connect
chmod 400 sasel_key.pem
ssh -i sasel_key.pem ubuntu@3.97.84.37
```

### 1.2 System Updates

```bash
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y
```

### 1.3 Install Security Tools

```bash
sudo apt install -y \
    fail2ban \
    ufw \
    unattended-upgrades \
    apt-listchanges
```

### 1.4 Configure Firewall (UFW)

**Replace `70.82.222.218` with your actual IP address!**

```bash
# Reset UFW
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH ONLY from your IP
sudo ufw allow from 70.82.222.218 to any port 22 proto tcp comment 'SSH from my IP'

# Allow web traffic
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Block known attacker IPs
sudo ufw deny from 38.150.0.118 comment 'Known attacker'
sudo ufw deny from 67.210.97.41 comment 'Known attacker'

# Block mining ports
sudo ufw deny out to any port 10128 comment 'Block mining pool'
sudo ufw deny out to any port 3333 comment 'Block mining pool'

# Enable firewall
sudo ufw --force enable

# Verify
sudo ufw status verbose
```

### 1.5 Configure fail2ban

```bash
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
sudo fail2ban-client status sshd
```

### 1.6 Configure Automatic Security Updates

```bash
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
Unattended-Upgrade::Automatic-Reboot "false";
EOF

sudo systemctl enable unattended-upgrades
sudo systemctl start unattended-upgrades
```

### 1.7 SSH Hardening

```bash
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

sudo sshd -t && sudo systemctl restart sshd || sudo systemctl restart ssh
```

### 1.8 Install Security Monitoring Script

```bash
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

echo -e "\n--- Hidden directories in /tmp and /var/tmp ---"
find /tmp /var/tmp -name ".*" -type d 2>/dev/null | grep -v -E "^\.(X11|ICE|font|XIM)-unix$" || echo "None"

echo -e "\n--- Listening ports ---"
sudo ss -tlnp

echo -e "\n--- SSH authorized_keys ---"
cat ~/.ssh/authorized_keys 2>/dev/null | cut -d' ' -f3

echo -e "\n=== Check Complete ==="
EOFSCRIPT

sudo chmod +x /usr/local/bin/security-check.sh

# Schedule weekly security check
(crontab -l 2>/dev/null | grep -v "security-check.sh"; echo "0 8 * * 1 /usr/local/bin/security-check.sh >> /var/log/security-check.log 2>&1") | crontab -
```

### 1.9 Configure Temp Cleanup

```bash
sudo tee /etc/tmpfiles.d/tmp-clean.conf > /dev/null << 'EOF'
D /tmp 1777 root root 1d
D /var/tmp 1777 root root 7d
D /dev/shm 1777 root root 1d
EOF
```

### 1.10 Verify Security Hardening

```bash
sudo /usr/local/bin/security-check.sh
sudo ufw status verbose
sudo fail2ban-client status sshd
```

✅ **Security hardening complete!** Now proceed to Phase 2.

---

## Phase 2: Server Setup

### 2.1 Install System Dependencies

```bash
sudo apt install -y \
    python3-pip python3-venv python3-dev \
    nginx supervisor certbot python3-certbot-nginx \
    curl wget git build-essential \
    sqlite3 jq htop
```

### 2.2 Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node --version
npm --version
```

### 2.3 Configure Timezone

```bash
sudo timedatectl set-timezone America/Toronto
timedatectl
```

---

## Phase 3: Application Deployment

### 3.1 Clone Repository

```bash
sudo mkdir -p /var/www/sasel_lab
sudo chown $USER:$USER /var/www/sasel_lab

cd /var/www
git clone https://github.com/Amankrah/sasel.git sasel_lab
cd sasel_lab
```

### 3.2 Setup Python Backend

```bash
cd /var/www/sasel_lab/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

deactivate
```

### 3.3 Configure Backend Environment

```bash
cd /var/www/sasel_lab/backend

# Generate secret key
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

# Create .env file
cat > .env << EOF
DEBUG=False
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=sasellab.com,www.sasellab.com,3.97.84.37

CORS_ALLOWED_ORIGINS=https://sasellab.com,https://www.sasellab.com

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True
X_FRAME_OPTIONS=DENY
EOF

chmod 600 .env
```

### 3.4 Django Setup

```bash
cd /var/www/sasel_lab/backend
source venv/bin/activate

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser

deactivate

# Set permissions
sudo chown $USER:www-data /var/www/sasel_lab/backend
sudo chmod 775 /var/www/sasel_lab/backend
sudo chown $USER:www-data /var/www/sasel_lab/backend/db.sqlite3
sudo chmod 664 /var/www/sasel_lab/backend/db.sqlite3
```

### 3.5 Build Frontend

```bash
cd /var/www/sasel_lab/frontend

# Create production environment
cat > .env.production.local << EOF
NEXT_PUBLIC_API_URL=https://sasellab.com/api
NEXT_PUBLIC_SITE_URL=https://sasellab.com
EOF

chmod 600 .env.production.local

# Clear previous builds
rm -rf .next node_modules/.cache

# Install and build
npm ci
npm run build
```

### 3.6 Configure Nginx

```bash
sudo tee /etc/nginx/sites-available/sasellab.com > /dev/null << 'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

upstream django_backend {
    server unix:/var/www/sasel_lab/backend/sasellab.sock fail_timeout=0;
}

upstream nextjs_frontend {
    server 127.0.0.1:3000 fail_timeout=30s;
    keepalive 32;
}

# Block direct IP access
server {
    listen 80 default_server;
    server_name _;
    return 444;
}

server {
    listen 80;
    server_name sasellab.com www.sasellab.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 20M;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Django static files
    location /static/ {
        alias /var/www/sasel_lab/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Django media files
    location /media/ {
        alias /var/www/sasel_lab/backend/media/;
        expires 7d;
    }

    # Django admin
    location /admin {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://django_backend;
    }

    location /admin/ {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://django_backend;
    }

    # Django API
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://django_backend;
    }

    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://django_backend;
    }

    # Next.js static
    location /_next/static/ {
        proxy_pass http://nextjs_frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
        internal;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/sasellab.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
```

### 3.7 Configure Supervisor

```bash
VENV_DIR="/var/www/sasel_lab/backend/venv"
BACKEND_DIR="/var/www/sasel_lab/backend"
FRONTEND_DIR="/var/www/sasel_lab/frontend"

# Backend (Gunicorn)
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

# Frontend
NPM_PATH=$(which npm)
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

# Create log files
sudo touch /var/log/sasellab-{backend,backend-error,frontend,frontend-error}.log
sudo chown $USER:$USER /var/log/sasellab-*.log
```

### 3.8 Start Services

```bash
sudo systemctl enable nginx supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo systemctl start nginx
sudo supervisorctl start all

sleep 10
sudo supervisorctl status
```

---

## Phase 4: SSL & Final Configuration

### 4.1 Request SSL Certificate

```bash
# Download certbot files
sudo mkdir -p /etc/letsencrypt
if [ ! -f "/etc/letsencrypt/options-ssl-nginx.conf" ]; then
    sudo curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o /etc/letsencrypt/options-ssl-nginx.conf
    sudo curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o /etc/letsencrypt/ssl-dhparams.pem
fi

# Request certificate
sudo certbot --nginx \
    -d sasellab.com \
    -d www.sasellab.com \
    --non-interactive \
    --agree-tos \
    --email dishdevinfo@gmail.com \
    --redirect

# Setup auto-renewal
(sudo crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx") | sudo crontab -
```

### 4.2 Create Utility Scripts

```bash
# Backup script
sudo tee /usr/local/bin/sasellab-backup.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/sasellab"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
sqlite3 /var/www/sasel_lab/backend/db.sqlite3 ".backup $BACKUP_DIR/db_backup_$DATE.sqlite3"

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sqlite3" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sqlite3"
EOF
sudo chmod +x /usr/local/bin/sasellab-backup.sh

# Schedule daily backup
(sudo crontab -l 2>/dev/null | grep -v "sasellab-backup"; echo "0 2 * * * /usr/local/bin/sasellab-backup.sh >> /var/log/sasellab-backup.log 2>&1") | sudo crontab -

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
sudo tee /usr/local/bin/sasellab-update.sh > /dev/null << 'EOF'
#!/bin/bash
set -e
echo "🔄 Updating Sasel Lab..."

cd /var/www/sasel_lab
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate

# Update frontend
cd ../frontend
npm ci
npm run build

# Restart
sudo supervisorctl restart all
sudo systemctl reload nginx

echo "✅ Update complete!"
EOF
sudo chmod +x /usr/local/bin/sasellab-update.sh
```

---

## Post-Deployment Verification

### 5.1 Service Health Check

```bash
sudo supervisorctl status

# Test backend
curl -f http://localhost:3000 > /dev/null && echo "✅ Frontend OK" || echo "❌ Frontend FAILED"

# Test via domain
curl -f https://sasellab.com && echo "✅ HTTPS OK" || echo "❌ HTTPS FAILED"
```

### 5.2 Security Verification

```bash
sudo /usr/local/bin/security-check.sh
cat ~/.ssh/authorized_keys
sudo ufw status verbose
```

### 5.3 Change Admin Password

```bash
cd /var/www/sasel_lab/backend
source venv/bin/activate
python manage.py changepassword admin
```

---

## Security Monitoring

### Signs of Compromise

| Indicator | How to Check | Action |
|-----------|--------------|--------|
| High CPU | `htop` | Investigate process |
| Unknown cron jobs | `crontab -l` | Remove malicious entries |
| Unknown SSH keys | `cat ~/.ssh/authorized_keys` | Remove unauthorized |
| Suspicious processes | `ps aux \| grep -E "(mine\|xmrig)"` | Kill and investigate |

### Regular Checks

```bash
# Quick status
sasellab-status.sh

# Security check
sudo /usr/local/bin/security-check.sh

# Check logs
cat /var/log/security-check.log
```

---

## Troubleshooting

### Services Not Starting

```bash
sudo tail -f /var/log/sasellab-backend.log
sudo tail -f /var/log/sasellab-frontend.log
sudo supervisorctl restart all
```

### Database Permission Issues

```bash
cd /var/www/sasel_lab/backend
sudo chown $USER:www-data db.sqlite3
sudo chmod 664 db.sqlite3
sudo chown $USER:www-data .
sudo chmod 775 .
```

### 502 Bad Gateway

```bash
sudo supervisorctl status
sudo lsof -i :3000
sudo supervisorctl restart all
```

---

## Maintenance

### Update Application

```bash
sudo /usr/local/bin/sasellab-update.sh
```

### Backup Database

```bash
sudo /usr/local/bin/sasellab-backup.sh
ls -lh /var/backups/sasellab/
```

### System Updates

```bash
sudo apt update && sudo apt upgrade -y
sudo supervisorctl restart all
```

---

## Quick Reference

### Important Paths

```
/var/www/sasel_lab/                    # Project root
├── backend/                           # Django application
│   ├── venv/                         # Python virtual environment
│   ├── db.sqlite3                    # Database
│   ├── staticfiles/                  # Collected static files
│   └── .env                          # Backend configuration
├── frontend/                          # Next.js application
│   ├── .next/                        # Production build
│   └── .env.production.local         # Frontend configuration
└── deploy.sh                          # Deployment script

/etc/nginx/sites-available/sasellab.com
/etc/supervisor/conf.d/sasellab-*.conf
/var/log/sasellab-*.log
/var/log/security-check.log
/var/backups/sasellab/
```

### Essential Commands

```bash
# Status
sudo supervisorctl status
sasellab-status.sh

# Restart
sudo supervisorctl restart all && sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/sasellab-backend.log

# Update
sudo /usr/local/bin/sasellab-update.sh

# Security
sudo /usr/local/bin/security-check.sh

# Backup
sudo /usr/local/bin/sasellab-backup.sh

# Django management
cd /var/www/sasel_lab/backend && source venv/bin/activate && python manage.py <command>
```

### Firewall Management

```bash
# Check status
sudo ufw status verbose

# Update your IP if it changes
sudo ufw allow from NEW_IP to any port 22
sudo ufw delete allow from OLD_IP to any port 22
```

---

## Deployment Checklist

### Before Deployment
- [ ] Your IP noted
- [ ] Git repository clean
- [ ] AWS Security Group restricts SSH
- [ ] Fresh EC2 instance

### Phase 1: Security
- [ ] System updated
- [ ] UFW configured (SSH to your IP only)
- [ ] fail2ban configured
- [ ] Auto-updates enabled
- [ ] SSH hardened
- [ ] Security monitoring installed

### Phase 2-3: Application
- [ ] Dependencies installed
- [ ] Backend configured
- [ ] Frontend built
- [ ] Services running

### Phase 4: Final
- [ ] SSL certificate installed
- [ ] Admin password changed
- [ ] Security check passes

---

**Guide Version:** 2.0 (Security-Hardened Edition)  
**Last Updated:** January 2026  

---

_Built with ❤️ at SASEL Lab, McGill University_