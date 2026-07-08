'use client';

import type { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Applies Vector Platform dark theme tokens to the document root.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <div data-theme="vector-dark">{children}</div>;
}
