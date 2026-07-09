'use client';

import type { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Applies Vector Peptides UK dark theme tokens to the document root.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <div data-theme="vector-peptides">{children}</div>;
}
