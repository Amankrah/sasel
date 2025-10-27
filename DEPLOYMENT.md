# Sasel Lab Deployment Guide

Complete deployment guide for deploying Sasel Lab to production on AWS EC2 with domain `sasellab.com` and Elastic IP `3.97.84.37`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Server Setup](#server-setup)
- [Domain Configuration](#domain-configuration)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

---

## Prerequisites

### Required Resources

- AWS EC2 instance (Ubuntu 20.04 or later recommended)
- Elastic IP: `3.97.84.37`
- Domain: `sasellab.com`
- SSH key pair for EC2 access (`sasel.pem`)

### Local Requirements

- Git installed
- SSH client
- Access to domain DNS settings

---

## Server Setup

### 1. Connect to EC2 Instance

```bash
# Set correct permissions for SSH key
chmod 400 sasel.pem

# Connect to EC2 instance
ssh -i sasel.pem ubuntu@3.97.84.37
```

### 2. Initial Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install basic utilities
sudo apt install -y git curl wget vim

# Configure timezone (optional)
sudo timedatectl set-timezone America/New_York
```

### 3. Create Project Directory

```bash
# Create project directory
sudo mkdir -p /var/www/sasel_lab
sudo chown $USER:$USER /var/www/sasel_lab

# Clone repository
cd /var/www
git clone <your-repository-url> sasel_lab
cd sasel_lab
```

---

## Domain Configuration

### DNS Settings

Configure your DNS records for `sasellab.com`:

| Type  | Name | Value        | TTL  |
|-------|------|--------------|------|
| A     | @    | 3.97.84.37   | 300  |
| A     | www  | 3.97.84.37   | 300  |

**Note:** DNS propagation can take up to 48 hours, but typically completes within 1-2 hours.

### Verify DNS Configuration

```bash
# Check DNS resolution
dig sasellab.com
dig www.sasellab.com

# Or use nslookup
nslookup sasellab.com
nslookup www.sasellab.com
```

---

## Deployment Steps

### 1. Configure Environment Variables

#### Backend Environment

```bash
# Edit backend production environment
cd /var/www/sasel_lab/backend
nano .env.production
```

Update the following values:

```env
DEBUG=False
SECRET_KEY=<GENERATE_A_SECURE_RANDOM_KEY>
ALLOWED_HOSTS=sasellab.com,www.sasellab.com,3.97.84.37

CORS_ALLOWED_ORIGINS=https://sasellab.com,https://www.sasellab.com

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True
X_FRAME_OPTIONS=DENY
```

**Generate a secure SECRET_KEY:**

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### Frontend Environment

```bash
# Edit frontend production environment
cd /var/www/sasel_lab/frontend
nano .env.production
```

Ensure it contains:

```env
NEXT_PUBLIC_API_URL=https://sasellab.com/api
```

### 2. Run Deployment Script

```bash
# Make deployment script executable
cd /var/www/sasel_lab
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

The script will:
- Install system dependencies (Python, Node.js, Nginx, etc.)
- Set up Python virtual environment
- Install Python and Node.js dependencies
- Run Django migrations
- Collect Django static files
- Build Next.js frontend
- Configure Nginx
- Set up Supervisor for process management
- Request SSL certificate from Let's Encrypt
- Configure firewall
- Set up automated backups

**Note:** The script will pause and ask you to confirm the `.env` file has been configured correctly. Make sure you've set the SECRET_KEY before continuing.

---

## Post-Deployment

### 1. Change Default Admin Password

```bash
cd /var/www/sasel_lab/backend
source venv/bin/activate
python manage.py changepassword admin
```

### 2. Verify Services are Running

```bash
# Check Supervisor services
sudo supervisorctl status

# Should show:
# sasellab-backend    RUNNING
# sasellab-frontend   RUNNING
```

### 3. Test the Deployment

```bash
# Test HTTPS
curl -I https://sasellab.com

# Test API endpoint
curl https://sasellab.com/api/

# Test admin panel
curl -I https://sasellab.com/admin/
```

### 4. Access Admin Panel

Visit `https://sasellab.com/admin/` and log in with:
- Username: `admin`
- Password: (the one you just set)

---

## Troubleshooting

### Services Not Starting

```bash
# Check logs
sudo tail -f /var/log/sasellab-backend.log
sudo tail -f /var/log/sasellab-frontend.log

# Restart services
sudo supervisorctl restart sasellab-backend
sudo supervisorctl restart sasellab-frontend
```

### Nginx Issues

```bash
# Check nginx configuration
sudo nginx -t

# View nginx error log
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test renewal process
sudo certbot renew --dry-run
```

### Database Permission Issues

```bash
# Fix database permissions
cd /var/www/sasel_lab/backend
sudo chown $USER:www-data db.sqlite3
sudo chmod 664 db.sqlite3
sudo chown $USER:www-data .
sudo chmod 775 .
```

### Frontend Build Issues

```bash
# Rebuild frontend manually
cd /var/www/sasel_lab/frontend
rm -rf .next node_modules
npm ci
npm run build

# Restart frontend service
sudo supervisorctl restart sasellab-frontend
```

### Port Already in Use

```bash
# Check what's using port 3000 or 8000
sudo lsof -i :3000
sudo lsof -i :8000

# Kill the process if needed
sudo kill -9 <PID>

# Restart services
sudo supervisorctl restart all
```

---

## Maintenance

### Updating the Application

```bash
# Pull latest changes
cd /var/www/sasel_lab
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo supervisorctl restart sasellab-backend

# Update frontend
cd ../frontend
npm ci
npm run build
sudo supervisorctl restart sasellab-frontend

# Reload nginx
sudo systemctl reload nginx
```

### Database Backups

#### Manual Backup

```bash
# Run manual backup
sudo /usr/local/bin/sasellab-backup.sh

# View backups
ls -lh /var/backups/sasellab/
```

#### Automated Backups

Backups are automatically created daily at 2:00 AM and kept for 7 days.

#### Restore from Backup

```bash
# Stop backend service
sudo supervisorctl stop sasellab-backend

# Restore database
cd /var/www/sasel_lab/backend
cp db.sqlite3 db.sqlite3.old  # Backup current
sqlite3 db.sqlite3 ".restore /var/backups/sasellab/sasellab_backup_YYYYMMDD_HHMMSS.sqlite3"

# Restart backend service
sudo supervisorctl start sasellab-backend
```

### Monitoring Logs

```bash
# Real-time log monitoring
sudo tail -f /var/log/sasellab-backend.log
sudo tail -f /var/log/sasellab-frontend.log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View last 100 lines
sudo tail -n 100 /var/log/sasellab-backend.log
```

### Service Management Commands

```bash
# Check status of all services
sudo supervisorctl status

# Start/Stop/Restart individual services
sudo supervisorctl start sasellab-backend
sudo supervisorctl stop sasellab-frontend
sudo supervisorctl restart sasellab-backend
sudo supervisorctl restart sasellab-frontend

# Restart all services
sudo supervisorctl restart all

# Reload nginx configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Renewal

SSL certificates are automatically renewed via cron job. To manually renew:

```bash
# Manual renewal
sudo certbot renew

# Test renewal process
sudo certbot renew --dry-run

# Reload nginx after renewal
sudo systemctl reload nginx
```

### Security Updates

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Update Python packages
cd /var/www/sasel_lab/backend
source venv/bin/activate
pip install --upgrade pip
pip list --outdated
# Review and update packages as needed

# Update Node.js packages
cd /var/www/sasel_lab/frontend
npm outdated
# Review and update packages as needed
npm update

# Restart services after updates
sudo supervisorctl restart all
sudo systemctl restart nginx
```

---

## Environment Structure

### Development Environment

- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Use `.env.development` files

```bash
# Run backend locally
cd backend
source venv/bin/activate
python manage.py runserver

# Run frontend locally
cd frontend
npm run dev
```

### Production Environment

- Both served through Nginx at `https://sasellab.com`
- Backend runs via Gunicorn on Unix socket
- Frontend runs on `localhost:3000` (proxied by Nginx)
- Use `.env.production` files

---

## Quick Reference

### Important Paths

- Project root: `/var/www/sasel_lab`
- Backend: `/var/www/sasel_lab/backend`
- Frontend: `/var/www/sasel_lab/frontend`
- Nginx config: `/etc/nginx/sites-available/sasellab.com`
- Supervisor configs: `/etc/supervisor/conf.d/sasellab-*.conf`
- Logs: `/var/log/sasellab-*.log`
- Backups: `/var/backups/sasellab/`

### Important Commands

```bash
# Service status
sudo supervisorctl status

# Restart everything
sudo supervisorctl restart all && sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/sasellab-backend.log

# Backup database
sudo /usr/local/bin/sasellab-backup.sh

# Django management
cd /var/www/sasel_lab/backend && source venv/bin/activate && python manage.py <command>
```

---

## Support

For issues or questions:

1. Check logs first: `/var/log/sasellab-*.log`
2. Review nginx logs: `/var/log/nginx/error.log`
3. Check service status: `sudo supervisorctl status`
4. Verify DNS: `dig sasellab.com`

---

## Architecture Overview

```
                                    Internet
                                       |
                                    [Port 443]
                                       |
                                  [Nginx Reverse Proxy]
                                       |
                    +------------------+------------------+
                    |                                     |
            [Static/Media Files]                    [Proxy Requests]
                    |                                     |
                    |                    +----------------+----------------+
                    |                    |                                 |
            [Django Static/Media]   [/api/, /admin/]                  [/ (all other)]
                    |                    |                                 |
            [/var/www/sasel_lab/    [Gunicorn]                      [Next.js Server]
             backend/staticfiles,   (Unix Socket)                    (Port 3000)
             backend/media]              |                                 |
                                    [Django App]                    [Frontend App]
                                         |                                 |
                                   [SQLite Database]              [API Client → Django]
```

---

**Last Updated:** 2025-10-27
