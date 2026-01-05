/**
 * InputStack - Stack of cubes waiting to enter the belt
 */

import { motion, AnimatePresence } from 'framer-motion';
import { GAME_COLORS } from '../data/colors';
import { colors } from '../../../shared/styles/theme';

export const InputStack = ({
  stack,
  stackCapacity,
  inputGatePos,
  gameAreaHeight,
}) => {
  const isFull = stack.length >= stackCapacity;

  return (
    <div
      style={{
        position: 'absolute',
        left: inputGatePos.x - 14,
        bottom: gameAreaHeight - inputGatePos.y + 30,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 3,
        zIndex: 30,
      }}
    >
      <AnimatePresence>
        {stack.map((color, index) => (
          <motion.div
            key={`${color}-${index}`}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              width: 28,
              height: 28,
              backgroundColor: GAME_COLORS[color],
              borderRadius: 6,
              boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
              border: '2px solid rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </AnimatePresence>

      {stack.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            backgroundColor: isFull ? colors.neon.coral : colors.neon.orange,
            padding: '2px 6px',
            borderRadius: 6,
            color: 'white',
            fontSize: 9,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {stack.length}/{stackCapacity}
        </motion.div>
      )}
    </div>
  );
};

export default InputStack;
