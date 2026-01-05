/**
 * Melody System
 * X position determines pitch - the shape of the art creates the melody
 */

// Musical scales (notes from low to high)
const SCALES = {
  // C Major Pentatonic (pleasant, no dissonance)
  pentatonic: ['C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6'],
  // C Major
  major: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'],
  // A Minor (emotional)
  minor: ['A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  // Japanese pentatonic (mysterious)
  japanese: ['C3', 'Db3', 'F3', 'G3', 'Bb3', 'C4', 'Db4', 'F4', 'G4', 'Bb4', 'C5', 'Db5', 'F5', 'G5', 'Bb5', 'C6'],
  // Blues scale
  blues: ['C3', 'Eb3', 'F3', 'Gb3', 'G3', 'Bb3', 'C4', 'Eb4', 'F4', 'Gb4', 'G4', 'Bb4', 'C5', 'Eb5', 'F5', 'C6'],
};

// Note frequencies (Hz)
const NOTE_FREQ = {
  'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'Db3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'Gb3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00,
  'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'Gb4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00,
  'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'Db5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.26,
  'F5': 698.46, 'Gb5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00,
  'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50,
};

// Level configurations - each level has a unique musical character
const LEVEL_CONFIG = {
  // Nature & Animals
  flower: { scale: 'major', instrument: 'celesta', baseNote: 2 },
  fish: { scale: 'pentatonic', instrument: 'marimba', baseNote: 1 },
  parrot: { scale: 'major', instrument: 'flute', baseNote: 0 },
  butterfly: { scale: 'pentatonic', instrument: 'bell', baseNote: 2 },
  alien: { scale: 'japanese', instrument: 'pad', baseNote: 0 },

  // Food & Objects
  icecream: { scale: 'major', instrument: 'celesta', baseNote: 3 },
  pizza: { scale: 'blues', instrument: 'piano', baseNote: 1 },
  cake: { scale: 'major', instrument: 'bell', baseNote: 2 },
  treasure: { scale: 'minor', instrument: 'strings', baseNote: 0 },

  // Tech & Space
  rocket: { scale: 'pentatonic', instrument: 'pad', baseNote: 0 },
  robot: { scale: 'blues', instrument: 'bass', baseNote: 0 },

  // Scenes & Symbols
  sunset: { scale: 'japanese', instrument: 'pad', baseNote: 1 },
  heart: { scale: 'pentatonic', instrument: 'celesta', baseNote: 2 },
  star: { scale: 'major', instrument: 'bell', baseNote: 0 },
};

/**
 * Get note frequency for a pixel based on its X position
 * @param {string} levelKey - Level name
 * @param {number} x - X position of pixel
 * @param {number} gridWidth - Width of the grid
 * @returns {{ frequency: number, noteName: string }}
 */
export const getNoteForPosition = (levelKey, x, gridWidth) => {
  const config = LEVEL_CONFIG[levelKey] || { scale: 'pentatonic', instrument: 'piano', baseNote: 0 };
  const scale = SCALES[config.scale];

  // Map X position to scale index
  // Center of grid = middle of scale, edges = extremes
  const scaleLength = scale.length;
  const noteIndex = Math.floor((x / gridWidth) * scaleLength);
  const clampedIndex = Math.max(0, Math.min(scaleLength - 1, noteIndex + config.baseNote));

  const noteName = scale[clampedIndex];
  const frequency = NOTE_FREQ[noteName] || 440;

  return { frequency, noteName };
};

/**
 * Get the instrument for a level
 */
export const getLevelInstrument = (levelKey) => {
  const config = LEVEL_CONFIG[levelKey];
  return config?.instrument || 'piano';
};

/**
 * Get the scale name for a level
 */
export const getLevelScale = (levelKey) => {
  const config = LEVEL_CONFIG[levelKey];
  return config?.scale || 'pentatonic';
};

export default { getNoteForPosition, getLevelInstrument, getLevelScale };
