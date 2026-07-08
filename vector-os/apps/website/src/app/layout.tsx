import type { Metadata } from 'next';
import '@vector-platform/ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vector Peptides',
  description: 'Precision research. Premium packaging. Built on Vector One.',
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
