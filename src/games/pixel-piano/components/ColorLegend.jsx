import { memo } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../../shared/data/colors';
import { colors } from '../../../shared/styles/theme';

/**
 * Legend item data
 */
const legendItems = [
  { family: 'red', emoji: '🔴', note: 'C', instrument: 'Piano' },
  { family: 'orange', emoji: '🟠', note: 'D', instrument: 'Marimba' },
  { family: 'yellow', emoji: '🟡', note: 'E', instrument: 'Bell' },
  { family: 'green', emoji: '🟢', note: 'F', instrument: 'Pad' },
  { family: 'blue', emoji: '🔵', note: 'G', instrument: 'Flute' },
  { family: 'purple', emoji: '🟣', note: 'A', instrument: 'Strings' },
  { family: 'pink', emoji: '💗', note: 'B', instrument: 'Celesta' },
];

/**
 * Color-to-note legend component
 */
export const ColorLegend = memo(({ compact = false }) => {
  if (compact) {
    return (
      <motion.div
        className="glass-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          marginTop: 12,
          padding: 8,
        }}
      >
        <div
          style={{
            fontSize: '0.5625rem',
            color: colors.primary[400],
            marginBottom: 4,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Color → Note
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
            fontSize: '0.5625rem',
          }}
        >
          {legendItems.map((item) => (
            <span
              key={item.family}
              style={{
                color: COLORS[`${item.family}4`] || COLORS[`${item.family}3`] || colors.primary[300],
              }}
            >
              {item.emoji}{item.note}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        marginBottom: 16,
      }}
    >
      {legendItems.map((item, index) => (
        <motion.div
          key={item.family}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: COLORS[`${item.family}3`] || COLORS[item.family] || '#666',
            }}
          />
          <span
            style={{
              fontSize: '0.6875rem',
              color: colors.primary[200],
              fontWeight: 600,
            }}
          >
            {item.note}
          </span>
          <span
            style={{
              fontSize: '0.5625rem',
              color: colors.primary[500],
            }}
          >
            {item.instrument.slice(0, 3)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
});

ColorLegend.displayName = 'ColorLegend';

export default ColorLegend;
