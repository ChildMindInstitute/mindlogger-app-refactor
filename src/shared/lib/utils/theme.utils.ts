/**
 * Converts a hex color to RGB components
 * @param hex The hex color to convert (e.g., "#RRGGBB" or "#RGB")
 * @returns An object with r, g, b components or null if invalid
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex value based on length
  let r: number, g: number, b: number;

  if (hex.length === 3) {
    // #RGB format
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // #RRGGBB format
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return null; // Invalid hex color
  }

  return { r, g, b };
}

/**
 * Creates an rgba color string from a hex color and alpha value
 * @param hex The hex color to convert
 * @param alpha The alpha value (0-1)
 * @returns An rgba color string or the original hex if conversion fails
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
