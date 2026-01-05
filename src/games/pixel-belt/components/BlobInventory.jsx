/**
 * BlobInventory - Queue stacks, belt status, and launcher slots
 * Optimized for performance using CSS instead of framer-motion
 */

import { memo } from 'react';
import { COLORS } from '../../../shared/data/colors';
import { colors, shadows } from '../../../shared/styles/theme';

const MAX_BELT = 5;
const MAX_SLOTS = 5;

const QueueStack = memo(({ stack, onClick, disabled }) => {
  if (!stack) {
    return (
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          border: `2px dashed ${colors.primary[700]}`,
          background: colors.primary[800],
          opacity: 0.3,
        }}
      />
    );
  }

  const colorHex = COLORS[stack.color] || '#888888';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: 50,
        height: 50,
        borderRadius: 8,
        background: `radial-gradient(circle at 30% 30%, ${colorHex}, ${colorHex}cc)`,
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: shadows.glow.sm(colorHex),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.1s ease, opacity 0.1s ease',
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1.08) translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {stack.count}
      </span>
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.4)',
        }}
      />
    </div>
  );
});

const Queue = memo(({ queue, queueIndex, onStackTap, disabled }) => {
  const topStack = queue[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <QueueStack
        stack={topStack}
        onClick={() => onStackTap(queueIndex)}
        disabled={disabled || !topStack}
      />
      {queue.length > 1 && (
        <div style={{ fontSize: 10, color: colors.primary[400], fontWeight: 600 }}>
          +{queue.length - 1}
        </div>
      )}
    </div>
  );
});

// Belt blob indicator (small, shows blob on belt)
const BeltBlobIndicator = memo(({ blob }) => {
  if (!blob) {
    return (
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `2px dashed ${colors.primary[700]}`,
          background: colors.primary[800],
          opacity: 0.3,
        }}
      />
    );
  }

  const colorHex = COLORS[blob.color] || '#888888';

  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${colorHex}, ${colorHex}cc)`,
        border: '2px solid rgba(255,255,255,0.4)',
        boxShadow: shadows.glow.sm(colorHex),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {blob.shotsRemaining}
      </span>
    </div>
  );
});

// Launcher slot (tappable to send back to belt)
const LauncherSlot = memo(({ slot, index, onClick, disabled }) => {
  if (!slot) {
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `2px dashed ${colors.primary[600]}`,
          background: colors.primary[800],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: colors.primary[600],
        }}
      >
        {index + 1}
      </div>
    );
  }

  const colorHex = COLORS[slot.color] || '#888888';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${colorHex}, ${colorHex}cc)`,
        border: '2px solid rgba(255,255,255,0.4)',
        boxShadow: shadows.glow.sm(colorHex),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'transform 0.1s ease',
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {slot.shotsRemaining}
      </span>
    </div>
  );
});

export const BlobInventory = memo(({
  queues,
  launcherSlots,
  blobsOnBelt,
  onQueueTap,
  onSlotTap,
  disabled,
}) => {
  const beltCount = blobsOnBelt?.length || 0;
  const slotCount = launcherSlots.filter(s => s !== null).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: 16,
        background: colors.glass.medium,
        borderRadius: 12,
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      {/* Belt Status */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: colors.neon.yellow, marginRight: 4, fontWeight: 600 }}>
          BELT
        </span>
        {Array.from({ length: MAX_BELT }).map((_, i) => (
          <BeltBlobIndicator key={i} blob={blobsOnBelt?.[i]} />
        ))}
        <span style={{ fontSize: 10, color: colors.primary[400], marginLeft: 4 }}>
          {beltCount}/{MAX_BELT}
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: colors.primary[700] }} />

      {/* Launcher Slots (tappable) */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: colors.neon.coral, marginRight: 4, fontWeight: 600 }}>
          SLOTS
        </span>
        {launcherSlots.map((slot, i) => (
          <LauncherSlot
            key={i}
            slot={slot}
            index={i}
            onClick={() => onSlotTap?.(i)}
            disabled={disabled}
          />
        ))}
        <span style={{ fontSize: 10, color: colors.primary[400], marginLeft: 4 }}>
          {slotCount}/{MAX_SLOTS}
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: colors.primary[700] }} />

      {/* Queues */}
      <div style={{ display: 'flex', gap: 10 }}>
        {queues.map((queue, i) => (
          <Queue
            key={i}
            queue={queue}
            queueIndex={i}
            onStackTap={onQueueTap}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Status text */}
      <div
        style={{
          fontSize: 10,
          color: slotCount >= MAX_SLOTS ? colors.neon.coral : colors.primary[500],
          fontWeight: 600,
        }}
      >
        {slotCount >= MAX_SLOTS
          ? 'Slots full! Tap slot to resend'
          : 'Tap queue to send • Tap slot to resend'}
      </div>
    </div>
  );
});

export default BlobInventory;
