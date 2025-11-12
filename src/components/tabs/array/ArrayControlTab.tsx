import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Telescope, Camera, Grid3x3, Cpu, Disc, Shield, Maximize2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

type TelescopeStatus = "Safe" | "Standby" | "Operational" | "Fault";

const generateTelescopeData = (baseValue: number, timeOffset: number, telescopeId: number) => {
  return Array.from({ length: 10 }, (_, i) => ({
    time: i,
    value: baseValue + Math.sin((timeOffset + i) * 0.3) * 30 + Math.random() * 20,
    raError: (Math.sin((timeOffset + i) * 0.4 + telescopeId) * 0.5 + Math.random() * 0.3).toFixed(2),
    decError: (Math.cos((timeOffset + i) * 0.35 + telescopeId) * 0.5 + Math.random() * 0.3).toFixed(2),
  }));
};

export const ArrayControlTab = () => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSettingOperational, setIsSettingOperational] = useState(false);
  const [thermalisationProgress, setThermalisationProgress] = useState<{ [key: string]: number }>({});
  const [overallStatus, setOverallStatus] = useState<"SAFE" | "STANDBY" | "OPERATIONAL">("SAFE");
  const [isOpeningLids, setIsOpeningLids] = useState(false);
  const [lidProgress, setLidProgress] = useState<{ [key: string]: number }>({});
  const [preCalibrationDone, setPreCalibrationDone] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);
  const [fullscreenTelescope, setFullscreenTelescope] = useState<string | null>(null);
  
  const [telescopes, setTelescopes] = useState([
    { id: "1", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(960, 0, 0), events: 1000 },
    { id: "2", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(970, 0, 1), events: 1100 },
    { id: "3", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(980, 0, 2), events: 1200 },
    { id: "4", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(990, 0, 3), events: 1300 },
    { id: "5", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1000, 0, 4), events: 1400 },
    { id: "6", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1010, 0, 5), events: 1500 },
    { id: "7", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1020, 0, 6), events: 1600 },
    { id: "8", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1030, 0, 7), events: 1700 },
    { id: "9", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1040, 0, 8), events: 1800 },
  ]);

  const allTelescopesReady = telescopes.every(t => t.status === "Operational");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOffset(prev => prev + 1);
      setTelescopes(prev =>
        prev.map((tel, i) => ({
          ...tel,
          data: generateTelescopeData(960 + i * 10, timeOffset, i),
          events: 1000 + i * 100 + Math.floor(Math.random() * 50),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [timeOffset]);

  const handleGoToSafe = () => {
    setTelescopes(prev => prev.map((t, i) => ({
      ...t,
      status: "Safe" as TelescopeStatus,
      mount: "Safe",
      camera: "Off",
      pmc: "Off",
      m2: "Safe",
      si3: "Off",
      cherenkovCamera: "Off",
      lid: "Closed",
      data: generateTelescopeData(960 + i * 10, 0, i),
      events: 1000 + i * 100,
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
        setTelescopes(prev => prev.map((t, i) => 
          i === currentIndex ? {
            ...t,
            status: "Standby" as TelescopeStatus,
            mount: "Standby",
            pmc: "Standby",
            cherenkovCamera: "Standby",
          } : t
        ));
        
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
    
    telescopes.forEach((tel, idx) => {
      const duration = 30000;
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
          
          setTelescopes(prev => prev.map(t => 
            t.id === tel.id ? {
              ...t,
              status: "Operational" as TelescopeStatus,
              mount: "Operational",
              pmc: "Operational",
              cherenkovCamera: Math.random() > 0.3 ? "Operational" : "Degraded",
            } : t
          ));
          
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
      const duration = 10000;
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
          
          setTelescopes(prev => prev.map(t => 
            t.id === tel.id ? { ...t, lid: "Opened" } : t
          ));
          
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

  if (fullscreenTelescope) {
    const tel = telescopes.find(t => t.id === fullscreenTelescope)!;
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFullscreenTelescope(null)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          Exit Fullscreen
        </Button>
        <Card className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-2xl">ASTRI-{tel.id}</span>
            {getStatusBadge(tel.status)}
          </div>
          
          {isSettingOperational && thermalisationProgress[tel.id] !== undefined && thermalisationProgress[tel.id] < 100 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Camera thermalisation</div>
              <Progress value={thermalisationProgress[tel.id]} className="h-3" />
              <div className="text-sm text-right mt-1">{Math.round(thermalisationProgress[tel.id])}%</div>
            </div>
          )}

          {isOpeningLids && lidProgress[tel.id] !== undefined && lidProgress[tel.id] < 100 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Opening LID</div>
              <Progress value={lidProgress[tel.id]} className="h-3" />
              <div className="text-sm text-right mt-1">{Math.round(lidProgress[tel.id])}%</div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">Events: {tel.events}</div>
          
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tel.data}>
                <XAxis dataKey="time" />
                <YAxis domain={[900, 1100]} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-sm text-center text-muted-foreground">Data Rate (MB/s)</div>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tel.data}>
                <XAxis dataKey="time" />
                <YAxis domain={[-1, 1]} />
                <Line type="monotone" dataKey="raError" stroke="#ef4444" strokeWidth={2} dot={false} name="RA" />
                <Line type="monotone" dataKey="decError" stroke="#f59e0b" strokeWidth={2} dot={false} name="DEC" />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-sm text-center text-muted-foreground">Pointing Error (arcsec)</div>
          </div>
          
          <div className="grid grid-cols-6 gap-6 pt-4 border-t">
            <div className="flex flex-col items-center gap-2">
              <Telescope className={`h-8 w-8 ${getStatusColor(tel.mount)}`} />
              <span className="text-xs text-muted-foreground">Mount</span>
              <span className={`text-sm font-semibold ${getStatusColor(tel.mount)}`}>
                {tel.mount}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Camera className={`h-8 w-8 ${getStatusColor(tel.pmc)}`} />
              <span className="text-xs text-muted-foreground">PMC</span>
              <span className={`text-sm font-semibold ${getStatusColor(tel.pmc)}`}>
                {tel.pmc}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Grid3x3 className={`h-8 w-8 ${getStatusColor(tel.cherenkovCamera)}`} />
              <span className="text-xs text-muted-foreground">Cherenkov</span>
              <span className={`text-sm font-semibold ${getStatusColor(tel.cherenkovCamera)}`}>
                {tel.cherenkovCamera}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Cpu className={`h-8 w-8 ${getStatusColor(tel.si3)}`} />
              <span className="text-xs text-muted-foreground">SI3</span>
              <span className={`text-sm font-semibold ${getStatusColor(tel.si3)}`}>
                {tel.si3}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Disc className={`h-8 w-8 ${getStatusColor(tel.m2)}`} />
              <span className="text-xs text-muted-foreground">M2</span>
              <span className={`text-sm font-semibold ${getStatusColor(tel.m2)}`}>
                {tel.m2}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className={`h-8 w-8 ${tel.lid === "Opened" ? "text-status-online" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">LID</span>
              <span className={`text-sm font-semibold ${tel.lid === "Opened" ? "text-status-online" : "text-muted-foreground"}`}>
                {tel.lid}
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
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
                <Card key={tel.id} className="p-3 bg-background/50 space-y-3 relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFullscreenTelescope(tel.id)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">ASTRI-{tel.id}</span>
                    {getStatusBadge(tel.status)}
                  </div>
                  
                  {isSettingOperational && thermalisationProgress[tel.id] !== undefined && thermalisationProgress[tel.id] < 100 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Camera thermalisation</div>
                      <Progress value={thermalisationProgress[tel.id]} className="h-2" />
                      <div className="text-xs text-right mt-0.5">{Math.round(thermalisationProgress[tel.id])}%</div>
                    </div>
                  )}

                  {isOpeningLids && lidProgress[tel.id] !== undefined && lidProgress[tel.id] < 100 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Opening LID</div>
                      <Progress value={lidProgress[tel.id]} className="h-2" />
                      <div className="text-xs text-right mt-0.5">{Math.round(lidProgress[tel.id])}%</div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">Events: {tel.events}</div>
                  
                  <div>
                    <ResponsiveContainer width="100%" height={60}>
                      <LineChart data={tel.data}>
                        <XAxis dataKey="time" tick={{ fontSize: 9 }} height={15} />
                        <YAxis domain={[900, 1100]} width={30} tick={{ fontSize: 9 }} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="text-[9px] text-center text-muted-foreground">Data Rate (MB/s)</div>
                  </div>

                  <div>
                    <ResponsiveContainer width="100%" height={60}>
                      <LineChart data={tel.data}>
                        <XAxis dataKey="time" tick={{ fontSize: 9 }} height={15} />
                        <YAxis domain={[-1, 1]} width={30} tick={{ fontSize: 9 }} />
                        <Line type="monotone" dataKey="raError" stroke="#ef4444" strokeWidth={1.5} dot={false} name="RA" />
                        <Line type="monotone" dataKey="decError" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="DEC" />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="text-[9px] text-center text-muted-foreground">Pointing Error (arcsec)</div>
                  </div>
                  
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
  );
};
