import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type ComponentState = "OFF" | "STANDBY" | "OPERATIONAL" | "DEGRADED" | "SAFE" | "FAULT";

interface SCADAComponent {
  id: string;
  name: string;
  state: ComponentState;
  x: number;
  y: number;
  subsystem?: string;
}

export const StartupTab = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [components, setComponents] = useState<SCADAComponent[]>([
    // Core SCADA Systems
    { id: "ccs", name: "CCS", state: "OFF", x: 400, y: 300, subsystem: "core" },
    { id: "rm", name: "RM", state: "OFF", x: 400, y: 200, subsystem: "core" },
    { id: "monitoring", name: "Monitoring", state: "OFF", x: 250, y: 100, subsystem: "scada" },
    { id: "logging", name: "Logging", state: "OFF", x: 350, y: 80, subsystem: "scada" },
    { id: "alarm", name: "Alarm", state: "OFF", x: 450, y: 80, subsystem: "scada" },
    { id: "ooqs-sys", name: "OOQS", state: "OFF", x: 550, y: 100, subsystem: "scada" },
    { id: "hmi", name: "HMI", state: "OFF", x: 300, y: 200, subsystem: "scada" },

    // ACS Manager
    { id: "acs", name: "ACS Mgr", state: "OFF", x: 500, y: 200, subsystem: "acs" },

    // TCS components (9 telescopes)
    { id: "tcs-a1", name: "TCS-1", state: "OFF", x: 150, y: 350, subsystem: "tcs" },
    { id: "tcs-a2", name: "TCS-2", state: "OFF", x: 180, y: 350, subsystem: "tcs" },
    { id: "tcs-a3", name: "TCS-3", state: "OFF", x: 210, y: 350, subsystem: "tcs" },
    { id: "tcs-a4", name: "TCS-4", state: "OFF", x: 250, y: 350, subsystem: "tcs" },
    { id: "tcs-a5", name: "TCS-5", state: "OFF", x: 350, y: 350, subsystem: "tcs" },
    { id: "tcs-a6", name: "TCS-6", state: "OFF", x: 450, y: 350, subsystem: "tcs" },
    { id: "tcs-a7", name: "TCS-7", state: "OFF", x: 550, y: 350, subsystem: "tcs" },
    { id: "tcs-a8", name: "TCS-8", state: "OFF", x: 620, y: 350, subsystem: "tcs" },
    { id: "tcs-a9", name: "TCS-9", state: "OFF", x: 620, y: 350, subsystem: "tcs" },

    // ADAS components
    { id: "adas-a1", name: "ADAS-1", state: "OFF", x: 150, y: 400, subsystem: "adas" },
    { id: "adas-a2", name: "ADAS-2", state: "OFF", x: 200, y: 400, subsystem: "adas" },
    { id: "adas-a3", name: "ADAS-3", state: "OFF", x: 200, y: 400, subsystem: "adas" },
    { id: "adas-a4", name: "ADAS-4", state: "OFF", x: 200, y: 400, subsystem: "adas" },
    { id: "adas-a5", name: "ADAS-5", state: "OFF", x: 300, y: 400, subsystem: "adas" },
    { id: "adas-a6", name: "ADAS-6", state: "OFF", x: 200, y: 400, subsystem: "adas" },
    { id: "adas-a7", name: "ADAS-7", state: "OFF", x: 200, y: 400, subsystem: "adas" },
    { id: "adas-a8", name: "ADAS-8", state: "OFF", x: 200, y: 400, subsystem: "adas" },
    { id: "adas-a9", name: "ADAS-9", state: "OFF", x: 670, y: 400, subsystem: "adas" },

    // OOQS components
    { id: "ooqs-a1", name: "OOQS-1", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a2", name: "OOQS-2", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a3", name: "OOQS-3", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a4", name: "OOQS-4", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a5", name: "OOQS-5", state: "OFF", x: 300, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a6", name: "OOQS-6", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a7", name: "OOQS-7", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a8", name: "OOQS-8", state: "OFF", x: 200, y: 500, subsystem: "ooqs" },
    { id: "ooqs-a9", name: "OOQS-9", state: "OFF", x: 670, y: 500, subsystem: "ooqs" },

    // Collectors
    { id: "tsc-col", name: "TSCC", state: "OFF", x: 550, y: 350, subsystem: "collector" },
    { id: "ems-col", name: "EMSC", state: "OFF", x: 650, y: 300, subsystem: "collector" },
    { id: "ict-col", name: "ICTC", state: "OFF", x: 700, y: 350, subsystem: "collector" },
  ]);

  const startupSteps = [
    { name: "Central Control", subsystems: ["ccs", "rm"] },
    {
      name: "Telescope Control System",
      subsystems: ["tcs-a1", "tcs-a2", "tcs-a3", "tcs-a4", "tcs-a5", "tcs-a6", "tcs-a7", "tcs-a8", "tcs-a9"],
    },
    {
      name: "ADAS Systems",
      subsystems: ["adas-a1", "adas-a2", "adas-a3", "adas-a4", "adas-a5", "adas-a6", "adas-a7", "adas-a8", "adas-a9"],
    },
    { name: "OOQS Pipelines", subsystems: ["ooqs-a1", "ooqs-a5", "ooqs-a9"] },
    { name: "Collectors", subsystems: ["tsc-col", "ems-col", "ict-col"] },
  ];

  const handleStartCCS = () => {
    setIsStarting(true);
    setCurrentStep(0);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < startupSteps.length) {
        const currentStepData = startupSteps[stepIndex];

        setComponents((prev) =>
          prev.map((comp) => {
            if (currentStepData.subsystems.includes(comp.id)) {
              return { ...comp, state: "OPERATIONAL" };
            }
            return comp;
          }),
        );

        setCurrentStep(stepIndex + 1);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsStarting(false);
        toast({
          title: "CCS Started Successfully",
          description: "All SCADA subsystems are now operational",
        });
      }
    }, 800);
  };

  const getStateColor = (state: ComponentState) => {
    switch (state) {
      case "OPERATIONAL":
        return "hsl(var(--telescope-ready))";
      case "STANDBY":
        return "hsl(var(--status-standby))";
      case "DEGRADED":
        return "hsl(var(--warning))";
      case "SAFE":
        return "hsl(var(--status-active))";
      case "FAULT":
        return "hsl(var(--telescope-error))";
      case "OFF":
        return "hsl(var(--muted))";
      default:
        return "hsl(var(--muted))";
    }
  };

  const operationalCount = components.filter((c) => c.state === "OPERATIONAL").length;
  const totalComponents = components.length;
  const progress = (operationalCount / totalComponents) * 100;

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      <Card className="control-panel p-6">
        <h2 className="text-xl font-semibold mb-6 text-primary">SCADA System Startup - UC 9.1.0.0-020</h2>

        <div className="mb-6 space-y-4">
          <Button
            onClick={handleStartCCS}
            disabled={isStarting || components.some((c) => c.state === "OPERATIONAL")}
            className="w-full gap-2"
            size="lg"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting SCADA System... ({currentStep}/{startupSteps.length})
              </>
            ) : (
              <>
                <PlayCircle className="h-5 w-5" />
                Start SCADA System
              </>
            )}
          </Button>

          {/* Startup Progress */}
          {isStarting && currentStep > 0 && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="text-sm font-medium text-primary mb-2">
                Current Step: {startupSteps[currentStep - 1]?.name}
              </div>
              <div className="space-y-1">
                {startupSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${idx < currentStep ? "bg-telescope-ready" : "bg-muted"}`} />
                    <span className={idx < currentStep ? "text-foreground" : "text-muted-foreground"}>{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">SCADA Status</div>
              <div className="text-lg font-semibold text-primary">
                {progress === 100 ? "OPERATIONAL" : isStarting ? "STARTING" : "OFF"}
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Subsystems Online</div>
              <div className="text-lg font-semibold text-foreground">
                {operationalCount} / {totalComponents}
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">TCS Systems</div>
              <div className="text-lg font-semibold text-foreground">
                {components.filter((c) => c.subsystem === "tcs" && c.state === "OPERATIONAL").length} / 9
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <div className="text-lg font-semibold text-foreground">{Math.round(progress)}%</div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 overflow-auto">
          <svg width="800" height="650" className="mx-auto">
            {/* CCS to RM */}
            {(() => {
              const ccs = components.find((c) => c.id === "ccs");
              const rm = components.find((c) => c.id === "rm");
              if (!ccs || !rm) return null;
              return (
                <line
                  x1={ccs.x}
                  y1={ccs.y}
                  x2={rm.x}
                  y2={rm.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  opacity="0.6"
                />
              );
            })()}

            {/* SCADA subsystems to CCS */}
            {components
              .filter((c) => ["monitoring", "logging", "alarm", "ooqs-sys", "hmi", "acs"].includes(c.id))
              .map((comp) => {
                const ccs = components.find((c) => c.id === "ccs");
                if (!ccs) return null;
                return (
                  <line
                    key={`line-${comp.id}`}
                    x1={ccs.x}
                    y1={ccs.y}
                    x2={comp.x}
                    y2={comp.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="4"
                    opacity="0.3"
                  />
                );
              })}

            {/* CCS to TCS */}
            {components
              .filter((c) => c.subsystem === "tcs")
              .map((comp) => {
                const ccs = components.find((c) => c.id === "ccs");
                if (!ccs) return null;
                return (
                  <line
                    key={`line-${comp.id}`}
                    x1={ccs.x}
                    y1={ccs.y}
                    x2={comp.x}
                    y2={comp.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="4"
                    opacity="0.3"
                  />
                );
              })}

            {/* CCS to Collectors */}
            {components
              .filter((c) => c.subsystem === "collector")
              .map((comp) => {
                const ccs = components.find((c) => c.id === "ccs");
                if (!ccs) return null;
                return (
                  <line
                    key={`line-${comp.id}`}
                    x1={ccs.x}
                    y1={ccs.y}
                    x2={comp.x}
                    y2={comp.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="4"
                    opacity="0.3"
                  />
                );
              })}

            {/* Draw TCS -> ADAS -> OOQS chains for A1, A5, A9 */}
            {["a1", "a5", "a9"].map((tel) => {
              const tcs = components.find((c) => c.id === `tcs-${tel}`);
              const adas = components.find((c) => c.id === `adas-${tel}`);
              const ooqs = components.find((c) => c.id === `ooqs-${tel}`);

              if (!tcs || !adas || !ooqs) return null;

              return (
                <g key={`chain-${tel}`}>
                  {/* TCS -> ADAS */}
                  <line
                    x1={tcs.x}
                    y1={tcs.y}
                    x2={adas.x}
                    y2={adas.y}
                    stroke="hsl(var(--telescope-ready))"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  {/* ADAS -> OOQS */}
                  <line
                    x1={adas.x}
                    y1={adas.y}
                    x2={ooqs.x}
                    y2={ooqs.y}
                    stroke="hsl(var(--telescope-ready))"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </g>
              );
            })}

            {/* Draw component nodes */}
            {components.map((comp) => (
              <g key={comp.id}>
                <circle
                  cx={comp.x}
                  cy={comp.y}
                  r={comp.subsystem === "core" ? 30 : comp.subsystem === "scada" ? 22 : 20}
                  fill={getStateColor(comp.state)}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <text
                  x={comp.x}
                  y={comp.y}
                  fill="hsl(var(--background))"
                  fontSize={comp.subsystem === "core" ? "11" : "9"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {comp.name}
                </text>
                <text
                  x={comp.x}
                  y={comp.y + (comp.subsystem === "core" ? 45 : 35)}
                  fill="hsl(var(--foreground))"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {comp.state}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-4 flex gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStateColor("OFF") }} />
            <span className="text-xs">OFF</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStateColor("STANDBY") }} />
            <span className="text-xs">STANDBY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStateColor("OPERATIONAL") }} />
            <span className="text-xs">OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStateColor("DEGRADED") }} />
            <span className="text-xs">DEGRADED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStateColor("FAULT") }} />
            <span className="text-xs">FAULT</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
