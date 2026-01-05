import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, getColorEmoji, getColorNoteInfo, getGlowColor } from '../../../shared/data/colors';
import { colors, shadows } from '../../../shared/styles/theme';
import { springTransition, launcherContentVariants } from '../../../shared/styles/animations';

/**
 * Single Launcher Slot Component
 */
const LauncherSlot = memo(({ launcher, index }) => {
  const hasLauncher = launcher !== null;
  const baseColor = hasLauncher ? COLORS[launcher.color] : null;
  const glowColor = hasLauncher ? getGlowColor(launcher.color) : null;

  return (
    <motion.div
      layout
      className="flex flex-col items-center justify-center"
      style={{
        width: 48,
        height: 56,
        borderRadius: 8,
        background: hasLauncher
          ? baseColor
          : colors.glass.light,
        border: hasLauncher
          ? `2px solid ${glowColor}60`
          : `1px solid ${colors.glass.border}`,
        backdropFilter: hasLauncher ? 'none' : 'blur(8px)',
        WebkitBackdropFilter: hasLauncher ? 'none' : 'blur(8px)',
      }}
      initial={false}
      animate={{
        boxShadow: hasLauncher
          ? shadows.glow.sm(glowColor)
          : 'none',
      }}
      whileHover={{ scale: hasLauncher ? 1.05 : 1 }}
      transition={springTransition}
    >
      <AnimatePresence mode="wait">
        {hasLauncher ? (
          <motion.div
            key={launcher.id}
            className="flex flex-col items-center"
            variants={launcherContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springTransition}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {getColorNoteInfo(launcher.color)}
            </span>
            <span style={{ fontSize: '0.75rem' }}>
              {getColorEmoji(launcher.color)}
            </span>
            <motion.span
              key={launcher.count}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
              style={{
                fontSize: '0.5625rem',
                fontWeight: 700,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              x{launcher.count}
            </motion.span>
          </motion.div>
        ) : (
          <motion.span
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              color: colors.primary[600],
              fontSize: '1.125rem',
            }}
          >
            ○
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

LauncherSlot.displayName = 'LauncherSlot';

/**
 * Launcher Row Component
 */
export const Launcher = ({ launchers }) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: 6, marginBottom: 12 }}
    >
      {launchers.map((launcher, i) => (
        <LauncherSlot key={i} launcher={launcher} index={i} />
      ))}
    </div>
  );
};

export default Launcher;
