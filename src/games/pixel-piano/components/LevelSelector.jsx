import { memo } from 'react';
import { motion } from 'framer-motion';
import { LEVELS } from '../data/pixelArt';
import { colors, shadows } from '../../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../../shared/styles/animations';

/**
 * Level selector component
 */
export const LevelSelector = memo(({ currentLevel, onLevelSelect }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
        maxWidth: 320,
      }}
    >
      {LEVELS.map((name, i) => {
        const isActive = currentLevel === i;
        return (
          <motion.button
            key={name}
            onClick={() => onLevelSelect(i)}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            transition={springTransition}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: isActive
                ? `1px solid ${colors.neon.azure}80`
                : `1px solid ${colors.glass.border}`,
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: isActive ? '#fff' : colors.primary[300],
              background: isActive
                ? `linear-gradient(135deg, ${colors.neon.azure}40, ${colors.neon.lavender}40)`
                : colors.glass.light,
              boxShadow: isActive ? shadows.glow.sm(colors.neon.azure) : 'none',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {name}
          </motion.button>
        );
      })}
    </div>
  );
});

LevelSelector.displayName = 'LevelSelector';

export default LevelSelector;
