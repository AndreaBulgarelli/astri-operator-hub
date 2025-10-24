import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type ComponentState = "STANDBY" | "OPERATIONAL" | "DEGRADED" | "SAFE" | "FAULT";

interface SCADAComponent {
  id: string;
  name: string;
  state: ComponentState;
  x: number;
  y: number;
}

export const StartupTab = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [components, setComponents] = useState<SCADAComponent[]>([
    { id: "ccs", name: "CCS", state: "STANDBY", x: 400, y: 250 },
    { id: "rm", name: "Resource Manager", state: "STANDBY", x: 400, y: 100 },
    
    // TCS components (9 telescopes in a circle)
    { id: "tcs-a1", name: "TCS-A1", state: "STANDBY", x: 300, y: 180 },
    { id: "tcs-a2", name: "TCS-A2", state: "STANDBY", x: 200, y: 220 },
    { id: "tcs-a3", name: "TCS-A3", state: "STANDBY", x: 150, y: 300 },
    { id: "tcs-a4", name: "TCS-A4", state: "STANDBY", x: 200, y: 380 },
    { id: "tcs-a5", name: "TCS-A5", state: "STANDBY", x: 300, y: 420 },
    { id: "tcs-a6", name: "TCS-A6", state: "STANDBY", x: 400, y: 450 },
    { id: "tcs-a7", name: "TCS-A7", state: "STANDBY", x: 500, y: 420 },
    { id: "tcs-a8", name: "TCS-A8", state: "STANDBY", x: 600, y: 380 },
    { id: "tcs-a9", name: "TCS-A9", state: "STANDBY", x: 650, y: 300 },
    
    // OOQS components
    { id: "ooqs-a1", name: "OOQS-A1", state: "STANDBY", x: 250, y: 150 },
    { id: "ooqs-a5", name: "OOQS-A5", state: "STANDBY", x: 350, y: 450 },
    { id: "ooqs-a9", name: "OOQS-A9", state: "STANDBY", x: 700, y: 300 },
    
    // ADAS components
    { id: "adas-a1", name: "ADAS-A1", state: "STANDBY", x: 300, y: 120 },
    { id: "adas-a5", name: "ADAS-A5", state: "STANDBY", x: 250, y: 450 },
    { id: "adas-a9", name: "ADAS-A9", state: "STANDBY", x: 700, y: 250 },
    
    // Collectors
    { id: "col1", name: "COL1", state: "STANDBY", x: 550, y: 100 },
    { id: "col2", name: "COL2", state: "STANDBY", x: 620, y: 180 },
    { id: "col3", name: "COL3", state: "STANDBY", x: 620, y: 250 },
  ]);

  const handleStartCCS = () => {
    setIsStarting(true);
    
    const stateSequence: ComponentState[] = ["STANDBY", "OPERATIONAL", "DEGRADED", "OPERATIONAL"];
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      
      if (step <= stateSequence.length) {
        setComponents(prev => prev.map(comp => ({
          ...comp,
          state: stateSequence[Math.min(step - 1, stateSequence.length - 1)]
        })));
      }
      
      if (step >= stateSequence.length) {
        clearInterval(interval);
        setIsStarting(false);
        toast({
          title: "CCS Started Successfully",
          description: "Central Control System is now operational",
        });
      }
    }, 1000);
  };

  const getStateColor = (state: ComponentState) => {
    switch (state) {
      case "OPERATIONAL": return "hsl(var(--telescope-ready))";
      case "STANDBY": return "hsl(var(--status-standby))";
      case "DEGRADED": return "hsl(var(--warning))";
      case "SAFE": return "hsl(var(--status-active))";
      case "FAULT": return "hsl(var(--telescope-error))";
      default: return "hsl(var(--muted))";
    }
  };

  const operationalCount = components.filter(c => c.state === "OPERATIONAL").length;
  const totalComponents = components.length;
  const progress = (operationalCount / totalComponents) * 100;

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      <Card className="control-panel p-6">
        <h2 className="text-xl font-semibold mb-6 text-primary">Central Control System Startup</h2>

        <div className="mb-6 space-y-4">
          <Button
            onClick={handleStartCCS}
            disabled={isStarting || components.some(c => c.state === "OPERATIONAL")}
            className="w-full gap-2"
            size="lg"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Starting CCS...
              </>
            ) : (
              <>
                <PlayCircle className="h-5 w-5" />
                Start Central Control System
              </>
            )}
          </Button>

          {/* Array Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Array Status</div>
              <div className="text-lg font-semibold text-primary">
                {progress === 100 ? "OPERATIONAL" : isStarting ? "STARTING" : "STANDBY"}
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Components Online</div>
              <div className="text-lg font-semibold text-foreground">
                {operationalCount} / {totalComponents}
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Telescopes</div>
              <div className="text-lg font-semibold text-foreground">
                {components.filter(c => c.id.startsWith("tcs-") && c.state === "OPERATIONAL").length} / 9
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Initialization</div>
              <div className="text-lg font-semibold text-foreground">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 overflow-auto">
          <svg width="800" height="500" className="mx-auto">
            {/* Draw connections from CCS to Resource Manager */}
            {(() => {
              const ccs = components.find(c => c.id === "ccs")!;
              const rm = components.find(c => c.id === "rm")!;
              return (
                <line
                  key="line-rm"
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

            {/* Draw connections from CCS to TCS */}
            {components
              .filter(c => c.id.startsWith("tcs-"))
              .map(comp => {
                const ccs = components.find(c => c.id === "ccs")!;
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

            {/* Draw connections from CCS to Collectors */}
            {components
              .filter(c => c.id.startsWith("col"))
              .map(comp => {
                const ccs = components.find(c => c.id === "ccs")!;
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
            {["a1", "a5", "a9"].map(tel => {
              const tcs = components.find(c => c.id === `tcs-${tel}`);
              const adas = components.find(c => c.id === `adas-${tel}`);
              const ooqs = components.find(c => c.id === `ooqs-${tel}`);
              
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
            {components.map(comp => (
              <g key={comp.id}>
                <circle
                  cx={comp.x}
                  cy={comp.y}
                  r={comp.id === "ccs" ? 35 : 25}
                  fill={getStateColor(comp.state)}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <text
                  x={comp.x}
                  y={comp.y}
                  fill="hsl(var(--background))"
                  fontSize={comp.id === "ccs" ? "12" : "10"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {comp.name}
                </text>
                <text
                  x={comp.x}
                  y={comp.y + (comp.id === "ccs" ? 50 : 40)}
                  fill="hsl(var(--foreground))"
                  fontSize="9"
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
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStateColor("SAFE") }} />
            <span className="text-xs">SAFE</span>
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
