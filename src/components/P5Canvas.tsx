import { useEffect, useRef, useCallback } from "react";
import p5 from "p5";
import type { SketchDef } from "@/lib/sketches";
import type { PixelData } from "@/lib/color-utils";
import { samplePixel } from "@/lib/color-utils";

interface P5CanvasProps {
  sketch: SketchDef;
  eyedropperEnabled: boolean;
  onPixelSample: (data: PixelData | null) => void;
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

export default function P5Canvas({
  sketch,
  eyedropperEnabled,
  onPixelSample,
  onCanvasRef,
}: P5CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const enabledRef = useRef(eyedropperEnabled);

  enabledRef.current = eyedropperEnabled;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabledRef.current) return;
      const canvas = containerRef.current?.querySelector("canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const data = samplePixel(canvas, x, y);
      onPixelSample(data);
    },
    [onPixelSample]
  );

  const handleMouseLeave = useCallback(() => {
    onPixelSample(null);
  }, [onPixelSample]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous
    if (p5Ref.current) {
      p5Ref.current.remove();
      p5Ref.current = null;
    }

    const instance = new p5(sketch.sketch, containerRef.current);
    p5Ref.current = instance;

    // Wait for canvas to be created
    const timer = setTimeout(() => {
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        onCanvasRef?.(canvas);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const canvas = containerRef.current?.querySelector("canvas");
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
      onCanvasRef?.(null);
    };
  }, [sketch.id]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block rounded-lg overflow-hidden border border-border ${
        eyedropperEnabled ? "cursor-crosshair" : ""
      }`}
    />
  );
}
