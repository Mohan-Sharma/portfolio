# ADR-0005: Deployment Strategy

## Status

**Accepted**

**Date**: 2025-12-31
**Deciders**: Development Team, Hosting Provider Requirements
**Consulted**: Hostinger documentation, deployment best practices
**Informed**: All stakeholders

---

## Context

The portfolio needs to be deployed to **Hostinger Business Web Hosting** plan. We need a deployment strategy that:

- Works with Hostinger's infrastructure (static file hosting)
- Provides fast, reliable access globally
- Supports custom domains and SSL
- Enables easy updates and rollbacks
- Optimizes for performance (CDN, compression)
- Fits within hosting plan limitations

### Assumptions

- Hostinger Business plan supports static HTML/CSS/JS hosting
- No Node.js runtime available on Hostinger (standard shared hosting)
- FTP/SFTP access available
- Custom domain can be configured
- SSL certificate available

### Constraints

- **No server-side runtime**: No Node.js, no SSR
- **Standard web hosting**: Apache/nginx serving static files
- **No build triggers**: No automatic builds on push
- **Limited server configuration**: Shared hosting environment

### Requirements

- Deploy as static files (HTML/CSS/JS)
- Fast deployment process
- Version control for deployments
- Easy rollback mechanism
- Performance optimization (compression, caching)
- Zero downtime during updates (or minimal)

---

## Decision Drivers

1. **Hostinger Compatibility**: Must work with shared hosting
2. **Static Export**: Build output must be pure static files
3. **Performance**: Fast load times, CDN, compression
4. **Simplicity**: Easy to deploy and update
5. **Reliability**: Stable, predictable deployments
6. **Cost**: Stay within hosting plan (no extra services)

---

## Options Considered

### Option 1: SvelteKit Static Adapter + FTP/SFTP (Recommended)

**Description**: Build with `@sveltejs/adapter-static` to generate static files, upload to Hostinger via FTP/SFTP.

**Pros**:

- **Perfect Hostinger compatibility**: Pure static files
- **No additional costs**: Uses existing hosting
- **Full control**: Manual deployment process
- **Simple workflow**: Build locally, upload
- **Version control**: Can keep previous builds
- **Rollback**: Re-upload previous build
- **No external dependencies**: Self-contained
- **SSL included**: Hostinger provides SSL

**Cons**:

- Manual FTP upload (not automated)
- No CI/CD without extra setup
- Requires FTP credentials management
- Slower deployment (manual process)
- No automatic cache invalidation

**Costs**:

- Hosting: Included in Hostinger plan
- Time: ~2-5 minutes per deployment
- Complexity: Low

**Deployment Steps**:

```bash
# 1. Build static site
pnpm build

# 2. Upload build/ directory to Hostinger
# Via FTP client (FileZilla, Cyberduck) or CLI
```

---

### Option 2: Hostinger + GitHub Actions (Automated FTP)

**Description**: Same as Option 1, but use GitHub Actions to automate FTP uploads on push to main.

**Pros**:

- **Automated deployments**: Push to main = auto-deploy
- **CI/CD pipeline**: Run tests before deploy
- **Version control**: Git history tracks deployments
- **Consistent**: No manual errors
- **Fast**: Automated = faster than manual
- **Hostinger compatible**: Still just static files

**Cons**:

- FTP credentials stored in GitHub Secrets (security consideration)
- Requires GitHub Actions setup
- FTP can be slow for many files
- No built-in rollback (need to revert commit)
- Slightly more complex setup

**Costs**:

- Hosting: Included in Hostinger plan
- GitHub Actions: Free (for public repos)
- Setup time: ~30 minutes one-time
- Complexity: Medium

**Example Workflow**:

```yaml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
```

---

### Option 3: Alternative: Vercel/Netlify (SvelteKit SSG)

**Description**: Deploy to Vercel or Netlify instead of Hostinger, use their CDN and automatic deployments.

**Pros**:

