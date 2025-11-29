# Deployment Guide for Highway Architect

This guide covers various deployment options for Highway Architect.

## 📦 Building for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🚀 Deployment Options

### 1. Netlify (Recommended)

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Via Git:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 2. Vercel

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Via Git:**
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite settings

### 3. GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**vite.config.ts adjustment for GitHub Pages:**
```typescript
export default defineConfig({
  base: '/highway-architect/', // Replace with your repo name
  // ... rest of config
})
```

### 4. Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run:**
```bash
docker build -t highway-architect .
docker run -p 8080:80 highway-architect
```

### 5. Static Hosting (AWS S3, Azure, etc.)

After running `npm run build`:

1. Upload the contents of `dist/` folder to your hosting provider
2. Configure your server to:
   - Serve `index.html` for all routes (SPA routing)
   - Enable gzip compression
   - Set appropriate cache headers

## 🔧 Environment Variables

Create `.env` file for environment-specific configuration:

```env
VITE_APP_NAME=Highway Architect
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your-analytics-id
```

Access in code:
```typescript
const appName = import.meta.env.VITE_APP_NAME
```

## 📊 Performance Optimization

### Pre-deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test the production build locally with `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify save/load functionality
- [ ] Test all game features

### Optimization Tips

1. **Enable Compression**
   - Configure your server to serve gzipped files
   - Most CDNs handle this automatically

2. **CDN Usage**
   - Use a CDN for static assets
   - Netlify and Vercel provide this automatically

3. **Cache Headers**
   ```nginx
   # Example nginx config
   location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

4. **Service Worker (Optional)**
   - Add PWA support for offline functionality
   - Use `vite-plugin-pwa`

## 🌐 Custom Domain

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records as instructed

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS with your provider

## 📱 Progressive Web App (PWA)

To make Highway Architect installable:

```bash
npm install -D vite-plugin-pwa
```

Add to `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Highway Architect',
        short_name: 'Highway',
        description: 'Build and manage highway systems',
        theme_color: '#1e40af',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🔒 Security

1. **Headers**
   ```
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   ```

2. **HTTPS**
   - Always use HTTPS in production
   - Most modern hosts provide free SSL certificates

## 📈 Analytics (Optional)

### Google Analytics
```typescript
// Add to index.html <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Troubleshooting

### Build Fails
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --force`

### Assets Not Loading
- Check `base` path in `vite.config.ts`
- Verify paths are relative, not absolute

### Routing Issues
- Ensure server is configured for SPA routing
- All routes should serve `index.html`

## 📞 Support

For deployment issues:
- Check [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- Open an issue on GitHub
- Contact support@highwayarchitect.game

---

**Happy Deploying! 🚀**
