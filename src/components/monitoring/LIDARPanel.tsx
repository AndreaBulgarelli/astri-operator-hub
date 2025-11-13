import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Waves, Maximize2, Minimize2 } from "lucide-react";

const generateLIDARData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    atmExtinction: 0.1 + Math.sin(i * 0.15) * 0.05 + Math.random() * 0.02,
    atmTransmission: 0.85 + Math.sin(i * 0.1) * 0.05 + Math.random() * 0.03,
    dustPresence: 0.3 + Math.sin(i * 0.2) * 0.2 + Math.random() * 0.1,
  }));
};

export const LIDARPanel = () => {
  const [lidarData, setLidarData] = useState(generateLIDARData());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLidarData(generateLIDARData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = lidarData[lidarData.length - 1];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        
        <div className="pt-12">
          <Card className="control-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Waves className="h-5 w-5 text-primary" />
                LIDAR Atmospheric Monitoring
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Extinction</div>
                <div className="text-xl font-semibold text-foreground">{latestData.atmExtinction.toFixed(3)}</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Transmission</div>
                <div className="text-xl font-semibold text-foreground">{(latestData.atmTransmission * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Dust Presence</div>
                <div className="text-xl font-semibold text-foreground">{(latestData.dustPresence * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-[300px]">
                <div className="text-sm text-muted-foreground mb-2">Atmospheric Extinction & Transmission</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lidarData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="atmExtinction" stroke="#ef4444" strokeWidth={2} name="Extinction" dot={false} />
                    <Line type="monotone" dataKey="atmTransmission" stroke="#10b981" strokeWidth={2} name="Transmission" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px]">
                <div className="text-sm text-muted-foreground mb-2">Dust Presence</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lidarData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="dustPresence" stroke="#f59e0b" strokeWidth={2} name="Dust Presence" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Waves className="h-5 w-5 text-primary" />
          LIDAR Atmospheric Monitoring
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(true)}
          className="h-8 w-8 p-0"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Extinction</div>
          <div className="text-xl font-semibold text-foreground">{latestData.atmExtinction.toFixed(3)}</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Transmission</div>
          <div className="text-xl font-semibold text-foreground">{(latestData.atmTransmission * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Dust Presence</div>
          <div className="text-xl font-semibold text-foreground">{(latestData.dustPresence * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground mb-2">Atmospheric Extinction & Transmission</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lidarData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="atmExtinction" stroke="#ef4444" strokeWidth={2} name="Extinction" dot={false} />
              <Line type="monotone" dataKey="atmTransmission" stroke="#10b981" strokeWidth={2} name="Transmission" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground mb-2">Dust Presence</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lidarData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="dustPresence" stroke="#f59e0b" strokeWidth={2} name="Dust Presence" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
