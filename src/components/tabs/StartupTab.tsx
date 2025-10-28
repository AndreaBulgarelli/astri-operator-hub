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
    // Kubernetes Services (left side)
    { id: "kafka", name: "Kafka", state: "OFF", x: 80, y: 80, subsystem: "kubernetes" },
    { id: "scdb", name: "SCDB", state: "OFF", x: 80, y: 160, subsystem: "kubernetes" },
    { id: "cassandra", name: "Cassandra", state: "OFF", x: 80, y: 240, subsystem: "kubernetes" },
    { id: "mysql", name: "MySQL", state: "OFF", x: 80, y: 320, subsystem: "kubernetes" },

    // Core SCADA Systems
    { id: "ccs", name: "CCS", state: "OFF", x: 500, y: 300, subsystem: "core" },
    { id: "rm", name: "RM", state: "OFF", x: 500, y: 200, subsystem: "core" },
    { id: "scc", name: "SCC", state: "OFF", x: 350, y: 300, subsystem: "scada" },
    { id: "monitoring", name: "MON", state: "OFF", x: 280, y: 100, subsystem: "scada" },
    { id: "logging", name: "LOG", state: "OFF", x: 380, y: 80, subsystem: "scada" },
    { id: "alarm", name: "ALARM", state: "OFF", x: 480, y: 80, subsystem: "scada" },
    { id: "hmi", name: "HMI", state: "OFF", x: 580, y: 100, subsystem: "scada" },
    { id: "accs", name: "ACCS", state: "OFF", x: 620, y: 200, subsystem: "scada" },
    { id: "ict", name: "ICTC", state: "OFF", x: 650, y: 300, subsystem: "scada" },

    // ACS Manager
    { id: "acs", name: "ACS Mgr", state: "OFF", x: 700, y: 340, subsystem: "acs" },

    // Collectors
    { id: "atmos-col", name: "Atmos Col", state: "OFF", x: 620, y: 380, subsystem: "collector" },
    { id: "array-col", name: "Array Col", state: "OFF", x: 700, y: 420, subsystem: "collector" },
    { id: "tsc-col", name: "TSC Col", state: "OFF", x: 700, y: 500, subsystem: "collector" },
    { id: "ems-col", name: "EMS Col", state: "OFF", x: 620, y: 540, subsystem: "collector" },
    { id: "ict-col", name: "ICT Col", state: "OFF", x: 540, y: 580, subsystem: "collector" },
    { id: "power-col", name: "Power Col", state: "OFF", x: 460, y: 580, subsystem: "collector" },
    { id: "safety-col", name: "Safety Col", state: "OFF", x: 380, y: 540, subsystem: "collector" },

    // TCS components (9 telescopes)
    { id: "tcs-1", name: "TCS-1", state: "OFF", x: 300, y: 420, subsystem: "tcs" },
    { id: "tcs-2", name: "TCS-2", state: "OFF", x: 400, y: 450, subsystem: "tcs" },
    { id: "tcs-3", name: "TCS-3", state: "OFF", x: 500, y: 470, subsystem: "tcs" },
    { id: "tcs-4", name: "TCS-4", state: "OFF", x: 300, y: 500, subsystem: "tcs" },
    { id: "tcs-5", name: "TCS-5", state: "OFF", x: 400, y: 530, subsystem: "tcs" },
    { id: "tcs-6", name: "TCS-6", state: "OFF", x: 500, y: 550, subsystem: "tcs" },
    { id: "tcs-7", name: "TCS-7", state: "OFF", x: 300, y: 580, subsystem: "tcs" },
    { id: "tcs-8", name: "TCS-8", state: "OFF", x: 400, y: 610, subsystem: "tcs" },
    { id: "tcs-9", name: "TCS-9", state: "OFF", x: 500, y: 630, subsystem: "tcs" },

    // ADAS components (9)
    { id: "adas-1", name: "ADAS-1", state: "OFF", x: 250, y: 440, subsystem: "adas" },
    { id: "adas-2", name: "ADAS-2", state: "OFF", x: 350, y: 470, subsystem: "adas" },
    { id: "adas-3", name: "ADAS-3", state: "OFF", x: 450, y: 490, subsystem: "adas" },
    { id: "adas-4", name: "ADAS-4", state: "OFF", x: 250, y: 520, subsystem: "adas" },
    { id: "adas-5", name: "ADAS-5", state: "OFF", x: 350, y: 550, subsystem: "adas" },
    { id: "adas-6", name: "ADAS-6", state: "OFF", x: 450, y: 570, subsystem: "adas" },
    { id: "adas-7", name: "ADAS-7", state: "OFF", x: 250, y: 600, subsystem: "adas" },
    { id: "adas-8", name: "ADAS-8", state: "OFF", x: 350, y: 630, subsystem: "adas" },
    { id: "adas-9", name: "ADAS-9", state: "OFF", x: 450, y: 650, subsystem: "adas" },

    // OOQS components (9)
    { id: "ooqs-1", name: "OOQS-1", state: "OFF", x: 200, y: 460, subsystem: "ooqs" },
    { id: "ooqs-2", name: "OOQS-2", state: "OFF", x: 300, y: 490, subsystem: "ooqs" },
    { id: "ooqs-3", name: "OOQS-3", state: "OFF", x: 400, y: 510, subsystem: "ooqs" },
    { id: "ooqs-4", name: "OOQS-4", state: "OFF", x: 200, y: 540, subsystem: "ooqs" },
    { id: "ooqs-5", name: "OOQS-5", state: "OFF", x: 300, y: 570, subsystem: "ooqs" },
    { id: "ooqs-6", name: "OOQS-6", state: "OFF", x: 400, y: 590, subsystem: "ooqs" },
    { id: "ooqs-7", name: "OOQS-7", state: "OFF", x: 200, y: 620, subsystem: "ooqs" },
    { id: "ooqs-8", name: "OOQS-8", state: "OFF", x: 300, y: 650, subsystem: "ooqs" },
    { id: "ooqs-9", name: "OOQS-9", state: "OFF", x: 400, y: 670, subsystem: "ooqs" },
  ]);

  const startupSteps = [
    { name: "Kubernetes Services", subsystems: ["kafka", "scdb", "cassandra", "mysql"] },
    { name: "Central Control", subsystems: ["ccs", "rm", "scc"] },
    { name: "SCADA Systems", subsystems: ["monitoring", "logging", "alarm", "hmi", "accs", "ict"] },
    {
      name: "Telescope Control Systems",
      subsystems: ["tcs-1", "tcs-2", "tcs-3", "tcs-4", "tcs-5", "tcs-6", "tcs-7", "tcs-8", "tcs-9"],
    },
    {
      name: "ADAS Systems",
      subsystems: ["adas-1", "adas-2", "adas-3", "adas-4", "adas-5", "adas-6", "adas-7", "adas-8", "adas-9"],
    },
    {
      name: "OOQS Pipelines",
      subsystems: ["ooqs-1", "ooqs-2", "ooqs-3", "ooqs-4", "ooqs-5", "ooqs-6", "ooqs-7", "ooqs-8", "ooqs-9"],
    },
    {
      name: "Collectors",
      subsystems: ["atmos-col", "array-col", "tsc-col", "ems-col", "ict-col", "power-col", "safety-col"],
    },
    { name: "ACS Manager", subsystems: ["acs"] },
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
          <svg width="800" height="720" className="mx-auto">
            {/* SCC to CCS */}
            {(() => {
              const ccs = components.find((c) => c.id === "ccs");
              const scc = components.find((c) => c.id === "scc");
              if (!ccs || !scc) return null;
              return (
                <line
                  x1={scc.x}
                  y1={scc.y}
                  x2={ccs.x}
                  y2={ccs.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  opacity="0.6"
                />
              );
            })()}

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
              .filter((c) => ["monitoring", "logging", "alarm", "hmi", "accs", "ict"].includes(c.id))
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

            {/* Draw TCS -> ADAS -> OOQS chains for all 9 telescopes */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
              const tcs = components.find((c) => c.id === `tcs-${num}`);
              const adas = components.find((c) => c.id === `adas-${num}`);
              const ooqs = components.find((c) => c.id === `ooqs-${num}`);

              if (!tcs || !adas || !ooqs) return null;

              return (
                <g key={`chain-${num}`}>
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
