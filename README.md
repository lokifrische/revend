# Revend — Device Trade-In Price Comparison Platform

> The smart way to sell what you already have.

Revend is a price comparison marketplace for used phones, tablets, laptops, and other electronics. Users compare offers from verified buyback companies and get the best price instantly — free, with no sign-up required.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) — *to be connected* |
| Caching | Upstash Redis — *to be connected* |
| Deployment | Vercel |

## Current State

All pages are built and fully functional with **mock data**. To make this production-ready:

1. Set up Supabase project and run migration
2. Set environment variables (see `.env.example`)
3. Import device catalog from `seed-data/` CSVs
4. Connect Ryan/BuyBackTree price data
5. Deploy to Vercel

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search, categories, social proof |
| `/sell/[category]` | Category browse page |
| `/sell/[category]/[brand]` | Brand model list |
| `/sell/[category]/[brand]/[model]` | **Core:** device comparison page |
| `/buyers` | Verified buyer directory |
| `/go/[buyer]/[device]/[condition]` | Click tracking + redirect interstitial |
| `/price-check` | Device value + depreciation tracker |
| `/price-alerts` | Email price alert signup |
| `/sell-broken` | Broken device landing page |
| `/business` | B2B/bulk selling programs |
| `/partners/apply` | Buyer partner application form |
| `/how-it-works` | Consumer education + FAQ |
| `/sustainability` | CO₂ impact + environmental mission |
| `/about` | Brand story |
| `/blog` | Content/SEO hub |
| `/careers` | Open positions |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/disclosure` | FTC affiliate disclosure |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | SEO robots |

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_SITE_URL=https://revend.com
ADMIN_SECRET_KEY=
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Teal | `#00C4B4` | Primary CTA, highlights, best offer |
| Navy | `#0F1C2E` | Hero backgrounds, footer |
| Amber | `#F59E0B` | Sell Now buttons, accent |
| Slate | various | Text, borders |

## Project Context

Full planning docs in `/home/openclaw/.openclaw/workspace/memory/topics/`:
- `sellcell-master-plan.md` — overall strategy
- `sellcell-build-plan.md` — full DB schema + features
- `sellcell-brand-strategy.md` — brand, voice, colors
- `sellcell-coding-prep.md` — coding workflow reference

---

*Built by Loki + Nick | BuyBackTree partnership (Ryan) | Feb 2026*
