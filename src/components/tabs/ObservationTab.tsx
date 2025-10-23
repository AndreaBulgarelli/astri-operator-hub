import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { OOQSPanel } from "@/components/observation/OOQSPanel";

export const ObservationTab = () => {
  return (
    <div className="h-full p-6 space-y-6">
      <Card className="control-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary">Current Observation</h2>
            <p className="text-sm text-muted-foreground">SB.05 - OB.1 Running</p>
          </div>
          <Badge className="bg-status-active">OBSERVING</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Observation Progress</div>
            <div className="flex items-center gap-2">
              <Progress value={75} className="flex-1" />
              <span className="text-sm font-mono">75%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Active Telescopes</div>
            <div className="text-2xl font-bold text-primary">9/9</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Data Rate</div>
            <div className="text-2xl font-bold text-primary">2.3 GB/s</div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="ooqs" className="flex-1">
        <TabsList className="bg-secondary">
          <TabsTrigger value="ooqs">OOQS</TabsTrigger>
          <TabsTrigger value="summary">Array Summary</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="ooqs" className="mt-4">
          <OOQSPanel />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="control-panel p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Array Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">A{i + 1}</span>
                    <Badge className="bg-telescope-ready text-xs">Ready</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Events: {1000 + i * 100}</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card className="control-panel p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">Event Log</h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-secondary/30 rounded">21:31:45 - OB.1 Phase start_taking_data ended</div>
              <div className="p-2 bg-secondary/30 rounded">21:31:31 - OB.1 Phase configure ended</div>
              <div className="p-2 bg-secondary/30 rounded">21:31:31 - SB.05 Started</div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
