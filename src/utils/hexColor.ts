export function hexColor(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}
