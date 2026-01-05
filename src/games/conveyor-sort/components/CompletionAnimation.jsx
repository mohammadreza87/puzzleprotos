/**
 * CompletionAnimation - Pulse animation when a layer completes
 */

import { motion } from 'framer-motion';
import { GAME_COLORS } from '../data/colors';

export const CompletionAnimation = ({ animation }) => {
  const color = GAME_COLORS[animation.color];

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: animation.x - 50,
        top: animation.y - 50,
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: `${color}66`,
        border: `4px solid ${color}`,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    />
  );
};

export default CompletionAnimation;
