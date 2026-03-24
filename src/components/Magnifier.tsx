import { useEffect, useRef } from "react";

interface MagnifierProps {
  canvas: HTMLCanvasElement | null;
  enabled: boolean;
  mouseX: number;
  mouseY: number;
  gridSize?: number;
  pixelScale?: number;
}

export default function Magnifier({
  canvas,
  enabled,
  mouseX,
  mouseY,
  gridSize = 11,
  pixelScale = 10,
}: MagnifierProps) {
  const magnifierRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled || !canvas || !magnifierRef.current) return;

    const mag = magnifierRef.current;
    const ctx = mag.getContext("2d");
    if (!ctx) return;

    const size = gridSize * pixelScale;
    mag.width = size;
    mag.height = size;

    const half = Math.floor(gridSize / 2);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = Math.round(mouseX * scaleX);
    const cy = Math.round(mouseY * scaleY);

    // Get source pixel data
    const srcCtx = canvas.getContext("2d");
    if (!srcCtx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        const sx = cx + dx;
        const sy = cy + dy;

        if (sx >= 0 && sx < canvas.width && sy >= 0 && sy < canvas.height) {
          const pixel = srcCtx.getImageData(sx, sy, 1, 1).data;
          ctx.fillStyle = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
        } else {
          ctx.fillStyle = "hsl(220, 16%, 14%)";
        }

        const px = (dx + half) * pixelScale;
        const py = (dy + half) * pixelScale;
        ctx.fillRect(px, py, pixelScale, pixelScale);
      }
    }

    // Grid lines
    ctx.strokeStyle = "hsla(0, 0%, 100%, 0.08)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      const pos = i * pixelScale;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Center crosshair
    const centerPos = half * pixelScale;
    ctx.strokeStyle = "hsla(0, 0%, 100%, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(centerPos, centerPos, pixelScale, pixelScale);
  }, [enabled, canvas, mouseX, mouseY, gridSize, pixelScale]);

  if (!enabled) return null;

  const size = gridSize * pixelScale;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
        Zoom
      </span>
      <canvas
        ref={magnifierRef}
        width={size}
        height={size}
        className="rounded-md border border-border shadow-inner"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
