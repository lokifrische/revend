import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://revend-lokis-projects-b31d1aab.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Revend | Sell Your Device for the Best Price',
    template: '%s | Revend',
  },
  description:
    'Compare buyback offers from 7+ verified buyers for iPhones, Samsung, MacBooks, and more. Get paid fast. Free shipping, no BS.',
  keywords: [
    'sell phone', 'trade in phone', 'best trade in price', 'sell iPhone',
    'phone buyback comparison', 'sell used phone', 'compare phone prices',
    'sell Samsung', 'sell MacBook', 'device trade in', 'how much is my phone worth',
    'sell iPhone 16 Pro', 'sell Samsung Galaxy S25', 'best place to sell MacBook',
  ],
  authors: [{ name: 'Revend' }],
  creator: 'Revend',
  publisher: 'Revend',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Revend',
    title: 'Revend | Sell Your Device for the Best Price',
    description: 'Compare buyback offers from 7+ verified buyers. Get the best price for your used device instantly.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Revend | Compare phone trade-in offers and get the best price',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revend | Sell Your Device for the Best Price',
    description: 'Compare 7+ buyback buyers. Get the best price for your device instantly.',
    images: ['/og-image.jpg'],
    creator: '@revend',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1C2E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Performance: preconnect to Supabase for faster API calls */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
        {/* Preconnect to common image/asset hosts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-navy-800 antialiased">
        {children}
      </body>
    </html>
  )
}
