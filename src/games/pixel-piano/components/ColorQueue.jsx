import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, getColorEmoji, getColorNoteInfo, getGlowColor } from '../../../shared/data/colors';
import { colors, shadows } from '../../../shared/styles/theme';

/**
 * Single stack component
 */
const Stack = memo(({ stack, isTop, onTap, queueIndex }) => {
  const baseColor = COLORS[stack.color];
  const glowColor = getGlowColor(stack.color);

  const handleClick = () => {
    if (isTop) {
      onTap(queueIndex);
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        opacity: isTop ? 1 : 0.5,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        y: -60,
        position: 'absolute',
      }}
      whileHover={isTop ? { scale: 1.08, y: -4 } : {}}
      whileTap={isTop ? { scale: 0.95 } : {}}
      transition={{
        layout: { type: 'spring', stiffness: 500, damping: 35 },
        opacity: { duration: 0.15 },
        scale: { type: 'spring', stiffness: 500, damping: 30 },
      }}
      onClick={handleClick}
      style={{
        width: isTop ? 56 : 44,
        height: isTop ? 48 : 36,
        borderRadius: 8,
        backgroundColor: baseColor,
        border: isTop
          ? `2px solid ${glowColor}80`
          : `1px solid ${colors.primary[600]}`,
        boxShadow: isTop ? shadows.glow.sm(glowColor) : 'none',
        cursor: isTop ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {isTop && (
        <span
          style={{
            fontSize: '0.5625rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {getColorNoteInfo(stack.color)}
        </span>
      )}
      <span style={{ fontSize: isTop ? '0.875rem' : '0.75rem' }}>
        {getColorEmoji(stack.color)}
      </span>
      <span
        style={{
          fontSize: isTop ? '0.625rem' : '0.5rem',
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        x{stack.count}
      </span>
    </motion.div>
  );
});

Stack.displayName = 'Stack';

/**
 * Single queue column component
 */
const QueueColumn = memo(({ queue, queueIndex, onTap, gameState }) => {
  const handleTap = useCallback((idx) => {
    if (gameState === 'playing') {
      onTap(idx);
    }
  }, [gameState, onTap]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          minHeight: 140,
          position: 'relative',
        }}
      >
        <AnimatePresence>
          {queue.slice(0, 5).map((stack, i) => (
            <Stack
              key={stack.id}
              stack={stack}
              isTop={i === 0}
              queueIndex={queueIndex}
              onTap={handleTap}
            />
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        key={queue.length}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        style={{
          fontSize: '0.5625rem',
          color: colors.primary[500],
          marginTop: 4,
        }}
      >
        {queue.length > 0 ? `${queue.length} left` : 'empty'}
      </motion.div>
    </div>
  );
});

QueueColumn.displayName = 'QueueColumn';

/**
 * Color queue component - displays 4 queue columns
 */
export const ColorQueue = ({ queues, onQueueTap, gameState }) => {
  return (
    <div>
      <div
        style={{
          fontSize: '0.625rem',
          color: colors.primary[400],
          marginBottom: 6,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}
      >
        Tap top stack to load
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
        }}
      >
        {queues.map((queue, qIndex) => (
          <QueueColumn
            key={qIndex}
            queue={queue}
            queueIndex={qIndex}
            onTap={onQueueTap}
            gameState={gameState}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorQueue;
