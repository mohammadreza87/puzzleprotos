/**
 * Centralized Design System - Theme Tokens
 * All design decisions in one place for easy maintenance
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary - Warm Mocha Base (Pantone 2025 inspired)
  primary: {
    900: '#0D0A09',  // Deepest background
    800: '#1A1412',  // Main background
    700: '#2D2320',  // Card background
    600: '#3D322D',  // Elevated surfaces
    500: '#5C4A42',  // Borders
    400: '#7A6358',  // Muted text
    300: '#A47864',  // Mocha Mousse (accent)
    200: '#C4A594',  // Light accent
    100: '#E8DDD4',  // Light text
    50:  '#F5F0EC',  // Brightest
  },

  // Neon Accent Colors (for notes/pixels)
  neon: {
    coral:    '#FF6B6B',  // C - Piano (red family)
    orange:   '#FFA94D',  // D - Marimba (orange family)
    yellow:   '#FFE066',  // E - Bell (yellow family)
    mint:     '#63E6BE',  // F - Pad (green family)
    azure:    '#74C0FC',  // G - Flute (blue family)
    lavender: '#B197FC',  // A - Strings (purple family)
    rose:     '#F783AC',  // B - Celesta (pink family)
    brown:    '#D4A574',  // Bass tones
    cream:    '#F8F4F0',  // White/neutral
    charcoal: '#4A4A4A',  // Gray/black
  },

  // Semantic Colors
  semantic: {
    success: '#63E6BE',
    warning: '#FFE066',
    error:   '#FF6B6B',
    info:    '#74C0FC',
  },

  // Glass Effect Colors
  glass: {
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.15)',
    highlight: 'rgba(255, 255, 255, 0.25)',
  },
};

// =============================================================================
// NOTE COLOR MAPPING (for game logic)
// =============================================================================

export const noteColors = {
  // Red family → C (Piano) - VIBRANT REDS
  red1: '#CC0000', red2: '#E62222', red3: '#FF3333',
  red4: '#FF4D4D', red5: '#FF6666', red6: '#FF8080',

  // Orange family → D (Marimba) - BRIGHT ORANGES
  orange1: '#E65C00', orange2: '#FF6B00', orange3: '#FF8533',
  orange4: '#FF9F4D', orange5: '#FFB366',

  // Yellow family → E (Bell) - SUNNY YELLOWS
  yellow1: '#E6B800', yellow2: '#FFCC00', yellow3: '#FFD633',
  yellow4: '#FFE066', yellow5: '#FFEB80',

  // Green family → F (Pad) - VIVID GREENS
  green1: '#00B359', green2: '#00CC66', green3: '#00E673',
  green4: '#33FF99', green5: '#66FFAD',

  // Blue family → G (Flute) - ELECTRIC BLUES
  blue1: '#0066CC', blue2: '#0080FF', blue3: '#3399FF',
  blue4: '#66B2FF', blue5: '#99CCFF',

  // Purple family → A (Strings) - RICH PURPLES
  purple1: '#7700CC', purple2: '#9933FF', purple3: '#AA55FF',
  purple4: '#BB77FF', purple5: '#CC99FF',

  // Pink family → B (Celesta) - HOT PINKS
  pink1: '#E6007A', pink2: '#FF1493', pink3: '#FF4DA6',
  pink4: '#FF66B2', pink5: '#FF99CC',

  // Brown family → Bass - WARM BROWNS
  brown1: '#8B4513', brown2: '#A0522D', brown3: '#B8733D',
  brown4: '#CC8844', brown5: '#DDA066', brown6: '#EEBB88',

  // Skin tones → Bass variant
  skin1: '#D2691E', skin2: '#E07830', skin3: '#EB9950',
  skin4: '#F5B070', skin5: '#FFC890',

  // Neutrals - MORE CONTRAST
  black: '#1A1A1A',
  gray1: '#333333', gray2: '#555555', gray3: '#777777',
  gray4: '#999999', gray5: '#BBBBBB', gray6: '#DDDDDD', gray7: '#EEEEEE',
  white: '#FFFFFF',
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fonts: {
    heading: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif",
    body: "'Inter', 'SF Pro Text', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
  },

  sizes: {
    xs:   '0.625rem',  // 10px
    sm:   '0.75rem',   // 12px
    base: '0.875rem',  // 14px
    md:   '1rem',      // 16px
    lg:   '1.125rem',  // 18px
    xl:   '1.25rem',   // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  px: '1px',
  0:  '0',
  0.5: '0.125rem',  // 2px
  1:  '0.25rem',    // 4px
  1.5: '0.375rem',  // 6px
  2:  '0.5rem',     // 8px
  2.5: '0.625rem',  // 10px
  3:  '0.75rem',    // 12px
  4:  '1rem',       // 16px
  5:  '1.25rem',    // 20px
  6:  '1.5rem',     // 24px
  8:  '2rem',       // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
};

// =============================================================================
// BORDERS & RADIUS
// =============================================================================

export const borders = {
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  width: {
    0: '0',
    1: '1px',
    2: '2px',
    3: '3px',
  },
};

// =============================================================================
// SHADOWS & EFFECTS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',

  // Glow effects for game elements
  glow: {
    sm: (color) => `0 0 8px ${color}`,
    md: (color) => `0 0 12px ${color}, 0 0 24px ${color}50`,
    lg: (color) => `0 0 16px ${color}, 0 0 32px ${color}, 0 0 48px ${color}50`,
    pulse: (color) => `0 0 20px ${color}, 0 0 40px ${color}80, 0 0 60px ${color}40`,
  },
};

// Glassmorphism presets
export const glass = {
  panel: {
    background: colors.glass.light,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.glass.border}`,
    borderRadius: borders.radius.lg,
  },

  card: {
    background: colors.glass.medium,
    backdropFilter: 'blur(16px)',
    border: `1px solid ${colors.glass.border}`,
    borderRadius: borders.radius.xl,
  },

  button: {
    background: colors.glass.light,
    backdropFilter: 'blur(8px)',
    border: `1px solid ${colors.glass.border}`,
    borderRadius: borders.radius.md,
  },
};

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  duration: {
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

export const zIndex = {
  base: 0,
  pixels: 1,
  fillable: 10,
  playhead: 20,
  active: 30,
  projectile: 50,
  overlay: 100,
  modal: 200,
  tooltip: 300,
};

// =============================================================================
// GAME-SPECIFIC CONSTANTS
// =============================================================================

export const game = {
  launcher: {
    count: 5,
    width: 48,
    height: 56,
    gap: 6,
  },

  queue: {
    count: 4,
    maxVisible: 5,
    stackWidth: 56,
    stackHeight: 48,
    gap: 8,
  },

  grid: {
    padding: 12,
    minPixelSize: 12,
    maxPixelSize: 22,
    defaultSize: 16,
  },

  animation: {
    projectileDuration: 300,
    fillInterval: 150,
    noteDuration: 400,
  },
};

// =============================================================================
// EXPORT DEFAULT THEME OBJECT
// =============================================================================

const theme = {
  colors,
  noteColors,
  typography,
  spacing,
  borders,
  shadows,
  glass,
  transitions,
  breakpoints,
  zIndex,
  game,
};

export default theme;
