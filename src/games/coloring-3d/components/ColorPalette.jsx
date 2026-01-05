import { motion } from 'framer-motion';
import { useColoringStore, COLORING_PALETTE } from '../hooks/useColoringState';
import { colors, shadows } from '../../../shared/styles/theme';

/**
 * Color Palette for 3D coloring game
 */
export const ColorPalette = () => {
  const { selectedColor, selectColor } = useColoringStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: 8,
        padding: 12,
        background: colors.glass.medium,
        borderRadius: 12,
        border: `1px solid ${colors.glass.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {Object.entries(COLORING_PALETTE).map(([number, { color, name }]) => {
        const isSelected = selectedColor === parseInt(number);

        return (
          <motion.button
            key={number}
            onClick={() => selectColor(parseInt(number))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              border: isSelected ? '3px solid #fff' : '2px solid transparent',
              background: color,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              boxShadow: isSelected
                ? `0 0 20px ${color}, 0 0 40px ${color}80`
                : shadows.sm,
              transition: 'box-shadow 0.2s, border 0.2s',
            }}
          >
            {number}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ColorPalette;
