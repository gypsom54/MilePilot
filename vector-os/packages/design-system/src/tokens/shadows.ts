/**
 * Vector OS Design Tokens — Shadows
 */

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  md: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
  lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
  focus: '0 0 0 3px rgba(51, 102, 255, 0.35)',
} as const;

export type Shadows = typeof shadows;
