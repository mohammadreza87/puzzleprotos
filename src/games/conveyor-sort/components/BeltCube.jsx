/**
 * BeltCube - Cube moving on the conveyor belt
 */

import { motion } from 'framer-motion';
import { GAME_COLORS } from '../data/colors';

export const BeltCube = ({ cube, position }) => {
  if (!position) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      style={{
        position: 'absolute',
        left: position.x - 13,
        top: position.y - 13,
        width: 26,
        height: 26,
        backgroundColor: GAME_COLORS[cube.color],
        borderRadius: 6,
        boxShadow: '0 2px 0 rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.15)',
        border: '2px solid rgba(255,255,255,0.4)',
        zIndex: 10,
      }}
    />
  );
};

export default BeltCube;
