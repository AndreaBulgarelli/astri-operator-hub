import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Waves } from "lucide-react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setLidarData(generateLIDARData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = lidarData[lidarData.length - 1];

  return (
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
        <div>
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

        <div>
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
