import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Crimson_Pro, DM_Mono } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/ui/AppSidebar';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
});
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yorayriniwnl.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Yor Smriti — A cinematic apology experience',
    template: '%s — Yor Smriti',
  },
  description: 'A private, cinematic experience built to deliver emotional messages with elegance and intention.',
  keywords: ['apology', 'love letter', 'cinematic experience', 'relationship', 'private', 'Yor Smriti'],
  authors: [{ url: 'https://github.com/yorayriniwnl' }],
  robots: {
    index: false,   // Private experience — keep it out of search engines
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: 'Yor Smriti',
    description: 'A cinematic, private experience for the one that matters.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Yor Smriti',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Yor Smriti',
    description: 'A cinematic, private experience for the one that matters.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Yor Smriti',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05030a' },
    { media: '(prefers-color-scheme: light)', color: '#05030a' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${crimson.variable} ${dmMono.variable}`}
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="canonical" href={BASE_URL} />
        {/* PWA splash / icon */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only bg-white text-[#111] font-mono text-xs uppercase tracking-[0.06em] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <AppSidebar />
        {children}
      </body>
    </html>
  );
}
