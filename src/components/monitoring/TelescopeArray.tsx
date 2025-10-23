import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TelescopeArrayProps {
  onSelectTelescope: (telescope: string) => void;
  selectedTelescope: string | null;
}

const telescopes = [
  { id: "A1", status: "ready", x: 230, y: 80 },
  { id: "A2", status: "ready", x: 180, y: 130 },
  { id: "A3", status: "ready", x: 180, y: 200 },
  { id: "A4", status: "busy", x: 230, y: 250 },
  { id: "A5", status: "ready", x: 300, y: 280 },
  { id: "A6", status: "ready", x: 370, y: 250 },
  { id: "A7", status: "ready", x: 370, y: 180 },
  { id: "A8", status: "ready", x: 420, y: 130 },
  { id: "A9", status: "ready", x: 300, y: 100 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "ready": return "bg-telescope-ready";
    case "busy": return "bg-telescope-busy";
    case "error": return "bg-telescope-error";
    default: return "bg-telescope-idle";
  }
};

export const TelescopeArray = ({ onSelectTelescope, selectedTelescope }: TelescopeArrayProps) => {
  return (
    <div className="relative w-full h-96 bg-secondary/30 rounded-lg border border-border">
      {/* Array circle background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-border/40"></div>

      {/* Telescopes */}
      {telescopes.map((telescope) => (
        <button
          key={telescope.id}
          onClick={() => onSelectTelescope(telescope.id)}
          className={cn(
            "absolute w-14 h-14 rounded-full border-2 transition-all duration-200",
            "flex items-center justify-center font-semibold text-sm",
            "hover:scale-110 hover:shadow-lg",
            selectedTelescope === telescope.id ? "ring-4 ring-primary scale-110" : "",
            getStatusColor(telescope.status),
            telescope.status === "ready" ? "border-telescope-ready/50" : "border-telescope-busy/50"
          )}
          style={{
            left: `${telescope.x}px`,
            top: `${telescope.y}px`,
          }}
        >
          {telescope.id}
        </button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-card/80 p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-telescope-ready"></div>
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-telescope-busy"></div>
          <span>Busy</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-telescope-error"></div>
          <span>Error</span>
        </div>
      </div>
    </div>
  );
};
