import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import MobileBottomNav from '@/components/MobileBottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'TrustHire - Security Assessment Platform',
    template: '%s | TrustHire'
  },
  description: 'Comprehensive security platform for recruiters, developers, and organizations. Scan GitHub repositories, verify LinkedIn profiles, analyze web forms, and check URL safety with advanced threat detection.',
  keywords: [
    'security assessment',
    'recruiter verification',
    'github scanner',
    'linkedin verification',
    'form security',
    'url scanner',
    'malware detection',
    'phishing protection',
    'code security',
    'threat intelligence',
    'cybersecurity',
    'recruitment scams',
    'web3 security',
    'blockchain security'
  ],
  authors: [{ name: 'TrustHire Security Team' }],
  creator: 'TrustHire',
  publisher: 'TrustHire',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trusthire-five.vercel.app',
    title: 'TrustHire - Security Assessment Platform',
    description: 'Advanced security platform for comprehensive threat detection and vulnerability assessment.',
    siteName: 'TrustHire',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TrustHire Security Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustHire - Security Assessment Platform',
    description: 'Advanced security platform for comprehensive threat detection and vulnerability assessment.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://trusthire-five.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <EnhancedNavbar />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
