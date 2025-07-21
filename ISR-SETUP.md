# On-Demand ISR Setup

This project uses Vercel's On-Demand Incremental Static Regeneration (ISR) to revalidate only changed pages immediately after pushes.

## How it works

1. **GitHub Action Detection**: When you push changes to articles in `app/thoughts/_articles/`, the GitHub Action automatically detects which specific files changed.

2. **Selective Revalidation**: Only the changed article pages and the thoughts index page get revalidated, not the entire site.

3. **Fast Updates**: Changes appear within seconds of pushing, without a full redeploy.

## Setup Required

### 1. Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

- `REVALIDATION_TOKEN`: `c96d8ff43423531be72b52a2d609ac54785fd5b27deb208f250591d5f70a62ef`
- `VERCEL_DOMAIN`: `mzffreyvazov.me`

### 2. GitHub Secrets

Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

- `REVALIDATION_TOKEN`: `c96d8ff43423531be72b52a2d609ac54785fd5b27deb208f250591d5f70a62ef`
- `VERCEL_DOMAIN`: `mzffreyvazov.me`

## Testing

1. **Local Testing**: 
   ```bash
   # Change VERCEL_DOMAIN to localhost:3000 in test-revalidation.js
   node test-revalidation.js
   ```

2. **Production Testing**: 
   - Edit any article in `app/thoughts/_articles/`
   - Push to main branch
   - Check the Actions tab in GitHub to see the revalidation workflow

## Files Created/Modified

- ✅ `app/api/revalidate/route.ts` - API endpoint for revalidation
- ✅ `.github/workflows/revalidate.yml` - GitHub Action for automatic revalidation
- ✅ `app/thoughts/[slug]/page.tsx` - Added ISR configuration
- ✅ `app/thoughts/page.tsx` - Added ISR configuration
- ✅ `.env.local` - Updated with production domain
- ✅ `test-revalidation.js` - Test script (added to .gitignore)

## Usage

Simply edit any article file (like `app/thoughts/_articles/ielts-mini-course.md`) and push to main. The system will automatically:

1. Detect the change
2. Revalidate `/thoughts/ielts-mini-course` 
3. Revalidate `/thoughts` (index page)
4. Keep all other pages cached

No manual intervention needed! 🚀
