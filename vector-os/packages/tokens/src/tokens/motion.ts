/**
 * Vector OS Design Tokens — Motion
 */

export const motion = {
  duration: {
    fast: '120ms',
    normal: '200ms',
    slow: '320ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Motion = typeof motion;
