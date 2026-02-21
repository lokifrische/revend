import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header alwaysOpaque />
      <main className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="text-8xl font-bold text-slate-100 mb-2">404</div>
          <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6 -mt-8">
            <Search className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-navy-800 mb-3">Page not found</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            This page doesn&apos;t exist. But we do have 600+ devices you can compare prices on!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Revend
            </Link>
            <Link
              href="/sell/phones"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Browse phones
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
