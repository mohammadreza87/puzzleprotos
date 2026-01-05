import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { colors, borders } from '../../styles/theme';
import { fadeInScale, springTransition } from '../../styles/animations';

/**
 * GlassPanel Component
 * Glassmorphism container with customizable blur and opacity
 */

const variants = {
  default: {
    background: colors.glass.light,
    blur: 12,
    borderColor: colors.glass.border,
  },
  solid: {
    background: 'rgba(45, 35, 32, 0.85)',
    blur: 16,
    borderColor: colors.glass.border,
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.03)',
    blur: 8,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  elevated: {
    background: 'rgba(45, 35, 32, 0.95)',
    blur: 20,
    borderColor: colors.glass.highlight,
  },
};

export const GlassPanel = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  animate = true,
  className = '',
  style = {},
  ...props
}, ref) => {
  const variantStyle = variants[variant];

  const paddingMap = {
    none: 0,
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  };

  const roundedMap = {
    none: 0,
    sm: borders.radius.sm,
    md: borders.radius.md,
    lg: borders.radius.lg,
    xl: borders.radius.xl,
    full: borders.radius.full,
  };

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: fadeInScale.initial,
    animate: fadeInScale.animate,
    exit: fadeInScale.exit,
    transition: springTransition,
  } : {};

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        background: variantStyle.background,
        backdropFilter: `blur(${variantStyle.blur}px)`,
        WebkitBackdropFilter: `blur(${variantStyle.blur}px)`,
        border: `1px solid ${variantStyle.borderColor}`,
        borderRadius: roundedMap[rounded],
        padding: paddingMap[padding],
        ...style,
      }}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
});

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
