import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import { buttonVariants, springTransition } from '../../styles/animations';

/**
 * Button Component
 * Reusable button with variants and animations
 */

const variants = {
  primary: {
    background: `linear-gradient(135deg, ${colors.neon.mint} 0%, ${colors.neon.azure} 100%)`,
    color: colors.primary[900],
    hoverBg: colors.neon.mint,
  },
  secondary: {
    background: colors.primary[600],
    color: colors.primary[100],
    hoverBg: colors.primary[500],
  },
  ghost: {
    background: 'transparent',
    color: colors.primary[100],
    border: `1px solid ${colors.primary[500]}`,
    hoverBg: colors.glass.light,
  },
  danger: {
    background: colors.neon.coral,
    color: colors.primary[900],
    hoverBg: '#FF5555',
  },
  glass: {
    background: colors.glass.light,
    color: colors.primary[100],
    border: `1px solid ${colors.glass.border}`,
    backdropFilter: 'blur(8px)',
    hoverBg: colors.glass.medium,
  },
};

const sizes = {
  sm: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '0.375rem',
  },
  md: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
  },
  lg: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '0.75rem',
  },
  xl: {
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    borderRadius: '1rem',
  },
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <motion.button
      ref={ref}
      onClick={disabled ? undefined : onClick}
      variants={buttonVariants}
      initial="idle"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      transition={springTransition}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        border: variantStyle.border || 'none',
        backdropFilter: variantStyle.backdropFilter,
        WebkitBackdropFilter: variantStyle.backdropFilter,
        ...sizeStyle,
        background: variantStyle.background,
        color: variantStyle.color,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
