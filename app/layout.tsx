import './globals.css';
import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import Providers from './providers';

// One grotesk family does all the work. Archivo's width axis runs from
// condensed to extra-expanded, so headlines are set wide and black (the
// stamped, poster voice) while UI text stays at normal width — same face,
// no second display font to pair.
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
});

// Ticket and stamp metadata: dates, codes, token counts.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const title = 'Sproutify';
const description =
  'Sproutify connects volunteers with organized environmental initiatives: beach cleanups, tree plantations, and community-led restoration projects.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    images: [{ url: '/logo.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
