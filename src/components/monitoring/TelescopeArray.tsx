import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TelescopeArrayProps {
  onSelectTelescope: (telescope: string) => void;
  selectedTelescope: string | null;
}

const telescopes = [
  { id: "A1", status: "Operational", x: 230, y: 80 },
  { id: "A2", status: "Operational", x: 180, y: 130 },
  { id: "A3", status: "Operational", x: 180, y: 200 },
  { id: "A4", status: "Operational", x: 230, y: 250 },
  { id: "A5", status: "Safe", x: 300, y: 280 },
  { id: "A6", status: "Operational", x: 370, y: 250 },
  { id: "A7", status: "Fault", x: 370, y: 180 },
  { id: "A8", status: "Operational", x: 420, y: 130 },
  { id: "A9", status: "Operational", x: 300, y: 100 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Operational": return "bg-status-online";
    case "Safe": return "bg-status-warning";
    case "Fault": return "bg-status-error";
    case "Degraded": return "bg-status-warning";
    case "Off": return "bg-status-offline";
    case "Standby": return "bg-secondary";
    case "Initialised": return "bg-status-active";
    case "Eng": return "bg-primary";
    default: return "bg-secondary";
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
            "border-border"
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
          <div className="w-3 h-3 rounded-full bg-status-online"></div>
          <span>Operational</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-status-warning"></div>
          <span>Safe</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-status-error"></div>
          <span>Fault</span>
        </div>
      </div>
    </div>
  );
};
