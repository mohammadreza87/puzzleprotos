import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, getGlowColor } from '../../../shared/data/colors';
import { colors, shadows, zIndex } from '../../../shared/styles/theme';
import { springSnappy } from '../../../shared/styles/animations';

/**
 * Color utility functions
 */
const darken = (hex, amount = 0.3) => {
  if (!hex) return '#333';
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - amount));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - amount));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

const brighten = (hex, amount = 0.3) => {
  if (!hex) return '#fff';
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * amount);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

/**
 * Single Pixel Component - Gem-like appearance
 */
const Pixel = memo(({ pixel, pixelSize, isFillable, isOnPlayhead, isActive }) => {
  const baseColor = COLORS[pixel.color];
  const glowColor = getGlowColor(pixel.color);

  const getVariant = () => {
    if (isActive) return 'active';
    if (isOnPlayhead && pixel.filled) return 'playhead';
    if (isOnPlayhead) return 'playheadUnfilled';
    if (isFillable) return 'fillable';
    return 'default';
  };

  const variants = {
    default: {
      scale: 1,
      zIndex: zIndex.pixels,
    },
    fillable: {
      scale: 1.05,
      zIndex: zIndex.fillable,
    },
    playheadUnfilled: {
      scale: 1.08,
      zIndex: zIndex.playhead,
    },
    playhead: {
      scale: 1.15,
      zIndex: zIndex.playhead,
    },
    active: {
      scale: 1.3,
      zIndex: zIndex.active,
    },
  };

  // Gem-like gradient background
  const getBackground = () => {
    if (!pixel.filled) {
      // Unfilled: dark with hint of color
      return `linear-gradient(135deg, ${darken(baseColor, 0.7)} 0%, ${darken(baseColor, 0.85)} 100%)`;
    }
    // Filled: vibrant gradient
    return `linear-gradient(135deg, ${brighten(baseColor, 0.3)} 0%, ${baseColor} 50%, ${darken(baseColor, 0.2)} 100%)`;
  };

  const getBoxShadow = () => {
    if (isActive) {
      return `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, inset 0 2px 4px rgba(255,255,255,0.5)`;
    }
    if (isOnPlayhead && pixel.filled) {
      return `0 0 15px ${glowColor}, 0 0 30px ${glowColor}80, inset 0 2px 4px rgba(255,255,255,0.4)`;
    }
    if (isFillable) {
      return `0 0 12px #FFDD00, 0 0 24px #FFDD0080, inset 0 1px 2px rgba(255,255,255,0.3)`;
    }
    if (pixel.filled) {
      return `0 2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.2)`;
    }
    return `inset 0 1px 2px rgba(255,255,255,0.1), inset 0 -1px 2px rgba(0,0,0,0.3)`;
  };

  const getBorder = () => {
    if (isFillable) return `2px solid #FFDD00`;
    if (isActive) return `2px solid #FFFFFF`;
    if (pixel.filled) return `1px solid ${brighten(baseColor, 0.2)}`;
    return `1px solid ${darken(baseColor, 0.5)}`;
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={getVariant()}
      variants={variants}
      transition={springSnappy}
      style={{
        position: 'absolute',
        left: pixel.x * pixelSize,
        top: pixel.y * pixelSize,
        width: pixelSize - 2,
        height: pixelSize - 2,
        background: getBackground(),
        borderRadius: 3,
        border: getBorder(),
        boxShadow: getBoxShadow(),
      }}
    />
  );
});

Pixel.displayName = 'Pixel';

/**
 * Flying Projectile Component - Colorful comet effect
 */
