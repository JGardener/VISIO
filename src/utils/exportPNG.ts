export function exportPNG(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  // <a download> is blocked in iOS Safari on file:// and non-HTTPS origins;
  // works correctly once deployed to any standard HTTPS host (e.g. Vercel).
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
