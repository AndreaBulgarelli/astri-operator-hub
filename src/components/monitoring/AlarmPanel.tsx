import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Info, XCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const alarms = [
  { id: 1, type: "warning", system: "A4", message: "Camera temperature above nominal", time: "10:32:45", shelved: false },
  { id: 2, type: "info", system: "WS1", message: "Wind speed increasing", time: "10:28:12", shelved: false },
  { id: 3, type: "warning", system: "PMS", message: "Power fluctuation detected", time: "10:15:03", shelved: true },
];

export const AlarmPanel = () => {
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
            <div
              key={alarm.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                alarm.shelved ? "bg-secondary/30 border-border/50 opacity-60" : "bg-secondary/50 border-border",
                alarm.type === "warning" && !alarm.shelved && "border-l-4 border-l-warning"
              )}
            >
              <div className="flex items-start gap-3">
                {alarm.type === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{alarm.system}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{alarm.time}</span>
                  </div>
                  <p className="text-sm">{alarm.message}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 text-xs"
                  disabled={alarm.shelved}
                >
                  {alarm.shelved ? "Shelved" : "Shelve"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
