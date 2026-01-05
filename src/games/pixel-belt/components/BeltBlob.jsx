/**
 * BeltBlob - Blob traveling on the belt with shots counter
 * VanishingBlob - Blob that ran out of shots (sparkle animation)
 * Optimized for performance using CSS transitions instead of framer-motion
 */

import { memo } from 'react';
import { COLORS } from '../../../shared/data/colors';
import { shadows } from '../../../shared/styles/theme';

export const BeltBlob = memo(({ blob, position, padding = 30 }) => {
  if (!blob || !position) return null;

  const colorHex = COLORS[blob.color] || '#888888';

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x + padding - 16,
        top: position.y + padding - 16,
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${colorHex}, ${colorHex}bb)`,
        boxShadow: shadows.glow.md(colorHex),
        border: '3px solid rgba(255,255,255,0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 0.15s linear, top 0.15s linear',
      }}
    >
      {/* Shots remaining counter */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {blob.shotsRemaining}
      </span>

      {/* Inner highlight */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)',
        }}
      />
    </div>
  );
});

// Vanishing blob with simple CSS animation
export const VanishingBlob = memo(({ blob, padding = 30 }) => {
  if (!blob) return null;

  const colorHex = COLORS[blob.color] || '#888888';

  return (
    <div
      style={{
        position: 'absolute',
        left: blob.x + padding - 20,
        top: blob.y + padding - 20,
        width: 40,
        height: 40,
        zIndex: 60,
        pointerEvents: 'none',
        animation: 'blobVanish 0.4s ease-out forwards',
      }}
    >
      <style>
        {`
          @keyframes blobVanish {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.6; }
            100% { transform: scale(2); opacity: 0; }
          }
        `}
      </style>
      {/* Main burst */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorHex}ff, ${colorHex}00)`,
          boxShadow: `0 0 20px ${colorHex}`,
        }}
      />
    </div>
  );
});

export default BeltBlob;
