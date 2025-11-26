import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Maximize2, Minimize2, AlertTriangle, RotateCcw, Telescope, Camera, Grid3x3, Cpu, Disc, Shield, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CameraGrid } from "@/components/observation/CameraGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TelescopeStatus = "Safe" | "Standby" | "Operational" | "Fault";

const generateTelescopeData = (baseValue: number, timeOffset: number, telescopeId: number) => {
  return Array.from({ length: 20 }, (_, i) => {
    const baseOffset = telescopeId * 0.001;
    const totalTime = timeOffset + i;
    return {
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString(),
      value: baseValue + Math.sin((timeOffset + i) * 0.3) * 30 + Math.random() * 20,
      raPlanned: 83.63 + Math.sin(totalTime * 0.05) * 0.01,
      raActual: 83.63 + Math.sin(totalTime * 0.05) * 0.01 + (Math.random() - 0.5) * 0.0005 + baseOffset,
      decPlanned: 22.01 + Math.cos(totalTime * 0.05) * 0.01,
      decActual: 22.01 + Math.cos(totalTime * 0.05) * 0.01 + (Math.random() - 0.5) * 0.0005 + baseOffset,
    };
  });
};

const generatePMCData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    raError: (Math.random() - 0.5) * 2,
    decError: (Math.random() - 0.5) * 2,
    zenithTrackErr: (Math.random() - 0.5) * 1.5,
    azimuthTrackErr: (Math.random() - 0.5) * 1.5,
  }));
};

const initialTelescopes = [
  { id: "1", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(960, 0, 0), events: 1000 },
  { id: "2", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(970, 0, 1), events: 1100 },
  { id: "3", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(980, 0, 2), events: 1200 },
  { id: "4", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(990, 0, 3), events: 1300 },
  { id: "5", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1000, 0, 4), events: 1400 },
  { id: "6", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1010, 0, 5), events: 1500 },
  { id: "7", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1020, 0, 6), events: 1600 },
  { id: "8", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1030, 0, 7), events: 1700 },
  { id: "9", status: "Safe" as TelescopeStatus, mount: "Safe", camera: "Off", pmc: "Off", m2: "Safe", si3: "Off", cherenkovCamera: "Off", lid: "Closed", data: generateTelescopeData(1040, 0, 8), events: 1800 },
];

