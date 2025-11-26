import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Info, XCircle, Bell, ArchiveIcon, CheckCircleIcon, X } from "lucide-react";
import { AlarmEvent, setWS } from "@/lib/ws-alarms-utilities";
import { set } from "date-fns";

const OPAPI_BASE_URL = (import.meta as any).env?.VITE_OPAPI_BASE_URL || "http://localhost:5050";

export const AlarmPanel = ({alarms, setAlarms, connected}: {alarms: AlarmEvent[], setAlarms: React.Dispatch<React.SetStateAction<AlarmEvent[]>>, connected: boolean}) => {
  
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmEvent | null>(null);

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

  const getPriorityColorSideLine = (priority: string) => {
    switch (priority) {
      case 'VERY_HIGH':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-red-400';
      case 'MEDIUM':
        return 'bg-yellow-400';
      case 'LOW':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  // TODO is the state SHELVED necessary?
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
      case "SHELVED":
        return "muted";
      default:
        return "outline";
    }
  };

  const formatTimestamp = (ts?: number) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString();
  };

  const shelveAlarm = (alarm: AlarmEvent) => {
    // Mark the alarm as shelved locally
    console.log("Shelving alarm:", alarm);
    fetch(`${OPAPI_BASE_URL}/shelve/${alarm.alarmId}`).
    then(response => {
      if (!response.ok) {
        throw new Error(`Failed to shelve alarm: ${response.statusText}`);
      }
      setAlarms((prevAlarms) => prevAlarms.map(a => a.alarmId === alarm.alarmId ? { ...a, shelved: true } : a));
    }).
    catch(err => {
      console.error("Error shelving alarm:", err);
    });
  };

  const acknowledgeAlarm = (alarm: AlarmEvent) => {
    // Mark the alarm as acknowledged locally
    console.log("Acknowledging alarm:", alarm);
    fetch(`${OPAPI_BASE_URL}/ack/${alarm.alarmId}`).
    then(response => {
      if (!response.ok) {
        throw new Error(`Failed to acknowledge alarm: ${response.statusText}`);
      }
      setAlarms((prevAlarms) => prevAlarms.map(a => a.alarmId === alarm.alarmId ? { ...a, acknowledged: true, alarmSystemState: "ACKNOWLEDGED" } : a));
    }).
    catch(err => {
      console.error("Error acknowledging alarm:", err);
    });
  };

  return (
    <Card className="control-panel p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Active Alarms
        </h3>
        <Badge variant="outline" className="text-xs">{alarms.filter(a => !a.shelved).length} Active</Badge>
      </div>

      <div className="col-span-12 flex gap-2 items-center">
        <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-xs text-muted-foreground">
          {connected ? "Connected" : "Disconnected"} to webSocket
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {alarms.map((alarm, index) => (
            <div
            key={`${alarm.alarmId}-${alarm.sourceTimestamp}-${index}`}
            onClick={() => setSelectedAlarm(alarm)}
            className={`relative w-full text-left px-2 py-2 rounded hover:bg-muted ${
              selectedAlarm?.alarmId === alarm.alarmId &&
              selectedAlarm?.sourceTimestamp === alarm.sourceTimestamp
              ? "bg-muted"
              : ""
            }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getPriorityColorSideLine(alarm.alarmPriority)}`} />
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(alarm.alarmPriority)}>
                      {alarm.alarmPriority || "UNKNOWN"}
                    </Badge>
                    <Badge variant={getStateColor(alarm.alarmSystemState)}>
                      {alarm.alarmSystemState || "UNKNOWN"}
                    </Badge>
                    {/* <div className="ml-auto">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => acknowledgeAlarm(alarm)}
                        disabled={alarm.acknowledged}
                      >
                        {alarm.acknowledged ? "Acknowledged" : "Acknowledge"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => shelveAlarm(alarm)}
                        disabled={alarm.shelved}
                      >
                        {alarm.shelved ? "Shelved" : "Shelve"}
                      </Button>
                    </div> */}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => shelveAlarm(alarm)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      disabled={alarm.shelved}
                    >
                      <ArchiveIcon fontSize="small" className="inline mr-1" />
                      {alarm.shelved ? "Shelved" : "Shelve"}
                    </button>
                    <button
                      onClick={() => acknowledgeAlarm(alarm)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      disabled={alarm.acknowledged}
                    >
                      <CheckCircleIcon fontSize="small" className="inline mr-1" />
                      {alarm.acknowledged ? "Acknowledged" : "Acknowledge"}
                    </button>
                    <button
                      // onClick={() => handleClear(alarm.alarmId)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      <X fontSize="small" className="inline mr-1" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
