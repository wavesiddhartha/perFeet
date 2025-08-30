import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@/components/analytics'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gehraiyaan - AI Video Fact Checker',
  description: 'Verify the truth behind any video with AI-powered fact-checking. Analyze social media videos for accurate, evidence-based insights.',
  keywords: ['fact check', 'video analysis', 'AI', 'misinformation', 'social media', 'verification'],
  authors: [{ name: 'Gehraiyaan Team' }],
  creator: 'Gehraiyaan',
  publisher: 'Gehraiyaan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gehraiyaan.com',
    title: 'Gehraiyaan - AI Video Fact Checker',
    description: 'Verify the truth behind any video with AI-powered fact-checking.',
    siteName: 'Gehraiyaan',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gehraiyaan - AI Video Fact Checker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gehraiyaan - AI Video Fact Checker',
    description: 'Verify the truth behind any video with AI-powered fact-checking.',
    images: ['/twitter-image.png'],
    creator: '@gehraiyaan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}