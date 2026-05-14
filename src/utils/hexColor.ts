export function hexColor(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  if (isNaN(n)) throw new Error(`Invalid hex color: "${hex}"`);
  return n;
}
