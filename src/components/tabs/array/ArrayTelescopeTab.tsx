import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Maximize2, Minimize2, AlertTriangle, RotateCcw, Telescope, Camera, Grid3x3, Cpu, Disc, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CameraGrid } from "@/components/observation/CameraGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TelescopeStatus = "Safe" | "Standby" | "Operational" | "Fault";

const generateTelescopeData = (baseValue: number, timeOffset: number, telescopeId: number) => {
  return Array.from({ length: 10 }, (_, i) => ({
    time: i,
    value: baseValue + Math.sin((timeOffset + i) * 0.3) * 30 + Math.random() * 20,
    raError: (Math.sin((timeOffset + i) * 0.4 + telescopeId) * 0.5 + Math.random() * 0.3).toFixed(2),
    decError: (Math.cos((timeOffset + i) * 0.35 + telescopeId) * 0.5 + Math.random() * 0.3).toFixed(2),
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
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">PMC - Telescope A{selectedTelescope}</h3>
            <Card className="control-panel p-4">
              <div className="aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground">
                PMC Image - Telescope A{selectedTelescope}
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

        {/* Data Rate Chart */}
        <Card className="control-panel p-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Data Rate (MB/s)</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={telescope.data}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[900, 1100]}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pointing Error Chart */}
        <Card className="control-panel p-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Pointing Error (arcsec)</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={telescope.data}>
                <XAxis 
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[-2, 2]}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Line type="monotone" dataKey="raError" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="decError" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
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

        {/* PMC Section */}
        <Card className="control-panel p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-primary">PMC</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreenSection("pmc")}
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground">
              PMC Image - Telescope A{selectedTelescope}
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
