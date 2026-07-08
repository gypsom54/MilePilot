import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@vector-platform/ui/styles.css';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--vector-font-sans',
});

export const metadata: Metadata = {
  title: 'Vector Platform',
  description:
    'Premium peptide research products, intelligent software and AI-powered business tools.',
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
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
