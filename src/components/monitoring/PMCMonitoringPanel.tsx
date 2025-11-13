import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Target } from "lucide-react";

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

export const PMCMonitoringPanel = () => {
  const [pmcData, setPmcData] = useState(generatePMCData());

  useEffect(() => {
    const interval = setInterval(() => {
      setPmcData(generatePMCData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = pmcData[pmcData.length - 1];

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Pointing Monitoring Camera (PMC)
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">RA Error</div>
          <div className="text-xl font-semibold text-foreground">{latestData.raError.toFixed(2)}°</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Dec Error</div>
          <div className="text-xl font-semibold text-foreground">{latestData.decError.toFixed(2)}°</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Zenith Track Err</div>
          <div className="text-xl font-semibold text-foreground">{latestData.zenithTrackErr.toFixed(2)}°</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Azimuth Track Err</div>
          <div className="text-xl font-semibold text-foreground">{latestData.azimuthTrackErr.toFixed(2)}°</div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2">RA & Dec Pointing Errors (°)</div>
          <ResponsiveContainer width="100%" height={200}>
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
          <ResponsiveContainer width="100%" height={200}>
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
  );
};
