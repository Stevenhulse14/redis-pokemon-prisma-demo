# Deploying to Vercel - Quick Guide

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Supabase Database** - Already set up ✅
3. **Redis Instance** - Upstash Redis (recommended for Vercel) or standard Redis

## Step-by-Step Deployment

### 1. Push to GitHub/GitLab/Bitbucket

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect Next.js

### 3. Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

#### Required:

```
POSTGRES_PRISMA_URL=postgresql://user:password@host:port/database
```

#### Redis (choose one):

**Option A: Upstash Redis (Recommended for Vercel)**

```
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your-token-here
```

**Option B: Standard Redis**

```
REDIS_URL=redis://default:password@host:port
```

### 4. Database Setup

After deployment, you need to run migrations:

**Option A: Via Supabase Dashboard**

1. Go to Supabase Dashboard → SQL Editor
2. Run `scripts/004-create-moves-tables.sql`
3. Run `npm run db:reset` locally (or create a Vercel function)

**Option B: Create a Setup API Route**

- Use the existing `/api/setup` route
- Or run migrations via Supabase SQL Editor

### 5. Build Settings

Vercel will auto-detect:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 6. Deploy!

Click "Deploy" and wait for the build to complete.

## Important Notes

### ✅ What Works Out of the Box:

- Next.js 16 with App Router
- Server-side API routes
- Environment variables
- External images (PokeAPI)
- Upstash Redis REST API

### ⚠️ Things to Watch:

1. **Database Migrations**

   - Run SQL scripts manually in Supabase Dashboard
   - Or use Prisma migrations (if configured)
   - The `scripts/` folder has SQL files ready to run

2. **Redis Connection**

   - **Upstash REST API** works best on Vercel (serverless-friendly)
   - Standard Redis requires persistent connection (may timeout)
   - Your code already supports both! ✅

3. **Environment Variables**

   - Must be set in Vercel Dashboard
   - Available at build time and runtime
   - Use different values for Production/Preview/Development

4. **Database Pooling**

   - Supabase connection pooling works great
   - Use the pooler URL: `pooler.supabase.com:6543`
   - Your code handles this automatically ✅

5. **Build Time**
   - Prisma Client generates during build
   - First deploy may take longer
   - Subsequent deploys are faster

### 🔧 Post-Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Run database migrations (SQL scripts)
- [ ] Seed Pokemon data (`npm run db:reset` locally or via API)
- [ ] Test Redis connection (check cache metrics)
- [ ] Verify images load correctly
- [ ] Test cache hit/miss behavior

## Troubleshooting

### Build Fails

- Check environment variables are set
- Verify `POSTGRES_PRISMA_URL` is correct
- Check build logs in Vercel Dashboard

### Database Connection Errors

- Verify Supabase URL is correct
- Check SSL settings (your code handles this)
- Ensure database is accessible from Vercel IPs

### Redis Not Working

- Check `KV_REST_API_URL` and `KV_REST_API_TOKEN` (Upstash)
- Or verify `REDIS_URL` format (standard Redis)
- App gracefully degrades without Redis ✅

### Images Not Loading

- External PokeAPI images should work (already configured)
- Check browser console for CORS errors
- Verify `next.config.mjs` remotePatterns

## Quick Deploy Command

If you have Vercel CLI installed:

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and set environment variables when asked.

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Upstash Docs: https://docs.upstash.com/redis
