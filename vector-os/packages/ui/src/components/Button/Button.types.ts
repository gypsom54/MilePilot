import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Size, Variant } from '@vector-platform/types';

export type ButtonVariant = Variant;
export type ButtonSize = Size;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style */
  variant?: ButtonVariant;
  /** Control dimensions */
  size?: ButtonSize;
  /** Shows spinner and sets aria-busy */
  loading?: boolean;
  /** Stretch to container width */
  fullWidth?: boolean;
  /** Leading icon slot */
  iconLeft?: ReactNode;
  /** Trailing icon slot */
  iconRight?: ReactNode;
  children: ReactNode;
}
