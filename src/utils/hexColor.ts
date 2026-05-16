export function hexColor(hex: string): number {
  const clean = hex.replace('#', '').slice(0, 6);
  const n = parseInt(clean, 16);
  if (isNaN(n)) throw new Error(`Invalid hex color: "${hex}"`);
  return n;
}
