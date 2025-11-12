import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Telescope, Camera, Grid3x3, Cpu, Disc, Shield } from "lucide-react";

type TelescopeStatus = "Safe" | "Standby" | "Operational" | "Fault";

export const ArrayTab = () => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSettingOperational, setIsSettingOperational] = useState(false);
  const [thermalisationProgress, setThermalisationProgress] = useState<{ [key: string]: number }>({});
  const [overallStatus, setOverallStatus] = useState<"SAFE" | "STANDBY" | "OPERATIONAL">("SAFE");
  const [isOpeningLids, setIsOpeningLids] = useState(false);
  const [lidProgress, setLidProgress] = useState<{ [key: string]: number }>({});
  const [preCalibrationDone, setPreCalibrationDone] = useState(false);
  
  const [telescopes, setTelescopes] = useState([
    { id: "1", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "2", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "3", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "4", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "5", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "6", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "7", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "8", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
    { id: "9", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed" },
  ]);

  const allTelescopesReady = telescopes.every(t => t.status === "Operational");

  const handleGoToSafe = () => {
    setTelescopes(prev => prev.map(t => ({
      ...t,
      status: "Safe" as TelescopeStatus,
      mount: "Safe",
      camera: "Off",
      pmc: "Off",
      m2: "Safe",
      si3: "Off",
      cherenkovCamera: "Off",
      lid: "Closed"
    })));
    setOverallStatus("SAFE");
    setThermalisationProgress({});
    setLidProgress({});
    setPreCalibrationDone(false);
    toast({
      title: "Telescopes Set to Safe",
      description: "All telescopes returned to SAFE state",
    });
  };

  const handleInitTelescopes = () => {
    setIsPreparing(true);
    setOverallStatus("STANDBY");
    let index = 0;
    const interval = setInterval(() => {
      if (index < telescopes.length) {
        const currentIndex = index;
        // First transition: Safe -> Standby for telescope, mount, and set PMC/Cherenkov to Standby
        setTelescopes(prev => prev.map((t, i) => 
          i === currentIndex ? {
            ...t,
            status: "Standby" as TelescopeStatus,
            mount: "Standby",
            pmc: "Standby",
            cherenkovCamera: "Standby",
          } : t
        ));
        
        // Second transition: PMC and Cherenkov Camera from Standby to Initialised
        setTimeout(() => {
          setTelescopes(prev => prev.map((t, i) => 
            i === currentIndex ? {
              ...t,
              pmc: "Initialised",
              cherenkovCamera: "Initialised",
            } : t
          ));
        }, 400);
        
        index++;
      } else {
        clearInterval(interval);
        setIsPreparing(false);
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
              toast({
                title: "Telescopes Operational",
                description: "Array ready for observations",
              });
            }, 500);
          }
        }
      }, interval);
    });
  };

  const handleOpenLids = () => {
    if (!preCalibrationDone) {
      toast({
        title: "Pre-calibration Required",
        description: "Please complete pre-calibration procedure first",
        variant: "destructive",
      });
      return;
    }

    setIsOpeningLids(true);
    telescopes.forEach((tel, idx) => {
      const duration = 10000; // 10 seconds
      const steps = 100;
      const interval = duration / steps;
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 100 / steps;
        setLidProgress(prev => ({
          ...prev,
          [tel.id]: Math.min(currentProgress, 100)
        }));
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          
          // Update telescope LID to Opened
          setTelescopes(prev => prev.map(t => 
            t.id === tel.id ? { ...t, lid: "Opened" } : t
          ));
          
          // Check if all done
          if (idx === telescopes.length - 1) {
            setTimeout(() => {
              setIsOpeningLids(false);
              toast({
                title: "LIDs Opened",
                description: "All telescope LIDs are now open",
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
        return <Badge className="bg-[hsl(var(--status-initialised))] text-white">Initialised</Badge>;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "text-status-online";
      case "Standby":
        return "text-status-standby";
      case "Initialised":
        return "text-[hsl(var(--status-initialised))]";
      case "Safe":
        return "text-status-active";
      case "Degraded":
        return "text-status-warning";
      case "Off":
        return "text-muted-foreground";
      case "Fault":
        return "text-status-error";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusAbbreviation = (status: string) => {
    switch (status) {
      case "Operational": return "Op";
      case "Standby": return "StBy";
      case "Initialised": return "Ini";
      case "Safe": return "Safe";
      case "Degraded": return "Deg";
      case "Off": return "Off";
      case "Fault": return "Faul";
      default: return status.substring(0, 4);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <Card className="control-panel p-6">
          <h2 className="text-xl font-semibold mb-2 text-primary">Array Control</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Initialize and control telescope array operations
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleInitTelescopes}
                disabled={isPreparing || isSettingOperational}
                className="flex-1"
              >
                {isPreparing ? "Putting in Standby..." : "Put STANDBY"}
              </Button>
              <Button 
                onClick={handleSetOperational}
                disabled={telescopes.every(t => t.status === "Safe") || isSettingOperational}
                variant="outline"
                className="flex-1"
              >
                {isSettingOperational ? "Setting Operational..." : "Set OPERATIONAL"}
              </Button>
              <Button 
                onClick={handleGoToSafe}
                disabled={isPreparing || isSettingOperational}
                variant="destructive"
                className="flex-1"
              >
                Go to Safe
              </Button>
            </div>

            {allTelescopesReady && !isOpeningLids && telescopes.every(t => t.lid === "Closed") && (
              <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <Checkbox 
                  checked={preCalibrationDone}
                  onCheckedChange={(checked) => setPreCalibrationDone(checked as boolean)}
                />
                <label className="text-sm font-medium cursor-pointer">
                  Pre-calibration procedure done
                </label>
              </div>
            )}

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

                    {/* LID opening progress */}
                    {isOpeningLids && lidProgress[tel.id] !== undefined && lidProgress[tel.id] < 100 && (
                      <div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">Opening LID</div>
                        <Progress value={lidProgress[tel.id]} className="h-2" />
                        <div className="text-xs text-right mt-0.5">{Math.round(lidProgress[tel.id])}%</div>
                      </div>
                    )}
                    
                    <div className="flex justify-around items-center pt-2 border-t border-border/50">
                      <div className="flex flex-col items-center gap-0.5" title={`Mount: ${tel.mount}`}>
                        <Telescope className={`h-4 w-4 ${getStatusColor(tel.mount)}`} />
                        <span className="text-[8px] text-muted-foreground">Mnt</span>
                        <span className={`text-[7px] font-semibold ${getStatusColor(tel.mount)}`}>
                          {getStatusAbbreviation(tel.mount)}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5" title={`PMC: ${tel.pmc}`}>
                        <Camera className={`h-4 w-4 ${getStatusColor(tel.pmc)}`} />
                        <span className="text-[8px] text-muted-foreground">PMC</span>
                        <span className={`text-[7px] font-semibold ${getStatusColor(tel.pmc)}`}>
                          {getStatusAbbreviation(tel.pmc)}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5" title={`Cherenkov: ${tel.cherenkovCamera}`}>
                        <Grid3x3 className={`h-4 w-4 ${getStatusColor(tel.cherenkovCamera)}`} />
                        <span className="text-[8px] text-muted-foreground">Cher</span>
                        <span className={`text-[7px] font-semibold ${getStatusColor(tel.cherenkovCamera)}`}>
                          {getStatusAbbreviation(tel.cherenkovCamera)}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5" title={`SI3: ${tel.si3}`}>
                        <Cpu className={`h-4 w-4 ${getStatusColor(tel.si3)}`} />
                        <span className="text-[8px] text-muted-foreground">SI3</span>
                        <span className={`text-[7px] font-semibold ${getStatusColor(tel.si3)}`}>
                          {getStatusAbbreviation(tel.si3)}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5" title={`M2: ${tel.m2}`}>
                        <Disc className={`h-4 w-4 ${getStatusColor(tel.m2)}`} />
                        <span className="text-[8px] text-muted-foreground">M2</span>
                        <span className={`text-[7px] font-semibold ${getStatusColor(tel.m2)}`}>
                          {getStatusAbbreviation(tel.m2)}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5" title={`LID: ${tel.lid}`}>
                        <Shield className={`h-4 w-4 ${tel.lid === "Opened" ? "text-status-online" : "text-muted-foreground"}`} />
                        <span className="text-[8px] text-muted-foreground">LID</span>
                        <span className={`text-[7px] font-semibold ${tel.lid === "Opened" ? "text-status-online" : "text-muted-foreground"}`}>
                          {tel.lid === "Opened" ? "Open" : "Clos"}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
