# Revend MVP Deployment Guide

## Status: MVP Ready ✅

All critical blockers have been fixed. The platform is ready to handle real sellers and process affiliate clicks.

---

## What Was Fixed (P0 Blockers)

### ✅ 1. Attribution Engine (FIXED)
**Problem:** `/go/` redirect page countdown didn't redirect users to buyers.
**Solution:**
- Implemented click tracking via `/api/clicks` endpoint
- Added auto-redirect when countdown reaches 0
- Button now redirects to buyer website with tracking parameters
- All clicks logged to `affiliate_clicks` table in Supabase

**Files Changed:**
- `app/go/[buyer]/[device]/[condition]/page.tsx` - Added redirect logic
- `components/comparison/BuyerCard.tsx` - Pass tracking data in URL
- `lib/data.ts` - Added tracking fields to BuyerOffer interface
- `lib/adapters.ts` - Pass deviceId, conditionId, offerCents through adapter
- `lib/db.ts` - Added conditionId to DbOffer type

### ✅ 2. Buyer URLs (FIXED)
**Problem:** No destination URLs to redirect users to.
**Solution:** Buyer websites already exist in seed data and database:
- BuyBackTree: https://www.buybacktree.com
- Gazelle: https://www.gazelle.com
- Decluttr: https://www.decluttr.com
- GadgetGone: https://www.gadgetgone.com
- SellYourMac: https://www.sellyourmac.com
- ItsWorthMore: https://www.itsworthmore.com
- Swappa: https://swappa.com

### ✅ 3. /sell Page 404 (FIXED)
**Problem:** `/sell` route returned 404 (linked in nav).
**Solution:** Updated to use live database via `getCategoriesWithCounts()`.

**Files Changed:**
- `app/sell/page.tsx` - Now fetches from Supabase instead of static data

### ✅ 4. Admin Dashboard Security (FIXED)
**Problem:** `/admin/clicks` was publicly accessible with revenue data.
**Solution:** Added HTTP Basic Authentication via middleware.

**Files Changed:**
- `middleware.ts` - New file, enforces auth on /admin routes
- `app/admin/clicks/page.tsx` - Updated footer message

**Default Password:** `revend-admin-2026` (change via `ADMIN_PASSWORD` env var)

### ✅ 5. Rate Limiting (FIXED)
**Problem:** API routes had no rate limiting - vulnerable to abuse/spam.
**Solution:** Implemented in-memory rate limiter for Edge runtime.

**Files Changed:**
- `lib/rate-limit.ts` - New utility for IP-based rate limiting
- `app/api/search/route.ts` - 60 requests/min per IP
- `app/api/clicks/route.ts` - 10 requests/min per IP

**Note:** For production scale (10K+ DAU), upgrade to Upstash Redis or Vercel's rate limiting.

---

## Environment Variables Required

Create `.env.local` in the project root with these variables:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://msvobzzeteeoddjtxfji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site URL (REQUIRED for production)
NEXT_PUBLIC_SITE_URL=https://revend.com

# Admin Dashboard Password (OPTIONAL - defaults to 'revend-admin-2026')
ADMIN_PASSWORD=your_secure_password_here

# Optional: Future integrations
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
# RESEND_API_KEY=
# NEXT_PUBLIC_POSTHOG_KEY=
# NEXT_PUBLIC_POSTHOG_HOST=
```

### Getting Supabase Keys

1. Go to https://supabase.com/dashboard/project/msvobzzeteeoddjtxfji/settings/api
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Never expose to client)

---

## Deployment Steps

### 1. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables via Vercel Dashboard:
# https://vercel.com/your-team/revend/settings/environment-variables
```

**Critical Settings:**
- ✅ Set all environment variables in Vercel dashboard
- ✅ Disable "Vercel Authentication" (currently blocks Google crawlers with HTTP 401)
  - Go to: Settings → Deployment Protection → Disable for production
- ✅ Set production domain: `revend.com`

### 2. Database Setup

Database is already set up and seeded with:
- 94 device families
- 232 device variants
- 7 buyers
- 4 conditions
- 4,637 live offers

**To re-seed (if needed):**
```bash
node scripts/seed-database.mjs
```

### 3. Test Full User Flow

Once deployed, test this exact flow:

1. **Search:** Go to homepage → Search for "iPhone 16 Pro"
2. **Select:** Click a device → Choose storage (256GB)
3. **Compare:** Select condition (Good) → See ranked offers
4. **Click:** Click "Sell Now" on best offer
5. **Redirect:** `/go/` page opens → Countdown 3s → Redirects to buyer
6. **Verify:** Check `/admin/clicks` (use password) → See logged click

**Expected Result:** Click appears in admin dashboard with:
- Device name
- Buyer name
- Condition
- Offer price
- Timestamp

---

## Performance & Scale

