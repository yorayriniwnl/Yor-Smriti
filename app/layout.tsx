import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "I'm Sorry",
  description: 'Private, guided experiences that help repair relationships.',
  keywords: [
    'apology',
    'private experience',
    'relationship repair',
    'guided apology',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "I'm Sorry",
    description: 'Private, guided experiences that help repair relationships.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "I'm Sorry",
    description: 'Private, guided experiences that help repair relationships.',
  },
  themeColor: '#05030a',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#05030a',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href="/" />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:px-3 focus:py-2"
          style={{
            background: '#fff',
            color: '#111',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
