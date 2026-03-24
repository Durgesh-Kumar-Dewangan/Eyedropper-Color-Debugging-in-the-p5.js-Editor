import type { SketchDef } from "@/lib/sketches";

interface SketchSelectorProps {
  sketches: SketchDef[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function SketchSelector({
  sketches,
  activeId,
  onSelect,
}: SketchSelectorProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {sketches.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
            activeId === s.id
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
              : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
          }`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
