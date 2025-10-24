import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DetailPanelProps {
  selectedSystem: string | null;
}

export const DetailPanel = ({ selectedSystem }: DetailPanelProps) => {
  if (!selectedSystem) {
    return (
      <Card className="control-panel p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a system to view details</p>
      </Card>
    );
  }

  const subsystems = [
    { name: "Mirror", status: "ready", icon: CheckCircle, color: "text-telescope-ready" },
    { name: "Camera", status: "ready", icon: CheckCircle, color: "text-telescope-ready" },
    { name: "Mount", status: "parked", icon: AlertTriangle, color: "text-warning" },
    { name: "Auxiliary", status: "ready", icon: CheckCircle, color: "text-telescope-ready" },
  ];

  const telemetry = [
    { name: "Temperature", value: 18.5, unit: "°C", min: -10, max: 40, current: 18.5 },
    { name: "Humidity", value: 45, unit: "%", min: 0, max: 100, current: 45 },
    { name: "Power", value: 2.3, unit: "kW", min: 0, max: 5, current: 2.3 },
  ];

  // L2 View - Circular subsystem visualization
  const renderL2View = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    const subsystemCount = subsystems.length;
    
    const getColor = (status: string) => {
      if (status === "ready") return "hsl(var(--telescope-ready))";
      if (status === "parked") return "hsl(var(--warning))";
      return "hsl(var(--telescope-error))";
    };

    return (
      <svg width="240" height="240" className="mx-auto">
        {/* Draw circle segments */}
        {subsystems.map((subsystem, index) => {
          const startAngle = (index * 360) / subsystemCount - 90;
          const endAngle = ((index + 1) * 360) / subsystemCount - 90;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);
          
          const largeArc = 360 / subsystemCount > 180 ? 1 : 0;
          
          const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          
          return (
            <g key={subsystem.name}>
              <path
                d={path}
                fill={getColor(subsystem.status)}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Label */}
              <text
                x={centerX + (radius + 30) * Math.cos((startRad + endRad) / 2)}
                y={centerY + (radius + 30) * Math.sin((startRad + endRad) / 2)}
                fill="hsl(var(--foreground))"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {subsystem.name}
              </text>
            </g>
          );
        })}
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r="30"
          fill="hsl(var(--background))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY}
          fill="hsl(var(--primary))"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {selectedSystem}
        </text>
      </svg>
    );
  };

  return (
    <Card className="control-panel p-6 h-full overflow-auto">
      <Tabs defaultValue="l1" className="h-full">
        <TabsList className="mb-4">
          <TabsTrigger value="l1">L1 View</TabsTrigger>
          <TabsTrigger value="l2">L2 View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="l1" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">{selectedSystem}</h2>
            <Badge variant="default" className="bg-telescope-ready">Operational</Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Subsystems Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {subsystems.map((subsystem) => {
                const Icon = subsystem.icon;
                return (
                  <div
                    key={subsystem.name}
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <Icon className={`h-4 w-4 ${subsystem.color}`} />
                    <div>
                      <p className="text-sm font-medium">{subsystem.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{subsystem.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Telemetry</h3>
            <div className="space-y-4">
              {telemetry.map((metric) => {
                const percentage = ((metric.current - metric.min) / (metric.max - metric.min)) * 100;
                return (
                  <div key={metric.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{metric.name}</span>
                      <span className="text-sm font-mono">
                        {metric.value} {metric.unit}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="l2" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">{selectedSystem} - L2 View</h2>
            <Badge variant="outline" className="text-xs">Subsystem Status Overview</Badge>
          </div>

          <div className="flex flex-col items-center justify-center">
            {renderL2View()}
            
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              {subsystems.map((subsystem) => {
                const Icon = subsystem.icon;
                return (
                  <div
                    key={subsystem.name}
                    className="flex items-center gap-2 p-2 rounded bg-secondary/30"
                  >
                    <Icon className={`h-4 w-4 ${subsystem.color}`} />
                    <div className="text-xs">
                      <p className="font-medium">{subsystem.name}</p>
                      <p className="text-muted-foreground capitalize">{subsystem.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
