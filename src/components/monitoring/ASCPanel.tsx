import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

const generateASCData = (points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString(),
    allSkyCover: 30 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
    windowCover: 15 + Math.sin(i * 0.15) * 10 + Math.random() * 5,
  }));
};

export const ASCPanel = () => {
  const [ascData, setAscData] = useState(generateASCData());

  useEffect(() => {
    const interval = setInterval(() => {
      setAscData(generateASCData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = ascData[ascData.length - 1];

  return (
    <Card className="control-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          All Sky Camera (ASC)
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">All Sky Cover</div>
          <div className="text-xl font-semibold text-foreground">{latestData.allSkyCover.toFixed(1)}%</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded border border-border/50">
          <div className="text-xs text-muted-foreground">Window Cover</div>
          <div className="text-xl font-semibold text-foreground">{latestData.windowCover.toFixed(1)}%</div>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-2">Cloud Cover (%)</div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ascData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--foreground))" />
            <YAxis className="text-xs" stroke="hsl(var(--foreground))" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
            <Line type="monotone" dataKey="allSkyCover" stroke="#3b82f6" strokeWidth={2} name="All Sky Cover" dot={false} />
            <Line type="monotone" dataKey="windowCover" stroke="#8b5cf6" strokeWidth={2} name="Window Cover" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
