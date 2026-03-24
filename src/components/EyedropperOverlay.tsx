import type { PixelData } from "@/lib/color-utils";
import { formatValue, rgbaToHex } from "@/lib/color-utils";
import { Copy, Lock, Unlock } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

interface EyedropperOverlayProps {
  pixelData: PixelData | null;
  enabled: boolean;
  normalized: boolean;
  onToggleFormat: () => void;
  lockedColor: PixelData | null;
  onToggleLock: () => void;
  magnifier?: ReactNode;
}

function ChannelRow({
  label,
  value,
  normalized,
  colorClass,
}: {
  label: string;
  value: number;
  normalized: boolean;
  colorClass: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`font-mono text-xs font-semibold ${colorClass}`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-75 ${colorClass.replace("text-", "bg-")}`}
            style={{ width: `${(value / 255) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums w-14 text-right text-foreground">
          {formatValue(value, normalized)}
        </span>
      </div>
    </div>
  );
}

export default function EyedropperOverlay({
  pixelData,
  enabled,
  normalized,
  onToggleFormat,
  lockedColor,
  onToggleLock,
  magnifier,
}: EyedropperOverlayProps) {
  const data = lockedColor || pixelData;
  const [copied, setCopied] = useState(false);

  if (!enabled) return null;

  const copyToClipboard = () => {
    if (!data) return;
    const text = normalized
      ? `rgba(${formatValue(data.r, true)}, ${formatValue(data.g, true)}, ${formatValue(data.b, true)}, ${formatValue(data.a, true)})`
      : `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="absolute top-4 right-4 z-50 w-64 rounded-lg border border-border bg-card/95 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Eyedropper
        </span>
        <div className="flex gap-1">
          <button
            onClick={onToggleFormat}
            className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            {normalized ? "0–1" : "0–255"}
          </button>
          <button
            onClick={onToggleLock}
            className="p-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            {lockedColor ? (
              <Lock className="h-3 w-3 text-primary" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
          </button>
          <button
            onClick={copyToClipboard}
            className="p-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>

      {data ? (
        <div className="p-3 space-y-3">
          {/* Color preview + hex */}
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-md border border-border shadow-inner flex-shrink-0"
              style={{
                backgroundColor: `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a / 255})`,
              }}
            />
            <div>
              <div className="font-mono text-sm font-semibold text-foreground">
                {rgbaToHex(data.r, data.g, data.b)}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                ({data.x}, {data.y})
              </div>
            </div>
          </div>

          {/* Channel bars */}
          <div className="space-y-1.5">
            <ChannelRow label="R" value={data.r} normalized={normalized} colorClass="text-channel-r" />
            <ChannelRow label="G" value={data.g} normalized={normalized} colorClass="text-channel-g" />
            <ChannelRow label="B" value={data.b} normalized={normalized} colorClass="text-channel-b" />
            <ChannelRow label="A" value={data.a} normalized={normalized} colorClass="text-channel-a" />
          </div>

          {/* Magnifier */}
          {magnifier && <div className="pt-1 border-t border-border">{magnifier}</div>}
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-muted-foreground font-mono">
          Hover over canvas to sample
        </div>
      )}

      {/* Footer hint */}
      <div className="px-3 py-1.5 border-t border-border">
        <span className="text-[9px] font-mono text-muted-foreground">
          Press <kbd className="px-1 py-0.5 rounded bg-muted text-foreground">D</kbd> to toggle
          {" · "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-foreground">L</kbd> to lock
        </span>
      </div>
    </div>
  );
}
