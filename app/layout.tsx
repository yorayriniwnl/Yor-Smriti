import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "I'm Sorry",
  description: 'A quiet moment. An honest space.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "I'm Sorry",
    description: 'A quiet moment. An honest space.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d0c0a',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
