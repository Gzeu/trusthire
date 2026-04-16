import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'TrustHire — Recruiter Security Assessment',
  description: 'Evaluate recruiter credibility and hiring workflow safety before you clone or run anything. Built for blockchain/web3 developers.',
  keywords: ['security', 'recruiter', 'blockchain', 'web3', 'scam detection', 'hiring safety'],
  openGraph: {
    title: 'TrustHire — Know who you\'re dealing with before you npm install',
    description: 'Security due diligence tool for developers. Detect fake recruiters, scan repos for malicious patterns, protect your credentials.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