- **Automatic deployments**: Git push = auto-deploy
- **Global CDN**: Faster load times worldwide
- **Automatic SSL**: Free SSL certificates
- **Preview deployments**: Test before production
- **Instant rollback**: One-click rollback
- **Build logs**: Visibility into build process
- **Edge network**: Lightning-fast delivery
- **SvelteKit native support**: Zero config

**Cons**:

- **Doesn't use Hostinger** (wastes hosting plan)
- Additional service dependency
- Free tiers have limits (but sufficient for portfolio)
- Requires account with third-party service

**Costs**:

- Hosting: Free (Vercel/Netlify free tier)
- Hostinger: Wasted if not used
- Complexity: Low (excellent DX)

---

### Option 4: Hostinger + rsync (Developer's Machine)

**Description**: Use rsync to sync build files to Hostinger via SSH/SFTP.

**Pros**:

- **Incremental uploads**: Only changed files
- **Fast**: Rsync is efficient
- **Scriptable**: Easy to automate locally
- **Version control**: Can script backups

**Cons**:

- Requires SSH access (may not be available on all Hostinger plans)
- Manual process (no CI/CD)
- Local deployment only
- Not team-friendly (one person deploys)

**Costs**:

- Hosting: Included
- Time: ~1-2 minutes
- Complexity: Low-Medium

---

### Option 5: Hostinger File Manager (Manual Upload)

**Description**: Build locally, manually upload files via Hostinger's web-based file manager.

**Pros**:

- **No tools required**: Web browser only
- **Simple**: No FTP client needed
- **Accessible anywhere**: Any device with browser

**Cons**:

- **Very slow**: Manual file selection and upload
- **Error-prone**: Easy to miss files
- **No automation**: Fully manual
- **Not scalable**: Takes 10+ minutes

**Costs**:

- Time: ~10-15 minutes per deployment
- Complexity: Very low
- **Not Recommended**: Too slow and manual

---

## Decision

**Chosen Option**: **Option 1 - SvelteKit Static Adapter + FTP/SFTP** (with optional upgrade to Option 2 later)

### Rationale

We're choosing the manual FTP approach initially because:

1. **Hostinger Compatibility**: Perfectly aligns with Hostinger's shared hosting infrastructure. The static adapter generates exactly what Hosting expects: HTML, CSS, JS files.

2. **Zero Setup Complexity**: No CI/CD configuration needed to start. Developer can deploy immediately after building.

3. **No Additional Services**: Uses only the existing Hostinger plan. No third-party services, accounts, or dependencies.

4. **Full Control**: Developer has complete control over deployment timing. Can test locally before uploading.

5. **Simple Rollback**: Keep previous build folders locally. Rollback = re-upload old build.

6. **Cost-Effective**: Uses paid Hostinger plan that's already available. No wasted hosting costs.

7. **Transparent Process**: Developer understands exactly what's deployed and where.

8. **Upgrade Path**: Easy to add GitHub Actions automation later (Option 2) without changing hosting infrastructure.

### Why Not Vercel/Netlify?

While Vercel/Netlify offer superior developer experience:

- User already has Hostinger Business plan (paid)
- Using Vercel/Netlify wastes the Hostinger investment
- Portfolio deployment frequency is low (not daily)
- Manual deployment is acceptable for this use case
- Can always migrate later if needed

### Implementation Plan

**Phase 1: Manual FTP Deployment** (Start Here)

```bash
# 1. Build static site
pnpm build

# 2. Output is in build/ directory
# 3. Upload build/ contents to public_html/ on Hostinger
#    via FileZilla, Cyberduck, or CLI FTP client

# 4. Verify deployment
# Visit custom domain or Hostinger subdomain
```

**Phase 2: Automated FTP (Optional, Later)**

- Setup GitHub Actions workflow
- Configure FTP secrets
- Enable auto-deploy on push to main

**Phase 3: Performance Optimization**

