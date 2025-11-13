import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setSqmData(generateSQMData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = sqmData[sqmData.length - 1];

  return (
    <Card className="control-panel p-6">
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

      <div>
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
