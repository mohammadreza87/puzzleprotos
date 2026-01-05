/**
 * BlobInventory - Queue stacks, belt status, and launcher slots
 * Shows upcoming shooters in queue like Pixel Piano
 */

import { memo } from 'react';
import { COLORS } from '../../../shared/data/colors';
import { colors, shadows } from '../../../shared/styles/theme';

const MAX_BELT = 5;
const MAX_SLOTS = 5;
const QUEUE_VISIBLE = 4; // How many items visible in each queue

// Single queue item (shooter blob)
const QueueItem = memo(({ stack, size = 'large', onClick, disabled, isTop }) => {
  if (!stack) {
    return (
      <div
        style={{
          width: size === 'large' ? 44 : 32,
          height: size === 'large' ? 44 : 32,
          borderRadius: size === 'large' ? 8 : 6,
          border: `2px dashed ${colors.primary[700]}`,
          background: colors.primary[800],
          opacity: 0.2,
        }}
      />
    );
  }

  const colorHex = COLORS[stack.color] || '#888888';
  const itemSize = size === 'large' ? 44 : 32;

  return (
    <div
      onClick={isTop && !disabled ? onClick : undefined}
      style={{
        width: itemSize,
        height: itemSize,
        borderRadius: size === 'large' ? 8 : 6,
        background: `radial-gradient(circle at 30% 30%, ${colorHex}, ${colorHex}cc)`,
        border: isTop ? '3px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.2)',
        boxShadow: isTop ? shadows.glow.sm(colorHex) : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isTop && !disabled ? 'pointer' : 'default',
        opacity: isTop ? 1 : 0.7,
        transition: 'transform 0.1s ease, opacity 0.1s ease',
      }}
      onMouseEnter={(e) => isTop && !disabled && (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span
        style={{
          fontSize: size === 'large' ? 16 : 11,
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {stack.count}
      </span>
    </div>
  );
});

// Vertical queue showing multiple upcoming items
const Queue = memo(({ queue, queueIndex, onStackTap, disabled }) => {
  // Show up to QUEUE_VISIBLE items
  const visibleItems = queue.slice(0, QUEUE_VISIBLE);
  const remainingCount = Math.max(0, queue.length - QUEUE_VISIBLE);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      {/* Top item (tappable) */}
      <QueueItem
        stack={visibleItems[0]}
        size="large"
        onClick={() => onStackTap(queueIndex)}
        disabled={disabled || !visibleItems[0]}
        isTop={true}
      />

      {/* Upcoming items (smaller, stacked) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        opacity: 0.9,
      }}>
        {visibleItems.slice(1).map((stack, i) => (
          <QueueItem
            key={stack?.id || i}
            stack={stack}
            size="small"
            isTop={false}
          />
        ))}

        {/* Empty slots to show queue capacity */}
        {visibleItems.length < QUEUE_VISIBLE &&
          Array.from({ length: QUEUE_VISIBLE - visibleItems.length }).map((_, i) => (
            <QueueItem key={`empty-${i}`} stack={null} size="small" />
          ))
        }
      </div>

      {/* Remaining count */}
      {remainingCount > 0 && (
        <div style={{
          fontSize: 9,
          color: colors.primary[400],
          fontWeight: 600,
          marginTop: 2,
        }}>
          +{remainingCount} more
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
      {/* Belt & Slots Row */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        {/* Belt Status */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: colors.neon.yellow, fontWeight: 600 }}>
            BELT
          </span>
          {Array.from({ length: MAX_BELT }).map((_, i) => (
            <BeltBlobIndicator key={i} blob={blobsOnBelt?.[i]} />
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 30, background: colors.primary[700] }} />

        {/* Launcher Slots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: colors.neon.coral, fontWeight: 600 }}>
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
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: colors.primary[700] }} />

      {/* Queues - vertical stacks */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
          : 'Tap top of queue to send'}
      </div>
    </div>
  );
});

export default BlobInventory;
