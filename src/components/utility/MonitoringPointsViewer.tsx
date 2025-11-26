import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

type MonitoringPoint = {
  assembly?: string;
  name?: string;
  serial_number?: string;
  timestamp?: number;
  source_timestamp?: number | null;
  units?: string;
  archive_suppress?: boolean;
  env_id?: string;
  eng_gui?: boolean;
  op_gui?: boolean;
  data?: (number | string | boolean)[];
  _topic?: string;
  [key: string]: any;
};

const WS_URL = (import.meta as any).env?.VITE_WEBHOOK_WS_URL || "ws://localhost:8089/ws";
console.log("[MonitoringPointsViewer] WebSocket URL:", WS_URL);

export const MonitoringPointsViewer = () => {
  const [points, setPoints] = useState<MonitoringPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterAssembly, setFilterAssembly] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
          setConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const messages = Array.isArray(data) ? data : [data];
            
            console.log(`[MonitoringPointsViewer] Received ${messages.length} message(s) from WebSocket`);
            
            // Filter only monitoring point messages (from monCollector topic, not alarm-channel)
            const monitoringMessages = messages.filter((msg: MonitoringPoint) => {
              const isMonitoring = (msg._topic === "monCollector" || (!msg._topic && msg.assembly && msg.name && msg.timestamp !== undefined));
              const isNotAlarm = !msg.alarmId;
              if (!isMonitoring) {
                console.log(`[MonitoringPointsViewer] Filtered out message (not monitoring):`, msg._topic, msg.assembly, msg.name);
              }
              if (!isNotAlarm) {
                console.log(`[MonitoringPointsViewer] Filtered out message (is alarm):`, msg.alarmId);
              }
              return isMonitoring && isNotAlarm;
            });
            
            console.log(`[MonitoringPointsViewer] ${monitoringMessages.length} monitoring messages after filtering`);
            
            if (monitoringMessages.length > 0) {
              setPoints(prev => {
                // Add new points, keeping most recent first, limit to 500
                const combined = [...monitoringMessages, ...prev];
                // Remove duplicates based on assembly + name + timestamp
                const unique = combined.filter((point, index, self) =>
                  index === self.findIndex(p => 
                    p.assembly === point.assembly && 
                    p.name === point.name && 
                    p.timestamp === point.timestamp
                  )
                );
                console.log(`[MonitoringPointsViewer] Updated points: ${unique.length} total (was ${prev.length})`);
                return unique.slice(0, 500);
              });
            }
          } catch (e) {
            console.error("[MonitoringPointsViewer] Error parsing WebSocket message:", e, event.data);
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

  const formatTimestamp = (ts?: number) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString();
  };

  const formatDataValue = (data?: (number | string | boolean)[]) => {
    if (!data || data.length === 0) return "N/A";
    if (data.length === 1) return String(data[0]);
    return `[${data.map(String).join(", ")}]`;
  };

  // Filter points
  const filteredPoints = points.filter(point => {
    if (filterAssembly && point.assembly && !point.assembly.toLowerCase().includes(filterAssembly.toLowerCase())) {
      return false;
    }
    if (filterName && point.name && !point.name.toLowerCase().includes(filterName.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Get unique assemblies for filter
  const assemblies = Array.from(new Set(points.map(p => p.assembly).filter(Boolean))).sort();

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-12 flex items-center gap-2 flex-wrap">
        <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs text-muted-foreground">
          {connected ? "Connected" : "Disconnected"} to {WS_URL}
        </span>
        {error && <span className="text-xs text-destructive">{error}</span>}
        <div className="text-xs text-muted-foreground ml-auto">
          {filteredPoints.length} point{filteredPoints.length !== 1 ? "s" : ""} ({points.length} total)
        </div>
      </div>

      <Card className="col-span-12 p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filter by assembly..."
            value={filterAssembly}
            onChange={(e) => setFilterAssembly(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
          <input
            type="text"
            placeholder="Filter by name..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
        </div>
      </Card>

      <Card className="col-span-5 p-3 flex flex-col min-h-[60vh]">
        <div className="font-semibold mb-2">Monitoring Points</div>
        <ScrollArea className="flex-1">
          {!connected && !error && (
            <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-destructive">Error: {error}</div>
          )}
          {connected && filteredPoints.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No monitoring points received yet. Waiting for data...
            </div>
          )}
          {filteredPoints.map((point, index) => (
            <button
              key={`${point.assembly}-${point.name}-${point.timestamp}-${index}`}
              onClick={() => setSelectedPoint(point)}
              className={`w-full text-left px-2 py-2 rounded hover:bg-muted ${
                selectedPoint?.assembly === point.assembly &&
                selectedPoint?.name === point.name &&
                selectedPoint?.timestamp === point.timestamp
                  ? "bg-muted"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{point.assembly || "Unknown"}</Badge>
                    {point.op_gui && <Badge variant="secondary">OP GUI</Badge>}
                    {point.eng_gui && <Badge variant="secondary">ENG GUI</Badge>}
                  </div>
                  <div className="text-sm font-medium truncate">
                    {point.name || "Unknown"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Value: {formatDataValue(point.data)} {point.units || ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatTimestamp(point.timestamp)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </Card>

      <Card className="col-span-7 p-3">
        <div className="font-semibold mb-2">Point Details</div>
        <Separator className="mb-2" />
        {selectedPoint ? (
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-xs leading-5 overflow-auto">
              {JSON.stringify(selectedPoint, null, 2)}
            </pre>
          </ScrollArea>
        ) : (
          <div className="text-muted-foreground">
            Select a monitoring point to view details
          </div>
        )}
      </Card>
    </div>
  );
};

