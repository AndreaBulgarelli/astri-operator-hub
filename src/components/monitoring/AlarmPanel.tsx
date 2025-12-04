import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, ArchiveIcon, CheckCircleIcon, X, Menu, ExternalLink } from "lucide-react";
import { AlarmEvent, setWS } from "@/lib/ws-alarms-utilities";
import { useRightPanel } from "@/context/RightPanelContext";

const OPAPI_BASE_URL = (import.meta as any).env?.VITE_OPAPI_BASE_URL || "http://localhost:5050";

export const AlarmPanel = ({alarms, setAlarms, selectedAlarm, setSelectedAlarm, connected}: 
  {alarms: AlarmEvent[], setAlarms: React.Dispatch<React.SetStateAction<AlarmEvent[]>>, selectedAlarm: AlarmEvent | null,  setSelectedAlarm: React.Dispatch<React.SetStateAction<AlarmEvent | null>>, connected: boolean}) => {
  
  const [stateFilters, setStateFilters] = useState(new Set());
  const { setContent } = useRightPanel();

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
      case "ACKNOWLEDGED":
        return "secondary";
      case "CLEARED":
        return "outline";
      case "SHELVED":
        return "shelved";
      default:
        return "outline";
    }
  };

  const getAcsStateBgColor = (state: string) => {
    switch (state) {
      case 'ACTIVE':
        return 'bg-red-500 dark:bg-red-500';
      case 'INACTIVE':
        return 'bg-green-500 dark:bg-green-500';
      default:
        return 'bg-gray-400 dark:bg-gray-500';
    }
  };

  const alarmStates = [
    'shelved',
    'acknowledged',
    'cleared',
  ];

  const updateAlarmsToView = (checked: boolean, state: string) => {
    console.log("Showing alarms with states before update:", stateFilters);
    const newStates = new Set(stateFilters);
    if (checked) {
      newStates.add(state);
    } else {
      newStates.delete(state);
    }
    setStateFilters(newStates);
    console.log("Showing alarms with states after update:", stateFilters, newStates);
  };

  const formatTimestamp = (ts?: number) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString();
  };

  const shelveAlarm = (alarm: AlarmEvent) => {
    // Mark the alarm as shelved locally
    console.log("Shelving/Unshelving alarm:", alarm);
    let newSystemState = "SHELVED";
    let requestUrl = `${OPAPI_BASE_URL}/shelve/${alarm.alarmId}`;
    if (alarm.alarmSystemState === "SHELVED") {
      newSystemState = "NEW"
      requestUrl = `${OPAPI_BASE_URL}/unshelve/${alarm.alarmId}`;
    }

    fetch(requestUrl).
    then(response => {
      if (!response.ok) {
        throw new Error(`Failed to shelve/unshelve alarm: ${response.statusText}`);
      }
      setAlarms((prevAlarms) => prevAlarms.map(a => a.alarmId === alarm.alarmId ? { ...a, alarmSystemState: newSystemState } : a));
    }).
    catch(err => {
      console.error("Error shelving/unshelving alarm:", err);
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

  const clearAlarm = (alarm: AlarmEvent) => {
    // Mark the alarm as acknowledged locally
    console.log("Clearing alarm:", alarm);
    fetch(`${OPAPI_BASE_URL}/clear/${alarm.alarmId}`).
    then(response => {
      if (!response.ok) {
        throw new Error(`Failed to clear alarm: ${response.statusText}`);
      }
      setAlarms((prevAlarms) => prevAlarms.map(a => a.alarmId === alarm.alarmId ? { ...a, alarmSystemState: "CLEARED" } : a));
    }).
    catch(err => {
      console.error("Error clearing alarm:", err);
    });
  };

  const handleAlarmClick = (alarm: AlarmEvent | null) => {
    setSelectedAlarm(alarm);
    if (alarm) {
      setContent(
        <div className="space-y-6">
          {/* Alarm ID on single row */}
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Alarm ID</label>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-words">{alarm.alarmId}</p>
          </div>
          {/* Problem Description */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Problem Description</label>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-medium">
              {alarm.problemDescription}
            </p>
          </div>
          {/* Link tho the Help URL */}
          <div>
            <a href={alarm.helpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Help URL
            </a>
          </div>
          {/* Timestamp */}
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</label>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
              {formatTimestamp(alarm.timestamp || alarm.sourceTimestamp || Date.now())}
            </p>
          </div>
          
          {/* Receive Count */}
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Receive Count</label>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-semibold">
              {alarm.receiveCount || 1}
            </p>
          </div>

          {/* Action Required - Always shown explicitly */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Action Required</label>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
              {alarm.actionRequired || 'TBD'}
            </p>
          </div>
          
          {/* Problem Description from SCDB - Highlighted */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Problem Description</label>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-medium">
              {alarm.problemDescription}
            </p>
          </div>
          
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Priotiry</label>
              <div>
                <Badge variant={getPriorityColor(alarm.alarmPriority)}>
                  {alarm.alarmPriority || "UNKNOWN"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">System State</label>
              <div>
                <Badge variant={getStateColor(alarm.alarmSystemState)}>
                  {alarm.alarmSystemState || "UNKNOWN"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Receive Count</label>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-semibold">
                {alarm.receiveCount || 1}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Fault Family</label>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.faultFamily}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Fault Member</label>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.faultMember}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Fault Code</label>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.faultCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ACS Alarm State</label>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1.5 rounded text-sm font-medium text-white ${getAcsStateBgColor(alarm.acsAlarmState)}`}>
                  {alarm.acsAlarmState}
                </span>
              </div>
            </div>
            {alarm.reduced !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Reduced</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.reduced ? 'Yes' : 'No'}</p>
              </div>
            )}
            {alarm.masked !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Masked</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.masked ? 'Yes' : 'No'}</p>
              </div>
            )}
            {alarm.documented !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Documented</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.documented ? 'Yes' : 'No'}</p>
              </div>
            )}
            {alarm.sourceName && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source Name</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.sourceName}</p>
              </div>
            )}
            {alarm.sourceHostname && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source Hostname</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.sourceHostname}</p>
              </div>
            )}
            {alarm.systemId && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">System ID</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.systemId}</p>
              </div>
            )}
            {alarm.systemName && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">System Name</label>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alarm.systemName}</p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      setContent(null);
    }
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
        <div className="ml-auto">
          {/* checkboxes for alarm states filter inside a dropdown menu */}
          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger>
              <Badge variant="secondary" className="text-sm"><Menu /> States</Badge>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content className="bg-popover text-popover-foreground z-50 min-w-[220px] rounded-md border border-popover-foreground/10 p-1 shadow-lg" >
                  <div className="flex items-center p-2 bg-secondary/30 rounded-lg ml-auto mb-2 justify-end">
                    <div className={`form-check ms-1 font-bold underline cursor-pointer ${stateFilters.size === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}  onClick={stateFilters.size === 0 ? undefined : () => setStateFilters(new Set())}>Clear</div>
                  </div>
                 { alarmStates.map((state, index) => (
                    <div className="flex items-center p-2 bg-secondary/30 rounded-lg" key={index}>
                      <div className="form-check ms-1" >
                        <Checkbox
                          id={`checkbox-${state}`}
                          checked={stateFilters.has(state)}
                          defaultChecked={false}
                          onCheckedChange={(checked) => updateAlarmsToView(!!checked, state)}
                        />
                        <label className="ml-2 text-sm font-medium cursor-pointer">
                          {state.charAt(0).toUpperCase() + state.slice(1)}
                        </label>
                      </div>
                    </div>
                  ))} 
                  </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>
        </div>
      </div>


      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {alarms.map((alarm, index) => (
            // Filter alarms based on stateFilters
            (stateFilters.size === 0 || 
              (alarm.alarmSystemState === "SHELVED" && stateFilters.has('shelved')) ||
              (alarm.alarmSystemState === "ACKNOWLEDGED" && stateFilters.has('acknowledged')) ||
              (alarm.alarmSystemState === "CLEARED" && stateFilters.has('cleared'))
            ) && (
              <div
              key={`${alarm.alarmId}-${alarm.sourceTimestamp}-${index}`}
              onClick={() => handleAlarmClick(alarm)}
              className={`relative text-left px-3 py-2 border border-gray-200 rounded hover:bg-muted ${selectedAlarm?.alarmId === alarm.alarmId ? "bg-muted" : ""}`}
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
                        className="flex-1 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <ArchiveIcon fontSize="small" className="inline mr-1" />
                        {alarm.alarmSystemState === "SHELVED" ? "Unshelve" : "Shelve"}
                      </button>
                      <button
                        onClick={() => acknowledgeAlarm(alarm)}
                        className={`flex-1 py-1.5 text-xs font-medium bg-blue-500 text-white rounded ${alarm.alarmSystemState === "ACKNOWLEDGED" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"} transition-colors`}
                        disabled={alarm.alarmSystemState === "ACKNOWLEDGED"}
                      >
                        <CheckCircleIcon fontSize="small" className="inline mr-1" />
                        Acknowledge
                      </button>
                      <button
                        onClick={() => clearAlarm(alarm)}
                        className={`flex-1 py-1.5 text-xs font-medium bg-green-500 text-white rounded ${alarm.alarmSystemState === "CLEARED" ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"} transition-colors`}
                        disabled={alarm.alarmSystemState === "CLEARED"}
                      >
                        <X fontSize="small" className="inline mr-1" />
                        Clear
                      </button>

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
            )
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
