import { memo } from 'react';
import { motion } from 'framer-motion';
import { colors, shadows } from '../../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../../shared/styles/animations';

/**
 * Control panel component with play/pause and BPM controls
 */
export const ControlPanel = memo(({
  isPlaying,
  bpm,
  onPlayPause,
  onBpmChange,
}) => {
  return (
    <motion.div
      className="glass-panel"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 16px',
        marginBottom: 12,
      }}
    >
      {/* Play/Pause button */}
      <motion.button
        onClick={onPlayPause}
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        transition={springTransition}
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#fff',
          background: isPlaying
            ? `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange})`
            : `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure})`,
          boxShadow: isPlaying
            ? shadows.glow.sm(colors.neon.coral)
            : shadows.glow.sm(colors.neon.mint),
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </motion.button>

      {/* BPM control */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: '0.625rem',
            color: colors.primary[400],
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          BPM
        </span>
        <input
          type="range"
          min="60"
          max="180"
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value))}
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            cursor: 'pointer',
            accentColor: colors.neon.mint,
          }}
        />
        <motion.span
          key={bpm}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={springTransition}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: colors.primary[100],
            minWidth: 28,
            fontFamily: 'monospace',
          }}
        >
          {bpm}
        </motion.span>
      </div>
    </motion.div>
  );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
