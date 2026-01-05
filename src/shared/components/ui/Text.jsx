import { forwardRef } from 'react';
import { colors, typography } from '../../styles/theme';

/**
 * Text Component
 * Typography component with semantic variants
 */

const variantStyles = {
  h1: {
    as: 'h1',
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.black,
    fontFamily: typography.fonts.heading,
    lineHeight: typography.lineHeights.tight,
    color: colors.primary[50],
  },
  h2: {
    as: 'h2',
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    fontFamily: typography.fonts.heading,
    lineHeight: typography.lineHeights.tight,
    color: colors.primary[50],
  },
  h3: {
    as: 'h3',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.heading,
    lineHeight: typography.lineHeights.tight,
    color: colors.primary[100],
  },
  body: {
    as: 'p',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    fontFamily: typography.fonts.body,
    lineHeight: typography.lineHeights.normal,
    color: colors.primary[100],
  },
  small: {
    as: 'span',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    fontFamily: typography.fonts.body,
    lineHeight: typography.lineHeights.normal,
    color: colors.primary[300],
  },
  tiny: {
    as: 'span',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.body,
    lineHeight: typography.lineHeights.normal,
    color: colors.primary[400],
  },
  label: {
    as: 'span',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.body,
    lineHeight: typography.lineHeights.tight,
    color: colors.primary[200],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  mono: {
    as: 'span',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.mono,
    lineHeight: typography.lineHeights.tight,
    color: colors.primary[100],
  },
};

export const Text = forwardRef(({
  children,
  variant = 'body',
  as,
  color,
  align,
  className = '',
  style = {},
  ...props
}, ref) => {
  const variantStyle = variantStyles[variant];
  const Component = as || variantStyle.as;

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        margin: 0,
        fontSize: variantStyle.fontSize,
        fontWeight: variantStyle.fontWeight,
        fontFamily: variantStyle.fontFamily,
        lineHeight: variantStyle.lineHeight,
        color: color || variantStyle.color,
        textTransform: variantStyle.textTransform,
        letterSpacing: variantStyle.letterSpacing,
        textAlign: align,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export default Text;
