export interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
  x: number;
  y: number;
}

export function samplePixel(
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): PixelData | null {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const px = Math.floor(x * scaleX);
  const py = Math.floor(y * scaleY);

  if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) return null;

  const imageData = ctx.getImageData(px, py, 1, 1).data;
  return {
    r: imageData[0],
    g: imageData[1],
    b: imageData[2],
    a: imageData[3],
    x: px,
    y: py,
  };
}

export function normalize(value: number): number {
  return Math.round((value / 255) * 10000) / 10000;
}

export function formatValue(value: number, normalized: boolean): string {
  if (normalized) {
    return normalize(value).toFixed(4);
  }
  return value.toString();
}

export function rgbaToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function getMagnifiedPixels(
  canvas: HTMLCanvasElement,
  centerX: number,
  centerY: number,
  radius: number
): number[][] {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = Math.floor(centerX * scaleX);
  const cy = Math.floor(centerY * scaleY);

  const size = radius * 2 + 1;
  const startX = cx - radius;
  const startY = cy - radius;

  const clampedX = Math.max(0, startX);
  const clampedY = Math.max(0, startY);
  const clampedW = Math.min(canvas.width - clampedX, size - (clampedX - startX));
  const clampedH = Math.min(canvas.height - clampedY, size - (clampedY - startY));

  if (clampedW <= 0 || clampedH <= 0) return [];

  const imageData = ctx.getImageData(clampedX, clampedY, clampedW, clampedH);
  const result: number[][] = [];

  for (let y = 0; y < clampedH; y++) {
    for (let x = 0; x < clampedW; x++) {
      const i = (y * clampedW + x) * 4;
      result.push([
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
        imageData.data[i + 3],
      ]);
    }
  }

  return result;
}
