import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TelescopeArray } from "./TelescopeArray";
import { SiteServices } from "./SiteServices";

interface HierarchicalViewProps {
  onSelectSystem: (system: string) => void;
  selectedSystem: string | null;
}

export const HierarchicalView = ({ onSelectSystem, selectedSystem }: HierarchicalViewProps) => {
  // Array overall status visualization
  const renderArrayStatus = () => {
    const arrayStatus = [
      { name: "Telescopes", status: "Operational", value: 8 },
      { name: "Site Services", status: "Operational", value: 2 },
      { name: "Network", status: "Operational", value: 1 },
      { name: "Power", status: "Degraded", value: 1 },
    ];

    const centerX = 100;
    const centerY = 100;
    const radius = 70;
    const totalSegments = arrayStatus.length;

    const getColor = (status: string) => {
      if (status === "Operational") return "hsl(var(--status-online))";
      if (status === "Initialised") return "hsl(var(--status-initialised))";
      if (status === "Degraded") return "hsl(var(--status-warning))";
      if (status === "Fault") return "hsl(var(--status-error))";
      if (status === "Safe") return "hsl(var(--status-active))";
      if (status === "Standby") return "hsl(var(--status-standby))";
      if (status === "Eng") return "hsl(var(--primary))";
      return "hsl(var(--status-offline))";
    };

    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200">
          {arrayStatus.map((segment, index) => {
            const startAngle = (index * 360) / totalSegments - 90;
            const endAngle = ((index + 1) * 360) / totalSegments - 90;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const largeArc = 360 / totalSegments > 180 ? 1 : 0;
            const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <path
                key={segment.name}
                d={path}
                fill={getColor(segment.status)}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                opacity="0.85"
              />
            );
          })}
          <circle
            cx={centerX}
            cy={centerY}
            r="35"
            fill="hsl(var(--background))"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY - 5}
            fill="hsl(var(--primary))"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            ASTRI
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            fill="hsl(var(--foreground))"
            fontSize="12"
            textAnchor="middle"
          >
            Array
          </text>
        </svg>
        <div className="mt-2 space-y-1 text-xs">
          {arrayStatus.map(segment => (
            <div key={segment.name} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{segment.name}:</span>
              <span className="font-mono">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Array Status</h2>
          <Badge variant="outline" className="text-xs">L1 View</Badge>
        </div>

        <Card className="control-panel p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Observing Systems</h3>
            <TelescopeArray onSelectTelescope={onSelectSystem} selectedTelescope={selectedSystem} />
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Site Services</h3>
            <SiteServices onSelectService={onSelectSystem} selectedService={selectedSystem} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center text-xs border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-offline" />
              <span>Off</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-standby" />
              <span>Standby</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-initialised" />
              <span>Initialised</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-online" />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-warning" />
              <span>Degraded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-error" />
              <span>Fault</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
