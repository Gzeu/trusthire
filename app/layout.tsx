import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import MobileBottomNav from '@/components/MobileBottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrustHire — Recruiter Security Assessment',
  description:
    'Protect yourself from recruitment scams and malicious code attacks. Verify recruiters and repositories before engaging.',
  keywords: ['security', 'recruiter', 'scam detection', 'web3', 'blockchain', 'github scanning'],
  openGraph: {
    title: 'TrustHire — Recruiter Security Assessment',
    description: 'Verify recruiters and scan repositories for malicious code.',
    url: 'https://trusthire-five.vercel.app',
    siteName: 'TrustHire',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'TrustHire — Recruiter Security Assessment',
    description: 'Verify recruiters and scan repositories for malicious code.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0B] text-white antialiased`}>
        <EnhancedNavbar />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
