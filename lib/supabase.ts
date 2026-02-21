import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (bypasses RLS)
export function createServiceClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export type Database = {
  public: {
    Tables: {
      brands: { Row: { id: string; name: string; slug: string; logo_url: string | null; sort_order: number; is_active: boolean } }
      categories: { Row: { id: string; name: string; slug: string; icon: string | null; sort_order: number } }
      device_families: { Row: { id: string; brand_id: string; category_id: string; name: string; slug: string; image_url: string | null; released_year: number | null; is_popular: boolean; is_active: boolean } }
      devices: { Row: { id: string; family_id: string; storage_gb: number | null; carrier: string; color: string | null; msrp_cents: number | null; is_active: boolean } }
      conditions: { Row: { id: string; name: string; slug: string; description: string | null; icon: string | null; price_mult: number; sort_order: number } }
      buyers: { Row: { id: string; name: string; slug: string; website: string | null; logo_url: string | null; tagline: string | null; payment_methods: string[]; payment_speed_days: number | null; bbb_rating: string | null; trust_score: number; is_featured: boolean; is_active: boolean; cpa_percent: number | null } }
      offers: { Row: { id: string; device_id: string; buyer_id: string; condition_id: string; offer_cents: number; is_active: boolean; fetched_at: string } }
      affiliate_clicks: { Row: { id: string; device_id: string | null; buyer_id: string | null; condition_id: string | null; offer_cents: number | null; session_id: string | null; clicked_at: string } }
    }
  }
}
