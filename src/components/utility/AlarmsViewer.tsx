import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlarmEvent } from "@/lib/ws-alarms-utilities";

const WS_URL = (import.meta as any).env?.VITE_WEBHOOK_WS_URL || "ws://localhost:8089/ws";

export const AlarmsViewer = () => {
  const [alarms, setAlarms] = useState<AlarmEvent[]>([]);
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmEvent | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        console.log("Connecting to WebSocket:", WS_URL);
        ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
          setConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const messages = Array.isArray(data) ? data : [data];
            
            // Filter only alarm messages (from alarm-channel topic)
            const alarmMessages = messages.filter((msg: AlarmEvent) => 
              msg._topic === "alarm-channel" || 
              (msg.alarmId && msg.faultCode !== undefined)
            );
            
            if (alarmMessages.length > 0) {
              setAlarms(prev => {
                // show pop-up notitication
                // Add new alarms, keeping most recent first, limit to 100
                const combined = [...alarmMessages, ...prev];
                // Remove duplicates based on alarmId + timestamp
                const unique = combined.filter((alarm, index, self) =>
                  index === self.findIndex(a => 
                    a.alarmId === alarm.alarmId && 
                    a.sourceTimestamp === alarm.sourceTimestamp
                  )
                );
                return unique.slice(0, 100);
              });
            }
          } catch (e) {
            console.error("Error parsing WebSocket message:", e);
          }
        };

        ws.onerror = (err) => {
          setError("WebSocket error");
          setConnected(false);
        };

        ws.onclose = () => {
          setConnected(false);
          // Reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (err) {
        setError("Failed to connect to WebSocket");
        setConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "VERY_HIGH":
        return "destructive";
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStateColor = (state?: string) => {
    switch (state) {
      case "NEW":
        return "destructive";
      case "ACTIVE":
        return "default";
      case "ACKNOWLEDGED":
        return "secondary";
      case "CLEARED":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatTimestamp = (ts?: number) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-12 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs text-muted-foreground">
          {connected ? "Connected" : "Disconnected"} to {WS_URL}
        </span>
        {error && <span className="text-xs text-destructive">{error}</span>}
        <div className="text-xs text-muted-foreground ml-auto">
          {alarms.length} alarm{alarms.length !== 1 ? "s" : ""}
        </div>
      </div>

      <Card className="col-span-5 p-3 flex flex-col min-h-[60vh]">
        <div className="font-semibold mb-2">Alarms</div>
        <ScrollArea className="flex-1">
          {!connected && !error && (
            <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-destructive">Error: {error}</div>
          )}
          {connected && alarms.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No alarms received yet. Waiting for alarms...
            </div>
          )}
          {alarms.map((alarm, index) => (
            <button
              key={`${alarm.alarmId}-${alarm.sourceTimestamp}-${index}`}
              onClick={() => setSelectedAlarm(alarm)}
              className={`w-full text-left px-2 py-2 rounded hover:bg-muted ${
                selectedAlarm?.alarmId === alarm.alarmId &&
                selectedAlarm?.sourceTimestamp === alarm.sourceTimestamp
                  ? "bg-muted"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(alarm.alarmPriority)}>
                      {alarm.alarmPriority || "UNKNOWN"}
                    </Badge>
                    <Badge variant={getStateColor(alarm.alarmSystemState)}>
                      {alarm.alarmSystemState || "UNKNOWN"}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium truncate">
                    {alarm.problemDescription || alarm.alarmId || "Unknown Alarm"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {alarm.faultFamily}:{alarm.faultMember}:{alarm.faultCode}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatTimestamp(alarm.sourceTimestamp)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </Card>

      <Card className="col-span-7 p-3">
        <div className="font-semibold mb-2">Alarm Details</div>
        <Separator className="mb-2" />
        {selectedAlarm ? (
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-xs leading-5 overflow-auto">
              {JSON.stringify(selectedAlarm, null, 2)}
            </pre>
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground">
            Select an alarm to view details
          </div>
        )}
      </Card>
    </div>
  );
};

