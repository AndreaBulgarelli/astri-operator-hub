import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface RunningPlanTabProps {
  planData: any;
}

export const RunningPlanTab = ({ planData }: RunningPlanTabProps) => {
  const [selectedSB, setSelectedSB] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded": return "bg-success";
      case "running": return "bg-status-active";
      case "pending": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const selectedSBData = selectedSB 
    ? planData.schedulingBlocks.find((sb: any) => sb.id === selectedSB)
    : null;

  return (
    <div className="h-full p-6 space-y-4">
      <Card className="control-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-primary">{planData.name}</h2>
            <p className="text-sm text-muted-foreground">{planData.id}</p>
          </div>
          <Badge className="bg-status-active">RUNNING</Badge>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Scheduling Blocks */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduling Blocks</label>
            <ScrollArea className="h-[500px] border rounded-lg p-3">
              {planData.schedulingBlocks.map((sb: any) => (
                <div 
                  key={sb.id} 
                  className={`mb-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSB === sb.id 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'bg-secondary/50 border border-border hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedSB(sb.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{sb.id}</span>
                      <Badge className={getStatusColor(sb.status)} variant="outline">{sb.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={sb.progress} className="flex-1 h-2" />
                    <span className="text-xs font-mono">{sb.progress}%</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Middle: SB Metadata */}
          <div className="space-y-2">
            <label className="text-sm font-medium">SB Metadata</label>
            <div className="h-[500px] border rounded-lg p-4">
              {selectedSBData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">{selectedSBData.id}</h3>
                    <Badge className={getStatusColor(selectedSBData.status)} variant="outline">
                      {selectedSBData.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{selectedSBData.progress}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Total OBs:</span>
                      <span className="font-medium">{selectedSBData.observationBlocks.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Completed OBs:</span>
                      <span className="font-medium">
                        {selectedSBData.observationBlocks.filter((ob: any) => ob.status === "succeeded").length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Running OBs:</span>
                      <span className="font-medium">
                        {selectedSBData.observationBlocks.filter((ob: any) => ob.status === "running").length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="font-medium">High</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Target Type:</span>
                      <span className="font-medium">Galaxy</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a Scheduling Block to view metadata
                </div>
              )}
            </div>
          </div>

          {/* Right: Observation Blocks */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Observation Blocks</label>
            <ScrollArea className="h-[500px] border rounded-lg p-3">
              {planData.schedulingBlocks.map((sb: any) => (
                <div key={sb.id} className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">{sb.id}</div>
                  <div className="space-y-2">
                    {sb.observationBlocks.map((ob: any) => (
                      <div
                        key={ob.id}
                        className="p-3 rounded-lg bg-card border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{ob.id}</Badge>
                            <span className="text-sm font-medium">{ob.name}</span>
                          </div>
                          <Badge className={getStatusColor(ob.status)} variant="secondary">
                            {ob.status}
                          </Badge>
                        </div>
                        
                        {ob.runId && (
                          <div className="mb-2">
                            <a 
                              href={`#/data-capture/${ob.runId}`}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              {ob.runId}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        
                        <Progress value={ob.progress} className="h-2 mb-1" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{ob.duration}</span>
                          <span className="text-xs text-muted-foreground">{ob.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  );
};
