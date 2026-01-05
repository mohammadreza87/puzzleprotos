/**
 * Game Color System
 * Maps colors to musical notes and instruments
 */

import { noteColors } from '../styles/theme';

// Re-export noteColors as COLORS for backward compatibility
export const COLORS = noteColors;

// Color family to note mapping
export const COLOR_NOTE_MAP = {
  red:    { note: 'C', instrument: 'piano' },
  orange: { note: 'D', instrument: 'marimba' },
  yellow: { note: 'E', instrument: 'bell' },
  green:  { note: 'F', instrument: 'pad' },
  blue:   { note: 'G', instrument: 'flute' },
  purple: { note: 'A', instrument: 'strings' },
  pink:   { note: 'B', instrument: 'celesta' },
  brown:  { note: 'C', instrument: 'bass' },
  skin:   { note: 'D', instrument: 'bass' },
  gray:   { note: 'E', instrument: 'chime' },
  white:  { note: 'G', instrument: 'chime' },
  black:  { note: 'C', instrument: 'bass' },
};

// Base frequencies for notes (octave 0)
export const BASE_NOTES = {
  'C': 16.35,
  'D': 18.35,
  'E': 20.60,
  'F': 21.83,
  'G': 24.50,
  'A': 27.50,
  'B': 30.87,
};

/**
 * Parse color key to extract family and shade
 * @param {string} colorKey - Color key like 'red3' or 'blue'
 * @returns {{ family: string, shade: number }}
 */
export const parseColorKey = (colorKey) => {
  const match = colorKey.match(/^([a-zA-Z]+)(\d*)$/);
  if (!match) return { family: colorKey, shade: 3 };
  return {
    family: match[1],
    shade: match[2] ? parseInt(match[2]) : 3,
  };
};

/**
 * Get frequency and instrument for a color
 * @param {string} colorKey - Color key
 * @returns {{ frequency: number, instrument: string, note: string, octave: number }}
 */
export const getFrequencyForColor = (colorKey) => {
  const { family, shade } = parseColorKey(colorKey);
  const mapping = COLOR_NOTE_MAP[family] || { note: 'C', instrument: 'piano' };
  const baseFreq = BASE_NOTES[mapping.note];

  // Map shade to octave (shade 1 = octave 2, shade 8 = octave 6)
  const octave = Math.floor(shade / 2) + 2;
  const frequency = baseFreq * Math.pow(2, octave);

  return {
    frequency,
    instrument: mapping.instrument,
    note: mapping.note,
    octave,
  };
};

/**
 * Get emoji representation for a color
 * @param {string} colorKey - Color key
 * @returns {string} Emoji
 */
export const getColorEmoji = (colorKey) => {
  const emojiMap = {
    red: '🔴',
    pink: '💗',
    orange: '🟠',
    yellow: '🟡',
    green: '🟢',
    blue: '🔵',
    purple: '🟣',
    brown: '🟤',
    skin: '🟤',
    gray: '⬜',
    white: '⬜',
    black: '⬛',
  };

  const { family } = parseColorKey(colorKey);
  return emojiMap[family] || '🔲';
};

/**
 * Get note info display string for a color
 * @param {string} colorKey - Color key
 * @returns {string} Note info like 'C4'
 */
export const getColorNoteInfo = (colorKey) => {
  const { note, octave } = getFrequencyForColor(colorKey);
  return `${note}${octave}`;
};

/**
 * Get the neon glow color for a color family
 * @param {string} colorKey - Color key
 * @returns {string} Hex color for glow effect
 */
export const getGlowColor = (colorKey) => {
  const { family } = parseColorKey(colorKey);
  const glowMap = {
    red: '#FF4444',
    orange: '#FF8800',
    yellow: '#FFDD00',
    green: '#00FF88',
    blue: '#00AAFF',
    purple: '#AA44FF',
    pink: '#FF44AA',
    brown: '#DDAA66',
    skin: '#FFBB77',
    gray: '#CCCCCC',
    white: '#FFFFFF',
    black: '#666666',
  };
  return glowMap[family] || '#FFFFFF';
};