- Enable Gzip compression (.htaccess)
- Configure browser caching
- Optimize asset delivery

### SvelteKit Configuration

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false, // Hostinger handles compression
			strict: true
		}),
		prerender: {
			handleHttpError: ({ path, message }) => {
				console.error(`Error prerendering ${path}: ${message}`);
			}
		}
	}
};
```

### Hostinger Configuration

**.htaccess** (in public_html/):

```apache
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 day"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA fallback (if using client-side routing)
# RewriteCond %{REQUEST_FILENAME} !-f
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule ^ index.html [L]
```

---

## Consequences

### Positive

- **Uses Existing Infrastructure**: Maximizes value from Hostinger plan
- **Simple & Reliable**: No complex deployment pipeline to maintain
- **Fast Initial Setup**: Can deploy immediately after development
- **Full Control**: Developer manages deployment timing
- **No Vendor Lock-in**: Standard hosting, can migrate anywhere
- **Cost-Effective**: Zero additional deployment costs
- **SSL Included**: Hostinger provides free SSL certificate

### Negative

- **Manual Process**: Requires manual build and FTP upload
- **No Automatic Deployments**: No CI/CD out of the box
- **Slower Than CDN**: Not as fast as Vercel/Netlify edge network
- **FTP Limitations**: Slower upload for many files

### Neutral

- **Deployment Frequency**: Manual is fine for low-frequency updates (portfolio)
- **Team Size**: One developer = manual is acceptable
- **Performance**: Hostinger performance is good enough for portfolio

### Risks

- **Risk**: FTP credentials compromised
  - **Mitigation**: Use SFTP (encrypted); strong passwords; rotate credentials periodically

- **Risk**: Deployment errors (wrong files uploaded)
  - **Mitigation**: Test build locally first; use deployment checklist; can rollback

- **Risk**: Hostinger downtime
  - **Mitigation**: Hostinger has good uptime SLA; can migrate to Vercel/Netlify if needed

---

## Validation

Success criteria:

- [ ] SvelteKit builds static files successfully
- [ ] Files uploaded to Hostinger via FTP/SFTP
- [ ] Portfolio loads on custom domain
- [ ] SSL certificate active (HTTPS)
- [ ] All assets load correctly
- [ ] Mobile responsive (test on actual devices)
- [ ] Performance acceptable (Lighthouse 90+)
- [ ] Compression enabled
- [ ] Browser caching configured

**Performance Targets**:

- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total bundle size: < 500KB

---

## Follow-up Actions

- [ ] Configure SvelteKit static adapter
- [ ] Test local production build
- [ ] Setup FTP client (FileZilla or Cyberduck)
- [ ] Obtain Hostinger FTP credentials
- [ ] Create .htaccess file with optimizations
- [ ] Deploy to Hostinger
- [ ] Configure custom domain
- [ ] Verify SSL certificate
- [ ] Test on multiple devices
- [ ] Run Lighthouse audit
- [ ] Document deployment process
- [ ] (Optional) Setup GitHub Actions for automation

---

## Related Decisions

- [ADR-0001: Tech Stack Selection](./0001-tech-stack-selection.md) - SvelteKit static export
- Future: May create ADR for CDN strategy if adding Cloudflare

---

## References

- [SvelteKit Static Adapter](https://kit.svelte.dev/docs/adapter-static)
- [Hostinger Documentation](https://support.hostinger.com/)
- [FileZilla FTP Client](https://filezilla-project.org/)
- [.htaccess Performance Optimization](https://httpd.apache.org/docs/2.4/howto/htaccess.html)
- [GitHub Actions FTP Deploy](https://github.com/SamKirkland/FTP-Deploy-Action)

---

## Notes

- Keep local backup of build before deploying
- Document FTP credentials securely (password manager)
- Consider adding Cloudflare free CDN in front of Hostinger later
- Can migrate to Vercel/Netlify later without code changes (same static build)

---

**Revision History**:

- 2025-12-31: Initial decision recorded
