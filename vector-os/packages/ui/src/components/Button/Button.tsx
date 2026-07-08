import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Size, Variant } from '@vector-os/types';
import { SpinnerIcon } from '@vector-os/icons';
import { cn } from '@vector-os/utils';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const sizeClassMap: Record<Size, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const variantClassMap: Record<Variant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        styles.button,
        sizeClassMap[size],
        variantClassMap[variant],
        isDisabled && styles.disabled,
        loading && styles.loading,
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <SpinnerIcon className={styles.spinner} />}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
