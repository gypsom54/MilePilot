/**
 * Vector OS Design Tokens — Colours
 * Do not hardcode colour values in components; reference these tokens.
 */

export const colors = {
  brand: {
    50: '#eef4ff',
    100: '#d9e6ff',
    200: '#bcd4ff',
    300: '#8eb8ff',
    400: '#5990ff',
    500: '#3366ff',
    600: '#1a44f5',
    700: '#1534e1',
    800: '#172cb6',
    900: '#192a8f',
    950: '#121a57',
  },
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  semantic: {
    focus: '#3366ff',
    disabled: '#94a3b8',
    disabledBg: '#e2e8f0',
    onPrimary: '#ffffff',
    onSecondary: '#0f172a',
    onGhost: '#334155',
  },
} as const;

export type Colors = typeof colors;
