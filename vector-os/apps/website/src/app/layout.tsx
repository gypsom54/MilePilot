import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vector OS',
  description: 'Vector OS internal UI Lab',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
