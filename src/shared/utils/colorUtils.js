// Color manipulation utilities

/**
 * Desaturate a hex color by blending with grayscale
 * @param {string} hex - Hex color string (e.g., '#FF0000')
 * @param {number} amount - Amount to desaturate (0 = no change, 1 = fully gray)
 * @returns {string} RGB color string
 */
export const desaturate = (hex, amount = 0.75) => {
  if (!hex) return '#333';
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  return `rgb(${Math.round(r * (1 - amount) + gray * amount)}, ${Math.round(g * (1 - amount) + gray * amount)}, ${Math.round(b * (1 - amount) + gray * amount)})`;
};

/**
 * Brighten a hex color by blending with white
 * @param {string} hex - Hex color string (e.g., '#FF0000')
 * @param {number} amount - Amount to brighten (0 = no change, 1 = white)
 * @returns {string} RGB color string
 */
export const brighten = (hex, amount = 0.3) => {
  if (!hex) return '#fff';
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + (255 - r) * amount);
  g = Math.min(255, g + (255 - g) * amount);
  b = Math.min(255, b + (255 - b) * amount);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

/**
 * Darken a hex color by blending with black
 * @param {string} hex - Hex color string (e.g., '#FF0000')
 * @param {number} amount - Amount to darken (0 = no change, 1 = black)
 * @returns {string} RGB color string
 */
export const darken = (hex, amount = 0.3) => {
  if (!hex) return '#000';
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r * (1 - amount));
  g = Math.max(0, g * (1 - amount));
  b = Math.max(0, b * (1 - amount));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

/**
 * Convert hex to rgba with alpha
 * @param {string} hex - Hex color string
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return 'rgba(0,0,0,1)';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