const FlyingProjectile = memo(({ projectile, pixelSize, gridHeight, gridWidth }) => {
  const baseColor = COLORS[projectile.color];
  const glowColor = getGlowColor(projectile.color);

  const endX = (projectile.targetX * pixelSize) + (pixelSize / 2);
  const endY = (projectile.targetY * pixelSize) + (pixelSize / 2);

  const launcherWidth = 54;
  const totalLauncherWidth = 5 * launcherWidth;
  const launcherStartX = (gridWidth - totalLauncherWidth) / 2;
  const startX = launcherStartX + (projectile.launcherIndex * launcherWidth) + (launcherWidth / 2);
  const startY = gridHeight + 70;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: pixelSize + 8,
        height: pixelSize + 8,
        marginLeft: -(pixelSize + 8) / 2,
        marginTop: -(pixelSize + 8) / 2,
        zIndex: zIndex.projectile,
      }}
      initial={{ left: startX, top: startY, scale: 2, opacity: 0.8 }}
      animate={{ left: endX, top: endY, scale: 1, opacity: 1 }}
      exit={{ scale: 2.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, mass: 0.5 }}
    >
      {/* Main glow body */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${brighten(baseColor, 0.4)} 0%, ${baseColor} 50%, ${darken(baseColor, 0.2)} 100%)`,
          boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}80`,
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      />

      {/* Sparkle center */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          filter: 'blur(1px)',
        }}
      />

      {/* Trail particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 8 - i,
            height: 8 - i,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            left: '50%',
            top: '50%',
            marginLeft: -(8 - i) / 2,
            marginTop: -(8 - i) / 2,
          }}
          animate={{
            y: [0, 25 + i * 12],
            opacity: [1, 0],
            scale: [1, 0.3],
          }}
          transition={{ duration: 0.25, repeat: Infinity, delay: i * 0.04 }}
        />
      ))}
    </motion.div>
  );
});

FlyingProjectile.displayName = 'FlyingProjectile';

/**
 * Pixel Grid Component
 */
export const PixelGrid = ({
  pixels,
  pixelSize,
  artDimensions,
  playheadRow,
  fillable,
  activeNotes,
  progress,
  projectiles = [],
}) => {
  const gridWidth = artDimensions.width * pixelSize;
  const gridHeight = artDimensions.height * pixelSize;

  const fillableSet = useMemo(
    () => new Set(fillable.map(f => `${f.x}-${f.y}`)),
    [fillable]
  );

  const activeSet = useMemo(
    () => new Set(activeNotes.map(n => `${n.x}-${n.y}`)),
    [activeNotes]
  );

  return (
    <div
      className="glass-panel relative overflow-visible"
      style={{ padding: 16 }}
    >
      {/* Grid container */}
      <div
        className="relative overflow-visible"
        style={{
          width: gridWidth,
          height: gridHeight,
          backgroundColor: '#0a0808',
          borderRadius: 6,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {/* Pixels */}
        <AnimatePresence>
          {pixels.map((pixel) => (
            <Pixel
              key={pixel.id}
              pixel={pixel}
              pixelSize={pixelSize}
              isFillable={fillableSet.has(`${pixel.x}-${pixel.y}`)}
              isOnPlayhead={pixel.row === playheadRow}
              isActive={activeSet.has(`${pixel.x}-${pixel.y}`)}
            />
          ))}
        </AnimatePresence>

        {/* Projectiles */}
        <AnimatePresence>
          {projectiles.map((projectile) => (
            <FlyingProjectile
              key={projectile.id}
              projectile={projectile}
              pixelSize={pixelSize}
              gridHeight={gridHeight}
              gridWidth={gridWidth}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Progress bar - Rainbow gradient */}
      <div
        style={{
          marginTop: 12,
          height: 8,
          backgroundColor: '#1a1414',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #FF3333, #FF8800, #FFDD00, #00FF88, #00AAFF, #AA44FF, #FF44AA)',
            borderRadius: 4,
            boxShadow: '0 0 10px rgba(255,255,255,0.3)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>

      {/* Progress text */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: colors.primary[300],
        }}
      >
        {pixels.filter(p => p.filled).length} / {pixels.length} pixels
      </div>
    </div>
  );
};

export default PixelGrid;
