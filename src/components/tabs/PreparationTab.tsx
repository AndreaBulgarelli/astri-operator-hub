import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Power } from "lucide-react";

type SystemCheckStatus = "idle" | "checking" | "ok" | "warning" | "error";

interface SystemComponent {
  id: string;
  name: string;
  abbreviation: string;
  status: SystemCheckStatus;
}

export const PreparationTab = () => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSettingOperational, setIsSettingOperational] = useState(false);
  const [thermalisationProgress, setThermalisationProgress] = useState<{ [key: string]: number }>({});
  const [lidarStatus, setLidarStatus] = useState<"Off" | "Standby" | "Initialised" | "Running">("Off");
  const [overallStatus, setOverallStatus] = useState<"SAFE" | "STANDBY" | "OPERATIONAL">("SAFE");
  const [isOpeningLids, setIsOpeningLids] = useState(false);
  const [lidProgress, setLidProgress] = useState<{ [key: string]: number }>({});
  const [preCalibrationDone, setPreCalibrationDone] = useState(false);
  const [isCheckingSystem, setIsCheckingSystem] = useState(false);
  
  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>([
    { id: "pms", name: "Power Management System", abbreviation: "PMS", status: "idle" },
    { id: "sss", name: "Safety and Security System", abbreviation: "SSS", status: "idle" },
    { id: "ict", name: "ICT System", abbreviation: "ICT", status: "idle" },
    { id: "ws1", name: "Weather Station 1", abbreviation: "WS-1", status: "idle" },
    { id: "ws2", name: "Weather Station 2", abbreviation: "WS-2", status: "idle" },
    { id: "asc", name: "All-Sky Camera", abbreviation: "ASC", status: "idle" },
    { id: "tds", name: "Time Distribution System", abbreviation: "TDS", status: "idle" },
    { id: "sqm1", name: "Sky Quality Meter 1", abbreviation: "SQM-1", status: "idle" },
    { id: "sqm2", name: "Sky Quality Meter 2", abbreviation: "SQM-2", status: "idle" },
    { id: "sqm3", name: "Sky Quality Meter 3", abbreviation: "SQM-3", status: "idle" },
    { id: "lidar", name: "LIDAR", abbreviation: "LIDAR", status: "idle" },
    { id: "uvsipm", name: "UVSipM", abbreviation: "UVSipM", status: "idle" },
    { id: "sc1", name: "Service Cabinet 1", abbreviation: "SC-1", status: "idle" },
    { id: "sc2", name: "Service Cabinet 2", abbreviation: "SC-2", status: "idle" },
    { id: "sc3", name: "Service Cabinet 3", abbreviation: "SC-3", status: "idle" },
    { id: "sc4", name: "Service Cabinet 4", abbreviation: "SC-4", status: "idle" },
    { id: "sc5", name: "Service Cabinet 5", abbreviation: "SC-5", status: "idle" },
    { id: "sc6", name: "Service Cabinet 6", abbreviation: "SC-6", status: "idle" },
    { id: "sc7", name: "Service Cabinet 7", abbreviation: "SC-7", status: "idle" },
    { id: "sc8", name: "Service Cabinet 8", abbreviation: "SC-8", status: "idle" },
    { id: "sc9", name: "Service Cabinet 9", abbreviation: "SC-9", status: "idle" },
    { id: "a1", name: "Telescope A1", abbreviation: "A1", status: "idle" },
    { id: "a2", name: "Telescope A2", abbreviation: "A2", status: "idle" },
    { id: "a3", name: "Telescope A3", abbreviation: "A3", status: "idle" },
    { id: "a4", name: "Telescope A4", abbreviation: "A4", status: "idle" },
    { id: "a5", name: "Telescope A5", abbreviation: "A5", status: "idle" },
    { id: "a6", name: "Telescope A6", abbreviation: "A6", status: "idle" },
    { id: "a7", name: "Telescope A7", abbreviation: "A7", status: "idle" },
    { id: "a8", name: "Telescope A8", abbreviation: "A8", status: "idle" },
    { id: "a9", name: "Telescope A9", abbreviation: "A9", status: "idle" },
    { id: "startup", name: "Startup System", abbreviation: "Startup", status: "idle" },
    { id: "scada", name: "SCADA System", abbreviation: "SCADA", status: "idle" },
  ]);
  
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

  const [sqms, setSqms] = useState([
    { id: "1", status: "Off" as "Off" | "Standby" | "Initialised" | "Operational" },
    { id: "2", status: "Off" as "Off" | "Standby" | "Initialised" | "Operational" },
    { id: "3", status: "Off" as "Off" | "Standby" | "Initialised" | "Operational" },
  ]);

  const allChecked = Object.values(checklist).every(Boolean);
  const allTelescopesReady = telescopes.every(t => t.status === "Operational");
  const allSqmsReady = sqms.every(s => s.status === "Operational");

  const handleCheckSystem = () => {
    setIsCheckingSystem(true);
    
    // Simulate checking each component sequentially
    let index = 0;
    const checkInterval = setInterval(() => {
      if (index < systemComponents.length) {
        // Set current component to "checking"
        setSystemComponents(prev => prev.map((comp, i) => 
          i === index ? { ...comp, status: "checking" as SystemCheckStatus } : comp
        ));
        
        // After a short delay, set result (mostly ok, some warnings, rare errors)
        setTimeout(() => {
          const rand = Math.random();
          let status: SystemCheckStatus = "ok";
          if (rand < 0.1) status = "warning"; // 10% warning
          if (rand < 0.02) status = "error"; // 2% error
          
          setSystemComponents(prev => prev.map((comp, i) => 
            i === index ? { ...comp, status } : comp
          ));
        }, 300);
        
        index++;
      } else {
        clearInterval(checkInterval);
        setTimeout(() => {
          setIsCheckingSystem(false);
          const hasErrors = systemComponents.some(c => c.status === "error");
          const hasWarnings = systemComponents.some(c => c.status === "warning");
          
          toast({
            title: hasErrors ? "System Check Complete - Issues Found" : "System Check Complete",
            description: hasErrors 
              ? "Some systems have errors. Please check and resolve."
              : hasWarnings 
              ? "All critical systems operational. Some warnings detected."
              : "All systems operational",
            variant: hasErrors ? "destructive" : "default",
          });
        }, 500);
      }
    }, 400);
  };

  const getSystemStatusColor = (status: SystemCheckStatus) => {
    switch (status) {
      case "idle": return "bg-muted";
      case "checking": return "bg-status-active";
      case "ok": return "bg-success";
      case "warning": return "bg-status-warning";
      case "error": return "bg-status-error";
      default: return "bg-muted";
    }
  };

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

  const handleLidarRun = () => {
    setLidarStatus("Running");
    toast({
      title: "LIDAR Running",
      description: "LIDAR is now in Running mode",
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
        return <Badge className="bg-[hsl(var(--status-initialised))] text-white">Initialised</Badge>;
      case "Running":
        return <Badge className="bg-status-online text-white">Running</Badge>;
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
              
              {/* System Check Button */}
              <Button 
                onClick={handleCheckSystem}
                disabled={isCheckingSystem}
                className="w-full mb-4"
              >
                {isCheckingSystem ? "Checking ASTRI Mini-Array Status..." : "Check ASTRI Mini-Array Status"}
              </Button>

              {/* System Status Bar */}
              <div className="mb-4 p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="text-xs font-medium text-muted-foreground mb-2">System Components Status</div>
                <div className="flex flex-wrap gap-1">
                  {systemComponents.map((component) => (
                    <div
                      key={component.id}
                      className={`h-10 px-2 flex items-center justify-center text-[10px] font-mono font-semibold transition-all border border-border/50 ${getSystemStatusColor(component.status)}`}
                      style={{ minWidth: '60px' }}
                      title={`${component.name} - ${component.status}`}
                    >
                      {component.abbreviation}
                    </div>
                  ))}
                </div>
              </div>

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
              <h3 className="text-lg font-semibold">1. LIDAR</h3>
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
                <div className="flex gap-2">
                  <Button 
                    onClick={handleInitLidar}
                    disabled={lidarStatus !== "Off" || !checklist.maSystemCheck}
                    className="flex-1"
                  >
                    {lidarStatus === "Standby" ? "Completing Initialization..." : "Initialize LIDAR"}
                  </Button>
                  <Button 
                    onClick={handleLidarRun}
                    disabled={lidarStatus !== "Initialised"}
                    variant="outline"
                    className="flex-1"
                  >
                    LIDAR Run
                  </Button>
                </div>
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
                    className="flex-1"
                  >
                    {isSettingOperational ? "Setting Operational..." : "Set OPERATIONAL"}
                  </Button>
                  <Button 
                    onClick={handleOpenLids}
                    disabled={!allTelescopesReady || isOpeningLids}
                    variant="outline"
                    className="flex-1"
                  >
                    {isOpeningLids ? "Opening LIDs..." : "Open LIDs"}
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
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LID:</span>
                            <span className="font-mono">{tel.lid}</span>
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
