/**
 * Musical Melodies for Conveyor Sort
 *
 * ONE COMPLETE SONG - DYNAMICALLY SPLIT:
 * - The SAME song is used for all levels
 * - Song is divided into N phrases based on placement count
 * - More placements = more phrases = shorter phrases
 * - Fewer placements = fewer phrases = longer phrases
 *
 * Example: 24-beat song
 * - 4 placements = 4 phrases of 6 beats each
 * - 6 placements = 6 phrases of 4 beats each
 * - 8 placements = 8 phrases of 3 beats each
 */

// Note frequencies
const NOTE_FREQ = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00,
  'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
  'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51,
};

/**
 * THE COMPLETE MUSIC SHEET
 * A waltz melody - all notes with absolute beat positions
 * Total length: 24 beats (can be divided by 2, 3, 4, 6, 8, 12)
 */
const COMPLETE_MELODY = [
  // Phrase 1: Opening theme (beats 0-6)
  { note: 'E5', beat: 0, duration: 1 },
  { note: 'E5', beat: 1, duration: 0.5 },
  { note: 'F5', beat: 1.5, duration: 0.5 },
  { note: 'E5', beat: 2, duration: 1 },
  { note: 'D5', beat: 3, duration: 1 },
  { note: 'C5', beat: 4, duration: 0.5 },
  { note: 'D5', beat: 4.5, duration: 0.5 },
  { note: 'E5', beat: 5, duration: 1 },

  // Phrase 2: Response (beats 6-12)
  { note: 'D5', beat: 6, duration: 1 },
  { note: 'D5', beat: 7, duration: 0.5 },
  { note: 'E5', beat: 7.5, duration: 0.5 },
  { note: 'D5', beat: 8, duration: 1 },
  { note: 'C5', beat: 9, duration: 1 },
  { note: 'B4', beat: 10, duration: 0.5 },
  { note: 'C5', beat: 10.5, duration: 0.5 },
  { note: 'A4', beat: 11, duration: 1 },

  // Phrase 3: Climax (beats 12-18)
  { note: 'E5', beat: 12, duration: 0.5 },
  { note: 'G5', beat: 12.5, duration: 0.5 },
  { note: 'A5', beat: 13, duration: 1 },
  { note: 'G5', beat: 14, duration: 1 },
  { note: 'F5', beat: 15, duration: 0.5 },
  { note: 'E5', beat: 15.5, duration: 0.5 },
  { note: 'D5', beat: 16, duration: 1 },
  { note: 'E5', beat: 17, duration: 1 },

  // Phrase 4: Resolution (beats 18-24)
  { note: 'D5', beat: 18, duration: 0.5 },
  { note: 'C5', beat: 18.5, duration: 0.5 },
  { note: 'B4', beat: 19, duration: 1 },
  { note: 'A4', beat: 20, duration: 1 },
  { note: 'C5', beat: 21, duration: 0.5 },
  { note: 'B4', beat: 21.5, duration: 0.5 },
  { note: 'A4', beat: 22, duration: 2 },
];

// Total beats in the complete song
const TOTAL_BEATS = 24;

/**
 * COMPLETE BASS LINE - one note per beat position
 * Will be split the same way as melody
 */
const COMPLETE_BASS = [
  // Beat 0-5
  'A3', 'A3', 'A3', 'D3', 'D3', 'D3',
  // Beat 6-11
  'G3', 'G3', 'G3', 'C3', 'C3', 'C3',
  // Beat 12-17
  'F3', 'F3', 'F3', 'E3', 'E3', 'E3',
  // Beat 18-23
  'E3', 'E3', 'E3', 'A3', 'A3', 'A3',
];

/**
 * COMPLETE CHORD PROGRESSION - one chord per 3 beats (waltz measure)
 */
const COMPLETE_CHORDS = [
  ['E4', 'A4', 'C5'],  // Am - beats 0-2
  ['F4', 'A4', 'D5'],  // Dm - beats 3-5
  ['G4', 'B4', 'D5'],  // G  - beats 6-8
  ['C4', 'E4', 'G4'],  // C  - beats 9-11
  ['F4', 'A4', 'C5'],  // F  - beats 12-14
  ['E4', 'G#4', 'B4'], // E  - beats 15-17
  ['E4', 'G#4', 'B4'], // E  - beats 18-20
  ['E4', 'A4', 'C5'],  // Am - beats 21-23
];

/**
 * Get the beat length for each phrase based on placement count
 */
export const getBeatsPerPhrase = (totalPlacements) => {
  return TOTAL_BEATS / totalPlacements;
};

/**
 * Get phrase melody for a specific box index
 * Extracts the portion of the complete melody for this phrase
 */
export const getPhraseMelody = (boxIndex, totalPlacements = 4) => {
  const beatsPerPhrase = getBeatsPerPhrase(totalPlacements);
  const phraseStartBeat = boxIndex * beatsPerPhrase;
  const phraseEndBeat = phraseStartBeat + beatsPerPhrase;

  // Filter notes that fall within this phrase's beat range
  // and adjust their beat position to be relative to phrase start
  return COMPLETE_MELODY
    .filter(note => note.beat >= phraseStartBeat && note.beat < phraseEndBeat)
    .map(note => ({
      ...note,
      beat: note.beat - phraseStartBeat, // Make beat relative to phrase
    }));
};

/**
 * Get bass note for a position in the loop
 */
export const getBassForPosition = (position, totalPositions) => {
  const beatsPerPhrase = getBeatsPerPhrase(totalPositions);
  const beatIndex = Math.floor(position * beatsPerPhrase);
  return COMPLETE_BASS[beatIndex % COMPLETE_BASS.length];
};

/**
 * Get chord for a position in the loop
 */
export const getChordForPosition = (position, totalPositions) => {
  const beatsPerPhrase = getBeatsPerPhrase(totalPositions);
  const beatIndex = Math.floor(position * beatsPerPhrase);
  const chordIndex = Math.floor(beatIndex / 3); // Chord changes every 3 beats
  return COMPLETE_CHORDS[chordIndex % COMPLETE_CHORDS.length];
};

// Helper to get frequency from note name
export const getFrequency = (noteName) => NOTE_FREQ[noteName] || 440;

// Get total song length in beats
export const getTotalBeats = () => TOTAL_BEATS;

export default {
  getPhraseMelody,
  getBassForPosition,
  getChordForPosition,
  getFrequency,
  getBeatsPerPhrase,
  getTotalBeats,
};
