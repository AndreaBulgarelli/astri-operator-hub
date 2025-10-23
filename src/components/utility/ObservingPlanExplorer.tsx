import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronDown, PlayCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

const mockObservingPlan = {
  id: "OP_2025_10_22",
  name: "October 22, 2025 Observation Plan",
  schedulingBlocks: [
    {
      id: "SB.03",
      status: "succeeded",
      progress: 100,
      observationBlocks: [
        { id: "OB.1", status: "succeeded", startTime: "19:00:31", endTime: "19:31:31" },
        { id: "OB.2", status: "succeeded", startTime: "19:31:31", endTime: "20:01:31" },
      ],
    },
    {
      id: "SB.04",
      status: "succeeded",
      progress: 100,
      observationBlocks: [
        { id: "OB.1", status: "succeeded", startTime: "20:01:31", endTime: "20:31:31" },
      ],
    },
    {
      id: "SB.05",
      status: "running",
      progress: 75,
      observationBlocks: [
        { id: "OB.1", status: "succeeded", startTime: "21:31:31", endTime: "21:41:31" },
        { id: "OB.2", status: "succeeded", startTime: "21:41:31", endTime: "21:46:31" },
        { id: "OB.3", status: "running", startTime: "21:46:31", endTime: "21:51:31" },
      ],
    },
    {
      id: "SB.01",
      status: "pending",
      progress: 0,
      observationBlocks: [
        { id: "OB.1", status: "pending", startTime: "22:00:00", endTime: "22:30:00" },
      ],
    },
    {
      id: "SB.02",
      status: "pending",
      progress: 0,
      observationBlocks: [
        { id: "OB.1", status: "pending", startTime: "22:30:00", endTime: "23:00:00" },
      ],
    },
  ],
};

export const ObservingPlanExplorer = () => {
  const [expandedSB, setExpandedSB] = useState<string | null>("SB.05");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded": return "bg-success";
      case "running": return "bg-status-active";
      case "pending": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{mockObservingPlan.name}</h3>
        <p className="text-sm text-muted-foreground">Plan ID: {mockObservingPlan.id}</p>
      </div>

      <div className="space-y-2">
        {mockObservingPlan.schedulingBlocks.map((sb) => (
          <Card key={sb.id} className="control-panel overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
              onClick={() => setExpandedSB(expandedSB === sb.id ? null : sb.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSB === sb.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold">{sb.id}</span>
                  <Badge className={getStatusColor(sb.status)}>
                    {sb.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Progress value={sb.progress} className="w-24 h-2" />
                    <span className="text-xs font-mono">{sb.progress}%</span>
                  </div>
                  {sb.status === "running" && (
                    <PlayCircle className="h-5 w-5 text-primary animate-pulse" />
                  )}
                  {sb.status === "succeeded" && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>
              </div>
            </div>

            {expandedSB === sb.id && (
              <div className="border-t border-border p-4 bg-secondary/20 space-y-2">
                {sb.observationBlocks.map((ob) => (
                  <div
                    key={ob.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{ob.id}</Badge>
                      <span className="text-sm">{ob.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {ob.startTime} → {ob.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
