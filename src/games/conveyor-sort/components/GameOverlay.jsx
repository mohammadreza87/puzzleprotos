/**
 * GameOverlay - Win/Lose overlay
 */

import { motion } from 'framer-motion';
import { colors, shadows } from '../../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../../shared/styles/animations';

export const GameOverlay = ({
  gameState,
  hasNextLevel,
  onRetry,
  onNextLevel,
}) => {
  const isWon = gameState === 'won';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={springTransition}
        style={{
          fontSize: 48,
          marginBottom: 10,
        }}
      >
        {isWon ? '🎉' : '💥'}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '0 0 20px 0',
          background: isWon
            ? `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure})`
            : `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {isWon ? 'You Won!' : 'Game Over!'}
      </motion.h2>

      <div style={{ display: 'flex', gap: 10 }}>
        <motion.button
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          transition={springTransition}
          onClick={onRetry}
          style={{
            padding: '12px 20px',
            borderRadius: 10,
            border: `1px solid ${colors.neon.azure}60`,
            background: `linear-gradient(135deg, ${colors.neon.azure}40, ${colors.neon.azure}20)`,
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: shadows.glow.sm(colors.neon.azure),
          }}
        >
          Retry
        </motion.button>

        {isWon && hasNextLevel && (
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            transition={springTransition}
            onClick={onNextLevel}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: `1px solid ${colors.neon.mint}60`,
              background: `linear-gradient(135deg, ${colors.neon.mint}40, ${colors.neon.mint}20)`,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: shadows.glow.sm(colors.neon.mint),
            }}
          >
            Next Level →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default GameOverlay;
