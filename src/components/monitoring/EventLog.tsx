import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

const events = [
  { id: 1, time: "21:31:45", message: "OB.1 Phase start_taking_data ended" },
  { id: 2, time: "21:31:31", message: "OB.1 Phase configure ended" },
  { id: 3, time: "21:31:31", message: "SB.05 Started" },
  { id: 4, time: "21:30:15", message: "Telescope array ready" },
  { id: 5, time: "21:29:42", message: "LIDAR initialization complete" },
];

export const EventLog = () => {
  return (
    <Card className="control-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Event Log
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 font-mono text-xs">
          {events.map((event) => (
            <div key={event.id} className="p-2 bg-secondary/30 rounded border border-border/50">
              <span className="text-primary">{event.time}</span>
              <span className="text-muted-foreground"> - {event.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
