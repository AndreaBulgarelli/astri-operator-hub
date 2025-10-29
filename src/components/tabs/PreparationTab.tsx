import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Power } from "lucide-react";

export const PreparationTab = () => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSettingOperational, setIsSettingOperational] = useState(false);
  const [thermalisationProgress, setThermalisationProgress] = useState<{ [key: string]: number }>({});
  const [lidarStatus, setLidarStatus] = useState<"Off" | "Standby" | "Initialised">("Off");
  const [overallStatus, setOverallStatus] = useState<"SAFE" | "STANDBY" | "OPERATIONAL">("SAFE");
  
  const [checklist, setChecklist] = useState({
    maSystemCheck: false,
    lidarInit: false,
    telescopesStandby: false,
    sqmInit: false,
    cameraInit: false,
    pmcInit: false,
  });

  type TelescopeStatus = "Safe" | "Standby" | "Operational" | "Fault";
  
  const [telescopes, setTelescopes] = useState([
    { id: "1", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "2", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "3", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "4", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "5", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "6", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "7", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "8", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
    { id: "9", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off" },
  ]);

  const [sqms, setSqms] = useState([
    { id: "1", status: "Off" as "Off" | "Standby" | "Initialised" | "Operational" },
    { id: "2", status: "Off" as "Off" | "Standby" | "Initialised" | "Operational" },
    { id: "3", status: "Off" as "Off" | "Standby" | "Initialised" | "Operational" },
  ]);

  const allChecked = Object.values(checklist).every(Boolean);
  const allTelescopesReady = telescopes.every(t => t.status === "Operational");
  const allSqmsReady = sqms.every(s => s.status === "Operational");

  const handleInitLidar = () => {
    // Off -> Standby -> Initialised
    if (lidarStatus === "Off") {
      setLidarStatus("Standby");
      setTimeout(() => {
        setLidarStatus("Initialised");
        setChecklist(prev => ({ ...prev, lidarInit: true }));
        toast({
          title: "LIDAR Initialized",
          description: "LIDAR is now Initialised",
        });
      }, 1500);
    }
  };

  const handleInitSqm = (sqmId: string) => {
    setSqms(prev => prev.map(s => {
      if (s.id === sqmId) {
        const nextStatus = 
          s.status === "Off" ? "Standby" :
          s.status === "Standby" ? "Initialised" :
          s.status === "Initialised" ? "Operational" : "Operational";
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    
    // Check if all SQMs are operational after update
    const allOperational = sqms.every(s => s.id === sqmId ? true : s.status === "Operational");
    if (allOperational) {
      setChecklist(prev => ({ ...prev, sqmInit: true }));
    }
  };

  const handleInitTelescopes = () => {
    setIsPreparing(true);
    setOverallStatus("STANDBY");
    let index = 0;
    const interval = setInterval(() => {
      if (index < telescopes.length) {
        setTelescopes(prev => prev.map((t, i) => {
          if (i === index) {
            // Show state transitions: Safe -> Standby for telescope and mount
            // Off -> Standby -> Initialised for PMC and Cherenkov Camera
            setTimeout(() => {
              setTelescopes(p => p.map((tel, idx) => 
                idx === i ? {
                  ...tel,
                  status: "Standby" as TelescopeStatus,
                  mount: "Standby",
                  pmc: "Initialised",
                  cherenkovCamera: "Initialised",
                } : tel
              ));
            }, 300);
            
            return {
              ...t,
              status: "Standby" as TelescopeStatus,
              mount: "Standby",
              pmc: "Standby",
              cherenkovCamera: "Standby",
            };
          }
          return t;
        }));
        index++;
      } else {
        clearInterval(interval);
        setIsPreparing(false);
        setChecklist(prev => ({ ...prev, telescopesStandby: true }));
        toast({
          title: "Telescopes in Standby",
          description: "All telescopes are now in STANDBY state",
        });
      }
    }, 800);
  };

  const handleSetOperational = () => {
    setIsSettingOperational(true);
    
    // Start camera thermalisation for all telescopes
    telescopes.forEach((tel, idx) => {
      const progress: { [key: string]: number } = {};
      const duration = 30000; // 30 seconds
      const steps = 100;
      const interval = duration / steps;
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 100 / steps;
        setThermalisationProgress(prev => ({
          ...prev,
          [tel.id]: Math.min(currentProgress, 100)
        }));
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          
          // Update telescope to Operational state
          setTelescopes(prev => prev.map(t => 
            t.id === tel.id ? {
              ...t,
              status: "Operational" as TelescopeStatus,
              mount: "Operational",
              pmc: "Operational",
              cherenkovCamera: Math.random() > 0.3 ? "Operational" : "Degraded", // Randomly set some to Degraded
            } : t
          ));
          
          // Check if all done
          if (idx === telescopes.length - 1) {
            setTimeout(() => {
              setIsSettingOperational(false);
              setOverallStatus("OPERATIONAL");
              setChecklist(prev => ({ ...prev, cameraInit: true, pmcInit: true }));
              toast({
                title: "Telescopes Operational",
                description: "MA System ready for pre-night operations",
              });
            }, 500);
          }
        }
      }, interval);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Operational":
        return <Badge className="bg-status-online">Operational</Badge>;
      case "Standby":
        return <Badge className="bg-status-standby">Standby</Badge>;
      case "Initialised":
        return <Badge className="bg-status-initialised text-white">Initialised</Badge>;
      case "Safe":
        return <Badge className="bg-status-active">Safe</Badge>;
      case "Degraded":
        return <Badge className="bg-status-warning">Degraded</Badge>;
      case "Fault":
        return <Badge className="bg-status-error">Fault</Badge>;
      case "Off":
        return <Badge className="bg-status-offline">Off</Badge>;
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
                    <div className="text-xs text-muted-foreground mt-1">
                      Cycle: Off → Standby → Initialised
                    </div>
                  </div>
                  {getStatusBadge(lidarStatus)}
                </div>
                <Button 
                  onClick={handleInitLidar}
                  disabled={lidarStatus === "Initialised" || !checklist.maSystemCheck}
                  className="w-full"
                >
                  {lidarStatus === "Standby" ? "Completing Initialization..." : "Initialize LIDAR"}
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
                    disabled={isPreparing || isSettingOperational}
                    className="flex-1"
                  >
                    {isPreparing ? "Putting in Standby..." : "Put STANDBY"}
                  </Button>
                  <Button 
                    onClick={handleSetOperational}
                    disabled={!checklist.telescopesStandby || isSettingOperational}
                    variant="outline"
                  >
                    {isSettingOperational ? "Setting Operational..." : "Set OPERATIONAL"}
                  </Button>
                </div>

                <Card className="p-4 bg-secondary/30">
                  <div className="grid grid-cols-3 gap-2">
                    {telescopes.map((tel) => (
                      <Card key={tel.id} className="p-3 bg-background/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">ASTRI-{tel.id}</span>
                          {getStatusBadge(tel.status)}
                        </div>
                        
                        {/* Camera thermalisation progress */}
                        {isSettingOperational && thermalisationProgress[tel.id] !== undefined && thermalisationProgress[tel.id] < 100 && (
                          <div className="mb-2">
                            <div className="text-xs text-muted-foreground mb-1">Camera thermalisation</div>
                            <Progress value={thermalisationProgress[tel.id]} className="h-2" />
                            <div className="text-xs text-right mt-0.5">{Math.round(thermalisationProgress[tel.id])}%</div>
                          </div>
                        )}
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mount:</span>
                            <span className="font-mono">{tel.mount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">PMC:</span>
                            <span className="font-mono">{tel.pmc}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cherenkov:</span>
                            <span className="font-mono">{tel.cherenkovCamera}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">SI3:</span>
                            <span className="font-mono">{tel.si3}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">M2 AMC:</span>
                            <span className="font-mono">{tel.m2}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Sky Quality Meter */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">3. Sky Quality Meter</h3>
              <Card className="p-4 bg-secondary/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sqms.map((sqm) => (
                    <div key={sqm.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">SQM-{sqm.id}</div>
                          <div className="text-xs text-muted-foreground">
                            Cycle: Off → Standby → Initialised → Operational
                          </div>
                        </div>
                        {getStatusBadge(sqm.status)}
                      </div>
                      <Button
                        onClick={() => handleInitSqm(sqm.id)}
                        disabled={sqm.status === "Operational"}
                        className="w-full"
                        size="sm"
                      >
                        {sqm.status === "Operational" ? "Operational" : `Advance to ${
                          sqm.status === "Off" ? "Standby" :
                          sqm.status === "Standby" ? "Initialised" :
                          "Operational"
                        }`}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">Overall Status</div>
                <div className="text-lg font-semibold text-primary">
                  {overallStatus}
                </div>
              </Card>
              <Card className="p-4 bg-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">Telescopes Ready</div>
                <div className="text-lg font-semibold">
                  {telescopes.filter(t => t.status === "Operational").length} / 9
                </div>
              </Card>
              <Card className="p-4 bg-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">LIDAR</div>
                <div className="text-lg font-semibold">
                  {lidarStatus}
                </div>
              </Card>
              <Card className="p-4 bg-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">SQM Ready</div>
                <div className="text-lg font-semibold">
                  {sqms.filter(s => s.status === "Operational").length} / 3
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
