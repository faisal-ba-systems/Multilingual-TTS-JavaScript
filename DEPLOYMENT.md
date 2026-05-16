# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] Test all languages thoroughly
- [ ] Test on target hardware/displays
- [ ] Verify audio output on actual speakers
- [ ] Configure production settings in `.env`
- [ ] Set `DEBUG_MODE=false`
- [ ] Add custom notification sound
- [ ] Test with real token/counter data
- [ ] Verify browser compatibility
- [ ] Test queue system under load
- [ ] Check network connectivity

### Deployment Options

## Option 1: Static File Server (Simplest)

### Using any web server (nginx, Apache, IIS)

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name tts.yourbank.com;

    root /var/www/tts-system;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3|wav)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Enable CORS if needed
    add_header Access-Control-Allow-Origin "*" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration (.htaccess):**

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType audio/mpeg "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

**IIS Configuration (web.config):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <staticContent>
            <mimeMap fileExtension=".mp3" mimeType="audio/mpeg" />
        </staticContent>
        <httpProtocol>
            <customHeaders>
                <add name="X-Frame-Options" value="SAMEORIGIN" />
                <add name="X-Content-Type-Options" value="nosniff" />
            </customHeaders>
        </httpProtocol>
    </system.webServer>
</configuration>
```

### Deployment Steps:

1. **Copy files to server:**

```bash
scp -r * user@server:/var/www/tts-system/
```

2. **Set proper permissions:**

```bash
chmod -R 755 /var/www/tts-system
```

3. **Restart web server:**

```bash
# Nginx
sudo systemctl restart nginx

# Apache
sudo systemctl restart apache2
```

## Option 2: Docker Deployment

**Dockerfile:**

```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf (for Docker):**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  tts-display:
    build: .
    ports:
      - "8080:80"
    environment:
      - TTS_LANGUAGE=en
    restart: unless-stopped
    networks:
      - bank-network

  # Optional: WebSocket server for real-time updates
  tts-server:
    build: ./examples
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - bank-network

networks:
  bank-network:
    driver: bridge
```

**Build and run:**

```bash
# Build image
docker build -t bank-tts:latest .

# Run container
docker run -d -p 8080:80 --name tts-display bank-tts:latest

# Or use docker-compose
docker-compose up -d
```

## Option 3: Cloud Deployment

### AWS S3 + CloudFront

1. **Create S3 bucket:**

```bash
aws s3 mb s3://your-tts-system
```

2. **Enable static website hosting:**

```bash
aws s3 website s3://your-tts-system --index-document index.html
```

3. **Upload files:**

```bash
aws s3 sync . s3://your-tts-system --exclude ".git/*" --exclude "node_modules/*"
```

4. **Set public access:**

```bash
aws s3api put-bucket-policy --bucket your-tts-system --policy file://bucket-policy.json
```

**bucket-policy.json:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-tts-system/*"
    }
  ]
}
```

5. **Create CloudFront distribution for CDN**

### Azure Static Web Apps

```bash
# Install Azure CLI
az login

# Create resource group
az group create --name tts-rg --location eastus

# Deploy
az staticwebapp create \
  --name bank-tts \
  --resource-group tts-rg \
  --source . \
  --location eastus \
  --branch main
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir .
```

## Option 4: Local Kiosk Mode

For display terminals/kiosks in the bank:

### Windows Setup

1. **Create startup script (start-tts.bat):**

```batch
@echo off
cd /d "C:\BankTTS"
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --kiosk ^
  --app=http://localhost:8000 ^
  --start-fullscreen ^
  --disable-pinch ^
  --overscroll-history-navigation=0 ^
  --noerrdialogs ^
  --disable-infobars

python -m http.server 8000
```

2. **Add to Windows Startup:**

- Press `Win + R`
- Type `shell:startup`
- Copy `start-tts.bat` to this folder

3. **Auto-login setup:**

- Run `netplwiz`
- Uncheck "Users must enter username and password"
- Set auto-login credentials

### Linux Setup

1. **Create systemd service (/etc/systemd/system/tts-display.service):**

```ini
[Unit]
Description=TTS Display System
After=network.target

[Service]
Type=simple
User=bankuser
WorkingDirectory=/opt/tts-system
ExecStart=/usr/bin/chromium-browser --kiosk --app=http://localhost:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

2. **Enable service:**

```bash
sudo systemctl enable tts-display
sudo systemctl start tts-display
```

### Raspberry Pi Setup

Perfect for low-cost display terminals:

1. **Install Chromium:**

```bash
sudo apt-get update
sudo apt-get install chromium-browser unclutter
```

2. **Create autostart (~/.config/lxsession/LXDE-pi/autostart):**

```bash
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk --app=http://localhost:8000
```

3. **Start web server on boot (/etc/rc.local):**

```bash
cd /home/pi/tts-system
python3 -m http.server 8000 &
```

## Network Configuration

### Local Network Setup

1. **Assign static IP to display terminal**
2. **Configure firewall rules**
3. **Set up DNS entry (optional)**

### For Multiple Displays

Use WebSocket server for synchronized announcements:

```bash
# Start WebSocket server
cd examples
npm install
node websocket-server.js
```

Configure all displays to connect:

```javascript
// In app.js
const client = new AnnouncementClient("http://192.168.1.100:3000");
client.connect();
```

## Security Hardening

### 1. HTTPS Setup

**Using Let's Encrypt (Certbot):**

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d tts.yourbank.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 2. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### 3. Content Security Policy

Add to HTML `<head>`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               media-src 'self';"
/>
```

## Monitoring & Maintenance

### Health Check Endpoint

Create a simple health check:

```javascript
// In WebSocket server
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
```

### Logging

Enable logging for troubleshooting:

```javascript
// In config.js
debug: process.env.NODE_ENV !== 'production',
```

### Backup Strategy

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/tts-system-$DATE.tar.gz /var/www/tts-system/
```

## Performance Optimization

### 1. Minify Assets

```bash
# Using terser for JavaScript
npm install -g terser
terser app.js -o app.min.js -c -m

# Using csso for CSS
npm install -g csso-cli
csso styles.css -o styles.min.css
```

### 2. Enable Browser Caching

Already configured in nginx/Apache configs above.

### 3. Use CDN for Assets (Optional)

```html
<!-- Example: Use CDN for common libraries if needed -->
<script src="https://cdn.jsdelivr.net/npm/socket.io-client@4/dist/socket.io.min.js"></script>
```

## Troubleshooting Production Issues

### Audio not working

- Check browser autoplay policies
- Ensure user interaction before first announcement
- Verify audio device is connected and unmuted

### Display not updating

- Check network connectivity
- Verify WebSocket connection (if used)
- Check browser console for errors
- Clear browser cache

### Performance issues

- Reduce queue size
- Increase announcement delay
- Check system resources
- Disable debug mode

## Scaling

### Load Balancing

For multiple display terminals:

```nginx
upstream tts_backend {
    server 192.168.1.101:3000;
    server 192.168.1.102:3000;
    server 192.168.1.103:3000;
}

server {
    location /api/ {
        proxy_pass http://tts_backend;
    }
}
```

## Support & Maintenance

### Regular Maintenance Tasks

- [ ] Check logs weekly
- [ ] Test all languages monthly
- [ ] Update browser quarterly
- [ ] Backup configuration monthly
- [ ] Review and update voices as needed

### Update Procedure

```bash
# Backup current version
cp -r /var/www/tts-system /var/www/tts-system.backup

# Deploy new version
scp -r * user@server:/var/www/tts-system/

# Restart services
sudo systemctl restart nginx
```

---

**Need help with deployment? Check the README.md or contact support.**
