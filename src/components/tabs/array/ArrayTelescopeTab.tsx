import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Maximize2, Minimize2, AlertTriangle, RotateCcw } from "lucide-react";
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

  const getStatusColor = (status: TelescopeStatus) => {
    switch (status) {
      case "Operational": return "text-green-500";
      case "Standby": return "text-yellow-500";
      case "Safe": return "text-blue-500";
      case "Fault": return "text-red-500";
    }
  };

  const getComponentBadgeVariant = (state: string) => {
    if (state === "On" || state === "Operational" || state === "Open") return "default";
    if (state === "Off" || state === "Safe" || state === "Closed") return "secondary";
    return "outline";
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
              <h4 className="text-sm font-semibold text-primary">Status & Control</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Overall Status</div>
                <Badge className={getStatusColor(telescope.status)}>{telescope.status}</Badge>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Events</div>
                <div className="text-sm font-mono">{telescope.events}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Badge variant={getComponentBadgeVariant(telescope.mount)} className="text-xs">Mount: {telescope.mount}</Badge>
              <Badge variant={getComponentBadgeVariant(telescope.camera)} className="text-xs">Camera: {telescope.camera}</Badge>
              <Badge variant={getComponentBadgeVariant(telescope.pmc)} className="text-xs">PMC: {telescope.pmc}</Badge>
              <Badge variant={getComponentBadgeVariant(telescope.m2)} className="text-xs">M2: {telescope.m2}</Badge>
              <Badge variant={getComponentBadgeVariant(telescope.si3)} className="text-xs">Si3: {telescope.si3}</Badge>
              <Badge variant={getComponentBadgeVariant(telescope.cherenkovCamera)} className="text-xs">Čerenkov: {telescope.cherenkovCamera}</Badge>
              <Badge variant={getComponentBadgeVariant(telescope.lid)} className="text-xs">Lid: {telescope.lid}</Badge>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAlarm}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Reset Alarm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTelescope}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Telescope
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Rate Chart */}
        <Card className="control-panel p-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">Data Rate</div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={telescope.data}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[800, 1200]} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pointing Error Chart */}
        <Card className="control-panel p-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">Pointing Error</div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={telescope.data}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[-1, 1]} />
                <Line type="monotone" dataKey="raError" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
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
