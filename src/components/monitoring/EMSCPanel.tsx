import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { CloudRain } from "lucide-react";

const generateEMSCData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    extTmp: 15 + Math.sin(i * 0.2) * 2 + Math.random() * 1,
    dewPoint: 8 + Math.sin(i * 0.15) * 1.5 + Math.random() * 0.8,
    windSpd: 15 + Math.sin(i * 0.25) * 3 + Math.random() * 2,
    wnd10Avg: 17 + Math.sin(i * 0.2) * 2.5 + Math.random() * 1.5,
    rainRate: Math.max(0, Math.sin(i * 0.3) * 2 + Math.random() * 1),
    rainDaily: 5 + i * 0.1,
    baromtr: 1015 + Math.sin(i * 0.1) * 3 + Math.random() * 1,
    extUmdy: 50 + Math.sin(i * 0.15) * 5 + Math.random() * 3,
    windGust10M: 20 + Math.sin(i * 0.3) * 4 + Math.random() * 2,
  }));
};

export const EMSCPanel = () => {
  const [emscData, setEmscData] = useState(generateEMSCData());

  useEffect(() => {
    const interval = setInterval(() => {
      setEmscData(generateEMSCData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = emscData[emscData.length - 1];

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CloudRain className="h-5 w-5 text-primary" />
          EMSC Weather Station
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Temperature</div>
          <div className="text-xl font-semibold text-foreground">{latestData.extTmp.toFixed(1)}°C</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Humidity</div>
          <div className="text-xl font-semibold text-foreground">{latestData.extUmdy.toFixed(0)}%</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Pressure</div>
          <div className="text-xl font-semibold text-foreground">{latestData.baromtr.toFixed(1)} hPa</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Wind Speed</div>
          <div className="text-xl font-semibold text-foreground">{latestData.windSpd.toFixed(1)} km/h</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Wind Gust (10m)</div>
          <div className="text-xl font-semibold text-foreground">{latestData.windGust10M.toFixed(1)} km/h</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Rain Rate</div>
          <div className="text-xl font-semibold text-foreground">{latestData.rainRate.toFixed(1)} mm/h</div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Temperature & Dew Point (°C)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="extTmp" stroke="#ef4444" strokeWidth={2} name="Temperature" dot={false} />
              <Line type="monotone" dataKey="dewPoint" stroke="#3b82f6" strokeWidth={2} name="Dew Point" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">Wind Speed (km/h)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emscData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="windSpd" stroke="#10b981" strokeWidth={2} name="Wind Speed" dot={false} />
              <Line type="monotone" dataKey="wnd10Avg" stroke="#8b5cf6" strokeWidth={2} name="10min Avg" dot={false} />
              <Line type="monotone" dataKey="windGust10M" stroke="#f59e0b" strokeWidth={2} name="Gust 10m" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