export const ArrayTelescopeTab = () => {
  const [selectedTelescope, setSelectedTelescope] = useState("1");
  const [telescopes, setTelescopes] = useState(initialTelescopes);
  const [timeOffset, setTimeOffset] = useState(0);
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(null);
  const [isTabFullscreen, setIsTabFullscreen] = useState(false);
  const [selectedOOQSCamera, setSelectedOOQSCamera] = useState<number | null>(null);
  const [pmcData, setPmcData] = useState(generatePMCData());

  const telescope = telescopes.find(t => t.id === selectedTelescope)!;

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
      setPmcData(generatePMCData());
    }, 2000);

    return () => clearInterval(interval);
  }, [timeOffset]);

  const handleResetAlarm = () => {
    toast({
      title: "Alarm Reset",
      description: `Resetting alarms for telescope A${selectedTelescope}`,
    });
  };

  const handleResetTelescope = () => {
    toast({
      title: "Telescope Reset",
      description: `Resetting telescope A${selectedTelescope}`,
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
      case "Opened": return "Open";
      case "Closed": return "Clos";
      default: return status.substring(0, 4);
    }
  };

  if (isTabFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsTabFullscreen(false)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        <div className="pt-12">
          {renderContent()}
        </div>
      </div>
    );
  }

  if (fullscreenSection) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFullscreenSection(null)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        <div className="pt-12">
          {renderFullscreenSection()}
        </div>
      </div>
    );
  }

  function renderFullscreenSection() {
    switch (fullscreenSection) {
      case "ooqs":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">OOQS - Telescope A{selectedTelescope}</h3>
            <div className="grid grid-cols-3 gap-4">
              {(["var-hg", "var-lg", "sci-hg", "sci-lg", "cal-hg", "cal-lg"] as const).map((mode) => (
                <div key={mode}>
                  <CameraGrid
                    cameraId={parseInt(selectedTelescope)}
                    viewMode={mode}
                    isSelected={selectedOOQSCamera === parseInt(selectedTelescope)}
                    onSelect={() => setSelectedOOQSCamera(parseInt(selectedTelescope))}
                  />
                </div>
              ))}
            </div>
            <Card className="control-panel p-4">
              <div className="text-sm font-semibold text-muted-foreground mb-2">PDM Rate</div>
              <div className="text-2xl font-mono">{(1000 + Math.random() * 100).toFixed(0)} Hz</div>
            </Card>
          </div>
        );
      case "pmc":
        const latestPMCData = pmcData[pmcData.length - 1];
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Target className="h-5 w-5" />
              PMC - ASTRI-{selectedTelescope}
            </h3>
            <Card className="control-panel p-6">
              <div className="grid grid-cols-[400px_1fr] gap-6 mb-6">
                {/* PMC Image */}
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-white rounded-full mx-auto mb-2"></div>
                    <p className="text-xs text-muted-foreground">PMC Image Feed</p>
                  </div>
                </div>

                {/* Data boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-4 rounded border border-border/50">
                    <div className="text-sm text-muted-foreground">RA Error</div>
                    <div className="text-2xl font-semibold text-foreground">{latestPMCData.raError.toFixed(2)}°</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded border border-border/50">
                    <div className="text-sm text-muted-foreground">Dec Error</div>
                    <div className="text-2xl font-semibold text-foreground">{latestPMCData.decError.toFixed(2)}°</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded border border-border/50">
                    <div className="text-sm text-muted-foreground">Zenith Track Err</div>
                    <div className="text-2xl font-semibold text-foreground">{latestPMCData.zenithTrackErr.toFixed(2)}°</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded border border-border/50">
                    <div className="text-sm text-muted-foreground">Azimuth Track Err</div>
                    <div className="text-2xl font-semibold text-foreground">{latestPMCData.azimuthTrackErr.toFixed(2)}°</div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">RA & Dec Pointing Errors (°)</div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={pmcData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="raError" stroke="#3b82f6" strokeWidth={2} name="RA Error" dot={false} />
                      <Line type="monotone" dataKey="decError" stroke="#ef4444" strokeWidth={2} name="Dec Error" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Tracking Errors (°)</div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={pmcData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                      <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="zenithTrackErr" stroke="#10b981" strokeWidth={2} name="Zenith Track Err" dot={false} />
                      <Line type="monotone" dataKey="azimuthTrackErr" stroke="#f59e0b" strokeWidth={2} name="Azimuth Track Err" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>
        );
      case "webcam":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Webcam - Telescope A{selectedTelescope}</h3>
            <Card className="control-panel p-4">
              <div className="aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground">
                Webcam Feed - Telescope A{selectedTelescope}
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  }

  function renderContent() {
    return (
      <div className="space-y-6">
        {/* Telescope Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-primary">Telescope Details</h3>
            <Select value={selectedTelescope} onValueChange={setSelectedTelescope}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {telescopes.map(tel => (
                  <SelectItem key={tel.id} value={tel.id}>A{tel.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!isTabFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTabFullscreen(true)}
              className="h-6 w-6 p-0"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Status and Control */}
        <Card className="control-panel p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-semibold">ASTRI-{selectedTelescope}</h4>
                {getStatusBadge(telescope.status)}
              </div>
            </div>
            
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Events:</span>
                <span className="font-mono">{telescope.events}</span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 pt-3 border-t">
              <div className="flex flex-col items-center gap-1">
                <Telescope className={`h-6 w-6 ${getStatusColor(telescope.mount)}`} />
                <span className={`text-xs font-semibold ${getStatusColor(telescope.mount)}`}>
                  {getStatusAbbreviation(telescope.mount)}
                </span>
                <span className="text-[10px] text-muted-foreground">Mount</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Camera className={`h-6 w-6 ${getStatusColor(telescope.pmc)}`} />
                <span className={`text-xs font-semibold ${getStatusColor(telescope.pmc)}`}>
                  {getStatusAbbreviation(telescope.pmc)}
                </span>
                <span className="text-[10px] text-muted-foreground">PMC</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Grid3x3 className={`h-6 w-6 ${getStatusColor(telescope.cherenkovCamera)}`} />
                <span className={`text-xs font-semibold ${getStatusColor(telescope.cherenkovCamera)}`}>
                  {getStatusAbbreviation(telescope.cherenkovCamera)}
                </span>
                <span className="text-[10px] text-muted-foreground">Čerenkov</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Cpu className={`h-6 w-6 ${getStatusColor(telescope.si3)}`} />
                <span className={`text-xs font-semibold ${getStatusColor(telescope.si3)}`}>
                  {getStatusAbbreviation(telescope.si3)}
                </span>
                <span className="text-[10px] text-muted-foreground">Si3</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Disc className={`h-6 w-6 ${getStatusColor(telescope.m2)}`} />
                <span className={`text-xs font-semibold ${getStatusColor(telescope.m2)}`}>
                  {getStatusAbbreviation(telescope.m2)}
                </span>
                <span className="text-[10px] text-muted-foreground">M2</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className={`h-6 w-6 ${telescope.lid === "Opened" ? "text-status-online" : "text-muted-foreground"}`} />
                <span className={`text-xs font-semibold ${telescope.lid === "Opened" ? "text-status-online" : "text-muted-foreground"}`}>
                  {getStatusAbbreviation(telescope.lid)}
                </span>
                <span className="text-[10px] text-muted-foreground">LID</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAlarm}
                className="gap-2 flex-1"
              >
                <AlertTriangle className="h-4 w-4" />
                Reset Alarm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTelescope}
                className="gap-2 flex-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Telescope
              </Button>
            </div>
          </div>
        </Card>

        {/* OOQS Section */}
        <Card className="control-panel p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary">OOQS - Camera Views</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreenSection("ooqs")}
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(["var-hg", "var-lg", "sci-hg", "sci-lg", "cal-hg", "cal-lg"] as const).map((mode) => (
                <div key={mode}>
                  <CameraGrid
                    cameraId={parseInt(selectedTelescope)}
                    viewMode={mode}
                    isSelected={selectedOOQSCamera === parseInt(selectedTelescope)}
                    onSelect={() => setSelectedOOQSCamera(parseInt(selectedTelescope))}
                  />
                </div>
              ))}
            </div>
            <Card className="control-panel p-4 mt-2">
              <div className="text-sm font-semibold text-muted-foreground mb-2">PDM Rate</div>
              <div className="text-2xl font-mono">{(1000 + Math.random() * 100).toFixed(0)} Hz</div>
            </Card>
          </div>
        </Card>

        {/* Pointing Analysis */}
        <Card className="control-panel p-6">
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-primary">Pointing Analysis</h4>
            
            <div>
              <div className="text-sm text-muted-foreground mb-2">RA - Planned vs Actual (deg)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={telescope.data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                  <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} className="text-xs" stroke="hsl(var(--foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="raPlanned" stroke="#8b5cf6" strokeWidth={2} name="RA Planned" strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="raActual" stroke="#ec4899" strokeWidth={2} name="RA Actual" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Dec - Planned vs Actual (deg)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={telescope.data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                  <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} className="text-xs" stroke="hsl(var(--foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="decPlanned" stroke="#8b5cf6" strokeWidth={2} name="Dec Planned" strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="decActual" stroke="#ec4899" strokeWidth={2} name="Dec Actual" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Pointing Error (arcsec)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={telescope.data.map(d => ({
                  time: d.time,
                  raError: (d.raActual - d.raPlanned) * 3600,
                  decError: (d.decActual - d.decPlanned) * 3600,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="raError" stroke="#ef4444" strokeWidth={2} name="RA Error (arcsec)" dot={false} />
                  <Line type="monotone" dataKey="decError" stroke="#f59e0b" strokeWidth={2} name="Dec Error (arcsec)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* PMC Section */}
        <Card className="control-panel p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Target className="h-4 w-4" />
                PMC
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreenSection("pmc")}
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-[300px_1fr] gap-4 mb-4">
              {/* PMC Image */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mb-1"></div>
                  <p className="text-[8px] text-muted-foreground">PMC Feed</p>
                </div>
              </div>

              {/* Data boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/30 p-3 rounded border border-border/50">
                  <div className="text-xs text-muted-foreground">RA Error</div>
                  <div className="text-xl font-semibold text-foreground">{pmcData[pmcData.length - 1].raError.toFixed(2)}°</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded border border-border/50">
                  <div className="text-xs text-muted-foreground">Dec Error</div>
                  <div className="text-xl font-semibold text-foreground">{pmcData[pmcData.length - 1].decError.toFixed(2)}°</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded border border-border/50">
                  <div className="text-xs text-muted-foreground">Zenith Track Err</div>
                  <div className="text-xl font-semibold text-foreground">{pmcData[pmcData.length - 1].zenithTrackErr.toFixed(2)}°</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded border border-border/50">
                  <div className="text-xs text-muted-foreground">Azimuth Track Err</div>
                  <div className="text-xl font-semibold text-foreground">{pmcData[pmcData.length - 1].azimuthTrackErr.toFixed(2)}°</div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">RA & Dec Pointing Errors (°)</div>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={pmcData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="raError" stroke="#3b82f6" strokeWidth={2} name="RA Error" dot={false} />
                    <Line type="monotone" dataKey="decError" stroke="#ef4444" strokeWidth={2} name="Dec Error" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Tracking Errors (°)</div>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={pmcData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="zenithTrackErr" stroke="#10b981" strokeWidth={2} name="Zenith Track Err" dot={false} />
                    <Line type="monotone" dataKey="azimuthTrackErr" stroke="#f59e0b" strokeWidth={2} name="Azimuth Track Err" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        {/* Webcam Section */}
        <Card className="control-panel p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary">Webcam</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreenSection("webcam")}
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground">
              Webcam Feed - Telescope A{selectedTelescope}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};
