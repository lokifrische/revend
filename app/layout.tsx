import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://revend.com'),
  title: {
    default: 'Revend — The Smart Way to Sell What You Already Have',
    template: '%s | Revend',
  },
  description:
    'Compare offers from 20+ verified buyback companies and get the best price for your used phone, tablet, or laptop. Free, instant, no BS.',
  keywords: [
    'sell phone', 'trade in phone', 'best trade in price', 'sell iPhone',
    'phone buyback comparison', 'sell used phone', 'compare phone prices',
    'sell Samsung', 'sell MacBook', 'device trade in',
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
    url: 'https://revend.com',
    siteName: 'Revend',
    title: 'Revend — The Smart Way to Sell What You Already Have',
    description: 'Compare offers from 20+ verified buyback companies. Get the best price for your used device instantly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Revend — Compare phone trade-in offers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revend — The Smart Way to Sell What You Already Have',
    description: 'Compare 20+ buyback companies. Get the best price for your device instantly.',
    images: ['/og-image.png'],
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
      <body className="min-h-screen bg-white text-navy-800 antialiased">
        {children}
      </body>
    </html>
  )
}
