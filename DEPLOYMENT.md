# 🚀 QWAMI Deployment Guide

This guide covers deploying the QWAMI informative landing page to production.

## Prerequisites

- Node.js 18+ or Bun
- Git
- Domain name (qwami.io)
- Hosting provider account (Vercel, Netlify, or custom)

## Build for Production

### 1. Install Dependencies

```bash
npm install  # or bun install
```

### 2. Type Check

```bash
npm run build:check  # or bun run build:check
```

This runs TypeScript compilation and then builds for production.

### 3. Build

```bash
npm run build  # or bun build
```

Output will be in the `dist/` directory.

### 4. Preview Locally

```bash
npm run preview  # or bun preview
```

Visit http://localhost:4173 to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Automatic deployments from Git
- Built-in CDN
- Zero configuration for Vite
- Great performance

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

**Configuration** (optional `vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy
   ```

4. **Production Deploy**
   ```bash
   netlify deploy --prod
   ```

**Configuration** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Source: Deploy from gh-pages branch
   - Custom domain: qwami.io

### Option 4: Custom Server (nginx)

**nginx Configuration**:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name qwami.io www.qwami.io;

    root /var/www/qwami.io/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Deploy Steps**:

1. Build locally: `npm run build`
2. Upload `dist/` to server: `rsync -avz dist/ user@server:/var/www/qwami.io/`
3. Reload nginx: `sudo systemctl reload nginx`

## DNS Configuration

### For Vercel/Netlify

**A Records:**
```
Type: A
Name: @
Value: [Provider's IP]
```

**CNAME Records:**
```
Type: CNAME
Name: www
Value: qwami.io
```

### For Custom Server

**A Records:**
```
Type: A
Name: @
Value: [Your server IP]

Type: A
Name: www
Value: [Your server IP]
```

## SSL/TLS Certificate

### Automatic (Vercel/Netlify)
- SSL certificates are automatically provisioned
- No configuration needed

### Manual (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d qwami.io -d www.qwami.io

# Auto-renewal
sudo certbot renew --dry-run
```

## Environment Variables

This landing page is static and requires no environment variables.

For future API integration:

```env
# Example for future use
VITE_SOLANA_NETWORK=mainnet-beta
VITE_RPC_URL=https://api.mainnet-beta.solana.com
VITE_QWAMI_MINT=<mint_address>
```

## Performance Optimization

### 1. Build Optimization

Already configured in `vite.config.ts`:
- Code splitting
- Tree shaking
- Minification
- Source maps

### 2. CDN Configuration

Use a CDN for static assets:
- Vercel/Netlify: Automatic
- Cloudflare: Add as proxy
- Custom: Configure nginx caching

### 3. Asset Optimization

```bash
# Optimize images (if adding any)
npm install -D imagemin imagemin-webp imagemin-svgo
```

### 4. Lighthouse Scores

Target metrics:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Monitoring

### Analytics

Add Google Analytics or Plausible:

```html
<!-- Add to index.html before </head> -->
<script defer data-domain="qwami.io" src="https://plausible.io/js/script.js"></script>
```

### Error Tracking

Add Sentry (optional):

```bash
npm install @sentry/browser
```

```typescript
// src/main.ts
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
});
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Procedure

### Vercel
```bash
vercel rollback [deployment-url]
```

### Netlify
```bash
netlify deploy --restore [deployment-id]
```

### Custom Server
```bash
# Keep previous builds
cp -r dist dist.backup-$(date +%Y%m%d-%H%M%S)

# Rollback
rm -rf dist
mv dist.backup-20250101-120000 dist
sudo systemctl reload nginx
```

## Health Checks

### Automated Monitoring

Set up uptime monitoring:
- UptimeRobot (free)
- Pingdom
- StatusCake

### Manual Checks

```bash
# Check site is up
curl -I https://qwami.io

# Check SSL
curl -vI https://qwami.io 2>&1 | grep -i "SSL\|TLS"

# Performance test
npx lighthouse https://qwami.io --view
```

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Routing Issues

Ensure SPA fallback is configured (see provider configs above).

### Performance Issues

1. Check bundle size: `npm run build -- --analyze`
2. Optimize images
3. Enable compression
4. Use CDN

## Post-Deployment Checklist

- [ ] Site loads on https://qwami.io
- [ ] www redirect works
- [ ] SSL certificate is valid
- [ ] All sections scroll smoothly
- [ ] Navigation spheres work
- [ ] Action buttons link correctly
- [ ] Mobile responsive
- [ ] Lighthouse score 90+
- [ ] Analytics tracking
- [ ] DNS propagated globally

## Support

For deployment issues:
- **Discord**: https://discord.gg/kwami
- **GitHub Issues**: https://github.com/alexcolls/kwami/issues
- **Email**: support@kwami.io

---

**Last Updated**: November 2025  
**Deployment Status**: Ready for Production

