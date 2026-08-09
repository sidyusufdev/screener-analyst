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

        <header className="glass-strong sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-black text-xs font-bold shadow-lg transition-transform duration-300 group-hover:scale-110">
                SA
              </span>
              <span className="text-lg font-semibold text-zinc-100">Screener Analyst</span>
            </a>
            <nav aria-label="Primary" className="text-sm flex items-center gap-1">
              <a href="#analyze" className="px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-200 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-green-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-1/2">
                Analyze
              </a>
              <a href="#upload" className="px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-200 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-green-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-1/2">
                Upload
              </a>
            </nav>
          </div>
        </header>

        <main id="main" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
            <div>© {new Date().getFullYear()} Screener Analyst</div>
          </div>
        </footer>
      </body>
    </html>
  )
}
