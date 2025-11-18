import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Info, XCircle, Bell, CheckCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const alarms = [
  { 
    id: 1, 
    type: "warning", 
    system: "A4", 
    message: "Camera temperature above nominal", 
    time: "2025-01-14 10:32:45", 
    shelved: false,
    alarmState: "Active",
    systemState: "Warning",
    priority: "High",
    actionRequired: "Check cooling system and verify camera temperature sensors. Contact technical support if temperature continues to rise.",
    helpUrl: "https://docs.example.com/camera-temperature"
  },
  { 
    id: 2, 
    type: "info", 
    system: "WS1", 
    message: "Wind speed increasing", 
    time: "2025-01-14 10:28:12", 
    shelved: false,
    alarmState: "Active",
    systemState: "Normal",
    priority: "Low",
    actionRequired: "Monitor wind conditions. Consider closing dome if wind speed exceeds safety threshold.",
    helpUrl: "https://docs.example.com/weather-alerts"
  },
  { 
    id: 3, 
    type: "warning", 
    system: "PMS", 
    message: "Power fluctuation detected", 
    time: "2025-01-14 10:15:03", 
    shelved: true,
    alarmState: "Shelved",
    systemState: "Warning",
    priority: "Medium",
    actionRequired: "Inspect power connections and check UPS status. Review power logs for anomalies.",
    helpUrl: "https://docs.example.com/power-issues"
  },
];

export const AlarmPanel = () => {
  const [selectedAlarm, setSelectedAlarm] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card className="control-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Active Alarms
        </h3>
        <Badge variant="outline" className="text-xs">{alarms.filter(a => !a.shelved).length} Active</Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {alarms.map((alarm) => (
            <div key={alarm.id} className="space-y-2">
              <div
                onClick={() => setSelectedAlarm(selectedAlarm === alarm.id ? null : alarm.id)}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer",
                  alarm.shelved ? "bg-secondary/30 border-border/50 opacity-60" : "bg-secondary/50 border-border",
                  alarm.type === "warning" && !alarm.shelved && "border-l-4 border-l-warning",
                  selectedAlarm === alarm.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start gap-3">
                  {alarm.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                  ) : (
                    <Info className="h-4 w-4 text-primary mt-0.5" />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px]">{alarm.system}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">{alarm.time}</span>
                      <Badge variant={getPriorityColor(alarm.priority) as any} className="text-[10px]">
                        {alarm.priority}
                      </Badge>
                      <a 
                        href={alarm.helpUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm">{alarm.message}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Alarm: <span className="text-foreground">{alarm.alarmState}</span>
                      </span>
                      <span className="text-muted-foreground">
                        System: <span className="text-foreground">{alarm.systemState}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 text-xs"
                      disabled={alarm.shelved}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle shelve action
                      }}
                    >
                      {alarm.shelved ? "Shelved" : "Shelve"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs gap-1"
                      disabled={alarm.shelved}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle acknowledge action
                      }}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Ack
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs gap-1"
                      disabled={alarm.shelved}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle clear action
                      }}
                    >
                      <XCircle className="h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              
              {selectedAlarm === alarm.id && (
                <div className="ml-10 p-3 rounded-lg bg-accent/50 border border-border">
                  <h4 className="text-xs font-semibold text-foreground mb-2">Action Required</h4>
                  <p className="text-xs text-muted-foreground">{alarm.actionRequired}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
