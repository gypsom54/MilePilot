export const EASING_LUXURY = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASING_SMOOTH = 'cubic-bezier(0.4, 0, 0.2, 1)';

export const DURATION = {
  fast: 280,
  normal: 600,
  slow: 1000,
  reveal: 1200,
} as const;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}
