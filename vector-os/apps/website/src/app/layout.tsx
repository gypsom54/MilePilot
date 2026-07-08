import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@vector-platform/ui/styles.css';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--vector-font-sans',
});

export const metadata: Metadata = {
  title: 'Vector Peptides UK — Premium Research Peptides',
  description:
    'High-quality research compounds with clear documentation, professional packaging and secure UK fulfilment. Research use only.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <AnnouncementBar />
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
