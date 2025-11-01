import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";

interface RunningPlanTabProps {
  planData: any;
}

export const RunningPlanTab = ({ planData }: RunningPlanTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded": return "bg-success";
      case "running": return "bg-status-active";
      case "pending": return "bg-muted";
      default: return "bg-muted";
    }
  };

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

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Scheduling Blocks */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduling Blocks</label>
            <ScrollArea className="h-[500px] border rounded-lg p-3">
              {planData.schedulingBlocks.map((sb: any) => (
                <div key={sb.id} className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{sb.id}</span>
                      <Badge className={getStatusColor(sb.status)} variant="outline">{sb.status}</Badge>
                    </div>
                  </div>
                  <div className="text-sm mb-2">{sb.name}</div>
                  <div className="flex items-center gap-2">
                    <Progress value={sb.progress} className="flex-1 h-2" />
                    <span className="text-xs font-mono">{sb.progress}%</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
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
