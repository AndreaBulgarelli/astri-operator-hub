import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Power, AlertTriangle } from "lucide-react";

export const PreparationTab = () => {
  const [checklist, setChecklist] = useState({
    weatherCheck: false,
    telescopeStatus: false,
    cameraStatus: false,
    networkStatus: false,
    timingSync: false,
  });

  // Mock telescope states
  const [telescopes] = useState([
    { id: "A1", status: "ready", temp: 18.2, humidity: 45, power: "ON" },
    { id: "A2", status: "ready", temp: 18.5, humidity: 46, power: "ON" },
    { id: "A3", status: "idle", temp: 19.1, humidity: 48, power: "ON" },
    { id: "A4", status: "ready", temp: 18.3, humidity: 44, power: "ON" },
    { id: "A5", status: "error", temp: 22.5, humidity: 52, power: "ON" },
    { id: "A6", status: "ready", temp: 18.7, humidity: 45, power: "ON" },
    { id: "A7", status: "ready", temp: 18.4, humidity: 47, power: "ON" },
    { id: "A8", status: "idle", temp: 19.8, humidity: 49, power: "ON" },
    { id: "A9", status: "ready", temp: 18.6, humidity: 46, power: "ON" },
  ]);

  const allChecked = Object.values(checklist).every(Boolean);
  const allTelescopesReady = telescopes.every(t => t.status === "ready");

  const handlePrepare = () => {
    toast({
      title: "Array Preparation Started",
      description: "Preparing telescopes for observation...",
    });
  };

  const handleTelescopeReady = (id: string) => {
    toast({
      title: `Telescope ${id} Initialization`,
      description: `Sending ${id} to READY state...`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-telescope-ready">READY</Badge>;
      case "idle":
        return <Badge className="bg-telescope-idle">IDLE</Badge>;
      case "error":
        return <Badge className="bg-telescope-error">ERROR</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <Card className="control-panel p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Observation Preparation</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Use Cases: ASTRI-UC-9.1.0.0-050 & ASTRI-UC-9.1.0.0-060
          </p>

          <div className="space-y-6">
            {/* Weather Status */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Weather Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weather Station 1</span>
                    <Badge className="bg-status-online">ONLINE</Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wind Speed:</span>
                      <span className="font-mono">8.2 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-mono">15.3°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span className="font-mono">62%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cloud Cover:</span>
                      <span className="font-mono">Clear</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-secondary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weather Station 2</span>
                    <Badge className="bg-status-online">ONLINE</Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wind Speed:</span>
                      <span className="font-mono">7.8 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-mono">15.1°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span className="font-mono">64%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cloud Cover:</span>
                      <span className="font-mono">Clear</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="weather"
                  checked={checklist.weatherCheck}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, weatherCheck: checked as boolean })
                  }
                />
                <label htmlFor="weather" className="text-sm flex-1 cursor-pointer">
                  Weather conditions acceptable for observation
                </label>
              </div>
            </div>

            {/* Telescope Array Status */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Telescope Array Status</h3>
              <div className="grid grid-cols-3 gap-3">
                {telescopes.map((tel) => (
                  <Card key={tel.id} className="p-3 bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{tel.id}</span>
                      {getStatusBadge(tel.status)}
                    </div>
                    <div className="space-y-1 text-xs mb-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temp:</span>
                        <span className="font-mono">{tel.temp}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Humidity:</span>
                        <span className="font-mono">{tel.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Power:</span>
                        <span className="font-mono">{tel.power}</span>
                      </div>
                    </div>
                    {tel.status !== "ready" && (
                      <Button 
                        size="sm" 
                        className="w-full gap-1" 
                        variant={tel.status === "error" ? "destructive" : "default"}
                        onClick={() => handleTelescopeReady(tel.id)}
                      >
                        {tel.status === "error" ? (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            Reset
                          </>
                        ) : (
                          <>
                            <Power className="h-3 w-3" />
                            Set Ready
                          </>
                        )}
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="telescope"
                  checked={checklist.telescopeStatus}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, telescopeStatus: checked as boolean })
                  }
                />
                <label htmlFor="telescope" className="text-sm flex-1 cursor-pointer">
                  All telescopes in ready state ({telescopes.filter(t => t.status === "ready").length}/9)
                </label>
                {!allTelescopesReady && (
                  <Badge variant="outline" className="bg-status-warning text-xs">
                    Action Required
                  </Badge>
                )}
              </div>
            </div>

            {/* Camera Systems */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Camera Systems</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary/30">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-mono">-10.2°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cooling Status:</span>
                      <span className="font-mono">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initialized:</span>
                      <span className="font-mono">9/9</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="camera"
                  checked={checklist.cameraStatus}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, cameraStatus: checked as boolean })
                  }
                />
                <label htmlFor="camera" className="text-sm flex-1 cursor-pointer">
                  Camera systems initialized and cooled
                </label>
              </div>
            </div>

            {/* Network & Timing */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Network & Timing</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary/30">
                  <div className="text-sm font-medium mb-2">Network Status</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency:</span>
                      <span className="font-mono">2.3 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bandwidth:</span>
                      <span className="font-mono">10 Gbps</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-secondary/30">
                  <div className="text-sm font-medium mb-2">Timing System</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sync Status:</span>
                      <span className="font-mono">Locked</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Drift:</span>
                      <span className="font-mono">±0.1 ns</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="network"
                  checked={checklist.networkStatus}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, networkStatus: checked as boolean })
                  }
                />
                <label htmlFor="network" className="text-sm flex-1 cursor-pointer">
                  Network connectivity verified
                </label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Checkbox
                  id="timing"
                  checked={checklist.timingSync}
                  onCheckedChange={(checked) =>
                    setChecklist({ ...checklist, timingSync: checked as boolean })
                  }
                />
                <label htmlFor="timing" className="text-sm flex-1 cursor-pointer">
                  Timing system synchronized
                </label>
              </div>
            </div>

            <Button
              onClick={handlePrepare}
              disabled={!allChecked}
              className="w-full"
              size="lg"
            >
              {allChecked ? "Start Preparation" : "Complete Checklist to Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
