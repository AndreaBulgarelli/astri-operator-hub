import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

  return (
    <Card className="control-panel p-6 h-full overflow-auto">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">{selectedSystem} Details</h3>
            <Badge className="bg-status-online">OPERATIONAL</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Subsystem status and telemetry data
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Mirror</div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-online w-2 h-2"></div>
              <span className="text-sm">Ready</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Camera</div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-online w-2 h-2"></div>
              <span className="text-sm">Ready</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Mount</div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-online w-2 h-2"></div>
              <span className="text-sm">Parked</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Auxiliary</div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-online w-2 h-2"></div>
              <span className="text-sm">Ready</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Temperature</span>
              <span className="font-mono">23.5°C</span>
            </div>
            <Progress value={47} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Humidity</span>
              <span className="font-mono">45%</span>
            </div>
            <Progress value={45} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Power</span>
              <span className="font-mono">2.3 kW</span>
            </div>
            <Progress value={68} className="h-1" />
          </div>
        </div>
      </div>
    </Card>
  );
};
