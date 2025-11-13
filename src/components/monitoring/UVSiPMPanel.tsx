import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Zap, Maximize2, Minimize2 } from "lucide-react";

const generateUVSiPMData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    nsbCounts: 150 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
    diffuseNsbFlux: 2.5e11 + Math.sin(i * 0.15) * 5e10 + Math.random() * 1e10,
  }));
};

export const UVSiPMPanel = () => {
  const [uvsipmData, setUvsipmData] = useState(generateUVSiPMData());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUvsipmData(generateUVSiPMData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = uvsipmData[uvsipmData.length - 1];

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
                <Zap className="h-5 w-5 text-primary" />
                UVSiPM Night Sky Background (NSB)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">NSB Counts</div>
                <div className="text-xl font-semibold text-foreground">{latestData.nsbCounts.toFixed(1)} counts/s</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Diffuse NSB Flux</div>
                <div className="text-xl font-semibold text-foreground">{(latestData.diffuseNsbFlux / 1e11).toFixed(2)}e11 ph/m²/ns/sr</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-[300px]">
                <div className="text-sm text-muted-foreground mb-2">NSB Counts (counts/s)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={uvsipmData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="nsbCounts" stroke="#8b5cf6" strokeWidth={2} name="NSB Counts" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px]">
                <div className="text-sm text-muted-foreground mb-2">Diffuse NSB Flux (×10¹¹ ph/m²/ns/sr)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={uvsipmData.map(d => ({ ...d, diffuseNsbFlux: d.diffuseNsbFlux / 1e11 }))}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                    <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="diffuseNsbFlux" stroke="#ec4899" strokeWidth={2} name="Diffuse NSB Flux" dot={false} />
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
          <Zap className="h-5 w-5 text-primary" />
          UVSiPM Night Sky Background (NSB)
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">NSB Counts</div>
          <div className="text-xl font-semibold text-foreground">{latestData.nsbCounts.toFixed(1)} counts/s</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Diffuse NSB Flux</div>
          <div className="text-xl font-semibold text-foreground">{(latestData.diffuseNsbFlux / 1e11).toFixed(2)}e11 ph/m²/ns/sr</div>
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
          <div className="text-sm text-muted-foreground mb-2">NSB Counts (counts/s)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={uvsipmData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="nsbCounts" stroke="#8b5cf6" strokeWidth={2} name="NSB Counts" dot={false} />
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
          <div className="text-sm text-muted-foreground mb-2">Diffuse NSB Flux (×10¹¹ ph/m²/ns/sr)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={uvsipmData.map(d => ({ ...d, diffuseNsbFlux: d.diffuseNsbFlux / 1e11 }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="diffuseNsbFlux" stroke="#ec4899" strokeWidth={2} name="Diffuse NSB Flux" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
