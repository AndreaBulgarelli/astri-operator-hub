import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Star, Maximize2, Minimize2 } from "lucide-react";

const generateSQMData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    skyBrightness: 21.5 + Math.sin(i * 0.1) * 0.5 + Math.random() * 0.2,
    skyBrightnessRaw: 21.8 + Math.sin(i * 0.1) * 0.5 + Math.random() * 0.2,
  }));
};

export const SQMPanel = () => {
  const [sqmData, setSqmData] = useState(generateSQMData());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSqmData(generateSQMData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = sqmData[sqmData.length - 1];

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
        
        <div className="pt-12 h-full">
          <Card className="control-panel p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Sky Quality Meter (SQM)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Sky Brightness</div>
                <div className="text-xl font-semibold text-foreground">{latestData.skyBrightness.toFixed(2)} mag/arcsec²</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded border border-border/50">
                <div className="text-xs text-muted-foreground">Raw Brightness</div>
                <div className="text-xl font-semibold text-foreground">{latestData.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
              </div>
            </div>

            <div className="h-[600px]">
              <div className="text-sm text-muted-foreground mb-2">Sky Brightness (mag/arcsec²)</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sqmData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
                  <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
                </LineChart>
              </ResponsiveContainer>
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
          <Star className="h-5 w-5 text-primary" />
          Sky Quality Meter (SQM)
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
          <div className="text-xs text-muted-foreground">Sky Brightness</div>
          <div className="text-xl font-semibold text-foreground">{latestData.skyBrightness.toFixed(2)} mag/arcsec²</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Raw Brightness</div>
          <div className="text-xl font-semibold text-foreground">{latestData.skyBrightnessRaw.toFixed(2)} mag/arcsec²</div>
        </div>
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
        <div className="text-sm text-muted-foreground mb-2">Sky Brightness (mag/arcsec²)</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sqmData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
            <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[20, 23]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
            <Line type="monotone" dataKey="skyBrightness" stroke="#fbbf24" strokeWidth={2} name="Sky Brightness" dot={false} />
            <Line type="monotone" dataKey="skyBrightnessRaw" stroke="#f59e0b" strokeWidth={2} name="Raw Brightness" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