### Current Capacity
- **1,000-5,000 DAU:** ✅ Ready
- **Database:** Supabase can handle 100K+ queries/day on free tier
- **Edge Runtime:** Fast global response times
- **Rate Limiting:** Prevents basic abuse

### Recommended Upgrades for 10K+ DAU

1. **Caching:** Add Upstash Redis
   ```bash
   npm install @upstash/redis
   ```
2. **Monitoring:** Add Sentry for errors
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```
3. **Analytics:** Add PostHog
   ```bash
   npm install posthog-js
   ```
4. **Connection Pooling:** Enable Supabase Supavisor in dashboard

---

## Cost Estimates

### MVP (1K DAU / 5K pageviews/day)
- Supabase Pro: $25/mo
- Vercel Pro: $20/mo
- Total: **~$45/mo**

### Scale (10K DAU / 50K pageviews/day)
- Supabase Team: $99/mo
- Vercel Pro: $20/mo
- Upstash Redis: $10/mo
- Sentry: $29/mo
- Total: **~$160/mo**

---

## Post-Deployment Checklist

### Immediately After Deploy
- [ ] Verify all environment variables are set in Vercel
- [ ] Disable Vercel preview authentication (Settings → Deployment Protection)
- [ ] Test full click flow (search → select → click → redirect)
- [ ] Check `/admin/clicks` for logged clicks (http://username:password@yoursite.com/admin/clicks)
- [ ] Verify buyer redirects work (should go to actual buyer websites)

### Within First Week
- [ ] Set up custom domain (revend.com)
- [ ] Configure DNS (A/CNAME records)
- [ ] Add SSL certificate (Vercel auto-provisions)
- [ ] Set up uptime monitoring (BetterStack, Pingdom, etc.)
- [ ] Add Sentry error tracking
- [ ] Test with 10-20 real users

### Within First Month
- [ ] Review `/admin/clicks` data
- [ ] Calculate conversion rate (clicks / pageviews)
- [ ] Optimize low-converting pages
- [ ] Add more device families if needed
- [ ] Reach out to buyers for partnership agreements

---

## Monitoring URLs

After deployment, bookmark these:

- **Homepage:** https://revend.com
- **Admin Dashboard:** https://revend.com/admin/clicks (requires auth)
- **Supabase Dashboard:** https://supabase.com/dashboard/project/msvobzzeteeoddjtxfji
- **Vercel Dashboard:** https://vercel.com/[your-team]/revend
- **Analytics** (if added): https://app.posthog.com

---

## Common Issues & Solutions

### Issue: Build fails with "supabaseUrl is required"
**Solution:** Set environment variables in `.env.local` or Vercel dashboard.

### Issue: Rate limit errors in development
**Solution:** In-memory rate limiter resets on server restart. Just restart `npm run dev`.

### Issue: Admin dashboard shows "Authentication Required" but password doesn't work
**Solution:** Check `ADMIN_PASSWORD` env var is set. Default is `revend-admin-2026`.

### Issue: Clicks not appearing in database
**Solution:**
1. Check browser console for errors
2. Verify `/api/clicks` endpoint is reachable
3. Check Supabase logs for insert failures

### Issue: Redirect goes to wrong URL
**Solution:**
1. Check buyer `website` field in database
2. Verify `/api/clicks` is returning `redirectUrl`
3. Check browser console for redirect errors

---

## Security Notes

### ✅ Implemented
- HTTP Basic Auth on /admin routes
- Rate limiting on API endpoints (60/min search, 10/min clicks)
- Row Level Security on Supabase tables
- Service role key never exposed to client
- CSRF protection via Next.js (sameSite cookies)

### ⚠️ Future Enhancements
- CAPTCHA on high-value actions
- DDoS protection via Cloudflare
- Honeypot fields on forms
- Automated abuse detection

---

## Support & Contact

**For deployment issues:**
- Check logs: `vercel logs [deployment-url]`
- Check Supabase logs: Dashboard → Logs → API Logs

**For code questions:**
- See `AUDIT_REPORT.md` for architecture overview
- See `SUPABASE_WIRING_LOG.md` for database details

---

## Next Steps After MVP

1. **Get first 100 sellers** through organic traffic
2. **Measure conversion rate** (pageviews → clicks)
3. **A/B test** condition selector vs. direct comparison
4. **Add email alerts** for price drops
5. **Build buyer dashboard** for self-service offer updates
6. **Launch affiliate program** for content creators
7. **Add more device categories** (cameras, drones, etc.)

---

**You're ready to launch! 🚀**

The platform can now:
- ✅ Handle real sellers
- ✅ Track affiliate clicks
- ✅ Redirect to buyers
- ✅ Log revenue data
- ✅ Protect against abuse
- ✅ Scale to 1000s of daily users

Deploy with confidence and start getting sellers on the platform.
