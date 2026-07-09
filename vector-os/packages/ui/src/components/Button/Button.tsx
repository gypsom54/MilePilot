import { SpinnerIcon } from '@vector-platform/icons';
import { cn } from '@vector-platform/utils';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

const sizeClassMap = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const variantClassMap = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  iconLeft,
  iconRight,
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
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        loading && styles.loading,
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...props}
    >
      {loading ? (
        <SpinnerIcon className={styles.spinner} aria-hidden="true" />
      ) : (
        iconLeft && (
          <span className={styles.icon} aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}
      <span className={styles.label}>{children}</span>
      {!loading && iconRight && (
        <span className={styles.icon} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
