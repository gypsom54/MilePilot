import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@vector-platform/ui/styles.css';
import './globals.css';
import { AmbientGlow } from '@/components/effects/AmbientGlow';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--vector-font-sans',
});

export const metadata: Metadata = {
  title: 'Vector Peptides UK — Research Without Compromise',
  description:
    'Premium research peptides with rigorous independent testing, professional packaging and secure UK fulfilment. Research use only.',
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
          <AmbientGlow />
          <UtilityBar />
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
