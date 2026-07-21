import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Screener Analyst | Indian Stock Trading',
  description: 'Institutional-grade swing trading analysis for Indian stocks using AI-powered screening and real-time market research',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#000' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <a href="#main" className="skip-link">Skip to content</a>

        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold">Screener Analyst</a>
            <nav className="text-sm space-x-4">
              <a href="#analyze" className="hover:underline">Analyze</a>
              <a href="#upload" className="hover:underline">Upload</a>
              <a href="/README_DEPLOY.md" className="hover:underline">Docs</a>
            </nav>
          </div>
        </header>

        <main id="main" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
            <div>© {new Date().getFullYear()} Screener Analyst</div>
            <div className="space-x-4">
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/terms" className="hover:underline">Terms</a>
            </div>
          </div>
        </footer>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
