import { useState, useCallback, useEffect, useRef } from "react";
import P5Canvas from "@/components/P5Canvas";
import EyedropperOverlay from "@/components/EyedropperOverlay";
import SketchSelector from "@/components/SketchSelector";
import Toolbar from "@/components/Toolbar";
import Magnifier from "@/components/Magnifier";
import { sketches } from "@/lib/sketches";
import type { PixelData } from "@/lib/color-utils";
import { Crosshair } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const [activeSketchId, setActiveSketchId] = useState(sketches[0].id);
  const [eyedropperEnabled, setEyedropperEnabled] = useState(false);
  const [pixelData, setPixelData] = useState<PixelData | null>(null);
  const [normalized, setNormalized] = useState(true);
  const [lockedColor, setLockedColor] = useState<PixelData | null>(null);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeSketch = sketches.find((s) => s.id === activeSketchId) || sketches[0];

  const handlePixelSample = useCallback((data: PixelData | null) => {
    setPixelData(data);
    if (data) setMousePos({ x: data.x, y: data.y });
  }, []);

  const toggleEyedropper = useCallback(() => {
    setEyedropperEnabled((prev) => {
      if (prev) {
        setLockedColor(null);
        setPixelData(null);
      }
      return !prev;
    });
  }, []);

  const toggleLock = useCallback(() => {
    setLockedColor((prev) => (prev ? null : pixelData));
  }, [pixelData]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "d" || e.key === "D") toggleEyedropper();
      if (e.key === "l" || e.key === "L") toggleLock();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleEyedropper, toggleLock]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Crosshair className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold tracking-tight text-foreground">
                p5.js Eyedropper
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wide">
                Pixel color debugger for shaders & p5.strands
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Toolbar eyedropperEnabled={eyedropperEnabled} onToggle={toggleEyedropper} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <SketchSelector
            sketches={sketches}
            activeId={activeSketchId}
            onSelect={(id) => {
              setActiveSketchId(id);
              setLockedColor(null);
              setPixelData(null);
            }}
          />
          <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
            {activeSketch.description}
          </span>
        </div>

        <div className="relative flex justify-center bg-muted/30 rounded-xl border border-border p-6">
          <P5Canvas
            sketch={activeSketch}
            eyedropperEnabled={eyedropperEnabled}
            onPixelSample={handlePixelSample}
            onCanvasRef={setCanvasEl}
          />
          <EyedropperOverlay
            pixelData={pixelData}
            enabled={eyedropperEnabled}
            normalized={normalized}
            onToggleFormat={() => setNormalized((p) => !p)}
            lockedColor={lockedColor}
            onToggleLock={toggleLock}
            magnifier={
              <Magnifier
                canvas={canvasEl}
                enabled={eyedropperEnabled && (!!pixelData || !!lockedColor)}
                mouseX={lockedColor ? lockedColor.x : mousePos.x}
                mouseY={lockedColor ? lockedColor.y : mousePos.y}
              />
            }
          />
        </div>

        <div className="flex items-center gap-6 text-[10px] font-mono text-muted-foreground">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground mr-1">D</kbd>
            Toggle eyedropper
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground mr-1">L</kbd>
            Lock color
          </span>
          <span>
            Click format badge to switch between 0–1 and 0–255
          </span>
        </div>
      </main>
    </div>
  );
}
