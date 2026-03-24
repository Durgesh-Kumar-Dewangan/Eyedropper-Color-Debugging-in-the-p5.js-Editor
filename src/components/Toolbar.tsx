import { Crosshair, Eye, EyeOff } from "lucide-react";

interface ToolbarProps {
  eyedropperEnabled: boolean;
  onToggle: () => void;
}

export default function Toolbar({ eyedropperEnabled, onToggle }: ToolbarProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono border transition-all ${
        eyedropperEnabled
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
          : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
      }`}
    >
      {eyedropperEnabled ? (
        <>
          <Crosshair className="h-3.5 w-3.5" />
          Eyedropper ON
        </>
      ) : (
        <>
          <Eye className="h-3.5 w-3.5" />
          Eyedropper OFF
        </>
      )}
    </button>
  );
}
