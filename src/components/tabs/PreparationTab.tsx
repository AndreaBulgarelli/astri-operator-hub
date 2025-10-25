import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Power } from "lucide-react";

export const PreparationTab = () => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [lidarStatus, setLidarStatus] = useState<"OFF" | "INITIALIZING" | "STANDBY">("OFF");
  
  const [checklist, setChecklist] = useState({
    maSystemCheck: false,
    lidarInit: false,
    telescopesStandby: false,
    cameraInit: false,
    pmcInit: false,
  });

  type TelescopeStatus = "SAFE" | "STANDBY" | "OPERATIONAL" | "FAULT";
  
  const [telescopes, setTelescopes] = useState([
    { id: "1", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "2", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "3", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "4", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "5", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "6", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "7", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "8", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "OFF" },
    { id: "9", status: "SAFE" as TelescopeStatus, mount: "SAFE", camera: "OFF", pmc: "OFF", m2: "SAFE", sqm: "ON" },
  ]);

  const allChecked = Object.values(checklist).every(Boolean);
  const allTelescopesReady = telescopes.every(t => t.status === "OPERATIONAL");

  const handleInitLidar = () => {
    setLidarStatus("INITIALIZING");
    setTimeout(() => {
      setLidarStatus("STANDBY");
      setChecklist(prev => ({ ...prev, lidarInit: true }));
      toast({
        title: "LIDAR Initialized",
        description: "LIDAR is now in STANDBY state",
      });
    }, 2000);
  };

  const handleInitTelescopes = () => {
    setIsPreparing(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < telescopes.length) {
        setTelescopes(prev => prev.map((t, i) => 
          i === index ? { 
            ...t, 
            status: "STANDBY" as TelescopeStatus, 
            mount: "STANDBY", 
            camera: "STANDBY", 
            pmc: "OPERATIONAL",
            m2: "SAFE",
            sqm: t.id === "9" ? "OPERATIONAL" : "OFF"
          } : t
        ));
        index++;
      } else {
        clearInterval(interval);
        setIsPreparing(false);
        setChecklist(prev => ({ ...prev, telescopesStandby: true }));
        toast({
          title: "Telescopes Initialized",
          description: "All telescopes are now in STANDBY state",
        });
      }
    }, 600);
  };

  const handleSetOperational = () => {
    setTelescopes(prev => prev.map(t => ({ ...t, status: "OPERATIONAL" as TelescopeStatus })));
    setChecklist(prev => ({ ...prev, cameraInit: true, pmcInit: true }));
    toast({
      title: "Telescopes Operational",
      description: "MA System ready for pre-night operations",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return <Badge className="bg-telescope-ready">OPERATIONAL</Badge>;
      case "STANDBY":
        return <Badge className="bg-status-standby">STANDBY</Badge>;
      case "SAFE":
        return <Badge className="bg-status-active">SAFE</Badge>;
      case "FAULT":
        return <Badge className="bg-telescope-error">FAULT</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <Card className="control-panel p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Pre-Night Operations (Warm Startup)</h2>
          <p className="text-sm text-muted-foreground mb-6">
            UC 9.1.0.0-050: Configure MA System | UC 9.1.0.0-060: Day-Night Handover
          </p>

          <div className="space-y-6">
            {/* Pre-Conditions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Power className="h-5 w-5" />
                Pre-Conditions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={checklist.maSystemCheck}
                      onCheckedChange={(checked) => 
                        setChecklist(prev => ({ ...prev, maSystemCheck: checked as boolean }))
                      }
                    />
                    <div className="flex-1">
                      <div className="font-medium">MA System</div>
                      <div className="text-xs text-muted-foreground">Operational.Nominal.DayOperations</div>
                    </div>
                    <Badge className="bg-status-online">OK</Badge>
                  </div>
                </Card>
              </div>
            </div>

            {/* LIDAR */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">1. Initialize LIDAR</h3>
              <Card className="p-4 bg-secondary/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">LIDAR Status</div>
                    <div className="text-xs text-muted-foreground">Atmosphere Characterisation</div>
                  </div>
                  <Badge className={
                    lidarStatus === "STANDBY" ? "bg-status-standby" :
                    lidarStatus === "INITIALIZING" ? "bg-warning" : "bg-muted"
                  }>
                    {lidarStatus}
                  </Badge>
                </div>
                <Button 
                  onClick={handleInitLidar}
                  disabled={lidarStatus !== "OFF" || !checklist.maSystemCheck}
                  className="w-full"
                >
                  {lidarStatus === "INITIALIZING" ? "Initializing..." : "Initialize LIDAR"}
                </Button>
              </Card>
            </div>

            {/* Telescopes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">2. Initialize Telescopes</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleInitTelescopes}
                    disabled={isPreparing || !checklist.lidarInit}
                    className="flex-1"
                  >
                    {isPreparing ? "Initializing..." : "Put STANDBY"}
                  </Button>
                  <Button 
                    onClick={handleSetOperational}
                    disabled={!checklist.telescopesStandby}
                    variant="outline"
                  >
                    Set OPERATIONAL
                  </Button>
                </div>

                <Card className="p-4 bg-secondary/30">
                  <ScrollArea className="h-80">
                    <div className="grid grid-cols-3 gap-2">
                      {telescopes.map((tel) => (
                        <Card key={tel.id} className="p-3 bg-background/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">ASTRI-{tel.id}</span>
                            {getStatusBadge(tel.status)}
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Mount:</span>
                              <span className="font-mono">{tel.mount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Camera:</span>
                              <span className="font-mono">{tel.camera}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">PMC:</span>
                              <span className="font-mono">{tel.pmc}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className="text-lg font-semibold text-primary">
                  {allChecked ? "READY" : "PREPARING"}
                </div>
              </Card>
              <Card className="p-4 bg-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">Telescopes</div>
                <div className="text-lg font-semibold">
                  {telescopes.filter(t => t.status === "OPERATIONAL").length} / 9
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
