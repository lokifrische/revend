import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog — Device Trade-In Tips & Guides',
  description: 'Learn how to get the most money for your used phone, tablet, and laptop. Trade-in tips, comparisons, and guides.',
}

const articles = [
  {
    slug: 'how-we-compare-phone-trade-in-prices',
    title: 'How We Compare Phone Trade-In Prices (And Why It Matters)',
    excerpt: 'Most people take the first offer they see. Our data shows the difference between the highest and lowest offer averages $87. Here\'s exactly how we source prices.',
    category: 'How It Works',
    readMin: 5,
    date: '2026-02-14',
  },
  {
    slug: 'decluttr-alternative',
    title: 'The Best Decluttr Alternative: Where to Sell Your Old Phone Now',
    excerpt: 'Decluttr shut down in early 2025. Here\'s what happened, and the best alternatives to sell your phone for maximum cash.',
    category: 'Guides',
    readMin: 7,
    date: '2026-02-10',
    featured: true,
  },
  {
    slug: 'iphone-16-vs-17-trade-in',
    title: 'iPhone 16 vs 17 Trade-In Value: Which Is Worth Selling Right Now?',
    excerpt: 'Should you sell your iPhone 16 now or wait? We looked at price depreciation curves for both models to help you decide.',
    category: 'Analysis',
    readMin: 6,
    date: '2026-02-07',
  },
  {
    slug: 'we-tested-5-buyback-companies',
    title: 'We Tested 5 Phone Buyback Companies — Here\'s the Honest Winner',
    excerpt: 'We actually sent in the same phone to 5 different buyback companies and documented what happened. The results surprised us.',
    category: 'Reviews',
    readMin: 10,
    date: '2026-01-28',
    featured: true,
  },
  {
    slug: 'how-much-co2-selling-phone',
    title: 'How Much CO₂ Does Your Old Phone Save When You Sell It?',
    excerpt: 'Manufacturing a smartphone creates ~57kg of CO₂. We break down exactly what your resale decision means for the environment.',
    category: 'Sustainability',
    readMin: 4,
    date: '2026-01-21',
  },
  {
    slug: 'best-time-to-sell-iphone',
    title: 'The Best Time to Sell Your iPhone (Based on 3 Years of Data)',
    excerpt: 'iPhone trade-in values drop 15% in the first month after a new model launches. We charted exactly when to sell for maximum value.',
    category: 'Analysis',
    readMin: 8,
    date: '2026-01-14',
  },
]

const categoryColors: Record<string, string> = {
  'How It Works': 'bg-teal-100 text-teal-700',
  'Guides': 'bg-blue-100 text-blue-700',
  'Analysis': 'bg-purple-100 text-purple-700',
  'Reviews': 'bg-amber-100 text-amber-700',
  'Sustainability': 'bg-emerald-100 text-emerald-700',
}

export default function BlogPage() {
  const featured = articles.filter(a => a.featured)
  const rest = articles.filter(a => !a.featured)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <div className="bg-navy-800 text-white py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-3">The Revend Blog</h1>
            <p className="text-slate-300 max-w-xl">
              Device trade-in tips, buyer comparisons, and data-driven guides to help you get more for your old tech.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured */}
          <div className="mb-10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Featured</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {featured.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-lg transition-all"
                >
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[article.category]}`}>
                    {article.category}
                  </span>
                  <h2 className="text-base font-bold text-navy-800 mb-2 group-hover:text-teal-700 transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readMin} min read
                    </div>
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Rest */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">All Articles</p>
            <div className="space-y-4">
              {rest.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex gap-4 bg-white rounded-2xl border border-slate-200 p-5 hover:border-teal-300 hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category]}`}>
                        {article.category}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-navy-800 mb-1 group-hover:text-teal-700 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">{article.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readMin} min</span>
                      <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
